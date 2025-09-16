let lastTime = 0;
let loopInstance = null;
let updateCallback = null;
let drawCallback = null;

function gameLoop(time) {
    const deltaTime = time - lastTime;
    lastTime = time;

    if (updateCallback) updateCallback(deltaTime);
    if (drawCallback) drawCallback();

    loopInstance = requestAnimationFrame(gameLoop);
}

export function startLoop(update, draw) {
    updateCallback = update;
    drawCallback = draw;
    lastTime = performance.now();
    loopInstance = requestAnimationFrame(gameLoop);
}

export function stopLoop() {
    if (loopInstance) {
        cancelAnimationFrame(loopInstance);
    }
}