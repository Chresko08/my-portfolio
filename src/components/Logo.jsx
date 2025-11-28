import React from 'react';
import { motion } from 'framer-motion';

const Logo = () => {
    return (
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
            <motion.svg
                width="40"
                height="40"
                viewBox="0 0 40 40"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                initial="hidden"
                animate="visible"
            >
                {/* Cube Base */}
                <motion.path
                    d="M20 10 L35 17.5 V32.5 L20 40 L5 32.5 V17.5 Z"
                    stroke="var(--primary-color)"
                    strokeWidth="1.5"
                    fill="rgba(100, 108, 255, 0.05)"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8 }}
                />

                {/* Internal Cube Lines */}
                <motion.path
                    d="M20 10 V25 M35 17.5 L20 25 M5 17.5 L20 25"
                    stroke="var(--primary-color)"
                    strokeWidth="1"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 0.8, delay: 0.5 }}
                />

                {/* Data Stream Lines */}
                <motion.path
                    d="M10 32.5 Q 20 25, 30 32.5"
                    stroke="var(--primary-color)"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    fill="none"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 1.5, delay: 1, repeat: Infinity, repeatType: "reverse" }}
                />

                {/* Data Nodes */}
                <motion.circle cx="20" cy="10" r="2" fill="var(--text-primary)" animate={{ scale: [1, 1.5, 1] }} transition={{ duration: 2, repeat: Infinity }} />
                <motion.circle cx="35" cy="17.5" r="2" fill="var(--text-primary)" animate={{ scale: [1, 1.5, 1] }} transition={{ duration: 2, delay: 0.5, repeat: Infinity }} />
                <motion.circle cx="5" cy="17.5" r="2" fill="var(--text-primary)" animate={{ scale: [1, 1.5, 1] }} transition={{ duration: 2, delay: 1, repeat: Infinity }} />
            </motion.svg>
        </div>
    );
};

export default Logo;
