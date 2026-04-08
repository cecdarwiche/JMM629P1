/* ============================================================
   THE FRIENDSHIP DECLINE — script.js  v2
   D3 v7 + Scrollama v3
   Charts: Dunbar, Line, Bar, Importance Waffle, Happiness Dots
   ============================================================ */

// ── DATA ──────────────────────────────────────────────────────

const dunbarLayers = [
  { label: "Acquaintances", sublabel: "up to 500 cognitively", r: 200, color: "#c4b49a", textDark: true },
  { label: "Active Network", sublabel: "~150 people",          r: 155, color: "#b8967a", textDark: true },
  { label: "Friends",        sublabel: "~50 people",           r: 108, color: "#c9472a", textDark: false },
  { label: "Best Friends",   sublabel: "~15 people",           r: 65,  color: "#8b1a2f", textDark: false },
  { label: "Intimates",      sublabel: "3–5 people",           r: 28,  color: "#1a1410", textDark: false },
];

const lineData = {
  ages: [18, 20, 22, 24, 26, 28, 30, 32, 34],
  series: [
    { key: "friends",   label: "Friends",   color: "#e05c4b", values: [1.9, 2.0, 1.7, 1.4, 1.2, 1.0, 0.85, 0.8, 0.75] },
    { key: "alone",     label: "Alone",     color: "#888",    values: [2.8, 2.7, 2.9, 3.1, 3.3, 3.5, 3.6, 3.8, 4.0] },
    { key: "partner",   label: "Partner",   color: "#5b8db8", values: [0.3, 0.5, 0.8, 1.2, 1.5, 1.7, 1.9, 2.0, 2.1] },
    { key: "parents",   label: "Parents",   color: "#6aab7a", values: [1.4, 1.2, 1.0, 0.9, 0.7, 0.6, 0.5, 0.5, 0.4] },
    { key: "children",  label: "Children",  color: "#8b6abf", values: [0.0, 0.0, 0.1, 0.2, 0.4, 0.6, 0.9, 1.1, 1.3] },
    { key: "coworkers", label: "Coworkers", color: "#e8a838", values: [0.4, 0.5, 0.6, 0.7, 0.8, 0.8, 0.7, 0.7, 0.6] },
  ]
};

const barData = [
  { label: "0 friends",  pct: 8  },
  { label: "1 friend",   pct: 7  },
  { label: "2 friends",  pct: 14 },
  { label: "3 friends",  pct: 18 },
  { label: "4 friends",  pct: 13 },
  { label: "5+ friends", pct: 38 },
];

// Importance data: each dot = 1% of respondents, 100 dots total
// Approximate from infographic: Very ~49, Rather ~36, Not Very ~10, Not at All ~3, N/A ~2
const importanceData = [
  { label: "Very Important",     color: "#8b1a2f", count: 49 },
  { label: "Rather Important",   color: "#c9472a", count: 36 },
  { label: "Not Very Important", color: "#c4b49a", count: 10 },
  { label: "Not at All",         color: "#d4c9b4", count:  3 },
  { label: "N/A",                color: "#e8e2d6", count:  2 },
];

// Happiness by country: [country, oftenPct, rarelyPct]
// Approximate values from the infographic scatter chart
const happinessData = [
  { country: "Canada",      often: 96, rarely: 85, highlight: false },
  { country: "Singapore",   often: 96, rarely: 82, highlight: false },
  { country: "US",          often: 90, rarely: 78, highlight: true  },
  { country: "Australia",   often: 89, rarely: 76, highlight: false },
  { country: "Germany",     often: 85, rarely: 73, highlight: false },
  { country: "UK",          often: 84, rarely: 72, highlight: false },
  { country: "Spain",       often: 82, rarely: 67, highlight: false },
  { country: "France",      often: 79, rarely: 68, highlight: false },
  { country: "Brazil",      often: 76, rarely: 64, highlight: false },
  { country: "Mexico",      often: 74, rarely: 63, highlight: false },
  { country: "Turkey",      often: 68, rarely: 58, highlight: false },
  { country: "China",       often: 65, rarely: 56, highlight: false },
  { country: "India",       often: 63, rarely: 54, highlight: false },
  { country: "Iran",        often: 55, rarely: 55, highlight: false },
  { country: "Moldova",     often: 39, rarely: 31, highlight: false },
];

// ── HELPERS ───────────────────────────────────────────────────

