import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiMenu, FiX, FiMoon, FiSun, FiExternalLink, FiEye } from 'react-icons/fi';
import Logo from './Logo';

const Navbar = ({ theme, toggleTheme, viewMode, setViewMode }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [activeSection, setActiveSection] = useState('hero');
    const [showViewMenu, setShowViewMenu] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 40);

            // Scroll-spy to detect active section
            const sections = ['hero', 'experience', 'certificates', 'contact'];
            const scrollPosition = window.scrollY + 200;

            for (const section of sections) {
                const element = document.getElementById(section);
                if (element && element.offsetTop <= scrollPosition && (element.offsetTop + element.offsetHeight) > scrollPosition) {
                    setActiveSection(section);
                }
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const navStyles = {
        position: 'fixed',
        top: 0,
        width: '100%',
        padding: scrolled ? '15px 0' : '25px 0',
        background: scrolled ? 'var(--nav-bg)' : 'transparent',
        backdropFilter: scrolled ? 'blur(10px)' : 'none',
        boxShadow: scrolled ? '0 4px 20px rgba(0,0,0,0.05)' : 'none',
        zIndex: 1000,
        transition: 'all 0.3s ease'
    };

    const navItems = [
        { label: 'Experience', href: '#experience', id: 'experience' },
        { label: 'Certificates', href: '#certificates', id: 'certificates' },
        { label: 'Contact', href: '#contact', id: 'contact' },
    ];

    const viewOptions = [
        { id: 'all', label: 'All Content' },
        { id: 'recruiter', label: 'Recruiter View' },
        { id: 'technical', label: 'Technical View' }
    ];

    return (
        <nav style={navStyles}>
            <div className="container navbar-container">
                <a href="#hero" className="nav-brand" style={{ display: 'flex', alignItems: 'center' }}>
                    <Logo />
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
                        
                        {/* View Mode Dropdown */}
                        <div style={{ position: 'relative' }}>
                            <motion.button
                                onClick={() => setShowViewMenu(!showViewMenu)}
                                whileTap={{ scale: 0.95 }}
                                style={{
                                    background: 'var(--surface-color)',
                                    color: 'var(--text-primary)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '6px',
                                    padding: '6px 12px',
                                    borderRadius: '8px',
                                    border: '1px solid var(--card-border)',
                                    cursor: 'pointer',
                                    fontSize: '0.85rem',
                                    fontWeight: 600
                                }}
                            >
                                <FiEye size={14} style={{ color: 'var(--primary-color)' }} />
                                {viewOptions.find(opt => opt.id === viewMode)?.label}
                            </motion.button>

                            <AnimatePresence>
                                {showViewMenu && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                        transition={{ duration: 0.15 }}
                                        style={{
                                            position: 'absolute',
                                            top: '100%',
                                            right: 0,
                                            marginTop: '8px',
                                            background: 'var(--surface-card)',
                                            border: '1px solid var(--card-border)',
                                            borderRadius: '8px',
                                            padding: '8px',
                                            minWidth: '160px',
                                            boxShadow: '0 10px 25px rgba(0,0,0,0.2)',
                                            zIndex: 10
                                        }}
                                    >
                                        {viewOptions.map((opt) => (
                                            <div
                                                key={opt.id}
                                                onClick={() => {
                                                    setViewMode(opt.id);
                                                    setShowViewMenu(false);
                                                }}
                                                style={{
                                                    padding: '8px 12px',
                                                    fontSize: '0.85rem',
                                                    fontWeight: 500,
                                                    color: viewMode === opt.id ? 'var(--primary-color)' : 'var(--text-secondary)',
                                                    cursor: 'pointer',
                                                    borderRadius: '6px',
                                                    background: viewMode === opt.id ? 'var(--badge-bg)' : 'transparent',
                                                    transition: 'all 0.2s ease',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: '8px'
                                                }}
                                                onMouseEnter={(e) => {
                                                    if(viewMode !== opt.id) e.currentTarget.style.background = 'var(--surface-color)';
                                                }}
                                                onMouseLeave={(e) => {
                                                    if(viewMode !== opt.id) e.currentTarget.style.background = 'transparent';
                                                }}
                                            >
                                                <div style={{
                                                    width: '6px', height: '6px', borderRadius: '50%',
                                                    background: viewMode === opt.id ? 'var(--primary-color)' : 'transparent'
                                                }} />
                                                {opt.label}
                                            </div>
                                        ))}
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

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
                            href="https://drive.google.com/file/d/1X7xri0IVDUtWYZz_MF_WN2IHHtFK56Bc/view?usp=sharing"
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
