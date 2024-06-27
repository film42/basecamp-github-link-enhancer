function replaceBasecampLinks() {
  const links = document.querySelectorAll('a[href^="https://3.basecamp.com"]');

  links.forEach((link) => {
    fetchBasecampInfo(link.href)
      .then((info) => {
        const widget = createWidget2(info);
        link.parentNode.replaceChild(widget, link);
      })
      .catch((error) => {
        console.error("Error replacing Basecamp link:", error);
      });
  });
}

function fetchBasecampInfo(url) {
  return new Promise((resolve, reject) => {
    chrome.runtime.sendMessage(
      { action: "fetchBasecampInfo", url: url },
      (response) => {
        if (response.error) {
          reject(response.error);
        } else {
          resolve(response);
        }
      },
    );
  });
}

const basecamp_logo = `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`;

function createWidget2(info) {
  // Create and style the logo
  const logo = document.createElement("img");
  logo.src = `data:image/png;base64,${basecamp_logo}`;
  logo.style.cssText = `
    width: 16px;
    height: 16px;
    margin-right: 4px;
    vertical-align: top;
  `;

  const text = document.createElement("span");
  // text.textContent = info.title;
  text.textContent = `(${info.project}) ${info.title}`;

  const widget = document.createElement("span");
  widget.className = "basecamp-widget";
  widget.title = info.url; // Set the original URL as a tooltip
  widget.style.cssText = `
    display: inline-block;
    background-color: white;
    border-radius: 3px;
    padding: 2px 6px;
    margin: 0 2px;
    font-size: 12px;
    line-height: 1.4;
    color: #0052CC;
    text-decoration: none;
    border: 1px solid;
    cursor: pointer;
    transition: background-color 0.2s ease;
  `;

  widget.appendChild(logo);
  widget.appendChild(text);

  // Add hover effect
  widget.addEventListener("mouseover", () => {
    widget.style.backgroundColor = "#F4F5F7";
  });
  widget.addEventListener("mouseout", () => {
    widget.style.backgroundColor = "white";
  });

  widget.addEventListener("click", (e) => {
    e.preventDefault();
    window.open(info.url, "_blank");
  });

  return widget;
}

// For initial page load.
replaceBasecampLinks();

// For apps using push state and things
function observePageChanges() {
  const targetNode = document.body;
  const observerOptions = {
    childList: true,
    subtree: true,
  };

  const observer = new MutationObserver((mutationsList, observer) => {
    for (let mutation of mutationsList) {
      if (mutation.type === "childList") {
        replaceBasecampLinks();
        break;
      }
    }
  });

  observer.observe(targetNode, observerOptions);
}

observePageChanges();
