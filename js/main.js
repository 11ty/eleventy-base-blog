window.dataLayer = window.dataLayer || [];
function gtag() {
  dataLayer.push(arguments);
}
gtag("js", new Date());
gtag("config", "UA-141920860-1");
setInterval(time, 60 * 1000);

function time() {
  if (document.hidden) return;
  console.log("track");
  gtag("event", "time", {
    event_category: "time",
    event_label: "seconds",
    value: 60,
  });
}
