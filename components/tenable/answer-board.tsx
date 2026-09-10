import { Flag } from "@/components/flag";

export type BoardSlot =
  | { status: "empty" }
  | { status: "found"; answer: string; flagCode: string | null }
  | { status: "missed"; answer: string; flagCode: string | null };

export function AnswerBoard({ slots }: { slots: BoardSlot[] }) {
  return (
    <ol className="flex flex-col gap-2">
      {slots.map((slot, i) => (
        <li
          key={i}
          className={`flex items-center gap-3 rounded-2xl border px-4 py-3 transition-colors duration-200 ${
            slot.status === "found"
              ? "border-lime/50 bg-lime/10"
              : slot.status === "missed"
                ? "border-paper-3 dark:border-ink-3 bg-transparent"
                : "border-dashed border-paper-3 dark:border-ink-3 bg-transparent"
          }`}
        >
          <span className="w-6 shrink-0 text-sm font-medium text-muted-light dark:text-muted-dark">
            {i + 1}.
          </span>

          {slot.status === "found" && (
            <>
              {slot.flagCode && <Flag code={slot.flagCode} />}
              <span className="font-medium text-ink dark:text-paper">{slot.answer}</span>
            </>
          )}

          {slot.status === "missed" && (
            <>
              {slot.flagCode && <Flag code={slot.flagCode} className="opacity-60" />}
              <span className="text-muted-light dark:text-muted-dark">{slot.answer}</span>
            </>
          )}
        </li>
      ))}
    </ol>
  );
}