function getW(el) {
  return el.getBoundingClientRect().width || 480;
}

// ── CHART TITLE HELPER (no underline) ─────────────────────────
function addChartTitle(svg, x, y, text, anchor = "start") {
  svg.append("text")
    .attr("x", x).attr("y", y)
    .attr("text-anchor", anchor)
    .attr("font-family", "Playfair Display, serif")
    .attr("font-size", "14px")
    .attr("font-weight", "700")
    .attr("fill", "#1a1410")
    .text(text);
}

// ── CHART 1: DUNBAR CIRCLES ───────────────────────────────────

let dunbarInit = false;

function drawDunbar(stepIndex) {
  const el = document.getElementById("chart-dunbar");
  if (!el) return;

  if (!dunbarInit) {
    dunbarInit = true;
    const size = Math.min(getW(el), 440);
    const cx = size / 2, cy = size / 2 + 18;
    const sc = size / 460;

    const svg = d3.select(el).append("svg")
      .attr("viewBox", `0 0 ${size} ${size}`)
      .attr("preserveAspectRatio", "xMidYMid meet");

    addChartTitle(svg, size / 2, 18, "Circles of Friendship", "middle");

    dunbarLayers.forEach((layer, i) => {
      const r = layer.r * sc;
      const g = svg.append("g")
        .attr("class", `ring-layer-${i}`)
        .attr("opacity", 0);

      g.append("circle")
        .attr("cx", cx).attr("cy", cy).attr("r", r)
        .attr("fill", layer.color)
        .attr("fill-opacity", i < 2 ? 0.18 : 0.28)
        .attr("stroke", layer.color)
        .attr("stroke-width", 1.5);

      // Label near top of ring
      const textFill = layer.textDark ? "#1a1410" : "#fff";
      const textFillSub = layer.textDark ? "#5a5046" : "rgba(255,255,255,0.75)";

      g.append("text")
        .attr("x", cx).attr("y", cy - r + 18)
        .attr("text-anchor", "middle")
        .attr("font-family", "DM Sans, sans-serif")
        .attr("font-size", Math.max(9, 13 - i * 1.2) + "px")
        .attr("font-weight", "600")
        .attr("fill", textFill)
        .text(layer.label);

      g.append("text")
        .attr("x", cx).attr("y", cy - r + 31)
        .attr("text-anchor", "middle")
        .attr("font-family", "DM Sans, sans-serif")
        .attr("font-size", "9px")
        .attr("font-style", "italic")
        .attr("fill", textFillSub)
        .text(layer.sublabel);
    });
  }

  dunbarLayers.forEach((_, i) => {
    const show = i <= stepIndex;
    d3.select(`.ring-layer-${i}`)
      .transition().duration(550).delay(show ? i * 110 : 0)
      .attr("opacity", show ? 1 : 0);
  });
}

// ── CHART 2: LINE CHART ───────────────────────────────────────

let lineInit = false;
let _lineXSc, _lineYSc;

