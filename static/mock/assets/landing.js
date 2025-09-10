import { TPL } from './templates.js';
import { $, $$, hold } from './utils.js';
import { DEFAULT_MIN_PER_Q, STORAGE_KEY } from './constants.js';
import { state, resetState, saveStateDebounced, loadSaved } from './state.js';
import { startExam, renderExam, startTimer } from './exam.js';

export function renderLanding() {
    const saved = loadSaved();
    const app = $('#app');
    app.innerHTML = TPL.landing;

    const qBtns = $$('.opt[data-qcount]');
    const langBtns = $$('.opt[data-lang]');
    setSelected(qBtns, String(saved?.questionCount || 50), 'data-qcount');
    setSelected(langBtns, saved?.lang || 'VI', 'data-lang');

    $('#min-per-q').value = saved?.minPerQ ?? DEFAULT_MIN_PER_Q[saved?.questionCount || 50];
    $('#bonus-min').value = saved?.bonusMin ?? 0;
    $('#shuffle-questions').checked = saved?.shuffle ?? true;
    $('#shuffle-answers').checked = saved?.shuffleAns ?? true;

    if (saved?.stage === 'exam' && saved.questions?.length && saved.timeLeftSec > 0) {
        $('#btn-resume').classList.remove('hidden');
    }

    qBtns.forEach(b => b.addEventListener('click', () => {
        setSelected(qBtns, b.dataset.qcount, 'data-qcount');
        const q = Number(b.dataset.qcount);
        $('#min-per-q').value = DEFAULT_MIN_PER_Q[q] ?? 1.2;
    }));
    langBtns.forEach(b => b.addEventListener('click', () => setSelected(langBtns, b.dataset.lang, 'data-lang')));

    $('#btn-start').addEventListener('click', (e) => {
        const questionCount = Number($('.opt[data-qcount][data-selected="true"]').dataset.qcount);
        const lang = $('.opt[data-lang][data-selected="true"]').dataset.lang;
        const minPerQ = Number($('#min-per-q').value || 1.2);
        const bonusMin = Number($('#bonus-min').value || 0);
        const shuffle = $('#shuffle-questions').checked;
        const shuffleAns = $('#shuffle-answers').checked;
        const resumeAllowed = $('#resume-toggle').checked;

        if (saved && (!resumeAllowed || saved.stage !== 'exam')) localStorage.removeItem(STORAGE_KEY);
        hold(e.currentTarget, () => startExam({ questionCount, lang, minPerQ, bonusMin, shuffle, shuffleAns }));
    });

    $('#btn-resume').addEventListener('click', (e) => {
        hold(e.currentTarget, () => {
            if (saved) {
                resetState({ ...saved, timerId: null, stage: 'exam' });
                renderExam(); startTimer();
            }
        });
    });
}

function setSelected(btns, value, attr) {
    btns.forEach(b => b.setAttribute('data-selected', b.getAttribute(attr) == value));
}
