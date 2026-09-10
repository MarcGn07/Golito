import { SQUARE_FLAG_CODES } from "@/lib/flags";

export function Flag({ code, className = "" }: { code: string; className?: string }) {
  const isSquare = SQUARE_FLAG_CODES.has(code);
  return (
    <span
      className={`fi fi-${code} ${isSquare ? "fis" : ""} rounded-[3px] ${className}`}
      style={{ fontSize: "1.4em" }}
      aria-hidden="true"
    />
  );
}
