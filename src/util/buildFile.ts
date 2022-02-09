import { Context } from "../modules/Context";
import { ENTRY_TYPES } from "../modules/EntryType";

import { buildEntry } from "./buildEntry";

export const buildFile = async (
  context: Context,
  filePath: string
): Promise<void> => {
  const entry = context.getEntry(filePath);

  if (entry === undefined) return;
  switch (entry.entryType) {
    case ENTRY_TYPES.hbsLib:
    case ENTRY_TYPES.mjsLib:
    case ENTRY_TYPES.sassLib:
    case ENTRY_TYPES.tsLib:
      for (const parentFilePath of context.dependency.getByDepend(filePath)) {
        // eslint-disable-next-line no-await-in-loop
        await buildFile(context, parentFilePath);
      }
      break;

    default:
      await buildEntry(context, entry);
      break;
  }
};
