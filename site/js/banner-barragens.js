(function () {
  var banner = document.querySelector("[data-dam-banner]");
  if (!banner) return;

  var slides = banner.querySelectorAll(".dam-banner__slide");
  var dots = banner.querySelectorAll(".dam-banner__dot");
  var prevBtn = banner.querySelector(".dam-banner__btn--prev");
  var nextBtn = banner.querySelector(".dam-banner__btn--next");
  var index = 0;
  var timer = null;
  var intervalMs = 5500;
  var reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function show(i) {
    index = (i + slides.length) % slides.length;
    slides.forEach(function (slide, n) {
      slide.classList.toggle("is-active", n === index);
      slide.setAttribute("aria-hidden", n === index ? "false" : "true");
    });
    dots.forEach(function (dot, n) {
      dot.classList.toggle("is-active", n === index);
      dot.setAttribute("aria-current", n === index ? "true" : "false");
    });
  }

  function next() {
    show(index + 1);
  }

  function prev() {
    show(index - 1);
  }

  function stopAuto() {
    if (timer) {
      window.clearInterval(timer);
      timer = null;
    }
  }

  function startAuto() {
    stopAuto();
    if (reducedMotion || slides.length < 2) return;
    timer = window.setInterval(next, intervalMs);
  }

  if (prevBtn) prevBtn.addEventListener("click", function () { prev(); startAuto(); });
  if (nextBtn) nextBtn.addEventListener("click", function () { next(); startAuto(); });

  dots.forEach(function (dot, n) {
    dot.addEventListener("click", function () {
      show(n);
      startAuto();
    });
  });

  banner.addEventListener("mouseenter", stopAuto);
  banner.addEventListener("mouseleave", startAuto);
  banner.addEventListener("focusin", stopAuto);
  banner.addEventListener("focusout", function (e) {
    if (!banner.contains(e.relatedTarget)) startAuto();
  });

  show(0);
  startAuto();
})();
