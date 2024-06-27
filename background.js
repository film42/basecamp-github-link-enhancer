chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "fetchBasecampInfo") {
    fetchBasecampInfo(request.url)
      .then((info) => sendResponse(info))
      .catch((error) => sendResponse({ error: error.message }));
    return true; // Indicates that the response is sent asynchronously
  }
});

async function fetchBasecampInfo(url) {
  // Remove hash and query parameters
  const urlObj = new URL(url);
  urlObj.hash = "";
  urlObj.search = "";

  // Add .json to the path
  urlObj.pathname += ".json";

  const jsonUrl = urlObj.toString();

  console.log("Fetching Basecamp URL: " + jsonUrl);

  try {
    const response = await fetch(jsonUrl);

    if (response.status !== 200) {
      throw new Error(`Got bad repsonse status: ${response.status}`);
    }

    const data = await response.json();

    if (data && data.title) {
      return {
        title: data.title,
        url: url,
        project: data.bucket.name,
      };
    } else {
      throw new Error("Invalid data format");
    }
  } catch (error) {
    console.error("Error fetching Basecamp info:", error);
    throw error;
  }
}
