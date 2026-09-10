import {
  UEFA_FLAGS,
  CONMEBOL_FLAGS,
  CONCACAF_FLAGS,
  CAF_FLAGS,
  AFC_FLAGS,
  OFC_FLAGS,
} from "@/lib/flags";

const FLAG_GROUPS: { label: string; options: { code: string; name: string }[] }[] = [
  { label: "UEFA", options: UEFA_FLAGS },
  { label: "CONMEBOL", options: CONMEBOL_FLAGS },
  { label: "CONCACAF", options: CONCACAF_FLAGS },
  { label: "CAF", options: CAF_FLAGS },
  { label: "AFC", options: AFC_FLAGS },
  { label: "OFC", options: OFC_FLAGS.filter((f) => f.code !== "tg2") },
];

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
          placeholder="e.g. Teammates of Thomas Müller"
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
          Answers, in rank order (1 = highest). A flag is optional.
        </p>
        <div className="flex flex-col gap-2">
          {Array.from({ length: 10 }, (_, i) => (
            <div key={i} className="flex items-center gap-2">
              <span className="w-5 shrink-0 text-sm text-muted-light dark:text-muted-dark">
                {i + 1}
              </span>
              <input
                name={`answer_${i + 1}`}
                defaultValue={initialAnswers[i]?.answer ?? ""}
                placeholder={`Answer ${i + 1}`}
                className="input-field"
              />
              <select
                name={`flag_${i + 1}`}
                defaultValue={initialAnswers[i]?.flagCode ?? ""}
                className="input-field w-40 shrink-0"
              >
                <option value="">No flag</option>
                {FLAG_GROUPS.map((group) => (
                  <optgroup key={group.label} label={group.label}>
                    {group.options.map((f) => (
                      <option key={f.code} value={f.code}>
                        {f.name}
                      </option>
                    ))}
                  </optgroup>
                ))}
              </select>
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
