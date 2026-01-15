import { useState, useEffect } from 'react';
import { X, Heart, LogIn } from 'lucide-react';
import './SignInToast.css';

interface SignInToastProps {
    onSignIn: () => void;
    onDismiss: () => void;
}

export function SignInToast({ onSignIn, onDismiss }: SignInToastProps) {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        // Animate in
        const timer = setTimeout(() => setIsVisible(true), 100);
        return () => clearTimeout(timer);
    }, []);

    const handleDismiss = () => {
        setIsVisible(false);
        setTimeout(onDismiss, 300); // Wait for animation
    };

    return (
        <div className={`sign-in-toast ${isVisible ? 'visible' : ''}`}>
            <div className="toast-icon">
                <Heart size={24} />
            </div>

            <div className="toast-content">
                <h4>Getting helpful answers?</h4>
                <p>
                    Sign in to get personalized support based on where you are in your journey.
                </p>
            </div>

            <div className="toast-actions">
                <button className="btn-primary" onClick={onSignIn}>
                    <LogIn size={16} />
                    Sign In
                </button>
                <button className="btn-ghost" onClick={handleDismiss}>
                    Maybe Later
                </button>
            </div>

            <button className="toast-close" onClick={handleDismiss} aria-label="Dismiss">
                <X size={16} />
            </button>
        </div>
    );
}
