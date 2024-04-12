export type ExportTypes = "image" | "json" | "svg" | "";
export type PoolType =
  | "editor"
  | "template"
  | "material"
  | "text"
  | "image"
  | "illustration"
  | "layer"
  | "code"
  | "toolkit"
  | "help";
export type SystemFont = {
  label: string;
  value: string;
};

export interface PathPoint {
  X: number;
  Y: number;
}
