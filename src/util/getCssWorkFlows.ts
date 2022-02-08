import { FILTER_TYPES } from "../modules/FilterType";
import { WorkFlow } from "../modules/WorkFlow";

/**
 * CSS向けのワークフロー作成
 *
 * @param entryPath - エントリパス
 * @param optimize - optimize の要不要
 * @param minify - minify の要不要
 * @param format - format の要不要
 */
export const getCssWorkFlows = (
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
            filterType: FILTER_TYPES.cssOptimize,
            next: [
              {
                distPath: entryPath,
                binary: false,
                sourceMap: true,
                filterType: FILTER_TYPES.cssMinify,
                next: [],
              },
              {
                distPath: entryPath.replace(/\.css$/, ".orig.css"),
                binary: false,
                sourceMap: false,
                filterType: FILTER_TYPES.cssFormat,
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
          filterType: FILTER_TYPES.cssOptimize,
          next: [
            {
              distPath: entryPath,
              binary: false,
              sourceMap: true,
              filterType: FILTER_TYPES.cssMinify,
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
          filterType: FILTER_TYPES.cssOptimize,
          next: [
            {
              distPath: entryPath,
              binary: false,
              sourceMap: true,
              filterType: FILTER_TYPES.cssFormat,
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
        filterType: FILTER_TYPES.cssOptimize,
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
          filterType: FILTER_TYPES.cssMinify,
          next: [],
        },
        {
          distPath: entryPath.replace(/\.css$/, ".orig.css"),
          binary: false,
          sourceMap: false,
          filterType: FILTER_TYPES.cssFormat,
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
        filterType: FILTER_TYPES.cssMinify,
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
        filterType: FILTER_TYPES.cssFormat,
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
