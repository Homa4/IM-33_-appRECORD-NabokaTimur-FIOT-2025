document.addEventListener("DOMContentLoaded", async () => {
  const contentBox = document.querySelector(".main-content .content-section");
  const menuItems = document.querySelectorAll(".sidebar .menu-item");

  const match = window.location.pathname.match(/lab_(\d+)/);
  const labNumber = match ? match[1] : "1";
  const jsonPath = `./labs/lab_${labNumber}/lab_${labNumber}.json`;

  let data = {};
  try {
    const res = await fetch(jsonPath);
    data = await res.json();
  } catch (err) {
    console.error("Помилка при завантаженні JSON:", err);
    contentBox.innerHTML = `<p style="color:red;">Не вдалося завантажити дані лабораторної ${labNumber}</p>`;
    return;
  }

  // 🧩 Функція для екранування HTML (щоб код показувався як текст)
  function escapeHTML(str) {
    return str
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  function showContent(title, value) {
    if (!value) {
      contentBox.innerHTML = `<p>Немає даних для цього розділу.</p>`;
      return;
    }

    if (typeof value === "string") {
      // Посилання
      if (value.startsWith("http")) {
        contentBox.innerHTML = `<h2>${title}</h2>
        <a href="${value}" target="_blank" class="link-style">${value}</a>`;
      }
      // Зображення
      else if (value.match(/\.(png|jpg|jpeg|gif)$/i)) {
        contentBox.innerHTML = `<h2>${title}</h2>
        <div class="image-container"><img src="${value}" alt="${title}" class="code-image"></div>`;
      }
      // HTML-код — показати як текст
      else if (
        title.toLowerCase().includes("html") ||
        value.trim().startsWith("!doctype")
      ) {
        contentBox.innerHTML = `
          <h2>${title}</h2>
          <div class="code-container">
            <pre class="code-block"><code>${escapeHTML(value)}</code></pre>
          </div>`;
      }
      // Текст
      else {
        contentBox.innerHTML = `<h2>${title}</h2>
        <div class="report-section">${value.replace(/\n/g, "<br>")}</div>`;
      }
    }

    // Об’єкти (наприклад docStructure)
    else if (typeof value === "object") {
      let html = `<h2>${title}</h2>`;
      for (const [k, v] of Object.entries(value)) {
        if (v.match(/\.(png|jpg|jpeg|gif)$/i)) {
          html += `
            <div class="image-container">
              <strong>${k}</strong><br>
              <img src="${v}" alt="${k}" class="code-image">
            </div>`;
        } else {
          html += `
            <details open>
              <summary>${k}</summary>
              <div class="code-container">
                <pre class="code-block"><code>${escapeHTML(v)}</code></pre>
              </div>
            </details>`;
        }
      }
      contentBox.innerHTML = html;
    }
  }

  // 🖱️ Обробник кліків на пунктах меню
  menuItems.forEach((item) => {
    item.addEventListener("click", () => {
      menuItems.forEach((i) => i.classList.remove("highlight"));
      item.classList.add("highlight");

      const key = item.innerHTML.trim();
      let value =
        data[key] ||
        data[key.replace(/<br>/g, " ")] ||
        data[key.toLowerCase()] ||
        null;

      // 🔍 Спеціальні ключі
      if (!value) {
        if (key.includes("ТАБЛИЦІ")) value = data.docStructure?.tableHTML;
        else if (key.includes("ЗОБРАЖЕННЯ")) value = data.docStructure?.imgHTML;
        else if (key.includes("ФОРМИ")) value = data.docStructure?.formHTML;
        else if (
          key.includes("HTML-код") &&
          !key.includes("ТАБЛИЦІ") &&
          !key.includes("ФОРМИ")
        )
          value = data.docStructure?.HTML;
        else if (key.includes("Головна сторінка")) value = data.mainPage;
        else if (key.includes("Код головної")) value = data.mainPageCode;
        else if (key.includes("ВИСНОВК")) value = data.conclusion;
      }

      showContent(key, value);
    });
  });

  if (menuItems[0]) menuItems[0].click();
});
