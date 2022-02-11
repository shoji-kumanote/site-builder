import { FILTER_TYPES } from "../modules/FilterType";
import { WorkFlow } from "../types/WorkFlow";

/**
 * JavaScript向けのワークフロー作成
 *
 * @param entryPath - エントリパス
 * @param jsOptimize - jsOptimize フィルタの有無
 * @param jsMinify - jsMinify フィルタの有無
 * @param jsFormat - jsFormat フィルタの有無
 */
export const getJsWorkFlows = (
  entryPath: string,
  jsOptimize: boolean,
  jsMinify: boolean,
  jsFormat: boolean
): WorkFlow[] => {
  const origDistPath = entryPath.replace(/\.js$/, ".orig.js");

  if (jsOptimize) {
    if (jsMinify) {
      if (jsFormat) {
        // all
        return [
          {
            filterType: FILTER_TYPES.jsOptimize,
            next: [
              {
                filterType: FILTER_TYPES.jsMinify,
                distPath: entryPath,
                sourceMap: true,
              },
              {
                filterType: FILTER_TYPES.jsFormat,
                distPath: origDistPath,
              },
            ],
          },
        ];
      }

      // optimize + minify
      return [
        {
          filterType: FILTER_TYPES.jsOptimize,
          next: [
            {
              filterType: FILTER_TYPES.jsMinify,
              distPath: entryPath,
              sourceMap: true,
            },
          ],
        },
      ];
    }

    if (jsFormat) {
      // optimize + format
      return [
        {
          filterType: FILTER_TYPES.jsOptimize,
          next: [
            {
              filterType: FILTER_TYPES.jsFormat,
              distPath: entryPath,
            },
          ],
        },
      ];
    }

    // optimize
    return [
      {
        distPath: entryPath,
        filterType: FILTER_TYPES.jsOptimize,
        sourceMap: true,
      },
    ];
  }

  if (jsMinify) {
    if (jsFormat) {
      // minify + format
      return [
        {
          filterType: FILTER_TYPES.jsMinify,
          distPath: entryPath,
          sourceMap: true,
        },
        {
          filterType: FILTER_TYPES.jsFormat,
          distPath: origDistPath,
        },
      ];
    }

    // minify
    return [
      {
        filterType: FILTER_TYPES.jsMinify,
        distPath: entryPath,
        sourceMap: true,
      },
    ];
  }

  if (jsFormat) {
    // format
    return [
      {
        filterType: FILTER_TYPES.jsFormat,
        distPath: entryPath,
      },
    ];
  }

  // none
  return [];
};
