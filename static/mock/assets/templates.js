// static/mock/assets/templates.js
// Gom tất cả template vào 1 nơi, dùng chuỗi (string), KHÔNG dùng hàm.
export const TPL = window.TPL || {};

/* ========== LANDING (Bước 1/3) ========== */
// static/mock/assets/templates.js
// ...
TPL.landing = `
  <div class="landing">
    <!-- HERO -->
    <header class="container">
      <div class="card card-pro landing-hero-grid">
        <div class="hero-copy">
          <h1 class="hero-title">Mock PMI-ACP</h1>
          <p class="hero-sub">
            Làm đề như thi thật, đếm giờ, lưu tiến độ, chấm điểm client-side,
            review có giải thích, xáo câu & đáp án.
          </p>
          <div class="hero-chips">
            <span class="chip chip-gray">Client-side</span>
            <span class="chip chip-gray">Hotkeys: J/K, ←/→, 1–4, F</span>
            <span class="chip chip-gray">10 câu/màn</span>
          </div>
        </div>
        <div class="hero-art" aria-hidden="true"></div>
      </div>
    </header>

    <!-- FORM -->
    <section class="container">
      <div class="card card-pro p-6 lg:p-7">
        <div class="text-sm text-slate-500 mb-1">Bước 1/3 · Cấu hình đề</div>
        <h2 class="text-xl font-bold mb-5">Cài đặt nhanh</h2>

        <div class="grid lg:grid-cols-2 gap-6">
          <!-- Cột trái -->
          <div class="space-y-6">
            <div>
              <div class="label">Số câu</div>
              <div class="seg">
                <button id="opt-q-50"  class="opt" data-selected="true" aria-pressed="true">50 câu</button>
                <button id="opt-q-120" class="opt" aria-pressed="false">120 câu</button>
              </div>
              <div class="field-help">Bạn có thể đổi sau trong lúc làm bài.</div>
            </div>

            <div>
              <div class="label">Ngôn ngữ hiển thị</div>
              <div class="seg">
                <button id="opt-lang-vi" class="opt" data-selected="true">Tiếng Việt</button>
                <button id="opt-lang-en" class="opt">English</button>
              </div>
            </div>
          </div>

          <!-- Cột phải -->
          <div class="space-y-6">
            <div class="grid sm:grid-cols-2 gap-4">
              <div>
                <div class="label">Thời lượng</div>
                <div class="inline-field">
                  <input id="inp-min-per-q" type="number" step="0.1" min="0.1" value="1,2" class="w-28">
                  <span class="suffix">phút / câu</span>
                </div>
                <div class="hint">Gợi ý: 50 câu ≈ 60’, 120 câu ≈ 180’.</div>
              </div>
              <div>
                <div class="label">Cộng thêm</div>
                <div class="inline-field">
                  <input id="inp-bonus-min" type="number" step="1" min="0" value="0" class="w-28">
                  <span class="suffix">phút</span>
                </div>
              </div>
            </div>

            <details class="adv">
              <summary>Tuỳ chọn nâng cao</summary>
              <div class="adv-body">
                <label class="inline-flex items-center gap-2">
                  <input id="chk-shuffle" type="checkbox" checked>
                  <span>Xáo thứ tự câu hỏi</span>
                </label>
                <label class="inline-flex items-center gap-2">
                  <input id="chk-shuffle-ans" type="checkbox" checked>
                  <span>Xáo thứ tự đáp án</span>
                </label>
              </div>
            </details>
          </div>
        </div>

        <div class="landing-actions landing-actions--stack">
            <button id="btn-start" class="btn-primary btn-lg">Bắt đầu làm bài</button>
            <a href="../" class="btn-anim btn-ghost landing-home">← Trang chủ</a>
        </div>
      </div>
    </section>
  </div>
`;


