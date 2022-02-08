import path from "path";

import { WorkFlow } from "../types/WorkFlow";
import { getCssWorkFlows } from "../util/getCssWorkFlows";
import { getJsWorkFlows } from "../util/getJsWorkFlows";

import { Config } from "./Config";
import { ENTRY_TYPES, EntryType, getEntryType } from "./EntryType";
import { FilterType, FILTER_TYPES } from "./FilterType";

/** クラス: エントリ */
export class Entry {
  #disabled: FilterType[];

  /** エントリ種別 */
  readonly entryType: EntryType;

  /** ソースファイルパス */
  readonly srcFilePath: string;

  /** ソースの相対パス */
  readonly entryPath: string;

  /**
   * コンストラクタ
   *
   * @param config - 設定
   * @param filePath - ソースファイルパス
   */
  constructor(config: Config, filePath: string) {
    this.#disabled = config.disabled;
    this.entryType = getEntryType(config.vendor, filePath);
    this.srcFilePath = filePath;
    this.entryPath = path.relative(config.base, filePath);
  }

  /**
   * フィルタが有効かどうか
   *
   * @param filterType - フィルタ種別
   */
  private isFilterEnabled(filterType: FilterType): boolean {
    return !this.#disabled.includes(filterType);
  }

  /** ワークフロー作成 */
  getWorkFlows(): WorkFlow[] {
    const workFlows: WorkFlow[] = [];

    switch (this.entryType) {
      case ENTRY_TYPES.vendorCss:
        workFlows.push({
          distPath: this.entryPath,
          binary: false,
          sourceMap: false,
          filterType: FILTER_TYPES.thru,
          next: [],
        });

        if (this.isFilterEnabled(FILTER_TYPES.smarty)) {
          workFlows.push({
            distPath: `${this.entryPath}.data`,
            binary: false,
            sourceMap: false,
            filterType: FILTER_TYPES.smarty,
            next: [],
          });
        }

        return workFlows;

      case ENTRY_TYPES.vendorFile:
        return [
          {
            distPath: this.entryPath,
            binary: false,
            sourceMap: false,
            filterType: FILTER_TYPES.thru,
            next: [],
          },
        ];

      case ENTRY_TYPES.sassLib:
      case ENTRY_TYPES.hbsLib:
      case ENTRY_TYPES.mjsLib:
      case ENTRY_TYPES.tsLib:
        return [];

      case ENTRY_TYPES.css:
        return getCssWorkFlows(
          this.entryPath,
          this.isFilterEnabled(FILTER_TYPES.cssOptimize),
          this.isFilterEnabled(FILTER_TYPES.cssMinify),
          this.isFilterEnabled(FILTER_TYPES.cssFormat)
        );

      case ENTRY_TYPES.sass:
        if (this.isFilterEnabled(FILTER_TYPES.sassCompile)) {
          return [
            {
              distPath: this.entryPath.replace(/\.(sass|scss)$/, ".css"),
              binary: false,
              sourceMap: true,
              filterType: FILTER_TYPES.sassCompile,
              next: getCssWorkFlows(
                this.entryPath.replace(/\.(sass|scss)$/, ".css"),
                this.isFilterEnabled(FILTER_TYPES.cssOptimize),
                this.isFilterEnabled(FILTER_TYPES.cssMinify),
                this.isFilterEnabled(FILTER_TYPES.cssFormat)
              ),
            },
          ];
        }

        return getCssWorkFlows(
          this.entryPath.replace(/\.(sass|scss)$/, ".css"),
          this.isFilterEnabled(FILTER_TYPES.cssOptimize),
          this.isFilterEnabled(FILTER_TYPES.cssMinify),
          this.isFilterEnabled(FILTER_TYPES.cssFormat)
        );

      case ENTRY_TYPES.hbs:
        if (this.isFilterEnabled(FILTER_TYPES.hbsTransform)) {
          return [
            {
              distPath: this.entryPath.replace(/\.(hbs|tpl)$/, ".html"),
              binary: false,
              sourceMap: false,
              filterType: FILTER_TYPES.hbsTransform,
              next: this.isFilterEnabled(FILTER_TYPES.htmlFormat)
                ? [
                    {
                      distPath: this.entryPath.replace(/\.hbs$/, ".html"),
                      binary: false,
                      sourceMap: false,
                      filterType: FILTER_TYPES.htmlFormat,
                      next: [],
                    },
                  ]
                : [],
            },
          ];
        }

        if (this.isFilterEnabled(FILTER_TYPES.htmlFormat)) {
          return [
            {
              distPath: this.entryPath.replace(/\.(hbs|tpl)$/, ".html"),
              binary: false,
              sourceMap: false,
              filterType: FILTER_TYPES.htmlFormat,
              next: [],
            },
          ];
        }

        return [
          {
            distPath: this.entryPath.replace(/\.(hbs|tpl)$/, ".html"),
            binary: false,
            sourceMap: false,
            filterType: FILTER_TYPES.thru,
            next: [],
          },
        ];

      case ENTRY_TYPES.html:
        if (this.isFilterEnabled(FILTER_TYPES.htmlFormat)) {
          return [
            {
              distPath: this.entryPath,
              binary: false,
              sourceMap: false,
              filterType: FILTER_TYPES.htmlFormat,
              next: [],
            },
          ];
        }

        return [
          {
            distPath: this.entryPath,
            binary: false,
            sourceMap: false,
            filterType: FILTER_TYPES.thru,
            next: [],
          },
        ];

      case ENTRY_TYPES.js:
        return getJsWorkFlows(
          this.entryPath,
          this.isFilterEnabled(FILTER_TYPES.jsOptimize),
          this.isFilterEnabled(FILTER_TYPES.jsMinify),
          this.isFilterEnabled(FILTER_TYPES.jsFormat)
        );

      case ENTRY_TYPES.mjs:
        if (this.isFilterEnabled(FILTER_TYPES.mjsBundle)) {
          return [
            {
              distPath: this.entryPath.replace(/\.mjs$/, ".js"),
              binary: false,
              sourceMap: true,
              filterType: FILTER_TYPES.mjsBundle,
              next: getJsWorkFlows(
                this.entryPath.replace(/\.mjs$/, ".js"),
                this.isFilterEnabled(FILTER_TYPES.jsOptimize),
                this.isFilterEnabled(FILTER_TYPES.jsMinify),
                this.isFilterEnabled(FILTER_TYPES.jsFormat)
              ),
            },
          ];
        }

        return getJsWorkFlows(
          this.entryPath.replace(/\.mjs$/, ".js"),
          this.isFilterEnabled(FILTER_TYPES.jsOptimize),
          this.isFilterEnabled(FILTER_TYPES.jsMinify),
          this.isFilterEnabled(FILTER_TYPES.jsFormat)
        );

      case ENTRY_TYPES.ts:
        if (this.isFilterEnabled(FILTER_TYPES.tsBundle)) {
          return [
            {
              distPath: this.entryPath.replace(/\.ts$/, ".js"),
              binary: false,
              sourceMap: true,
              filterType: FILTER_TYPES.tsBundle,
              next: getJsWorkFlows(
                this.entryPath.replace(/\.ts$/, ".js"),
                this.isFilterEnabled(FILTER_TYPES.jsOptimize),
                this.isFilterEnabled(FILTER_TYPES.jsMinify),
                this.isFilterEnabled(FILTER_TYPES.jsFormat)
              ),
            },
          ];
        }

        return getJsWorkFlows(
          this.entryPath.replace(/\.ts$/, ".js"),
          this.isFilterEnabled(FILTER_TYPES.jsOptimize),
          this.isFilterEnabled(FILTER_TYPES.jsMinify),
          this.isFilterEnabled(FILTER_TYPES.jsFormat)
        );

      case ENTRY_TYPES.jpeg:
        return [
          {
            distPath: this.entryPath,
            binary: true,
            sourceMap: false,
            filterType: this.isFilterEnabled(FILTER_TYPES.jpegOptimize)
              ? FILTER_TYPES.jpegOptimize
              : FILTER_TYPES.thru,
            next: [],
          },
        ];

      case ENTRY_TYPES.png:
        return [
          {
            distPath: this.entryPath,
            binary: true,
            sourceMap: false,
            filterType: this.isFilterEnabled(FILTER_TYPES.pngOptimize)
              ? FILTER_TYPES.pngOptimize
              : FILTER_TYPES.thru,
            next: [],
          },
        ];

      case ENTRY_TYPES.gif:
        return [
          {
            distPath: this.entryPath,
            binary: true,
            sourceMap: false,
            filterType: this.isFilterEnabled(FILTER_TYPES.gifOptimize)
              ? FILTER_TYPES.gifOptimize
              : FILTER_TYPES.thru,
            next: [],
          },
        ];

      case ENTRY_TYPES.svg:
        return [
          {
            distPath: this.entryPath,
            binary: false,
            sourceMap: false,
            filterType: this.isFilterEnabled(FILTER_TYPES.svgOptimize)
              ? FILTER_TYPES.svgOptimize
              : FILTER_TYPES.thru,
            next: [],
          },
        ];

      // case ENTRY_TYPES.file: --> thru

      default:
        return [
          {
            distPath: this.entryPath,
            binary: false,
            sourceMap: false,
            filterType: FILTER_TYPES.thru,
            next: [],
          },
        ];
    }
  }

  /** メインの出力ファイルパス取得 */
  getPrimaryDistPath(): string | undefined {
    const distPaths1: string[] = [];
    const distPaths2: string[] = [];

    const walk = (workFlowList: WorkFlow[]): void => {
      for (const workFlow of workFlowList) {
        if (workFlow.next.length === 0) {
          (workFlow.sourceMap ? distPaths1 : distPaths2).push(
            workFlow.distPath
          );
        } else {
          walk(workFlow.next);
        }
      }
    };

    walk(this.getWorkFlows());

    return (
      distPaths1[distPaths1.length - 1] ?? distPaths2[distPaths2.length - 1]
    );
  }

  /** すべての出力ファイルパス取得 */
  getDistPaths(): string[] {
    const distPaths: string[] = [];

    const walk = (workFlowList: WorkFlow[]): void => {
      for (const workFlow of workFlowList) {
        if (workFlow.next.length === 0) {
          distPaths.push(workFlow.distPath);
        } else {
          walk(workFlow.next);
        }
      }
    };

    walk(this.getWorkFlows());

    return distPaths;
  }
}
