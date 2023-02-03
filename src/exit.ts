import { logger } from "./utils/logger";

function killProcess(code = 0) {
  return () => {
    // When running tests, we want to be able to cleanup any services,
    // but we cannot overload the actual 'exit' otherwise mocha's
    // exit code will not reflect the actual result of the tests
    if (process.env.NODE_ENV !== "test") {
      logger.debug(`Closing with code ${code}`);
      process.exit(code);
    }
  };
}

export function applyExitHooks(): void {
  logger.debug("Apply exit hooks");
  process.on("exit", killProcess(0));
  process.on("SIGTERM", killProcess(0));
  process.on("SIGINT", killProcess(0));
  process.on("SIGUSR1", killProcess(0));
  process.on("SIGUSR2", killProcess(0));
  process.on("uncaughtException", (e) => {
    console.log("Uncaught Exception...");
    console.log(e.stack);
    killProcess(99)();
  });
}
