import React from 'react';
import { motion } from 'framer-motion';

const Hero = () => {
    return (
        <section style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
            overflow: 'hidden'
        }}>
            {/* Background Elements */}
            <div style={{
                position: 'absolute',
                top: '20%',
                left: '10%',
                width: '300px',
                height: '300px',
                background: 'var(--primary-color)',
                filter: 'blur(150px)',
                opacity: 0.2,
                borderRadius: '50%',
                zIndex: -1
            }} />
            <div style={{
                position: 'absolute',
                bottom: '20%',
                right: '10%',
                width: '400px',
                height: '400px',
                background: '#a855f7',
                filter: 'blur(150px)',
                opacity: 0.2,
                borderRadius: '50%',
                zIndex: -1
            }} />

            <div className="container" style={{ textAlign: 'center', zIndex: 1 }}>
                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    style={{ fontSize: '1.2rem', color: 'var(--primary-color)', marginBottom: '20px', fontWeight: 500 }}
                >
                    Hi, I'm
                </motion.p>

                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    style={{ fontSize: '4rem', fontWeight: 700, marginBottom: '20px', lineHeight: 1.1 }}
                >
                    Shubham Srivastava
                </motion.h1>

                <motion.h2
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                    style={{ fontSize: '2.5rem', color: 'var(--text-secondary)', marginBottom: '40px' }}
                >
                    Big Data Engineer & <span className="gradient-text">Business Analyst</span>
                </motion.h2>

                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.6 }}
                    style={{ maxWidth: '600px', margin: '0 auto 50px', color: 'var(--text-secondary)', fontSize: '1.1rem' }}
                >
                    Specializing in Big Data Analytics, Cloud Computing (AWS, Azure, GCP), and ETL pipelines. I transform complex data into actionable insights and scalable solutions.
                </motion.p>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.8 }}
                    style={{ display: 'flex', gap: '20px', justifyContent: 'center' }}
                >
                    <a href="#projects" style={{
                        padding: '12px 30px',
                        background: 'var(--primary-color)',
                        color: 'white',
                        borderRadius: '50px',
                        fontWeight: 600,
                        border: '2px solid var(--primary-color)',
                        transition: 'all 0.3s ease'
                    }}>
                        View Work
                    </a>
                    <a href="#contact" style={{
                        padding: '12px 30px',
                        background: 'transparent',
                        color: 'white',
                        borderRadius: '50px',
                        fontWeight: 600,
                        border: '2px solid rgba(255,255,255,0.2)',
                        transition: 'all 0.3s ease'
                    }}>
                        Contact Me
                    </a>
                </motion.div>
            </div>
        </section>
    );
};

export default Hero;
