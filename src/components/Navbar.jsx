import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiSun, FiMoon, FiExternalLink } from 'react-icons/fi';
import Logo from './Logo';

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [theme, setTheme] = useState(localStorage.getItem('theme') || 'dark');
    const [activeSection, setActiveSection] = useState('hero');

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 40);

            // Scroll-spy to detect active section
            const sections = ['hero', 'about', 'experience', 'certificates', 'contact'];
            const scrollPosition = window.scrollY + 200;

            for (const section of sections) {
                const element = document.getElementById(section);
                if (element) {
                    const top = element.offsetTop;
                    const height = element.offsetHeight;
                    if (scrollPosition >= top && scrollPosition < top + height) {
                        setActiveSection(section);
                        break;
                    }
                }
            }
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        handleScroll();
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
    }, [theme]);

    const toggleTheme = () => {
        setTheme(theme === 'dark' ? 'light' : 'dark');
    };

    const navItems = [
        { label: 'About', href: '#about', id: 'about' },
        { label: 'Experience', href: '#experience', id: 'experience' },
        { label: 'Certificates', href: '#certificates', id: 'certificates' },
        { label: 'Contact', href: '#contact', id: 'contact' },
    ];

    const navStyles = {
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
        padding: scrolled ? '14px 0' : '22px 0',
        transition: 'all 0.35s ease',
        background: scrolled ? 'var(--nav-bg)' : 'transparent',
        backdropFilter: scrolled ? 'blur(16px)' : 'none',
        WebkitBackdropFilter: scrolled ? 'blur(16px)' : 'none',
        borderBottom: scrolled ? '1px solid var(--card-border)' : '1px solid transparent',
        boxShadow: scrolled ? '0 10px 30px -10px rgba(0,0,0,0.3)' : 'none'
    };

    return (
        <nav style={navStyles}>
            <div className="container navbar-container">
                <a href="#hero" className="nav-brand" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{
                        width: '35px', height: '35px',
                        background: 'linear-gradient(135deg, var(--primary-color), var(--accent-purple))',
                        borderRadius: '8px',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        color: 'white', fontWeight: 800, fontSize: '1.2rem'
                    }}>
                        S
                    </div>
                    <span style={{ fontWeight: 700, fontSize: '1.25rem', letterSpacing: '-0.5px' }}>
                        S.S<span style={{ color: 'var(--primary-color)' }}>.</span>
                    </span>
                </a>

                {/* Mobile hamburger button */}
                <div
                    className="hamburger"
                    onClick={() => setIsOpen(!isOpen)}
                    aria-label="Toggle navigation menu"
                    role="button"
                    tabIndex={0}
                >
                    <span style={{ transform: isOpen ? 'rotate(45deg) translate(6px, 6px)' : 'none' }}></span>
                    <span style={{ opacity: isOpen ? 0 : 1 }}></span>
                    <span style={{ transform: isOpen ? 'rotate(-45deg) translate(5px, -5px)' : 'none' }}></span>
                </div>

                {/* Desktop and Mobile navigation links */}
                <div className={`nav-links ${isOpen ? 'open' : ''}`}>
                    {navItems.map((item) => {
                        const isActive = activeSection === item.id;
                        return (
                            <a
                                key={item.id}
                                href={item.href}
                                onClick={() => setIsOpen(false)}
                                className={`nav-link ${isActive ? 'active' : ''}`}
                            >
                                {item.label}
                            </a>
                        );
                    })}

                    <div style={{ display: 'flex', alignItems: 'center', gap: '14px', justifyContent: 'center' }}>
                        {/* Theme Toggle */}
                        <motion.button
                            onClick={toggleTheme}
                            whileTap={{ scale: 0.9 }}
                            whileHover={{ scale: 1.05 }}
                            aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
                            style={{
                                background: 'var(--surface-color)',
                                color: 'var(--text-primary)',
                                fontSize: '1.1rem',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                width: '38px',
                                height: '38px',
                                borderRadius: '50%',
                                border: '1px solid var(--card-border)',
                                cursor: 'pointer',
                                transition: 'all 0.25s ease'
                            }}
                        >
                            <AnimatePresence mode="wait" initial={false}>
                                <motion.div
                                    key={theme}
                                    initial={{ y: -10, opacity: 0, rotate: -45 }}
                                    animate={{ y: 0, opacity: 1, rotate: 0 }}
                                    exit={{ y: 10, opacity: 0, rotate: 45 }}
                                    transition={{ duration: 0.2 }}
                                    style={{ display: 'flex' }}
                                >
                                    {theme === 'dark' ? <FiSun style={{ color: '#f59e0b' }} /> : <FiMoon style={{ color: 'var(--primary-color)' }} />}
                                </motion.div>
                            </AnimatePresence>
                        </motion.button>

                        {/* Resume CTA button */}
                        <motion.a
                            href="https://drive.google.com/file/d/13T3uAmP2iG6Pq2qosDZdNuk17G41v7cf/view?usp=share_link"
                            target="_blank"
                            rel="noopener noreferrer"
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.97 }}
                            style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '6px',
                                padding: '8px 18px',
                                border: '1px solid var(--primary-color)',
                                borderRadius: '9999px',
                                color: 'var(--primary-color)',
                                background: 'var(--badge-bg)',
                                fontSize: '0.88rem',
                                fontWeight: 600,
                                cursor: 'pointer',
                                textDecoration: 'none',
                                transition: 'all 0.25s ease'
                            }}
                        >
                            <span>Resume</span>
                            <FiExternalLink size={13} />
                        </motion.a>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
