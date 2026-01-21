
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google'
import { AlertCircle } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import './SessionExpiredModal.css'

interface SessionExpiredModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || '282021051502-09vacaqf3avjaa4utjv1c9laetcq2jbf.apps.googleusercontent.com'

export function SessionExpiredModal({ isOpen, onClose }: SessionExpiredModalProps) {
    const { login } = useAuth();

    if (!isOpen) return null;

    return (
        <div className="session-expired-overlay">
            <div className="session-expired-modal">
                <div className="modal-icon">
                    <AlertCircle size={32} />
                </div>
                <h2>Session Expired</h2>
                <p>Your security session has timed out. Please sign in again to continue your progress.</p>

                <div className="modal-actions">
                    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
                        <GoogleLogin
                            onSuccess={credentialResponse => {
                                if (credentialResponse.credential) {
                                    login(credentialResponse.credential);
                                    onClose(); // Close modal on success
                                }
                            }}
                            onError={() => {
                                console.error('Re-authentication failed');
                            }}
                            auto_select={true} // Try to auto-select if possible
                        />
                    </GoogleOAuthProvider>
                </div>
            </div>
        </div>
    );
}
