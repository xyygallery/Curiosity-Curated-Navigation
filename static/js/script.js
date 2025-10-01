!function(){"use strict";(t=>{const{screen:{width:e,height:a},navigator:{language:r},location:n,localStorage:i,document:c,history:o}=t,{hostname:s,href:u}=n,{currentScript:l,referrer:d}=c;if(!l)return;const m="data-",f=l.getAttribute.bind(l),h=f(m+"website-id"),p=f(m+"host-url"),g=f(m+"tag"),y="false"!==f(m+"auto-track"),b="true"===f(m+"exclude-search"),v=f(m+"domains")||"",w=v.split(",").map((t=>t.trim())),S=`${(p||"https://api-gateway.umami.dev"||l.src.split("/").slice(0,-1).join("/")).replace(/\/$/,"")}/api/send`,N=`${e}x${a}`,T=/data-umami-event-([\w-_]+)/,A=m+"umami-event",x=300,O=t=>{if(t){try{const e=decodeURI(t);if(e!==t)return e}catch(e){return t}return encodeURI(t)}},U=t=>{try{const{pathname:e,search:a}=new URL(t);t=e+a}catch(t){}return b?t.split("?")[0]:t},j=()=>({website:h,hostname:s,screen:N,language:r,title:O(q),url:O(D),referrer:O(_),tag:g||void 0}),k=(t,e,a)=>{a&&(_=D,D=U(a.toString()),D!==_&&setTimeout(I,x))},E=()=>!h||i&&i.getItem("umami.disabled")||v&&!w.includes(s),L=async(t,e="event")=>{if(E())return;const a={"Content-Type":"application/json"};void 0!==R&&(a["x-umami-cache"]=R);try{const r=await fetch(S,{method:"POST",body:JSON.stringify({type:e,payload:t}),headers:a}),n=await r.text();return R=n}catch(t){}},$=()=>{B||(I(),(()=>{const t=(t,e,a)=>{const r=t[e];return(...e)=>(a.apply(null,e),r.apply(t,e))};o.pushState=t(o,"pushState",k),o.replaceState=t(o,"replaceState",k)})(),(()=>{const t=new MutationObserver((([t])=>{q=t&&t.target?t.target.text:void 0})),e=c.querySelector("head > title");e&&t.observe(e,{subtree:!0,characterData:!0,childList:!0})})(),c.addEventListener("click",(async t=>{const e=t=>["BUTTON","A"].includes(t),a=async t=>{const e=t.getAttribute.bind(t),a=e(A);if(a){const r={};return t.getAttributeNames().forEach((t=>{const a=t.match(T);a&&(r[a[1]]=e(t))})),I(a,r)}},r=t.target,i=e(r.tagName)?r:((t,a)=>{let r=t;for(let t=0;t<a;t++){if(e(r.tagName))return r;if(r=r.parentElement,!r)return null}})(r,10);if(!i)return a(r);{const{href:e,target:r}=i,c=i.getAttribute(A);if(c)if("A"===i.tagName){const o="_blank"===r||t.ctrlKey||t.shiftKey||t.metaKey||t.button&&1===t.button;if(c&&e)return o||t.preventDefault(),a(i).then((()=>{o||(n.href=e)}))}else if("BUTTON"===i.tagName)return a(i)}}),!0),B=!0)},I=(t,e)=>L("string"==typeof t?{...j(),name:t,data:"object"==typeof e?e:void 0}:"object"==typeof t?t:"function"==typeof t?t(j()):j()),K=t=>L({...j(),data:t},"identify");t.umami||(t.umami={track:I,identify:K});let R,B,D=U(u),_=d!==s?d:"",q=c.title;y&&!E()&&("complete"===c.readyState?$():c.addEventListener("readystatechange",$,!0))})(window)}();


// 随机网站

  // 平滑滚动
  function scrollToTop(){ window.scrollTo({ top: 0, behavior: 'smooth' }); }
  function scrollToBottom(){ window.scrollTo({ top: document.documentElement.scrollHeight, behavior: 'smooth' }); }

  // 随机网站（排除底部统计/信息区 & 三个按钮自身）
  function goRandom() {
    const EXCLUDE_CONTAINERS = ['#stats','#info','footer','.site-stats','.site-info'];
    const EXCLUDE_BUTTON_IDS = ['btnToTop','btnRandom','btnToBottom'];
    const allLinks = Array.from(document.querySelectorAll('a[href^="http"]'))
      .filter(a => !EXCLUDE_CONTAINERS.some(sel => a.closest(sel)))
      .filter(a => !EXCLUDE_BUTTON_IDS.some(id => a.closest('#'+id))); // 保险：避免拾到按钮里链接（一般没有）
    if (allLinks.length === 0) { alert('没有可用的网站链接！'); return; }
    const url = allLinks[Math.floor(Math.random() * allLinks.length)].href;
    window.open(url, '_blank', 'noopener,noreferrer');
  }

  // 显示/隐藏逻辑：滚动超过阈值才显示；到底部附近隐藏“底部”按钮
  function updateFloatingButtons() {
    const topBtn = document.getElementById('btnToTop');
    const rndBtn = document.getElementById('btnRandom');
    const botBtn = document.getElementById('btnToBottom');
    const threshold = 120; // 超过这个距离才显示
    const scrolled = window.scrollY > threshold;
    const nearBottom = (window.innerHeight + window.scrollY) >= (document.documentElement.scrollHeight - threshold);

    // 需要时统一显示
    topBtn.style.display = scrolled ? 'block' : 'none';
    rndBtn.style.display = scrolled ? 'block' : 'none';
    // 底部按钮：滚动超过阈值 且 未接近底部 才显示
    botBtn.style.display = (scrolled && !nearBottom) ? 'block' : 'none';
  }

  // 初始化与事件
  document.addEventListener('DOMContentLoaded', updateFloatingButtons);
  window.addEventListener('scroll', updateFloatingButtons);
  window.addEventListener('resize', updateFloatingButtons);


// 1. 获取当天日期作为种子
function todaySeed() {
  const now = new Date();
  return Number(
    `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, "0")}${String(
      now.getDate()
    ).padStart(2, "0")}`
  );
}

// 2. 简单伪随机数发生器
function makePRNG(seed) {
  let s = seed >>> 0;
  return function () {
    s = (1664525 * s + 1013904223) >>> 0;
    return s / 4294967296;
  };
}

// 3. Fisher-Yates 洗牌
function shuffleWith(seed, arr) {
  const rnd = makePRNG(seed);
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(rnd() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

// 4. 支持用 ?seed=20251005 来测试（不用等到明天）
function getSeedFromURL() {
  const params = new URLSearchParams(location.search);
  const v = params.get("seed");
  if (!v) return null;
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
}

// 5. 执行打乱
document.addEventListener("DOMContentLoaded", () => {
  const container = document.querySelector("#site-list");
  if (!container) return;

  const items = Array.from(container.querySelectorAll("a"));
  const seed = getSeedFromURL() ?? todaySeed();

  const shuffled = shuffleWith(seed, items.slice());

  container.innerHTML = "";
  shuffled.forEach((el) => container.appendChild(el));

  console.log("[每日随机顺序] 当前 seed =", seed);
});
