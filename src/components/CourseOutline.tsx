// src/components/CourseOutline.tsx
import React from 'react';
import { parts as initialParts, Part, Lesson } from '@site/src/data/courseOutline';

const LS_KEY = 'course_progress_v1';

function useProgress() {
    const [done, setDone] = React.useState<Set<number>>(new Set());

    // Load
    React.useEffect(() => {
        if (typeof window === 'undefined') return;
        try {
            const raw = localStorage.getItem(LS_KEY);
            if (raw) setDone(new Set(JSON.parse(raw) as number[]));
        } catch { }
    }, []);

    // Save
    React.useEffect(() => {
        if (typeof window === 'undefined') return;
        localStorage.setItem(LS_KEY, JSON.stringify(Array.from(done)));
    }, [done]);

    const toggle = (id: number) =>
        setDone((prev) => {
            const next = new Set(prev);
            next.has(id) ? next.delete(id) : next.add(id);
            return next;
        });

    const isDone = (id: number) => done.has(id);

    return { done, isDone, toggle };
}

function PartCard({ part }: { part: Part }) {
    const { isDone, toggle } = useProgress();

    const total = part.lessons.length;
    const completed = part.lessons.filter((l) => isDone(l.id)).length;
    const pct = total ? Math.round((completed / total) * 100) : 0;

    return (
        <section className="vno-card" style={{ marginBottom: 16 }}>
            <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 8 }}>
                <h3 style={{ margin: 0 }}>{`Phần ${part.id}. ${part.title}`}</h3>
                <div className="text-muted" style={{ fontSize: '.9rem' }}>
                    {completed}/{total} • {pct}%
                </div>
            </header>

            {total === 0 ? (
                <p className="text-muted" style={{ marginTop: 8 }}>Đang biên soạn…</p>
            ) : (
                <ol style={{ margin: '10px 0 0', paddingLeft: 18 }}>
                    {part.lessons.map((l: Lesson) => (
                        <li key={l.id} style={{ marginBottom: 6, display: 'flex', alignItems: 'center', gap: 10 }}>
                            <input
                                type="checkbox"
                                checked={isDone(l.id)}
                                onChange={() => toggle(l.id)}
                                aria-label={`Đánh dấu hoàn thành: ${l.title}`}
                            />
                            {l.slug ? (
                                <a href={l.slug} style={{ fontWeight: 600 }}>{l.title}</a>
                            ) : (
                                <span style={{ fontWeight: 600 }}>{l.title}</span>
                            )}
                            {l.kind === 'quiz' && (
                                <span className="badge badge-emerald" style={{ marginLeft: 6 }}>Quiz</span>
                            )}
                        </li>
                    ))}
                </ol>
            )}
        </section>
    );
}

export default function CourseOutline() {
    return (
        <div className="container" style={{ marginTop: 8 }}>
            <div className="vno-card-grid">
                {initialParts.map((p) => (
                    <PartCard key={p.id} part={p} />
                ))}
            </div>
        </div>
    );
}
