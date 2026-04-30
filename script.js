const DUNBAR = [
  {label:"Acquaintances",sub:"up to 500",  r:185,fill:"#c4b49a",dark:true},
  {label:"Active Network",sub:"~150 people",r:143,fill:"#b8967a",dark:true},
  {label:"Friends",       sub:"~50 people", r:100,fill:"#c9472a",dark:false},
  {label:"Best Friends",  sub:"~15 people", r:60, fill:"#8b1a2f",dark:false},
  {label:"Intimates",     sub:"3–5 people", r:26, fill:"#1a1410",dark:false},
];
 
const LINE_AGES = [18,20,22,24,26,28,30,32,34];
const LINE_SERIES = [
  {key:"friends",  label:"Friends",  color:"#e05c4b", vals:[1.9,2.0,1.7,1.4,1.2,1.0,0.85,0.8,0.75]},
  {key:"alone",   label:"Alone",    color:"#999",    vals:[2.8,2.7,2.9,3.1,3.3,3.5,3.6,3.8,4.0]},
  {key:"partner", label:"Partner",  color:"#5b8db8", vals:[0.3,0.5,0.8,1.2,1.5,1.7,1.9,2.0,2.1]},
  {key:"parents", label:"Parents",  color:"#6aab7a", vals:[1.4,1.2,1.0,0.9,0.7,0.6,0.5,0.5,0.4]},
  {key:"children",label:"Children", color:"#8b6abf", vals:[0.0,0.0,0.1,0.2,0.4,0.6,0.9,1.1,1.3]},
  {key:"cowork",  label:"Coworkers",color:"#e8a838", vals:[0.4,0.5,0.6,0.7,0.8,0.8,0.7,0.7,0.6]},
];
 
const BARS = [
  {label:"0 friends",pct:8 ,note:"About <strong>1 in 12 Americans</strong> has zero close friends. Isolation at this level is linked to depression, anxiety, and poor health outcomes."},
  {label:"1 friend", pct:7 ,note:"With only <strong>one trusted person</strong>, a single life change — a move, a breakup — can leave someone completely without close support."},
  {label:"2 friends",pct:14,note:"Two close friends offer a <strong>minimal safety net</strong> — better than none, but fragile. One broken relationship can collapse it."},
  {label:"3 friends",pct:18,note:"Three close friends is the <strong>most common answer</strong>. Many adults quietly settle into a tight circle as social energy shrinks."},
  {label:"4 friends",pct:13,note:"Four close friends places Americans <strong>just below Dunbar's threshold</strong> of five — a real support network, just under the benchmark."},
  {label:"5+ friends",pct:38,note:"Only <strong>38% of Americans</strong> reach five or more close friends — Dunbar's healthy support threshold. A clear majority falls short."},
];
 
const WAFFLE = [
  {label:"Very Important",    color:"#8b1a2f",n:49},
  {label:"Rather Important",  color:"#c9472a",n:36},
  {label:"Not Very Important",color:"#c4b49a",n:10},
  {label:"Not at All",        color:"#d4c9b4",n:3},
  {label:"N/A",               color:"#e8e2d6",n:2},
];
 
const HAP = [
  {c:"Canada",    hi:96,lo:85},
  {c:"Singapore", hi:96,lo:82},
  {c:"US",        hi:90,lo:78},
  {c:"Australia", hi:89,lo:76},
  {c:"Germany",   hi:85,lo:73},
  {c:"UK",        hi:84,lo:72},
  {c:"Spain",     hi:82,lo:67},
  {c:"France",    hi:79,lo:68},
  {c:"Brazil",    hi:76,lo:64},
  {c:"Mexico",    hi:74,lo:63},
  {c:"Turkey",    hi:68,lo:58},
  {c:"China",     hi:65,lo:56},
  {c:"India",     hi:63,lo:54},
  {c:"Iran",      hi:55,lo:55},
  {c:"Moldova",   hi:39,lo:31},
];
 
