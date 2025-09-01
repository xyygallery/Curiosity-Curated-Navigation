// render.js (STRICT) — 输出与手写 HTML 一致的结构与 class
// 仅负责把 /data/links.json 渲染到 <div id="app"></div>
// 不做任何样式计算，样式全部依赖已有 CSS/Tailwind。

async function loadLinks() {
  const container = document.getElementById('app');
  if (!container) return;

  try {
    const res = await fetch('/data/links.json', { cache: 'no-store' });
    const data = await res.json();

    // 清空占位
    container.innerHTML = '';

    // 逐个分类渲染（严格匹配您提供的 HTML 片段结构与 class）
    (data.categories || []).forEach(cat => {
      // 1) 分类标题块
      const headerHTML = [
        '<div class="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm lg:flex mb-3 mt-10">',
        '  <h2 class="relative left-0 top-0 flex w-full justify-center border-b border-gray-300 bg-gradient-to-b from-zinc-200 pb-6 pt-8 backdrop-blur-2xl dark:border-neutral-800 dark:bg-zinc-800/30 lg:w-auto lg:rounded-xl lg:border lg:bg-gray-200 lg:p-4 lg:dark:bg-zinc-800/30">',
        '    ' + (cat.name || ''),
        '  </h2>',
        '</div>'
      ].join('\n');

      // 2) 链接网格块
      const linksHTML = [
        '<div class="mb-32 grid text-center lg:max-w-5xl lg:w-full lg:mb-0 lg:grid-cols-4 lg:text-left">',
        (cat.links || []).map(link => {
          const title = escapeHTML(link.title || '');
          const desc  = escapeHTML(link.desc  || '');
          const url   = encodeURI(link.url || '#');
          const date  = link.date ? String(link.date) : '';
          const weightClass = (link.weight === 'semibold') ? 'font-semibold' : 'font-light';
          return [
            `<a href="${url}" class="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30" target="_blank" rel="noopener noreferrer"${date ? ` title="收录日期：${escapeAttr(date)}"` : ''}>`,
            `  <h2 class="mb-3 text-2xl ${weightClass}">`,
            `    ${title}`,
            `    <span class="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none ml-2">-&gt;</span>`,
            '  </h2>',
            `  <p class="m-0 max-w-[30ch] text-sm opacity-50">${desc}</p>`,
            '</a>'
          ].join('\n');
        }).join('\n'),
        '</div>'
      ].join('\n');

      container.insertAdjacentHTML('beforeend', headerHTML + '\n' + linksHTML + '\n');
    });
  } catch (e) {
    console.error('加载 /data/links.json 失败：', e);
  }
}

// 简单的转义，避免把 < > & 等插进 HTML
function escapeHTML(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}
function escapeAttr(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;');
}

document.addEventListener('DOMContentLoaded', loadLinks);
