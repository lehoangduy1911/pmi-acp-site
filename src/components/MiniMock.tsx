import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

type OptionKey = 'A' | 'B' | 'C' | 'D';

export type Option = { key: OptionKey; text: string };
export type Question = {
    id: string;
    question: string;              // EN question (Markdown OK)
    options: Option[];             // EN options (Markdown OK)
    correct: OptionKey;
    explanation?: string;          // EN explanation (Markdown OK)
    vi?: {
        question?: string;         // VI question (Markdown OK)
        options?: { A?: string; B?: string; C?: string; D?: string }; // Markdown OK
        explanation?: string;      // VI explanation (Markdown OK)
    };
};

type Labels = {
    score?: string; reset?: string; submit?: string; next?: string; prev?: string;
    correct?: string; incorrect?: string; why?: string; result?: string; passed?: string; failed?: string;
    saveNext?: string; answerAllNotice?: string;
};

type Props = {
    storageKey: string;
    title?: string;
    questions: Question[];
    labels?: Labels;
    /** storageKeys của StudyChecklist sẽ được tick khi pass (>=80%) */
    completeChecklistKeys?: string[];
    /** Hiện tiếng Việt chỉ sau submit */
    showVIOnSubmit?: boolean;
};

/** Helper render Markdown – KHÔNG truyền className vào ReactMarkdown (v9 đã bỏ) */
function MarkdownText({
    children,
    inline = false,
    className,
}: { children?: string; inline?: boolean; className?: string }) {
    const components: any = {
        // mở link trong tab mới
        a: (props: any) => <a {...props} target="_blank" rel="noopener noreferrer" />,
    };
    if (inline) {
        // tránh sinh <p> block-level trong label
        components.p = (props: any) => <span {...props} />;
    }
    const node = (
        <ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>
            {children || ''}
        </ReactMarkdown>
    );
    // cần class để style -> bọc bên ngoài
    return className ? <div className={className}>{node}</div> : node;
}

function completeChecklist(storageKey: string) {
    try {
        const raw = window.localStorage.getItem(storageKey);
        if (!raw) {
            window.localStorage.setItem(storageKey, JSON.stringify({ forceComplete: true, completedAt: Date.now() }));
            window.dispatchEvent(new CustomEvent('study-checklist:updated', { detail: { storageKey } }));
            return;
        }
        const data: any = JSON.parse(raw);
        if (data?.items && Array.isArray(data.items)) {
            const checked: Record<string, boolean> = {};
            for (const it of data.items) if (it?.id) checked[it.id] = true;
            data.checked = checked;
            data.progress = { total: data.items.length, done: data.items.length };
        } else if (data?.checked && typeof data.checked === 'object') {
            Object.keys(data.checked).forEach((k) => (data.checked[k] = true));
        } else if (data?.state?.items && typeof data.state.items === 'object') {
            Object.keys(data.state.items).forEach((k) => (data.state.items[k] = true));
        }
        data.forceComplete = true;
        data.completedAt = Date.now();
        window.localStorage.setItem(storageKey, JSON.stringify(data));
        window.dispatchEvent(new CustomEvent('study-checklist:updated', { detail: { storageKey } }));
    } catch { }
}

