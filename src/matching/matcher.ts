import { getConfig } from "../config";
import { StringMatcher, StringMatcherOptions } from "./stringMatcher";
import { WordMatcher, WordMatcherOptions } from "./wordMatcher";

export interface MatchSource {
  _id: string;
  name: string;
}
export interface MatchResult {
  matchIndex: number;
  endMatchIndex: number;
}

export interface SourceInputMatch<T extends MatchSource> extends MatchResult {
  source: T;
  sourceId: string;
}

export type GetSourceInputs = <T extends MatchSource>(matchSource: T) => string[];

export interface Matcher {
  /**
   * Filters the matching items and returns the match objects
   *
   * @param itemsToMatch - the items to filter by matching
   * @param str - the string to match to
   * @param getInputs - callback to retrieve the strings of an item with which
   * to match against the string
   * @param sortByLongestMatch - if the longest matches (by item.name) should be at the top
   * @returns the match objects of the matched items
   */
  extractMatches: <T extends MatchSource>(
    itemsToMatch: T[],
    str: string,
    getInputs: (matchSource: T) => string[],
    sortByLongestMatch?: boolean
  ) => SourceInputMatch<T>[];

  /**
   * Filters the matching items
   *
   * @param itemsToMatch - the items to filter by matching
   * @param str - the string to match to
   * @param getInputs - callback to retrieve the strings of an item with which
   * to match against the string
   * @param sortByLongestMatch - if the longest matches (by item.name) should be at the top
   * @returns the source items that matched the string
   */
  filterMatchingItems: <T extends MatchSource>(
    itemsToMatch: T[],
    str: string,
    getInputs: (matchSource: T) => string[],
    sortByLongestMatch?: boolean
  ) => T[];

  /**
   * Verifies if the item matches a string
   *
   * @param item - the item to match
   * @param str - the string to match to
   * @param getInputs - callback to retrieve the strings of the item with which
   * to match against the string
   * @returns of the item matches the string or not
   */
  isMatchingItem: <T extends MatchSource>(
    item: T,
    str: string,
    getInputs: (matchSource: T) => string[]
  ) => boolean;
}

export const REGEX_PREFIX = "regex:";

export function isRegex(str: string): boolean {
  return str.startsWith("regex:");
}

export function getMatcher(): Matcher {
  const config = getConfig();
  const matcherType = config.matching.matcher.type;
  const matcherOptions = config.matching.matcher.options;
  return getMatcherByType(matcherType, matcherOptions);
}

export function getMatcherByType(type: string, options: unknown): Matcher {
  switch (type) {
    case "string":
      return new StringMatcher(options as StringMatcherOptions);
    case "legacy":
      return new StringMatcher(options as StringMatcherOptions);
    case "word":
      return new WordMatcher(options as WordMatcherOptions);
    default:
      throw new Error(`Could not find matcher specified by config: "${type}"`);
  }
}

export function isSingleWord(str: string): boolean {
  return str.split(" ").length === 1;
}

export function ignoreSingleNames(arr: string[]): string[] {
  return arr.filter((str) => {
    if (!str.length) {
      return false;
    }

    // Check if string is a viable name
    if (!isRegex(str)) {
      return !isSingleWord(str); // Cut it out if it's just one name
    }
    // Otherwise, it's a regex, so leave it be
    return true;
  });
}
