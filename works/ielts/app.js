/* ===================== 雅思学习助手 · app.js ===================== */

/* ---------- 本地存储层 (A2) ---------- */
const DB = {
  KEY: "ielts_buddy_v1",
  _cache: null,
  load() {
    if (this._cache) return this._cache;
    try {
      this._cache = JSON.parse(localStorage.getItem(this.KEY)) || {};
    } catch (e) {
      this._cache = {};
    }
    return this._cache;
  },
  save() {
    localStorage.setItem(this.KEY, JSON.stringify(this._cache || {}));
  },
  get(path, def) {
    const d = this.load();
    return d[path] === undefined ? def : d[path];
  },
  set(path, val) {
    const d = this.load();
    d[path] = val;
    this.save();
  }
};

const $ = (id) => document.getElementById(id);

/* ---------- 日期工具 ---------- */
function todayStr(date) {
  const d = date || new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}
function parseDate(str) {
  const [y, m, d] = str.split("-").map(Number);
  return new Date(y, m - 1, d);
}
function daysBetween(a, b) {
  return Math.round((parseDate(b) - parseDate(a)) / 86400000);
}
function addDays(str, n) {
  const d = parseDate(str);
  d.setDate(d.getDate() + n);
  return todayStr(d);
}

/* ---------- 初始化 ---------- */
function initState() {
  if (!DB.get("startDate")) DB.set("startDate", todayStr());
  if (!DB.get("examDate")) DB.set("examDate", "2026-09-30");
  if (!DB.get("days")) DB.set("days", {});
  if (!DB.get("wordStatus")) DB.set("wordStatus", {}); // word -> 'known'|'unknown'
  if (!DB.get("essays")) DB.set("essays", []);
  if (DB.get("wordIndex") === undefined) DB.set("wordIndex", 0);
  if (!DB.get("srs")) {
    // 间隔复习状态；从旧的 wordStatus 迁移，保证连续
    const st = DB.get("wordStatus", {});
    const level = {}, due = {};
    Object.keys(st).forEach((w) => { level[w] = st[w] === "known" ? 2 : 0; due[w] = 0; });
    DB.set("srs", { level, due, step: 0 });
  }
  if (!DB.get("provider")) DB.set("provider", "deepseek");
  // 旧版只有一个 apiKey（Claude），迁移到 claudeKey
  if (DB.get("claudeKey") === undefined && DB.get("apiKey")) DB.set("claudeKey", DB.get("apiKey"));
}

/* ---------- 导航 ---------- */
const PAGE_TITLE = { home: "今日学习", words: "单词", writing: "作文批改", speaking: "口语", me: "我的" };
function go(page) {
  if (typeof clearSpeakTimer === "function") clearSpeakTimer(); // 离开口语停计时
  document.querySelectorAll(".page").forEach((p) => p.classList.add("hidden"));
  $("page-" + page).classList.remove("hidden");
  document.querySelectorAll(".nav-btn").forEach((b) =>
    b.classList.toggle("active", b.dataset.page === page)
  );
  $("page-title").textContent = PAGE_TITLE[page] || "";
  if (page === "home") renderHome();
  if (page === "me") renderMe();
  if (page === "writing") renderHistory();
}

/* ===================== 首页 / 打卡 (B + G) ===================== */
function isWritingDay(dateStr) {
  // 周一/三/五 为写作日
  return [1, 3, 5].includes(parseDate(dateStr).getDay());
}

function todaysTasks(dateStr) {
  const tasks = DAILY_TASKS.base.slice();
  if (isWritingDay(dateStr)) tasks.push(DAILY_TASKS.writingDay);
  return tasks;
}

function getDayRecord(dateStr) {
  const days = DB.get("days", {});
  return days[dateStr] || { tasks: {}, checked: false };
}
function setDayRecord(dateStr, rec) {
  const days = DB.get("days", {});
  days[dateStr] = rec;
  DB.set("days", days);
}

// 打卡联动：每日目标阈值
const TASK_GOALS = { vocab: 50, review: 30, test: 5, writing: 2 };

// 给今天某个计数器累加，并刷新自动打勾
function bumpToday(field, n) {
  const t = todayStr();
  const rec = getDayRecord(t);
  rec[field] = (rec[field] || 0) + n;
  setDayRecord(t, rec);
  syncAutoTasks();
}

// 根据计数器达标情况，把对应任务自动勾上（只加不减，手动操作不受影响）
function syncAutoTasks() {
  const t = todayStr();
  const rec = getDayRecord(t);
  if (!rec.tasks) rec.tasks = {};
  if ((rec.newWords || 0) >= TASK_GOALS.vocab) rec.tasks.vocab = true;
  if ((rec.reviewWords || 0) >= TASK_GOALS.review) rec.tasks.review = true;
  if ((rec.tests || 0) >= TASK_GOALS.test) rec.tasks.test = true;
  if ((rec.essays || 0) >= TASK_GOALS.writing) rec.tasks.writing = true;
  setDayRecord(t, rec);
}

function computeStreak() {
  const days = DB.get("days", {});
  let cursor = todayStr();
  if (!(days[cursor] && days[cursor].checked)) cursor = addDays(cursor, -1);
  let streak = 0;
  while (days[cursor] && days[cursor].checked) {
    streak++;
    cursor = addDays(cursor, -1);
  }
  return streak;
}

function weekDates() {
  // 返回本周一到周日的日期字符串
  const today = new Date();
  const dow = (today.getDay() + 6) % 7; // 周一=0
  const monday = addDays(todayStr(today), -dow);
  return Array.from({ length: 7 }, (_, i) => addDays(monday, i));
}

function currentStage() {
  const exam = DB.get("examDate");
  const left = Math.max(0, Math.ceil(daysBetween(todayStr(), exam) / 7));
  for (const s of PLAN_STAGES) if (left >= s.minWeeksLeft) return { stage: s, weeksLeft: left };
  return { stage: PLAN_STAGES[PLAN_STAGES.length - 1], weeksLeft: left };
}

