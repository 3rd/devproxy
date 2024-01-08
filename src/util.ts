import { lstatSync } from "fs";

export const canAccessFile = (path: string) => {
  try {
    return lstatSync(path).isFile();
  } catch {
    return false;
  }
};
