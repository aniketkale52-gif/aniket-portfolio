// Work section, shared by the homepage and the All Projects page (work.html).

// Work section: heading shrinks as the section scrolls by (and grows back on
// the way up); each card tilts as it enters and straightens at the centre.
(function () {
  var section = document.querySelector(".work");
  var heading = document.querySelector(".work-heading");
  var cards = Array.prototype.slice.call(document.querySelectorAll(".work-card"));
  if (!section || !heading) return;
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var queued = false;

  function update() {
    queued = false;
    var vh = window.innerHeight;
    var r = section.getBoundingClientRect();
    // 0 when the section's top reaches the top of the screen, 1 at its end
    var total = Math.max(1, r.height - vh);
    var p = Math.min(1, Math.max(0, -r.top / total));
    heading.style.setProperty("--work-scale", (1 - p * 0.55).toFixed(4));

    if (reduce) return;
    for (var i = 0; i < cards.length; i++) {
      var c = cards[i].getBoundingClientRect();
      // -1 below the screen centre ... 0 at centre ... +1 above
      var d = ((vh / 2) - (c.top + c.height / 2)) / vh;
      d = Math.max(-1, Math.min(1, d));
      var dir = i % 2 === 0 ? -1 : 1;
      var tilt = d < 0 ? dir * 5 * -d : dir * 2 * d;
      var grow = 1 - Math.min(0.06, Math.abs(d) * 0.06);
      cards[i].style.setProperty("--tilt", tilt.toFixed(2) + "deg");
      cards[i].style.setProperty("--grow", grow.toFixed(4));
    }
  }

  function queue() { if (!queued) { queued = true; requestAnimationFrame(update); } }
  window.addEventListener("scroll", queue, { passive: true });
  window.addEventListener("resize", queue);
  update();
})();

// Over a case study card, the mouse cursor becomes the "View more" pill.
(function () {
  var cursor = document.querySelector(".view-cursor");
  var cards = document.querySelectorAll(".work-card:not(.work-all)");
  if (!cursor || !cards.length) return;
  if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;

  var x = -200, y = -200, tx = -200, ty = -200, running = false, on = false;

  function tick() {
    x += (tx - x) * 0.35;
    y += (ty - y) * 0.35;
    cursor.style.transform = "translate3d(" + x.toFixed(1) + "px," + y.toFixed(1) + "px,0)";
    if (Math.abs(tx - x) > 0.3 || Math.abs(ty - y) > 0.3) requestAnimationFrame(tick);
    else running = false;
  }
  function move(e) {
    tx = e.clientX; ty = e.clientY;
    if (!on) { x = tx; y = ty; }
    if (!running) { running = true; requestAnimationFrame(tick); }
  }

  Array.prototype.forEach.call(cards, function (card) {
    card.addEventListener("pointerenter", function (e) {
      if (e.pointerType !== "mouse") return;
      move(e); on = true; cursor.classList.add("is-on");
    });
    card.addEventListener("pointermove", function (e) { if (e.pointerType === "mouse") move(e); });
    card.addEventListener("pointerleave", function () { on = false; cursor.classList.remove("is-on"); });
  });
  // Keep the pill under the pointer while the page scrolls under a still mouse
  window.addEventListener("scroll", function () {
    if (!on) return;
    var el = document.elementFromPoint(tx, ty);
    if (!el || !el.closest(".work-card:not(.work-all)")) { on = false; cursor.classList.remove("is-on"); }
  }, { passive: true });
})();

// Case study clips: play only while on screen (saves battery and data),
// and stay paused on the poster frame for visitors who prefer less motion.
(function () {
  var vids = Array.prototype.slice.call(document.querySelectorAll(".work-media video"));
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
