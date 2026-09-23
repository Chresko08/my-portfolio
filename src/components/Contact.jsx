import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiMail, FiCopy, FiCheck } from 'react-icons/fi';

const Contact = ({ viewMode }) => {
    const [copied, setCopied] = useState(false);
    const emailAddress = 'shubhamsrivastava08@gmail.com';

    const handleCopyEmail = () => {
        navigator.clipboard.writeText(emailAddress);
        setCopied(true);
        setTimeout(() => setCopied(false), 2500);
    };

    return (
        <section id="contact" className="section" style={{ paddingBottom: '120px' }}>
            <div className="container" style={{ maxWidth: viewMode === 'technical' ? '600px' : '1000px', transition: 'max-width 0.3s ease' }}>
                <div className="section-title-wrap" style={{ textAlign: 'center', marginBottom: '60px' }}>
                    <span className="section-subtitle">Get In Touch</span>
                    <h2 className="section-heading">
                        Contact <span className="gradient-text">Me</span>
                    </h2>
                </div>

                <div style={{
                    display: 'grid',
                    gridTemplateColumns: viewMode === 'technical' ? '1fr' : 'repeat(auto-fit, minmax(320px, 1fr))',
                    gap: '40px',
                    alignItems: 'start'
                }}>
                    
                    {/* Left Column: Form */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5 }}
                        viewport={{ once: true }}
                        className="glass-card"
                        style={{ padding: '40px', position: 'relative' }}
                    >
                        <h3 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '24px', color: 'var(--text-primary)' }}>Send me a message</h3>
                        
                        <form
                            action={`https://formsubmit.co/${emailAddress}`}
                            method="POST"
                            style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}
                        >
                            <input type="hidden" name="_subject" value="New Contact Message from Portfolio" />
                            <input type="hidden" name="_captcha" value="false" />
                            <input type="hidden" name="_template" value="box" />
                            <input type="text" name="_honey" style={{ display: 'none' }} />

                            <div>
                                <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Name</label>
                                <input
                                    type="text"
                                    name="name"
                                    required
                                    style={{
                                        width: '100%', padding: '12px 16px',
                                        background: 'var(--surface-color)', border: '1px solid var(--card-border)',
                                        borderRadius: '8px', color: 'var(--text-primary)', fontSize: '1rem',
                                        outline: 'none'
                                    }}
                                />
                            </div>

                            <div>
                                <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Email</label>
                                <input
                                    type="email"
                                    name="email"
                                    required
                                    style={{
                                        width: '100%', padding: '12px 16px',
                                        background: 'var(--surface-color)', border: '1px solid var(--card-border)',
                                        borderRadius: '8px', color: 'var(--text-primary)', fontSize: '1rem',
                                        outline: 'none'
                                    }}
                                />
                            </div>

                            <div>
                                <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Message</label>
                                <textarea
                                    name="message"
                                    required
                                    rows="4"
                                    style={{
                                        width: '100%', padding: '12px 16px',
                                        background: 'var(--surface-color)', border: '1px solid var(--card-border)',
                                        borderRadius: '8px', color: 'var(--text-primary)', fontSize: '1rem',
                                        outline: 'none', resize: 'vertical'
                                    }}
                                ></textarea>
                            </div>

                            <div style={{ display: 'flex', gap: '15px' }}>
                                <button
                                    type="submit"
                                    className="btn-primary"
                                    style={{
                                        flex: 1, padding: '14px', border: 'none',
                                        borderRadius: '8px', fontSize: '1rem', fontWeight: 600,
                                        cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px'
                                    }}
                                >
                                    <FiMail size={18} />
                                    Send
                                </button>
                                
                            </div>
                        </form>
                    </motion.div>

                    {/* Right Column: Recruiter Quick Facts */}
                    <AnimatePresence>
                        {viewMode !== 'technical' && (
                            <motion.div
                                initial={{ opacity: 0, x: 20, width: 0 }}
                                animate={{ opacity: 1, x: 0, width: 'auto' }}
                                exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.2 } }}
                                transition={{ duration: 0.4 }}
                                className="glass-card"
                                style={{ padding: '40px', background: 'linear-gradient(135deg, rgba(139,92,246,0.05), rgba(14,165,233,0.05))', border: '1px solid var(--primary-color)' }}
                            >
                                <h3 style={{ fontSize: '1.3rem', fontWeight: 700, marginBottom: '24px', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <span style={{ fontSize: '1.4rem' }}>📋</span> Candidate Snapshot
                                </h3>
                                <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '24px', lineHeight: 1.5 }}>
                                    Quick operational details for technical recruiters and hiring managers.
                                </p>
                                
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--card-border)', paddingBottom: '8px' }}>
                                        <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Total Experience</span>
                                        <strong style={{ color: 'var(--text-primary)', fontSize: '0.95rem' }}>5 Years</strong>
                                    </div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--card-border)', paddingBottom: '8px' }}>
                                        <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Current CTC</span>
                                        <strong style={{ color: 'var(--text-primary)', fontSize: '0.95rem' }}>17LPA (Fixed) + 20% (Variable)</strong>
                                    </div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--card-border)', paddingBottom: '8px' }}>
                                        <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Expected CTC</span>
                                        <strong style={{ color: 'var(--text-primary)', fontSize: '0.95rem' }}>20LPA (Fixed)</strong>
                                    </div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--card-border)', paddingBottom: '8px' }}>
                                        <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Offers in Hand</span>
                                        <strong style={{ color: 'var(--text-primary)', fontSize: '0.95rem' }}>No</strong>
                                    </div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--card-border)', paddingBottom: '8px' }}>
                                        <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Notice Period</span>
                                        <strong style={{ color: 'var(--accent-purple)', fontSize: '0.95rem' }}>Serving (LWD: 19th Nov 2026)</strong>
                                    </div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--card-border)', paddingBottom: '8px' }}>
                                        <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Base Location</span>
                                        <strong style={{ color: 'var(--text-primary)', fontSize: '0.95rem' }}>Gurugram</strong>
                                    </div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--card-border)', paddingBottom: '8px' }}>
                                        <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Preferred Location</span>
                                        <strong style={{ color: 'var(--text-primary)', fontSize: '0.95rem' }}>Pan India</strong>
                                    </div>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', paddingTop: '4px' }}>
                                        <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Reason for Change</span>
                                        <strong style={{ color: 'var(--text-primary)', fontSize: '0.95rem' }}>Career progression & favorable role preferences</strong>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </section>
    );
};

export default Contact;