const INSIGHTS = {
  18:"At <strong>18</strong>, friends fill nearly 2 hours daily. Alone time already leads all categories — a pattern that only deepens.",
  19:"Still near the social peak. Careers haven't yet reshaped the calendar.",
  20:"<strong>Peak friend time.</strong> About 2 hours daily. The decline is about to begin.",
  21:"The decline starts. Friend time begins to yield to work and new relationships.",
  22:"Friends drop noticeably as careers begin. <strong>Partner time rises</strong> for the first time.",
  23:"Partner time overtakes parent time. Friends slip to about 1.5 hours daily.",
  24:"<strong>Partner time rivals friend time.</strong> A new social order forms around work and relationships.",
  25:"Children begin to appear on the chart. Alone time quietly crosses 3 hours.",
  26:"Friends fall below 1.2 hours. <strong>Alone time now exceeds all other categories.</strong>",
  27:"The crossover is complete. Partner, children, and alone time dominate.",
  28:"Friends average under an hour — <strong>less than half the time spent alone.</strong>",
  29:"Partner and children time keep rising. Friend time approaches 50 minutes.",
  30:"At <strong>30</strong>, friend time has fallen 60% from its peak.",
  31:"Children now rival partner time. The calendar belongs to family.",
  32:"Friends receive about 48 minutes per day — a fraction of the 20s peak.",
  33:"Alone time nears 4 hours. Friend time is the smallest social category.",
  34:"At <strong>34</strong>, friends get just 45 min/day. <strong>Alone time: over 4 hours.</strong>",
};
 
// ════════════════════════════════════════════════
// CHART 1 — DUNBAR (SCROLLAMA)
// ════════════════════════════════════════════════
(function(){
  const el = document.getElementById("chart-dunbar");
  const SZ = 370, cx = SZ/2, cy = SZ/2 + 14, sc = SZ/400;
  const svg = d3.select(el).append("svg")
    .attr("viewBox",`0 0 ${SZ} ${SZ}`)
    .attr("preserveAspectRatio","xMidYMid meet");
 
  svg.append("text")
    .attr("x",SZ/2).attr("y",16).attr("text-anchor","middle")
    .attr("font-family","Playfair Display,serif")
    .attr("font-size","13px").attr("font-weight","700").attr("fill","#1a1410")
    .text("Circles of Friendship");
 
  DUNBAR.forEach((d,i)=>{
    const r = d.r * sc;
    const g = svg.append("g").attr("class","ring ring-"+i).attr("opacity",0);
    g.append("circle")
      .attr("cx",cx).attr("cy",cy).attr("r",r)
      .attr("fill",d.fill)
      .attr("fill-opacity",i<2?.2:.3)
      .attr("stroke",d.fill).attr("stroke-width",1.5);
    g.append("text")
      .attr("x",cx).attr("y",cy-r+16).attr("text-anchor","middle")
      .attr("font-family","DM Sans,sans-serif")
      .attr("font-size",Math.max(8,12-i*1.1)+"px").attr("font-weight","600")
      .attr("fill",d.dark?"#1a1410":"#fff")
      .text(d.label);
    g.append("text")
      .attr("x",cx).attr("y",cy-r+27).attr("text-anchor","middle")
      .attr("font-family","DM Sans,sans-serif").attr("font-size","8px")
      .attr("font-style","italic")
      .attr("fill",d.dark?"#5a5046":"rgba(255,255,255,.7)")
      .text(d.sub);
  });
 
  // show ring i and below
  function show(idx){
    DUNBAR.forEach((_,i)=>{
      d3.select(".ring-"+i)
        .transition().duration(500).delay(i<=idx?i*90:0)
        .attr("opacity",i<=idx?1:0);
    });
  }
  show(0);
 
  // Scrollama
  const scroller = scrollama();
  scroller.setup({step:"#scrolly-dunbar .step",offset:.55})
    .onStepEnter(({index})=>{
      document.querySelectorAll("#scrolly-dunbar .step").forEach((el,i)=>{
        el.classList.toggle("active",i===index);
      });
      show(index);
    });
  document.querySelector("#scrolly-dunbar .step").classList.add("active");
  window.addEventListener("resize",()=>scroller.resize());
})();
 
