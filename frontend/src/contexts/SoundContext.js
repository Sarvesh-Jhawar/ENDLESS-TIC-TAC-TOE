import React, { createContext, useContext, useState, useEffect } from 'react';
import soundManager from '../utils/SoundManager';

// Create context
const SoundContext = createContext();

// Provider component
export const SoundProvider = ({ children }) => {
    const [isMuted, setIsMuted] = useState(soundManager.getMuted());

    // Initialize sound on first user interaction
    useEffect(() => {
        const initSound = () => {
            soundManager.init();
            window.removeEventListener('click', initSound);
            window.removeEventListener('touchstart', initSound);
        };

        window.addEventListener('click', initSound);
        window.addEventListener('touchstart', initSound);

        return () => {
            window.removeEventListener('click', initSound);
            window.removeEventListener('touchstart', initSound);
        };
    }, []);

    const toggleSound = () => {
        const newMuted = soundManager.toggleMute();
        setIsMuted(newMuted);
    };

    const playSound = (soundName) => {
        soundManager.play(soundName);
    };

    return (
        <SoundContext.Provider value={{ isMuted, toggleSound, playSound }}>
            {children}
        </SoundContext.Provider>
    );
};

// Hook to use sound
export const useSound = () => {
    const context = useContext(SoundContext);
    if (!context) {
        throw new Error('useSound must be used within SoundProvider');
    }
    return context;
};

export default SoundContext;
