!function(){"use strict";(t=>{const{screen:{width:e,height:a},navigator:{language:r},location:n,localStorage:i,document:c,history:o}=t,{hostname:s,href:u}=n,{currentScript:l,referrer:d}=c;if(!l)return;const m="data-",f=l.getAttribute.bind(l),h=f(m+"website-id"),p=f(m+"host-url"),g=f(m+"tag"),y="false"!==f(m+"auto-track"),b="true"===f(m+"exclude-search"),v=f(m+"domains")||"",w=v.split(",").map((t=>t.trim())),S=`${(p||"https://api-gateway.umami.dev"||l.src.split("/").slice(0,-1).join("/")).replace(/\/$/,"")}/api/send`,N=`${e}x${a}`,T=/data-umami-event-([\w-_]+)/,A=m+"umami-event",x=300,O=t=>{if(t){try{const e=decodeURI(t);if(e!==t)return e}catch(e){return t}return encodeURI(t)}},U=t=>{try{const{pathname:e,search:a}=new URL(t);t=e+a}catch(t){}return b?t.split("?")[0]:t},j=()=>({website:h,hostname:s,screen:N,language:r,title:O(q),url:O(D),referrer:O(_),tag:g||void 0}),k=(t,e,a)=>{a&&(_=D,D=U(a.toString()),D!==_&&setTimeout(I,x))},E=()=>!h||i&&i.getItem("umami.disabled")||v&&!w.includes(s),L=async(t,e="event")=>{if(E())return;const a={"Content-Type":"application/json"};void 0!==R&&(a["x-umami-cache"]=R);try{const r=await fetch(S,{method:"POST",body:JSON.stringify({type:e,payload:t}),headers:a}),n=await r.text();return R=n}catch(t){}},$=()=>{B||(I(),(()=>{const t=(t,e,a)=>{const r=t[e];return(...e)=>(a.apply(null,e),r.apply(t,e))};o.pushState=t(o,"pushState",k),o.replaceState=t(o,"replaceState",k)})(),(()=>{const t=new MutationObserver((([t])=>{q=t&&t.target?t.target.text:void 0})),e=c.querySelector("head > title");e&&t.observe(e,{subtree:!0,characterData:!0,childList:!0})})(),c.addEventListener("click",(async t=>{const e=t=>["BUTTON","A"].includes(t),a=async t=>{const e=t.getAttribute.bind(t),a=e(A);if(a){const r={};return t.getAttributeNames().forEach((t=>{const a=t.match(T);a&&(r[a[1]]=e(t))})),I(a,r)}},r=t.target,i=e(r.tagName)?r:((t,a)=>{let r=t;for(let t=0;t<a;t++){if(e(r.tagName))return r;if(r=r.parentElement,!r)return null}})(r,10);if(!i)return a(r);{const{href:e,target:r}=i,c=i.getAttribute(A);if(c)if("A"===i.tagName){const o="_blank"===r||t.ctrlKey||t.shiftKey||t.metaKey||t.button&&1===t.button;if(c&&e)return o||t.preventDefault(),a(i).then((()=>{o||(n.href=e)}))}else if("BUTTON"===i.tagName)return a(i)}}),!0),B=!0)},I=(t,e)=>L("string"==typeof t?{...j(),name:t,data:"object"==typeof e?e:void 0}:"object"==typeof t?t:"function"==typeof t?t(j()):j()),K=t=>L({...j(),data:t},"identify");t.umami||(t.umami={track:I,identify:K});let R,B,D=U(u),_=d!==s?d:"",q=c.title;y&&!E()&&("complete"===c.readyState?$():c.addEventListener("readystatechange",$,!0))})(window)}();


/* ========= 随机&浮动按钮：优化版 ========= */

/** 平滑滚动 */
function scrollToTop() {
  window.scrollTo({ top: 0, behavior: "smooth" });
}
function scrollToBottom() {
  window.scrollTo({ top: document.documentElement.scrollHeight, behavior: "smooth" });
}

/** 配置：你的站点卡片容器（直接放一堆 <a> 的那个 grid） */
const SITE_CONTAINER = "#site-list";

/** 需要排除的按钮（避免被随机选中），写它们的 id */
const EXCLUDE_BUTTON_IDS = ["btnToTop", "btnRandom", "btnToBottom"];

/** 内部：把需要排除的节点集合好，便于 contains 检查 */
function getExcludedRoots() {
  return EXCLUDE_BUTTON_IDS
    .map((id) => document.getElementById(id))
    .filter(Boolean);
}

/** 内部：是否在排除节点里（按钮本体或其子孙） */
function isInsideExcluded(el, excludedRoots) {
  return excludedRoots.some((root) => root.contains(el));
}

