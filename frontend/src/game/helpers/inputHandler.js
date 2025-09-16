const keys = {};

export function setupInputHandling() {
    document.addEventListener('keydown', (e) => {
        keys[e.key] = true;
    });

    document.addEventListener('keyup', (e) => {
        keys[e.key] = false;
    });
}

export function isKeyPressed(key) {
    return !!keys[key];
}

export function getKeys() {
    return keys;
}