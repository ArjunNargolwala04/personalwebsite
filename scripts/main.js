(function () {
    'use strict';

    var tabs = document.querySelectorAll('.tabs a[data-tab]');
    var panels = document.querySelectorAll('.tab-panel');
    document.documentElement.classList.add('js');

    function show(id) {
        if (!document.getElementById(id)) id = 'about';
        tabs.forEach(function (t) { t.classList.toggle('active', t.dataset.tab === id); });
        panels.forEach(function (p) { p.classList.toggle('active', p.id === id); });
    }

    tabs.forEach(function (t) {
        t.addEventListener('click', function (e) {
            e.preventDefault();
            history.replaceState(null, '', '#' + t.dataset.tab);
            show(t.dataset.tab);
        });
    });

    show(location.hash.slice(1));
})();
