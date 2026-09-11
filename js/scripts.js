/* 鉉宸有限公司 acμmen.tools — 官方網站互動腳本（純原生 JavaScript） */
(function () {
  'use strict';

  /* 行動版選單：焦點鎖定、背景 inert、Esc 關閉 */
  var toggle = document.getElementById('navToggle');
  var nav = document.getElementById('siteNav');
  var inertTargets = Array.prototype.slice.call(document.querySelectorAll('main, footer'));
  var menuOpen = false;

  function setMenu(open) {
    if (!toggle || !nav || open === menuOpen) return;
    menuOpen = open;
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? '關閉選單' : '開啟選單');
    nav.classList.toggle('is-open', open);
    document.body.style.overflow = open ? 'hidden' : '';
    inertTargets.forEach(function (el) { if (open) el.setAttribute('inert', ''); else el.removeAttribute('inert'); });
    if (open) { var first = nav.querySelector('a'); if (first) first.focus(); } else if (document.activeElement && nav.contains(document.activeElement)) { toggle.focus(); }
  }
  if (toggle && nav) {
    toggle.addEventListener('click', function () { setMenu(!menuOpen); });
    nav.querySelectorAll('a').forEach(function (a) { a.addEventListener('click', function () { setMenu(false); }); });
    document.addEventListener('keydown', function (e) {
      if (!menuOpen) return;
      if (e.key === 'Escape') { e.preventDefault(); setMenu(false); return; }
      if (e.key !== 'Tab') return;
      var items = [toggle].concat(Array.prototype.slice.call(nav.querySelectorAll('a')));
      var i = items.indexOf(document.activeElement);
      var next = e.shiftKey ? items[(i - 1 + items.length) % items.length] : items[(i + 1) % items.length];
      e.preventDefault(); next.focus();
    });
    window.addEventListener('resize', function () { if (menuOpen && window.innerWidth > 960) setMenu(false); });
  }

  /* 分頁籤（產品畫面） */
  document.querySelectorAll('[data-tabs]').forEach(function (root) {
    var tabs = Array.prototype.slice.call(root.querySelectorAll('[role="tab"]'));
    function activate(tab, focus) {
      tabs.forEach(function (t) {
        var on = t === tab;
        t.setAttribute('aria-selected', String(on));
        t.setAttribute('tabindex', on ? '0' : '-1');
        var panel = document.getElementById(t.getAttribute('aria-controls'));
        if (panel) panel.hidden = !on;
      });
      if (focus) tab.focus();
    }
    function syncFromHash() {
      var t = location.hash && root.querySelector('[role="tab"][aria-controls="' + location.hash.slice(1) + '"]');
      if (t) activate(t, false);
    }
    syncFromHash();
    window.addEventListener('hashchange', syncFromHash);
    tabs.forEach(function (tab, i) {
      tab.addEventListener('click', function () {
        activate(tab, false);
        if (history.replaceState) history.replaceState(null, '', '#' + tab.getAttribute('aria-controls'));
      });
      tab.addEventListener('keydown', function (e) {
        var next;
        if (e.key === 'ArrowRight') next = tabs[(i + 1) % tabs.length];
        else if (e.key === 'ArrowLeft') next = tabs[(i - 1 + tabs.length) % tabs.length];
        else if (e.key === 'Home') next = tabs[0];
        else if (e.key === 'End') next = tabs[tabs.length - 1];
        if (next) { e.preventDefault(); activate(next, true); }
      });
    });
  });

  var year = document.getElementById('year');
  if (year) year.textContent = String(new Date().getFullYear());
})();
