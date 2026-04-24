import { useRef, useEffect, useMemo } from 'react';
import { useScroll } from 'framer-motion';

export default function AppleVisual() {
    const canvasRef = useRef(null);
    const { scrollY } = useScroll();

    // Generate specific noise texture for organic feel
    const noiseTexture = useMemo(() => {
        if (typeof document === 'undefined') return null;
        const cvs = document.createElement('canvas');
        cvs.width = 200;
        cvs.height = 200;
        const ctx = cvs.getContext('2d');
        const imgData = ctx.createImageData(200, 200);
        const data = imgData.data;

        for (let i = 0; i < data.length; i += 4) {
            const val = Math.random() * 255;
            data[i] = val;     // r
            data[i + 1] = val; // g
            data[i + 2] = val; // b
            data[i + 3] = 30;  // alpha (very subtle)
        }
        ctx.putImageData(imgData, 0, 0);
        return cvs;
    }, []);

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        let animationFrameId;
        const startTime = Date.now();

        const render = () => {
            // --- 0. Setup & Layout ---
            const rect = canvas.getBoundingClientRect();
            const dpr = window.devicePixelRatio || 1;

            // Smart resize
            if (canvas.width !== rect.width * dpr || canvas.height !== rect.height * dpr) {
                canvas.width = rect.width * dpr;
                canvas.height = rect.height * dpr;
            }

            // Reset transform for clean slate each frame
            ctx.setTransform(1, 0, 0, 1, 0, 0);
            ctx.scale(dpr, dpr);

            const width = rect.width;
            const height = rect.height;
            const centerX = width / 2;
            const centerY = height / 2;

            ctx.clearRect(0, 0, width, height);

            // --- 1. Animation State ---
            const now = Date.now();
            const time = (now - startTime) / 1000;
            const scrollPos = scrollY.get();

            // Calming, deep breath cycle (8 seconds)
            // Sine wave mapped to [0, 1]
            const breathCycle = (Math.sin(time * (Math.PI * 2) / 8) + 1) / 2;

            // Scroll influence: Higher scroll = smaller, dimmer orb (Focus moves to content)
            const scrollFactor = Math.max(0, 1 - scrollPos / 600); // 1 -> 0

            // --- 2. The Living Orb ---

            // Properties
            const baseRadius = Math.min(width, height) * 0.35;
            // Scale: 1.0 -> 1.03
            const scale = 1 + (breathCycle * 0.03);
            const currentRadius = baseRadius * scale * (0.8 + 0.2 * scrollFactor);

            // Drifting inner core (Subtle movement)
            const driftX = Math.sin(time * 0.5) * (currentRadius * 0.1);
            const driftY = Math.cos(time * 0.3) * (currentRadius * 0.1);

            // Draw Gradient Orb
            ctx.save();
            ctx.translate(centerX, centerY);

            // createRadialGradient(x0, y0, r0, x1, y1, r1)
            // Shift the start circle slightly for "living" feel
            const gradient = ctx.createRadialGradient(
                driftX, driftY, 0,
                0, 0, currentRadius
            );

            // Premium Health Palette
            // Core: Not white, but pale luminous green. Avoids harshness.
            gradient.addColorStop(0, 'rgba(180, 255, 200, 0.9)');
            // Body: Rich Healthify Green
            gradient.addColorStop(0.4, 'rgba(74, 222, 128, 0.8)');
            // Edge: Fade out smoothly
            gradient.addColorStop(1, 'rgba(74, 222, 128, 0)');

            ctx.fillStyle = gradient;
            ctx.beginPath();
            ctx.arc(0, 0, currentRadius, 0, Math.PI * 2);
            ctx.fill();

            // --- 3. Texture Overlay (Grain) ---
            // This adds the "premium/tactile" feel, removing digital flatness
            if (noiseTexture) {
                ctx.globalCompositeOperation = 'overlay';
                ctx.globalAlpha = 0.08 * scrollFactor; // Fade grain with scroll too

                // Create pattern from noise canvas
                const pattern = ctx.createPattern(noiseTexture, 'repeat');
                ctx.fillStyle = pattern;
                ctx.fillRect(-width / 2, -height / 2, width, height); // Fill coverage
            }

            ctx.restore();

            // --- 4. Loop ---
            animationFrameId = requestAnimationFrame(render);
        };

        render();

        return () => cancelAnimationFrame(animationFrameId);
    }, [scrollY, noiseTexture]);

    return (
        <canvas
            ref={canvasRef}
            className="w-full h-[60vh] md:h-full"
            style={{ touchAction: 'none' }}
        />
    );
}