function drawLineChart(stepIndex) {
  const el = document.getElementById("chart-line");
  if (!el) return;

  if (!lineInit) {
    lineInit = true;
    const W = getW(el);
    const H = Math.round(W * 0.66);
    const m = { top: 44, right: 78, bottom: 46, left: 42 };
    const w = W - m.left - m.right;
    const h = H - m.top - m.bottom;

    const svg = d3.select(el).append("svg")
      .attr("viewBox", `0 0 ${W} ${H}`)
      .attr("preserveAspectRatio", "xMidYMid meet");

    addChartTitle(svg, m.left, 22, "Avg. Daily Hours with Others (Ages 18–34)");

    const g = svg.append("g").attr("transform", `translate(${m.left},${m.top})`);

    _lineXSc = d3.scaleLinear().domain([18, 34]).range([0, w]);
    _lineYSc = d3.scaleLinear().domain([0, 5]).range([h, 0]).nice();

    // Grid
    g.append("g").attr("class", "grid")
      .call(d3.axisLeft(_lineYSc).tickSize(-w).tickFormat(""))
      .call(ax => { ax.select(".domain").remove(); });

    // Axes
    g.append("g").attr("class", "axis").attr("transform", `translate(0,${h})`)
      .call(d3.axisBottom(_lineXSc).ticks(8).tickFormat(d => "" + d));
    g.append("g").attr("class", "axis")
      .call(d3.axisLeft(_lineYSc).ticks(5));

    // Axis labels
    g.append("text").attr("x", w / 2).attr("y", h + 38)
      .attr("text-anchor", "middle").attr("font-family", "DM Sans, sans-serif")
      .attr("font-size", "11px").attr("fill", "#5a5046").text("Age");
    g.append("text").attr("transform", "rotate(-90)").attr("x", -h / 2).attr("y", -32)
      .attr("text-anchor", "middle").attr("font-family", "DM Sans, sans-serif")
      .attr("font-size", "11px").attr("fill", "#5a5046").text("Hours / day");

    // Clip path for draw animation
    const defs = svg.append("defs");
    defs.append("clipPath").attr("id", "line-clip")
      .append("rect").attr("x", 0).attr("y", -10).attr("width", 0).attr("height", H + 20)
      .transition().duration(1400).ease(d3.easeQuadInOut).attr("width", W + 100);

    const lineGen = d3.line()
      .x((d, i) => _lineXSc(lineData.ages[i]))
      .y(d => _lineYSc(d))
      .curve(d3.curveCatmullRom.alpha(0.5));

    lineData.series.forEach(s => {
      g.append("path")
        .datum(s.values)
        .attr("class", `line-path line-${s.key}`)
        .attr("d", lineGen)
        .attr("stroke", s.color)
        .attr("clip-path", "url(#line-clip)");

      const lastY = _lineYSc(s.values[s.values.length - 1]);
      g.append("text")
        .attr("class", `line-label-${s.key}`)
        .attr("x", w + 5).attr("y", lastY + 4)
        .attr("fill", s.color)
        .attr("font-size", "10px")
        .attr("font-family", "DM Sans, sans-serif")
        .text(s.label);
    });
  }

  // Highlight logic per step
  const highlights = { 0: null, 1: ["friends"], 2: ["partner", "children"], 3: ["alone"] };
  const active = highlights[stepIndex] ?? null;

  lineData.series.forEach(s => {
    const hi = !active || active.includes(s.key);
    d3.select(`.line-${s.key}`)
      .transition().duration(380)
      .attr("stroke-width", !active ? 2.5 : (hi ? 3.8 : 1.2))
      .attr("opacity",       !active ? 0.85 : (hi ? 1 : 0.1));
    d3.select(`.line-label-${s.key}`)
      .transition().duration(380)
      .attr("opacity",     !active ? 1 : (hi ? 1 : 0.15))
      .attr("font-weight", hi ? "700" : "300");
  });
}

// ── CHART 3: BAR CHART ────────────────────────────────────────

let barInit = false;
let _barXSc, _barYSc;

