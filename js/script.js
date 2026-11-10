// Typing effect: "Mohamed" is deleted and typed again, the rest stays fixed
(function () {
  var typed = document.getElementById("typed");
  var word = "Mohamed";
  if (!typed || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  var i = word.length;
  var deleting = true;

  function tick() {
    if (!deleting) {
      i++;
      typed.textContent = word.slice(0, i);
      if (i === word.length) {
        deleting = true;
        return setTimeout(tick, 2200);
      }
      return setTimeout(tick, 140);
    }
    i--;
    typed.textContent = word.slice(0, i);
    if (i === 0) {
      deleting = false;
      return setTimeout(tick, 500);
    }
    setTimeout(tick, 80);
  }

  setTimeout(tick, 1800);
})();

// Mobile menu
(function () {
  var btn = document.getElementById("menuBtn");
  var links = document.getElementById("links");
  btn.addEventListener("click", function () {
    var open = links.classList.toggle("open");
    btn.setAttribute("aria-expanded", String(open));
  });
  links.addEventListener("click", function (e) {
    if (e.target.tagName === "A") {
      links.classList.remove("open");
      btn.setAttribute("aria-expanded", "false");
    }
  });
})();

// Highlight the nav link of the section on screen
(function () {
  var anchors = document.querySelectorAll(".links a");
  var sections = Array.prototype.map.call(anchors, function (a) {
    return document.querySelector(a.getAttribute("href"));
  });
  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (!entry.isIntersecting) return;
      anchors.forEach(function (a) {
        a.classList.toggle("active", a.getAttribute("href") === "#" + entry.target.id);
      });
    });
  }, { rootMargin: "-45% 0px -50% 0px" });
  sections.forEach(function (s) { if (s) observer.observe(s); });
})();

// Hire me dialog + form (sent to Gmail through FormSubmit)
(function () {
  var dlg = document.getElementById("hireDialog");
  var form = document.getElementById("hireForm");
  var status = document.getElementById("formStatus");
  var submit = document.getElementById("submitBtn");

  document.getElementById("hireBtn").addEventListener("click", function () {
    status.textContent = "";
    dlg.showModal();
  });
  document.getElementById("closeDlg").addEventListener("click", function () { dlg.close(); });
  dlg.addEventListener("click", function (e) {
    var r = dlg.getBoundingClientRect();
    var outside = e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom;
    if (outside) dlg.close();
  });

  form.addEventListener("submit", async function (e) {
    e.preventDefault();
    status.textContent = "Sending...";
    submit.disabled = true;
    try {
      var res = await fetch("https://formsubmit.co/ajax/habiba5010@gmail.com", {
        method: "POST",
        headers: { "Content-Type": "application/json", "Accept": "application/json" },
        body: JSON.stringify(Object.fromEntries(new FormData(form)))
      });
      var data = await res.json();
      if (res.ok && String(data.success) === "true") {
        status.textContent = "Thank you! Your message was sent, and I'll reply soon.";
        form.reset();
      } else {
        throw new Error("Request failed");
      }
    } catch (err) {
      status.textContent = "Your message could not be sent. Please email habiba5010@gmail.com directly.";
    } finally {
      submit.disabled = false;
    }
  });
})();



// Project details dialog: fills from the matching <template> and stops the video on close
(function () {
  var dlg = document.getElementById("projectDialog");
  var body = document.getElementById("projBody");
  if (!dlg || !body) return;

  function openProject(id) {
    var tpl = document.getElementById("tpl-" + id);
    if (!tpl) return;
    body.replaceChildren(tpl.content.cloneNode(true));
    body.scrollTop = 0;
    dlg.showModal();
  }

  document.querySelectorAll("[data-open]").forEach(function (btn) {
    btn.addEventListener("click", function () { openProject(btn.dataset.open); });
  });
  document.querySelectorAll(".project").forEach(function (card) {
    card.addEventListener("click", function (e) {
      if (e.target.closest("a, button")) return;
      openProject(card.dataset.project);
    });
  });

  document.getElementById("closeProj").addEventListener("click", function () { dlg.close(); });
  dlg.addEventListener("click", function (e) { if (e.target === dlg) dlg.close(); });
  dlg.addEventListener("close", function () { body.replaceChildren(); });
})();
