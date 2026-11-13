import { useEffect, useImperativeHandle, useState, type MouseEvent, type Ref } from "react";
import { Check, X } from "lucide-react";
import type { QuizScene } from "@/content/story";
import type { StepHandle } from "./step-handle";

type Phase = "prompt" | "question" | "done";

/** Drop focus after a mouse click so Space / Enter keep driving the story. */
const blurIfMouse = (e: MouseEvent<HTMLButtonElement>) => {
  if (e.detail > 0) e.currentTarget.blur();
};

/**
 * A pop-up asks whether the viewer wants a challenge. "No" moves the story on;
 * "Yes" opens a short multiple-choice quiz with a score at the end.
 */
export function Quiz({ quiz, onFinish, ref }: { quiz: QuizScene; onFinish: () => void; ref?: Ref<StepHandle> }) {
  const total = quiz.questions.length;
  const [phase, setPhase] = useState<Phase>("prompt");
  const [qi, setQi] = useState(0);
  const [picked, setPicked] = useState<(number | null)[]>(() => quiz.questions.map(() => null));
  const q = quiz.questions[qi];
  const answered = picked[qi] != null;
  const score = picked.filter((p, i) => p === quiz.questions[i]?.answer).length;

  const start = () => {
    setPicked(quiz.questions.map(() => null));
    setQi(0);
    setPhase("question");
  };
  const pick = (i: number) => {
    if (answered) return;
    setPicked((prev) => prev.map((p, k) => (k === qi ? i : p)));
  };
  const nextQuestion = () => {
    if (qi + 1 < total) setQi(qi + 1);
    else setPhase("done");
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      const k = e.key.toLowerCase();
      if (phase === "prompt") {
        if (k === "y") start();
        if (k === "n") onFinish();
      } else if (phase === "question" && q && !answered) {
        const n = "1234".indexOf(k) >= 0 ? "1234".indexOf(k) : "abcd".indexOf(k);
        if (n >= 0 && n < q.options.length) pick(n);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  useImperativeHandle(ref, () => ({
    next: () => {
      if (phase === "prompt") return true; // wait for Yes / No
      if (phase === "question") {
        if (answered) nextQuestion();
        return true;
      }
      return false;
    },
    prev: () => {
      if (phase === "prompt") return false;
      if (phase === "done") {
        setPhase("question");
        setQi(total - 1);
      } else if (qi > 0) setQi(qi - 1);
      else setPhase("prompt");
      return true;
    },
  }));

  if (phase === "prompt") {
    return (
      <div data-no-advance className="quiz-popup w-full max-w-lg cursor-default" role="dialog" aria-labelledby="quiz-title">
        <div className="quiz-card px-8 py-10 text-center md:px-12">
          <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-hologram">Before you go</p>
          <h2 id="quiz-title" className="mt-3 font-display text-4xl leading-tight text-foreground md:text-5xl">
            {quiz.prompt.title}
          </h2>
          <p className="mx-auto mt-3 max-w-sm text-base text-foreground/75">{quiz.prompt.body}</p>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <button
              type="button"
              onClick={(e) => {
                blurIfMouse(e);
                start();
              }}
              className="rounded-full bg-primary px-7 py-3 text-sm font-semibold text-primary-foreground transition hover:brightness-110"
            >
              {quiz.prompt.yes}
            </button>
            <button
              type="button"
              onClick={(e) => {
                blurIfMouse(e);
                onFinish();
              }}
              className="rounded-full border border-border px-7 py-3 text-sm font-semibold text-foreground transition hover:border-primary hover:text-primary"
            >
              {quiz.prompt.no}
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (phase === "done") {
    const message =
      score === total
        ? "Perfect. The engineers would be proud."
        : score >= total - 2
          ? "Well remembered. These machines are in good hands."
          : "Every explorer starts somewhere. Their pages are always here.";
    return (
      <div data-no-advance className="quiz-popup w-full max-w-lg cursor-default" aria-live="polite">
        <div className="quiz-card px-8 py-10 text-center md:px-12">
          <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-hologram">Your score</p>
          <p className="mt-3 font-display text-7xl leading-none text-foreground">
            {score}
            <span className="text-3xl text-muted-foreground"> / {total}</span>
          </p>
          <p className="mx-auto mt-4 max-w-sm text-base text-foreground/80">{message}</p>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <button
              type="button"
              onClick={(e) => {
                blurIfMouse(e);
                onFinish();
              }}
              className="rounded-full bg-primary px-7 py-3 text-sm font-semibold text-primary-foreground transition hover:brightness-110"
            >
              Continue
            </button>
            <button
              type="button"
              onClick={(e) => {
                blurIfMouse(e);
                start();
              }}
              className="rounded-full border border-border px-7 py-3 text-sm font-semibold text-foreground transition hover:border-primary hover:text-primary"
            >
              Try again
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!q) return null;
  const choice = picked[qi];
  return (
    <div data-no-advance key={qi} className="rise w-full max-w-2xl cursor-default">
      <div className="quiz-card px-6 py-8 md:px-10 md:py-10">
        <div className="flex items-center justify-between gap-4">
          <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-hologram">
            Question {qi + 1} of {total}
          </p>
          <div className="flex gap-1.5" aria-hidden>
            {quiz.questions.map((_, i) => (
              <span
                key={i}
                className={`h-1 rounded-full transition-all ${i === qi ? "w-5 bg-primary" : i < qi ? "w-1.5 bg-foreground/50" : "w-1.5 bg-foreground/15"}`}
              />
            ))}
          </div>
        </div>
        <h2 className="mt-4 font-display text-3xl leading-tight text-foreground md:text-4xl">{q.question}</h2>
        <ul className="mt-6 grid gap-3">
          {q.options.map((opt, i) => {
            const isRight = i === q.answer;
            const isPicked = i === choice;
            const state = !answered
              ? "border-border hover:border-primary hover:bg-primary/5"
              : isRight
                ? "border-hologram bg-hologram/15"
                : isPicked
                  ? "border-destructive bg-destructive/15"
                  : "border-border opacity-50";
            return (
              <li key={i}>
                <button
                  type="button"
                  disabled={answered}
                  onClick={(e) => {
                    blurIfMouse(e);
                    pick(i);
                  }}
                  className={`flex w-full items-center gap-4 rounded-lg border px-4 py-3 text-left text-base text-foreground transition disabled:cursor-default ${state}`}
                >
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-current/30 font-mono text-xs text-muted-foreground">
                    {answered && isRight ? (
                      <Check className="h-4 w-4 text-hologram" />
                    ) : answered && isPicked ? (
                      <X className="h-4 w-4 text-destructive" />
                    ) : (
                      "ABCD"[i]
                    )}
                  </span>
                  {opt}
                </button>
              </li>
            );
          })}
        </ul>
        {answered && (
          <div className="rise mt-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between" aria-live="polite">
            <p className="text-sm leading-relaxed text-foreground/80">
              <strong className={choice === q.answer ? "text-hologram" : "text-destructive"}>
                {choice === q.answer ? "Correct. " : "Not quite. "}
              </strong>
              {q.explanation}
            </p>
            <button
              type="button"
              onClick={(e) => {
                blurIfMouse(e);
                nextQuestion();
              }}
              className="shrink-0 rounded-full bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground transition hover:brightness-110"
            >
              {qi + 1 < total ? "Next question" : "See my score"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