function renderHome() {
  const t = todayStr();
  $("today-date").textContent = t;

  // 学习计划
  const { stage, weeksLeft } = currentStage();
  $("plan-stage").textContent = stage.name;
  $("plan-meta").textContent = `本阶段重点：${stage.focus} · 距考试约 ${weeksLeft} 周`;
  const start = DB.get("startDate"), exam = DB.get("examDate");
  const total = Math.max(1, daysBetween(start, exam));
  const passed = Math.min(total, Math.max(0, daysBetween(start, t)));
  $("plan-bar-fill").style.width = Math.round((passed / total) * 100) + "%";

  // 打卡 / 连续天数
  $("streak-days").textContent = computeStreak();
  const week = weekDates();
  const days = DB.get("days", {});
  const weekDone = week.filter((d) => days[d] && days[d].checked).length;
  $("week-done").textContent = weekDone;
  const labels = ["一", "二", "三", "四", "五", "六", "日"];
  $("week-dots").innerHTML = week
    .map((d, i) => {
      const done = days[d] && days[d].checked ? "done" : "";
      const today = d === t ? "today" : "";
      return `<div class="dot ${done} ${today}">${labels[i]}</div>`;
    })
    .join("");

  // 今日任务（先同步联动打勾）
  syncAutoTasks();
  const rec = getDayRecord(t);
  const tasks = todaysTasks(t);
  const prog = {
    vocab: `${rec.newWords || 0}/${TASK_GOALS.vocab}`,
    review: `${rec.reviewWords || 0}/${TASK_GOALS.review}`,
    test: `${rec.tests || 0}/${TASK_GOALS.test}`,
    writing: `${rec.essays || 0}/${TASK_GOALS.writing}`
  };
  $("task-list").innerHTML = tasks
    .map((task) => {
      const done = rec.tasks[task.id];
      const p = prog[task.id] ? `<span class="muted"> （${prog[task.id]}）</span>` : "";
      return `<li data-task="${task.id}">
        <div class="task-check ${done ? "checked" : ""}" data-toggle="1">${done ? "✓" : ""}</div>
        <div class="task-text ${done ? "done" : ""}">${task.text}${p}</div>
        <span class="task-go">去做 ›</span>
      </li>`;
    })
    .join("");

  const allDone = tasks.every((task) => rec.tasks[task.id]);
  const btn = $("checkin-btn");
  if (rec.checked) {
    btn.textContent = "今日已打卡 🎉";
    btn.disabled = true;
    $("checkin-hint").textContent = "做得好，明天见！";
  } else {
    btn.textContent = "完成今日打卡 ✅";
    btn.disabled = false;
    $("checkin-hint").textContent = allDone
      ? "今日任务全部完成，点击打卡！"
      : "完成全部任务后再打卡效果更好（也可直接打卡）。";
  }
}

// 每日任务 → 对应模块入口
const TASK_GOTO = {
  vocab: () => { go("words"); showWordsTab("study"); },
  test: () => { go("words"); showWordsTab("test"); },
  review: () => { go("words"); showWordsTab("study"); },
  writing: () => { go("writing"); }
};

function bindHome() {
  $("task-list").addEventListener("click", (e) => {
    const li = e.target.closest("li[data-task]");
    if (!li) return;
    const id = li.dataset.task;
    if (e.target.closest("[data-toggle]")) {
      // 点勾选框 = 手动切换完成状态
      const t = todayStr();
      const rec = getDayRecord(t);
      rec.tasks[id] = !rec.tasks[id];
      setDayRecord(t, rec);
      renderHome();
    } else if (TASK_GOTO[id]) {
      // 点其余区域 = 去完成这件事
      TASK_GOTO[id]();
    }
  });
  $("checkin-btn").addEventListener("click", () => {
    const t = todayStr();
    const rec = getDayRecord(t);
    rec.checked = true;
    setDayRecord(t, rec);
    renderHome();
  });
}

/* ===================== 单词 (C) ===================== */
function studiedWords() {
  const st = DB.get("wordStatus", {});
  return SEED_WORDS.filter((w) => st[w.word]);
}

/* ----- 间隔复习 (SRS) ----- */
const SRS_INTERVALS = [5, 10, 25, 60, 120]; // 再现间隔（卡片数）：level0(不认识)5张、level1(刚学会)10张，越熟越长

function getSrs() {
  const s = DB.get("srs", { level: {}, due: {}, step: 0 });
  if (!s.level) s.level = {};
  if (!s.due) s.due = {};
  if (typeof s.step !== "number") s.step = 0;
  return s;
}

// 记一次背词结果：不认识→归零、很快再来；认识→升级、间隔拉长
function scheduleWord(word, status) {
  const s = getSrs();
  s.step += 1;
  if (status === "known") {
    const lv = Math.min((s.level[word] || 0) + 1, 4);
    s.level[word] = lv;
    s.due[word] = s.step + SRS_INTERVALS[lv];
  } else {
    s.level[word] = 0;
    s.due[word] = s.step + SRS_INTERVALS[0];
  }
  DB.set("srs", s);
}

// 选下一张：1) 到点该复习的弱词优先 2) 否则引入新词 3) 否则挑最快到点的
function nextWordIndex() {
  const s = getSrs();
  const step = s.step;
  const indexOf = {};
  SEED_WORDS.forEach((w, i) => (indexOf[w.word] = i));
  let best = null;
  Object.keys(s.level).forEach((word) => {
    if (indexOf[word] === undefined) return;
    const due = s.due[word] !== undefined ? s.due[word] : 0;
    if (due <= step && (!best || due < best.due || (due === best.due && s.level[word] < best.level))) {
      best = { word, due, level: s.level[word] };
    }
  });
  if (best) return indexOf[best.word];
  for (let i = 0; i < SEED_WORDS.length; i++) {
    if (s.level[SEED_WORDS[i].word] === undefined) return i;
  }
  let soon = null;
  Object.keys(s.level).forEach((word) => {
    if (indexOf[word] === undefined) return;
    const due = s.due[word] !== undefined ? s.due[word] : 0;
    if (!soon || due < soon.due) soon = { word, due };
  });
  return soon ? indexOf[soon.word] : 0;
}

function weakCount() {
  const s = getSrs();
  return Object.keys(s.level).filter((w) => s.level[w] <= 1).length;
}

function renderCard() {
  let idx = DB.get("wordIndex", 0) % SEED_WORDS.length;
  const w = SEED_WORDS[idx];
  $("flashcard").classList.remove("flipped");
  $("word-ai").innerHTML = "";
  $("card-word").textContent = w.word;
  $("card-pos").textContent = w.pos;
  $("card-cn").textContent = w.cn;
  $("card-ex").textContent = w.ex;
  const s = getSrs();
  const isReview = s.level[w.word] !== undefined && s.level[w.word] <= 1;
  $("review-badge").classList.toggle("hidden", !isReview);
  const learned = studiedWords().length;
  $("card-progress").textContent =
    `第 ${idx + 1} / ${SEED_WORDS.length} 个 · 已学 ${learned} 词 · 待复习 ${weakCount()}`;
}

function markWord(status) {
  let idx = DB.get("wordIndex", 0) % SEED_WORDS.length;
  const w = SEED_WORDS[idx];
  const st = DB.get("wordStatus", {});
  const isNew = !st[w.word];
  st[w.word] = status;
  DB.set("wordStatus", st);
  scheduleWord(w.word, status);
  bumpToday(isNew ? "newWords" : "reviewWords", 1);
  DB.set("wordIndex", nextWordIndex());
  renderCard();
}

/* ----- 单词 AI 讲解（默认走 deepseek-v4-flash）----- */
function buildWordPrompt() {
  return `你是雅思词汇老师，为英语基础一般的中国考生讲解单词。所有英文内容都必须配上中文翻译。只输出一个合法 JSON（不要多余文字、不要 markdown 代码块），结构如下：
{
  "meaning_cn": "中文释义与常见用法（简明）",
  "collocations": [{"en": "常见搭配短语", "cn": "中文翻译"}],
  "synonyms": [{"en": "近义词", "cn": "中文"}],
  "examples": [{"en": "地道英文例句", "cn": "中文翻译"}],
  "ielts_tip_cn": "一句在雅思写作/口语里如何用好它的提示"
}
collocations、synonyms、examples 各给 2–3 条，每条都要有 en 和 cn。`;
}

