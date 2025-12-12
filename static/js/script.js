!function(){"use strict";(t=>{const{screen:{width:e,height:a},navigator:{language:r},location:n,localStorage:i,document:c,history:o}=t,{hostname:s,href:u}=n,{currentScript:l,referrer:d}=c;if(!l)return;const m="data-",f=l.getAttribute.bind(l),h=f(m+"website-id"),p=f(m+"host-url"),g=f(m+"tag"),y="false"!==f(m+"auto-track"),b="true"===f(m+"exclude-search"),v=f(m+"domains")||"",w=v.split(",").map((t=>t.trim())),S=`${(p||"https://api-gateway.umami.dev"||l.src.split("/").slice(0,-1).join("/")).replace(/\/$/,"")}/api/send`,N=`${e}x${a}`,T=/data-umami-event-([\w-_]+)/,A=m+"umami-event",x=300,O=t=>{if(t){try{const e=decodeURI(t);if(e!==t)return e}catch(e){return t}return encodeURI(t)}},U=t=>{try{const{pathname:e,search:a}=new URL(t);t=e+a}catch(t){}return b?t.split("?")[0]:t},j=()=>({website:h,hostname:s,screen:N,language:r,title:O(q),url:O(D),referrer:O(_),tag:g||void 0}),k=(t,e,a)=>{a&&(_=D,D=U(a.toString()),D!==_&&setTimeout(I,x))},E=()=>!h||i&&i.getItem("umami.disabled")||v&&!w.includes(s),L=async(t,e="event")=>{if(E())return;const a={"Content-Type":"application/json"};void 0!==R&&(a["x-umami-cache"]=R);try{const r=await fetch(S,{method:"POST",body:JSON.stringify({type:e,payload:t}),headers:a}),n=await r.text();return R=n}catch(t){}},$=()=>{B||(I(),(()=>{const t=(t,e,a)=>{const r=t[e];return(...e)=>(a.apply(null,e),r.apply(t,e))};o.pushState=t(o,"pushState",k),o.replaceState=t(o,"replaceState",k)})(),(()=>{const t=new MutationObserver((([t])=>{q=t&&t.target?t.target.text:void 0})),e=c.querySelector("head > title");e&&t.observe(e,{subtree:!0,characterData:!0,childList:!0})})(),c.addEventListener("click",(async t=>{const e=t=>["BUTTON","A"].includes(t),a=async t=>{const e=t.getAttribute.bind(t),a=e(A);if(a){const r={};return t.getAttributeNames().forEach((t=>{const a=t.match(T);a&&(r[a[1]]=e(t))})),I(a,r)}},r=t.target,i=e(r.tagName)?r:((t,a)=>{let r=t;for(let t=0;t<a;t++){if(e(r.tagName))return r;if(r=r.parentElement,!r)return null}})(r,10);if(!i)return a(r);{const{href:e,target:r}=i,c=i.getAttribute(A);if(c)if("A"===i.tagName){const o="_blank"===r||t.ctrlKey||t.shiftKey||t.metaKey||t.button&&1===t.button;if(c&&e)return o||t.preventDefault(),a(i).then((()=>{o||(n.href=e)}))}else if("BUTTON"===i.tagName)return a(i)}}),!0),B=!0)},I=(t,e)=>L("string"==typeof t?{...j(),name:t,data:"object"==typeof e?e:void 0}:"object"==typeof t?t:"function"==typeof t?t(j()):j()),K=t=>L({...j(),data:t},"identify");t.umami||(t.umami={track:I,identify:K});let R,B,D=U(u),_=d!==s?d:"",q=c.title;y&&!E()&&("complete"===c.readyState?$():c.addEventListener("readystatechange",$,!0))})(window)}();


// 平滑返回顶部
function scrollToTop() {
  window.scrollTo({ top: 0, behavior: "smooth" });
}

