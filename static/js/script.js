!function(){"use strict";(t=>{const{screen:{width:e,height:a},navigator:{language:r},location:n,localStorage:i,document:c,history:o}=t,{hostname:s,href:u}=n,{currentScript:l,referrer:d}=c;if(!l)return;const m="data-",f=l.getAttribute.bind(l),h=f(m+"website-id"),p=f(m+"host-url"),g=f(m+"tag"),y="false"!==f(m+"auto-track"),b="true"===f(m+"exclude-search"),v=f(m+"domains")||"",w=v.split(",").map((t=>t.trim())),S=`${(p||"https://api-gateway.umami.dev"||l.src.split("/").slice(0,-1).join("/")).replace(/\/$/,"")}/api/send`,N=`${e}x${a}`,T=/data-umami-event-([\w-_]+)/,A=m+"umami-event",x=300,O=t=>{if(t){try{const e=decodeURI(t);if(e!==t)return e}catch(e){return t}return encodeURI(t)}},U=t=>{try{const{pathname:e,search:a}=new URL(t);t=e+a}catch(t){}return b?t.split("?")[0]:t},j=()=>({website:h,hostname:s,screen:N,language:r,title:O(q),url:O(D),referrer:O(_),tag:g||void 0}),k=(t,e,a)=>{a&&(_=D,D=U(a.toString()),D!==_&&setTimeout(I,x))},E=()=>!h||i&&i.getItem("umami.disabled")||v&&!w.includes(s),L=async(t,e="event")=>{if(E())return;const a={"Content-Type":"application/json"};void 0!==R&&(a["x-umami-cache"]=R);try{const r=await fetch(S,{method:"POST",body:JSON.stringify({type:e,payload:t}),headers:a}),n=await r.text();return R=n}catch(t){}},$=()=>{B||(I(),(()=>{const t=(t,e,a)=>{const r=t[e];return(...e)=>(a.apply(null,e),r.apply(t,e))};o.pushState=t(o,"pushState",k),o.replaceState=t(o,"replaceState",k)})(),(()=>{const t=new MutationObserver((([t])=>{q=t&&t.target?t.target.text:void 0})),e=c.querySelector("head > title");e&&t.observe(e,{subtree:!0,characterData:!0,childList:!0})})(),c.addEventListener("click",(async t=>{const e=t=>["BUTTON","A"].includes(t),a=async t=>{const e=t.getAttribute.bind(t),a=e(A);if(a){const r={};return t.getAttributeNames().forEach((t=>{const a=t.match(T);a&&(r[a[1]]=e(t))})),I(a,r)}},r=t.target,i=e(r.tagName)?r:((t,a)=>{let r=t;for(let t=0;t<a;t++){if(e(r.tagName))return r;if(r=r.parentElement,!r)return null}})(r,10);if(!i)return a(r);{const{href:e,target:r}=i,c=i.getAttribute(A);if(c)if("A"===i.tagName){const o="_blank"===r||t.ctrlKey||t.shiftKey||t.metaKey||t.button&&1===t.button;if(c&&e)return o||t.preventDefault(),a(i).then((()=>{o||(n.href=e)}))}else if("BUTTON"===i.tagName)return a(i)}}),!0),B=!0)},I=(t,e)=>L("string"==typeof t?{...j(),name:t,data:"object"==typeof e?e:void 0}:"object"==typeof t?t:"function"==typeof t?t(j()):j()),K=t=>L({...j(),data:t},"identify");t.umami||(t.umami={track:I,identify:K});let R,B,D=U(u),_=d!==s?d:"",q=c.title;y&&!E()&&("complete"===c.readyState?$():c.addEventListener("readystatechange",$,!0))})(window)}();

// 计算时间差（几天前）
function calculateDaysAgo(targetDate) {
    const currentDate = new Date();  // 获取当前时间
    const timeDifference = currentDate - targetDate;  // 计算时间差（毫秒）

    const daysAgo = Math.floor(timeDifference / (1000 * 60 * 60 * 24));  // 转换成天数
    return `${daysAgo} 天前`;  // 使用正确的模板字符串
}

// 更新日期信息
function updateDateInfo() {
    // 选中所有 class="date-info" 的 <p> 标签，并逐个更新
    document.querySelectorAll(".date-info").forEach(p => {
        const dateText = p.textContent.trim();
        const targetDate = new Date(dateText);  // 转换为日期对象

        if (isNaN(targetDate)) {
            console.error('无效的日期格式:', dateText);
        } else {
            const daysAgoText = calculateDaysAgo(targetDate);  // 获取“几天前”的文本
            p.textContent = `${dateText} (${daysAgoText})`;  // 使用正确的模板字符串
        }
    });
}

// 更新网站链接总数
function updateWebsiteCount() {
    // 获取所有的 <a> 标签
    const links = document.querySelectorAll('a');
    
    // 获取链接的数量
    const totalLinks = links.length;
    
    // 获取显示总数的元素，并更新其内容
    const countDisplay = document.getElementById('website-count');
    if (countDisplay) {
        countDisplay.textContent = `已收录 ${totalLinks} 个`;  // 修正模板字符串
    }
}

// 页面加载时自动更新统计
document.addEventListener('DOMContentLoaded', function() {
    updateDateInfo();   // 更新日期信息
    updateWebsiteCount();  // 更新网站链接数量
});



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


