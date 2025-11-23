import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

import Logo from './Logo';

const Navbar = () => {
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const navStyles = {
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
        padding: '20px 0',
        transition: 'all 0.3s ease',
        background: scrolled ? 'rgba(10, 10, 10, 0.8)' : 'transparent',
        backdropFilter: scrolled ? 'blur(10px)' : 'none',
        borderBottom: scrolled ? '1px solid rgba(255, 255, 255, 0.1)' : 'none',
    };

    const linkStyles = {
        marginLeft: '30px',
        fontWeight: 500,
        position: 'relative',
        cursor: 'pointer',
    };

    return (
        <nav style={navStyles}>
            <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Logo />

                <div style={{ display: 'flex', alignItems: 'center' }}>
                    {['About', 'Experience', 'Projects', 'Contact'].map((item, index) => (
                        <motion.a
                            key={item}
                            href={`#${item.toLowerCase()}`}
                            style={linkStyles}
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            whileHover={{ color: 'var(--primary-color)' }}
                        >
                            {item}
                        </motion.a>
                    ))}
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