(function setupBackToTop() {
  const btn = document.getElementById("btnToTop");
  const ring = document.getElementById("circle-progress");
  if (!btn || !ring) return;

  // 圆的周长（与 r 对应：r=15.9155 => 周长≈100），这里显式计算更稳
  const r = 15.9155;
  const circumference = 2 * Math.PI * r;
  ring.style.strokeDasharray = `${circumference} ${circumference}`;
  ring.style.strokeDashoffset = `${circumference}`; // 初始 0%

  const THRESHOLD = 120;
  let scheduled = false;

  function computeProgress() {
    const doc = document.documentElement;
    const scrollTop = window.scrollY || doc.scrollTop || 0;
    const max = Math.max(1, doc.scrollHeight - window.innerHeight);
    const p = Math.min(1, Math.max(0, scrollTop / max)); // 0~1
    return { scrollTop, p };
  }

  function apply() {
    const { scrollTop, p } = computeProgress();

    // 显示/隐藏 + 渐入
    if (scrollTop > THRESHOLD) {
      if (btn.style.display !== "block") btn.style.display = "block";
      btn.classList.add("show");
    } else {
      btn.classList.remove("show");
      // 等过渡结束后再隐藏，避免闪烁
      setTimeout(() => {
        if (!btn.classList.contains("show")) btn.style.display = "none";
      }, 200);
    }

    // 进度：0% => dashoffset=周长；100% => 0
    const offset = circumference * (1 - p);
    ring.style.strokeDashoffset = `${offset}`;

    scheduled = false;
  }

  // rAF 节流：滚动频繁时只在下一帧更新一次，显著更顺滑
  function onScrollResize() {
    if (!scheduled) {
      scheduled = true;
      requestAnimationFrame(apply);
    }
  }

  document.addEventListener("DOMContentLoaded", apply, { once: true });
  window.addEventListener("scroll", onScrollResize, { passive: true });
  window.addEventListener("resize", onScrollResize);
})();



// ========== 随机打乱（增强版） ==========

// ---- 1. 字符串 Hash → 32bit ----
function hash32(str) {
  // FNV-1a
  let h = 0x811c9dc5;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return h >>> 0;
}

// ---- 2. 每日 seed（安全，不溢出） ----
function todaySeed() {
  const now = new Date();
  const s = `${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()}`;
  return hash32(s);
}

// ---- 3. 获取 URL seed ----
function getSeedFromURL() {
  const params = new URLSearchParams(location.search);
  const v = params.get("seed");
  if (!v) return null;
  const n = Number(v);
  return Number.isFinite(n) ? n >>> 0 : null;
}

// ---- 4. 高质量 PRNG：Mulberry32 ----
function makePRNG(seed) {
  let a = seed >>> 0;
  return function () {
    a |= 0; 
    a = (a + 0x6D2B79F5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// ---- 5. 加权 Fisher–Yates 洗牌：最近更新更容易前排 ----
//
// 权重计算：
//   w = 1 + (recencyBoost * recentFactor)
//   recentFactor = e^(-days/decay)
// 其中 decay 控制衰减时间（例如 14 天半衰）
// boost 控制影响程度（例如 0.4 = 40% 影响）
//
function weightedShuffle(arr, rnd, getWeight) {
  // 先根据 rnd × weight 做排序（不是纯 Fisher–Yates）
  // 这是更稳定的大规模加权洗牌算法
  return arr
    .map(item => ({ item, key: Math.log(rnd()) / getWeight(item) }))
    .sort((a, b) => a.key - b.key)
    .map(o => o.item);
}

// ---- 6. 从元素上读取更新时间（例如 data-updated="2025-12-10"） ----
function readUpdatedDate(el) {
  const v = el.dataset.updated;
  if (!v) return null;

  const d = new Date(v);
  return Number.isFinite(d.getTime()) ? d : null;
}

// ---- 7. 总运行逻辑 ----
function runShuffle() {
  const container = document.querySelector("#site-list");
  if (!container) return;

  const items = Array.from(container.querySelectorAll(":scope > a"));

  const seed = getSeedFromURL() ?? todaySeed();
  const rnd = makePRNG(seed);

  const today = new Date();

  // ------ 权重参数（你可自由调整） ------
  const recencyBoost = 0.4;   // 最近越近越可能前排，但不会超过 40% 影响
  const decayDays = 14;       // 14天衰减 —— 半个月后影响几乎消失

  function weightFn(el) {
    const updated = readUpdatedDate(el);
    if (!updated) return 1;

    const diffDays = (today - updated) / 86400000;
    if (diffDays < 0) return 1; // 防未来日期

    const recencyFactor = Math.exp(-diffDays / decayDays);
    return 1 + recencyBoost * recencyFactor;
  }

  const shuffled = weightedShuffle(items, rnd, weightFn);

  container.replaceChildren(...shuffled);

  container.classList.add("is-ready");
  container.removeAttribute("data-shuffle-pending");

  console.log(
    `[每日随机顺序] seed = ${seed} (${getSeedFromURL() ? "from URL" : "daily"})`
  );
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", runShuffle, { once: true });
} else {
  runShuffle();
}

// ========== 随机打乱（增强版）结束 ==========


