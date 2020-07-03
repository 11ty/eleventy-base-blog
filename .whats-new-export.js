let pages = Array.from(document.querySelectorAll("amp-story-page")).splice(2);

let month = [];
let currentMonth = [];

pages.forEach((page) => {
  const entry = {
    title: "",
    id: page.id,
  };
  const h = page.querySelector("h1,h2");
  if (h) {
    entry.title = h.textContent;
    if (h.className) {
      entry.titleClass = h.className;
    }
  }
  const tweet = page.querySelector("amp-twitter");
  if (tweet) {
    entry.tweet = tweet.getAttribute("data-tweetid");
  }
  entry.image = getMedia(page, "amp-img");
  entry.video = getMedia(page, "amp-video");
  if (tweet || !/20\d\d/.test(entry.title)) {
    currentMonth.push(entry);
  } else {
    month.push(entry);
    entry.pages = currentMonth = [];
  }
});

function getMedia(page, selector) {
  const element = page.querySelector(selector);
  if (!element) {
    return undefined;
  }
  return {
    width: element.getAttribute("width"),
    height: element.getAttribute("height"),
    src: element.getAttribute("src") || element.querySelector("video").src,
    layout: element.getAttribute("layout"),
    poster: element.getAttribute("poster"),
  };
}

month;
