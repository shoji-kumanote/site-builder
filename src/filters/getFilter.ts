import { Filter } from "../modules/Filter";
import { FilterType, FILTER_TYPES } from "../modules/FilterType";

/**
 * フィルタ種別に対応するフィルタ関数取得
 *
 * @param filterType - フィルタ種別
 * @returns フィルタ
 */
export const getFilter = async (filterType: FilterType): Promise<Filter> => {
  switch (filterType) {
    case FILTER_TYPES.thru:
      return (await import("./thru")).thru;

    case FILTER_TYPES.smarty:
      return (await import("./smarty")).smarty;

    case FILTER_TYPES.hbsTransform:
      return (await import("./hbsTransform")).hbsTransform;

    case FILTER_TYPES.htmlFormat:
      return (await import("./htmlFormat")).htmlFormat;

    case FILTER_TYPES.cssOptimize:
      return (await import("./cssOptimize")).cssOptimize;

    case FILTER_TYPES.cssFormat:
      return (await import("./cssFormat")).cssFormat;

    case FILTER_TYPES.cssMinify:
      return (await import("./cssMinify")).cssMinify;

    case FILTER_TYPES.sassCompile:
      return (await import("./sassCompile")).sassCompile;

    case FILTER_TYPES.jsOptimize:
      return (await import("./jsOptimize")).jsOptimize;

    case FILTER_TYPES.jsFormat:
      return (await import("./jsFormat")).jsFormat;

    case FILTER_TYPES.jsMinify:
      return (await import("./jsMinify")).jsMinify;

    case FILTER_TYPES.mjsBundle:
      return (await import("./mjsBundle")).mjsBundle;

    case FILTER_TYPES.tsBundle:
      return (await import("./tsBundle")).tsBundle;

    case FILTER_TYPES.jpegOptimize:
      return (await import("./jpegOptimize")).jpegOptimize;

    case FILTER_TYPES.pngOptimize:
      return (await import("./pngOptimize")).pngOptimize;

    case FILTER_TYPES.gifOptimize:
      return (await import("./gifOptimize")).gifOptimize;

    case FILTER_TYPES.svgOptimize:
      return (await import("./svgOptimize")).svgOptimize;

    default:
      return (await import("./thru")).thru;
  }
};
