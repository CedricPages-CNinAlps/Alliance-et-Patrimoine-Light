/* Alliance & Patrimoine — version statique de démonstration.
   ATTENTION : la protection des espaces adhérent et back-office est uniquement côté navigateur.
   Elle masque les pages aux visiteurs de passage mais N'EST PAS une sécurité : ne publiez
   jamais de données réelles d'adhérents sur ce site. */
(function () {
  "use strict";
  var KEY = "ap-demo-session";
  var root = document.documentElement.getAttribute("data-root") || "./";
  var CREDENTIAL_HASH = "46145600ee95f18059229c11635e0583f3f8655675d89172b69362828439424d";

  function store(fn) { try { return fn(window.sessionStorage); } catch (e) { return null; } }
  function isLogged() { return store(function (s) { return s.getItem(KEY) === "1"; }) === true; }

  // Garde des pages protégées
  if (document.documentElement.hasAttribute("data-protected") && !isLogged()) {
    var here = location.pathname.split("/").slice(-2).join("/");
    location.replace(root + "connexion.html?next=" + encodeURIComponent(here));
    return;
  }

  async function sha256(text) {
    var buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(text));
    return Array.from(new Uint8Array(buf)).map(function (b) { return b.toString(16).padStart(2, "0"); }).join("");
  }

  document.addEventListener("DOMContentLoaded", function () {
    // Menu mobile
    var header = document.querySelector(".site-header");
    var toggle = document.querySelector(".menu-toggle");
    if (header && toggle) {
      toggle.addEventListener("click", function () {
        var open = header.classList.toggle("is-open");
        toggle.setAttribute("aria-expanded", open ? "true" : "false");
      });
    }

    // Liens « Espace adhérent » : libellé selon l'état de connexion
    document.querySelectorAll("[data-auth-label]").forEach(function (el) {
      if (isLogged()) el.textContent = el.getAttribute("data-auth-label");
    });

    // Déconnexion
    document.querySelectorAll("[data-logout]").forEach(function (el) {
      el.addEventListener("click", function (e) {
        e.preventDefault();
        store(function (s) { s.removeItem(KEY); });
        location.href = root + "index.html";
      });
    });

    // Connexion
    var login = document.getElementById("login-form");
    if (login) {
      var err = document.getElementById("login-error");
      login.addEventListener("submit", async function (e) {
        e.preventDefault();
        var id = login.elements.identifiant.value.trim().toLowerCase();
        var pw = login.elements.motdepasse.value;
        var ok = false;
        try { ok = (await sha256(id + ":" + pw)) === CREDENTIAL_HASH; } catch (x) { ok = false; }
        if (!ok) { err.hidden = false; login.elements.motdepasse.value = ""; login.elements.motdepasse.focus(); return; }
        store(function (s) { s.setItem(KEY, "1"); });
        var next = new URLSearchParams(location.search).get("next") || "";
        if (!/^(espace-adherent|admin)\/[a-z0-9-]+\.html$/.test(next)) {
          next = login.elements.cible && login.elements.cible.value === "admin" ? "admin/index.html" : "espace-adherent/index.html";
        }
        location.href = root + next;
      });
    }

    // Filtre de l'annuaire
    var dir = document.getElementById("directory");
    if (dir) {
      var q = document.getElementById("f-q"), dom = document.getElementById("f-domain"), city = document.getElementById("f-city");
      var count = document.getElementById("f-count"), empty = document.getElementById("f-empty");
      var params = new URLSearchParams(location.search);
      if (params.get("q")) q.value = params.get("q");
      if (params.get("domaine")) dom.value = params.get("domaine");
      var norm = function (s) { return s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase(); };
      var apply = function () {
        var n = 0, tq = norm(q.value), td = dom.value, tc = norm(city.value);
        dir.querySelectorAll("[data-cgp]").forEach(function (card) {
          var show = (!tq || norm(card.getAttribute("data-search")).indexOf(tq) >= 0)
            && (!td || card.getAttribute("data-domains").split(" ").indexOf(td) >= 0)
            && (!tc || norm(card.getAttribute("data-city")).indexOf(tc) >= 0);
          card.hidden = !show; if (show) n++;
        });
        count.textContent = n + (n > 1 ? " conseillers" : " conseiller");
        empty.hidden = n > 0;
      };
      [q, dom, city].forEach(function (el) { el.addEventListener("input", apply); });
      document.getElementById("f-reset").addEventListener("click", function () { q.value = ""; dom.value = ""; city.value = ""; apply(); });
      apply();
    }

    // Onglets (filtres de liste)
    document.querySelectorAll("[data-tabs]").forEach(function (group) {
      var target = document.getElementById(group.getAttribute("data-tabs"));
      group.querySelectorAll("button[data-filter]").forEach(function (btn) {
        btn.addEventListener("click", function () {
          group.querySelectorAll("button").forEach(function (b) { b.setAttribute("aria-pressed", b === btn ? "true" : "false"); });
          var f = btn.getAttribute("data-filter");
          target.querySelectorAll("[data-kind]").forEach(function (item) {
            item.hidden = f !== "all" && item.getAttribute("data-kind") !== f;
          });
        });
      });
    });

    // Formulaires de démonstration
    document.querySelectorAll("form[data-demo]").forEach(function (form) {
      form.addEventListener("submit", function (e) {
        e.preventDefault();
        var note = form.querySelector(".form-note");
        if (note) { note.hidden = false; note.focus(); }
      });
    });
  });
})();