async function explainWord() {
  const idx = DB.get("wordIndex", 0) % SEED_WORDS.length;
  const w = SEED_WORDS[idx];
  const panel = $("word-ai");
  if (!currentKey()) {
    panel.innerHTML = `<div class="ai-card"><span class="muted">⚠️ 请先到「我的 → 设置」选择提供方并填入 API Key。</span></div>`;
    return;
  }
  const cache = DB.get("wordAI", {});
  // 只用带翻译的新版缓存(_v===2)；旧缓存自动忽略并重新生成
  if (cache[w.word] && cache[w.word]._v === 2) { renderWordAI(w.word, cache[w.word]); return; }
  panel.innerHTML = `<div class="ai-card ai-loading">AI 讲解中…（${w.word}）</div>`;
  try {
    const dsModel = DB.get("provider", "deepseek") === "deepseek"
      ? DB.get("deepseekWordModel", "deepseek-v4-flash")
      : undefined;
    const text = await callLLM(buildWordPrompt(), `单词：${w.word}（${w.pos}，参考释义：${w.cn}）`, dsModel);
    const data = extractJSON(text);
    if (!data) throw new Error("无法解析返回内容。原始：\n" + text.slice(0, 400));
    data._v = 2; // 标记为带翻译的新版
    cache[w.word] = data;
    DB.set("wordAI", cache);
    renderWordAI(w.word, data);
  } catch (err) {
    panel.innerHTML = `<div class="ai-card"><b>讲解失败 😕</b><div class="muted" style="white-space:pre-wrap;margin-top:6px">${escapeHTML(err.message || err)}</div></div>`;
  }
}

function renderWordAI(word, d) {
  const idx = DB.get("wordIndex", 0) % SEED_WORDS.length;
  if (SEED_WORDS[idx].word !== word) return; // 已切到别的词，不覆盖
  // 兼容：每项可能是字符串(旧缓存)或 {en, cn}(新)
  const inline = (item) => {
    if (typeof item === "string") return escapeHTML(item);
    if (item && item.en) return item.cn ? `${escapeHTML(item.en)}（${escapeHTML(item.cn)}）` : escapeHTML(item.en);
    return "";
  };
  const exLi = (item) => {
    if (typeof item === "string") return `<li>${escapeHTML(item)}</li>`;
    if (item && item.en) return `<li>${escapeHTML(item.en)}${item.cn ? `<br><span class="muted">${escapeHTML(item.cn)}</span>` : ""}</li>`;
    return "";
  };
  const colLi = (item) => {
    if (typeof item === "string") return `<li>${escapeHTML(item)}</li>`;
    if (item && item.en) return `<li>${escapeHTML(item.en)}${item.cn ? ` —— ${escapeHTML(item.cn)}` : ""}</li>`;
    return "";
  };
  $("word-ai").innerHTML = `<div class="ai-card">
    ${d.meaning_cn ? `<div class="ai-sec"><b>释义</b>：${escapeHTML(d.meaning_cn)}</div>` : ""}
    ${d.collocations && d.collocations.length ? `<div class="ai-sec"><b>搭配</b><ul class="sug-list">${d.collocations.map(colLi).join("")}</ul></div>` : ""}
    ${d.synonyms && d.synonyms.length ? `<div class="ai-sec"><b>近义词</b>：${d.synonyms.map(inline).filter(Boolean).join("、")}</div>` : ""}
    ${d.examples && d.examples.length ? `<div class="ai-sec"><b>例句</b><ul class="sug-list">${d.examples.map(exLi).join("")}</ul></div>` : ""}
    ${d.ielts_tip_cn ? `<div class="ai-sec"><b>雅思贴士</b>：${escapeHTML(d.ielts_tip_cn)}</div>` : ""}
    <button class="link-btn" id="ai-regen">重新生成</button>
  </div>`;
  $("ai-regen").addEventListener("click", () => {
    const cache = DB.get("wordAI", {});
    delete cache[word];
    DB.set("wordAI", cache);
    explainWord();
  });
}

// 朗读单个单词（浏览器自带语音，优先英音）
function speakWord(text) {
  if (!window.speechSynthesis) return;
  speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(text);
  u.rate = 0.9;
  u.pitch = 1;
  const vs = speechSynthesis.getVoices() || [];
  const v = vs.find((x) => /en-GB/i.test(x.lang)) || vs.find((x) => /^en/i.test(x.lang));
  if (v) { u.voice = v; u.lang = v.lang; } else { u.lang = "en-GB"; }
  speechSynthesis.speak(u);
}

// 切换单词页子标签（背单词 / 单词测试），供导航跳转复用
function showWordsTab(tab) {
  document.querySelectorAll("[data-words-tab]").forEach((x) =>
    x.classList.toggle("active", x.dataset.wordsTab === tab)
  );
  $("words-study").classList.toggle("hidden", tab !== "study");
  $("words-test").classList.toggle("hidden", tab !== "test");
  if (tab === "study") renderCard();
  if (tab === "test") resetTest();
}

function bindWords() {
  // 子标签切换
  document.querySelectorAll("[data-words-tab]").forEach((b) =>
    b.addEventListener("click", () => showWordsTab(b.dataset.wordsTab))
  );
  $("flashcard").addEventListener("click", () => $("flashcard").classList.toggle("flipped"));
  $("pronounce-btn").addEventListener("click", (e) => {
    e.stopPropagation(); // 不触发翻卡
    const idx = DB.get("wordIndex", 0) % SEED_WORDS.length;
    speakWord(SEED_WORDS[idx].word);
  });
  $("know-yes").addEventListener("click", () => markWord("known"));
  $("know-no").addEventListener("click", () => markWord("unknown"));
  $("ai-explain").addEventListener("click", explainWord);
  $("test-start").addEventListener("click", startTest);
}

