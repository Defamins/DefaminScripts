// Настройки
const MAX_DISTANCE = 2500;
const DISTANCE_COEFFICIENT = 1000;
const OFFSET_COEFFICIENT = 0.5;

// Функция поиска ближайшего игрока
function findNearestPlayer(myPlayer) {
    let closest = null;
    let minDist = MAX_DISTANCE;
    const players = GetAllTargets.players; // Внутренний объект игры
    
    for (const id in players) {
        const p = players[id];
        // Пропускаем себя и неактивных
        if (p.id === World.PLAYER.id || !p.active) continue;
        
        const dist = Math.hypot(myPlayer.x - p.x, myPlayer.y - p.y);
        if (dist < minDist) {
            minDist = dist;
            closest = p;
        }
    }
    return closest;
}

// Главный цикл
setInterval(() => {
    try {
        // 1. Получаем своего игрока
        const myPlayer = GetAllTargets.getPlayerById(World.PLAYER.id);
        if (!myPlayer || myPlayer.x < 0) return;

        // 2. Ищем цель
        const target = findNearestPlayer(myPlayer);
        if (!target) return;

        // 3. Упреждение (предсказание позиции)
        const distance = Math.hypot(myPlayer.x - target.x, myPlayer.y - target.y);
        const factor = distance / DISTANCE_COEFFICIENT + OFFSET_COEFFICIENT;
        
        const targetX = target.prevX[0] === -1 
            ? target.x 
            : target.x + factor * (target.x - target.prevX[0]);
        const targetY = target.prevY[0] === -1 
            ? target.y 
            : target.y + factor * (target.y - target.prevY[0]);

        // 4. Считаем угол и отправляем
        const angle = Math.atan2(targetY - myPlayer.y, targetX - myPlayer.x) * (180 / Math.PI);
        sendMouseAngle(angle); // Внутренняя функция игры

    } catch (e) {
        console.error("Aimbot error:", e);
    }
}, 50); // 20 раз в секунду
