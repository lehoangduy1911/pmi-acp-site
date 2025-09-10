import { TPL } from './templates.js?v=2025-09-xx-y';
import { $, escapeHtml, fmtHMS, timeStamp, csvEscape, hold, toast } from './utils.js?v=2025-09-xx-y';
import { LABELS } from './constants.js?v=2025-09-xx-y';
import { state } from './state.js?v=2025-09-xx-y';

export function renderResults() {
    const app = $('#app');
    app.innerHTML = TPL.results;

    const { summary } = state.result;
    const pct = Math.round((summary.correct / summary.total) * 100);
    $('#score-pill').textContent = `Điểm: ${summary.correct}/${summary.total} (${pct}%)`;
    $('#stat-correct').textContent = summary.correct;
    $('#stat-wrong').textContent = summary.wrong;
    $('#stat-empty').textContent = summary.empty;
    const timeUsed = state.durationSec - state.timeLeftSec;
    $('#time-used').textContent = `Thời gian: ${fmtHMS(timeUsed)} / ${fmtHMS(state.durationSec)}`;
    $('#date-end').textContent = new Date(state.endedAt || Date.now()).toLocaleString();

    renderTopicChart(summary.topics);

    $('#btn-review-wrong').addEventListener('click', (e) => hold(e.currentTarget, () => renderReviewList(true)));
    $('#btn-review-all').addEventListener('click', (e) => hold(e.currentTarget, () => renderReviewList(false)));
    $('#btn-export-csv').addEventListener('click', (e) => hold(e.currentTarget, exportCSV));
    $('#btn-restart').addEventListener('click', (e) => hold(e.currentTarget, () => {
        localStorage.removeItem('mockExamState@pmiacp');
        window.location.href = 'index.html';
    }));

    renderReviewList(false);
    toast(pct >= 70 ? 'Quá ổn! Tiếp đà này nhé 💪' : 'Ổn rồi, xem lại câu sai và làm lại vòng nữa 🔁');
}

export function renderTopicChart(topics) {
    const canvas = $('#topic-chart');
    const ctx = canvas.getContext('2d');
    const entries = Object.entries(topics);
    const W = canvas.width = canvas.clientWidth;
    const BAR_H = 18, GAP = 8;
    const H = canvas.height = entries.length * (BAR_H + GAP) + 10;
    ctx.clearRect(0, 0, W, H);
    ctx.font = '12px system-ui, -apple-system, Segoe UI, Roboto';
    ctx.textBaseline = 'middle';
    let y = 8;
    const leftPad = 160;
    entries.forEach(([name, v]) => {
        ctx.fillStyle = '#374151'; ctx.fillText(name, 6, y + BAR_H / 2);
        const usableW = W - leftPad - 12;
        const unit = usableW / Math.max(1, v.total);
        let x = leftPad;
        [['#10b981', v.correct], ['#ef4444', v.wrong], ['#9ca3af', v.empty]].forEach(([c, n]) => {
            const w = n * unit; ctx.fillStyle = c; ctx.fillRect(x, y, w, BAR_H); x += w;
        });
        ctx.fillStyle = '#111827'; ctx.fillText(`${v.correct}/${v.total}`, x + 6, y + BAR_H / 2);
        y += BAR_H + GAP;
    });
}

export function renderReviewList(onlyWrong) {
    const wrap = $('#review-list');
    wrap.innerHTML = '';
    const details = state.result.details;
    state.questions.forEach((q, idx) => {
        const d = details[idx];
        if (onlyWrong && d.isCorrect) return;

        const card = document.createElement('article');
        card.className = 'p-4 rounded-2xl bg-white shadow';

        const head = document.createElement('div');
        head.className = 'flex items-start gap-2';
        const num = document.createElement('div'); num.className = 'text-sm font-semibold text-slate-600 mt-0.5'; num.textContent = `${idx + 1}.`;
        const txt = document.createElement('div'); txt.className = 'font-medium'; txt.textContent = state.lang === 'VI' ? q.questionVI : q.questionEN;
        head.append(num, txt);

        const tags = document.createElement('div');
        tags.className = 'mt-1 flex flex-wrap gap-2 text-xs';
        const t1 = document.createElement('span');
        t1.className = d.isCorrect ? 'badge badge-emerald' : (d.isEmpty ? 'badge badge-gray' : 'badge badge-rose');
        t1.textContent = d.isCorrect ? 'Đúng' : (d.isEmpty ? 'Bỏ trống' : 'Sai');
        const t2 = document.createElement('span'); t2.className = 'badge badge-gray'; t2.textContent = q.topic || 'Topic';
        tags.append(t1, t2);

        const opts = document.createElement('div');
        opts.className = 'mt-2 grid grid-cols-1 gap-1 text-[15px]';
        q._opts.forEach((opt, i) => {
            const row = document.createElement('div');
            row.className = 'px-3 py-2 rounded border';
            const chosen = d.chosenIndex === i;
            const correct = d.correctIndex === i;
            if (correct) row.classList.add('opt-correct');
            if (chosen && !correct) row.classList.add('opt-wrong');
            const content = state.lang === 'VI' ? opt.vi : opt.en;
            row.innerHTML = `<span class="font-semibold mr-1">${LABELS[i]}.</span> ${escapeHtml(content ?? '')}`;
            opts.append(row);
        });

        const exp = document.createElement('div');
        exp.className = 'mt-2 p-3 rounded bg-slate-50 text-sm text-slate-700';
        exp.innerHTML = `<div class="font-semibold mb-1">Giải thích</div>${escapeHtml(state.lang === 'VI' ? q.explanationVI : q.explanationEN)}`;

        card.append(head, tags, opts, exp);
        wrap.append(card);
    });
}

export function exportCSV() {
    const rows = [];
    rows.push(['No', 'Topic', 'Difficulty', 'Question', 'Chosen', 'Correct', 'Status']);
    state.result.details.forEach((d, idx) => {
        const q = state.questions[idx];
        const chosen = (d.chosenIndex === null || d.chosenIndex === undefined) ? '' : LABELS[d.chosenIndex];
        const correct = LABELS[d.correctIndex];
        const status = d.isCorrect ? 'Correct' : (d.isEmpty ? 'Empty' : 'Wrong');
        const ques = state.lang === 'VI' ? q.questionVI : q.questionEN;
        rows.push([String(idx + 1), String(q.topic || ''), String((q.difficulty || '').toUpperCase()), ques, chosen, correct, status]);
    });
    const csv = rows.map(r => r.map(csvEscape).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `mock_result_${timeStamp()}.csv`;
    document.body.appendChild(a); a.click(); a.remove();
}
