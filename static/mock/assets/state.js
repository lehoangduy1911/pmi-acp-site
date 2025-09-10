import { STORAGE_KEY, DEFAULT_MIN_PER_Q } from './constants.js?v=2025-09-10-3';
import { $, debounce } from './utils.js?v=2025-09-10-3';

export const state = {
    stage: 'landing', lang: 'VI',
    questionCount: 50, questions: [], answers: {}, flags: {},
    startedAt: null, durationSec: 0, timeLeftSec: 0, timerId: null,
    currentIdx: 0, currentPage: 0, shuffle: true, shuffleAns: true,
    result: null, endedAt: null,
};

// Ghi đè toàn bộ state nhưng giữ cùng reference (tránh circular/import issues)
export function resetState(newState) {
    for (const k of Object.keys(state)) delete state[k];
    Object.assign(state, newState);
}

export function saveState() {
    try {
        const snapshot = {
            stage: state.stage, lang: state.lang,
            questionCount: state.questionCount,
            questions: state.questions, answers: state.answers, flags: state.flags,
            startedAt: state.startedAt, durationSec: state.durationSec, timeLeftSec: state.timeLeftSec,
            currentIdx: state.currentIdx, currentPage: state.currentPage,
            shuffle: state.shuffle, shuffleAns: state.shuffleAns,
            endedAt: state.endedAt || null, result: state.result || null,
            minPerQ: Number($('#min-per-q')?.value ?? DEFAULT_MIN_PER_Q[state.questionCount] ?? 1.2),
            bonusMin: Number($('#bonus-min')?.value ?? 0),
        };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(snapshot));
    } catch { }
}
export const saveStateDebounced = debounce(saveState, 300);

export function loadSaved() {
    try { const raw = localStorage.getItem(STORAGE_KEY); return raw ? JSON.parse(raw) : null; }
    catch { return null; }
}
export { STORAGE_KEY }; // nếu nơi khác cần
