// Giao diện mới: tối giản, 10 câu/màn, progress bar + dock điều hướng
export const TPL = {
    landing: `
    <div class="space-y-6">
      <section class="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-600 via-indigo-500 to-violet-500 text-white shadow">
        <div class="absolute -top-10 -right-10 w-64 h-64 rounded-full bg-white/10 blur-2xl"></div>
        <div class="p-6 md:p-10">
          <h1 class="text-2xl md:text-4xl font-extrabold">Mock PMI-ACP</h1>
          <p class="mt-2 text-indigo-50/95">Làm đề như thi thật · đếm giờ · lưu tiến độ · chấm điểm · review có giải thích · xáo câu & đáp án.</p>
          <div class="mt-3 flex flex-wrap gap-2 text-xs">
            <span class="badge badge-gray">Client-side</span>
            <span class="badge badge-gray">Hotkeys: J/K, ←/→, 1–4, F</span>
            <span class="badge badge-gray">10 câu/màn</span>
          </div>
        </div>
      </section>

      <div class="grid md:grid-cols-2 gap-5">
        <section class="bg-white rounded-2xl p-5 shadow">
          <div class="mb-3 text-sm text-slate-500">Bước 1/3 · Cấu hình đề</div>
          <h2 class="text-lg font-semibold mb-4">Cài đặt nhanh</h2>

          <div class="space-y-4">
            <div>
              <div class="text-sm text-slate-600 mb-1">Số câu</div>
              <div class="flex gap-2">
                <button class="opt px-3 py-2 border rounded-lg" data-qcount="50">50 câu</button>
                <button class="opt px-3 py-2 border rounded-lg" data-qcount="120">120 câu</button>
              </div>
            </div>

            <div>
              <div class="text-sm text-slate-600 mb-1">Ngôn ngữ hiển thị</div>
              <div class="flex gap-2">
                <button class="opt px-3 py-2 border rounded-lg" data-lang="VI">Tiếng Việt</button>
                <button class="opt px-3 py-2 border rounded-lg" data-lang="EN">English</button>
              </div>
            </div>

            <div>
              <div class="text-sm text-slate-600 mb-1">Thời lượng</div>
              <div class="grid grid-cols-2 gap-3 items-center">
                <label class="flex items-center gap-2">
                  <input type="number" id="min-per-q" class="w-20 px-2 py-1 border rounded" step="0.1" min="0.5" value="1.2">
                  <span class="text-sm">phút / câu</span>
                </label>
                <label class="flex items-center gap-2">
                  <input type="number" id="bonus-min" class="w-20 px-2 py-1 border rounded" step="1" min="0" value="0">
                  <span class="text-sm">phút cộng thêm</span>
                </label>
              </div>
              <p class="text-xs text-slate-500 mt-1">Gợi ý: 50 câu ≈ 60’, 120 câu ≈ 180’.</p>
            </div>

            <div class="flex items-center gap-2">
              <input id="shuffle-questions" type="checkbox" class="h-4 w-4" checked>
              <label for="shuffle-questions" class="text-sm">Xáo thứ tự câu hỏi</label>
            </div>
            <div class="flex items-center gap-2">
              <input id="shuffle-answers" type="checkbox" class="h-4 w-4" checked>
              <label for="shuffle-answers" class="text-sm">Xáo thứ tự đáp án</label>
            </div>
            <div class="flex items-center gap-2">
              <input id="resume-toggle" type="checkbox" class="h-4 w-4" checked>
              <label for="resume-toggle" class="text-sm">Tự nối lại bài thi dang dở</label>
            </div>
          </div>

          <div class="mt-5 flex gap-3">
            <button id="btn-start" class="px-4 py-2 rounded-xl bg-indigo-600 text-white hover:bg-indigo-700 shadow">🚀 Bắt đầu</button>
            <button id="btn-resume" class="px-4 py-2 rounded-xl bg-amber-500 text-white hover:bg-amber-600 shadow hidden">Tiếp tục</button>
          </div>
        </section>

        <section class="bg-white rounded-2xl p-5 shadow">
          <div class="mb-3 text-sm text-slate-500">Lưu ý</div>
          <ul class="list-disc pl-6 space-y-2 text-[15px] leading-relaxed">
            <li>Đặt <code>Questions.json</code> cùng thư mục.</li>
            <li>Mở qua navbar hoặc <code>/mock/index.html</code>.</li>
            <li>Phím tắt: <b>J/K</b> hoặc <b>←/→</b>, <b>1–4</b> chọn A–D, <b>F</b> đánh dấu.</li>
          </ul>
        </section>
      </div>
    </div>
  `,

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
