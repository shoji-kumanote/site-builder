import { FILTER_TYPES } from "../modules/FilterType";
import { WorkFlow } from "../types/WorkFlow";

/**
 * JavaScript向けのワークフロー作成
 *
 * @param entryPath - エントリパス
 * @param optimize - optimize の要不要
 * @param minify - minify の要不要
 * @param format - format の要不要
 */
export const getJsWorkFlows = (
  entryPath: string,
  optimize: boolean,
  minify: boolean,
  format: boolean
): WorkFlow[] => {
  if (optimize) {
    if (minify) {
      if (format) {
        // all
        return [
          {
            distPath: entryPath,
            binary: false,
            sourceMap: true,
            filterType: FILTER_TYPES.jsOptimize,
            next: [
              {
                distPath: entryPath,
                binary: false,
                sourceMap: true,
                filterType: FILTER_TYPES.jsMinify,
                next: [],
              },
              {
                distPath: entryPath.replace(/\.js$/, ".orig.js"),
                binary: false,
                sourceMap: false,
                filterType: FILTER_TYPES.jsFormat,
                next: [],
              },
            ],
          },
        ];
      }

      // optimize + minify
      return [
        {
          distPath: entryPath,
          binary: false,
          sourceMap: true,
          filterType: FILTER_TYPES.jsOptimize,
          next: [
            {
              distPath: entryPath,
              binary: false,
              sourceMap: true,
              filterType: FILTER_TYPES.jsMinify,
              next: [],
            },
          ],
        },
      ];
    }

    if (format) {
      // optimize + format
      return [
        {
          distPath: entryPath,
          binary: false,
          sourceMap: true,
          filterType: FILTER_TYPES.jsOptimize,
          next: [
            {
              distPath: entryPath,
              binary: false,
              sourceMap: true,
              filterType: FILTER_TYPES.jsFormat,
              next: [],
            },
          ],
        },
      ];
    }

    // optimize
    return [
      {
        distPath: entryPath,
        binary: false,
        sourceMap: true,
        filterType: FILTER_TYPES.jsOptimize,
        next: [],
      },
    ];
  }

  if (minify) {
    if (format) {
      // minify + format
      return [
        {
          distPath: entryPath,
          binary: false,
          sourceMap: true,
          filterType: FILTER_TYPES.jsMinify,
          next: [],
        },
        {
          distPath: entryPath.replace(/\.js$/, ".orig.js"),
          binary: false,
          sourceMap: false,
          filterType: FILTER_TYPES.jsFormat,
          next: [],
        },
      ];
    }

    // minify
    return [
      {
        distPath: entryPath,
        binary: false,
        sourceMap: true,
        filterType: FILTER_TYPES.jsMinify,
        next: [],
      },
    ];
  }

  if (format) {
    // format
    return [
      {
        distPath: entryPath,
        binary: false,
        sourceMap: true,
        filterType: FILTER_TYPES.jsFormat,
        next: [],
      },
    ];
  }

  // thru
  return [
    {
      distPath: entryPath,
      binary: false,
      sourceMap: true,
      filterType: FILTER_TYPES.thru,
      next: [],
    },
  ];
};
