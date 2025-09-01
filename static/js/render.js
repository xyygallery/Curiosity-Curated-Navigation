
// render.js (final version matching original HTML structure)

async function loadLinks() {
  try {
    const res = await fetch('/data/links.json');
    const data = await res.json();
    const container = document.getElementById('app');
    container.innerHTML = '';

    data.categories.forEach(cat => {
      // 分类标题容器
      const headerDiv = document.createElement('div');
      headerDiv.className = 'z-10 max-w-5xl w-full items-center justify-between font-mono text-sm lg:flex mb-3 mt-10';

      const h2 = document.createElement('h2');
      h2.className = 'relative left-0 top-0 flex w-full justify-center border-b border-gray-300 bg-gradient-to-b from-zinc-200 pb-6 pt-8 backdrop-blur-2xl dark:border-neutral-800 dark:bg-zinc-800/30 lg:w-auto lg:rounded-xl lg:border lg:bg-gray-200 lg:p-4 lg:dark:bg-zinc-800/30';
      h2.textContent = cat.name;
      headerDiv.appendChild(h2);
      container.appendChild(headerDiv);

      // 链接网格容器
      const gridDiv = document.createElement('div');
      gridDiv.className = 'mb-32 grid text-center lg:max-w-5xl lg:w-full lg:mb-0 lg:grid-cols-4 lg:text-left';

      cat.links.forEach(link => {
        const a = document.createElement('a');
        a.href = link.url;
        a.target = '_blank';
        a.rel = 'noopener noreferrer';
        a.className = 'group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30';
        if (link.date) a.title = '收录日期：' + link.date;

        // 链接标题 h2
        const h2Link = document.createElement('h2');
        // 默认 font-light，支持 JSON 配置 weight=semibold
        const weight = (link.weight === 'semibold') ? 'font-semibold' : 'font-light';
        h2Link.className = 'mb-3 text-2xl ' + weight;
        h2Link.textContent = link.title;

        const span = document.createElement('span');
        span.className = 'inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none ml-2';
        span.innerHTML = '-&gt;';
        h2Link.appendChild(span);

        // 描述 p
        const p = document.createElement('p');
        p.className = 'm-0 max-w-[30ch] text-sm opacity-50';
        p.textContent = link.desc || '';

        a.appendChild(h2Link);
        a.appendChild(p);
        gridDiv.appendChild(a);
      });

      container.appendChild(gridDiv);
    });
  } catch (err) {
    console.error('加载 links.json 出错', err);
  }
}

document.addEventListener('DOMContentLoaded', loadLinks);
