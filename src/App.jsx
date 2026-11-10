import React, { useState, useEffect, lazy, Suspense } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Experience from './components/Experience';
import Certificates from './components/Certificates';
import Contact from './components/Contact';
import BackToTop from './components/BackToTop';

// Code-split heavy interactive and private components
const InterviewPrep = lazy(() => import('./components/InterviewPrep'));
const CareerLineage = lazy(() => import('./components/CareerLineage'));
const PasswordModal = lazy(() => import('./components/PasswordModal'));

// Lightweight section loader fallback
const SectionLoader = () => (
    <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '60px 20px',
        color: 'var(--text-muted)',
        fontSize: '0.9rem'
    }}>
        <div style={{
            width: '24px',
            height: '24px',
            border: '2px solid var(--card-border)',
            borderTopColor: 'var(--primary-color)',
            borderRadius: '50%',
            animation: 'spin 0.8s linear infinite',
            marginRight: '12px'
        }} />
        Loading section...
    </div>
);

const STORAGE_KEYS = {
    DECRYPTED_DATA: 'portfolioDecryptedData',
    REMEMBERED_TOKEN: 'portfolioRememberedToken',
    AUTHENTICATED: 'portfolioAuthenticated',
    ACTIVE_MODE: 'portfolioActiveMode'
};

const encodeToken = (str) =>
    btoa(Array.from(new TextEncoder().encode(str), (b) => String.fromCharCode(b)).join(''));

const decodeToken = (b64) =>
    new TextDecoder().decode(Uint8Array.from(atob(b64), (c) => c.charCodeAt(0)));

