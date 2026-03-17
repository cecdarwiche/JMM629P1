// --DATA ----------------------------------------------
 
const dunbarLayers = [
  { label: "Acquaintances", sublabel: "~500 cognitively",  r: 200, color: "#c4b49a" },
  { label: "Active Network",sublabel: "~150 people",       r: 155, color: "#b8967a" },
  { label: "Friends",       sublabel: "~50 people",        r: 108, color: "#c9472a" },
  { label: "Best Friends",  sublabel: "~15 people",        r: 65,  color: "#8b1a2f" },
  { label: "Intimates",     sublabel: "3–5 people",        r: 28,  color: "#1a1410" },
];
 
const lineData = {
  ages: [18, 20, 22, 24, 26, 28, 30, 32, 34],
  series: [
    { key: "friends",   label: "Friends",   color: "#e05c4b",
      values: [1.9, 2.0, 1.7, 1.4, 1.2, 1.0, 0.85, 0.8, 0.75] },
    { key: "alone",     label: "Alone",     color: "#999",
      values: [2.8, 2.7, 2.9, 3.1, 3.3, 3.5, 3.6, 3.8, 4.0] },
    { key: "partner",   label: "Partner",   color: "#5b8db8",
      values: [0.3, 0.5, 0.8, 1.2, 1.5, 1.7, 1.9, 2.0, 2.1] },
    { key: "parents",   label: "Parents",   color: "#6aab7a",
      values: [1.4, 1.2, 1.0, 0.9, 0.7, 0.6, 0.5, 0.5, 0.4] },
    { key: "children",  label: "Children",  color: "#8b6abf",
      values: [0.0, 0.0, 0.1, 0.2, 0.4, 0.6, 0.9, 1.1, 1.3] },
    { key: "coworkers", label: "Coworkers", color: "#e8a838",
      values: [0.4, 0.5, 0.6, 0.7, 0.8, 0.8, 0.7, 0.7, 0.6] },
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
 
// -- HELPERS ----------------------------------------------
 
function getW(el) {
  return el.getBoundingClientRect().width || 480;
}
 
// -- CHART 1: DUNBAR CIRCLES ----------------------------------------------
 
let dunbarInitialized = false;
 
function drawDunbar(stepIndex) {
  const el = document.getElementById("chart-dunbar");
  if (!el) return;
 
  if (!dunbarInitialized) {
    dunbarInitialized = true;
    const size = Math.min(getW(el), 440);
    const cx = size / 2, cy = size / 2 + 10;
    const scale = size / 460;
 
    const svg = d3.select(el)
      .append("svg")
      .attr("viewBox", `0 0 ${size} ${size}`)
      .attr("preserveAspectRatio", "xMidYMid meet");
 
    svg.append("text")
      .attr("x", size / 2).attr("y", 20)
      .attr("text-anchor", "middle")
      .attr("font-family", "Playfair Display, serif")
      .attr("font-size", "14px")
      .attr("fill", "#1a1410")
      .text("Circles of Friendship — Dunbar's Number");
 
    // Draw all rings; start hidden
    dunbarLayers.forEach((layer, i) => {
      const r = layer.r * scale;
      const g = svg.append("g")
        .attr("class", `dunbar-ring-group ring-layer-${i}`)
        .attr("opacity", 0);
 
      g.append("circle")
        .attr("cx", cx).attr("cy", cy).attr("r", r)
        .attr("fill", layer.color)
        .attr("fill-opacity", 0.2)
        .attr("stroke", layer.color)
        .attr("stroke-width", 1.5);
 
      // Label inside ring
      g.append("text")
        .attr("x", cx).attr("y", cy - r + 16)
        .attr("text-anchor", "middle")
        .attr("font-family", "DM Sans, sans-serif")
        .attr("font-size", Math.max(9, 12 - i) + "px")
        .attr("font-weight", "600")
        .attr("fill", i >= 3 ? "#fff" : "#1a1410")
        .text(layer.label);
 
      g.append("text")
        .attr("x", cx).attr("y", cy - r + 29)
        .attr("text-anchor", "middle")
        .attr("font-family", "DM Sans, sans-serif")
        .attr("font-size", "9px")
        .attr("font-style", "italic")
        .attr("fill", i >= 3 ? "rgba(255,255,255,0.8)" : "#5a5046")
        .text(layer.sublabel);
    });
  }
 
  // Reveal layers up to stepIndex
  dunbarLayers.forEach((layer, i) => {
    const shouldShow = i <= stepIndex;
    d3.select(`.ring-layer-${i}`)
      .transition().duration(600).delay(shouldShow ? i * 100 : 0)
      .attr("opacity", shouldShow ? 1 : 0);
  });
}
 
// -- CHART 2: LINE CHART ----------------------------------------------
 
let lineInitialized = false;
let lineXSc, lineYSc, lineEl;
 
function drawLineChart(stepIndex) {
  const el = document.getElementById("chart-line");
  if (!el) return;
 
  if (!lineInitialized) {
    lineInitialized = true;
    lineEl = el;
 
    const W = getW(el);
    const H = Math.round(W * 0.65);
    const m = { top: 40, right: 76, bottom: 46, left: 44 };
    const w = W - m.left - m.right;
    const h = H - m.top - m.bottom;
 
    const svg = d3.select(el)
      .append("svg")
      .attr("viewBox", `0 0 ${W} ${H}`)
      .attr("preserveAspectRatio", "xMidYMid meet");
 
    svg.append("text")
      .attr("x", m.left).attr("y", 20)
      .attr("font-family","Playfair Display, serif")
      .attr("font-size","13px")
      .attr("fill","#1a1410")
      .text("Avg. Daily Hours with Others (Ages 18–34)");
 
    const g = svg.append("g").attr("transform", `translate(${m.left},${m.top})`);
 
    lineXSc = d3.scaleLinear().domain([18, 34]).range([0, w]);
    lineYSc = d3.scaleLinear().domain([0, 5]).range([h, 0]).nice();
 
    // Grid lines
    g.append("g").attr("class","grid")
      .call(d3.axisLeft(lineYSc).tickSize(-w).tickFormat(""))
      .call(ax => {
        ax.select(".domain").remove();
        ax.selectAll("line").attr("stroke","#d4c9b4").attr("stroke-dasharray","3,3");
      });
 
    // X axis
    g.append("g").attr("class","axis").attr("transform",`translate(0,${h})`)
      .call(d3.axisBottom(lineXSc).ticks(8).tickFormat(d => ""+d));
 
    // Y axis
    g.append("g").attr("class","axis")
      .call(d3.axisLeft(lineYSc).ticks(5));
 
    // Axis labels
    g.append("text")
      .attr("x", w/2).attr("y", h+38)
      .attr("text-anchor","middle")
      .attr("font-family","DM Sans, sans-serif")
      .attr("font-size","11px").attr("fill","#5a5046")
      .text("Age");
    g.append("text")
      .attr("transform","rotate(-90)").attr("x",-h/2).attr("y",-34)
      .attr("text-anchor","middle")
      .attr("font-family","DM Sans, sans-serif")
      .attr("font-size","11px").attr("fill","#5a5046")
      .text("Hours / day");
 
    // Clip path for animation
    const defs = svg.append("defs");
    defs.append("clipPath").attr("id","line-clip")
      .append("rect").attr("x",0).attr("y",-10).attr("width",0).attr("height",H+20)
      .transition().duration(1400).ease(d3.easeQuadInOut).attr("width", W + 100);
 
    const lineGen = d3.line()
      .x((d, i) => lineXSc(lineData.ages[i]))
      .y(d => lineYSc(d))
      .curve(d3.curveCatmullRom.alpha(0.5));
 
    // Lines + labels
    lineData.series.forEach(s => {
      g.append("path")
        .datum(s.values)
        .attr("class", `line-path line-${s.key}`)
        .attr("d", lineGen)
        .attr("fill", "none")
        .attr("stroke", s.color)
        .attr("stroke-width", 2.5)
        .attr("stroke-linejoin","round")
        .attr("stroke-linecap","round")
        .attr("clip-path","url(#line-clip)");
 
      const lastY = lineYSc(s.values[s.values.length - 1]);
      g.append("text")
        .attr("class", `line-label line-label-${s.key}`)
        .attr("x", w + 6).attr("y", lastY + 4)
        .attr("fill", s.color)
        .attr("font-size","10px")
        .attr("font-family","DM Sans, sans-serif")
        .text(s.label);
    });
  }
 
  // Highlight logic by step
  // 0 = all equal, 1 = friends pop, 2 = partner+children, 3 = alone
  const highlights = {
    0: null,
    1: ["friends"],
    2: ["partner","children"],
    3: ["alone"]
  };
  const active = highlights[stepIndex] || null;
 
  lineData.series.forEach(s => {
    const isHi = !active || active.includes(s.key);
    d3.select(`.line-${s.key}`)
      .transition().duration(400)
      .attr("stroke-width", !active ? 2.5 : (isHi ? 3.8 : 1.5))
      .attr("opacity",       !active ? 0.85 : (isHi ? 1   : 0.12));
    d3.select(`.line-label-${s.key}`)
      .transition().duration(400)
      .attr("opacity",     !active ? 1 : (isHi ? 1 : 0.18))
      .attr("font-weight", isHi ? "700" : "300");
  });
}
 
// -- CHART 3: BAR CHART -------------------------------------------
 
let barInitialized = false;
let barXSc;
 
function drawBarChart(stepIndex) {
  const el = document.getElementById("chart-bar");
  if (!el) return;
 
  const W = getW(el);
  const H = Math.round(W * 0.72);
  const m = { top: 40, right: 56, bottom: 36, left: 90 };
  const w = W - m.left - m.right;
  const h = H - m.top - m.bottom;
 
  if (!barInitialized) {
    barInitialized = true;
 
    const svg = d3.select(el)
      .append("svg")
      .attr("viewBox", `0 0 ${W} ${H}`)
      .attr("preserveAspectRatio","xMidYMid meet");
 
    svg.append("text")
      .attr("x", m.left).attr("y", 20)
      .attr("font-family","Playfair Display, serif")
      .attr("font-size","13px")
      .attr("fill","#1a1410")
      .text("How Many Close Friends Do Americans Have?");
 
    const g = svg.append("g").attr("transform",`translate(${m.left},${m.top})`);
 
    barXSc = d3.scaleLinear().domain([0, 42]).range([0, w]);
    const ySc = d3.scaleBand().domain(barData.map(d => d.label)).range([0, h]).padding(0.3);
 
    // Grid
    g.append("g").attr("class","grid")
      .attr("transform",`translate(0,${h})`)
      .call(d3.axisBottom(barXSc).tickSize(-h).tickFormat(""))
      .call(ax => {
        ax.select(".domain").remove();
        ax.selectAll("line").attr("stroke","#d4c9b4").attr("stroke-dasharray","3,3");
      });
 
    // Axes
    g.append("g").attr("class","axis").attr("transform",`translate(0,${h})`)
      .call(d3.axisBottom(barXSc).ticks(5).tickFormat(d => d+"%"))
      .call(ax => ax.select(".domain").remove());
 
    g.append("g").attr("class","axis")
      .call(d3.axisLeft(ySc).tickSize(0))
      .call(ax => {
        ax.select(".domain").remove();
        ax.selectAll("text").attr("dx","-4px").attr("font-size","11px");
      });
 
    const barColors = ["#c4b49a","#b8967a","#c9472a","#c9472a","#8b1a2f","#8b1a2f"];
 
    barData.forEach((d, i) => {
      const grp = g.append("g")
        .attr("class",`bar-group bar-group-${i}`)
        .attr("opacity", 0);
 
      grp.append("rect")
        .attr("class","bar-rect")
        .attr("y", ySc(d.label))
        .attr("height", ySc.bandwidth())
        .attr("rx", 2)
        .attr("fill", barColors[i])
        .attr("width", 0);
 
      grp.append("text")
        .attr("class",`bar-pct-${i}`)
        .attr("y", ySc(d.label) + ySc.bandwidth() / 2 + 4)
        .attr("font-size","11px")
        .attr("font-family","DM Sans, sans-serif")
        .attr("fill", i >= 4 ? "#8b1a2f" : "#5a5046")
        .attr("font-weight", i >= 4 ? "600" : "400")
        .attr("opacity", 0)
        .text(d.pct + "%");
 
      if (d.label === "5+ friends") {
        grp.append("text")
          .attr("class","bar-annotation")
          .attr("y", ySc(d.label) + ySc.bandwidth() / 2 - 5)
          .attr("font-size","9px")
          .attr("font-style","italic")
          .attr("font-family","DM Sans, sans-serif")
          .attr("fill","#8b1a2f")
          .attr("opacity", 0)
          .text("← Dunbar's threshold");
      }
    });
  }
 
  // Reveal bars by step: 0→none, 1→first 2, 2→first 4, 3→all
  const showCount = [0, 2, 4, 6][Math.min(stepIndex, 3)];
 
  barData.forEach((d, i) => {
    const show = i < showCount;
    d3.select(`.bar-group-${i}`)
      .transition().duration(400).delay(show ? i * 90 : 0)
      .attr("opacity", show ? 1 : 0);
 
    if (show) {
      d3.select(`.bar-group-${i}`).select(".bar-rect")
        .transition().duration(700).delay(i * 90).ease(d3.easeCubicOut)
        .attr("width", barXSc(d.pct));
 
      d3.select(`.bar-pct-${i}`)
        .attr("x", barXSc(d.pct) + 6)
        .transition().duration(400).delay(i * 90 + 650)
        .attr("opacity", 1);
 
      if (d.label === "5+ friends") {
        d3.select(`.bar-group-${i}`).select(".bar-annotation")
          .attr("x", barXSc(d.pct) + 6)
          .transition().duration(400).delay(i * 90 + 800)
          .attr("opacity", 1);
      }
    }
  });
}
 
// -- SCROLLAMA SETUP ---------------------------------------------
 
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
 
// -- INIT ON DOM READY -------------------------------------------
 
document.addEventListener("DOMContentLoaded", () => {
  // Draw initial state (step 0) for all charts
  drawDunbar(0);
  drawLineChart(0);
  drawBarChart(0);
 
  // Activate first step card in each section
  ["scrolly-dunbar","scrolly-line","scrolly-bar"].forEach(id => {
    const first = document.querySelector(`#${id} .step`);
    if (first) first.classList.add("is-active");
  });
 
  // Wire scrollama
  initScrollama("scrolly-dunbar", drawDunbar);
  initScrollama("scrolly-line",   drawLineChart);
  initScrollama("scrolly-bar",    drawBarChart);
});