export default function MiniMock({
    storageKey,
    title = 'Mini-mock',
    questions,
    labels,
    completeChecklistKeys,
    showVIOnSubmit = true,
}: Props) {
    const L: Required<Labels> = {
        score: 'Score',
        reset: 'Reset',
        submit: 'Submit',
        next: 'Next',
        prev: 'Previous',
        correct: 'Correct',
        incorrect: 'Incorrect',
        why: 'Why',
        result: 'Result',
        passed: 'Passed',
        failed: 'Not passed',
        saveNext: 'Save & Next',
        answerAllNotice: 'Answer all questions to submit.',
        ...labels,
    } as Required<Labels>;

    const isBrowser = typeof window !== 'undefined';
    const total = questions.length;

    const [answers, setAnswers] = React.useState<Record<string, OptionKey | undefined>>({});
    const [submitted, setSubmitted] = React.useState(false);
    const [index, setIndex] = React.useState(0);

    React.useEffect(() => {
        if (!isBrowser) return;
        try {
            const raw = window.localStorage.getItem(storageKey);
            if (raw) {
                const parsed = JSON.parse(raw);
                setAnswers(parsed.answers || {});
                setSubmitted(!!parsed.submitted);
                setIndex(Math.min(parsed.index ?? 0, total - 1));
            }
        } catch { }
    }, [storageKey, isBrowser, total]);

    React.useEffect(() => {
        if (!isBrowser) return;
        try {
            window.localStorage.setItem(storageKey, JSON.stringify({ answers, submitted, index }));
        } catch { }
    }, [answers, submitted, index, storageKey, isBrowser]);

    const score = questions.reduce((acc, q) => (answers[q.id] === q.correct ? acc + 1 : acc), 0);
    const percent = Math.round((score / total) * 100);
    const totalAnswered = questions.filter((q) => !!answers[q.id]).length;
    const pctAnswered = Math.round((totalAnswered / total) * 100);
    const canSubmit = totalAnswered === total;
    const passed = percent >= 80;

    const current = questions[index];
    const selected = answers[current.id];

    const select = (k: OptionKey) => setAnswers((prev) => ({ ...prev, [current.id]: k }));
    const next = () => setIndex((i) => Math.min(i + 1, total - 1));
    const prev = () => setIndex((i) => Math.max(i - 1, 0));

    const resetAll = () => {
        setAnswers({});
        setSubmitted(false);
        setIndex(0);
        if (isBrowser) window.localStorage.removeItem(storageKey);
    };

    const onSubmit = () => {
        if (!canSubmit) return;
        setSubmitted(true);
        if (passed && completeChecklistKeys?.length) {
            completeChecklistKeys.forEach((k) => completeChecklist(k));
        }
    };

    return (
        <section className="mini-mock mm-wizard">
            <div className="mm-header">
                <h3 className="mm-title">{title}</h3>
                <div className="mm-score">
                    <strong>{L.score}:</strong> {score}/{total} ({percent}%)
                </div>
            </div>

            {/* Steps */}
            <div className="mm-steps" role="list" aria-label="Progress">
                {questions.map((q, i) => {
                    const answered = !!answers[q.id];
                    const cls = [
                        'mm-step',
                        i === index ? 'is-current' : '',
                        answered ? 'is-answered' : '',
                        submitted && answers[q.id] === q.correct ? 'is-correct' : '',
                        submitted && answers[q.id] && answers[q.id] !== q.correct ? 'is-wrong' : '',
                    ].join(' ');
                    return (
                        <button
                            key={q.id}
                            role="listitem"
                            className={cls}
                            onClick={() => setIndex(i)}
                            title={`Q${i + 1}${answered ? ' • answered' : ''}`}
                        >
                            {i + 1}
                        </button>
                    );
                })}
            </div>

            {/* Progress bar & actions */}
            <div className="mm-toolbar">
                <div className="mm-progress" aria-hidden="true">
                    <div className="mm-progress__bar" style={{ width: `${pctAnswered}%` }} />
                </div>
                <div className="mm-toolbar__btns">
                    <button className="button button--sm button--secondary" onClick={resetAll}>{L.reset}</button>
                    <button
                        className="button button--sm button--primary"
                        onClick={onSubmit}
                        disabled={!canSubmit}
                        title={!canSubmit ? L.answerAllNotice : ''}
                    >
                        {L.submit}
                    </button>
                </div>
            </div>

            {submitted && (
                <div className={`alert ${passed ? 'alert--success' : 'alert--warning'} margin-bottom--sm`}>
                    <strong>{L.result}:</strong> {passed ? L.passed : L.failed} — {score}/{total} ({percent}%)
                </div>
            )}

            {/* Question card */}
            <article key={current.id} className="mm-q card">
                <div className="mm-q__head">
                    <span className="badge badge--secondary">Q{index + 1}/{total}</span>
                    <div className="mm-q__text">
                        <MarkdownText>{current.question}</MarkdownText>
                    </div>
                </div>

                <fieldset className="mm-options" role="radiogroup" aria-label={`Question ${index + 1}`}>
                    {current.options.map((opt) => {
                        const isSelected = selected === opt.key;
                        const isCorrect = opt.key === current.correct;
                        const showCorrect = submitted && isCorrect;
                        const showWrong = submitted && isSelected && !isCorrect;
                        return (
                            <label
                                key={opt.key}
                                className={[
                                    'mm-option',
                                    isSelected ? 'is-selected' : '',
                                    showCorrect ? 'is-correct' : '',
                                    showWrong ? 'is-wrong' : '',
                                ].join(' ')}
                            >
                                <input
                                    type="radio"
                                    name={current.id}
                                    value={opt.key}
                                    checked={isSelected}
                                    onChange={() => select(opt.key)}
                                    disabled={submitted}
                                    className="mm-radio"
                                />
                                <span className="mm-letter">{opt.key}</span>
                                <span className="mm-option__text">
                                    <MarkdownText inline>{opt.text}</MarkdownText>
                                </span>
                                {showCorrect && <span className="mm-state mm-state--ok">✓</span>}
                                {showWrong && <span className="mm-state mm-state--no">✕</span>}
                            </label>
                        );
                    })}
                </fieldset>

                {/* Explanation only after submit */}
                {submitted && (
                    <div className="mm-explain alert alert--secondary">
                        <p>
                            {answers[current.id] === current.correct
                                ? `✅ ${L.correct}.`
                                : `❌ ${L.incorrect}. ${L.correct}: ${current.correct}.`}
                        </p>

                        {current.explanation && (
                            <div className="margin-top--xs">
                                <strong>{L.why}:</strong>{' '}
                                <MarkdownText inline>{current.explanation}</MarkdownText>
                            </div>
                        )}

                        {showVIOnSubmit && (current.vi?.explanation || current.vi?.question) && (
                            <div className="mm-vi">
                                <hr />
                                {current.vi?.explanation && (
                                    <p>
                                        <em>Giải thích (VI):</em>{' '}
                                        <MarkdownText inline>{current.vi.explanation}</MarkdownText>
                                    </p>
                                )}
                                {current.vi?.question && (
                                    <details>
                                        <summary>Xem bản dịch câu hỏi (VI)</summary>
                                        <div className="margin-top--xs">
                                            <MarkdownText>{current.vi.question}</MarkdownText>
                                        </div>
                                        {current.vi?.options && (
                                            <ul className="margin-top--xs">
                                                {(['A', 'B', 'C', 'D'] as OptionKey[]).map((k) => {
                                                    const t = (current.vi!.options as any)[k];
                                                    return t ? (
                                                        <li key={k}>
                                                            <strong>{k}.</strong>{' '}
                                                            <MarkdownText inline>{t}</MarkdownText>
                                                        </li>
                                                    ) : null;
                                                })}
                                            </ul>
                                        )}
                                    </details>
                                )}
                            </div>
                        )}
                    </div>
                )}

                {/* Wizard controls */}
                <div className="mm-nav">
                    <button className="button button--sm" onClick={prev} disabled={index === 0}>{L.prev}</button>
                    {!submitted && (
                        <button
                            className="button button--sm button--primary"
                            onClick={next}
                            disabled={!selected || index === total - 1}
                            title={!selected ? 'Select an answer to continue' : ''}
                        >
                            {index === total - 1 ? L.next : L.saveNext}
                        </button>
                    )}
                    {submitted && (
                        <button
                            className="button button--sm button--primary"
                            onClick={next}
                            disabled={index === total - 1}
                        >
                            {L.next}
                        </button>
                    )}
                </div>
            </article>
        </section>
    );
}
