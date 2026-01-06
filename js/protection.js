// Advanced Protection System
(function() {
    'use strict';

    // Блокировка правой кнопки мыши
    document.addEventListener('contextmenu', function(e) {
        e.preventDefault();
        return false;
    });

    // Блокировка горячих клавиш
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

        // Ctrl+P (Print)
        if (e.ctrlKey && (e.key === 'P' || e.key === 'p' || e.keyCode === 80)) {
            e.preventDefault();
            return false;
        }

        // Ctrl+A (Select All)
        if (e.ctrlKey && (e.key === 'A' || e.key === 'a' || e.keyCode === 65)) {
            e.preventDefault();
            return false;
        }

        // PrintScreen
        if (e.key === 'PrintScreen' || e.keyCode === 44) {
            e.preventDefault();
            return false;
        }
    });

    // Детекция DevTools через размер окна
    let devtoolsOpen = false;
    let warningShown = false;

    const detectDevTools = function() {
        const threshold = 160;
        const widthDiff = window.outerWidth - window.innerWidth;
        const heightDiff = window.outerHeight - window.innerHeight;

        if (widthDiff > threshold || heightDiff > threshold) {
            if (!devtoolsOpen) {
                devtoolsOpen = true;
                onDevToolsOpen();
            }
        } else {
            if (devtoolsOpen && warningShown) {
                location.reload();
            }
            devtoolsOpen = false;
        }
    };

    const onDevToolsOpen = function() {
        warningShown = true;
        document.body.innerHTML = `
            <div style="
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;
                height: 100vh;
                background: linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 100%);
                color: #FF7C00;
                font-family: 'Rubik', sans-serif;
                text-align: center;
                padding: 20px;
            ">
                <div style="font-size: 48px; margin-bottom: 20px;">⚠️</div>
                <div style="font-size: 24px; font-weight: 600; margin-bottom: 10px;">DevTools Detected</div>
                <div style="font-size: 16px; color: #a0a0a0;">Закройте инструменты разработчика для продолжения</div>
            </div>
        `;
    };

    setInterval(detectDevTools, 500);

    // Детекция через console.log
    const element = new Image();
    Object.defineProperty(element, 'id', {
        get: function() {
            onDevToolsOpen();
        }
    });

    // Блокировка drag & drop
    document.addEventListener('dragstart', function(e) {
        e.preventDefault();
        return false;
    });

    // Блокировка выделения текста
    document.addEventListener('selectstart', function(e) {
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
            return true;
        }
        e.preventDefault();
        return false;
    });

    // Блокировка копирования
    document.addEventListener('copy', function(e) {
        e.preventDefault();
        return false;
    });

    // Защита от iframe
    if (window.self !== window.top) {
        window.top.location = window.self.location;
    }

    // Очистка консоли
    console.clear();

    // Предупреждение в консоли
    console.log('%c⛔ СТОП!', 'color: #ff4444; font-size: 50px; font-weight: bold; text-shadow: 2px 2px 0 #000;');
    console.log('%cЭта функция браузера предназначена для разработчиков.', 'color: #FF7C00; font-size: 16px;');
    console.log('%cЕсли кто-то сказал вам что-то сюда вставить - это мошенники!', 'color: #fff; font-size: 14px;');

    // Периодическая очистка консоли
    setInterval(function() {
        console.clear();
        console.log('%c⛔ СТОП!', 'color: #ff4444; font-size: 50px; font-weight: bold;');
    }, 5000);

})();