function drawBarChart(stepIndex) {
  const el = document.getElementById("chart-bar");
  if (!el) return;

  if (!barInit) {
    barInit = true;
    const W = getW(el);
    const H = Math.round(W * 0.72);
    const m = { top: 44, right: 56, bottom: 36, left: 90 };
    const w = W - m.left - m.right;
    const h = H - m.top - m.bottom;

    const svg = d3.select(el).append("svg")
      .attr("viewBox", `0 0 ${W} ${H}`)
      .attr("preserveAspectRatio", "xMidYMid meet");

    addChartTitle(svg, m.left, 22, "How Many Close Friends Do Americans Have?");

    const g = svg.append("g").attr("transform", `translate(${m.left},${m.top})`);

    _barXSc = d3.scaleLinear().domain([0, 42]).range([0, w]);
    _barYSc = d3.scaleBand().domain(barData.map(d => d.label)).range([0, h]).padding(0.3);

    // Grid
    g.append("g").attr("class", "grid")
      .attr("transform", `translate(0,${h})`)
      .call(d3.axisBottom(_barXSc).tickSize(-h).tickFormat(""))
      .call(ax => ax.select(".domain").remove());

    // Axes
    g.append("g").attr("class", "axis").attr("transform", `translate(0,${h})`)
      .call(d3.axisBottom(_barXSc).ticks(5).tickFormat(d => d + "%"))
      .call(ax => ax.select(".domain").remove());
    g.append("g").attr("class", "axis")
      .call(d3.axisLeft(_barYSc).tickSize(0))
      .call(ax => {
        ax.select(".domain").remove();
        ax.selectAll("text").attr("dx", "-4px").attr("font-size", "11px");
      });

    const colors = ["#c4b49a", "#b8967a", "#c9472a", "#c9472a", "#8b1a2f", "#8b1a2f"];

    barData.forEach((d, i) => {
      const grp = g.append("g").attr("class", `bar-group-${i}`).attr("opacity", 0);

      grp.append("rect").attr("class", "bar-rect")
        .attr("y", _barYSc(d.label)).attr("height", _barYSc.bandwidth())
        .attr("rx", 2).attr("fill", colors[i]).attr("width", 0);

      grp.append("text").attr("class", `bar-pct-${i}`)
        .attr("y", _barYSc(d.label) + _barYSc.bandwidth() / 2 + 4)
        .attr("font-size", "11px").attr("font-family", "DM Sans, sans-serif")
        .attr("fill", i >= 4 ? "#8b1a2f" : "#5a5046")
        .attr("font-weight", i >= 4 ? "600" : "400")
        .attr("opacity", 0).text(d.pct + "%");

      if (d.label === "5+ friends") {
        grp.append("text").attr("class", "bar-annot")
          .attr("y", _barYSc(d.label) + _barYSc.bandwidth() / 2 - 6)
          .attr("font-size", "9px").attr("font-style", "italic")
          .attr("font-family", "DM Sans, sans-serif")
          .attr("fill", "#8b1a2f").attr("opacity", 0)
          .text("← Dunbar's threshold");
      }
    });
  }

  const showCount = [0, 2, 4, 6][Math.min(stepIndex, 3)];

  barData.forEach((d, i) => {
    const show = i < showCount;
    d3.select(`.bar-group-${i}`)
      .transition().duration(400).delay(show ? i * 85 : 0)
      .attr("opacity", show ? 1 : 0);

    if (show) {
      d3.select(`.bar-group-${i}`).select(".bar-rect")
        .transition().duration(700).delay(i * 85).ease(d3.easeCubicOut)
        .attr("width", _barXSc(d.pct));

      d3.select(`.bar-pct-${i}`)
        .attr("x", _barXSc(d.pct) + 6)
        .transition().duration(400).delay(i * 85 + 650).attr("opacity", 1);

      if (d.label === "5+ friends") {
        d3.select(`.bar-group-${i}`).select(".bar-annot")
          .attr("x", _barXSc(d.pct) + 6)
          .transition().duration(400).delay(i * 85 + 820).attr("opacity", 1);
      }
    }
  });
}

// ── CHART 4: IMPORTANCE WAFFLE DOTS ──────────────────────────
// 10×10 grid of dots, each = 1%, colored by category

let impInit = false;

function drawImportance(stepIndex) {
  const el = document.getElementById("chart-importance");
  if (!el) return;

  if (!impInit) {
    impInit = true;
    const W = getW(el);
    const H = Math.round(W * 0.85);
    const m = { top: 44, right: 20, bottom: 80, left: 20 };
    const innerW = W - m.left - m.right;
    const innerH = H - m.top - m.bottom;

    const svg = d3.select(el).append("svg")
      .attr("viewBox", `0 0 ${W} ${H}`)
      .attr("preserveAspectRatio", "xMidYMid meet");

    addChartTitle(svg, W / 2, 22, "How Important Is Friendship to Americans?", "middle");

    const g = svg.append("g").attr("transform", `translate(${m.left},${m.top})`);

    const cols = 10, rows = 10;
    const dotR = Math.min(innerW / cols, innerH / rows) * 0.38;
    const spacingX = innerW / cols;
    const spacingY = innerH / rows;

    // Build flat array of 100 dots with their category
    const dots = [];
    importanceData.forEach(cat => {
      for (let i = 0; i < cat.count; i++) {
        dots.push({ color: cat.color, label: cat.label });
      }
    });

    dots.forEach((dot, idx) => {
      const col = idx % cols;
      const row = Math.floor(idx / cols);
      const cx = spacingX * col + spacingX / 2;
      const cy = spacingY * row + spacingY / 2;

      g.append("circle")
        .attr("class", `waffle-dot waffle-dot-${idx}`)
        .attr("cx", cx).attr("cy", cy).attr("r", dotR)
        .attr("fill", dot.color)
        .attr("data-label", dot.label)
        .attr("opacity", 0);
    });

    // Legend
    const legendG = svg.append("g")
      .attr("transform", `translate(${m.left}, ${H - m.bottom + 18})`);
    const legendSpacing = innerW / importanceData.length;

    importanceData.forEach((cat, i) => {
      const lx = legendSpacing * i + legendSpacing / 2;
      legendG.append("circle")
        .attr("cx", lx).attr("cy", 8).attr("r", 6)
        .attr("fill", cat.color);
      legendG.append("text")
        .attr("x", lx).attr("y", 22)
        .attr("text-anchor", "middle")
        .attr("font-family", "DM Sans, sans-serif")
        .attr("font-size", "9px")
        .attr("fill", "#5a5046")
        .text(cat.label);
    });
  }

  // Reveal dots per step
  // step 0: all dim grey preview (show all at low opacity)
  // step 1: reveal Very Important (first 49) at full color
  // step 2: also reveal Rather Important (next 36)
  // step 3: all fully revealed
  const revealUpTo = [0, 49, 85, 100][Math.min(stepIndex, 3)];
  const previewAll = stepIndex >= 0;

  const dots = document.querySelectorAll(".waffle-dot");
  dots.forEach((dot, i) => {
    const isRevealed = i < revealUpTo;
    d3.select(dot)
      .transition().duration(350).delay(isRevealed ? i * 8 : 0)
      .attr("opacity", isRevealed ? 0.92 : (previewAll ? 0.18 : 0));
  });
}

