let menuItems = null;
const mainContent = document.querySelector(".main-content");
const labTabs = document.querySelectorAll(".lab-tab");
const sidebar = document.querySelector(".sidebar");

let labNumber = 1;
let labInfo = null;
let sideBarInfo = null;

loadLabData(1);

labTabs.forEach((tab, index) => {
  tab.addEventListener("click", function () {
    labTabs.forEach((t) => t.classList.remove("active"));
    this.classList.add("active");
    labNumber = index + 1;
    loadLabData(labNumber);
  });
});

function addEventListeners() {
  menuItems = document.querySelectorAll(".menu-item, .submenu-item");

  menuItems.forEach((item, index) => {
    item.addEventListener("click", function () {
      menuItems.forEach((mi) => mi.classList.remove("highlight"));
      this.classList.add("highlight");

      if (!labInfo) {
        mainContent.innerHTML =
          '<h3 class="section-title">' +
          this.textContent.trim() +
          '</h3><p class="no-content">Спочатку виберіть лабораторну роботу</p>';
        return;
      }

      displayMenuSection(index, this.textContent.trim());
    });
  });
}

function loadLabData(labNum) {
  mainContent.innerHTML =
    '<h3 class="section-title">Лабораторна робота №' +
    labNum +
    '</h3><p class="loading">Завантаження...</p>';

  const path = `./labs/lab_${labNum}/lab_${labNum}.json`;
  tryFetchJSON(path, 0, labNum);
}

function tryFetchJSON(paths, labNum) {
  const currentPath = paths;
  console.log("Спроба завантаження:", currentPath);

  fetch(currentPath)
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      console.log("Успішно завантажено з:", currentPath);
      labInfo = data;
      sideBarInfo = labInfo.sideBarInfo;

      if (sideBarInfo && sideBarInfo.length > 0) {
        fillSideBarWithInfo(sideBarInfo);
      }

      addEventListeners();
    })
    .catch((error) => {
      console.log("Помилка для", currentPath, ":", error.message);
      tryFetchJSON(paths, index + 1, labNum);
    });
}

function fillSideBarWithInfo(sideBarInfo) {
  sidebar.innerHTML = "";

  sideBarInfo.forEach((item, index) => {
    const className = "menu-item";
    const cleanText = item;

    const div = document.createElement("div");
    div.className = className;
    div.innerHTML = cleanText;

    if (index === 0) {
      div.classList.add("highlight");
    }

    sidebar.appendChild(div);
  });
}

function displayMenuSection(menuIndex, menuTitle) {
  let htmlContent = `<h3 class="section-title">${menuTitle}</h3>`;

  switch (menuIndex) {
    case 0:
      htmlContent += '<div class="info-section">';
      if (labInfo.title) {
        htmlContent += `<div class="info-block"><h4>Тема:</h4><p>${labInfo.title}</p></div>`;
      }
      if (labInfo.goal) {
        htmlContent += `<div class="info-block"><h4>Мета:</h4><p>${labInfo.goal}</p></div>`;
      }
      if (labInfo.livePageLink) {
        htmlContent += `<div class="info-block"><h4>Місце розташування сайту:</h4><p><a href="${labInfo.livePageLink}" target="_blank" class="link-style">${labInfo.livePageLink}</a></p></div>`;
      }
      htmlContent += "</div>";
      break;

    case 1:
      if (labInfo.report) {
        htmlContent += `<div class="report-section">${labInfo.report}</div>`;
      } else {
        htmlContent += `<p class="no-content">Інформація відсутня</p>`;
      }
      break;

    case 2:
      htmlContent += `<p class="instruction-text">Оберіть конкретний елемент структури з підменю</p>`;
      break;

    case 3:
      if (labInfo.docStructure?.tableHTML) {
        const imgPath = labInfo.docStructure.tableHTML;
        htmlContent += `<div class="image-container"><img src="${imgPath}" alt="Table HTML Code" class="code-image" (this, '${labInfo.docStructure.tableHTML}')"></div>`;
      } else {
        htmlContent += `<p class="no-content">Зображення коду таблиці відсутнє</p>`;
      }
      break;

    case 4:
      if (labInfo.docStructure?.imgHTML) {
        const imgPath = labInfo.docStructure.imgHTML;
        htmlContent += `<div class="image-container"><img src="${imgPath}" alt="Image HTML Code" class="code-image" (this, '${labInfo.docStructure.imgHTML}')"></div>`;
      } else {
        htmlContent += `<p class="no-content">Зображення коду зображення відсутнє</p>`;
      }
      break;

    case 5:
      if (labInfo.docStructure?.formHTML) {
        const imgPath = labInfo.docStructure.formHTML;
        htmlContent += `<div class="image-container"><img src="${imgPath}" alt="Form HTML Code" class="code-image" (this, '${labInfo.docStructure.formHTML}')"></div>`;
      } else {
        htmlContent += `<p class="no-content">Зображення коду форми відсутнє</p>`;
      }
      break;

    case 6:
      if (labInfo.docStructure?.HTML) {
        htmlContent += `<div class="code-container"><pre class="code-block"><code>${escapeHtml(
          labInfo.docStructure.HTML
        )}</code></pre></div>`;
      } else {
        htmlContent += `<p class="no-content">HTML код відсутній</p>`;
      }
      break;

    case 7:
      if (labInfo.mainPage) {
        htmlContent += `<div class="page-preview">
          <p class="preview-link"><a href="${labInfo.mainPage}" target="_blank" class="link-style">Відкрити головну сторінку в новому вікні</a></p>
          <div class="iframe-container"><iframe src="${labInfo.mainPage}" class="page-iframe"></iframe></div>
        </div>`;
      } else {
        htmlContent += `<p class="no-content">Посилання на головну сторінку відсутнє</p>`;
      }
      break;

    case 8:
      if (labInfo.mainPageCode) {
        htmlContent += `<div class="code-container"><pre class="code-block"><code>${escapeHtml(
          labInfo.mainPageCode
        )}</code></pre></div>`;
      } else {
        htmlContent += `<p class="no-content">Код головної сторінки відсутній</p>`;
      }
      break;

    case 9:
      if (labInfo.conclusion) {
        htmlContent += `<div class="conclusion-section">${labInfo.conclusion}</div>`;
      } else {
        htmlContent += `<p class="no-content">Висновки відсутні</p>`;
      }
      break;

    default:
      htmlContent += `<p class="no-content">Розділ в розробці</p>`;
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
