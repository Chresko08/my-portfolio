import React from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Experience from './components/Experience';
import Certificates from './components/Certificates';
import Contact from './components/Contact';
import BackToTop from './components/BackToTop';

function App() {
    return (
        <div className="app">
            <Navbar />
            <main>
                <Hero />
                <About />
                <Experience />
                <Certificates />
                <Contact />
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
                    {import.meta.env.VITE_LAST_UPDATED && (
                        <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '6px', opacity: 0.8 }}>
                            Last Updated: {import.meta.env.VITE_LAST_UPDATED}
                        </p>
                    )}
                </div>
            </footer>
        </div>
    );
}

export default App;
