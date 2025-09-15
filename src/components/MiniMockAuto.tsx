import React from 'react';
import MiniMock, { Question as RenderQuestion } from './MiniMock';

type BankQuestion = {
    id: string;
    topic?: string;
    questionEN: string;
    questionVI?: string;
    aEN: string; aVI?: string;
    bEN: string; bVI?: string;
    cEN: string; cVI?: string;
    dEN: string; dVI?: string;
    correct: 'A' | 'B' | 'C' | 'D';
    explanationEN?: string;
    explanationVI?: string;
    difficulty?: string;
    tags?: string[];
};

type Props = {
    storageKey: string;
    title?: string;
    /** luôn dùng EN để làm bài */
    count?: number;
    seed?: string;
    topics?: string[];
    difficulties?: string[];
    includeIds?: string[];
    excludeIds?: string[];
    includesText?: string[];
    bank?: BankQuestion[];
    src?: string; // default '/mock/Questions.json'
    /** pass checklist (StudyChecklist.storageKey) sẽ được tick khi >=80% */
    completeChecklistKeys?: string[];
};

function xmur3(str: string) {
    let h = 1779033703 ^ str.length;
    for (let i = 0; i < str.length; i++) {
        h = Math.imul(h ^ str.charCodeAt(i), 3432918353);
        h = (h << 13) | (h >>> 19);
    }
    return function () {
        h = Math.imul(h ^ (h >>> 16), 2246822507);
        h = Math.imul(h ^ (h >>> 13), 3266489909);
        return (h ^= h >>> 16) >>> 0;
    }
}
function mulberry32(a: number) {
    return function () {
        var t = a += 0x6D2B79F5;
        t = Math.imul(t ^ (t >>> 15), t | 1);
        t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
        return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    }
}
function seededSample<T>(arr: T[], n: number, seed: string): T[] {
    const seedFn = mulberry32(xmur3(seed)());
    const copy = arr.slice();
    for (let i = copy.length - 1; i > 0; i--) {
        const j = Math.floor(seedFn() * (i + 1));
        [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy.slice(0, Math.max(0, Math.min(n, copy.length)));
}

function normalize(q: BankQuestion): RenderQuestion {
    return {
        id: q.id,
        question: q.questionEN,
        options: (['A', 'B', 'C', 'D'] as const).map((k) => ({
            key: k,
            text: (q as any)[`${k.toLowerCase()}EN`],
        })),
        correct: q.correct,
        explanation: q.explanationEN,
        vi: {
            question: q.questionVI,
            options: { A: q.aVI, B: q.bVI, C: q.cVI, D: q.dVI },
            explanation: q.explanationVI,
        },
    };
}

export default function MiniMockAuto({
    storageKey,
    title = 'Mini-mock',
    count = 5,
    seed = storageKey,
    topics,
    difficulties,
    includeIds,
    excludeIds,
    includesText,
    bank,
    src = '/mock/Questions.json',
    completeChecklistKeys,
}: Props) {
    const [dataset, setDataset] = React.useState<BankQuestion[] | null>(bank || null);
    const isBrowser = typeof window !== 'undefined';

    React.useEffect(() => {
        if (bank) return;
        (async () => {
            try {
                // ưu tiên import local (nếu available)
                // @ts-ignore
                const local = (await import(/* @vite-ignore */ '@site/static/mock/Questions.json')).default;
                setDataset(local as BankQuestion[]);
                return;
            } catch { }
            if (!isBrowser) return;
            try {
                const res = await fetch(src);
                const json = await res.json();
                setDataset(json as BankQuestion[]);
            } catch (e) {
                console.error('Failed to load question bank:', e);
            }
        })();
    }, [bank, src, isBrowser]);

    const filtered = React.useMemo(() => {
        if (!dataset) return [];
        return dataset.filter((q) => {
            if (includeIds && includeIds.length && !includeIds.includes(q.id)) return false;
            if (excludeIds && excludeIds.length && excludeIds.includes(q.id)) return false;
            if (topics && topics.length && (!q.topic || !topics.includes(q.topic))) return false;
            if (difficulties && difficulties.length && (!q.difficulty || !difficulties.includes(String(q.difficulty)))) return false;
            const fieldsOK = q.questionEN && q.aEN && q.bEN && q.cEN && q.dEN;
            if (!fieldsOK) return false;
            if (includesText && includesText.length) {
                const hay = `${q.questionEN || ''} ${q.questionVI || ''}`.toLowerCase();
                const ok = includesText.some(s => hay.includes(String(s).toLowerCase()));
                if (!ok) return false;
            }
            return true;
        });
    }, [dataset, topics, difficulties, includeIds, excludeIds, includesText]);

    const selected = React.useMemo(() => {
        const picked = seededSample(filtered, count, seed);
        return picked.map(normalize);
    }, [filtered, count, seed]);

    if (!dataset) {
        return (
            <section className="mini-mock card">
                <div className="card__header"><h3>{title}</h3></div>
                <div className="card__body"><em>Loading questions…</em></div>
            </section>
        );
    }

    if (selected.length === 0) {
        return (
            <section className="mini-mock card">
                <div className="card__header"><h3>{title}</h3></div>
                <div className="card__body">
                    <div className="alert alert--warning">No questions matched the filters.</div>
                </div>
            </section>
        );
    }

    return (
        <MiniMock
            storageKey={storageKey}
            title={title}
            questions={selected}
            completeChecklistKeys={completeChecklistKeys}
            showVIOnSubmit
        />
    );
}
