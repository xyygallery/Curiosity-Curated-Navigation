!function(){"use strict";(t=>{const{screen:{width:e,height:a},navigator:{language:r},location:n,localStorage:i,document:c,history:o}=t,{hostname:s,href:u}=n,{currentScript:l,referrer:d}=c;if(!l)return;const m="data-",f=l.getAttribute.bind(l),h=f(m+"website-id"),p=f(m+"host-url"),g=f(m+"tag"),y="false"!==f(m+"auto-track"),b="true"===f(m+"exclude-search"),v=f(m+"domains")||"",w=v.split(",").map((t=>t.trim())),S=`${(p||"https://api-gateway.umami.dev"||l.src.split("/").slice(0,-1).join("/")).replace(/\/$/,"")}/api/send`,N=`${e}x${a}`,T=/data-umami-event-([\w-_]+)/,A=m+"umami-event",x=300,O=t=>{if(t){try{const e=decodeURI(t);if(e!==t)return e}catch(e){return t}return encodeURI(t)}},U=t=>{try{const{pathname:e,search:a}=new URL(t);t=e+a}catch(t){}return b?t.split("?")[0]:t},j=()=>({website:h,hostname:s,screen:N,language:r,title:O(q),url:O(D),referrer:O(_),tag:g||void 0}),k=(t,e,a)=>{a&&(_=D,D=U(a.toString()),D!==_&&setTimeout(I,x))},E=()=>!h||i&&i.getItem("umami.disabled")||v&&!w.includes(s),L=async(t,e="event")=>{if(E())return;const a={"Content-Type":"application/json"};void 0!==R&&(a["x-umami-cache"]=R);try{const r=await fetch(S,{method:"POST",body:JSON.stringify({type:e,payload:t}),headers:a}),n=await r.text();return R=n}catch(t){}},$=()=>{B||(I(),(()=>{const t=(t,e,a)=>{const r=t[e];return(...e)=>(a.apply(null,e),r.apply(t,e))};o.pushState=t(o,"pushState",k),o.replaceState=t(o,"replaceState",k)})(),(()=>{const t=new MutationObserver((([t])=>{q=t&&t.target?t.target.text:void 0})),e=c.querySelector("head > title");e&&t.observe(e,{subtree:!0,characterData:!0,childList:!0})})(),c.addEventListener("click",(async t=>{const e=t=>["BUTTON","A"].includes(t),a=async t=>{const e=t.getAttribute.bind(t),a=e(A);if(a){const r={};return t.getAttributeNames().forEach((t=>{const a=t.match(T);a&&(r[a[1]]=e(t))})),I(a,r)}},r=t.target,i=e(r.tagName)?r:((t,a)=>{let r=t;for(let t=0;t<a;t++){if(e(r.tagName))return r;if(r=r.parentElement,!r)return null}})(r,10);if(!i)return a(r);{const{href:e,target:r}=i,c=i.getAttribute(A);if(c)if("A"===i.tagName){const o="_blank"===r||t.ctrlKey||t.shiftKey||t.metaKey||t.button&&1===t.button;if(c&&e)return o||t.preventDefault(),a(i).then((()=>{o||(n.href=e)}))}else if("BUTTON"===i.tagName)return a(i)}}),!0),B=!0)},I=(t,e)=>L("string"==typeof t?{...j(),name:t,data:"object"==typeof e?e:void 0}:"object"==typeof t?t:"function"==typeof t?t(j()):j()),K=t=>L({...j(),data:t},"identify");t.umami||(t.umami={track:I,identify:K});let R,B,D=U(u),_=d!==s?d:"",q=c.title;y&&!E()&&("complete"===c.readyState?$():c.addEventListener("readystatechange",$,!0))})(window)}();


// 平滑返回顶部
function scrollToTop() {
  window.scrollTo({ top: 0, behavior: "smooth" });
}

// 更新按钮显示与进度环
function updateTopButton() {
  const btn = document.getElementById("btnToTop");
  const circle = document.getElementById("circle-progress");
  if (!btn || !circle) return;

  const scrollTop = window.scrollY;
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;

  // 显示/隐藏
  btn.style.display = scrollTop > 120 ? "block" : "none";

  // 更新圆环进度
  circle.setAttribute("stroke-dasharray", `${progress}, 100`);
}

document.addEventListener("DOMContentLoaded", updateTopButton);
window.addEventListener("scroll", updateTopButton, { passive: true });
window.addEventListener("resize", updateTopButton);





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