/* ----- 单词测试 (C2) ----- */
let quiz = null;
function resetTest() {
  $("test-intro").classList.remove("hidden");
  $("test-quiz").classList.add("hidden");
  $("test-result").classList.add("hidden");
}
function shuffle(arr) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
function startTest() {
  let pool = studiedWords();
  if (pool.length < 4) pool = SEED_WORDS.slice(); // 学过的不够，用全库
  const n = Math.min(10, pool.length);
  const picked = shuffle(pool).slice(0, n);
  quiz = {
    questions: picked.map((w) => {
      const distractors = shuffle(SEED_WORDS.filter((x) => x.word !== w.word)).slice(0, 3);
      const options = shuffle([w, ...distractors]);
      return { word: w, options, answer: null };
    }),
    i: 0,
    score: 0,
    wrong: []
  };
  $("test-intro").classList.add("hidden");
  $("test-result").classList.add("hidden");
  $("test-quiz").classList.remove("hidden");
  renderQuestion();
}
function renderQuestion() {
  const q = quiz.questions[quiz.i];
  $("test-quiz").innerHTML = `
    <div class="q-card">
      <div class="q-num">第 ${quiz.i + 1} / ${quiz.questions.length} 题 · 选出正确的中文释义</div>
      <div class="q-word">${q.word.word} <span class="word-pos">${q.word.pos}</span></div>
      <div id="opts"></div>
    </div>`;
  const box = $("opts");
  q.options.forEach((opt) => {
    const b = document.createElement("button");
    b.className = "opt";
    b.textContent = opt.cn;
    b.onclick = () => answer(opt, b);
    box.appendChild(b);
  });
}
function answer(opt, btn) {
  const q = quiz.questions[quiz.i];
  if (q.answer) return;
  q.answer = opt;
  const buttons = $("opts").querySelectorAll(".opt");
  buttons.forEach((b) => {
    b.disabled = true;
    if (b.textContent === q.word.cn) b.classList.add("correct");
  });
  if (opt.word === q.word.word) {
    quiz.score++;
  } else {
    btn.classList.add("wrong");
    quiz.wrong.push(q.word);
    // 错词标记为不认识，并进入高频复习队列
    const st = DB.get("wordStatus", {});
    st[q.word.word] = "unknown";
    DB.set("wordStatus", st);
    scheduleWord(q.word.word, "unknown");
  }
  setTimeout(() => {
    quiz.i++;
    if (quiz.i < quiz.questions.length) renderQuestion();
    else showTestResult();
  }, 800);
}
function showTestResult() {
  $("test-quiz").classList.add("hidden");
  $("test-result").classList.remove("hidden");
  bumpToday("tests", 1);
  const ts = DB.get("testStats", { correct: 0, total: 0 });
  ts.correct += quiz.score;
  ts.total += quiz.questions.length;
  DB.set("testStats", ts);
  const total = quiz.questions.length;
  const wrongHtml = quiz.wrong.length
    ? `<div class="card"><div class="card-title">错词复习</div><ul class="sug-list">${quiz.wrong
        .map((w) => `<li><b>${w.word}</b> ${w.pos} —— ${w.cn}</li>`)
        .join("")}</ul></div>`
    : `<div class="card"><p class="muted">全对，太棒了！🎉</p></div>`;
  $("test-result").innerHTML = `
    <div class="card">
      <div class="result-score">${quiz.score} / ${total}</div>
      <p class="muted" style="text-align:center">正确率 ${Math.round((quiz.score / total) * 100)}%</p>
      <button class="btn btn-primary" id="test-again-btn">再测一次</button>
    </div>
    ${wrongHtml}`;
  $("test-again-btn").addEventListener("click", resetTest);
}

/* ===================== 作文批改 (E) ===================== */
let currentTask = "task2";

function wordCountOf(text) {
  return text.trim().split(/\s+/).filter(Boolean).length;
}

// 雅思真实字数要求：Task 1 ≥ 150 词，Task 2 ≥ 250 词
function updateWordCount() {
  const words = wordCountOf($("essay-text").value);
  const min = currentTask === "task1" ? 150 : 250;
  const taskLabel = currentTask === "task1" ? "Task 1" : "Task 2";
  const el = $("word-count");
  el.classList.remove("count-low", "count-ok");
  if (words === 0) {
    el.textContent = `建议 ≥ ${min} 词（${taskLabel}）`;
  } else if (words < min) {
    el.textContent = `${words} 词 · 建议 ≥ ${min}（还差 ${min - words}）`;
    el.classList.add("count-low");
  } else {
    el.textContent = `${words} 词 · 达到 ${min} ✓`;
    el.classList.add("count-ok");
  }
}

function bindWriting() {
  document.querySelectorAll("[data-task]").forEach((b) =>
    b.addEventListener("click", () => {
      document.querySelectorAll("[data-task]").forEach((x) => x.classList.remove("active"));
      b.classList.add("active");
      currentTask = b.dataset.task;
      updateWordCount();
    })
  );
  $("essay-text").addEventListener("input", updateWordCount);
  $("essay-prompt").addEventListener("input", () => $("prompt-note").classList.add("hidden"));
  $("pick-prompt").addEventListener("click", () => {
    const list = (typeof WRITING_PROMPTS !== "undefined" && WRITING_PROMPTS[currentTask]) || [];
    if (!list.length) return;
    $("essay-prompt").value = list[Math.floor(Math.random() * list.length)];
    $("prompt-note").classList.remove("hidden");
  });
  $("clear-history").addEventListener("click", () => {
    if (confirm("确定清空所有批改记录？此操作不可撤销。")) {
      DB.set("essays", []);
      renderHistory();
    }
  });
  $("grade-btn").addEventListener("click", gradeEssay);
  updateWordCount();
}

function buildSystemPrompt(task) {
  const firstDim =
    task === "task1"
      ? '"key":"TA","name":"Task Achievement"'
      : '"key":"TR","name":"Task Response"';
  return `你是一位经验丰富、持证的雅思写作考官。请根据官方雅思写作评分标准，为考生的 ${
    task === "task1" ? "Writing Task 1" : "Writing Task 2"
  } 作文打分。
四个评分维度：Task ${task === "task1" ? "Achievement" : "Response"} / Coherence and Cohesion / Lexical Resource / Grammatical Range and Accuracy。
分数用 0–9，允许 .5 的档位（如 6.0、6.5）。total/overall 取四项的合理综合（一般为平均后按 0.5 取整）。
评语要中英结合、具体可操作，指出问题并给修改方向。

只输出一个合法的 JSON 对象，不要任何多余文字、不要 markdown 代码块，结构严格如下：
{
  "overall": 数字,
  "dimensions": [
    {${firstDim},"band":数字,"cn":"中文评语","en":"English comment"},
    {"key":"CC","name":"Coherence and Cohesion","band":数字,"cn":"...","en":"..."},
    {"key":"LR","name":"Lexical Resource","band":数字,"cn":"...","en":"..."},
    {"key":"GRA","name":"Grammatical Range and Accuracy","band":数字,"cn":"...","en":"..."}
  ],
  "summary_cn": "一段总体点评（中文）",
  "suggestions": ["具体改进建议1（中英结合）", "建议2", "建议3"],
  "improved_examples": ["把原文某句改得更地道的示范1", "示范2"]
}`;
}

function extractJSON(text) {
  let t = text.trim();
  t = t.replace(/^```(json)?/i, "").replace(/```$/, "").trim();
  try {
    return JSON.parse(t);
  } catch (e) {
    const m = t.match(/\{[\s\S]*\}/);
    if (m) {
      try { return JSON.parse(m[0]); } catch (e2) {}
    }
  }
  return null;
}

// 当前所选提供方的 API Key
function currentKey() {
  return DB.get("provider", "deepseek") === "deepseek"
    ? DB.get("deepseekKey", "")
    : DB.get("claudeKey", DB.get("apiKey", ""));
}

