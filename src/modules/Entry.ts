import path from "path";

import { WorkFlow } from "../types/WorkFlow";
import { getCssWorkFlows } from "../util/getCssWorkFlows";
import { getHbsWorkFlows } from "../util/getHbsWorkFlows";
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
        if (this.isFilterEnabled(FILTER_TYPES.thru)) {
          workFlows.push({
            filterType: FILTER_TYPES.thru,
            distPath: this.entryPath,
          });
        }

        if (this.isFilterEnabled(FILTER_TYPES.smarty)) {
          workFlows.push({
            filterType: FILTER_TYPES.smarty,
            distPath: `${this.entryPath}.data`,
          });
        }

        return workFlows;

      case ENTRY_TYPES.vendorFile:
        if (this.isFilterEnabled(FILTER_TYPES.thru)) {
          return [
            {
              filterType: FILTER_TYPES.thru,
              distPath: this.entryPath,
            },
          ];
        }

        return [];

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
          this.isFilterEnabled(FILTER_TYPES.cssFormat),
          this.isFilterEnabled(FILTER_TYPES.smarty)
        );

      case ENTRY_TYPES.sass:
        workFlows.push(
          ...getCssWorkFlows(
            this.entryPath.replace(/\.(sass|scss)$/, ".css"),
            this.isFilterEnabled(FILTER_TYPES.cssOptimize),
            this.isFilterEnabled(FILTER_TYPES.cssMinify),
            this.isFilterEnabled(FILTER_TYPES.cssFormat),
            this.isFilterEnabled(FILTER_TYPES.smarty)
          )
        );

        return this.isFilterEnabled(FILTER_TYPES.sassCompile)
          ? [
              {
                filterType: FILTER_TYPES.sassCompile,
                next: workFlows,
              },
            ]
          : workFlows;

      case ENTRY_TYPES.hbs:
        return getHbsWorkFlows(
          this.entryPath.replace(/\.hbs$/, ".html"),
          this.isFilterEnabled(FILTER_TYPES.hbsTransform),
          this.isFilterEnabled(FILTER_TYPES.htmlFormat)
        );

      case ENTRY_TYPES.tpl:
        return getHbsWorkFlows(
          this.entryPath,
          this.isFilterEnabled(FILTER_TYPES.hbsTransform),
          false
        );

      case ENTRY_TYPES.html:
        return getHbsWorkFlows(
          this.entryPath,
          false,
          this.isFilterEnabled(FILTER_TYPES.htmlFormat)
        );

      case ENTRY_TYPES.js:
        return getJsWorkFlows(
          this.entryPath,
          this.isFilterEnabled(FILTER_TYPES.jsOptimize),
          this.isFilterEnabled(FILTER_TYPES.jsMinify),
          this.isFilterEnabled(FILTER_TYPES.jsFormat)
        );

      case ENTRY_TYPES.mjs:
        workFlows.push(
          ...getJsWorkFlows(
            this.entryPath.replace(/\.mjs$/, ".js"),
            this.isFilterEnabled(FILTER_TYPES.jsOptimize),
            this.isFilterEnabled(FILTER_TYPES.jsMinify),
            this.isFilterEnabled(FILTER_TYPES.jsFormat)
          )
        );

        return this.isFilterEnabled(FILTER_TYPES.mjsBundle)
          ? [
              {
                filterType: FILTER_TYPES.mjsBundle,
                next: workFlows,
              },
            ]
          : workFlows;

      case ENTRY_TYPES.ts:
        workFlows.push(
          ...getJsWorkFlows(
            this.entryPath.replace(/\.ts$/, ".js"),
            this.isFilterEnabled(FILTER_TYPES.jsOptimize),
            this.isFilterEnabled(FILTER_TYPES.jsMinify),
            this.isFilterEnabled(FILTER_TYPES.jsFormat)
          )
        );

        return this.isFilterEnabled(FILTER_TYPES.tsBundle)
          ? [
              {
                filterType: FILTER_TYPES.tsBundle,
                next: workFlows,
              },
            ]
          : workFlows;

      case ENTRY_TYPES.jpeg:
        return this.isFilterEnabled(FILTER_TYPES.jpegOptimize)
          ? [
              {
                filterType: FILTER_TYPES.jpegOptimize,
                distPath: this.entryPath,
                binary: true,
              },
            ]
          : [];

      case ENTRY_TYPES.png:
        return this.isFilterEnabled(FILTER_TYPES.pngOptimize)
          ? [
              {
                filterType: FILTER_TYPES.pngOptimize,
                distPath: this.entryPath,
                binary: true,
              },
            ]
          : [];

      case ENTRY_TYPES.gif:
        return this.isFilterEnabled(FILTER_TYPES.gifOptimize)
          ? [
              {
                filterType: FILTER_TYPES.gifOptimize,
                distPath: this.entryPath,
                binary: true,
              },
            ]
          : [];

      case ENTRY_TYPES.svg:
        return this.isFilterEnabled(FILTER_TYPES.svgOptimize)
          ? [
              {
                filterType: FILTER_TYPES.svgOptimize,
                distPath: this.entryPath,
              },
            ]
          : [];

      // case ENTRY_TYPES.file: --> copy

      default:
        return this.isFilterEnabled(FILTER_TYPES.copy)
          ? [
              {
                filterType: FILTER_TYPES.copy,
                distPath: this.entryPath,
                binary: true,
              },
            ]
          : [];
    }
  }

  /** メインの出力ファイルパス取得 */
  getPrimaryDistPath(): string | undefined {
    const distPaths1: string[] = [];
    const distPaths2: string[] = [];

    const walk = (workFlowList: WorkFlow[]): void => {
      for (const workFlow of workFlowList) {
        if (workFlow.distPath !== undefined) {
          (workFlow.sourceMap ? distPaths1 : distPaths2).push(
            workFlow.distPath
          );
        } else {
          walk(workFlow.next ?? []);
        }
      }
    };

    walk(this.getWorkFlows());

    return (
      distPaths1[distPaths1.length - 1] ?? distPaths2[distPaths2.length - 1]
    );
  }

  /**
   * すべての出力ファイルパス取得
   *
   * @param includeSourceMap - ソースマップを含む
   */
  getDistPaths(includeSourceMap = false): string[] {
    const distPaths: string[] = [];

    const walk = (workFlowList: WorkFlow[]): void => {
      for (const workFlow of workFlowList) {
        if (workFlow.distPath !== undefined) {
          distPaths.push(workFlow.distPath);

          if (includeSourceMap && workFlow.sourceMap) {
            distPaths.push(`${workFlow.distPath}.map`);
          }
        } else {
          walk(workFlow.next ?? []);
        }
      }
    };

    walk(this.getWorkFlows());

    return distPaths;
  }
}
