// Server Status Checker for COBRA Server via BattleMetrics API
document.addEventListener('DOMContentLoaded', () => {
    const statusDot = document.getElementById('statusDot');
    const statusText = document.getElementById('statusText');
    const serverIPElement = document.getElementById('serverIP');
    const copyIpBtn = document.getElementById('copyIpBtn');
    const copyNotification = document.getElementById('copyNotification');

    if (!statusDot || !statusText) return;

    // BattleMetrics API Configuration
    const SERVER_CONFIG = {
        // COBRA ВЫЖИВАНИЕ #1 [PEI] Server ID on BattleMetrics
        serverId: '34747819',
        apiUrl: 'https://api.battlemetrics.com/servers/',
        checkInterval: 30000, // Check every 30 seconds
        timeout: 10000
    };

    // Store current server IP for copying
    let currentServerIP = '';

    async function checkServerStatus() {
        try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), SERVER_CONFIG.timeout);

            // Запрос к BattleMetrics API
            const response = await fetch(`${SERVER_CONFIG.apiUrl}${SERVER_CONFIG.serverId}`, {
                signal: controller.signal,
                method: 'GET',
                headers: {
                    'Accept': 'application/json'
                }
            });

            clearTimeout(timeoutId);

            if (response.ok) {
                const data = await response.json();

                // Извлекаем данные сервера
                const serverData = data.data;
                const attributes = serverData.attributes;

                const isOnline = attributes.status === 'online';
                const players = attributes.players || 0;
                const maxPlayers = attributes.maxPlayers || 0;

                // Получаем IP и порт сервера
                const serverIP = attributes.ip || '';
                const serverPort = attributes.port || '';
                if (serverIP && serverPort) {
                    currentServerIP = `${serverIP}:${serverPort}`;
                    if (serverIPElement) {
                        serverIPElement.textContent = `IP: ${currentServerIP}`;
                    }
                }

                // Обновляем статус с информацией об игроках
                if (isOnline) {
                    updateStatus(true, `Онлайн: ${players}/${maxPlayers} игроков`);
                } else {
                    updateStatus(false, 'Сервер оффлайн');
                }
            } else {
                console.error('API response error:', response.status);
                updateStatus(false, 'Ошибка получения данных');
            }
        } catch (error) {
            console.error('Error checking server status:', error);

            if (error.name === 'AbortError') {
                updateStatus(false, 'Тайм-аут подключения');
            } else {
                // Если не удалось подключиться к API, показываем статус по умолчанию
                updateStatus(true, 'Проверка статуса...');
            }
        }
    }

    function updateStatus(isOnline, message = null) {
        if (isOnline) {
            statusDot.className = 'status-dot online';
            statusText.textContent = message || 'Сервер онлайн';
        } else {
            statusDot.className = 'status-dot offline';
            statusText.textContent = message || 'Сервер оффлайн';
        }
    }

    // Copy IP function
    async function copyIP() {
        if (!currentServerIP) {
            return;
        }

        try {
            await navigator.clipboard.writeText(currentServerIP);
            showCopyNotification();
        } catch (err) {
            // Fallback for older browsers
            const textArea = document.createElement('textarea');
            textArea.value = currentServerIP;
            textArea.style.position = 'fixed';
            textArea.style.left = '-9999px';
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
            showCopyNotification();
        }
    }

    // Copy IP on button click
    if (copyIpBtn) {
        copyIpBtn.addEventListener('click', copyIP);
    }

    // Copy IP on text click
    if (serverIPElement) {
        serverIPElement.style.cursor = 'pointer';
        serverIPElement.title = 'Нажми чтобы скопировать';
        serverIPElement.addEventListener('click', copyIP);
    }

    function showCopyNotification() {
        if (copyNotification) {
            copyNotification.classList.add('show');
            setTimeout(() => {
                copyNotification.classList.remove('show');
            }, 2000);
        }
    }

    // Initial check
    checkServerStatus();

    // Periodic checks
    setInterval(checkServerStatus, SERVER_CONFIG.checkInterval);

    // Ручная проверка по клику
    const statusIndicator = document.querySelector('.status-indicator');
    if (statusIndicator) {
        statusIndicator.style.cursor = 'pointer';
        statusIndicator.title = 'Нажми для обновления статуса';
        statusIndicator.addEventListener('click', () => {
            statusText.textContent = 'Проверка...';
            checkServerStatus();
        });
    }
});

/*
 * BattleMetrics API Integration
 *
 * Этот скрипт использует публичное API BattleMetrics для получения статуса сервера.
 *
 * Текущий сервер: COBRA ВЫЖИВАНИЕ #1 [PEI] (ID: 34747819)
 * API Endpoint: https://api.battlemetrics.com/servers/34747819
 *
 * Чтобы изменить сервер:
 * 1. Найди свой сервер на https://www.battlemetrics.com/servers/unturned
 * 2. Скопируй ID сервера из URL (например, /servers/unturned/34747818)
 * 3. Замени значение serverId в SERVER_CONFIG выше
 *
 * API возвращает данные в формате:
 * {
 *   "data": {
 *     "attributes": {
 *       "status": "online" | "offline",
 *       "players": 80,
 *       "maxPlayers": 100,
 *       "name": "Server Name",
 *       ...
 *     }
 *   }
 * }
 *
 * Документация API: https://www.battlemetrics.com/developers
 */
