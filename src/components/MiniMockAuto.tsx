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
    /** Nếu truyền seed => chọn câu hỏi deterministic. Không truyền => random & share giữa EN/VI */
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

/* ---------------- Utils ---------------- */
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
    };
}
function mulberry32(a: number) {
    return function () {
        let t = (a += 0x6D2B79F5);
        t = Math.imul(t ^ (t >>> 15), t | 1);
        t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
        return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
}
function seededShuffle<T>(arr: T[], seed: string): T[] {
    const rnd = mulberry32(xmur3(seed)());
    const copy = arr.slice();
    for (let i = copy.length - 1; i > 0; i--) {
        const j = Math.floor(rnd() * (i + 1));
        [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
}
function cryptoShuffle<T>(arr: T[]): T[] {
    const copy = arr.slice();
    const hasCrypto = typeof window !== 'undefined' && !!(window.crypto && window.crypto.getRandomValues);
    for (let i = copy.length - 1; i > 0; i--) {
        let j: number;
        if (hasCrypto) {
            const u = new Uint32Array(1);
            window.crypto!.getRandomValues(u);
            j = u[0] % (i + 1);
        } else {
            j = Math.floor(Math.random() * (i + 1));
        }
        [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
}
function pickFirstNIds(arr: BankQuestion[], n: number): string[] {
    const k = Math.max(0, Math.min(n, arr.length));
    return arr.slice(0, k).map((q) => q.id);
}
function stableArr(a?: string[]) {
    return (a || []).slice().map(String).sort();
}
function stableKey(obj: any): string {
    const keyObj = {
        src: String(obj.src || ''),
        count: Number(obj.count || 0),
        topics: stableArr(obj.topics),
        difficulties: stableArr(obj.difficulties),
        includeIds: stableArr(obj.includeIds),
        excludeIds: stableArr(obj.excludeIds),
        includesText: stableArr(obj.includesText),
        hasInlineBank: !!obj.hasInlineBank,
    };
    const s = JSON.stringify(keyObj);
    const h = xmur3(s)();
    return `mm-auto:set:${h.toString(16)}`;
}

/* --------------- Normalizer --------------- */
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
    seed,
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

    // Load bank (ưu tiên local import)
    React.useEffect(() => {
        if (bank) return;
        (async () => {
            try {
                // ưu tiên import local (nếu available)
                // @ts-ignore
                const local = (await import(/* @vite-ignore */ '@site/static/mock/Questions.json')).default;
                setDataset(local as BankQuestion[]);
                return;
            } catch { /* fallback fetch */ }
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

    // Bộ lọc
    const filtered = React.useMemo(() => {
        if (!dataset) return [];
        return dataset.filter((q) => {
            if (includeIds && includeIds.length && !includeIds.includes(q.id)) return false;
            if (excludeIds && excludeIds.length && excludeIds.includes(q.id)) return false;
            if (topics && topics.length && (!q.topic || !topics.includes(q.topic))) return false;
            if (difficulties && difficulties.length && (!q.difficulty || !difficulties.includes(String(q.difficulty)))) return false;

            // Bắt buộc đủ EN để làm bài
            const fieldsOK = q.questionEN && q.aEN && q.bEN && q.cEN && q.dEN;
            if (!fieldsOK) return false;

            if (includesText && includesText.length) {
                const hay = `${q.questionEN || ''} ${q.questionVI || ''}`.toLowerCase();
                const ok = includesText.some((s) => hay.includes(String(s).toLowerCase()));
                if (!ok) return false;
            }
            return true;
        });
    }, [dataset, topics, difficulties, includeIds, excludeIds, includesText]);

    // Key dùng chung giữa EN/VI
    const selectionSharedKey = React.useMemo(() => {
        return stableKey({
            src,
            count,
            topics,
            difficulties,
            includeIds,
            excludeIds,
            includesText,
            hasInlineBank: !!bank,
        });
    }, [src, count, topics, difficulties, includeIds, excludeIds, includesText, bank]);

    // Hàm xoá cache set khi Reset
    const clearSelectionCache = React.useCallback(() => {
        if (!isBrowser) return;
        try { window.localStorage.removeItem(selectionSharedKey); } catch { /* noop */ }
    }, [isBrowser, selectionSharedKey]);

    // Chọn IDs
    const selectedIds = React.useMemo(() => {
        if (!filtered.length) return [];

        // Có seed => deterministic
        if (seed) {
            const shuffled = seededShuffle(filtered, seed);
            return pickFirstNIds(shuffled, count);
        }

        // Không seed => random & share giữa EN/VI
        if (!isBrowser) {
            const shuffled = cryptoShuffle(filtered);
            return pickFirstNIds(shuffled, count);
        }

        try {
            const raw = window.localStorage.getItem(selectionSharedKey);
            if (raw) {
                const cached: string[] = JSON.parse(raw);
                const idSet = new Set(filtered.map((q) => q.id));
                const valid = cached.filter((id) => idSet.has(id));
                const target = Math.min(count, filtered.length);
                if (valid.length >= target) return valid.slice(0, target);

                // Bổ sung nếu thiếu
                const missing = filtered.filter((q) => !valid.includes(q.id)).map((q) => q.id);
                const need = target - valid.length;
                const add = cryptoShuffle(missing).slice(0, need);
                const next = [...valid, ...add];
                window.localStorage.setItem(selectionSharedKey, JSON.stringify(next));
                return next;
            }

            // Chưa có cache => random và lưu
            const shuffled = cryptoShuffle(filtered);
            const ids = pickFirstNIds(shuffled, count);
            window.localStorage.setItem(selectionSharedKey, JSON.stringify(ids));
            return ids;
        } catch {
            const shuffled = cryptoShuffle(filtered);
            return pickFirstNIds(shuffled, count);
        }
    }, [filtered, count, seed, isBrowser, selectionSharedKey]);

    // Chuẩn hoá theo ID đã chọn
    const selected = React.useMemo(() => {
        if (!filtered.length || !selectedIds.length) return [];
        const byId = new Map(filtered.map((q) => [q.id, q]));
        return selectedIds.map((id) => byId.get(id)!).filter(Boolean).map(normalize);
    }, [filtered, selectedIds]);

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
            onResetAll={clearSelectionCache}
        />
    );
}
