// Giao diện mới: tối giản, 10 câu/màn, progress bar + dock điều hướng
// Giữ nguyên export TPL hiện có của bạn. Ở đây chỉ thay phần TPL.exam
export const TPL = window.TPL || {};

TPL.exam = (vm) => {
    // vm: { page, totalPages, canPrev, canNext, ... } – tùy bạn đang truyền
    // Lưu ý: đặt .pager--top (nếu muốn) trước .mainContent, .pager--bottom sau .mainContent
    return `
  <div class="page">
    <!-- (Tùy chọn) Pager trên – sẽ tự ẩn ở mobile nhờ CSS -->
    <nav class="pager pager--top">
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

    <!-- Toolbar (lọc, timer...) nếu có -->
    <div class="toolbar">
      <div class="container">
        ${vm.toolbarHtml ?? ""}
      </div>
    </div>

    <!-- Nội dung câu hỏi -->
    <main class="mainContent">
      <div class="container">
        ${vm.questionsHtml /* phần render danh sách câu hỏi (10/c trang) của bạn */}
      </div>
    </main>

    <!-- Pager dưới – sticky, thân thiện với mobile -->
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
  </div>
  `;
};


exam: `
    <div class="space-y-2">
      <!-- Topbar gọn + progress bar -->
      <div class="sticky top-0 z-20 bg-white/75 backdrop-blur border-b">
        <div class="max-w-6xl mx-auto px-4 py-3 flex flex-wrap items-center gap-2">
          <span id="timer" class="px-2.5 py-1.5 rounded-lg bg-indigo-600 text-white font-semibold">--:--:--</span>
          <span id="progress" class="text-sm text-slate-600">0/0</span>
          <span id="page-indicator" class="text-sm text-slate-600">Trang 1/1</span>
          <div class="flex-1"></div>
          <a href="/" class="px-3 py-1.5 border rounded-lg btn-anim">← Trang chủ</a>
          <button id="btn-nav" class="px-3 py-1.5 border rounded-lg">Danh sách</button>
          <button id="btn-switch-lang" class="px-3 py-1.5 border rounded-lg">EN/VI</button>
          <button id="btn-submit" class="px-3 py-1.5 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700">Nộp bài</button>
        </div>
        <div class="h-1 w-full bg-slate-200">
          <div id="progressbar" class="h-1 bg-indigo-600" style="width:0%"></div>
        </div>
      </div>

      <div class="px-1 text-xs text-slate-500">Bước 2/3 · Làm bài (10 câu/màn)</div>

      <!-- Questions (render theo trang) -->
      <div id="exam-body" class="space-y-4"></div>
    </div>

    <!-- Dock điều hướng dưới cùng -->
    <div class="fixed inset-x-0 bottom-0 z-30">
      <div class="max-w-6xl mx-auto m-3">
        <div class="rounded-2xl bg-white/90 backdrop-blur shadow border px-3 py-2 flex items-center gap-2">
          <button id="btn-prev-page" class="px-3 py-1.5 border rounded-lg">⟵ Trang</button>
          <button id="btn-next-page" class="px-3 py-1.5 border rounded-lg">Trang ⟶</button>
          <div class="flex-1"></div>
          <button id="btn-prev" class="px-3 py-1.5 border rounded-lg">← Câu trước</button>
          <button id="btn-next" class="px-3 py-1.5 border rounded-lg">Câu sau →</button>
        </div>
      </div>
    </div>

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
  `,

    results: `
    <div class="space-y-6">
      <section class="bg-white rounded-2xl p-5 shadow">
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
          <button id="btn-review-wrong" class="px-3 py-1.5 border rounded-lg">Xem câu sai</button>
          <button id="btn-review-all" class="px-3 py-1.5 border rounded-lg">Xem tất cả</button>
          <button id="btn-export-csv" class="px-3 py-1.5 border rounded-lg">Xuất CSV</button>
          <button id="btn-restart" class="px-3 py-1.5 rounded-lg bg-indigo-600 text-white">Làm lại đề mới</button>
        </div>
      </section>
      <section><div id="review-list" class="space-y-3"></div></section>
    </div>
  `,
};