// HTML 转义：模型/本地内容插入页面前一律走它，防止 XSS
function escapeHTML(s) {
  return String(s == null ? "" : s).replace(/[&<>"']/g, (c) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
}
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// 把 HTTP 状态/原始响应转成给普通用户看的友好提示（不甩超长原文）
function friendlyApiError(status, raw) {
  const map = {
    400: "请求有误（400），可能是模型 ID 填错了。",
    401: "API Key 无效或未授权（401）。",
    402: "额度或付费问题（402），可能需要充值/升级套餐。",
    403: "没有访问权限（403）。",
    429: "请求太频繁（429），稍等片刻再试。"
  };
  let msg = map[status] || (status >= 500 ? `AI 服务暂时不可用（${status}），稍后再试。` : `请求出错（${status}）。`);
  try {
    const j = JSON.parse(raw);
    const m = (j.error && (j.error.message || (typeof j.error === "string" ? j.error : ""))) ||
              (j.detail && (j.detail.message || (typeof j.detail === "string" ? j.detail : "")));
    if (m) msg += " " + String(m).slice(0, 160);
  } catch (e) {}
  return msg;
}

// 调用大模型（按提供方构造请求并解析返回）。带超时 + 轻量重试 + 友好错误。
async function callLLM(sys, userMsg, deepseekModelOverride) {
  const provider = DB.get("provider", "deepseek");
  let url, headers, body;
  if (provider === "deepseek") {
    url = "https://api.deepseek.com/v1/chat/completions";
    headers = {
      "content-type": "application/json",
      Authorization: "Bearer " + DB.get("deepseekKey", "")
    };
    body = {
      model: deepseekModelOverride || DB.get("deepseekModel", "deepseek-v4-pro"),
      max_tokens: 4096,
      messages: [
        { role: "system", content: sys },
        { role: "user", content: userMsg }
      ]
    };
  } else {
    url = "https://api.anthropic.com/v1/messages";
    headers = {
      "content-type": "application/json",
      "x-api-key": DB.get("claudeKey", DB.get("apiKey", "")),
      "anthropic-version": "2023-06-01",
      "anthropic-dangerous-direct-browser-access": "true"
    };
    body = {
      model: DB.get("claudeModel", "claude-sonnet-4-6"),
      max_tokens: 4096,
      system: sys,
      messages: [{ role: "user", content: userMsg }]
    };
  }

  const TIMEOUT_MS = 75000;
  let lastErr;
  for (let attempt = 0; attempt < 2; attempt++) {
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), TIMEOUT_MS);
    let resp;
    try {
      resp = await fetch(url, { method: "POST", headers, body: JSON.stringify(body), signal: ctrl.signal });
    } catch (e) {
      clearTimeout(timer);
      if (e && e.name === "AbortError") throw new Error("请求超时（约 75 秒无响应），请检查网络后重试。");
      lastErr = new Error("网络请求失败：可能是断网，或浏览器跨域(CORS)被拦。");
      if (attempt === 0) { await sleep(1500); continue; }
      throw lastErr;
    }
    clearTimeout(timer);
    const raw = await resp.text();
    if (!resp.ok) {
      if ((resp.status === 429 || resp.status >= 500) && attempt === 0) { await sleep(1500); continue; }
      throw new Error(friendlyApiError(resp.status, raw));
    }
    let data;
    try {
      data = JSON.parse(raw);
    } catch (e) {
      throw new Error("AI 返回的不是合法 JSON，可能是服务异常，请重试。");
    }
    const content =
      provider === "deepseek"
        ? data.choices && data.choices[0] && data.choices[0].message && data.choices[0].message.content
        : data.content && data.content[0] && data.content[0].text;
    if (!content) throw new Error("AI 未返回正文内容，请重试或在设置里换个模型。");
    return content;
  }
  throw lastErr || new Error("请求失败，请重试。");
}

// 校验作文评分结果；返回 null 表示合格，否则返回错误说明。会就地补 key、重算 overall。
function validateGrade(r, task) {
  if (!r || !Array.isArray(r.dimensions)) return "缺少评分维度";
  const firstKey = task === "task1" ? "TA" : "TR";
  const need = [firstKey, "CC", "LR", "GRA"];
  const okBand = (b) => typeof b === "number" && b >= 0 && b <= 9 && Math.round(b * 2) === b * 2;
  // 模型没给 key 但恰好 4 项时，按标准顺序补 key
  if (r.dimensions.length === 4 && r.dimensions.some((d) => !d || !d.key)) {
    r.dimensions.forEach((d, i) => { if (d && !d.key) d.key = need[i]; });
  }
  const bands = [];
  for (const k of need) {
    const d = r.dimensions.find((x) => x && x.key === k);
    if (!d) return `缺少维度 ${k}`;
    const b = Number(d.band);
    if (!okBand(b)) return `${k} 分数不合法`;
    d.band = b;
    bands.push(b);
  }
  const avg = Math.round((bands.reduce((a, b) => a + b, 0) / bands.length) * 2) / 2;
  r.overall = okBand(Number(r.overall)) ? Number(r.overall) : avg;
  return null;
}

async function gradeEssay() {
  const prompt = $("essay-prompt").value.trim();
  const essay = $("essay-text").value.trim();
  const hint = $("grade-hint");

  if (!currentKey()) {
    hint.textContent = "⚠️ 请先到「我的 → 设置」选择 AI 提供方并填入对应 API Key。";
    go("me");
    return;
  }
  if (essay.length < 20) {
    hint.textContent = "⚠️ 作文内容太短，请贴入完整作文。";
    return;
  }
  hint.textContent = "";

  $("overlay").classList.remove("hidden");
  $("overlay-text").textContent = "AI 正在按雅思标准批改…";

  const userMsg = `题目（Prompt）：\n${prompt || "(未提供题目)"}\n\n考生作文（Essay）：\n${essay}`;

  try {
    const text = await callLLM(buildSystemPrompt(currentTask), userMsg);
    const result = extractJSON(text);
    const verr = validateGrade(result, currentTask);
    if (verr) {
      throw new Error("AI 返回的评分格式不完整（" + verr + "），请重试。");
    }

    // 保存历史
    const essays = DB.get("essays", []);
    const record = {
      date: todayStr(),
      ts: new Date().toLocaleString(),
      task: currentTask,
      prompt,
      essay,
      result
    };
    essays.unshift(record);
    DB.set("essays", essays);
    bumpToday("essays", 1);

    renderGradeResult(record);
  } catch (err) {
    renderGradeError(err.message || String(err));
  } finally {
    $("overlay").classList.add("hidden");
  }
}