// ════════════════════════════════════════════════
// CHART 2 — LINE + SCRUBBER
// ════════════════════════════════════════════════
(function(){
  // Fixed viewBox — no DOM measurement needed
  const VW=480, VH=260;
  const m={top:18,right:72,bottom:38,left:40};
  const iw=VW-m.left-m.right; // 368
  const ih=VH-m.top-m.bottom; // 204
 
  const xSc = d3.scaleLinear().domain([18,34]).range([0,iw]);
  const ySc = d3.scaleLinear().domain([0,5]).range([ih,0]).nice();
 
  const svg = d3.select("#chart-line").append("svg")
    .attr("viewBox",`0 0 ${VW} ${VH}`)
    .attr("preserveAspectRatio","xMidYMid meet");
 
  const g = svg.append("g").attr("transform",`translate(${m.left},${m.top})`);
 
  // Grid lines
  g.append("g").attr("class","grid")
    .call(d3.axisLeft(ySc).tickSize(-iw).tickFormat(""))
    .call(a=>a.select(".domain").remove());
 
  // Axes
  g.append("g").attr("class","axis").attr("transform",`translate(0,${ih})`)
    .call(d3.axisBottom(xSc).ticks(8).tickFormat(d=>""+d));
  g.append("g").attr("class","axis")
    .call(d3.axisLeft(ySc).ticks(5));
 
  // Axis labels
  g.append("text").attr("x",iw/2).attr("y",ih+32)
    .attr("text-anchor","middle").attr("font-family","DM Sans,sans-serif")
    .attr("font-size","10px").attr("fill","#5a5046").text("Age");
  g.append("text").attr("transform","rotate(-90)").attr("x",-ih/2).attr("y",-28)
    .attr("text-anchor","middle").attr("font-family","DM Sans,sans-serif")
    .attr("font-size","10px").attr("fill","#5a5046").text("Hrs / day");
 
  // Clip path starting at width=0
  const clipRect = svg.append("defs").append("clipPath").attr("id","lc")
    .append("rect").attr("x",0).attr("y",-m.top).attr("width",0).attr("height",VH+10);
 
  // Separate end-label Y positions to avoid overlap
  const sorted = [...LINE_SERIES].sort((a,b)=>b.vals[b.vals.length-1]-a.vals[a.vals.length-1]);
  const lbY={};
  sorted.forEach((s,i)=>{
    const raw = m.top + ySc(s.vals[s.vals.length-1]);
    const prev = i>0 ? lbY[sorted[i-1].key] : -Infinity;
    lbY[s.key] = Math.max(raw, prev+12);
  });
 
  const lineGen = d3.line()
    .x((_,i)=>xSc(LINE_AGES[i])).y(d=>ySc(d))
    .curve(d3.curveCatmullRom.alpha(0.5));
 
  LINE_SERIES.forEach(s=>{
    g.append("path").datum(s.vals)
      .attr("fill","none").attr("stroke",s.color)
      .attr("stroke-width",s.key==="friends"?2.8:1.7)
      .attr("stroke-linejoin","round").attr("stroke-linecap","round")
      .attr("d",lineGen).attr("clip-path","url(#lc)");
    // End labels — positioned in SVG coordinates (relative to g), draw outside clip
    svg.append("text")
      .attr("x",m.left+iw+5).attr("y",lbY[s.key]+3)
      .attr("fill",s.color)
      .attr("font-size",s.key==="friends"?"10px":"9px")
      .attr("font-family","DM Sans,sans-serif")
      .attr("font-weight",s.key==="friends"?"600":"400")
      .attr("clip-path","url(#lc)")
      .text(s.label);
  });
 
  // Cursor group
  const cur = g.append("g").attr("class","cur").style("visibility","hidden");
  cur.append("line").attr("class","cur-rule")
    .attr("y1",0).attr("y2",ih)
    .attr("stroke","rgba(26,20,16,.35)").attr("stroke-width",1)
    .attr("stroke-dasharray","4,3");
  const cdots={};
  LINE_SERIES.forEach(s=>{
    cdots[s.key]=cur.append("circle")
      .attr("r",s.key==="friends"?5:3.5)
      .attr("fill",s.color).attr("stroke","#f5f0e8").attr("stroke-width",1.5);
  });
 
  // Interpolation
  function interp(vals,age){
    if(age<=LINE_AGES[0]) return vals[0];
    if(age>=LINE_AGES[LINE_AGES.length-1]) return vals[vals.length-1];
    const i=LINE_AGES.findIndex(a=>a>age);
    const t=(age-LINE_AGES[i-1])/(LINE_AGES[i]-LINE_AGES[i-1]);
    return vals[i-1]+t*(vals[i]-vals[i-1]);
  }
 
  // Build sidebar value table
  const vtEl = document.getElementById("val-table");
  LINE_SERIES.forEach(s=>{
    const row=document.createElement("div");
    row.className="val-row";
    row.innerHTML=`<span class="val-dot" style="background:${s.color}"></span>
      <span class="val-label">${s.label}</span>
      <span class="val-num" id="vn-${s.key}">–</span>`;
    vtEl.appendChild(row);
  });
 
  function moveCursor(age){
    cur.style("visibility","visible");
    const x=xSc(age);
    cur.select(".cur-rule").attr("x1",x).attr("x2",x);
    LINE_SERIES.forEach(s=>{
      const v=interp(s.vals,age);
      cdots[s.key].attr("cx",x).attr("cy",ySc(v));
      const el=document.getElementById("vn-"+s.key);
      if(el) el.textContent=v.toFixed(1)+"h";
    });
    document.getElementById("ins-age").textContent=age;
    const av=document.getElementById("age-val");
    if(av) av.textContent=age;
    const itEl=document.getElementById("ins-txt");
    if(itEl) itEl.innerHTML=INSIGHTS[age]||INSIGHTS[18];
  }
 
  // Wire scrubber IMMEDIATELY — no need for IntersectionObserver
  const slider=document.getElementById("age-slider");
  const ageVal=document.getElementById("age-val");
  slider.addEventListener("input",function(){
    moveCursor(+this.value);
  });
 
  // IntersectionObserver triggers clip animation (draw lines in)
  let drawn=false;
  new IntersectionObserver(entries=>{
    if(entries[0].isIntersecting&&!drawn){
      drawn=true;
      clipRect.transition().duration(1400).ease(d3.easeQuadInOut)
        .attr("width",iw+m.right+20);
      setTimeout(()=>moveCursor(18),300);
    }
  },{threshold:0.3}).observe(document.getElementById("chart-line"));
})();
 
