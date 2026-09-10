"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { checkGuess, finishTenableRound, revealAnswers } from "../actions";
import { AnswerBoard, type BoardSlot } from "@/components/tenable/answer-board";

const ROUND_SECONDS = 120;

type Phase = "ready" | "playing" | "finished";
type Feedback = { kind: "correct" | "wrong"; text: string } | null;

export function TenablePlay({
  categoryId,
  title,
  description,
  totalAnswers,
}: {
  categoryId: string;
  title: string;
  description: string | null;
  totalAnswers: number;
}) {
  const [phase, setPhase] = useState<Phase>("ready");
  const [timeLeft, setTimeLeft] = useState(ROUND_SECONDS);
  const [guess, setGuess] = useState("");
  const [slots, setSlots] = useState<BoardSlot[]>(
    Array.from({ length: totalAnswers }, () => ({ status: "empty" }))
  );
  const [foundCount, setFoundCount] = useState(0);
  const [feedback, setFeedback] = useState<Feedback>(null);
  const [isChecking, setIsChecking] = useState(false);
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved" | "not-logged-in">(
    "idle"
  );

  const inputRef = useRef<HTMLInputElement>(null);
  const foundIdsRef = useRef<string[]>([]);
  const startedAtRef = useRef<number>(0);
  const feedbackTimeoutRef = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => {
    if (phase !== "playing") return;
    const interval = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          clearInterval(interval);
          finish();
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase]);

  function start() {
    setPhase("playing");
    setTimeLeft(ROUND_SECONDS);
    setSlots(Array.from({ length: totalAnswers }, () => ({ status: "empty" })));
    setFoundCount(0);
    foundIdsRef.current = [];
    startedAtRef.current = Date.now();
    setTimeout(() => inputRef.current?.focus(), 50);
  }

  async function finish(finalScore?: number) {
    setPhase("finished");
    const elapsed = Math.round((Date.now() - startedAtRef.current) / 1000);

    // Fill in whatever's still empty with the real answers, so the
    // player sees what they missed.
    const revealed = await revealAnswers(categoryId);
    setSlots((prevSlots) => {
      const next = [...prevSlots];
      let fallbackIndex = 0;
      for (const item of revealed) {
        if (foundIdsRef.current.includes(item.id)) continue; // already shown as "found"
        const targetIndex =
          item.rank && item.rank >= 1 && item.rank <= next.length ? item.rank - 1 : -1;
        const index =
          targetIndex >= 0 && next[targetIndex].status === "empty"
            ? targetIndex
            : next.findIndex((s, i) => s.status === "empty" && i >= fallbackIndex);
        if (index >= 0) {
          next[index] = { status: "missed", answer: item.answer, flagCode: item.flagCode };
          fallbackIndex = index + 1;
        }
      }
      return next;
    });

    setSaveStatus("saving");
    const result = await finishTenableRound(
      categoryId,
      finalScore ?? foundIdsRef.current.length,
      totalAnswers,
      Math.min(elapsed, ROUND_SECONDS)
    );
    setSaveStatus(result.saved ? "saved" : "not-logged-in");
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!guess.trim() || isChecking) return;

    setIsChecking(true);
    const result = await checkGuess(categoryId, guess, foundIdsRef.current);
    setIsChecking(false);
    setGuess("");
    inputRef.current?.focus();

    clearTimeout(feedbackTimeoutRef.current);

    if (result.matched && result.id && result.answer) {
      foundIdsRef.current = [...foundIdsRef.current, result.id];
      const nextCount = foundIdsRef.current.length;
      setFoundCount(nextCount);
      setFeedback({ kind: "correct", text: result.answer });

      setSlots((prev) => {
        const next = [...prev];
        const rank = result.rank;
        const targetIndex = rank && rank >= 1 && rank <= next.length ? rank - 1 : -1;
        const index =
          targetIndex >= 0 && next[targetIndex].status === "empty"
            ? targetIndex
            : next.findIndex((s) => s.status === "empty");
        if (index >= 0) {
          next[index] = {
            status: "found",
            answer: result.answer!,
            flagCode: result.flagCode ?? null,
          };
        }
        return next;
      });

      if (nextCount >= totalAnswers) {
        finish(nextCount);
        return;
      }
    } else {
      setFeedback({ kind: "wrong", text: guess });
    }
    feedbackTimeoutRef.current = setTimeout(() => setFeedback(null), 1200);
  }

  return (
    <main className="mx-auto max-w-2xl px-6 py-16">
      <Link
        href="/games/tenable"
        className="text-sm text-muted-light dark:text-muted-dark hover:underline"
      >
        ← Categories
      </Link>
      <h1 className="mt-4 font-display text-3xl font-semibold">{title}</h1>
      {description && (
        <p className="mt-2 text-muted-light dark:text-muted-dark">{description}</p>
      )}

      {phase === "ready" && (
        <div className="surface mt-10 flex flex-col items-center gap-4 rounded-xl3 p-10 text-center">
          <p className="text-ink dark:text-paper">
            Name as many correct answers as you can in 2 minutes.
          </p>
          <p className="text-sm text-muted-light dark:text-muted-dark">
            {totalAnswers} correct answers in total
          </p>
          <button onClick={start} className="btn-primary mt-2">
            Start round
          </button>
        </div>
      )}

      {phase === "playing" && (
        <div className="mt-8">
          <div className="flex items-center justify-between">
            <span className="font-display text-2xl font-semibold tabular-nums">
              {Math.floor(timeLeft / 60)}:{String(timeLeft % 60).padStart(2, "0")}
            </span>
            <span className="text-muted-light dark:text-muted-dark">
              {foundCount} / {totalAnswers} found
            </span>
          </div>

          <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-paper-2 dark:bg-ink-2">
            <div
              className="h-full bg-lime transition-all duration-1000 ease-linear"
              style={{ width: `${(timeLeft / ROUND_SECONDS) * 100}%` }}
            />
          </div>

          <form onSubmit={handleSubmit} className="mt-6 flex gap-3">
            <input
              ref={inputRef}
              value={guess}
              onChange={(e) => setGuess(e.target.value)}
              placeholder="Type a surname…"
              autoComplete="off"
              className="input-field"
            />
            <button type="submit" className="btn-primary shrink-0" disabled={isChecking}>
              Guess
            </button>
          </form>

          {feedback && (
            <p
              className={`mt-3 text-sm font-medium ${
                feedback.kind === "correct"
                  ? "text-lime-deep dark:text-lime"
                  : "text-red-500"
              }`}
            >
              {feedback.kind === "correct" ? `Correct — ${feedback.text}` : "Not one of them"}
            </p>
          )}

          <div className="mt-6">
            <AnswerBoard slots={slots} />
          </div>

          <button
            onClick={() => finish()}
            className="mt-8 text-sm text-muted-light dark:text-muted-dark hover:underline"
          >
            End round now
          </button>
        </div>
      )}

      {phase === "finished" && (
        <div className="mt-10">
          <div className="surface flex flex-col items-center gap-2 rounded-xl3 p-8 text-center">
            <p className="font-display text-4xl font-semibold">
              {foundCount} / {totalAnswers}
            </p>
            <p className="text-muted-light dark:text-muted-dark">
              {saveStatus === "saving" && "Saving your result…"}
              {saveStatus === "saved" && "Result saved to your account."}
              {saveStatus === "not-logged-in" && (
                <>
                  <Link href="/login" className="underline">
                    Log in
                  </Link>{" "}
                  to save your results.
                </>
              )}
            </p>
            <div className="mt-2 flex gap-3">
              <button onClick={start} className="btn-primary">
                Play again
              </button>
              <Link href="/games/tenable" className="btn-secondary">
                Other categories
              </Link>
            </div>
          </div>

          <div className="mt-6">
            <AnswerBoard slots={slots} />
          </div>
        </div>
      )}
    </main>
  );
}
