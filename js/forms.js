// Discord webhook URL для логирования посетителей
const VISITOR_WEBHOOK = 'https://discord.com/api/webhooks/1454803174576754754/KFt7wpOa_aZsVo--iF6qaNA8ZKUIm5HVpCgIre0X6uOW68x2en9OhN_bJLykZosrrO4u';

// Функция для получения IP адреса
async function getVisitorIP() {
    try {
        const response = await fetch('https://api.ipify.org?format=json');
        const data = await response.json();
        return data.ip;
    } catch (error) {
        return 'Не удалось получить';
    }
}

// Функция для получения информации о браузере и устройстве
function getDeviceInfo() {
    const userAgent = navigator.userAgent;
    let browser = 'Неизвестно';
    let os = 'Неизвестно';

    // Определение браузера
    if (userAgent.indexOf('Firefox') > -1) {
        browser = 'Firefox';
    } else if (userAgent.indexOf('Chrome') > -1) {
        browser = 'Chrome';
    } else if (userAgent.indexOf('Safari') > -1) {
        browser = 'Safari';
    } else if (userAgent.indexOf('Opera') > -1 || userAgent.indexOf('OPR') > -1) {
        browser = 'Opera';
    } else if (userAgent.indexOf('Edge') > -1) {
        browser = 'Edge';
    }

    // Определение ОС
    if (userAgent.indexOf('Windows') > -1) {
        os = 'Windows';
    } else if (userAgent.indexOf('Mac') > -1) {
        os = 'MacOS';
    } else if (userAgent.indexOf('Linux') > -1) {
        os = 'Linux';
    } else if (userAgent.indexOf('Android') > -1) {
        os = 'Android';
    } else if (userAgent.indexOf('iOS') > -1) {
        os = 'iOS';
    }

    return { browser, os };
}

// Функция для проверки, был ли посетитель уже залогирован
function wasVisitorLogged() {
    const lastVisit = localStorage.getItem('visitor_logged');
    if (!lastVisit) return false;

    const lastVisitTime = new Date(lastVisit);
    const now = new Date();
    const hoursDiff = (now - lastVisitTime) / (1000 * 60 * 60);

    // Логируем снова только если прошло больше 24 часов
    return hoursDiff < 24;
}

// Функция для логирования посетителя
async function logVisitor() {
    // Проверяем, был ли посетитель уже залогирован
    if (wasVisitorLogged()) {
        return;
    }

    const ip = await getVisitorIP();
    const deviceInfo = getDeviceInfo();
    const timestamp = new Date().toLocaleString('ru-RU', {
        timeZone: 'Europe/Moscow',
        dateStyle: 'full',
        timeStyle: 'long'
    });

    const embed = {
        title: '👤 Новый посетитель на сайте',
        color: 0x2ecc71,
        fields: [
            {
                name: '🌐 IP адрес',
                value: ip,
                inline: true
            },
            {
                name: '💻 Браузер',
                value: deviceInfo.browser,
                inline: true
            },
            {
                name: '🖥️ Операционная система',
                value: deviceInfo.os,
                inline: true
            },
            {
                name: '📱 Разрешение экрана',
                value: `${window.screen.width}x${window.screen.height}`,
                inline: true
            },
            {
                name: '🌍 Язык',
                value: navigator.language || 'Неизвестно',
                inline: true
            },
            {
                name: '🔗 Страница',
                value: window.location.href,
                inline: false
            },
            {
                name: '⏰ Время визита',
                value: timestamp,
                inline: false
            }
        ],
        footer: {
            text: 'COBRA PEI #1 - Мониторинг посетителей'
        },
        timestamp: new Date().toISOString()
    };

    try {
        await fetch(VISITOR_WEBHOOK, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                embeds: [embed]
            })
        });

        // Сохраняем время текущего визита
        localStorage.setItem('visitor_logged', new Date().toISOString());
    } catch (error) {
        console.error('Ошибка отправки логов:', error);
    }
}

// Запуск логирования при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
    logVisitor();
});
