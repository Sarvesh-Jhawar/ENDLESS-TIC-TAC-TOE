import React from 'react';
import { useSound } from '../contexts/SoundContext';

const SoundButton = ({ style = {} }) => {
    const { isMuted, toggleSound, playSound } = useSound();

    const handleClick = () => {
        toggleSound();
        if (isMuted) {
            // Will unmute, play a sound to confirm
            playSound('toggle');
        }
    };

    return (
        <button
            onClick={handleClick}
            style={{
                position: 'fixed',
                top: '20px',
                right: '20px',
                width: '50px',
                height: '50px',
                borderRadius: '50%',
                background: isMuted
                    ? 'rgba(239, 68, 68, 0.2)'
                    : 'rgba(34, 197, 94, 0.2)',
                border: `2px solid ${isMuted ? '#ef4444' : '#22c55e'}`,
                color: isMuted ? '#ef4444' : '#22c55e',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.5rem',
                transition: 'all 0.3s ease',
                zIndex: 9999,
                backdropFilter: 'blur(10px)',
                boxShadow: isMuted
                    ? '0 0 15px rgba(239, 68, 68, 0.3)'
                    : '0 0 15px rgba(34, 197, 94, 0.3)',
                ...style
            }}
            onMouseEnter={(e) => {
                e.target.style.transform = 'scale(1.1)';
                if (!isMuted) playSound('hover');
            }}
            onMouseLeave={(e) => {
                e.target.style.transform = 'scale(1)';
            }}
            title={isMuted ? 'Unmute Sound' : 'Mute Sound'}
        >
            {isMuted ? '🔇' : '🔊'}
        </button>
    );
};

export default SoundButton;
