const menuItems = document.querySelectorAll(".menu-item, .submenu-item");
const mainContent = document.querySelector(".main-content");
const labTabs = document.querySelectorAll(".lab-tab");
const contentSection = document.querySelector(".content-section");
let labNumber = 0;
let labInfo = null;

loadLabData(1);

menuItems.forEach((item, index) => {
  item.addEventListener("click", function () {
    menuItems.forEach((mi) => mi.classList.remove("highlight"));
    this.classList.add("highlight");

    if (!labInfo) {
      mainContent.innerHTML =
        "<h3>" +
        this.textContent.trim() +
        `</h3><p style="margin-top: 20px; text-align: center;">Спочатку виберіть лабораторну роботу</p>`;
      return;
    }

    displayMenuSection(index, this.textContent.trim());
  });
});

labTabs.forEach((tab, index) => {
  tab.addEventListener("click", function () {
    labTabs.forEach((t) => t.classList.remove("active"));
    this.classList.add("active");
    labNumber = index + 1;

    loadLabData(labNumber);
  });
});

function loadLabData(labNum) {
  mainContent.innerHTML =
    "<h3>Лабораторна робота №" +
    labNum +
    '</h3><p style="margin-top: 20px; text-align: center;">Завантаження...</p>';

  fetch(`./labs/lab_${labNum}/lab_${labNum}.json`)
    .then((response) => {
      if (!response.ok) {
        throw new Error("Помилка завантаження файлу");
      }
      return response.json();
    })
    .then((data) => {
      labInfo = data;
      displayMenuSection(0, "Тема Мета Місце розташування сайту, звіту");
    })
    .catch((error) => {
      console.error("Помилка:", error);
      labInfo = null;
      mainContent.innerHTML =
        "<h3>Лабораторна робота №" +
        labNum +
        '</h3><p style="margin-top: 20px; text-align: center; color: red;">Помилка завантаження даних. Перевірте наявність файлу lab_' +
        labNum +
        ".json</p>";
    });
}

function displayMenuSection(menuIndex, menuTitle) {
  let htmlContent = `<h3>${menuTitle}</h3>`;

  switch (menuIndex) {
    case 0:
      if (labInfo.title) {
        htmlContent += `<h4>Тема:</h4><p>${labInfo.title}</p>`;
      }
      if (labInfo.goal) {
        htmlContent += `<h4>Мета:</h4><p>${labInfo.goal}</p>`;
      }
      if (labInfo.livePageLink) {
        htmlContent += `<h4>Місце розташування сайту:</h4><p><a href="${labInfo.livePageLink}" target="_blank">${labInfo.livePageLink}</a></p>`;
      }
      break;

    case 1:
      if (labInfo.report) {
        htmlContent += `<div style="text-align: left; padding: 15px; background: #f9f9f9; border-radius: 5px; line-height: 1.6;">${labInfo.report}</div>`;
      } else {
        htmlContent += `<p>Інформація відсутня</p>`;
      }
      break;

    case 2:
      htmlContent += `<p>Оберіть конкретний елемент структури з підменю</p>`;
      break;

    case 3:
      if (labInfo.docStructure?.tableHTML) {
        htmlContent += `<img src="${labInfo.docStructure.tableHTML}" alt="Table HTML Code" style="max-width: 100%; border: 1px solid #ddd; border-radius: 5px; margin: 10px 0;">`;
      } else {
        htmlContent += `<p>Зображення коду таблиці відсутнє</p>`;
      }
      break;

    case 4:
      if (labInfo.docStructure?.imgHTML) {
        htmlContent += `<img src="${labInfo.docStructure.imgHTML}" alt="Image HTML Code" style="max-width: 100%;">`;
      } else {
        htmlContent += `<p>Зображення коду зображення відсутнє</p>`;
      }
      break;

    case 5:
      if (labInfo.docStructure?.formHTML) {
        htmlContent += `<img src="${labInfo.docStructure.formHTML}" alt="Form HTML Code" style="max-width: 100%; border: 1px solid #ddd; border-radius: 5px; margin: 10px 0;">`;
      } else {
        htmlContent += `<p>Зображення коду форми відсутнє</p>`;
      }
      break;

    case 6: // HTML-код
      if (labInfo.docStructure?.HTML) {
        htmlContent += `<pre style="background: #282c34; color: #abb2bf; padding: 20px; border-radius: 5px; overflow-x: auto; text-align: left; font-size: 14px; line-height: 1.5;"><code>${escapeHtml(
          labInfo.docStructure.HTML
        )}</code></pre>`;
      } else {
        htmlContent += `<p>HTML код відсутній</p>`;
      }
      break;

    case 7:
      if (labInfo.mainPage) {
        htmlContent += `<p><a href="${labInfo.mainPage}" target="_blank">Відкрити головну сторінку</a></p>`;
      } else {
        htmlContent += `<p>Посилання на головну сторінку відсутнє</p>`;
      }
      break;

    case 8:
      if (labInfo.mainPageCode) {
        htmlContent += `<pre style="background: #282c34; color: #abb2bf; padding: 20px; border-radius: 5px; overflow-x: auto; text-align: left; font-size: 14px; line-height: 1.5;"><code>${escapeHtml(
          labInfo.mainPageCode
        )}</code></pre>`;
      } else {
        htmlContent += `<p>Код головної сторінки відсутній</p>`;
      }
      break;

    case 9:
      if (labInfo.conclusion) {
        htmlContent += `<div style="text-align: left; padding: 15px; background: #f9f9f9; border-radius: 5px; line-height: 1.8;">${labInfo.conclusion}</div>`;
      } else {
        htmlContent += `<p>Висновки відсутні</p>`;
      }
      break;

    default:
      htmlContent += `<p>Розділ в розробці</p>`;
  }

  mainContent.innerHTML = htmlContent;
}

function escapeHtml(text) {
  const map = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;",
  };
  return text.replace(/[&<>"']/g, (m) => map[m]);
}
