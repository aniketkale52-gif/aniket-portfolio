// Shared by every page: navbar shadow and the footer character card.

// Footer card: tilts in 3D toward the mouse anywhere in the footer, and lifts
// with a moving light spot when the mouse is on the card itself.
(function () {
  var footer = document.querySelector(".site-footer");
  var card = document.querySelector(".footer-card-3d");
  if (!footer || !card) return;
  if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  var cur = { rx: 0, ry: 0, cx: 0, cy: 0, cs: 1, go: 0, gx: 50, gy: 30 };
  var tgt = { rx: 0, ry: 0, cx: 0, cy: 0, cs: 1, go: 0, gx: 50, gy: 30 };
  var running = false;

  function onMove(e) {
    if (e.pointerType !== "mouse") return;
    var r = card.getBoundingClientRect();
    var ccx = r.left + r.width / 2, ccy = r.top + r.height / 2;
    var inside = e.clientX >= r.left && e.clientX <= r.right && e.clientY >= r.top && e.clientY <= r.bottom;
    if (inside) {
      // Over the card: stronger tilt, measured across the card itself
      var nx = (e.clientX - ccx) / (r.width / 2), ny = (e.clientY - ccy) / (r.height / 2);
      tgt.ry = nx * 8; tgt.rx = -ny * 6;
      tgt.cs = 1.05; tgt.go = 1;
      tgt.gx = ((e.clientX - r.left) / r.width) * 100;
      tgt.gy = ((e.clientY - r.top) / r.height) * 100;
      tgt.cx = nx * 4; tgt.cy = ny * 4;
    } else {
      // Elsewhere in the footer: a gentler lean toward the cursor
      var f = footer.getBoundingClientRect();
      var fx = Math.max(-1, Math.min(1, (e.clientX - ccx) / (f.width / 2)));
      var fy = Math.max(-1, Math.min(1, (e.clientY - ccy) / (f.height / 2)));
      tgt.ry = fx * 5; tgt.rx = -fy * 4;
      tgt.cs = 1; tgt.go = 0;
      tgt.cx = fx * 10; tgt.cy = fy * 7;
    }
    start();
  }
  function onLeave() {
    tgt.rx = 0; tgt.ry = 0; tgt.cx = 0; tgt.cy = 0; tgt.cs = 1; tgt.go = 0;
    start();
  }
  function start() { if (!running) { running = true; requestAnimationFrame(tick); } }
  function tick() {
    var moving = false;
    for (var k in tgt) {
      var ease = (k === "gx" || k === "gy") ? 0.2 : 0.09;
      cur[k] += (tgt[k] - cur[k]) * ease;
      if (Math.abs(tgt[k] - cur[k]) > 0.01) moving = true;
    }
    card.style.setProperty("--rx", cur.rx.toFixed(2) + "deg");
    card.style.setProperty("--ry", cur.ry.toFixed(2) + "deg");
    card.style.setProperty("--cx", cur.cx.toFixed(2) + "px");
    card.style.setProperty("--cy", cur.cy.toFixed(2) + "px");
    card.style.setProperty("--cs", cur.cs.toFixed(4));
    card.style.setProperty("--go", cur.go.toFixed(3));
    card.style.setProperty("--gx", cur.gx.toFixed(1) + "%");
    card.style.setProperty("--gy", cur.gy.toFixed(1) + "%");
    if (moving) requestAnimationFrame(tick); else running = false;
  }
  footer.addEventListener("pointermove", onMove);
  footer.addEventListener("pointerleave", onLeave);
})();

// Navbar: add a soft shadow once the page has scrolled under it
(function () {
  var nav = document.querySelector(".site-nav");
  if (!nav) return;
  var queued = false;
  function update() { queued = false; nav.classList.toggle("is-scrolled", window.scrollY > 24); }
  window.addEventListener("scroll", function () { if (!queued) { queued = true; requestAnimationFrame(update); } }, { passive: true });
  update();
})();
