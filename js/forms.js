// Discord webhook URLs
const DISCORD_WEBHOOKS = {
    ideas: 'https://discordapp.com/api/webhooks/1452744051538395166/DycJdRWdIhQXEhKR-1eIPo7lP-mWHzJJVFSBLO3eAOlhzIX6gb7j7i9ALvLkq_wcpCnY',
    complaints: 'https://discordapp.com/api/webhooks/1452744159008915558/PBRmrfbqgHi_N7NqAhknpax5KPyN-AkMG9NTVUfk6FgP1KHsKJUq2_YzFRhTlQx8mOEl'
};

const DISCORD_USER_ID = '454319586960080897';

// Category translations
const CATEGORY_NAMES = {
    gameplay: 'Игровой процесс',
    events: 'События',
    economy: 'Экономика',
    technical: 'Технические улучшения',
    other: 'Другое',
    grief: 'Гриферство',
    abuse: 'Оскорбления',
    cheat: 'Читы/Нечестная игра',
    spam: 'Спам',
    scam: 'Мошенничество'
};

// Character counter setup
function setupCharCounter(inputId, counterId) {
    const input = document.getElementById(inputId);
    const counter = document.getElementById(counterId);
    if (input && counter) {
        const maxLength = parseInt(input.getAttribute('maxlength'));
        input.addEventListener('input', () => {
            const length = input.value.length;
            counter.textContent = length;

            const parent = counter.parentElement;
            parent.classList.remove('warning', 'danger');

            if (length > maxLength * 0.9) {
                parent.classList.add('danger');
            } else if (length > maxLength * 0.7) {
                parent.classList.add('warning');
            }
        });
    }
}

// Initialize character counters
function initCharCounters() {
    setupCharCounter('idea-nickname', 'idea-nickname-count');
    setupCharCounter('idea-title', 'idea-title-count');
    setupCharCounter('idea-description', 'idea-description-count');
    setupCharCounter('complaint-your-nickname', 'complaint-your-nickname-count');
    setupCharCounter('complaint-target-nickname', 'complaint-target-nickname-count');
    setupCharCounter('complaint-description', 'complaint-description-count');
    setupCharCounter('complaint-proof', 'complaint-proof-count');
}

// Handle idea form submission
async function handleIdeaSubmit(e) {
    e.preventDefault();
    const form = document.getElementById('idea-form');
    const button = form.querySelector('button[type="submit"]');

    button.style.transform = 'scale(0.95)';
    button.disabled = true;
    button.textContent = 'Отправка...';

    const nickname = document.getElementById('idea-nickname').value;
    const title = document.getElementById('idea-title').value;
    const category = document.getElementById('idea-category').value;
    const description = document.getElementById('idea-description').value;

    const embed = {
        title: '💡 Новая идея для сервера',
        color: 0x3498db,
        fields: [
            {
                name: '👤 Ник игрока',
                value: nickname,
                inline: true
            },
            {
                name: '📁 Категория',
                value: CATEGORY_NAMES[category] || category,
                inline: true
            },
            {
                name: '📝 Название идеи',
                value: title,
                inline: false
            },
            {
                name: '📄 Описание',
                value: description,
                inline: false
            }
        ],
        timestamp: new Date().toISOString(),
        footer: {
            text: 'COBRA PEI #1 - Система идей'
        }
    };

    try {
        const response = await fetch(DISCORD_WEBHOOKS.ideas, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                content: `<@${DISCORD_USER_ID}>`,
                embeds: [embed]
            })
        });

        if (response.ok) {
            showToast(
                'Идея успешно отправлена!',
                'success',
                'Спасибо за ваше предложение!'
            );

            form.reset();
            document.querySelectorAll('[id$="-count"]').forEach(el => {
                el.textContent = '0';
                el.parentElement.classList.remove('warning', 'danger');
            });
        } else {
            throw new Error('Ошибка отправки');
        }
    } catch (error) {
        showToast(
            'Ошибка отправки',
            'error',
            'Попробуйте еще раз позже'
        );
    } finally {
        button.disabled = false;
        button.textContent = 'Отправить идею';
        setTimeout(() => {
            button.style.transform = '';
        }, 150);
    }
}

// Handle complaint form submission
async function handleComplaintSubmit(e) {
    e.preventDefault();
    const form = document.getElementById('complaint-form');
    const button = form.querySelector('button[type="submit"]');

    button.style.transform = 'scale(0.95)';
    button.disabled = true;
    button.textContent = 'Отправка...';

    const yourNickname = document.getElementById('complaint-your-nickname').value;
    const targetNickname = document.getElementById('complaint-target-nickname').value;
    const reason = document.getElementById('complaint-reason').value;
    const description = document.getElementById('complaint-description').value;
    const proof = document.getElementById('complaint-proof').value;

    const embed = {
        title: '⚠️ Новая жалоба на нарушение',
        color: 0xe74c3c,
        fields: [
            {
                name: '👤 Отправитель',
                value: yourNickname,
                inline: true
            },
            {
                name: '🎯 Нарушитель',
                value: targetNickname,
                inline: true
            },
            {
                name: '⚡ Причина',
                value: CATEGORY_NAMES[reason] || reason,
                inline: true
            },
            {
                name: '📄 Описание нарушения',
                value: description,
                inline: false
            }
        ],
        timestamp: new Date().toISOString(),
        footer: {
            text: 'COBRA PEI #1 - Система жалоб'
        }
    };

    if (proof && proof.trim() !== '') {
        embed.fields.push({
            name: '🔗 Доказательства',
            value: proof,
            inline: false
        });
    }

    try {
        const response = await fetch(DISCORD_WEBHOOKS.complaints, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                content: `<@${DISCORD_USER_ID}>`,
                embeds: [embed]
            })
        });

        if (response.ok) {
            showToast(
                'Жалоба успешно отправлена!',
                'success',
                'Ваша жалоба будет рассмотрена администрацией'
            );

            form.reset();
            document.querySelectorAll('[id$="-count"]').forEach(el => {
                el.textContent = '0';
                el.parentElement.classList.remove('warning', 'danger');
            });
        } else {
            throw new Error('Ошибка отправки');
        }
    } catch (error) {
        showToast(
            'Ошибка отправки',
            'error',
            'Попробуйте еще раз позже'
        );
    } finally {
        button.disabled = false;
        button.textContent = 'Отправить жалобу';
        setTimeout(() => {
            button.style.transform = '';
        }, 150);
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', initCharCounters);