// ════════════════════════════════════════════════
// CHART 3 — BAR (animate + click callout)
// ════════════════════════════════════════════════
(function(){
  const VW=540, VH=240;
  const m={top:24,right:50,bottom:32,left:88};
  const iw=VW-m.left-m.right; // 402
  const ih=VH-m.top-m.bottom; // 184
 
  const xSc=d3.scaleLinear().domain([0,42]).range([0,iw]);
  const ySc=d3.scaleBand().domain(BARS.map(d=>d.label)).range([0,ih]).padding(0.25);
 
  const svg=d3.select("#chart-bar").append("svg")
    .attr("viewBox",`0 0 ${VW} ${VH}`)
    .attr("preserveAspectRatio","xMidYMid meet");
  const g=svg.append("g").attr("transform",`translate(${m.left},${m.top})`);
 
  // Grid
  g.append("g").attr("class","grid").attr("transform",`translate(0,${ih})`)
    .call(d3.axisBottom(xSc).tickSize(-ih).tickFormat("").ticks(5))
    .call(a=>a.select(".domain").remove());
 
  // Axes
  g.append("g").attr("class","axis").attr("transform",`translate(0,${ih})`)
    .call(d3.axisBottom(xSc).ticks(5).tickFormat(d=>d+"%"))
    .call(a=>a.select(".domain").remove());
  g.append("g").attr("class","axis")
    .call(d3.axisLeft(ySc).tickSize(0))
    .call(a=>{a.select(".domain").remove();a.selectAll("text").attr("dx","-4px").attr("font-size","11px");});
 
  // Dunbar threshold
  const tx=xSc(38);
  g.append("line").attr("x1",tx).attr("x2",tx).attr("y1",-12).attr("y2",ih)
    .attr("stroke","#8b1a2f").attr("stroke-width",1.5)
    .attr("stroke-dasharray","5,4").attr("opacity",.5);
  g.append("text").attr("x",tx+4).attr("y",-14)
    .attr("font-family","DM Sans,sans-serif").attr("font-size","8.5px")
    .attr("fill","#8b1a2f").attr("font-style","italic")
    .text("5-friend threshold");
 
  const COLORS=["#c4b49a","#b8967a","#c9472a","#c9472a","#8b1a2f","#8b1a2f"];
  const calloutEl=document.getElementById("bar-callout");
  let selected=null;
 
  const grps=BARS.map((d,i)=>{
    const grp=g.append("g").style("cursor","pointer");
    // Wide invisible hit area
    grp.append("rect")
      .attr("x",-m.left).attr("y",ySc(d.label))
      .attr("width",VW).attr("height",ySc.bandwidth())
      .attr("fill","transparent");
    // Bar starting at 0
    const bar=grp.append("rect")
      .attr("y",ySc(d.label)).attr("height",ySc.bandwidth())
      .attr("rx",2).attr("fill",COLORS[i]).attr("width",0);
    // Label
    const lbl=grp.append("text")
      .attr("y",ySc(d.label)+ySc.bandwidth()/2+4)
      .attr("x",4).attr("opacity",0)
      .attr("font-family","DM Sans,sans-serif")
      .attr("font-size","11.5px")
      .attr("font-weight",i>=4?"600":"400")
      .attr("fill",i>=4?"#8b1a2f":"#5a5046")
      .text(d.pct+"%");
 
    grp.on("mouseenter",function(){
      if(selected!==i) bar.transition().duration(100).attr("fill-opacity",.72);
    }).on("mouseleave",function(){
      if(selected!==i) bar.transition().duration(100).attr("fill-opacity",1);
    }).on("click",function(){
      if(selected===i){
        selected=null;
        grps.forEach(({bar:b})=>b.transition().duration(180).attr("opacity",1));
        calloutEl.classList.remove("open");
      } else {
        selected=i;
        grps.forEach(({bar:b},j)=>b.transition().duration(180).attr("opacity",j===i?1:.25));
        calloutEl.innerHTML=d.note;
        calloutEl.classList.add("open");
      }
    });
    return {grp,bar,lbl,d};
  });
 
  // Animate bars when visible
  let drawn=false;
  new IntersectionObserver(entries=>{
    if(entries[0].isIntersecting&&!drawn){
      drawn=true;
      grps.forEach(({bar,lbl,d},i)=>{
        const delay=i*80;
        bar.transition().duration(600).delay(delay)
          .ease(d3.easeBackOut.overshoot(0.5))
          .attr("width",xSc(d.pct));
        lbl.attr("x",xSc(d.pct)+6)
          .transition().duration(250).delay(delay+480)
          .attr("opacity",1);
      });
    }
  },{threshold:.35}).observe(document.getElementById("chart-bar"));
})();
 
