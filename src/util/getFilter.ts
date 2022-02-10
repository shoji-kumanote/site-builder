import { FilterType, FILTER_TYPES } from "../modules/FilterType";
import { Filter } from "../types/Filter";

/**
 * フィルタ種別に対応するフィルタ関数取得
 *
 * @param filterType - フィルタ種別
 * @returns フィルタ
 */
export const getFilter = async (filterType: FilterType): Promise<Filter> => {
  switch (filterType) {
    case FILTER_TYPES.thru:
      return (await import("../filters/thru")).thru;

    case FILTER_TYPES.smarty:
      return (await import("../filters/smarty")).smarty;

    case FILTER_TYPES.hbsTransform:
      return (await import("../filters/hbsTransform")).hbsTransform;

    case FILTER_TYPES.htmlFormat:
      return (await import("../filters/htmlFormat")).htmlFormat;

    case FILTER_TYPES.cssOptimize:
      return (await import("../filters/cssOptimize")).cssOptimize;

    case FILTER_TYPES.cssFormat:
      return (await import("../filters/cssFormat")).cssFormat;

    case FILTER_TYPES.cssMinify:
      return (await import("../filters/cssMinify")).cssMinify;

    case FILTER_TYPES.sassCompile:
      return (await import("../filters/sassCompile")).sassCompile;

    case FILTER_TYPES.jsOptimize:
      return (await import("../filters/jsOptimize")).jsOptimize;

    case FILTER_TYPES.jsFormat:
      return (await import("../filters/jsFormat")).jsFormat;

    case FILTER_TYPES.jsMinify:
      return (await import("../filters/jsMinify")).jsMinify;

    case FILTER_TYPES.mjsBundle:
      return (await import("../filters/mjsBundle")).mjsBundle;

    case FILTER_TYPES.tsBundle:
      return (await import("../filters/tsBundle")).tsBundle;

    case FILTER_TYPES.jpegOptimize:
      return (await import("../filters/jpegOptimize")).jpegOptimize;

    case FILTER_TYPES.pngOptimize:
      return (await import("../filters/pngOptimize")).pngOptimize;

    case FILTER_TYPES.gifOptimize:
      return (await import("../filters/gifOptimize")).gifOptimize;

    case FILTER_TYPES.svgOptimize:
      return (await import("../filters/svgOptimize")).svgOptimize;

    case FILTER_TYPES.copy:
      return (await import("../filters/copy")).copy;

    default:
      return (await import("../filters/thru")).thru;
  }
};
