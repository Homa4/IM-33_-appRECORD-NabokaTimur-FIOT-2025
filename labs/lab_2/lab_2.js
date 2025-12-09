document.addEventListener("DOMContentLoaded", async () => {
  const contentBox = document.querySelector(".main-content .content-section");
  const menuItems = document.querySelectorAll(".sidebar .menu-item");

  const match = window.location.pathname.match(/lab_(\d+)/);
  const labNumber = match ? match[1] : "1";
  const jsonPath = `./lab_${labNumber}.json`;

  let data = {};
  try {
    const res = await fetch(jsonPath);
    data = await res.json();
  } catch (err) {
    contentBox.innerHTML = `<div class="error-message">
      <strong>Помилка:</strong> Не вдалося завантажити дані лабораторної №${labNumber}.
    </div>`;
    return;
  }

  const escapeHTML = (str) =>
    str
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");

  function renderContent(title, value) {
    if (!value) {
      contentBox.innerHTML = `<p class="no-content">Немає даних для цього розділу.</p>`;
      return;
    }

    if (typeof value === "string") {
      if (value.startsWith("http")) {
        contentBox.innerHTML = `<h2>${title}</h2><a href="${value}" target="_blank" class="link-style">${value}</a>`;
      } else if (value.match(/\.(png|jpg|jpeg|gif)$/i)) {
        contentBox.innerHTML = `<h2>${title}</h2><div class="image-container"><img src="${value}" alt="${title}" class="code-image"></div>`;
      } else if (
        title.toLowerCase().includes("html") ||
        value.includes("<html")
      ) {
        contentBox.innerHTML = `<h2>${title}</h2><div class="code-container"><pre class="code-block"><code>${escapeHTML(
          value
        )}</code></pre></div>`;
      } else {
        contentBox.innerHTML = `<h2>${title}</h2><div class="report-section">${value.replace(
          /\n/g,
          "<br>"
        )}</div>`;
      }
    } else if (typeof value === "object") {
      let html = `<h2>${title}</h2>`;
      for (const [key, val] of Object.entries(value)) {
        if (val.match(/\.(png|jpg|jpeg|gif)$/i)) {
          html += `<div class="image-container"><strong>${key}</strong><br><img src="${val}" alt="${key}" class="code-image"></div>`;
        } else {
          html += `<details open><summary>${key}</summary><div class="code-container"><pre class="code-block"><code>${escapeHTML(
            val
          )}</code></pre></div></details>`;
        }
      }
      contentBox.innerHTML = html;
    }
  }

  menuItems.forEach((item) => {
    item.addEventListener("click", () => {
      menuItems.forEach((i) => i.classList.remove("highlight"));
      item.classList.add("highlight");

      const key = item.innerText.trim();
      let value = null;

      if (key.includes("Тема")) {
        const title = data.title || "";
        const goal = data.goal || "";
        const link = data.livePageLink
          ? `<p><a href="${data.livePageLink}" target="_blank" class="link-style">Посилання на сайт</a></p>`
          : "";
        value = `<div class="info-section">
          <div class="info-block"><h4>Тема:</h4><p>${title}</p></div>
          <div class="info-block"><h4>Мета:</h4><p>${goal}</p></div>
          ${link}
        </div>`;
      } else if (key.includes("Способи")) {
        value = data.report;
      } else if (key === "СЕЛЕКТОРИ") {
        value = data.docStructure?.HTML;
      } else if (key.includes("тегу")) {
        value = data.docStructure?.tableHTML;
      } else if (key.includes("класу")) {
        value = data.docStructure?.imgHTML;
      } else if (key.includes("ідентифікатор")) {
        value = data.docStructure?.formHTML;
      } else if (key.includes("Інші")) {
        value = data.docStructure?.HTML;
      } else if (key.includes("CSS:")) {
        value = data.mainPage;
      } else if (key.includes("ВИСНОВК")) {
        value = data.conclusion;
      }

      renderContent(key, value);
    });
  });

  if (menuItems[0]) menuItems[0].click();
});
