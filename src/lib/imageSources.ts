import { imageRenditions } from "./imageRenditions";
import { selectImageSource } from "./imageSelection";

export const resolveImageSource = (source: string | undefined, original = false) =>
  selectImageSource(source, imageRenditions, original);