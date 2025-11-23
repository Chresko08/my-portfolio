import React from 'react';
import { motion } from 'framer-motion';

const LogoShowcase = () => {
    return (
        <div style={{
            position: 'fixed',
            top: '100px',
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 2000,
            background: 'rgba(20, 20, 20, 0.95)',
            border: '1px solid #333',
            borderRadius: '20px',
            padding: '30px',
            display: 'grid',
            gridTemplateColumns: '1fr 1fr 1fr',
            gap: '40px',
            backdropFilter: 'blur(10px)',
            boxShadow: '0 20px 50px rgba(0,0,0,0.5)',
            width: 'max-content'
        }}>
            <div style={{ textAlign: 'center' }}>
                <p style={{ marginBottom: '15px', color: '#888', fontSize: '0.9rem' }}>Concept 4: Data Stream</p>
                <StreamLogo />
            </div>
            <div style={{ borderLeft: '1px solid #333', paddingLeft: '40px', textAlign: 'center' }}>
                <p style={{ marginBottom: '15px', color: '#888', fontSize: '0.9rem' }}>Concept 5: Data Block</p>
                <CubeLogo />
            </div>
            <div style={{ borderLeft: '1px solid #333', paddingLeft: '40px', textAlign: 'center' }}>
                <p style={{ marginBottom: '15px', color: '#888', fontSize: '0.9rem' }}>Concept 6: Data Array</p>
                <ArrayLogo />
            </div>
        </div>
    );
};

// Concept 4: Data Stream (Flowing lines forming an S)
const StreamLogo = () => (
    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
            {[0, 4, 8].map((offset, i) => (
                <motion.path
                    key={i}
                    d={`M10 ${10 + offset} Q 20 ${5 + offset}, 20 ${20 + offset} T 30 ${30 + offset}`}
                    stroke="var(--primary-color)"
                    strokeWidth="2"
                    strokeLinecap="round"
                    fill="none"
                    initial={{ pathLength: 0, opacity: 0.5 }}
                    animate={{ pathLength: 1, opacity: 1 }}
                    transition={{
                        duration: 2,
                        delay: i * 0.2,
                        repeat: Infinity,
                        repeatType: "reverse",
                        ease: "easeInOut"
                    }}
                />
            ))}
        </svg>
        <span style={{ fontSize: '1.2rem', fontWeight: 700 }}>Shubham</span>
    </div>
);

// Concept 5: Data Block (Isometric Cube)
const CubeLogo = () => (
    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
            <motion.path
                d="M20 5 L35 12.5 V27.5 L20 35 L5 27.5 V12.5 Z"
                stroke="var(--primary-color)"
                strokeWidth="1.5"
                fill="rgba(100, 108, 255, 0.1)"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5 }}
            />
            <motion.path
                d="M20 5 V20 M35 12.5 L20 20 M5 12.5 L20 20"
                stroke="var(--primary-color)"
                strokeWidth="1.5"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 1, delay: 0.5 }}
            />
            {/* Data bits floating */}
            <motion.circle cx="20" cy="12" r="1.5" fill="#fff" animate={{ y: [0, -2, 0] }} transition={{ duration: 2, repeat: Infinity }} />
            <motion.circle cx="28" cy="16" r="1.5" fill="#fff" animate={{ y: [0, -2, 0] }} transition={{ duration: 2, delay: 0.5, repeat: Infinity }} />
            <motion.circle cx="12" cy="16" r="1.5" fill="#fff" animate={{ y: [0, -2, 0] }} transition={{ duration: 2, delay: 1, repeat: Infinity }} />
        </svg>
        <span style={{ fontSize: '1.2rem', fontWeight: 700 }}>Shubham</span>
    </div>
);

// Concept 6: Data Array (Bracket Notation)
const ArrayLogo = () => (
    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <div style={{ display: 'flex', alignItems: 'center', fontSize: '1.5rem', fontWeight: 700, color: 'var(--primary-color)' }}>
            <motion.span initial={{ x: 10, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ duration: 0.5 }}>[</motion.span>
            <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.3, type: "spring" }}
                style={{ color: '#fff', margin: '0 5px' }}
            >
                S
            </motion.span>
            <motion.span initial={{ x: -10, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ duration: 0.5 }}>]</motion.span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1 }}>
            <span style={{ fontSize: '1rem', fontWeight: 700 }}>shubham</span>
            <span style={{ fontSize: '0.7rem', color: '#888', letterSpacing: '1px' }}>DATA_ENG</span>
        </div>
    </div>
);

export default LogoShowcase;
