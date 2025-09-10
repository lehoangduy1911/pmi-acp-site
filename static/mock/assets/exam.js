import { TPL } from './templates.js';
import { $, $$, shuffleArray, fmtHMS, hold, toast, diffClass, shortTopic } from './utils.js';
import { LABELS, PAGE_SIZE } from './constants.js';
import { state, resetState, saveState, saveStateDebounced } from './state.js';
import { renderResults } from './results.js';

/* ------------ Helpers (local) ------------ */
function diffLabel(d) {
    const s = String(d || '').trim().toLowerCase();
    if (['very hard', 'very-hard', 'vhard', 'hardest', 'expert'].includes(s)) return 'VERY HARD';
    if (['hard', 'h'].includes(s)) return 'HARD';
    if (['medium', 'med', 'm'].includes(s)) return 'MEDIUM';
    if (['easy', 'e'].includes(s)) return 'EASY';
    return (String(d || 'N/A')).toUpperCase();
}

/* ---- Start exam (fetch, shuffle, state) ---- */
export async function startExam({ questionCount, lang, minPerQ, bonusMin, shuffle, shuffleAns }) {
    // ✅ Tạo URL tuyệt đối tới Questions.json dựa trên vị trí module này
    const QUESTIONS_URL = new URL('../Questions.json', import.meta.url).href + '?v=' + Date.now();

    const all = await fetch(QUESTIONS_URL).then(r => {
        if (!r.ok) throw new Error('Không tải được Questions.json (' + r.status + ').');
        return r.json();
    });

    let pool = Array.isArray(all) ? all.slice() : [];
    if (!pool.length) throw new Error('Questions.json rỗng hoặc sai định dạng.');

    if (shuffle) shuffleArray(pool);
    const selected = pool.slice(0, questionCount).filter(Boolean).map(q => materializeQuestion(q, shuffleAns));

    const durationSec = Math.round(questionCount * minPerQ * 60 + bonusMin * 60);
    resetState({
        stage: 'exam', lang, questionCount,
        questions: selected, answers: {}, flags: {},
        startedAt: Date.now(),
        durationSec, timeLeftSec: durationSec,
        timerId: null, currentIdx: 0, currentPage: 0,
        shuffle, shuffleAns, result: null, endedAt: null,
    });
    saveState();
    renderExam();
    startTimer();
    toast('Chúc may mắn! 🔥');
}

function materializeQuestion(q, shuffleAns) {
    const optList = [
        { vi: q.aVI ?? q.aVi ?? q.a_vi ?? q.a, en: q.aEN ?? q.aEn ?? q.a_en ?? q.a, orig: 'A' },
        { vi: q.bVI ?? q.bVi ?? q.b_vi ?? q.b, en: q.bEN ?? q.bEn ?? q.b_en ?? q.b, orig: 'B' },
        { vi: q.cVI ?? q.cVi ?? q.c_vi ?? q.c, en: q.cEN ?? q.cEn ?? q.c_en ?? q.c, orig: 'C' },
        { vi: q.dVI ?? q.dVi ?? q.d_vi ?? q.d, en: q.dEN ?? q.dEn ?? q.d_en ?? q.d, orig: 'D' },
    ];
    const arr = optList.slice();
    if (shuffleAns) shuffleArray(arr);
    const correctOrig = String(q.correct || '').toUpperCase();
    const correctIndex = Math.max(0, arr.findIndex(o => o.orig === correctOrig));
    return {
        ...q,
        questionVI: q.questionVI ?? q.questionVi ?? q.question_vi ?? q.question,
        questionEN: q.questionEN ?? q.questionEn ?? q.question_en ?? q.question,
        explanationVI: q.explanationVI ?? q.explanationVi ?? q.explanation_vi ?? q.explanation,
        explanationEN: q.explanationEN ?? q.explanationEn ?? q.explanation_en ?? q.explanation,
        _opts: arr,
        _correctIndex: correctIndex,
    };
}

