function updateTime() {
  const now = new Date();
  const options = {
    weekday: "long",
    day: "numeric",
    month: "long",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    timeZoneName: "short",
  };

  let timeString = now.toLocaleString("sv-SE", options).replace(/,\s*/, " | ");
  timeString = timeString.replace(/^\w/, (match) => match.toUpperCase());
  timeString = timeString.replace(
    /(\d+\s)(\w)/,
    (match, p1, p2) => p1 + p2.toUpperCase()
  );
  document.querySelector(".date-container p").innerText = timeString;
}

document.addEventListener("DOMContentLoaded", function () {
  updateTime();
  setInterval(updateTime, 1000);
  loadListComponent();
});

function loadListComponent() {
  const placeholder = document.getElementById("list-placeholder");
  fetch("/components/list.html")
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.text();
    })
    .then((html) => {
      placeholder.innerHTML = html;
      populateList();
    })
    .catch((error) => {
      console.error("Error loading list.html:", error);
    });
}

function populateList() {
  fetch("/nordic.json")
    .then((response) => response.json())
    .then((data) => {
      const newsList = document.getElementById("newsList");
      if (newsList) {
        data.items.forEach((item, index) => {
          const listItem = document.createElement("li");
          listItem.className = "news-item";

          const hasPdf = item.attachments?.some(
            (att) => att.content_type === "application/pdf"
          );
          const pdfIcon = hasPdf
            ? `<img src="/icons/pdf-icon.png" alt="PDF Icon" class="pdf-icon" />`
            : "";

          if (index === 0) {
            listItem.classList.add("recent-news");
          }

          listItem.innerHTML = `
            <div class="news-details">
              <div class="news-meta">
                <span class="company">${item.author.name}</span> 
                <span class="date">${new Date(
                  item.content.publish_date
                ).toLocaleDateString()} | ${new Date(
            item.content.publish_date
          ).toLocaleTimeString()}</span>
              </div>
              <div class="news-title">${item.content.title}</div>
            </div>
            ${pdfIcon}
          `;
          newsList.appendChild(listItem);
        });
      }
    })
    .catch((error) => console.error("Error fetching JSON data:", error));
}

const hamburgerMenu = document.querySelector(".hamburger-menu");
const mobileMenu = document.querySelector(".mobile-menu");
const hamburgerIcon = document.querySelector(".hamburger-icon");
const dismissIcon = document.querySelector(".dismiss-icon");
const body = document.body;

hamburgerMenu.addEventListener("click", function () {
  const isMenuActive = mobileMenu.classList.toggle("active");
  hamburgerIcon.style.display = isMenuActive ? "none" : "block";
  dismissIcon.style.display = isMenuActive ? "block" : "none";

  if (isMenuActive) {
    body.classList.add("no-scroll");
  } else {
    body.classList.remove("no-scroll");
  }
});

window.addEventListener("resize", function () {
  if (window.innerWidth > 768) {
    mobileMenu.classList.remove("active");
    hamburgerIcon.style.display = "block";
    dismissIcon.style.display = "none";
    body.classList.remove("no-scroll");
  }
});