function renderGradeResult(record) {
  const r = record.result;
  $("writing-form").classList.add("hidden");
  const view = $("grade-result");
  view.classList.remove("hidden");
  const dims = (r.dimensions || [])
    .map(
      (d) => `<div class="dim-row">
        <div class="dim-head"><span>${escapeHTML(d.name)}</span><span class="dim-band">${escapeHTML(d.band)}</span></div>
        <div class="dim-comment">${escapeHTML(d.cn || "")}<span class="en">${escapeHTML(d.en || "")}</span></div>
      </div>`
    )
    .join("");
  const sugs = (r.suggestions || []).map((s) => `<li>${escapeHTML(s)}</li>`).join("");
  const examples = (r.improved_examples || []).map((s) => `<li>${escapeHTML(s)}</li>`).join("");
  view.innerHTML = `
    <div class="card">
      <div class="overall-band">
        <div class="num">${escapeHTML(r.overall)}</div>
        <div class="lbl">Overall Band · ${record.task === "task1" ? "Task 1" : "Task 2"}</div>
      </div>
      ${dims}
    </div>
    ${r.summary_cn ? `<div class="card"><div class="card-title">总体点评</div><p>${escapeHTML(r.summary_cn)}</p></div>` : ""}
    ${sugs ? `<div class="card"><div class="card-title">改进建议</div><ul class="sug-list">${sugs}</ul></div>` : ""}
    ${examples ? `<div class="card"><div class="card-title">更地道的表达</div><ul class="sug-list">${examples}</ul></div>` : ""}
    <button class="btn btn-primary" id="back-writing-btn">返回 / 再批改一篇</button>`;
  view.querySelector("#back-writing-btn").addEventListener("click", backToWriting);
}

function renderGradeError(msg) {
  $("writing-form").classList.add("hidden");
  const view = $("grade-result");
  view.classList.remove("hidden");
  view.innerHTML = `
    <div class="card">
      <div class="card-title">批改失败 😕</div>
      <p class="muted" style="white-space:pre-wrap">${escapeHTML(msg)}</p>
      <p class="muted">常见原因：API Key 不对、网络问题、或额度不足；检查后重试即可。</p>
      <button class="btn btn-primary" id="err-back-btn">返回</button>
    </div>`;
  view.querySelector("#err-back-btn").addEventListener("click", backToWriting);
}

function backToWriting() {
  $("grade-result").classList.add("hidden");
  $("writing-form").classList.remove("hidden");
  renderHistory();
}

function renderHistory() {
  const essays = DB.get("essays", []);
  const list = $("essay-history");
  $("clear-history").classList.toggle("hidden", essays.length === 0);
  if (!essays.length) {
    list.innerHTML = `<li class="muted" style="cursor:default">还没有批改记录。</li>`;
    renderTrend();
    return;
  }
  list.innerHTML = essays
    .map(
      (e, i) => `<li data-idx="${i}">
        <span class="hist-main">${e.ts} · ${e.task === "task1" ? "Task 1" : "Task 2"}</span>
        <span class="hist-right"><span class="history-band">${e.result.overall}</span>
        <button class="del-btn" data-del="${i}" title="删除">🗑️</button></span>
      </li>`
    )
    .join("");
  list.querySelectorAll("li[data-idx]").forEach((li) =>
    li.addEventListener("click", () => {
      const rec = DB.get("essays", [])[Number(li.dataset.idx)];
      if (rec) renderGradeResult(rec);
    })
  );
  list.querySelectorAll(".del-btn").forEach((b) =>
    b.addEventListener("click", (ev) => {
      ev.stopPropagation();
      const arr = DB.get("essays", []);
      arr.splice(Number(b.dataset.del), 1);
      DB.set("essays", arr);
      renderHistory();
    })
  );
  renderTrend();
}

// 分数趋势：手写 SVG，画历次总分(overall band)走势
function renderTrend() {
  const essays = DB.get("essays", []);
  const el = $("trend");
  if (essays.length < 2) {
    el.innerHTML = `<p class="muted">多练几篇（≥2 篇）就能看到总分走势啦。</p>`;
    return;
  }
  const bands = essays.map((e) => Number(e.result.overall)).reverse(); // 旧→新
  const n = bands.length;
  const W = 300, H = 120, padX = 24, padY = 20;
  let lo = Math.max(0, Math.min.apply(null, bands) - 0.5);
  let hi = Math.min(9, Math.max.apply(null, bands) + 0.5);
  if (hi - lo < 1) hi = Math.min(9, lo + 1);
  const x = (i) => padX + (n === 1 ? 0 : (i * (W - 2 * padX)) / (n - 1));
  const y = (b) => H - padY - ((b - lo) / (hi - lo)) * (H - 2 * padY);
  const pts = bands.map((b, i) => `${x(i).toFixed(1)},${y(b).toFixed(1)}`).join(" ");
  const dots = bands
    .map(
      (b, i) =>
        `<circle cx="${x(i).toFixed(1)}" cy="${y(b).toFixed(1)}" r="3.5" fill="var(--accent)"/>` +
        `<text x="${x(i).toFixed(1)}" y="${(y(b) - 8).toFixed(1)}" font-size="11" text-anchor="middle" fill="var(--ink)">${b}</text>`
    )
    .join("");
  el.innerHTML =
    `<svg viewBox="0 0 ${W} ${H}" width="100%" preserveAspectRatio="xMidYMid meet">` +
    `<polyline points="${pts}" fill="none" stroke="var(--accent)" stroke-width="2"/>${dots}</svg>` +
    `<p class="muted" style="text-align:center">最近 ${n} 篇总分走势（左旧→右新）</p>`;
}

/* ===================== 口语 (文字作答 + AI 反馈) ===================== */
let speakState = null;      // { part, data, submitted }
let speakTimerId = null;
let speakPart = 1;

function clearSpeakTimer() {
  if (speakTimerId) { clearInterval(speakTimerId); speakTimerId = null; }
}

// 出题提示词（走 flash）
function buildSpeakQuestionPrompt(part, topic) {
  const t = topic ? `话题：${topic}。` : "话题请你选一个贴近雅思的常见话题。";
  if (part === 2) {
    return `你是雅思口语考官。出一道 Part 2 话题卡(cue card)。${t}只输出合法 JSON（无多余文字、无 markdown 代码块）：
{"part":2,"topic":"英文话题词","cue_card":{"title":"Describe ...","bullets":["You should say:","...","...","and explain ..."]}}`;
  }
  const kind = part === 1 ? "Part 1 日常问答（贴近生活、简短）" : "Part 3 深入讨论（更抽象、需展开论述）";
  return `你是雅思口语考官。出一组 ${kind} 题目，共 3–4 个。${t}只输出合法 JSON（无多余文字、无 markdown 代码块）：
{"part":${part},"topic":"英文话题词","questions":["英文问题1","英文问题2","英文问题3"]}`;
}

async function genSpeak() {
  if (!currentKey()) { $("speak-hint").textContent = "⚠️ 请先到「我的 → 设置」选择提供方并填入 API Key。"; go("me"); return; }
  $("speak-gen").disabled = true;
  $("speak-hint").textContent = "AI 出题中…";
  try {
    const dsModel = DB.get("provider", "deepseek") === "deepseek" ? DB.get("deepseekWordModel", "deepseek-v4-flash") : undefined;
    const text = await callLLM(buildSpeakQuestionPrompt(speakPart, $("speak-topic").value.trim()), "请出题。", dsModel);
    const data = extractJSON(text);
    if (!data || (!data.questions && !data.cue_card)) throw new Error("无法解析返回内容，请重试。");
    speakState = { part: speakPart, data, submitted: false };
    renderSpeakPractice();
  } catch (e) {
    $("speak-hint").textContent = "出题失败：" + (e.message || e);
  } finally {
    $("speak-gen").disabled = false;
  }
}