/* ---- Render exam screen ---- */
export function renderExam() {
    const app = $('#app');
    app.innerHTML = TPL.exam;

    // Topbar chips
    const topbar = document.querySelector('.sticky .max-w-6xl');
    const anchor = topbar.querySelector('.flex-1');
    const chipA = document.createElement('span'); chipA.id = 'chip-answered'; chipA.className = 'chip chip-gray'; chipA.textContent = 'Đã làm 0';
    const chipU = document.createElement('span'); chipU.id = 'chip-unanswered'; chipU.className = 'chip chip-gray'; chipU.textContent = 'Chưa 0';
    const chipF = document.createElement('span'); chipF.id = 'chip-flagged'; chipF.className = 'chip chip-gray'; chipF.textContent = 'Đánh dấu 0';
    topbar.insertBefore(chipA, anchor); topbar.insertBefore(chipU, anchor); topbar.insertBefore(chipF, anchor);

    // Controls
    $('#btn-switch-lang').addEventListener('click', (e) => hold(e.currentTarget, () => {
        state.lang = state.lang === 'VI' ? 'EN' : 'VI';
        saveStateDebounced(); renderQuestionList();
    }));
    $('#btn-submit').addEventListener('click', (e) => hold(e.currentTarget, submitExamConfirm));
    $('#btn-prev').addEventListener('click', (e) => hold(e.currentTarget, () => jumpTo(state.currentIdx - 1)));
    $('#btn-next').addEventListener('click', (e) => hold(e.currentTarget, () => jumpTo(state.currentIdx + 1)));
    $('#btn-prev-page').addEventListener('click', (e) => hold(e.currentTarget, () => jumpPage(state.currentPage - 1)));
    $('#btn-next-page').addEventListener('click', (e) => hold(e.currentTarget, () => jumpPage(state.currentPage + 1)));
    $('#btn-nav').addEventListener('click', (e) => hold(e.currentTarget, openOverlay));
    $('#overlay').addEventListener('click', (e) => { if (e.target.hasAttribute('data-close-overlay')) closeOverlay(); });
    $('#btn-filter-unanswered').addEventListener('click', (e) => hold(e.currentTarget, () => renderNavigator(true)));

    window.addEventListener('keydown', onKey);

    renderQuestionList();
    renderNavigator(false);
    updateProgressUi();
    updateTimerUi();
    updatePageIndicator();
    setTimeout(() => jumpTo(0, false), 50);
}

/* Render 10 câu / trang */
export function renderQuestionList() {
    const wrap = $('#exam-body');
    wrap.innerHTML = '';

    const start = state.currentPage * PAGE_SIZE;
    const end = Math.min(state.questionCount, start + PAGE_SIZE);

    for (let idx = start; idx < end; idx++) {
        const q = state.questions[idx];

        const card = document.createElement('article');
        card.className = 'p-4 rounded-2xl bg-white shadow border';
        card.id = 'q-' + idx;

        const head = document.createElement('div');
        head.className = 'flex items-start justify-between gap-2';
        const title = document.createElement('div'); title.className = 'flex items-start gap-2';
        const num = document.createElement('div'); num.className = 'text-sm font-semibold text-slate-600 mt-0.5'; num.textContent = `${idx + 1}.`;
        const text = document.createElement('div'); text.className = 'font-medium'; text.textContent = state.lang === 'VI' ? q.questionVI : q.questionEN;
        title.append(num, text);

        // Chips: domain rút gọn + heat-map difficulty + flag
        const right = document.createElement('div'); right.className = 'flex items-center gap-2 flex-wrap';

        const topic = document.createElement('span');
        topic.className = 'chip chip-gray chip-topic';
        topic.title = q.topic || 'Topic';
        topic.textContent = shortTopic(q.topic);

        const diff = document.createElement('span');
        diff.className = diffClass(q.difficulty);
        diff.textContent = diffLabel(q.difficulty);

        const flagBtn = document.createElement('button'); flagBtn.type = 'button'; flagBtn.className = 'chip chip-gray chip-flag';
        flagBtn.innerHTML = state.flags[idx] ? '★ Đã đánh dấu' : '☆ Đánh dấu';
        flagBtn.addEventListener('click', (ev) => hold(ev.currentTarget, () => {
            state.flags[idx] = !state.flags[idx];
            flagBtn.innerHTML = state.flags[idx] ? '★ Đã đánh dấu' : '☆ Đánh dấu';
            saveStateDebounced(); renderNavigator(false); updateProgressUi();
        }));

        right.append(topic, diff, flagBtn);
        head.append(title, right);

        // Options
        const opts = document.createElement('div'); opts.className = 'mt-3 grid grid-cols-1 gap-2';
        q._opts.forEach((opt, i) => {
            const wrapLabel = document.createElement('label'); wrapLabel.className = 'block';
            const input = document.createElement('input'); input.type = 'radio'; input.name = 'q_' + idx; input.value = String(i); input.className = 'peer sr-only';
            input.checked = Number(state.answers[idx]) === i;
            input.addEventListener('change', () => {
                state.answers[idx] = i;
                updateProgressUi(); saveStateDebounced(); renderNavigator(false);
            });
            const box = document.createElement('div'); box.className = 'flex items-start gap-3 p-3 border rounded-xl transition peer-checked:border-indigo-500 peer-checked:bg-indigo-50';
            const chip = document.createElement('span'); chip.className = 'mt-0.5 inline-flex items-center justify-center w-6 h-6 rounded-md border text-sm font-semibold'; chip.textContent = LABELS[i];
            const txt = document.createElement('div'); txt.textContent = (state.lang === 'VI' ? opt.vi : opt.en) ?? '';
            box.append(chip, txt);
            wrapLabel.append(input, box);
            opts.append(wrapLabel);
        });

        card.append(head, opts);
        wrap.append(card);
    }
    updatePageIndicator();
}

