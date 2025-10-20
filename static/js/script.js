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

  // 仅选择容器的“直接子级” a，避免嵌套结构影响初始顺序
  const items = Array.from(container.querySelectorAll(":scope > a"));

  const seed = getSeedFromURL() ?? todaySeed();
  const shuffled = shuffleWith(seed, items.slice());

  const frag = document.createDocumentFragment();
  shuffled.forEach(el => frag.appendChild(el));

  // 用 replaceChildren，保留已绑定事件监听
  container.replaceChildren(frag);

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





