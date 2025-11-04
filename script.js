// Переключение темы
const themeToggle = document.getElementById('themeToggle');
const currentTheme = localStorage.getItem('theme') || 'light';

// Установка начальной темы
document.documentElement.setAttribute('data-theme', currentTheme);
themeToggle.innerHTML = currentTheme === 'dark' ? '☀️' : '🌙';

themeToggle.addEventListener('click', () => {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    themeToggle.innerHTML = newTheme === 'dark' ? '☀️' : '🌙';
});

// Навигация по страницам
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetPage = link.getAttribute('data-page');
        
        // Скрыть все страницы
        document.querySelectorAll('.page').forEach(page => {
            page.classList.remove('active');
        });
        
        // Показать целевую страницу
        document.getElementById(targetPage).classList.add('active');
        
        // Обновить активную ссылку в навигации
        document.querySelectorAll('.nav-link').forEach(navLink => {
            navLink.classList.remove('active');
        });
        link.classList.add('active');
        
        // Прокрутка к верху страницы
        window.scrollTo(0, 0);
    });
});

// Категории курсов
document.querySelectorAll('.category-tab').forEach(tab => {
    tab.addEventListener('click', () => {
        const category = tab.getAttribute('data-category');
        
        // Скрыть все категории
        document.querySelectorAll('.category-content').forEach(content => {
            content.classList.remove('active');
        });
        
        // Показать выбранную категорию
        document.getElementById(category).classList.add('active');
        
        // Обновить активную вкладку
        document.querySelectorAll('.category-tab').forEach(catTab => {
            catTab.classList.remove('active');
        });
        tab.classList.add('active');
    });
});

// Мини-игра с перетаскиванием кода
let draggedBlock = null;

document.querySelectorAll('.code-block').forEach(block => {
    block.addEventListener('dragstart', (e) => {
        draggedBlock = e.target;
        e.target.classList.add('dragging');
    });
    
    block.addEventListener('dragend', (e) => {
        e.target.classList.remove('dragging');
    });
});

const codeArea = document.getElementById('codeArea');

if (codeArea) {
    codeArea.addEventListener('dragover', (e) => {
        e.preventDefault();
        codeArea.classList.add('active');
    });

    codeArea.addEventListener('dragleave', () => {
        codeArea.classList.remove('active');
    });

    codeArea.addEventListener('drop', (e) => {
        e.preventDefault();
        codeArea.classList.remove('active');
        
        if (draggedBlock) {
            const clone = draggedBlock.cloneNode(true);
            clone.classList.add('dropped');
            clone.draggable = false;
            
            // Удаляем плейсхолдер
            const placeholder = codeArea.querySelector('.placeholder');
            if (placeholder) {
                placeholder.remove();
            }
            
            codeArea.appendChild(clone);
        }
    });
}

// Запуск кода в мини-игре
const runCodeBtn = document.getElementById('runCode');
if (runCodeBtn) {
    runCodeBtn.addEventListener('click', () => {
        const character = document.getElementById('gameCharacter');
        const blocks = document.querySelectorAll('.dropped');
        
        if (blocks.length === 4) {
            // Анимация движения персонажа
            character.style.transform = 'translateX(100px)';
            setTimeout(() => {
                character.style.transform = 'translateX(0)';
                showNotification('Ура! Код работает правильно! 🎉');
            }, 1000);
        } else {
            showNotification('Собери все блоки кода в правильном порядке!');
        }
    });
}

// Демо-проект
const demoButton = document.getElementById('demoButton');
if (demoButton) {
    demoButton.addEventListener('click', () => {
        document.getElementById('demoProject').classList.add('active');
    });
}

const closeDemo = document.querySelector('.close-demo');
if (closeDemo) {
    closeDemo.addEventListener('click', () => {
        document.getElementById('demoProject').classList.remove('active');
    });
}

