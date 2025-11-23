import React from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Experience from './components/Experience';
import Projects from './components/Projects';
import Certificates from './components/Certificates';
import Contact from './components/Contact';

function App() {
    return (
        <div className="app">
            <Navbar />
            <main>
                <Hero />
                <About />
                <Experience />
                <Projects />
                <Certificates />
                <Contact />
            </main>
            <footer>
                <div className="container" style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--text-secondary)', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                    <p style={{ marginBottom: '10px' }}>&copy; {new Date().getFullYear()} Shubham Srivastava. All rights reserved.</p>
                    <p style={{ fontSize: '0.8rem', opacity: 0.6 }}>
                        ✨ Designed & Developed by AI Using Google Antigravity (Google DeepMind)
                    </p>
                </div>
            </footer>
        </div>
    );
}

export default App;
