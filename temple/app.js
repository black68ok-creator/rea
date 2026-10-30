"use strict";

const STORE_KEY = "temple.v1";

const SUTRA = [
  "마하반야바라밀다심경",
  "관자재보살 행심반야바라밀다시",
  "조견오온개공 도일체고액",
  "사리자 색불이공 공불이색",
  "색즉시공 공즉시색",
  "수상행식 역부여시",
  "사리자 시제법공상",
  "불생불멸 불구부정 부증불감",
  "시고 공중무색 무수상행식",
  "무안이비설신의 무색성향미촉법",
  "무안계 내지 무의식계",
  "무무명 역무무명진",
  "내지 무노사 역무노사진",
  "무고집멸도 무지역무득",
  "이무소득고 보리살타",
  "의반야바라밀다고 심무가애",
  "무가애고 무유공포",
  "원리전도몽상 구경열반",
  "삼세제불 의반야바라밀다고",
  "득아뇩다라삼먁삼보리",
  "고지 반야바라밀다",
  "시대신주 시대명주",
  "시무상주 시무등등주",
  "능제일체고 진실불허",
  "고설 반야바라밀다주",
  "즉설주왈",
  "아제아제 바라아제",
  "바라승아제 모지 사바하 (3번)",
];

const BOW_MESSAGES = {
  1: "첫 절을 올렸습니다. 마음을 내려놓으세요.",
  27: "스물일곱 번째 절. 몸과 마음이 가벼워집니다.",
  54: "절반을 넘었습니다. 호흡을 고르세요.",
  81: "여든한 번째 절. 조금만 더 정진하세요.",
  108: "108배 회향. 모든 번뇌가 쉬어지기를. 나무 석가모니불.",
};

/* ---------- 저장소 (브라우저 로컬 전용) ---------- */

function defaultState() {
  return {
    offerings: { candle: 0, incense: 0, flower: 0, tea: 0 },
    lanterns: [],
    bows: 0,
    visits: 0,
  };
}

function loadState() {
  try {
    const raw = localStorage.getItem(STORE_KEY);
    if (!raw) return defaultState();
    const parsed = JSON.parse(raw);
    const base = defaultState();
    return {
      ...base,
      ...parsed,
      offerings: { ...base.offerings, ...parsed.offerings },
      lanterns: Array.isArray(parsed.lanterns) ? parsed.lanterns : [],
    };
  } catch {
    return defaultState();
  }
}

const state = loadState();

function saveState() {
  try {
    localStorage.setItem(STORE_KEY, JSON.stringify(state));
  } catch {
    // 저장이 막힌 환경에서도 법당은 그대로 동작합니다.
  }
}

/* ---------- 소리 (Web Audio로 합성) ---------- */

let audioCtx = null;

function ctx() {
  if (!audioCtx) {
    const AC = window.AudioContext || window.webkitAudioContext;
    audioCtx = new AC();
  }
  if (audioCtx.state === "suspended") void audioCtx.resume();
  return audioCtx;
}

function tone(freq, start, duration, peak) {
  const ac = ctx();
  const osc = ac.createOscillator();
  const gain = ac.createGain();
  osc.frequency.value = freq;
  gain.gain.setValueAtTime(0.0001, start);
  gain.gain.exponentialRampToValueAtTime(peak, start + 0.01);
  gain.gain.exponentialRampToValueAtTime(0.0001, start + duration);
  osc.connect(gain).connect(ac.destination);
  osc.start(start);
  osc.stop(start + duration + 0.05);
}

/** 목탁: 짧고 둥근 나무 울림 */
function playMoktak(accent = false) {
  const now = ctx().currentTime;
  const peak = accent ? 0.7 : 0.45;
  tone(620, now, 0.18, peak);
  tone(1240, now, 0.06, peak * 0.3);
  tone(310, now, 0.12, peak * 0.4);
}

/** 범종: 낮은 부분음들이 길게 맥놀이하며 사라짐 */
function playBell() {
  const now = ctx().currentTime;
  const base = 82;
  const partials = [
    [0.5, 0.35, 12],
    [1, 0.3, 10],
    [1.004, 0.2, 10],
    [1.19, 0.12, 7],
    [1.5, 0.08, 6],
    [2, 0.1, 5],
    [2.74, 0.05, 3],
  ];
  for (const [ratio, peak, dur] of partials) {
    tone(base * ratio, now, dur, peak);
  }
}

/** 싱잉볼: 명상 시작과 끝 */
function playBowl() {
  const now = ctx().currentTime;
  tone(432, now, 6, 0.25);
  tone(432 * 2.76, now, 3, 0.06);
  tone(434, now, 6, 0.15);
}

/* ---------- 대웅전 ---------- */

function renderAltar() {
  const candles = Math.min(state.offerings.candle, 6);
  const left = Math.ceil(candles / 2);
  const row = document.getElementById("altar-candles");
  const side = (n) =>
    `<div style="display:flex;gap:10px">${'<div class="candle"></div>'.repeat(n)}</div>`;
  row.innerHTML = side(left) + side(candles - left);

  const sticks = Math.min(state.offerings.incense, 3);
  document.getElementById("incense-holder").innerHTML =
    '<div class="incense"></div>'.repeat(sticks);
}

function renderVisit() {
  state.visits += 1;
  saveState();
  const total = Object.values(state.offerings).reduce((a, b) => a + b, 0);
  const note = document.getElementById("visit-note");
  note.textContent =
    state.visits === 1
      ? "처음 오셨군요. 합장하고 반배로 인사드려 보세요."
      : `${state.visits}번째 참배입니다. 지금까지 올린 공양 ${total}번.`;
}