// Простая игра на canvas
const canvas = document.getElementById('gameCanvas');
if (canvas) {
    const ctx = canvas.getContext('2d');

    let player = {
        x: 50,
        y: 200,
        width: 30,
        height: 30,
        color: '#7c3aed',
        velocityY: 0,
        jumping: false
    };

    function drawPlayer() {
        ctx.fillStyle = player.color;
        ctx.fillRect(player.x, player.y, player.width, player.height);
    }

    function updateGame() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Гравитация
        if (player.jumping) {
            player.velocityY += 0.5;
            player.y += player.velocityY;
            
            // Проверка земли
            if (player.y > 200) {
                player.y = 200;
                player.jumping = false;
                player.velocityY = 0;
            }
        }
        
        drawPlayer();
        requestAnimationFrame(updateGame);
    }

    // Управление игрой
    const moveLeft = document.getElementById('moveLeft');
    const moveRight = document.getElementById('moveRight');
    const jump = document.getElementById('jump');

    if (moveLeft) {
        moveLeft.addEventListener('click', () => {
            player.x = Math.max(0, player.x - 20);
        });
    }

    if (moveRight) {
        moveRight.addEventListener('click', () => {
            player.x = Math.min(canvas.width - player.width, player.x + 20);
        });
    }

    if (jump) {
        jump.addEventListener('click', () => {
            if (!player.jumping) {
                player.jumping = true;
                player.velocityY = -10;
            }
        });
    }

    // Запуск игры
    updateGame();
}

// Игровая страница - модальные окна для игр
document.querySelectorAll('.play-game').forEach(button => {
    button.addEventListener('click', (e) => {
        const gameCard = e.target.closest('.game-card');
        if (gameCard) {
            const game = gameCard.dataset.game;
            openGameModal(game);
        }
    });
});

function openGameModal(game) {
    const modal = document.getElementById('gameModal');
    const modalBody = document.getElementById('modalBody');
    
    let gameContent = '';
    
    switch(game) {
        case 'minecraft':
            gameContent = `
                <h3>⛏️ Minecraft Builder</h3>
                <div class="minecraft-game">
                    <div class="blocks-grid" style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px; margin: 20px 0;">
                        <div class="block" data-block="dirt" style="padding: 15px; background: #8B4513; color: white; border-radius: 5px; text-align: center; cursor: pointer;">🟫 Земля</div>
                        <div class="block" data-block="stone" style="padding: 15px; background: #696969; color: white; border-radius: 5px; text-align: center; cursor: pointer;">⬜ Камень</div>
                        <div class="block" data-block="wood" style="padding: 15px; background: #8B6914; color: white; border-radius: 5px; text-align: center; cursor: pointer;">🟫 Дерево</div>
                        <div class="block" data-block="leaf" style="padding: 15px; background: #228B22; color: white; border-radius: 5px; text-align: center; cursor: pointer;">🟩 Листва</div>
                    </div>
                    <div class="building-area" style="border: 2px dashed #ccc; padding: 20px; text-align: center; min-height: 100px; border-radius: 10px;">
                        <p>Перетащи блоки для строительства</p>
                    </div>
                </div>
            `;
            break;
        case 'brawl':
            gameContent = `
                <h3>⚔️ Brawl Stars Mini</h3>
                <div class="brawl-game">
                    <div class="brawlers" style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; margin: 20px 0;">
                        <div class="brawler" data-brawler="shelly" style="padding: 15px; background: var(--primary-color); color: white; border-radius: 10px; text-align: center; cursor: pointer;">🔫 Шелли</div>
                        <div class="brawler" data-brawler="colt" style="padding: 15px; background: var(--primary-color); color: white; border-radius: 10px; text-align: center; cursor: pointer;">🔫 Кольт</div>
                        <div class="brawler" data-brawler="bull" style="padding: 15px; background: var(--primary-color); color: white; border-radius: 10px; text-align: center; cursor: pointer;">🐂 Булл</div>
                    </div>
                    <div class="battle-area" style="border: 2px dashed #ccc; padding: 20px; text-align: center; min-height: 100px; border-radius: 10px;">
                        <p>Выбери браулера для битвы!</p>
                    </div>
                </div>
            `;
            break;
        case 'code':
            gameContent = `
                <h3>💻 Code Challenge</h3>
                <div class="code-game">
                    <p>Реши задачу:</p>
                    <div class="challenge" style="margin: 20px 0;">
                        <p style="margin-bottom: 15px;">Напиши функцию, которая возвращает сумму двух чисел</p>
                        <textarea placeholder="function sum(a, b) {\n  // Твой код здесь\n}" style="width: 100%; height: 120px; padding: 10px; border: 1px solid var(--border); border-radius: 5px; background: var(--background); color: var(--text-primary);"></textarea>
                        <button class="cta-button" style="margin-top: 15px;">Проверить</button>
                    </div>
                </div>
            `;
            break;
    }
    
    modalBody.innerHTML = gameContent;
    modal.classList.add('active');
    
    // Добавляем обработчики для элементов игры
    setTimeout(() => {
        document.querySelectorAll('.block, .brawler').forEach(element => {
            element.addEventListener('click', () => {
                showNotification('Элемент выбран! 🎮');
            });
        });
        
        document.querySelector('.cta-button')?.addEventListener('click', () => {
            showNotification('Код проверен! Отличная работа! 💪');
        });
    }, 100);
}

