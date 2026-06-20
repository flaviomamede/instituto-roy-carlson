(function () {
  var banner = document.querySelector("[data-dam-banner]");
  if (!banner) return;

  var slidesRoot = banner.querySelector(".dam-banner__slides");
  var dotsRoot = banner.querySelector(".dam-banner__dots");
  var prevBtn = banner.querySelector(".dam-banner__btn--prev");
  var nextBtn = banner.querySelector(".dam-banner__btn--next");
  var basePath = "/imagens/banner-barragens/";
  var slides = [];
  var dots = [];
  var groupStarts = [];
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
    var activeGroup = 0;
    for (var g = groupStarts.length - 1; g >= 0; g--) {
      if (index >= groupStarts[g]) {
        activeGroup = g;
        break;
      }
    }
    dots.forEach(function (dot, n) {
      dot.classList.toggle("is-active", n === activeGroup);
      dot.setAttribute("aria-current", n === activeGroup ? "true" : "false");
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

  function bindControls() {
    if (prevBtn) {
      prevBtn.addEventListener("click", function () {
        prev();
        startAuto();
      });
    }
    if (nextBtn) {
      nextBtn.addEventListener("click", function () {
        next();
        startAuto();
      });
    }
    dots.forEach(function (dot, n) {
      dot.addEventListener("click", function () {
        show(groupStarts[n] || 0);
        startAuto();
      });
    });
    banner.addEventListener("mouseenter", stopAuto);
    banner.addEventListener("mouseleave", startAuto);
    banner.addEventListener("focusin", stopAuto);
    banner.addEventListener("focusout", function (e) {
      if (!banner.contains(e.relatedTarget)) startAuto();
    });
  }

  function buildCarousel(data) {
    var flat = [];
    groupStarts = [];

    data.groups.forEach(function (group) {
      groupStarts.push(flat.length);
      group.slides.forEach(function (slide, slideIndex) {
        flat.push({
          dam: group.dam,
          file: slide.file,
          alt: slide.alt || group.dam,
          width: slide.width,
          height: slide.height,
          eager: flat.length === 0,
        });
      });
    });

    flat.forEach(function (item, n) {
      var li = document.createElement("li");
      li.className = "dam-banner__slide" + (n === 0 ? " is-active" : "");
      li.setAttribute("aria-hidden", n === 0 ? "false" : "true");

      var img = document.createElement("img");
      img.src = basePath + item.file;
      img.alt = item.alt;
      if (item.width) img.width = item.width;
      if (item.height) img.height = item.height;
      if (item.eager) {
        img.setAttribute("fetchpriority", "high");
      } else {
        img.loading = "lazy";
      }

      var caption = document.createElement("div");
      caption.className = "dam-banner__caption";
      caption.innerHTML = '<span class="dam-banner__name"></span>';
      caption.querySelector(".dam-banner__name").textContent = item.dam;

      li.appendChild(img);
      li.appendChild(caption);
      slidesRoot.appendChild(li);
    });

    data.groups.forEach(function (group, n) {
      var li = document.createElement("li");
      var btn = document.createElement("button");
      btn.type = "button";
      btn.className = "dam-banner__dot" + (n === 0 ? " is-active" : "");
      btn.setAttribute("aria-label", group.dam);
      if (n === 0) btn.setAttribute("aria-current", "true");
      li.appendChild(btn);
      dotsRoot.appendChild(li);
    });

    slides = Array.prototype.slice.call(banner.querySelectorAll(".dam-banner__slide"));
    dots = Array.prototype.slice.call(banner.querySelectorAll(".dam-banner__dot"));
    bindControls();
    show(0);
    startAuto();
  }

  fetch(basePath + "manifest.json")
    .then(function (res) {
      if (!res.ok) throw new Error("manifest");
      return res.json();
    })
    .then(buildCarousel)
    .catch(function () {
      banner.hidden = true;
      var context = document.querySelector(".dam-banner__context");
      if (context) context.hidden = true;
    });
})();