// ════════════════════════════════════════════════
// CHART 4 — WAFFLE (cascade)
// ════════════════════════════════════════════════
(function(){
  const SZ=22, GAP=4, COLS=10;
  const W=COLS*(SZ+GAP)-GAP;
  const H=10*(SZ+GAP)-GAP;
 
  const svg=d3.select("#chart-importance").append("svg")
    .attr("width",W).attr("height",H).style("display","block");
 
  const dots=[];
  WAFFLE.forEach(cat=>{for(let i=0;i<cat.n;i++) dots.push(cat);});
 
  svg.selectAll(".wd").data(dots).join("rect")
    .attr("class","wd")
    .attr("x",(_,i)=>(i%COLS)*(SZ+GAP))
    .attr("y",(_,i)=>Math.floor(i/COLS)*(SZ+GAP))
    .attr("width",SZ).attr("height",SZ).attr("rx",4)
    .attr("fill",d=>d.color).attr("opacity",0);
 
  // Legend
  const legEl=document.getElementById("waffle-legend");
  WAFFLE.forEach(cat=>{
    const el=document.createElement("div");
    el.className="wleg-item";
    el.innerHTML=`<span class="wleg-sq" style="background:${cat.color}"></span>
      <span>${cat.label} <span class="wleg-pct">${cat.n}%</span></span>`;
    legEl.appendChild(el);
  });
 
  let drawn=false;
  new IntersectionObserver(entries=>{
    if(entries[0].isIntersecting&&!drawn){
      drawn=true;
      svg.selectAll(".wd")
        .transition().duration(180)
        .delay((_,i)=>i*15)
        .ease(d3.easeBackOut.overshoot(1.3))
        .attr("opacity",1);
    }
  },{threshold:.2}).observe(document.getElementById("chart-importance"));
})();
 