// Закрытие модального окна
document.querySelector('.close-modal')?.addEventListener('click', () => {
    document.getElementById('gameModal').classList.remove('active');
});

// Пасхалки
const easterItems = document.querySelectorAll('.easter-item');

easterItems.forEach(item => {
    item.addEventListener('click', () => {
        const itemType = item.dataset.item;
        findEasterEgg(itemType);
    });
});

function findEasterEgg(type) {
    const item = document.querySelector(`[data-item="${type}"]`);
    
    switch(type) {
        case 'creeper':
            item.innerHTML = '💥';
            item.classList.add('found');
            unlockAchievement('minecraft-fan');
            showNotification('Найден Крипер из Minecraft!');
            break;
        case 'brawler':
            item.innerHTML = '⚔️';
            item.classList.add('found');
            unlockAchievement('brawl-pro');
            showNotification('Браулер из Brawl Stars найден!');
            break;
        case 'coin':
            item.innerHTML = '🪙';
            item.classList.add('found');
            showNotification('Монета Super Mario найдена!');
            break;
    }
}

// Система достижений
function unlockAchievement(achievementId) {
    const achievement = document.querySelector(`[data-achievement="${achievementId}"]`);
    if (achievement && achievement.classList.contains('locked')) {
        achievement.classList.remove('locked');
        achievement.classList.add('unlocked');
        achievement.querySelector('.achievement-icon').textContent = '🏆';
        showNotification(`Достижение разблокировано: ${achievement.querySelector('h3').textContent}`);
    }
}

// Уведомления
function showNotification(message) {
    // Удаляем предыдущие уведомления
    document.querySelectorAll('.notification').forEach(notif => notif.remove());
    
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// Секретные комбинации клавиш (пасхалки)
const secretCombos = {
    'minecraft': ['m', 'i', 'n', 'e', 'c', 'r', 'a', 'f', 't'],
    'brawl': ['b', 'r', 'a', 'w', 'l'],
    'mario': ['m', 'a', 'r', 'i', 'o']
};

let keySequence = [];

document.addEventListener('keydown', (e) => {
    keySequence.push(e.key.toLowerCase());
    
    // Проверяем комбинации
    Object.entries(secretCombos).forEach(([game, combo]) => {
        if (keySequence.slice(-combo.length).join('') === combo.join('')) {
            showNotification(`Секрет ${game} активирован! 🎮`);
            keySequence = [];
        }
    });
    
    // Ограничиваем длину последовательности
    if (keySequence.length > 20) {
        keySequence = keySequence.slice(-20);
    }
});

// Обработка формы контактов
document.getElementById('contactForm')?.addEventListener('submit', (e) => {
    e.preventDefault();
    showNotification('Спасибо за ваше сообщение! Мы свяжемся с вами в ближайшее время.');
    e.target.reset();
});

// Инициализация при загрузке
document.addEventListener('DOMContentLoaded', () => {
    // Добавляем скрытые пасхалки в логотипы
    const logo = document.querySelector('.logo');
    if (logo) {
        logo.style.cursor = 'pointer';
        logo.addEventListener('click', () => {
            showNotification('Ты нашел секрет SkillSync! 🚀');
        });
    }
    
    // Закрытие модальных окон по клику вне области
    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('modal')) {
            e.target.classList.remove('active');
        }
        if (e.target.classList.contains('demo-project')) {
            e.target.classList.remove('active');
        }
    });
});