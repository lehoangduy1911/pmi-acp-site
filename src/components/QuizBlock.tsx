import React, {useMemo, useState} from 'react';

export type QuizItem = {
  id: string;
  stem: string;
  options: string[];
  answerIndex: number; // 0-based
  rationale?: string;
};

type Props = {
  items: QuizItem[];
  shuffle?: boolean;
};

function shuffleArray<T>(arr: T[]) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default function QuizBlock({ items, shuffle = true }: Props) {
  const data = useMemo(() => (shuffle ? shuffleArray(items) : items), [items, shuffle]);
  const [answers, setAnswers] = useState<Record<string, number | null>>({});
  const [show, setShow] = useState(false);

  const score = useMemo(
    () => data.reduce((acc, q) => (answers[q.id] === q.answerIndex ? acc + 1 : acc), 0),
    [answers, data],
  );

  return (
    <div className="margin-top--md">
      {data.map((q, idx) => {
        const picked = answers[q.id];
        return (
          <div key={q.id} className="card margin-bottom--md">
            <div className="card__body">
              <div className="margin-bottom--xs text--secondary">Q{idx + 1}</div>
              <div className="margin-bottom--sm"><strong>{q.stem}</strong></div>
              <div className="margin-bottom--sm">
                {q.options.map((opt, i) => {
                  const isPicked = picked === i;
                  const isCorrect = show && i === q.answerIndex;
                  const isWrongPick = show && isPicked && i !== q.answerIndex;
                  const className = [
                    "padding--sm",
                    "margin-bottom--xs",
                    "rounded",
                    "cursor--pointer",
                    "border",
                    isPicked ? "alert alert--secondary" : "",
                    isCorrect ? "alert alert--success" : "",
                    isWrongPick ? "alert alert--danger" : "",
                  ].join(" ");
                  return (
                    <label key={i} className={className} style={{display:'block'}}>
                      <input
                        type="radio"
                        name={q.id}
                        className="margin-right--sm"
                        checked={isPicked === i}
                        onChange={() => setAnswers(a => ({ ...a, [q.id]: i }))}
                      />
                      {opt}
                    </label>
                  );
                })}
              </div>
              {show && q.rationale && (
                <div className="alert alert--info">
                  <strong>Rationale:</strong> {q.rationale}
                </div>
              )}
            </div>
          </div>
        );
      })}

      <div className="margin-top--sm" style={{display:'flex', gap: '0.5rem', alignItems:'center'}}>
        <button className="button button--primary" onClick={() => setShow(true)}>Chấm điểm / Show answers</button>
        <button className="button button--secondary button--outline" onClick={() => { setAnswers({}); setShow(false); }}>Làm lại / Reset</button>
        {show && <span className="badge badge--primary">Điểm / Score: {score} / {data.length}</span>}
      </div>
    </div>
  );
}
