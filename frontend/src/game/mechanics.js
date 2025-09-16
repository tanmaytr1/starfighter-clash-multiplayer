// Game constants
const ARENA_WIDTH = 12000;
const ARENA_HEIGHT = 10000;
const BASE_SPEED = 10;
const BASE_ROTATION_SPEED = 3;
const AIM_ROTATION_SPEED = 0.5;
const LASER_SPEED = 35;

/**
 * Updates the player's position and direction based on keyboard input.
 * @param {object} playerState - The current state of the player.
 * @param {object} keys - The current state of pressed keys.
 * @returns {object} The updated player state.
 */
export function updatePlayer(playerState, keys) {
    let { x, y, direction } = playerState;
    const isBoosting = keys['b'];
    const isPrecisionMode = keys['Shift'];
    const currentSpeed = isBoosting ? BASE_SPEED * 1.7 : BASE_SPEED;
    const rotationSpeed = isPrecisionMode ? AIM_ROTATION_SPEED : BASE_ROTATION_SPEED;

    if (keys.a) direction -= rotationSpeed;
    if (keys.d) direction += rotationSpeed;

    const rad = (direction - 90) * Math.PI / 180;
    if (keys.w) {
        x += Math.cos(rad) * currentSpeed;
        y += Math.sin(rad) * currentSpeed;
    }
    if (keys.s) {
        x -= Math.cos(rad) * currentSpeed;
        y -= Math.sin(rad) * currentSpeed;
    }
    
    // Boundary checks
    x = Math.max(0, Math.min(x, ARENA_WIDTH));
    y = Math.max(0, Math.min(y, ARENA_HEIGHT));

    return { ...playerState, x, y, direction, isBoosting, isPrecisionMode };
}

/**
 * Updates the positions of all active lasers.
 * @param {array} lasers - An array of laser objects.
 * @returns {array} A new array with updated laser positions, and old lasers removed.
 */
export function updateLasers(lasers) {
    return lasers.map(l => ({
        ...l,
        x: l.x + Math.cos(l.rad) * LASER_SPEED,
        y: l.y + Math.sin(l.rad) * LASER_SPEED,
    })).filter(l => l.x > 0 && l.x < ARENA_WIDTH && l.y > 0 && l.y < ARENA_HEIGHT);
}

/**
 * Creates a new laser shot based on the player's current state.
 * @param {object} playerState - The current state of the player.
 * @returns {array} An array containing two new laser objects.
 */
export function createLaser(playerState) {
    const { x, y, direction } = playerState;
    const rad = (direction - 90) * Math.PI / 180;
    const perpRad = rad + Math.PI / 2;
    const spacing = 25;

    return [
        { x: x + Math.cos(perpRad) * spacing, y: y + Math.sin(perpRad) * spacing, rad },
        { x: x - Math.cos(perpRad) * spacing, y: y - Math.sin(perpRad) * spacing, rad },
    ];
}