/** 更稳的随机索引（优先使用 crypto） */
function randIndex(n) {
  if (n <= 1) return 0;
  if (window.crypto && crypto.getRandomValues) {
    const buf = new Uint32Array(1);
    crypto.getRandomValues(buf);
    // 避免取模偏差影响可忽略，这里直接取模即可
    return buf[0] % n;
  }
  return Math.floor(Math.random() * n);
}

/** 链接缓存 + 刷新逻辑（避免每次都全量 query） */
let CACHED_LINKS = [];

function refreshLinks() {
  const container = document.querySelector(SITE_CONTAINER);
  const roots = getExcludedRoots();

  // 首选容器内的链接；容器不存在就退化为全局
  const scope = container || document;
  const links = Array.from(scope.querySelectorAll('a[href^="http"]'));

  // 仅保留“非排除节点内”的链接
  CACHED_LINKS = links.filter((a) => !isInsideExcluded(a, roots));
}

/** 随机网站（打开新标签） */
function goRandom() {
  if (!CACHED_LINKS.length) refreshLinks();
  if (!CACHED_LINKS.length) {
    alert("没有可用的网站链接！");
    return;
  }
  const chosen = CACHED_LINKS[randIndex(CACHED_LINKS.length)];
  const url = chosen.href;
  // 强制新开，带 noopener/noreferrer 更安全
  window.open(url, "_blank", "noopener,noreferrer");
}

/** 浮动按钮显示/隐藏（滚动到一定阈值才显示） */
const updateFloatingButtons = (() => {
  const threshold = 120; // 超过这个滚动距离才显示
  let ticking = false;

  function _update() {
    const topBtn = document.getElementById("btnToTop");
    const rndBtn = document.getElementById("btnRandom");
    const botBtn = document.getElementById("btnToBottom");
    if (!topBtn || !rndBtn || !botBtn) return;

    const scrolled = window.scrollY > threshold;
    const nearBottom =
      window.innerHeight + window.scrollY >=
      document.documentElement.scrollHeight - threshold;

    topBtn.style.display = scrolled ? "block" : "none";
    rndBtn.style.display = scrolled ? "block" : "none";
    botBtn.style.display = scrolled && !nearBottom ? "block" : "none";
    ticking = false;
  }

  return function () {
    if (!ticking) {
      window.requestAnimationFrame(_update);
      ticking = true;
    }
  };
})();

/** 初始化：尽早缓存链接；监听 DOM 变化自动刷新缓存 */
document.addEventListener("DOMContentLoaded", () => {
  refreshLinks();
  updateFloatingButtons();

  // 如果你会动态增减站点卡片，这个观察者能自动刷新缓存
  const container = document.querySelector(SITE_CONTAINER) || document.body;
  const mo = new MutationObserver(() => refreshLinks());
  mo.observe(container, { childList: true, subtree: true });
});

/** 事件：滚动 / 窗口变化 */
window.addEventListener("scroll", updateFloatingButtons, { passive: true });
window.addEventListener("resize", updateFloatingButtons);

/** 可选：给 R 键绑定随机（方便键盘操作） */
window.addEventListener("keydown", (e) => {
  if (e.key.toLowerCase() === "r" && !e.metaKey && !e.ctrlKey && !e.altKey) {
    goRandom();
  }
});

/* ========= 随机&浮动按钮结束 ========= */




// ===== 随机打乱区 =====
function todaySeed() {
  const now = new Date();
  return Number(
    `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, "0")}${String(
      now.getDate()
    ).padStart(2, "0")}`
  );
}

function makePRNG(seed) {
  let s = seed >>> 0;
  return function () {
    s = (1664525 * s + 1013904223) >>> 0;
    return s / 4294967296;
  };
}

function shuffleWith(seed, arr) {
  const rnd = makePRNG(seed);
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(rnd() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function getSeedFromURL() {
  const params = new URLSearchParams(location.search);
  const v = params.get("seed");
  if (!v) return null;
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
}

function runShuffle() {
  const container = document.querySelector("#site-list");
  if (!container) return;

  const items = Array.from(container.querySelectorAll("a"));
  const seed = getSeedFromURL() ?? todaySeed();
  const shuffled = shuffleWith(seed, items.slice());

  const frag = document.createDocumentFragment();
  shuffled.forEach(el => frag.appendChild(el));
  container.innerHTML = "";
  container.appendChild(frag);

  // 隐藏标记去掉，显示出来
  container.classList.add("is-ready");
  container.removeAttribute("data-shuffle-pending");

  console.log("[每日随机顺序] seed =", seed);
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", runShuffle, { once: true });
} else {
  runShuffle();
}
// ===== 随机打乱区结束 =====

