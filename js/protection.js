// DevTools Protection
(function() {
    'use strict';

    // Блокировка правой кнопки мыши
    document.addEventListener('contextmenu', function(e) {
        e.preventDefault();
        return false;
    });

    // Блокировка горячих клавиш DevTools
    document.addEventListener('keydown', function(e) {
        // F12
        if (e.key === 'F12' || e.keyCode === 123) {
            e.preventDefault();
            return false;
        }

        // Ctrl+Shift+I (DevTools)
        if (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'i' || e.keyCode === 73)) {
            e.preventDefault();
            return false;
        }

        // Ctrl+Shift+J (Console)
        if (e.ctrlKey && e.shiftKey && (e.key === 'J' || e.key === 'j' || e.keyCode === 74)) {
            e.preventDefault();
            return false;
        }

        // Ctrl+Shift+C (Inspect Element)
        if (e.ctrlKey && e.shiftKey && (e.key === 'C' || e.key === 'c' || e.keyCode === 67)) {
            e.preventDefault();
            return false;
        }

        // Ctrl+U (View Source)
        if (e.ctrlKey && (e.key === 'U' || e.key === 'u' || e.keyCode === 85)) {
            e.preventDefault();
            return false;
        }

        // Ctrl+S (Save Page)
        if (e.ctrlKey && (e.key === 'S' || e.key === 's' || e.keyCode === 83)) {
            e.preventDefault();
            return false;
        }
    });

    // Детекция DevTools через debugger
    let devtoolsOpen = false;

    const detectDevTools = function() {
        const threshold = 160;
        const widthThreshold = window.outerWidth - window.innerWidth > threshold;
        const heightThreshold = window.outerHeight - window.innerHeight > threshold;

        if (widthThreshold || heightThreshold) {
            if (!devtoolsOpen) {
                devtoolsOpen = true;
                onDevToolsOpen();
            }
        } else {
            devtoolsOpen = false;
        }
    };

    const onDevToolsOpen = function() {
        // Действие при открытии DevTools
        document.body.innerHTML = '<div style="display:flex;justify-content:center;align-items:center;height:100vh;background:#0a0a0a;color:#ff4444;font-family:Rubik,sans-serif;font-size:24px;text-align:center;padding:20px;">DevTools обнаружены. Закройте их для продолжения.</div>';
    };

    // Проверка каждые 500мс
    setInterval(detectDevTools, 500);

    // Debugger detection
    let checkStatus = false;

    setInterval(function() {
        const start = performance.now();
        debugger;
        const end = performance.now();

        if (end - start > 100) {
            if (!checkStatus) {
                checkStatus = true;
                onDevToolsOpen();
            }
        }
    }, 1000);

    // Блокировка drag & drop
    document.addEventListener('dragstart', function(e) {
        e.preventDefault();
        return false;
    });

    // Блокировка выделения текста (опционально - можно убрать если мешает)
    document.addEventListener('selectstart', function(e) {
        // Разрешаем выделение в инпутах
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
            return true;
        }
        e.preventDefault();
        return false;
    });

    // Очистка консоли
    console.clear();

    // Перезапись console.log
    const originalConsole = console.log;
    console.log = function() {
        console.clear();
    };

    // Сообщение в консоли
    console.log('%cСтоп!', 'color: red; font-size: 50px; font-weight: bold;');
    console.log('%cЭта функция браузера предназначена для разработчиков.', 'font-size: 18px;');

})();
