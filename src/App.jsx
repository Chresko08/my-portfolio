import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Experience from './components/Experience';
import Certificates from './components/Certificates';
import Contact from './components/Contact';
import BackToTop from './components/BackToTop';

function App() {
    const [theme, setTheme] = useState('dark');
    // viewMode can be 'all', 'recruiter', or 'technical'. Defaulting to technical as requested.
    const [viewMode, setViewMode] = useState('technical');

    const toggleTheme = () => {
        const newTheme = theme === 'dark' ? 'light' : 'dark';
        setTheme(newTheme);
        document.documentElement.setAttribute('data-theme', newTheme);
    };

    useEffect(() => {
        document.documentElement.setAttribute('data-theme', theme);
        // Check local storage for viewMode preference
        const savedViewMode = localStorage.getItem('portfolioViewMode');
        if (savedViewMode) {
            setViewMode(savedViewMode);
        }
    }, [theme]);

    const handleViewModeChange = (mode) => {
        setViewMode(mode);
        localStorage.setItem('portfolioViewMode', mode);
    };

    return (
        <div className="app">
            <Navbar theme={theme} toggleTheme={toggleTheme} viewMode={viewMode} setViewMode={handleViewModeChange} />
            <main>
                <Hero />
                <Experience viewMode={viewMode} />
                <Certificates />
                <Contact viewMode={viewMode} />
            </main>
            <BackToTop />
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
