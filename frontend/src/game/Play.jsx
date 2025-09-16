import React, { useRef, useEffect, useState } from 'react';
import { setupInputHandling, getKeys } from './helpers/inputHandler';
import { startLoop, stopLoop } from './helpers/gameLoop';
import { updatePlayer, updateLasers, createLaser } from './mechanics';
import '../assets/styles/game.css';

import shipImgSrc from '../assets/starfighter.png';
import shipBoostImgSrc from '../assets/starfighterWboost.png';
import shipXBoostImgSrc from '../assets/starfighterWXboost.png';

const ARENA_WIDTH = 12000;
const ARENA_HEIGHT = 10000;

const Play = () => {
    const canvasRef = useRef(null);
    const contextRef = useRef(null);
    const images = useRef({});
    const [stars, setStars] = useState([]);
    const [playerState, setPlayerState] = useState({
        x: ARENA_WIDTH / 2,
        y: ARENA_HEIGHT / 2,
        direction: 0,
        isBoosting: false,
        isZoomedOut: false,
        isPrecisionMode: false,
    });
    const [lasers, setLasers] = useState([]);

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        contextRef.current = ctx;

        const handleResize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };
        window.addEventListener('resize', handleResize);

        const generatedStars = [];
        for (let i = 0; i < 5000; i++) {
            generatedStars.push({
                x: Math.random() * ARENA_WIDTH,
                y: Math.random() * ARENA_HEIGHT,
                r: Math.random() * 2 + 1,
                a: Math.random() * 0.5 + 0.5
            });
        }
        setStars(generatedStars);

        images.current.ship = new Image();
        images.current.ship.src = shipImgSrc;
        images.current.shipBoost = new Image();
        images.current.shipBoost.src = shipBoostImgSrc;
        images.current.shipXBoost = new Image();
        images.current.shipXBoost.src = shipXBoostImgSrc;

        setupInputHandling();

        const update = () => {
            const currentKeys = getKeys();

            // Update player using the imported function
            setPlayerState(prev => updatePlayer(prev, currentKeys));

            // Update lasers using the imported function
            setLasers(prevLasers => updateLasers(prevLasers));
        };

        const draw = () => {
            const ctx = contextRef.current;
            if (!ctx) return;
            const { x, y, direction, isBoosting, isZoomedOut } = playerState;
            const { ship, shipBoost, shipXBoost } = images.current;

            ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
            const zoom = isZoomedOut ? 0.6 : 1;
            const offsetX = Math.min(0, Math.max(window.innerWidth - ARENA_WIDTH * zoom, -x * zoom + window.innerWidth / 2));
            const offsetY = Math.min(0, Math.max(window.innerHeight - ARENA_HEIGHT * zoom, -y * zoom + window.innerHeight / 2));

            ctx.save();
            ctx.scale(zoom, zoom);
            ctx.translate(offsetX / zoom, offsetY / zoom);

            ctx.fillStyle = '#fff';
            for (const s of stars) {
                ctx.globalAlpha = s.a;
                ctx.beginPath();
                ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
                ctx.fill();
            }
            ctx.globalAlpha = 1.0;

            ctx.strokeStyle = '#444';
            ctx.setLineDash([20, 10]);
            ctx.strokeRect(0, 0, ARENA_WIDTH, ARENA_HEIGHT);
            ctx.setLineDash([]);

            ctx.fillStyle = '#ff00ea';
            lasers.forEach(l => {
                ctx.save();
                ctx.translate(l.x, l.y);
                ctx.rotate(l.rad - Math.PI / 2);
                ctx.fillRect(-2.5, -30, 5, 35);
                ctx.restore();
            });

            ctx.save();
            ctx.translate(x, y);
            ctx.rotate((direction * Math.PI) / 180);
            const img = isBoosting ? shipXBoost : shipBoost;
            if (img && img.complete) {
                ctx.drawImage(img, -35, -40, 70, 80);
            }
            ctx.restore();

            ctx.restore();
        };

        startLoop(update, draw);

        return () => {
            stopLoop();
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    useEffect(() => {
        const shootInterval = setInterval(() => {
            if (getKeys()[' ']) {
                const newLasers = createLaser(playerState);
                setLasers(prevLasers => [...prevLasers, ...newLasers]);
            }
        }, 130);

        return () => clearInterval(shootInterval);
    }, [playerState]);

    return (
        <div className="game-container">
            <canvas ref={canvasRef}></canvas>
        </div>
    );
};

export default Play;