// ── CHART 5: HAPPINESS DOT PLOT ───────────────────────────────

let hapInit = false;

function drawHappiness(stepIndex) {
  const el = document.getElementById("chart-happiness");
  if (!el) return;

  if (!hapInit) {
    hapInit = true;
    const W = getW(el);
    const H = Math.round(W * 0.88);
    const m = { top: 44, right: 30, bottom: 36, left: 84 };
    const w = W - m.left - m.right;
    const h = H - m.top - m.bottom;

    const svg = d3.select(el).append("svg")
      .attr("viewBox", `0 0 ${W} ${H}`)
      .attr("preserveAspectRatio", "xMidYMid meet");

    addChartTitle(svg, m.left, 22, "Happiness by Time Spent with Friends");

    const g = svg.append("g").attr("transform", `translate(${m.left},${m.top})`);

    const xSc = d3.scaleLinear().domain([25, 100]).range([0, w]);
    const ySc = d3.scaleBand()
      .domain(happinessData.map(d => d.country))
      .range([0, h]).padding(0.4);

    // Grid
    g.append("g").attr("class", "grid")
      .call(d3.axisTop(xSc).tickSize(-h).tickFormat(""))
      .call(ax => ax.select(".domain").remove());

    // X axis top
    g.append("g").attr("class", "axis")
      .call(d3.axisTop(xSc).ticks(6).tickFormat(d => d + "%"))
      .call(ax => ax.select(".domain").remove());

    // Y axis
    g.append("g").attr("class", "axis")
      .call(d3.axisLeft(ySc).tickSize(0))
      .call(ax => {
        ax.select(".domain").remove();
        ax.selectAll("text")
          .attr("dx", "-4px")
          .attr("font-size", "10px")
          .attr("font-weight", d => d === "US" ? "700" : "400")
          .attr("fill", d => d === "US" ? "#8b1a2f" : "#5a5046");
      });

    // Draw connecting lines + dots for each country
    happinessData.forEach((d, i) => {
      const cy = ySc(d.country) + ySc.bandwidth() / 2;
      const x1 = xSc(d.rarely);
      const x2 = xSc(d.often);
      const isUS = d.country === "US";

      // Connecting line
      g.append("line")
        .attr("class", `hap-line hap-line-${i}`)
        .attr("x1", x1).attr("x2", x1)
        .attr("y1", cy).attr("y2", cy)
        .attr("stroke", isUS ? "#8b1a2f" : "#d4c9b4")
        .attr("stroke-width", isUS ? 2 : 1.5)
        .attr("opacity", 0);

      // "Rarely" dot (hollow)
      g.append("circle")
        .attr("class", `hap-dot-rarely-${i}`)
        .attr("cx", x1).attr("cy", cy).attr("r", isUS ? 5 : 4)
        .attr("fill", "white")
        .attr("stroke", isUS ? "#8b1a2f" : "#b8967a")
        .attr("stroke-width", isUS ? 2 : 1.5)
        .attr("opacity", 0);

      // "Often" dot (filled)
      g.append("circle")
        .attr("class", `hap-dot-often-${i}`)
        .attr("cx", x1).attr("cy", cy).attr("r", isUS ? 5 : 4)
        .attr("fill", isUS ? "#8b1a2f" : "#c9472a")
        .attr("opacity", 0);
    });

    // Legend
    const legG = svg.append("g").attr("transform", `translate(${m.left + w / 2 - 80}, ${H - 18})`);
    [
      { label: "Often with friends", filled: true  },
      { label: "Rarely with friends", filled: false },
    ].forEach((item, i) => {
      const lx = i * 150;
      legG.append("circle").attr("cx", lx + 6).attr("cy", 0).attr("r", 5)
        .attr("fill", item.filled ? "#c9472a" : "white")
        .attr("stroke", "#c9472a").attr("stroke-width", 1.5);
      legG.append("text").attr("x", lx + 16).attr("y", 4)
        .attr("font-family", "DM Sans, sans-serif").attr("font-size", "10px")
        .attr("fill", "#5a5046").text(item.label);
    });
  }

  // Reveal by step
  // 0 = show all lines + dots at low opacity (overview)
  // 1 = full opacity, show gap arrows
  // 2 = highlight Moldova, Iran, Canada/Singapore
  // 3 = highlight US
  const highlightUS    = stepIndex >= 3;
  const highlightOther = stepIndex >= 2;
  const showFull       = stepIndex >= 1;
  const showPreview    = stepIndex >= 0;

  happinessData.forEach((d, i) => {
    const isUS        = d.country === "US";
    const isSpecial   = ["Moldova", "Iran", "Canada", "Singapore"].includes(d.country);
    const baseOpacity = showPreview ? (showFull ? 1 : 0.25) : 0;
    const opacity     = isUS && highlightUS ? 1
                      : isSpecial && highlightOther && showFull ? 1
                      : baseOpacity;
    const delay       = showFull ? i * 40 : 0;

    // Animate line from rarely → often
    d3.select(`.hap-line-${i}`)
      .transition().duration(500).delay(delay)
      .attr("opacity", opacity * 0.7)
      .attr("x2", showFull ? `${d3.scaleLinear().domain([25, 100]).range([0, getW(el) - 84 - 30])(d.often)}` : null);

    // Fix: recompute xSc for line animation inline
    const W2 = getW(el);
    const w2 = W2 - 84 - 30;
    const xSc2 = d3.scaleLinear().domain([25, 100]).range([0, w2]);

    d3.select(`.hap-line-${i}`)
      .transition().duration(600).delay(delay)
      .attr("opacity", opacity * 0.7)
      .attr("x2", xSc2(d.often));

    d3.select(`.hap-dot-rarely-${i}`)
      .transition().duration(400).delay(delay)
      .attr("opacity", opacity);

    d3.select(`.hap-dot-often-${i}`)
      .transition().duration(400).delay(delay + 200)
      .attr("cx", xSc2(d.often))
      .attr("opacity", opacity);
  });
}

