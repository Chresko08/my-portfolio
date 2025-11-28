import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiSun, FiMoon } from 'react-icons/fi';

import Logo from './Logo';

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [theme, setTheme] = useState(localStorage.getItem('theme') || 'dark');

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
    }, [theme]);

    const toggleTheme = () => {
        setTheme(theme === 'dark' ? 'light' : 'dark');
    };

    const navStyles = {
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
        padding: '20px 0',
        transition: 'all 0.3s ease',
        background: scrolled || isOpen ? 'var(--nav-bg)' : 'transparent',
        backdropFilter: scrolled || isOpen ? 'blur(10px)' : 'none',
        borderBottom: scrolled ? '1px solid rgba(255, 255, 255, 0.1)' : 'none',
    };

    return (
        <nav style={navStyles}>
            <div className="container navbar-container">
                <div className="logo-container">
                    <Logo />
                </div>

                <div className="hamburger" onClick={() => setIsOpen(!isOpen)}>
                    <span style={{ transform: isOpen ? 'rotate(45deg) translate(5px, 6px)' : 'none' }}></span>
                    <span style={{ opacity: isOpen ? 0 : 1 }}></span>
                    <span style={{ transform: isOpen ? 'rotate(-45deg) translate(5px, -6px)' : 'none' }}></span>
                </div>

                <div className={`nav-links ${isOpen ? 'open' : ''}`}>
                    {['About', 'Experience', 'Projects', 'Contact'].map((item, index) => (
                        <motion.a
                            key={item}
                            href={`#${item.toLowerCase()}`}
                            onClick={() => setIsOpen(false)}
                            style={{
                                marginLeft: '30px',
                                fontWeight: 500,
                                position: 'relative',
                                cursor: 'pointer',
                            }}
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            whileHover={{ color: 'var(--primary-color)' }}
                        >
                            {item}
                        </motion.a>
                    ))}

                    <button
                        onClick={toggleTheme}
                        style={{
                            marginLeft: '30px',
                            background: 'transparent',
                            color: 'var(--text-primary)',
                            fontSize: '1.2rem',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            padding: '8px',
                            borderRadius: '50%',
                            border: '1px solid var(--surface-color)'
                        }}
                    >
                        {theme === 'dark' ? <FiSun /> : <FiMoon />}
                    </button>

                    <motion.a
                        href="https://drive.google.com/file/d/13T3uAmP2iG6Pq2qosDZdNuk17G41v7cf/view?usp=share_link"
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                            marginLeft: '30px',
                            padding: '8px 20px',
                            border: '1px solid var(--primary-color)',
                            borderRadius: '20px',
                            color: 'var(--primary-color)',
                            background: 'transparent',
                            fontSize: '0.9rem',
                            fontWeight: 600,
                            cursor: 'pointer',
                            textDecoration: 'none'
                        }}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        whileHover={{ background: 'var(--primary-color)', color: '#fff' }}
                    >
                        Resume
                    </motion.a>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