function renderSpeakPractice() {
  const st = speakState, d = st.data;
  $("speak-setup").classList.add("hidden");
  const wrap = $("speak-practice");
  wrap.classList.remove("hidden");
  let qHtml;
  if (st.part === 2 && d.cue_card) {
    const bullets = (d.cue_card.bullets || []).map((b) => `<li>${escapeHTML(b)}</li>`).join("");
    qHtml = `<div class="card-title">🎤 ${escapeHTML(d.cue_card.title || "Part 2")}</div>
      <ul class="sug-list">${bullets}</ul>
      <div class="row" style="margin-top:8px">
        <button class="btn btn-ghost" id="speak-timer-btn">▶ 开始计时</button>
        <span class="muted" id="speak-timer" style="align-self:center">准备 1 分钟 + 作答 2 分钟</span>
      </div>`;
  } else {
    const qs = (d.questions || []).map((q) => `<li>${escapeHTML(q)}</li>`).join("");
    qHtml = `<div class="card-title">🎤 Part ${st.part}${d.topic ? " · " + escapeHTML(d.topic) : ""}</div>
      <ol class="sug-list">${qs}</ol>`;
  }
  wrap.innerHTML = `
    <div class="card">
      <div class="hint">AI 生成练习题 · 非真题</div>
      ${qHtml}
    </div>
    <div class="card">
      <label class="field-label">你的回答（打字，把要说的写出来）</label>
      <textarea id="speak-answer" class="ta" rows="8" placeholder="把你的口语回答写在这里…"></textarea>
      <div class="row-between">
        <span class="muted">⚠️ 文字版不评发音</span>
        <button class="btn btn-primary" id="speak-submit">提交，获取反馈</button>
      </div>
      <div class="hint" id="speak-fb-hint"></div>
    </div>
    <div id="speak-feedback"></div>
    <button class="btn btn-ghost" id="speak-again" style="margin-top:6px">换一题</button>`;
  if ($("speak-timer-btn")) $("speak-timer-btn").addEventListener("click", startSpeakTimer);
  $("speak-submit").addEventListener("click", submitSpeak);
  $("speak-again").addEventListener("click", () => {
    clearSpeakTimer();
    speakState = null;
    $("speak-practice").classList.add("hidden");
    $("speak-setup").classList.remove("hidden");
    $("speak-hint").textContent = "AI 生成练习题 · 非真题。Part 2 会给 1 分钟准备 + 作答计时。";
  });
}

function startSpeakTimer() {
  clearSpeakTimer();
  let phase = "prep", remain = 60;
  const render = () => { const el = $("speak-timer"); if (!el) { clearSpeakTimer(); return; } el.textContent = `${phase === "prep" ? "准备" : "作答"} 剩 ${remain}s`; };
  render();
  speakTimerId = setInterval(() => {
    remain--;
    if (remain < 0) {
      if (phase === "prep") { phase = "answer"; remain = 120; }
      else { clearSpeakTimer(); const el = $("speak-timer"); if (el) el.textContent = "时间到，可提交"; return; }
    }
    render();
  }, 1000);
}

function buildSpeakFeedbackPrompt() {
  return `你是经验丰富、持证的雅思口语考官。根据题目和考生的【文字作答】，按雅思口语评分维度给反馈。
重要：这是文字作答、没有录音，因此【发音 Pronunciation】无法评判——绝不要给发音分数，也不要编造。
只输出合法 JSON（无多余文字、无 markdown 代码块），结构如下：
{
  "bands": [
    {"key":"FC","name":"Fluency & Coherence","band":数字,"cn":"中文点评"},
    {"key":"LR","name":"Lexical Resource","band":数字,"cn":"中文点评"},
    {"key":"GRA","name":"Grammatical Range & Accuracy","band":数字,"cn":"中文点评"}
  ],
  "overall": 数字,
  "suggestions": ["改进建议（中英结合、具体）", "..."],
  "sample_answer": "一段更高分的英文示范回答"
}
分数用 0–9，允许 .5。`;
}

// 校验口语反馈；返回 null 合格，否则错误说明。补 key、重算 overall。
function validateSpeak(r) {
  if (!r || !Array.isArray(r.bands)) return "缺少评分";
  const need = ["FC", "LR", "GRA"];
  const okBand = (b) => typeof b === "number" && b >= 0 && b <= 9 && Math.round(b * 2) === b * 2;
  if (r.bands.length === 3 && r.bands.some((d) => !d || !d.key)) r.bands.forEach((d, i) => { if (d && !d.key) d.key = need[i]; });
  const vals = [];
  for (const k of need) {
    const d = r.bands.find((x) => x && x.key === k);
    if (!d) return `缺少 ${k}`;
    const b = Number(d.band);
    if (!okBand(b)) return `${k} 分数不合法`;
    d.band = b; vals.push(b);
  }
  const avg = Math.round((vals.reduce((a, b) => a + b, 0) / vals.length) * 2) / 2;
  r.overall = okBand(Number(r.overall)) ? Number(r.overall) : avg;
  return null;
}

async function submitSpeak() {
  clearSpeakTimer();
  const ans = $("speak-answer").value.trim();
  const hint = $("speak-fb-hint");
  if (!currentKey()) { hint.textContent = "⚠️ 请先到「我的 → 设置」填入 API Key。"; go("me"); return; }
  if (ans.length < 15) { hint.textContent = "⚠️ 回答太短，多写几句再提交。"; return; }
  hint.textContent = "";
  $("overlay").classList.remove("hidden");
  $("overlay-text").textContent = "AI 正在按口语标准反馈…";
  const d = speakState.data;
  const qText = d.cue_card
    ? (d.cue_card.title + "\n" + (d.cue_card.bullets || []).join("\n"))
    : (d.questions || []).join("\n");
  const userMsg = `Part ${speakState.part} 题目：\n${qText}\n\n考生文字作答：\n${ans}`;
  try {
    const text = await callLLM(buildSpeakFeedbackPrompt(), userMsg); // 反馈走主模型（更准）
    const fb = extractJSON(text);
    const err = validateSpeak(fb);
    if (err) throw new Error("AI 反馈格式不完整（" + err + "），请重试。");
    renderSpeakFeedback(fb);
  } catch (e) {
    $("speak-feedback").innerHTML = `<div class="card"><b>反馈失败 😕</b><div class="muted" style="white-space:pre-wrap;margin-top:6px">${escapeHTML(e.message || e)}</div></div>`;
  } finally {
    $("overlay").classList.add("hidden");
  }
}

