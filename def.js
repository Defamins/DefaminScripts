// ==UserScript==
// @name         My Devast Aimbot
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  пробую сделать аим для деваста
// @match        *://*.devast.io/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // Ждем, пока игра загрузит нужные объекты
    const waitForGame = setInterval(() => {
        if (typeof World !== 'undefined' && typeof GetAllTargets !== 'undefined' && World.PLAYER) {
            clearInterval(waitForGame);
            startAimbot();
        }
    }, 500);

    function startAimbot() {
        // Настройки твоего аима
        const MAX_DISTANCE = 2500;
        
        function findNearestPlayer(myPlayer) {
            let closest = null;
            let minDist = MAX_DISTANCE;
            // Используем внутренний объект игры
            const players = GetAllTargets.players;
            if (!players) return null;

            for (const pid in players) {
                const p = players[pid];
                if (p.id === myPlayer.id || !p.active) continue;
                const dist = Math.hypot(myPlayer.x - p.x, myPlayer.y - p.y);
                if (dist < minDist) {
                    minDist = dist;
                    closest = p;
                }
            }
            return closest;
        }

        // Цикл аима
        setInterval(() => {
            try {
                const myPlayer = GetAllTargets.getPlayerById(World.PLAYER.id);
                if (!myPlayer) return;
                const target = findNearestPlayer(myPlayer);
                if (!target) return;

                // Упреждение (как в готовых модах)
                const distance = Math.hypot(myPlayer.x - target.x, myPlayer.y - target.y);
                const coefficient = distance / 1000 + 0.5; // Коэффициенты можно подбирать
                const targetX = target.prevX[0] === -1 ? target.x : target.x + coefficient * (target.x - target.prevX[0]);
                const targetY = target.prevY[0] === -1 ? target.y : target.y + coefficient * (target.y - target.prevY[0]);

                const angle = Math.atan2(targetY - myPlayer.y, targetX - myPlayer.x) * (180 / Math.PI);
                // Внутренняя функция для поворота мыши
                if (typeof sendMouseAngle === 'function') {
                    sendMouseAngle(angle);
                }
            } catch (e) {
                console.error('Aimbot error:', e);
            }
        }, 50);
    }
})();