// ── SCROLLAMA SETUP ───────────────────────────────────────────

function initScrollama(sectionId, chartFn) {
  const scroller = scrollama();
  scroller.setup({
    step: `#${sectionId} .step`,
    offset: 0.55,
  }).onStepEnter(({ index }) => {
    document.querySelectorAll(`#${sectionId} .step`).forEach((el, i) => {
      el.classList.toggle("is-active", i === index);
    });
    chartFn(index);
  });
  window.addEventListener("resize", () => scroller.resize());
}

// ── INIT ──────────────────────────────────────────────────────

document.addEventListener("DOMContentLoaded", () => {
  // Initial draw at step 0
  drawDunbar(0);
  drawLineChart(0);
  drawBarChart(0);
  drawImportance(0);
  drawHappiness(0);

  // Activate first step in each section
  ["scrolly-dunbar", "scrolly-line", "scrolly-bar", "scrolly-importance", "scrolly-happiness"]
    .forEach(id => {
      const first = document.querySelector(`#${id} .step`);
      if (first) first.classList.add("is-active");
    });

  // Wire scrollama instances
  initScrollama("scrolly-dunbar",    drawDunbar);
  initScrollama("scrolly-line",      drawLineChart);
  initScrollama("scrolly-bar",       drawBarChart);
  initScrollama("scrolly-importance", drawImportance);
  initScrollama("scrolly-happiness", drawHappiness);
});