function renderSpeakFeedback(fb) {
  const dims = fb.bands
    .map((d) => `<div class="dim-row"><div class="dim-head"><span>${escapeHTML(d.name)}</span><span class="dim-band">${escapeHTML(d.band)}</span></div><div class="dim-comment">${escapeHTML(d.cn || "")}</div></div>`)
    .join("");
  const sugs = (fb.suggestions || []).map((s) => `<li>${escapeHTML(s)}</li>`).join("");
  $("speak-feedback").innerHTML = `
    <div class="card">
      <div class="overall-band"><div class="num">${escapeHTML(fb.overall)}</div><div class="lbl">口语预估 · Part ${speakState.part}</div></div>
      ${dims}
      <div class="dim-comment" style="margin-top:8px">🎙️ 发音(Pronunciation)：文字作答无法评判，需语音，本版不评分。</div>
    </div>
    ${sugs ? `<div class="card"><div class="card-title">改进建议</div><ul class="sug-list">${sugs}</ul></div>` : ""}
    ${fb.sample_answer ? `<div class="card"><div class="card-title">高分示范</div><p>${escapeHTML(fb.sample_answer)}</p></div>` : ""}`;
}

function bindSpeaking() {
  document.querySelectorAll("[data-part]").forEach((b) =>
    b.addEventListener("click", () => {
      document.querySelectorAll("[data-part]").forEach((x) => x.classList.remove("active"));
      b.classList.add("active");
      speakPart = Number(b.dataset.part);
    })
  );
  $("speak-gen").addEventListener("click", genSpeak);
}

/* ===================== 我的 / 设置 (A3 + G1) ===================== */
const DEFAULT_MODEL = { deepseek: "deepseek-v4-pro", claude: "claude-sonnet-4-6" };

// 把某提供方已存的 key/model 载入输入框
function loadProviderFields(provider) {
  if (provider === "deepseek") {
    $("api-key").value = DB.get("deepseekKey", "");
    $("model-name").value = DB.get("deepseekModel", DEFAULT_MODEL.deepseek);
  } else {
    $("api-key").value = DB.get("claudeKey", DB.get("apiKey", ""));
    $("model-name").value = DB.get("claudeModel", DEFAULT_MODEL.claude);
  }
}

function renderMe() {
  const days = DB.get("days", {});
  const checkinDays = Object.values(days).filter((d) => d.checked).length;
  $("stat-checkin").textContent = checkinDays;
  $("stat-words").textContent = studiedWords().length;
  $("stat-essays").textContent = DB.get("essays", []).length;
  $("stat-weak").textContent = weakCount();
  const ts = DB.get("testStats", { correct: 0, total: 0 });
  $("stat-acc").textContent = ts.total ? Math.round((ts.correct / ts.total) * 100) + "%" : "—";
  let week7 = 0;
  for (let i = 0; i < 7; i++) { const d = days[addDays(todayStr(), -i)]; if (d && d.checked) week7++; }
  $("stat-week").textContent = week7 + "/7";
  const provider = DB.get("provider", "deepseek");
  $("provider").value = provider;
  loadProviderFields(provider);
  $("word-model").value = DB.get("deepseekWordModel", "deepseek-v4-flash");
  $("exam-date").value = DB.get("examDate", "2026-09-30");
}

// 保存 AI 设置（提供方/key/模型），返回 provider
function saveAiSettings() {
  const provider = $("provider").value;
  DB.set("provider", provider);
  const key = $("api-key").value.trim();
  const model = $("model-name").value.trim();
  if (provider === "deepseek") {
    DB.set("deepseekKey", key);
    DB.set("deepseekModel", model || DEFAULT_MODEL.deepseek);
  } else {
    DB.set("claudeKey", key);
    DB.set("claudeModel", model || DEFAULT_MODEL.claude);
  }
  DB.set("deepseekWordModel", $("word-model").value.trim() || "deepseek-v4-flash");
  return provider;
}

function flashHint(id, msg, restore) {
  $(id).textContent = msg;
  if (restore) setTimeout(() => { $(id).textContent = restore; }, 2500);
}

const SETTINGS_HINT_DEFAULT = "Key 只存在你这台手机/浏览器本地，不会上传到别处。切换提供方后记得点保存。";
const DATA_HINT_DEFAULT = "导出不含 API Key；清空会删除打卡/单词/作文等所有本地数据，不可恢复。";

function bindMe() {
  $("provider").addEventListener("change", () => loadProviderFields($("provider").value));

  $("save-ai").addEventListener("click", () => {
    const p = saveAiSettings();
    flashHint("settings-hint", `已保存 ✅ 当前提供方：${p === "deepseek" ? "DeepSeek" : "Claude"}`, SETTINGS_HINT_DEFAULT);
  });

  $("test-conn").addEventListener("click", async () => {
    saveAiSettings(); // 先存当前填写再测
    if (!currentKey()) { $("settings-hint").textContent = "⚠️ 请先填入 API Key 再测试。"; return; }
    $("test-conn").disabled = true;
    $("settings-hint").textContent = "测试连接中…";
    try {
      await callLLM("只回复两个字母：OK", "ping");
      flashHint("settings-hint", "✅ 连接成功，AI 有正常响应。", SETTINGS_HINT_DEFAULT);
    } catch (e) {
      $("settings-hint").textContent = "❌ 连接失败：" + (e.message || e);
    } finally {
      $("test-conn").disabled = false;
    }
  });

  $("save-plan").addEventListener("click", () => {
    const exam = $("exam-date").value;
    if (exam) DB.set("examDate", exam);
    flashHint("plan-hint", "已保存 ✅", "用于首页\"距考试 X 周\"和阶段计算。");
  });

  $("clear-key").addEventListener("click", () => {
    const provider = $("provider").value;
    if (provider === "deepseek") DB.set("deepseekKey", ""); else DB.set("claudeKey", "");
    $("api-key").value = "";
    flashHint("data-hint", "已清除当前提供方的 Key。", DATA_HINT_DEFAULT);
  });

  $("export-data").addEventListener("click", () => {
    const clean = Object.assign({}, DB.load());
    delete clean.apiKey; delete clean.deepseekKey; delete clean.claudeKey;
    const blob = new Blob([JSON.stringify(clean, null, 2)], { type: "application/json" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "ielts-buddy-data.json";
    a.click();
    URL.revokeObjectURL(a.href);
    flashHint("data-hint", "已导出（不含 API Key）。", DATA_HINT_DEFAULT);
  });

  $("clear-data").addEventListener("click", () => {
    if (confirm("确定清空全部本地数据？打卡、单词进度、作文历史、API Key 都会删除，且不可恢复。")) {
      localStorage.removeItem(DB.KEY);
      DB._cache = null;
      location.reload();
    }
  });
}

/* ===================== 启动 ===================== */
function bindNav() {
  document.querySelectorAll(".nav-btn").forEach((b) =>
    b.addEventListener("click", () => go(b.dataset.page))
  );
}

document.addEventListener("DOMContentLoaded", () => {
  initState();
  bindNav();
  bindHome();
  bindWords();
  bindWriting();
  bindSpeaking();
  bindMe();
  renderCard();
  go("home");
});
