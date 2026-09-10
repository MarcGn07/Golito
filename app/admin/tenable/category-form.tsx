import { PlayerAnswerRow } from "@/components/player-answer-row";

export interface AnswerInitial {
  answer: string;
  flagCode: string | null;
}

export function CategoryForm({
  action,
  initialTitle = "",
  initialDescription = "",
  initialAnswers = [],
  submitLabel = "Save category",
}: {
  action: (formData: FormData) => void;
  initialTitle?: string;
  initialDescription?: string;
  initialAnswers?: AnswerInitial[];
  submitLabel?: string;
}) {
  return (
    <form action={action} className="surface flex flex-col gap-4 rounded-xl3 p-6">
      <div>
        <label htmlFor="title" className="mb-1.5 block text-sm font-medium">
          Category title
        </label>
        <input
          id="title"
          name="title"
          required
          defaultValue={initialTitle}
          placeholder="e.g. All-time top goalscorers at the World Cup"
          className="input-field"
        />
      </div>
      <div>
        <label htmlFor="description" className="mb-1.5 block text-sm font-medium">
          Description (optional)
        </label>
        <input
          id="description"
          name="description"
          defaultValue={initialDescription}
          placeholder="Extra context shown to players"
          className="input-field"
        />
      </div>

      <div>
        <p className="mb-1.5 text-sm font-medium">
          Answers, in rank order (1 = highest). Search picks the flag for you —
          you can still override it, or type a name that isn't in the database.
        </p>
        <div className="flex flex-col gap-2">
          {Array.from({ length: 10 }, (_, i) => (
            <div key={i} className="flex items-center gap-2">
              <span className="w-5 shrink-0 text-sm text-muted-light dark:text-muted-dark">
                {i + 1}
              </span>
              <PlayerAnswerRow
                answerFieldName={`answer_${i + 1}`}
                flagFieldName={`flag_${i + 1}`}
                initialAnswer={initialAnswers[i]?.answer ?? ""}
                initialFlagCode={initialAnswers[i]?.flagCode ?? null}
              />
            </div>
          ))}
        </div>
      </div>

      <button type="submit" className="btn-primary mt-2 self-start">
        {submitLabel}
      </button>
    </form>
  );
}