// ════════════════════════════════════════════════
// CHART 5 — HAPPINESS (animate in + hover)
// ════════════════════════════════════════════════
(function(){
  const VW=600, VH=470;
  const m={top:40,right:44,bottom:34,left:88};
  const iw=VW-m.left-m.right; // 468
  const ih=VH-m.top-m.bottom; // 396
 
  const xSc=d3.scaleLinear().domain([25,100]).range([0,iw]);
  const ySc=d3.scaleBand().domain(HAP.map(d=>d.c)).range([0,ih]).padding(0.35);
 
  const svg=d3.select("#chart-happiness").append("svg")
    .attr("viewBox",`0 0 ${VW} ${VH}`)
    .attr("preserveAspectRatio","xMidYMid meet");
  const g=svg.append("g").attr("transform",`translate(${m.left},${m.top})`);
 
  // Grid
  g.append("g").attr("class","grid")
    .call(d3.axisTop(xSc).tickSize(-ih).tickFormat("").ticks(6))
    .call(a=>a.select(".domain").remove());
 
  // X axis
  g.append("g").attr("class","axis")
    .call(d3.axisTop(xSc).ticks(6).tickFormat(d=>d+"%"))
    .call(a=>a.select(".domain").remove());
 
  // Y axis
  g.append("g").attr("class","axis")
    .call(d3.axisLeft(ySc).tickSize(0))
    .call(a=>{
      a.select(".domain").remove();
      a.selectAll("text").attr("dx","-5px").attr("font-size","10px")
        .attr("font-weight",d=>d==="US"?"700":"400")
        .attr("fill",d=>d==="US"?"#8b1a2f":"#5a5046");
    });
 
  // Axis label
  g.append("text").attr("x",iw/2).attr("y",-28)
    .attr("text-anchor","middle").attr("font-family","DM Sans,sans-serif")
    .attr("font-size","9px").attr("fill","#5a5046")
    .text("% who say they are happy");
 
  // Legend
  const legG=svg.append("g").attr("transform",`translate(${m.left+iw/2-90},${VH-14})`);
  [{label:"Often with friends",filled:true},{label:"Rarely with friends",filled:false}]
    .forEach((item,i)=>{
      const lx=i*185;
      legG.append("circle").attr("cx",lx+5).attr("cy",0).attr("r",4.5)
        .attr("fill",item.filled?"#c9472a":"white")
        .attr("stroke","#c9472a").attr("stroke-width",1.5);
      legG.append("text").attr("x",lx+14).attr("y",4)
        .attr("font-family","DM Sans,sans-serif").attr("font-size","9px")
        .attr("fill","#5a5046").text(item.label);
    });
 
  const tip=document.getElementById("tooltip");
 
  const rows=HAP.map((d,i)=>{
    const cy=ySc(d.c)+ySc.bandwidth()/2;
    const x1=xSc(d.lo), x2=xSc(d.hi);
    const isUS=d.c==="US";
    const gap=d.hi-d.lo;
 
    const rg=g.append("g").attr("class","hr").style("cursor","pointer");
 
    // Wide hit area
    rg.append("rect").attr("x",-m.left).attr("y",ySc(d.c))
      .attr("width",VW).attr("height",ySc.bandwidth()).attr("fill","transparent");
 
    // Line (collapsed to a point at x1)
    const line=rg.append("line")
      .attr("x1",x1).attr("x2",x1).attr("y1",cy).attr("y2",cy)
      .attr("stroke",isUS?"#8b1a2f":"#c4b49a")
      .attr("stroke-width",isUS?2.5:1.5).attr("opacity",0);
 
    // Rarely dot (hollow)
    const rdot=rg.append("circle")
      .attr("cx",x1).attr("cy",cy).attr("r",isUS?5.5:4)
      .attr("fill","white")
      .attr("stroke",isUS?"#8b1a2f":"#c9472a")
      .attr("stroke-width",isUS?2:1.5).attr("opacity",0);
 
    // Often dot (filled, starts at x1)
    const odot=rg.append("circle")
      .attr("cx",x1).attr("cy",cy).attr("r",isUS?5.5:4)
      .attr("fill",isUS?"#8b1a2f":"#c9472a").attr("opacity",0);
 
    // Gap label (hidden until hover)
    const gapLbl= gap>0
      ? rg.append("text")
          .attr("x",(x1+x2)/2).attr("y",cy-8)
          .attr("text-anchor","middle")
          .attr("font-family","DM Sans,sans-serif").attr("font-size","8.5px")
          .attr("font-weight","700").attr("fill","#8b1a2f").attr("opacity",0)
          .text("+"+gap+"pp")
      : null;
 
    // Hover
    rg.on("mouseenter",function(event){
      g.selectAll(".hr").transition().duration(130).attr("opacity",.12);
      d3.select(this).transition().duration(130).attr("opacity",1);
      if(gapLbl) gapLbl.transition().duration(180).attr("opacity",1);
      if(tip){
        const name=d.c==="US"?"United States":d.c;
        const gapStr=gap===0?"No difference between groups":`Often: ${d.hi}%  |  Rarely: ${d.lo}%  |  Gap: +${gap}pp`;
        tip.innerHTML=`<strong>${name}</strong>${gapStr}`;
        tip.style.opacity="1";
        tip.style.left=(event.clientX+14)+"px";
        tip.style.top=(event.clientY-14)+"px";
      }
    }).on("mousemove",function(event){
      if(tip){tip.style.left=(event.clientX+14)+"px";tip.style.top=(event.clientY-14)+"px";}
    }).on("mouseleave",function(){
      g.selectAll(".hr").transition().duration(180).attr("opacity",1);
      if(gapLbl) gapLbl.transition().duration(130).attr("opacity",0);
      if(tip) tip.style.opacity="0";
    });
 
    return {line,rdot,odot,x2};
  });
 
  // Animate rows in
  let drawn=false;
  new IntersectionObserver(entries=>{
    if(entries[0].isIntersecting&&!drawn){
      drawn=true;
      rows.forEach(({line,rdot,odot,x2},i)=>{
        const d=i*45;
        rdot.transition().duration(220).delay(d).attr("opacity",1);
        line.transition().duration(480).delay(d+70).attr("opacity",1).attr("x2",x2);
        odot.transition().duration(260).delay(d+270).attr("cx",x2).attr("opacity",1);
      });
    }
  },{threshold:.15}).observe(document.getElementById("chart-happiness"));
})();