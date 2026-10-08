import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiMoon, FiSun, FiLock, FiUnlock, FiUser } from 'react-icons/fi';
import Logo from './Logo';
import PasswordModal from './PasswordModal';

const Navbar = ({ theme, toggleTheme, viewMode, setViewMode, onOpenPasswordModal, hasDecryptedData }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [activeSection, setActiveSection] = useState('hero');
    const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
    
    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 40);

            const sections = viewMode === 'personal'
                ? ['hero', 'career-lineage', 'interview-prep', 'contact']
                : ['hero', 'experience', 'certificates', 'contact'];
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
    }, [viewMode]);

    const handleModeChange = (mode) => {
        if (mode === 'personal') {
            if (hasDecryptedData) {
                setViewMode('personal');
            } else if (onOpenPasswordModal) {
                onOpenPasswordModal();
            } else {
                setIsPasswordModalOpen(true);
            }
        } else {
            setViewMode('general');
        }
    };

    const handlePasswordSuccess = () => {
        setViewMode('personal');
    };

    const navStyles = {
        position: 'fixed',
        top: 0,
        width: '100%',
        padding: scrolled ? '12px 0' : '20px 0',
        background: scrolled ? 'var(--nav-bg)' : 'transparent',
        backdropFilter: scrolled ? 'blur(10px)' : 'none',
        boxShadow: scrolled ? '0 4px 20px rgba(0,0,0,0.05)' : 'none',
        zIndex: 1000,
        transition: 'all 0.3s ease'
    };

    const navItems = viewMode === 'personal' ? [
        { label: 'Career Lineage', href: '#career-lineage', id: 'career-lineage' },
        { label: 'Interview Prep', href: '#interview-prep', id: 'interview-prep' },
        { label: 'Contact', href: '#contact', id: 'contact' }
    ] : [
        { label: 'Experience', href: '#experience', id: 'experience' },
        { label: 'Certificates', href: '#certificates', id: 'certificates' },
        { label: 'Contact', href: '#contact', id: 'contact' }
    ];

    return (
        <>
            <nav style={navStyles}>
                <div className="container navbar-container">
                    <a href="#hero" className="nav-brand" style={{ display: 'flex', alignItems: 'center' }}>
                        <Logo />
                    </a>

                    {/* Mobile hamburger button */}
                    <div
                        className="hamburger"
                        onClick={() => setIsOpen(!isOpen)}
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

                        <div style={{ display: 'flex', alignItems: 'center', gap: '14px', justifyContent: 'center', flexWrap: 'wrap' }}>
                            
                            {/* View Mode Toggle: General vs For Me */}
                            <div style={{
                                display: 'flex',
                                background: 'var(--surface-color)',
                                borderRadius: '10px',
                                border: '1px solid var(--card-border)',
                                padding: '3px',
                                gap: '3px'
                            }}>
                                <button
                                    onClick={() => handleModeChange('general')}
                                    style={{
                                        display: 'flex', alignItems: 'center', gap: '6px',
                                        padding: '6px 14px', borderRadius: '8px', fontSize: '0.82rem', fontWeight: 600,
                                        background: viewMode === 'general' ? 'var(--badge-bg)' : 'transparent',
                                        color: viewMode === 'general' ? 'var(--primary-color)' : 'var(--text-secondary)',
                                        border: 'none', cursor: 'pointer', transition: 'all 0.2s ease'
                                    }}
                                >
                                    <FiUser size={13} /> General
                                </button>
                                <button
                                    onClick={() => handleModeChange('personal')}
                                    style={{
                                        display: 'flex', alignItems: 'center', gap: '6px',
                                        padding: '6px 14px', borderRadius: '8px', fontSize: '0.82rem', fontWeight: 600,
                                        background: viewMode === 'personal' ? 'var(--badge-bg)' : 'transparent',
                                        color: viewMode === 'personal' ? 'var(--primary-color)' : 'var(--text-secondary)',
                                        border: 'none', cursor: 'pointer', transition: 'all 0.2s ease'
                                    }}
                                >
                                    {viewMode === 'personal' ? <FiUnlock size={13} /> : <FiLock size={13} />} For Me
                                </button>
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
                                    fontSize: '1rem',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    width: '34px',
                                    height: '34px',
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
                        </div>
                    </div>
                </div>
            </nav>

            {/* Password Modal (Fallback if not managed by parent App) */}
            {!onOpenPasswordModal && (
                <PasswordModal
                    isOpen={isPasswordModalOpen}
                    onClose={() => setIsPasswordModalOpen(false)}
                    onSuccess={handlePasswordSuccess}
                />
            )}
        </>
    );
};

export default Navbar;