let chantTimer = null;

function toggleChant(button) {
  const note = document.getElementById("visit-note");
  if (chantTimer) {
    clearInterval(chantTimer);
    chantTimer = null;
    button.textContent = "석가모니불 정근 듣기";
    note.textContent = "정근을 마쳤습니다. 나무 석가모니불.";
    return;
  }
  let beat = 0;
  button.textContent = "정근 멈추기";
  chantTimer = setInterval(() => {
    playMoktak(beat % 4 === 0);
    if (beat % 4 === 0)
      note.textContent = "석가모니불 · 석가모니불 · 석가모니불";
    beat += 1;
  }, 520);
}

function initHall() {
  renderAltar();
  renderVisit();
  document.getElementById("bell-btn").addEventListener("click", playBell);
  const chant = document.getElementById("chant-btn");
  chant.addEventListener("click", () => toggleChant(chant));
}

/* ---------- 공양 ---------- */

function renderOfferings() {
  for (const el of document.querySelectorAll("[data-count]")) {
    el.textContent = String(state.offerings[el.dataset.count] ?? 0);
  }
}

function initOfferings() {
  renderOfferings();
  for (const btn of document.querySelectorAll("[data-offer]")) {
    btn.addEventListener("click", () => {
      state.offerings[btn.dataset.offer] += 1;
      saveState();
      renderOfferings();
      renderAltar();
      playMoktak(true);
      btn.classList.remove("pulse");
      void btn.offsetWidth;
      btn.classList.add("pulse");
    });
  }
}

/* ---------- 연등 ---------- */

function lanternItem({ name, wish, color }) {
  const li = document.createElement("li");
  li.className = "lantern";
  li.style.setProperty("--c", color);
  const body = document.createElement("div");
  body.className = "body";
  const nameEl = document.createElement("span");
  nameEl.className = "name";
  nameEl.textContent = name;
  const wishEl = document.createElement("span");
  wishEl.className = "wish";
  wishEl.textContent = wish;
  li.append(body, nameEl, wishEl);
  return li;
}

function renderLanterns() {
  const list = document.getElementById("lanterns");
  list.replaceChildren(...state.lanterns.map(lanternItem));
}

function initLanterns() {
  renderLanterns();
  const form = document.getElementById("lantern-form");
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const data = new FormData(form);
    state.lanterns.push({
      name: String(data.get("name")).trim(),
      wish: String(data.get("wish")).trim(),
      color: String(data.get("color")),
    });
    state.lanterns = state.lanterns.slice(-60);
    saveState();
    renderLanterns();
    playBowl();
    form.reset();
  });
}

/* ---------- 108배 ---------- */

function renderBows() {
  document.getElementById("bow-count").textContent = String(state.bows);
  document.getElementById("bow-bar").style.width =
    `${(state.bows / 108) * 100}%`;
  const msg = BOW_MESSAGES[state.bows];
  if (msg || state.bows === 0) {
    document.getElementById("bow-msg").textContent = msg ?? "";
  }
}

function initBows() {
  renderBows();
  const btn = document.getElementById("bow-btn");
  btn.addEventListener("click", () => {
    if (state.bows >= 108) return;
    state.bows += 1;
    saveState();
    renderBows();
    if (state.bows === 108) playBell();
    else playMoktak(state.bows % 9 === 0);
  });
  document.getElementById("bow-reset").addEventListener("click", () => {
    state.bows = 0;
    saveState();
    renderBows();
  });
}

/* ---------- 경전 ---------- */

function initSutra() {
  const list = document.getElementById("sutra-lines");
  for (const line of SUTRA) {
    const li = document.createElement("li");
    li.textContent = line;
    li.tabIndex = 0;
    const read = () => {
      li.classList.add("read");
      playMoktak();
    };
    li.addEventListener("click", read);
    li.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        read();
      }
    });
    list.append(li);
  }
}

/* ---------- 명상 ---------- */

const med = { minutes: 5, remaining: 300, timer: null };

function formatTime(sec) {
  const m = String(Math.floor(sec / 60)).padStart(2, "0");
  const s = String(sec % 60).padStart(2, "0");
  return `${m}:${s}`;
}

function renderMed() {
  document.getElementById("med-time").textContent = formatTime(med.remaining);
  for (const b of document.querySelectorAll("[data-min]")) {
    b.classList.toggle("active", Number(b.dataset.min) === med.minutes);
  }
}

function stopMed(finished) {
  clearInterval(med.timer);
  med.timer = null;
  document.querySelector(".med").classList.remove("running");
  document.getElementById("med-start").textContent = "시작";
  if (finished) playBowl();
  med.remaining = med.minutes * 60;
  renderMed();
}

function startMed() {
  playBowl();
  document.querySelector(".med").classList.add("running");
  document.getElementById("med-start").textContent = "그만";
  med.timer = setInterval(() => {
    med.remaining -= 1;
    renderMed();
    if (med.remaining <= 0) stopMed(true);
  }, 1000);
}

function initMeditation() {
  for (const b of document.querySelectorAll("[data-min]")) {
    b.addEventListener("click", () => {
      if (med.timer) stopMed(false);
      med.minutes = Number(b.dataset.min);
      med.remaining = med.minutes * 60;
      renderMed();
    });
  }
  document.getElementById("med-start").addEventListener("click", () => {
    if (med.timer) stopMed(false);
    else startMed();
  });
  renderMed();
}

initHall();
initOfferings();
initLanterns();
initBows();
initSutra();
initMeditation();
