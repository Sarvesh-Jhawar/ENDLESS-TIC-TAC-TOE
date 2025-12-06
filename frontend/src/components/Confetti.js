import React, { useEffect, useState } from 'react';

const Confetti = ({ isActive, duration = 3000 }) => {
    const [particles, setParticles] = useState([]);

    useEffect(() => {
        if (!isActive) {
            setParticles([]);
            return;
        }

        // Generate confetti particles
        const newParticles = [];
        const colors = [
            '#ef4444', // red
            '#3b82f6', // blue
            '#ec4899', // pink
            '#a855f7', // purple
            '#eab308', // yellow
            '#22c55e', // green
            '#f97316', // orange
        ];

        for (let i = 0; i < 100; i++) {
            newParticles.push({
                id: i,
                x: 50 + (Math.random() - 0.5) * 20, // Center with spread
                y: 50,
                color: colors[Math.floor(Math.random() * colors.length)],
                size: Math.random() * 10 + 5,
                speedX: (Math.random() - 0.5) * 15,
                speedY: Math.random() * -15 - 5,
                rotation: Math.random() * 360,
                rotationSpeed: (Math.random() - 0.5) * 20,
                shape: Math.random() > 0.5 ? 'circle' : 'square',
            });
        }

        setParticles(newParticles);

        // Clear after duration
        const timer = setTimeout(() => {
            setParticles([]);
        }, duration);

        return () => clearTimeout(timer);
    }, [isActive, duration]);

    if (!isActive || particles.length === 0) return null;

    return (
        <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
            {particles.map((particle) => (
                <div
                    key={particle.id}
                    className="absolute animate-confetti"
                    style={{
                        left: `${particle.x}%`,
                        top: `${particle.y}%`,
                        width: `${particle.size}px`,
                        height: `${particle.size}px`,
                        backgroundColor: particle.color,
                        borderRadius: particle.shape === 'circle' ? '50%' : '2px',
                        transform: `rotate(${particle.rotation}deg)`,
                        '--speed-x': `${particle.speedX}vw`,
                        '--speed-y': `${particle.speedY}vh`,
                        '--rotation-speed': `${particle.rotationSpeed}deg`,
                        boxShadow: `0 0 6px ${particle.color}`,
                    }}
                />
            ))}
        </div>
    );
};

export default Confetti;
