// static/mock/assets/landing.js
import { TPL } from './templates.js';
import { $, $$, hold, toast } from './utils.js';
import { startExam } from './exam.js';
import { state, resetState, saveState } from './state.js';

function firstSel(...sels) {
    for (const s of sels) {
        const el = document.querySelector(s);
        if (el) return el;
    }
    return null;
}
function getNum(el, fallback = 0) {
    if (!el) return fallback;
    const v = String(el.value ?? '').replace(',', '.').trim();
    const n = Number(v);
    return Number.isFinite(n) ? n : fallback;
}
function selOpt(elTrue, elFalse) {
    // ưu tiên attr data-selected="true" nếu có
    if (elTrue && elTrue.getAttribute('data-selected') === 'true') return true;
    if (elFalse && elFalse.getAttribute('data-selected') === 'true') return false;
    // fallback theo class 'active' hoặc checked
    if (elTrue && (elTrue.classList.contains('active') || elTrue.checked)) return true;
    if (elFalse && (elFalse.classList.contains('active') || elFalse.checked)) return false;
    return null;
}

export function renderLanding() {
    const app = $('#app');
    app.innerHTML = TPL.landing; // PHẢI giữ TPL.landing là chuỗi có form

    // ====== Lấy các control với nhiều selector dự phòng ======
    const elQ50 = firstSel('#opt-q-50', '#opt-qcount-50', '[data-qcount="50"]');
    const elQ120 = firstSel('#opt-q-120', '#opt-qcount-120', '[data-qcount="120"]');
    const elLangVi = firstSel('#opt-lang-vi', '#opt-lang-VI', '[data-lang="VI"]');
    const elLangEn = firstSel('#opt-lang-en', '#opt-lang-EN', '[data-lang="EN"]');

    const elMinPerQ = firstSel('#inp-min-per-q', '#min-per-q', 'input[name="min-per-q"]');
    const elBonus = firstSel('#inp-bonus-min', '#bonus-min', 'input[name="bonus-min"]');

    const elShuffle = firstSel('#chk-shuffle', 'input[name="shuffle-questions"]');
    const elShuffleAns = firstSel('#chk-shuffle-ans', 'input[name="shuffle-answers"]');

    const btnStart = firstSel('#btn-start', '#start-exam', 'button[data-action="startExam"]');

    // ====== Set default an toàn (nếu có DOM thì gán, không thì bỏ qua) ======
    if (!state.stage || state.stage === 'landing') {
        resetState({ stage: 'landing' });
    }

    if (elMinPerQ) elMinPerQ.value = String(state.minPerQ ?? 1.2);
    if (elBonus) elBonus.value = String(state.bonusMin ?? 0);

    if (elShuffle) elShuffle.checked = state.shuffle ?? true;
    if (elShuffleAns) elShuffleAns.checked = state.shuffleAns ?? true;

    // Toggle 50/120
    function setQcountUi(val) {
        if (elQ50) elQ50.setAttribute('data-selected', String(val === 50));
        if (elQ120) elQ120.setAttribute('data-selected', String(val === 120));
    }
    function setLangUi(lang) {
        if (elLangVi) elLangVi.setAttribute('data-selected', String(lang === 'VI'));
        if (elLangEn) elLangEn.setAttribute('data-selected', String(lang === 'EN'));
    }

    const qDefault = state.questionCount ?? 50;
    setQcountUi(qDefault);
    setLangUi(state.lang ?? 'VI');

    // ====== Bind sự kiện — đều có guard ======
    elQ50 && elQ50.addEventListener('click', () => setQcountUi(50));
    elQ120 && elQ120.addEventListener('click', () => setQcountUi(120));

    elLangVi && elLangVi.addEventListener('click', () => setLangUi('VI'));
    elLangEn && elLangEn.addEventListener('click', () => setLangUi('EN'));

    btnStart && btnStart.addEventListener('click', (e) => hold(e.currentTarget, async () => {
        // Lấy giá trị hiện tại một cách linh hoạt
        let questionCount =
            selOpt(elQ50, elQ120) === true ? 50 :
                selOpt(elQ50, elQ120) === false ? 120 :
                    qDefault;

        let lang =
            selOpt(elLangVi, elLangEn) === true ? 'VI' :
                selOpt(elLangVi, elLangEn) === false ? 'EN' :
                    (state.lang ?? 'VI');

        const minPerQ = getNum(elMinPerQ, 1.2);
        const bonusMin = getNum(elBonus, 0);
        const shuffle = elShuffle ? !!elShuffle.checked : true;
        const shuffleAns = elShuffleAns ? !!elShuffleAns.checked : true;

        // Lưu về state (không crash nếu mất control nào)
        state.questionCount = questionCount;
        state.lang = lang;
        state.minPerQ = minPerQ;
        state.bonusMin = bonusMin;
        state.shuffle = shuffle;
        state.shuffleAns = shuffleAns;
        saveState();

        // Chạy bài thi
        await startExam({
            questionCount, lang,
            minPerQ, bonusMin,
            shuffle, shuffleAns
        });
    }));

    // Nếu không tìm thấy bất kỳ control nào => cảnh báo nhẹ nhưng không vỡ trang
    if (!btnStart) {
        console.warn('[landing] Không thấy nút Start (#btn-start). Kiểm tra lại TPL.landing.');
    }
}
