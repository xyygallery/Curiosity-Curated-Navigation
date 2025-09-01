document.addEventListener("DOMContentLoaded", () => {
  const app = document.getElementById("app");

  fetch("data/links.json")
    .then(res => res.json())
    .then(data => {
      app.innerHTML = ""; // ✅ 确保渲染前清空

      data.categories.forEach((cat, index) => {
        // 分类标题（带折叠功能）
        const header = document.createElement("div");
        header.className =
          "z-10 max-w-5xl w-full items-center justify-between font-mono text-sm lg:flex mb-3 mt-10";
        header.innerHTML = `
          <h2 class="relative left-0 top-0 flex w-full justify-between border-b border-gray-300
            bg-gradient-to-b from-zinc-200 pb-6 pt-8 backdrop-blur-2xl
            dark:border-neutral-800 dark:bg-zinc-800/30
            lg:w-auto lg:rounded-xl lg:border lg:bg-gray-200 lg:p-4 lg:dark:bg-zinc-800/30
            cursor-pointer select-none"
            data-toggle="${index}">
            ${cat.name}
            <span class="ml-2 transition-transform">&#9660;</span>
          </h2>
        `;
        app.appendChild(header);

        // 链接容器
        const container = document.createElement("div");
        container.className =
          "mb-32 grid text-center lg:max-w-5xl lg:w-full lg:mb-0 lg:grid-cols-4 lg:text-left";
        container.setAttribute("data-container", index);

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

      // ✅ 折叠逻辑
      app.addEventListener("click", (e) => {
        const h2 = e.target.closest("h2[data-toggle]");
        if (h2) {
          const id = h2.getAttribute("data-toggle");
          const container = app.querySelector(\`div[data-container="\${id}"]\`);
          const arrow = h2.querySelector("span");

          if (container.style.display === "none") {
            container.style.display = "";
            arrow.style.transform = "rotate(0deg)";
          } else {
            container.style.display = "none";
            arrow.style.transform = "rotate(-90deg)";
          }
        }
      });
    })
    .catch(err => {
      console.error("加载 JSON 出错:", err);
      app.innerHTML = "<p style='color:red'>导航数据加载失败</p>";
    });
});