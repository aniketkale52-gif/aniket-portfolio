// Shared by every case study page (case-*.html).

// Case study video: play only while on screen (saves battery and data),
// and stay paused on the poster frame for visitors who prefer less motion.
(function () {
  var vids = Array.prototype.slice.call(document.querySelectorAll(".cs-media video"));
  if (!vids.length) return;
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  vids.forEach(function (v) { v.muted = true; if (reduce) { v.removeAttribute("autoplay"); v.pause(); } });
  if (reduce || !("IntersectionObserver" in window)) return;
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      var v = e.target;
      if (e.isIntersecting) { var p = v.play(); if (p && p.catch) p.catch(function () {}); }
      else v.pause();
    });
  }, { threshold: 0.15 });
  vids.forEach(function (v) { io.observe(v); });
})();

// Sticky dock: slides away once the footer comes into view.
(function () {
  var dock = document.querySelector(".cs-dock");
  var footer = document.querySelector(".site-footer");
  if (!dock || !footer || !("IntersectionObserver" in window)) return;
  new IntersectionObserver(function (entries) {
    dock.classList.toggle("is-away", entries[0].isIntersecting);
  }, { rootMargin: "0px 0px -60px 0px" }).observe(footer);
})();
