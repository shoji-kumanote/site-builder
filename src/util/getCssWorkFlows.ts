import { FILTER_TYPES } from "../modules/FilterType";
import { WorkFlow } from "../types/WorkFlow";

/**
 * CSS向けのワークフロー作成
 *
 * @param entryPath - エントリパス
 * @param cssOptimize - cssOptimize フィルタの有無
 * @param cssMinify - cssMinify フィルタの有無
 * @param cssFormat - cssFormat フィルタの有無
 * @param smarty - smarty フィルタの有無
 */
export const getCssWorkFlows = (
  entryPath: string,
  cssOptimize: boolean,
  cssMinify: boolean,
  cssFormat: boolean,
  smarty: boolean
): WorkFlow[] => {
  const origDistPath = entryPath.replace(/\.css$/, ".orig.css");

  if (cssOptimize) {
    if (cssMinify) {
      if (cssFormat) {
        // all
        return [
          {
            filterType: FILTER_TYPES.cssOptimize,
            next: [
              {
                filterType: FILTER_TYPES.cssMinify,
                distPath: entryPath,
                sourceMap: true,
                next: smarty
                  ? [
                      {
                        filterType: FILTER_TYPES.smarty,
                        distPath: `${entryPath}.data`,
                      },
                    ]
                  : [],
              },
              {
                filterType: FILTER_TYPES.cssFormat,
                distPath: origDistPath,
              },
            ],
          },
        ];
      }

      // optimize + minify
      return [
        {
          filterType: FILTER_TYPES.cssOptimize,
          distPath: origDistPath,
          next: [
            {
              filterType: FILTER_TYPES.cssMinify,
              distPath: entryPath,
              sourceMap: true,
              next: smarty
                ? [
                    {
                      filterType: FILTER_TYPES.smarty,
                      distPath: `${entryPath}.data`,
                    },
                  ]
                : [],
            },
          ],
        },
      ];
    }

    if (cssFormat) {
      // optimize + format
      return [
        {
          filterType: FILTER_TYPES.cssOptimize,
          next: [
            {
              filterType: FILTER_TYPES.cssFormat,
              distPath: entryPath,
              next: smarty
                ? [
                    {
                      filterType: FILTER_TYPES.smarty,
                      distPath: `${entryPath}.data`,
                    },
                  ]
                : [],
            },
          ],
        },
      ];
    }

    // optimize
    return [
      {
        filterType: FILTER_TYPES.cssOptimize,
        distPath: entryPath,
        sourceMap: true,
        next: smarty
          ? [
              {
                filterType: FILTER_TYPES.smarty,
                distPath: `${entryPath}.data`,
              },
            ]
          : [],
      },
    ];
  }

  if (cssMinify) {
    if (cssFormat) {
      // minify + format
      return [
        {
          filterType: FILTER_TYPES.cssMinify,
          distPath: entryPath,
          sourceMap: true,
          next: smarty
            ? [
                {
                  filterType: FILTER_TYPES.smarty,
                  distPath: `${entryPath}.data`,
                },
              ]
            : [],
        },
        {
          filterType: FILTER_TYPES.cssFormat,
          distPath: origDistPath,
        },
      ];
    }

    // minify
    return [
      {
        filterType: FILTER_TYPES.cssMinify,
        distPath: entryPath,
        sourceMap: true,
        next: smarty
          ? [
              {
                filterType: FILTER_TYPES.smarty,
                distPath: `${entryPath}.data`,
              },
            ]
          : [],
      },
    ];
  }

  if (cssFormat) {
    // format
    return [
      {
        filterType: FILTER_TYPES.cssFormat,
        distPath: entryPath,
        next: smarty
          ? [
              {
                filterType: FILTER_TYPES.smarty,
                distPath: `${entryPath}.data`,
              },
            ]
          : [],
      },
    ];
  }

  // none
  return [];
};
