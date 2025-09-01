// 计算时间差（几天前）
function calculateDaysAgo(targetDate) {
  const currentDate = new Date();
  const timeDifference = currentDate - targetDate;
  const daysAgo = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
  return `${daysAgo} 天前`;
}

// 更新日期信息
function updateDateInfo() {
  document.querySelectorAll(".date-info").forEach(p => {
    const dateText = p.textContent.trim();
    const targetDate = new Date(dateText);
    if (!isNaN(targetDate)) {
      const daysAgoText = calculateDaysAgo(targetDate);
      p.textContent = `${dateText} (${daysAgoText})`;
    }
  });
}

// 更新网站链接总数
function updateWebsiteCount() {
  const links = Array.from(document.querySelectorAll("a"))
    // ✅ 排除统计/信息这些非真实网站的 a 标签
    .filter(a => a.href && !a.style.pointerEvents.includes("none"));

  const totalLinks = links.length;
  const countDisplay = document.getElementById("website-count");
  if (countDisplay) {
    countDisplay.textContent = `已收录 ${totalLinks} 个`;
  }
}

// ✅ 等待渲染完成后再执行统计
document.addEventListener("renderComplete", function () {
  updateDateInfo();
  updateWebsiteCount();
});
