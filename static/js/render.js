
// render.js
async function loadLinks() {
  try {
    const res = await fetch('/data/links.json');
    const data = await res.json();
    const container = document.getElementById('app');
    container.innerHTML = '';
    data.categories.forEach(cat => {
      const details = document.createElement('details');
      const summary = document.createElement('summary');
      summary.textContent = cat.name + ' (' + cat.links.length + ')';
      details.appendChild(summary);

      const grid = document.createElement('div');
      grid.className = container.className; // reuse grid classes

      cat.links.forEach(link => {
        const a = document.createElement('a');
        a.href = link.url;
        a.target = '_blank';
        a.rel = 'noopener noreferrer';
        a.className = 'group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30';
        a.title = '收录日期：' + (link.date || '');

        const h2 = document.createElement('h2');
        h2.className = 'mb-3 text-2xl font-semibold';
        h2.innerHTML = link.title + '<span class="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none ml-2">-&gt;</span>';

        const p = document.createElement('p');
        p.className = 'm-0 max-w-[30ch] text-sm opacity-50';
        p.textContent = link.desc || '';

        a.appendChild(h2);
        a.appendChild(p);
        grid.appendChild(a);
      });

      details.appendChild(grid);
      container.appendChild(details);
    });
  } catch (err) {
    console.error('加载 links.json 出错', err);
  }
}

document.addEventListener('DOMContentLoaded', loadLinks);