/* Navigator + overlay */
export function openOverlay() { $('#overlay').classList.remove('hidden'); renderNavigator(false); }
export function closeOverlay() { $('#overlay').classList.add('hidden'); }
export function renderNavigator(onlyUnanswered) {
    const grid = $('#grid-nav'); grid.innerHTML = '';
    state.questions.forEach((_, i) => {
        const answered = state.answers[i] !== undefined && state.answers[i] !== null;
        if (onlyUnanswered && answered) return;
        const btn = document.createElement('button');
        btn.className = 'num-pill ' + (state.flags[i] ? 'num-flag' : (answered ? 'num-answered' : 'num-empty'));
        btn.textContent = i + 1;
        btn.addEventListener('click', () => { jumpTo(i); closeOverlay(); });
        grid.append(btn);
    });
}

/* Navigation, hotkeys */
export function jumpTo(i, smooth = true) {
    i = Math.max(0, Math.min(state.questionCount - 1, i));
    const targetPage = Math.floor(i / PAGE_SIZE);
    if (targetPage !== state.currentPage) {
        state.currentPage = targetPage; renderQuestionList();
    }
    state.currentIdx = i;
    const el = document.getElementById('q-' + i);
    if (el) el.scrollIntoView({ behavior: smooth ? 'smooth' : 'auto', block: 'start' });
}
export function jumpPage(p) {
    const totalPages = Math.ceil(state.questionCount / PAGE_SIZE);
    p = Math.max(0, Math.min(totalPages - 1, p));
    if (p === state.currentPage) return;
    state.currentPage = p; state.currentIdx = p * PAGE_SIZE;
    renderQuestionList(); window.scrollTo({ top: 0, behavior: 'smooth' });
}
export function onKey(e) {
    const k = e.key.toLowerCase();
    if (['arrowright', 'k'].includes(k)) { e.preventDefault(); return jumpTo(state.currentIdx + 1); }
    if (['arrowleft', 'j'].includes(k)) { e.preventDefault(); return jumpTo(state.currentIdx - 1); }
    if (k === 'f') { state.flags[state.currentIdx] = !state.flags[state.currentIdx]; saveStateDebounced(); renderNavigator(false); updateProgressUi(); }
    if (['1', '2', '3', '4'].includes(k)) {
        const idx = Number(k) - 1; state.answers[state.currentIdx] = idx;
        const inp = document.querySelector(`input[name="q_${state.currentIdx}"][value="${idx}"]`);
        if (inp) inp.checked = true; updateProgressUi(); saveStateDebounced(); renderNavigator(false);
    }
}

