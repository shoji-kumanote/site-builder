import { FILTER_TYPES } from "../modules/FilterType";
import { WorkFlow } from "../types/WorkFlow";

export const getHbsWorkFlows = (
  distPath: string,
  hbsTransform: boolean,
  htmlFormat: boolean
): WorkFlow[] => {
  if (hbsTransform) {
    if (htmlFormat) {
      return [
        {
          filterType: FILTER_TYPES.hbsTransform,
          next: [
            {
              filterType: FILTER_TYPES.htmlFormat,
              distPath,
            },
          ],
        },
      ];
    }

    return [
      {
        filterType: FILTER_TYPES.hbsTransform,
        distPath,
      },
    ];
  }

  if (htmlFormat) {
    return [
      {
        filterType: FILTER_TYPES.htmlFormat,
        distPath,
      },
    ];
  }

  return [];
};
