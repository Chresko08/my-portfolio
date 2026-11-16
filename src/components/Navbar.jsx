import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiMoon, FiSun, FiLock, FiUnlock, FiUser } from 'react-icons/fi';
import Logo from './Logo';

const Navbar = ({
    theme,
    toggleTheme,
    viewMode,
    setViewMode,
    onOpenPasswordModal,
    hasDecryptedData,
    currentRoute = 'home',
    onNavigateHome,
    onNavigateAllQuestions
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [activeSection, setActiveSection] = useState('hero');
    const navRef = useRef(null);

    // Click outside and Escape key handler to close mobile menu
    useEffect(() => {
        if (!isOpen) return;

        const handleClickOutside = (event) => {
            if (navRef.current && !navRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };

        const handleKeyDown = (event) => {
            if (event.key === 'Escape') {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        document.addEventListener('touchstart', handleClickOutside, { passive: true });
        document.addEventListener('keydown', handleKeyDown);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            document.removeEventListener('touchstart', handleClickOutside);
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [isOpen]);
    
    useEffect(() => {
        if (currentRoute === 'all-questions') {
            setActiveSection('all-questions');
            return;
        }

        const handleScroll = () => {
            setScrolled(window.scrollY > 30);

            const sections = viewMode === 'personal'
                ? ['hero', 'career-lineage', 'interview-prep', 'contact']
                : ['hero', 'experience', 'certificates', 'contact'];
            const scrollPosition = window.scrollY + 180;

            for (const section of sections) {
                const element = document.getElementById(section);
                if (element && element.offsetTop <= scrollPosition && (element.offsetTop + element.offsetHeight) > scrollPosition) {
                    setActiveSection(section);
                }
            }
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, [viewMode, currentRoute]);

    const handleModeChange = (mode) => {
        if (currentRoute === 'all-questions' && onNavigateHome) {
            onNavigateHome();
        }
        if (mode === 'personal') {
            if (hasDecryptedData) {
                setViewMode('personal');
            } else if (onOpenPasswordModal) {
                onOpenPasswordModal();
            }
        } else {
            setViewMode('general');
        }
    };

    const handleNavLinkClick = (e, item) => {
        setIsOpen(false);
        if (item.id === 'all-questions') {
            e.preventDefault();
            if (onNavigateAllQuestions) {
                onNavigateAllQuestions();
            } else {
                window.location.hash = '#all-questions';
            }
            return;
        }

        if (currentRoute === 'all-questions') {
            e.preventDefault();
            if (onNavigateHome) {
                onNavigateHome();
                setTimeout(() => {
                    const targetEl = document.querySelector(item.href);
                    if (targetEl) targetEl.scrollIntoView({ behavior: 'smooth' });
                }, 50);
            } else {
                window.location.hash = item.href;
            }
        }
    };

    const handleBrandClick = (e) => {
        if (currentRoute === 'all-questions') {
            e.preventDefault();
            if (onNavigateHome) {
                onNavigateHome();
            } else {
                window.location.hash = '';
            }
        }
    };

    const navItems = viewMode === 'personal' ? [
        { label: 'Career Lineage', href: '#career-lineage', id: 'career-lineage' },
        { label: 'Interview Prep', href: '#interview-prep', id: 'interview-prep' },
        { label: 'All Questions', href: '#all-questions', id: 'all-questions' },
        { label: 'Contact', href: '#contact', id: 'contact' }
    ] : [
        { label: 'Experience', href: '#experience', id: 'experience' },
        { label: 'Certificates', href: '#certificates', id: 'certificates' },
        { label: 'All Questions', href: '#all-questions', id: 'all-questions' },
        { label: 'Contact', href: '#contact', id: 'contact' }
    ];

    return (
        <nav
            ref={navRef}
            style={{
                position: 'fixed',
                top: 0,
                width: '100%',
                zIndex: 1000,
                padding: scrolled ? '10px 0' : '18px 0',
                background: scrolled ? 'var(--nav-bg)' : 'transparent',
                backdropFilter: scrolled ? 'blur(25px) saturate(190%)' : 'none',
                WebkitBackdropFilter: scrolled ? 'blur(25px) saturate(190%)' : 'none',
                borderBottom: scrolled ? '1px solid var(--card-border)' : '1px solid transparent',
                boxShadow: scrolled ? 'var(--card-highlight), 0 10px 30px rgba(0, 0, 0, 0.15)' : 'none',
                transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
            }}
        >
            <div className="container navbar-container">
                {/* Brand / Logo */}
                <a
                    href="#hero"
                    onClick={handleBrandClick}
                    className="nav-brand"
                    style={{ display: 'flex', alignItems: 'center' }}
                    aria-label="Home"
                >
                    <Logo />
                </a>

                {/* Mobile Header Controls (Theme Toggle & Hamburger) */}
                <div className="mobile-header-actions">
                    <motion.button
                        onClick={toggleTheme}
                        whileTap={{ scale: 0.9 }}
                        whileHover={{ scale: 1.05 }}
                        transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                        aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
                        className="mobile-theme-btn"
                        style={{
                            background: 'var(--surface-card)',
                            backdropFilter: 'blur(16px)',
                            WebkitBackdropFilter: 'blur(16px)',
                            color: 'var(--text-primary)',
                            fontSize: '0.95rem',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: '36px',
                            height: '36px',
                            borderRadius: '50%',
                            border: '1px solid var(--card-border)',
                            boxShadow: 'var(--card-highlight)',
                            cursor: 'pointer'
                        }}
                    >
                        <AnimatePresence mode="wait" initial={false}>
                            <motion.div
                                key={theme}
                                initial={{ y: -8, opacity: 0, rotate: -40 }}
                                animate={{ y: 0, opacity: 1, rotate: 0 }}
                                exit={{ y: 8, opacity: 0, rotate: 40 }}
                                transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                                style={{ display: 'flex' }}
                            >
                                {theme === 'dark' ? <FiSun style={{ color: '#ff9f0a' }} /> : <FiMoon style={{ color: '#0071e3' }} />}
                            </motion.div>
                        </AnimatePresence>
                    </motion.button>

                    <div
                        className="hamburger"
                        onClick={() => setIsOpen(!isOpen)}
                        role="button"
                        tabIndex={0}
                        aria-label="Toggle Navigation Menu"
                    >
                        <span style={{ transform: isOpen ? 'rotate(45deg) translate(5px, 5px)' : 'none' }}></span>
                        <span style={{ opacity: isOpen ? 0 : 1 }}></span>
                        <span style={{ transform: isOpen ? 'rotate(-45deg) translate(5px, -5px)' : 'none' }}></span>
                    </div>
                </div>

                {/* Navigation Links & Action Controls */}
                <div className={`nav-links ${isOpen ? 'open' : ''}`}>
                    {navItems.map((item) => {
                        const isActive = activeSection === item.id;
                        return (
                            <a
                                key={item.id}
                                href={item.href}
                                onClick={(e) => handleNavLinkClick(e, item)}
                                className={`nav-link ${isActive ? 'active' : ''}`}
                            >
                                {item.label}
                            </a>
                        );
                    })}

                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', justifyContent: 'center' }}>
                        
                        {/* Apple Fluid Segmented Control (General vs For Me) */}
                        <div
                            style={{
                                display: 'inline-flex',
                                position: 'relative',
                                background: 'var(--segmented-bg)',
                                backdropFilter: 'blur(16px)',
                                WebkitBackdropFilter: 'blur(16px)',
                                borderRadius: '9999px',
                                border: '1px solid var(--card-border)',
                                padding: '3px',
                                gap: '2px'
                            }}
                        >
                            {/* General Mode Button */}
                            <button
                                onClick={() => handleModeChange('general')}
                                style={{
                                    position: 'relative',
                                    zIndex: 1,
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '6px',
                                    padding: '5px 13px',
                                    borderRadius: '9999px',
                                    fontSize: '0.82rem',
                                    fontWeight: viewMode === 'general' ? 600 : 500,
                                    color: viewMode === 'general' ? 'var(--text-primary)' : 'var(--text-secondary)',
                                    background: 'transparent',
                                    border: 'none',
                                    cursor: 'pointer',
                                    transition: 'color 0.2s ease'
                                }}
                            >
                                {viewMode === 'general' && (
                                    <motion.div
                                        layoutId="activeSegmentedPill"
                                        transition={{ type: 'spring', stiffness: 450, damping: 35 }}
                                        style={{
                                            position: 'absolute',
                                            top: 0,
                                            left: 0,
                                            right: 0,
                                            bottom: 0,
                                            borderRadius: '9999px',
                                            background: 'var(--segmented-active)',
                                            boxShadow: '0 2px 8px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.15)',
                                            zIndex: -1
                                        }}
                                    />
                                )}
                                <FiUser size={13} /> General
                            </button>

                            {/* Personal Mode Button */}
                            <button
                                onClick={() => handleModeChange('personal')}
                                style={{
                                    position: 'relative',
                                    zIndex: 1,
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '6px',
                                    padding: '5px 13px',
                                    borderRadius: '9999px',
                                    fontSize: '0.82rem',
                                    fontWeight: viewMode === 'personal' ? 600 : 500,
                                    color: viewMode === 'personal' ? 'var(--text-primary)' : 'var(--text-secondary)',
                                    background: 'transparent',
                                    border: 'none',
                                    cursor: 'pointer',
                                    transition: 'color 0.2s ease'
                                }}
                            >
                                {viewMode === 'personal' && (
                                    <motion.div
                                        layoutId="activeSegmentedPill"
                                        transition={{ type: 'spring', stiffness: 450, damping: 35 }}
                                        style={{
                                            position: 'absolute',
                                            top: 0,
                                            left: 0,
                                            right: 0,
                                            bottom: 0,
                                            borderRadius: '9999px',
                                            background: 'var(--segmented-active)',
                                            boxShadow: '0 2px 8px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.15)',
                                            zIndex: -1
                                        }}
                                    />
                                )}
                                {viewMode === 'personal' || hasDecryptedData ? <FiUnlock size={13} /> : <FiLock size={13} />} For Me
                            </button>
                        </div>

                        {/* Apple Theme Toggle (Fluid Spring Rotate) */}
                        <motion.button
                            onClick={toggleTheme}
                            className="desktop-theme-toggle"
                            whileTap={{ scale: 0.9 }}
                            whileHover={{ scale: 1.05 }}
                            transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                            aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
                            style={{
                                background: 'var(--surface-card)',
                                backdropFilter: 'blur(16px)',
                                WebkitBackdropFilter: 'blur(16px)',
                                color: 'var(--text-primary)',
                                fontSize: '0.95rem',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                width: '36px',
                                height: '36px',
                                borderRadius: '50%',
                                border: '1px solid var(--card-border)',
                                boxShadow: 'var(--card-highlight)',
                                cursor: 'pointer'
                            }}
                        >
                            <AnimatePresence mode="wait" initial={false}>
                                <motion.div
                                    key={theme}
                                    initial={{ y: -8, opacity: 0, rotate: -40 }}
                                    animate={{ y: 0, opacity: 1, rotate: 0 }}
                                    exit={{ y: 8, opacity: 0, rotate: 40 }}
                                    transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                                    style={{ display: 'flex' }}
                                >
                                    {theme === 'dark' ? <FiSun style={{ color: '#ff9f0a' }} /> : <FiMoon style={{ color: '#0071e3' }} />}
                                </motion.div>
                            </AnimatePresence>
                        </motion.button>
                    </div>
                </div>
            </div>

            {/* Mobile Backdrop Overlay (Clicking outside collapses menu) */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        className="mobile-backdrop"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        onClick={() => setIsOpen(false)}
                        style={{
                            position: 'fixed',
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            height: '100vh',
                            background: 'rgba(0, 0, 0, 0.45)',
                            backdropFilter: 'blur(6px)',
                            WebkitBackdropFilter: 'blur(6px)',
                            zIndex: -1
                        }}
                        aria-hidden="true"
                    />
                )}
            </AnimatePresence>
        </nav>
    );
};

export default Navbar;