/* Progress + timer */
export function updateProgressUi() {
    const total = Number(state.questionCount) || 0;
    const answered = Object.keys(state.answers).filter(k => state.answers[k] !== null && state.answers[k] !== undefined).length;
    const flagged = Object.keys(state.flags).filter(k => !!state.flags[k]).length;
    const unanswered = Math.max(0, total - answered);

    $('#progress').textContent = `${answered}/${total}`;
    const pct = total ? Math.round((answered / total) * 100) : 0;
    const bar = $('#progressbar'); if (bar) bar.style.width = `${pct}%`;

    const chipA = $('#chip-answered'), chipU = $('#chip-unanswered'), chipF = $('#chip-flagged');
    if (chipA) { chipA.textContent = `Đã làm ${answered}`; chipA.className = `chip ${answered ? 'chip-emerald' : 'chip-gray'}`; }
    if (chipU) { chipU.textContent = `Chưa ${unanswered}`; chipU.className = `chip ${unanswered ? 'chip-rose' : 'chip-emerald'}`; }
    if (chipF) { chipF.textContent = `Đánh dấu ${flagged}`; chipF.className = `chip chip-gray`; }
}
export function updatePageIndicator() {
    const totalPages = Math.ceil(state.questionCount / PAGE_SIZE);
    $('#page-indicator').textContent = `Trang ${state.currentPage + 1}/${totalPages}`;
}
export function startTimer() {
    if (state.timerId) clearInterval(state.timerId);
    state.timerId = setInterval(() => {
        state.timeLeftSec = Math.max(0, state.timeLeftSec - 1);
        updateTimerUi();
        if (state.timeLeftSec % 5 === 0) saveStateDebounced();
        if (state.timeLeftSec <= 0) { clearInterval(state.timerId); autoSubmitOnTimeout(); }
    }, 1000);
}
export function updateTimerUi() { $('#timer').textContent = fmtHMS(state.timeLeftSec); }
export function autoSubmitOnTimeout() { submitExam(false); alert('⏰ Hết giờ! Bài thi đã được nộp tự động.'); }

/* Submit + grade */
export function submitExamConfirm() {
    const unanswered = state.questionCount - Object.keys(state.answers).length;
    const msg = unanswered > 0 ? `Còn ${unanswered} câu chưa trả lời. Bạn chắc chắn muốn nộp bài?` : 'Bạn chắc chắn muốn nộp bài?';
    if (!confirm(msg)) return; submitExam(true);
}
export function submitExam() {
    if (state.timerId) clearInterval(state.timerId);
    const result = grade();
    state.stage = 'results'; state.endedAt = Date.now(); state.result = result;
    saveState(); renderResults(); window.removeEventListener('keydown', onKey);
}
function grade() {
    const summary = { total: state.questionCount, correct: 0, wrong: 0, empty: 0, topics: {} };
    const details = [];
    state.questions.forEach((q, idx) => {
        let a = state.answers[idx];
        if (typeof a === 'string') a = { A: 0, B: 1, C: 2, D: 3 }[a.toUpperCase()];
        const isEmpty = (a === undefined || a === null);
        const isCorrect = !isEmpty && Number(a) === Number(q._correctIndex);
        if (isEmpty) summary.empty++; else if (isCorrect) summary.correct++; else summary.wrong++;
        const topic = q.topic || 'Unknown';
        if (!summary.topics[topic]) summary.topics[topic] = { correct: 0, wrong: 0, empty: 0, total: 0 };
        summary.topics[topic].total++;
        if (isEmpty) summary.topics[topic].empty++; else if (isCorrect) summary.topics[topic].correct++; else summary.topics[topic].wrong++;
        details.push({ idx, chosenIndex: isEmpty ? null : Number(a), correctIndex: Number(q._correctIndex), isCorrect, isEmpty });
    });
    return { summary, details };
}
