document.addEventListener("DOMContentLoaded", () => {
  fetch("data/links.json")
    .then(res => res.json())
    .then(data => {
      const app = document.getElementById("app");
      app.innerHTML = "";

      data.categories.forEach((cat) => {
        // 分类标题
        const header = `
          <div class="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm lg:flex mb-3 mt-10">
            <h2 class="relative left-0 top-0 flex w-full justify-center border-b border-gray-300
              bg-gradient-to-b from-zinc-200 pb-6 pt-8 backdrop-blur-2xl
              dark:border-neutral-800 dark:bg-zinc-800/30
              lg:w-auto lg:rounded-xl lg:border lg:bg-gray-200 lg:p-4 lg:dark:bg-zinc-800/30">
              ${cat.name}
            </h2>
          </div>
        `;
        app.insertAdjacentHTML("beforeend", header);

        // 链接容器
        const container = document.createElement("div");
        container.className =
          "mb-32 grid text-center lg:max-w-5xl lg:w-full lg:mb-0 lg:grid-cols-4 lg:text-left";

        cat.links.forEach((link) => {
          const weight = link.recent ? "font-semibold" : "font-light";
          const item = `
            <a href="${link.url}" target="_blank" rel="noopener noreferrer"
               class="group rounded-lg border border-transparent px-5 py-4 transition-colors
               hover:border-gray-300 hover:bg-gray-100
               hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30"
               title="收录日期：${link.date || ""}">
              <h2 class="mb-3 text-2xl ${weight}">
                ${link.title}
                <span class="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none ml-2">-&gt;</span>
              </h2>
              <p class="m-0 max-w-[30ch] text-sm opacity-50">${link.desc}</p>
            </a>
          `;
          container.insertAdjacentHTML("beforeend", item);
        });

        app.appendChild(container);
      });
    })
    .catch(err => {
      console.error("加载 JSON 出错:", err);
      document.getElementById("app").innerHTML =
        "<p style='color:red'>导航数据加载失败</p>";
    });
});
