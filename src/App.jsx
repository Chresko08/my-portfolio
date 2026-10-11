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

    // Check session cache on initial mount
    useEffect(() => {
        try {
            const cached = sessionStorage.getItem('portfolioDecryptedData');
            if (cached) {
                const parsed = JSON.parse(cached);
                if (parsed?.lineageItems?.length > 0) {
                    setDecryptedData(parsed);
                    const savedMode = localStorage.getItem('portfolioActiveMode');
                    if (savedMode === 'personal') {
                        setViewMode('personal');
                    }
                }
            }
        } catch (e) {
            sessionStorage.removeItem('portfolioDecryptedData');
        }
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
                setDecryptedData(data);
                setViewMode('personal');
                localStorage.setItem('portfolioActiveMode', 'personal');
                if (rememberDevice) {
                    sessionStorage.setItem('portfolioDecryptedData', JSON.stringify(data));
                    localStorage.setItem('portfolioAuthenticated', 'true');
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
        sessionStorage.removeItem('portfolioDecryptedData');
        localStorage.removeItem('portfolioAuthenticated');
        localStorage.removeItem('portfolioActiveMode');
        setViewMode('general');
    };

    const handleViewModeChange = (mode) => {
        if (mode === 'personal') {
            if (decryptedData) {
                setViewMode('personal');
                localStorage.setItem('portfolioActiveMode', 'personal');
            } else {
                setIsPasswordModalOpen(true);
            }
        } else {
            setViewMode('general');
            localStorage.setItem('portfolioActiveMode', 'general');
        }
    };

    return (
        <div className="app">
            <Navbar
                theme={theme}
                toggleTheme={toggleTheme}
                viewMode={viewMode}
                setViewMode={handleViewModeChange}
                onOpenPasswordModal={() => setIsPasswordModalOpen(true)}
                hasDecryptedData={!!decryptedData}
            />
            <main>
                <Hero />
                {viewMode === 'personal' ? (
                    <Suspense fallback={<SectionLoader />}>
                        <CareerLineage
                            data={decryptedData}
                            onLockDevice={handleLockDevice}
                            onUnlockRequest={() => setIsPasswordModalOpen(true)}
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
