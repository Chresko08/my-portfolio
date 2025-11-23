import React from 'react';
import { motion } from 'framer-motion';

const Contact = () => {
    return (
        <section id="contact" className="section" style={{ paddingBottom: '100px' }}>
            <div className="container" style={{ textAlign: 'center', maxWidth: '800px' }}>
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                    viewport={{ once: true }}
                >
                    <h2 style={{ fontSize: '3rem', marginBottom: '20px' }}>
                        Let's work <span className="gradient-text">together</span>.
                    </h2>
                    <p style={{ fontSize: '1.2rem', color: 'var(--text-secondary)', marginBottom: '50px' }}>
                        I'm currently available for opportunities in Big Data Engineering and Analytics. If you have a project that needs a robust data solution, feel free to contact me.
                    </p>

                    <a href="mailto:shubhamsrivastava08@gmail.com" style={{
                        display: 'inline-block',
                        padding: '15px 40px',
                        background: 'var(--primary-color)',
                        color: 'white',
                        borderRadius: '50px',
                        fontSize: '1.2rem',
                        fontWeight: 600,
                        boxShadow: '0 10px 20px rgba(100, 108, 255, 0.3)',
                        transition: 'transform 0.3s ease'
                    }}>
                        Say Hello
                    </a>

                    <div className="contact-links">
                        <a href="mailto:shubhamsrivastava08@gmail.com" style={{ color: 'var(--text-secondary)', fontSize: '1rem', borderBottom: '1px solid transparent', transition: 'all 0.3s' }}>
                            shubhamsrivastava08@gmail.com
                        </a>
                        <span className="contact-separator" style={{ color: 'var(--text-secondary)' }}>|</span>
                        <a href="https://www.linkedin.com/in/chresko" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--text-secondary)', fontSize: '1rem', borderBottom: '1px solid transparent', transition: 'all 0.3s' }}>
                            LinkedIn
                        </a>
                        <span className="contact-separator" style={{ color: 'var(--text-secondary)' }}>|</span>
                        <span style={{ color: 'var(--text-secondary)' }}>+91 8887717686</span>
                    </div>
                </motion.div>
            </div>
        </section>
    );
};

export default Contact;
