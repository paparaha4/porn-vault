import Axios from "axios";
import boxen from "boxen";
import { readFileSync } from "fs";

import { createVault, Vault } from "./app";
import argv from "./args";
import { createBackup } from "./backup";
import {
  exitIzzy,
  izzyHasMinVersion,
  izzyProcess,
  izzyVersion,
  minIzzyVersion,
  spawnIzzy,
} from "./binaries/izzy";
import { getConfig, watchConfig } from "./config";
import { loadStores } from "./database";
import { tryStartProcessing } from "./queue/processing";
import { scanFolders, scheduleNextScan } from "./scanner";
import { ensureIndices } from "./search";
import { protocol } from "./utils/http";
import { handleError, logger } from "./utils/logger";
import VERSION from "./version";

export default async (): Promise<Vault> => {
  logger.info("Check https://github.com/porn-vault/porn-vault for discussion & updates");

  const config = getConfig();
  const port = config.server.port || 3000;
  const vault = await createVault();

  if (config.server.https.enable) {
    if (!config.server.https.key || !config.server.https.certificate) {
      logger.error("Missing HTTPS key or certificate");
      process.exit(1);
    }

    const httpsOpts = {
      key: readFileSync(config.server.https.key),
      cert: readFileSync(config.server.https.certificate),
    };

    await vault.startServer(port, httpsOpts);
    logger.info(`HTTPS Server running on port ${port}`);
  } else {
    await vault.startServer(port);
    logger.info(`Server running on port ${port}`);
  }

  try {
    vault.setupMessage = "Pinging Elasticsearch...";
    await Axios.get(config.search.host);
  } catch (error) {
    handleError(
      `Error pinging Elasticsearch @ ${config.search.host}, please make sure Elasticsearch is running at the given URL`,
      error,
      true
    );
  }

  logger.info("Loading database");
  vault.setupMessage = "Loading database...";

  async function checkIzzyVersion() {
    if (!(await izzyHasMinVersion())) {
      logger.error(`Izzy does not satisfy min version: ${minIzzyVersion}`);
      logger.info(
        "Use --update-izzy, delete izzy(.exe) and restart or download manually from https://github.com/boi123212321/izzy/releases"
      );
      logger.debug("Killing izzy...");
      izzyProcess.kill();
      process.exit(1);
    }
  }

  if (await izzyVersion()) {
    await checkIzzyVersion();
    logger.info(`Izzy already running (on port ${config.binaries.izzyPort})...`);
    if (argv["reset-izzy"]) {
      logger.warn("Resetting izzy...");
      await exitIzzy();
      await spawnIzzy();
    } else {
      logger.warn("Using existing Izzy process, will not be able to detect a crash");
    }
  } else {
    await spawnIzzy();
  }
  await checkIzzyVersion();

  if (config.persistence.backup.enable === true) {
    vault.setupMessage = "Creating backup...";
    try {
      await createBackup(config.persistence.backup.maxAmount || 10);
    } catch (error) {
      handleError("Backup error", error);
    }
  }

  try {
    await loadStores();
  } catch (error) {
    handleError(
      `Error while loading database, try restarting; if the error persists, your database may be corrupted`,
      error,
      true
    );
  }

  try {
    logger.info("Loading search engine");
    vault.setupMessage = "Loading search engine...";
    await ensureIndices(argv.reindex || false);
  } catch (error) {
    handleError(`Error while loading search engine`, error, true);
  }

  watchConfig();

  if (config.scan.scanOnStartup) {
    // Scan and auto schedule next scans
    scanFolders(config.scan.interval).catch((err: Error) => {
      handleError("Scan error: ", err);
    });
  } else {
    // Only schedule next scans
    scheduleNextScan(config.scan.interval);

    logger.warn("Scanning folders is currently disabled.");
    tryStartProcessing().catch((err: Error) => {
      handleError("Couldn't start processing: ", err);
    });
  }

  vault.serverReady = true;

  logger.info(
    boxen(`PORN VAULT ${VERSION} READY\nOpen ${protocol(config)}://localhost:${port}/`, {
      padding: 1,
      margin: 1,
    })
  );

  return vault;
};