function App() {
    const [theme, setTheme] = useState('dark');
    // viewMode: 'general' (public) or 'personal' (password-protected 'For Me')
    const [viewMode, setViewMode] = useState('general');
    const [decryptedData, setDecryptedData] = useState(null);
    const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);

    const toggleTheme = () => {
        const newTheme = theme === 'dark' ? 'light' : 'dark';
        setTheme(newTheme);
    };

    // Synchronize HTML data-theme attribute
    useEffect(() => {
        document.documentElement.setAttribute('data-theme', theme);
    }, [theme]);

    const clearStoredAuth = () => {
        sessionStorage.removeItem(STORAGE_KEYS.DECRYPTED_DATA);
        localStorage.removeItem(STORAGE_KEYS.DECRYPTED_DATA);
        localStorage.removeItem(STORAGE_KEYS.REMEMBERED_TOKEN);
        localStorage.removeItem(STORAGE_KEYS.AUTHENTICATED);
        localStorage.removeItem(STORAGE_KEYS.ACTIVE_MODE);
    };

    const decryptWithRememberedToken = async () => {
        const token = localStorage.getItem(STORAGE_KEYS.REMEMBERED_TOKEN);
        if (!token) return null;

        try {
            const password = decodeToken(token);
            const [{ default: encryptedLineage }, { decryptLineagePayload }] = await Promise.all([
                import('./data/encryptedLineage.json'),
                import('./utils/crypto')
            ]);
            const data = await decryptLineagePayload(password, encryptedLineage);
            if (data && data.lineageItems) {
                const serialized = JSON.stringify(data);
                sessionStorage.setItem(STORAGE_KEYS.DECRYPTED_DATA, serialized);
                localStorage.setItem(STORAGE_KEYS.DECRYPTED_DATA, serialized);
                localStorage.setItem(STORAGE_KEYS.AUTHENTICATED, 'true');
                return data;
            }
        } catch (err) {
            // Remembered token failed (e.g., password changed) -> clear stale auth
            clearStoredAuth();
        }
        return null;
    };

    // Restore remembered authentication and decrypted data across browser sessions
    useEffect(() => {
        const restoreAccess = async () => {
            try {
                const { default: encryptedLineage } = await import('./data/encryptedLineage.json');
                const savedMode = localStorage.getItem(STORAGE_KEYS.ACTIVE_MODE);
                const isRememberedAuth = localStorage.getItem(STORAGE_KEYS.AUTHENTICATED) === 'true';

                const cachedRaw =
                    sessionStorage.getItem(STORAGE_KEYS.DECRYPTED_DATA) ||
                    localStorage.getItem(STORAGE_KEYS.DECRYPTED_DATA);

                if (cachedRaw) {
                    const parsed = JSON.parse(cachedRaw);
                    const isFresh =
                        !encryptedLineage?.encryptedAt ||
                        parsed?.encryptedAt === encryptedLineage.encryptedAt;

                    if (isFresh && parsed?.lineageItems?.length > 0) {
                        setDecryptedData(parsed);
                        if (savedMode === 'personal' || (isRememberedAuth && savedMode !== 'general')) {
                            setViewMode('personal');
                        }
                        return;
                    }
                    // Stale cache -> clear data caches before silent re-decryption
                    sessionStorage.removeItem(STORAGE_KEYS.DECRYPTED_DATA);
                    localStorage.removeItem(STORAGE_KEYS.DECRYPTED_DATA);
                }

                // Silently re-decrypt latest encrypted payload if device is remembered
                const freshData = await decryptWithRememberedToken();
                if (freshData) {
                    setDecryptedData(freshData);
                    if (savedMode === 'personal' || (isRememberedAuth && savedMode !== 'general')) {
                        setViewMode('personal');
                    }
                }
            } catch (e) {
                sessionStorage.removeItem(STORAGE_KEYS.DECRYPTED_DATA);
                localStorage.removeItem(STORAGE_KEYS.DECRYPTED_DATA);
            }
        };
        restoreAccess();
    }, []);

    const handleAuthenticate = async (password, rememberDevice) => {
        try {
            // Dynamically import ciphertext payload and Web Crypto decryptor on-demand
            const [{ default: encryptedLineage }, { decryptLineagePayload }] = await Promise.all([
                import('./data/encryptedLineage.json'),
                import('./utils/crypto')
            ]);
            const data = await decryptLineagePayload(password, encryptedLineage);
            if (data && data.lineageItems) {
                const serialized = JSON.stringify(data);
                setDecryptedData(data);
                setViewMode('personal');
                sessionStorage.setItem(STORAGE_KEYS.DECRYPTED_DATA, serialized);
                localStorage.setItem(STORAGE_KEYS.ACTIVE_MODE, 'personal');

                if (rememberDevice) {
                    localStorage.setItem(STORAGE_KEYS.DECRYPTED_DATA, serialized);
                    localStorage.setItem(STORAGE_KEYS.REMEMBERED_TOKEN, encodeToken(password));
                    localStorage.setItem(STORAGE_KEYS.AUTHENTICATED, 'true');
                } else {
                    localStorage.removeItem(STORAGE_KEYS.DECRYPTED_DATA);
                    localStorage.removeItem(STORAGE_KEYS.REMEMBERED_TOKEN);
                    localStorage.removeItem(STORAGE_KEYS.AUTHENTICATED);
                }
                return true;
            }
            return false;
        } catch (err) {
            console.error("Authentication / Decryption failed:", err);
            return false;
        }
    };

    const handleLockDevice = () => {
        setDecryptedData(null);
        clearStoredAuth();
        setViewMode('general');
    };

    const handleRefreshData = async () => {
        sessionStorage.removeItem(STORAGE_KEYS.DECRYPTED_DATA);
        localStorage.removeItem(STORAGE_KEYS.DECRYPTED_DATA);
        const freshData = await decryptWithRememberedToken();
        if (freshData) {
            setDecryptedData(freshData);
        } else {
            setDecryptedData(null);
            setIsPasswordModalOpen(true);
        }
    };

    const handleViewModeChange = async (mode) => {
        if (mode === 'personal') {
            if (decryptedData) {
                setViewMode('personal');
                localStorage.setItem(STORAGE_KEYS.ACTIVE_MODE, 'personal');
            } else {
                const freshData = await decryptWithRememberedToken();
                if (freshData) {
                    setDecryptedData(freshData);
                    setViewMode('personal');
                    localStorage.setItem(STORAGE_KEYS.ACTIVE_MODE, 'personal');
                } else {
                    setIsPasswordModalOpen(true);
                }
            }
        } else {
            setViewMode('general');
            localStorage.setItem(STORAGE_KEYS.ACTIVE_MODE, 'general');
        }
    };

    return (
        <div className="app">
            <Navbar
                theme={theme}
                toggleTheme={toggleTheme}
                viewMode={viewMode}
                setViewMode={handleViewModeChange}
                onOpenPasswordModal={() => handleViewModeChange('personal')}
                hasDecryptedData={!!decryptedData}
            />
            <main>
                <Hero />
                {viewMode === 'personal' ? (
                    <Suspense fallback={<SectionLoader />}>
                        <CareerLineage
                            data={decryptedData}
                            onLockDevice={handleLockDevice}
                            onUnlockRequest={() => handleViewModeChange('personal')}
                            onRefreshData={handleRefreshData}
                        />
                    </Suspense>
                ) : (
                    <>
                        <Experience viewMode={viewMode} />
                        <Certificates />
                    </>
                )}
                <Suspense fallback={<SectionLoader />}>
                    <InterviewPrep viewMode={viewMode} />
                </Suspense>
                <Contact viewMode={viewMode} />
            </main>
            <BackToTop />

            {/* Zero-Knowledge Decryption Modal */}
            <Suspense fallback={null}>
                <PasswordModal
                    isOpen={isPasswordModalOpen}
                    onClose={() => setIsPasswordModalOpen(false)}
                    onAuthenticate={handleAuthenticate}
                />
            </Suspense>

            <footer>
                <div className="container" style={{
                    textAlign: 'center',
                    padding: '50px 20px 40px',
                    color: 'var(--text-secondary)',
                    borderTop: '1px solid var(--card-border)'
                }}>
                    <p style={{ marginBottom: '8px', fontSize: '0.95rem' }}>
                        &copy; {new Date().getFullYear()} <strong style={{ color: 'var(--text-primary)' }}>Shubham Srivastava</strong>. All rights reserved.
                    </p>
                    <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                        ✨ Designed & Developed by AI Using Google Antigravity (Google DeepMind)
                    </p>
                    {import.meta.env.VITE_LAST_UPDATED ? (
                        <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '6px', opacity: 0.8 }}>
                            Last Updated: {new Date(import.meta.env.VITE_LAST_UPDATED).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) !== 'Invalid Date' ? new Date(import.meta.env.VITE_LAST_UPDATED).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : import.meta.env.VITE_LAST_UPDATED}
                        </p>
                    ) : (
                        <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '6px', opacity: 0.8 }}>
                            Last Updated: {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                        </p>
                    )}
                </div>
            </footer>
        </div>
    );
}

export default App;
