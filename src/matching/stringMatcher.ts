import * as zod from "zod";

import { formatMessage, logger } from "../utils/logger";
import {
  ignoreSingleNames,
  isRegex,
  Matcher,
  MatchSource,
  REGEX_PREFIX,
  SourceInputMatch,
} from "./matcher";

export const StringMatcherOptionsSchema = zod.object({
  ignoreSingleNames: zod.boolean(),
  stripString: zod.string(),
});

export type StringMatcherOptions = zod.TypeOf<typeof StringMatcherOptionsSchema>;

export const StringMatcherSchema = zod.object({
  type: zod.enum(["legacy", "string"]),
  options: StringMatcherOptionsSchema,
});

export type StringMatcherType = zod.TypeOf<typeof StringMatcherSchema>;

export const DEFAULT_STRING_MATCHER: StringMatcherType = {
  type: "legacy",
  options: { ignoreSingleNames: true, stripString: "[^a-zA-Z0-9'/\\,()[\\]{}-]" },
};

export function stripStr(str: string, regexp: string): string {
  const regex = new RegExp(regexp, "gi");
  return str.trim().toLowerCase().replace(regex, "");
}

export class StringMatcher implements Matcher {
  private options: StringMatcherOptions;

  constructor(options: StringMatcherOptions) {
    this.options = options;
  }

  extractMatches<T extends MatchSource>(
    itemsToMatch: T[],
    str: string,
    getInputs: (matchSource: T) => string[],
    sortByLongestMatch?: boolean
  ): SourceInputMatch<T>[] {
    logger.verbose(`(String matcher) Filtering ${itemsToMatch.length} items using term "${str}"`);
    const cleanStr = stripStr(str, this.options.stripString);

    const matches: SourceInputMatch<T>[] = [];

    itemsToMatch.forEach((source) => {
      const inputs = getInputs(source);
      logger.silly(`(String matcher) Ignoring single names`);
      const filteredInputs = this.options.ignoreSingleNames ? ignoreSingleNames(inputs) : inputs;

      for (const input of filteredInputs) {
        if (isRegex(input)) {
          const regex = input.replace(REGEX_PREFIX, "");
          logger.silly(
            `(String matcher) Checking if "${input}" matches "${str}" (using regex: ${regex})`
          );
          const inputRegex = new RegExp(regex, "i");
          const matchResult = inputRegex.exec(str);
          if (matchResult !== null) {
            logger.silly(`(String matcher) Regex match`);
            matches.push({
              source,
              sourceId: source._id,
              matchIndex: matchResult.index,
              endMatchIndex: inputRegex.lastIndex,
            });

            // Don't look for additional input matches of the source
            return;
          }
        } else {
          const cleanInput = stripStr(input, this.options.stripString);
          logger.silly(`(String matcher) Checking if "${cleanInput} matches "${cleanStr}"`);
          const matchIndex = cleanStr.indexOf(cleanInput);
          logger.silly(`(String matcher) Substring index: ${matchIndex}`);
          if (matchIndex !== -1) {
            matches.push({
              source,
              sourceId: source._id,
              matchIndex,
              endMatchIndex: matchIndex + cleanInput.length,
            });

            // Don't look for additional input matches of the source
            return;
          }
        }
      }
    });

    if (sortByLongestMatch) {
      logger.debug(`(String matcher) Sorting results by longest match`);
      matches.sort((a, b) => b.source.name.length - a.source.name.length);
    }

    logger.verbose(`(String matcher) Matched ${matches.length} items`);
    return matches;
  }

  filterMatchingItems<T extends MatchSource>(
    itemsToMatch: T[],
    str: string,
    getInputs: (matchSource: T) => string[],
    sortByLongestMatch?: boolean
  ): T[] {
    return this.extractMatches(itemsToMatch, str, getInputs, sortByLongestMatch).map(
      (match) => match.source
    );
  }

  isMatchingItem<T extends MatchSource>(
    item: T,
    str: string,
    getInputs: (matchSource: T) => string[]
  ): boolean {
    logger.silly(`(String matcher) Checking if ${str} matches item ${formatMessage(item)}`);
    const res = this.filterMatchingItems([item], str, getInputs);
    return !!res.length;
  }
}