/* ========== EXAM (Bước 2/3) ========== */
TPL.exam = `
  <div class="page">
    <!-- Toolbar: metrics (trái) + actions (phải) + progress -->
    <div class="toolbar">
      <div class="container toolbar-grid">
        <div class="metrics">
          <span id="timer" class="chip chip-timer">00:00:00</span>
          <span id="progress" class="chip chip-gray">0/0</span>
          <span id="page-indicator" class="chip chip-gray">Trang 1/1</span>
          <span id="chip-answered" class="chip chip-gray">Đã làm 0</span>
          <span id="chip-unanswered" class="chip chip-warn">Chưa 0</span>
          <span id="chip-flagged" class="chip chip-gray">Đánh dấu 0</span>
        </div>

        <div class="actions">
          <button id="btn-nav" class="btn-anim btn-ghost">Danh sách</button>
          <button id="btn-switch-lang" class="btn-anim btn-outline">EN/VI</button>
          <button id="btn-submit" class="btn-primary">Nộp bài</button>
        </div>

        <div class="progressbar">
          <div class="bar-bg"><div id="progressbar" class="bar-fg" style="width:0%"></div></div>
        </div>
      </div>
    </div>

    <!-- Nội dung câu hỏi -->
    <main class="mainContent">
      <div class="container">
        <div class="hint">Bước 2/3 · Làm bài (10 câu/màn)</div>
        <div id="exam-body" class="q-list"></div>
      </div>
    </main>

    <!-- Pager dưới – sticky (giữ duy nhất) -->
    <nav class="pager pager--bottom">
      <div class="container">
        <div class="btnGroup">
          <div class="left">
            <button class="btn-anim js-prev-question" data-action="prevQuestion">← Câu trước</button>
            <button class="btn-anim js-next-question" data-action="nextQuestion">Câu sau →</button>
          </div>
          <div class="right">
            <button class="btn-anim js-prev-page" data-action="prevPage">← Trang</button>
            <button class="btn-primary js-next-page" data-action="nextPage">Trang →</button>
          </div>
        </div>
      </div>
    </nav>

    <!-- Navigator overlay -->
    <div id="overlay" class="hidden fixed inset-0 z-40">
      <div class="absolute inset-0 bg-black/50" data-close-overlay></div>
      <div class="absolute inset-x-0 bottom-0 md:inset-y-8 md:mx-auto md:w-[720px] bg-white rounded-t-2xl md:rounded-2xl p-4 shadow">
        <div class="flex items-center justify-between mb-2">
          <div class="font-semibold">Chọn câu</div>
          <div class="flex items-center gap-2">
            <button id="btn-filter-unanswered" class="text-sm px-3 py-1.5 border rounded-lg">Chưa trả lời</button>
            <button class="text-sm px-3 py-1.5 border rounded-lg" data-close-overlay>Đóng</button>
          </div>
        </div>
        <div id="grid-nav" class="grid grid-cols-8 sm:grid-cols-10 gap-2"></div>
      </div>
    </div>
  </div>
`;


/* ========== RESULTS (Bước 3/3) ========== */
TPL.results = `
  <div class="space-y-6">
    <section class="card p-5">
      <div class="mb-2 text-sm text-slate-500">Bước 3/3 · Kết quả</div>
      <h2 class="text-xl font-bold">Tổng kết</h2>
      <div class="mt-3 flex flex-wrap items-center gap-2">
        <span id="score-pill" class="badge badge-gray">--</span>
        <span id="time-used" class="badge badge-gray">--</span>
        <span id="date-end" class="badge badge-gray">--</span>
      </div>
      <div class="mt-4 grid md:grid-cols-3 gap-3 text-sm">
        <div class="p-3 rounded-lg bg-emerald-50"><div class="text-emerald-700 font-semibold">Đúng</div><div id="stat-correct" class="text-2xl font-bold">0</div></div>
        <div class="p-3 rounded-lg bg-rose-50"><div class="text-rose-700 font-semibold">Sai</div><div id="stat-wrong" class="text-2xl font-bold">0</div></div>
        <div class="p-3 rounded-lg bg-slate-100"><div class="text-slate-700 font-semibold">Bỏ trống</div><div id="stat-empty" class="text-2xl font-bold">0</div></div>
      </div>
      <div class="mt-4"><canvas id="topic-chart" height="140" class="w-full"></canvas></div>
      <div class="mt-4 flex flex-wrap gap-2">
        <button id="btn-review-wrong" class="btn-anim btn-ghost">Xem câu sai</button>
        <button id="btn-review-all" class="btn-anim btn-ghost">Xem tất cả</button>
        <button id="btn-export-csv" class="btn-anim btn-ghost">Xuất CSV</button>
        <button id="btn-restart" class="btn-primary">Làm lại đề mới</button>
      </div>
    </section>
    <section><div id="review-list" class="space-y-3"></div></section>
  </div>
`;
