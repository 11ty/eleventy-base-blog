function prefetch(e) {
  if (e.target.tagName != "A") {
    return;
  }
  var l = document.createElement("link");
  l.rel = "prefetch";
  l.href = e.target.href;
  document.head.appendChild(l);
}
document.documentElement.addEventListener("mouseover", prefetch, {
  capture: true,
  passive: true,
});
document.documentElement.addEventListener("touchstart", prefetch, {
  capture: true,
  passive: true,
});

window.ga =
  window.ga ||
  function () {
    (ga.q = ga.q || []).push(arguments);
  };
ga.l = +new Date();
ga("create", "UA-141920860-1", "auto");
ga("send", "pageview");

setInterval(time, 60 * 1000);
function time() {
  if (document.hidden) return;
  ga("send", {
    hitType: "event",
    eventCategory: "time",
    eventAction: "seconds",
    eventLabel: 60,
  });
}
