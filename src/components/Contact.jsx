import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiMail, FiCopy, FiCheck } from 'react-icons/fi';

const SPRING_TRANSITION = { type: 'spring', stiffness: 380, damping: 28 };

const Contact = ({ viewMode }) => {
    const [copied, setCopied] = useState(false);
    const emailAddress = 'shubhamsrivastava08@gmail.com';

    const handleCopyEmail = () => {
        navigator.clipboard.writeText(emailAddress);
        setCopied(true);
        setTimeout(() => setCopied(false), 2500);
    };

    return (
        <section id="contact" className="section" style={{ paddingBottom: '120px', paddingTop: '80px' }}>
            <div className="container" style={{ maxWidth: viewMode === 'general' ? '640px' : '1040px', transition: 'max-width 0.35s cubic-bezier(0.16, 1, 0.3, 1)' }}>
                <div className="section-title-wrap">
                    <span className="section-subtitle">Initiate Conversation</span>
                    <h2 className="section-heading">
                        Get In <span className="gradient-text">Touch</span>
                    </h2>
                </div>

                <div style={{
                    display: 'grid',
                    gridTemplateColumns: viewMode === 'general' ? '1fr' : 'repeat(auto-fit, minmax(320px, 1fr))',
                    gap: '32px',
                    alignItems: 'start'
                }}>
                    
                    {/* Left Column: Direct Contact & Message Form */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={SPRING_TRANSITION}
                        viewport={{ once: true }}
                        className="glass-card"
                        style={{ padding: '36px', position: 'relative' }}
                    >
                        <h3 style={{ fontSize: '1.35rem', fontWeight: 700, marginBottom: '6px', color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
                            Reach Out Directly
                        </h3>
                        <p style={{ color: 'var(--text-secondary)', marginBottom: '24px', fontSize: '0.92rem', lineHeight: '1.55' }}>
                            Copy my direct email below or send a quick message to discuss cloud lakehouse roles, data architectures, or consulting engagements.
                        </p>

                        {/* Apple Email Copy Capsule */}
                        <div 
                            style={{ 
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                flexWrap: 'wrap',
                                gap: '12px',
                                background: 'var(--surface-color)',
                                padding: '14px 18px',
                                borderRadius: 'var(--radius-button)', 
                                border: '1px solid var(--card-border)',
                                boxShadow: 'var(--card-highlight)',
                                marginBottom: '28px'
                            }}
                        >
                            <span style={{ fontSize: '0.98rem', fontWeight: 600, color: 'var(--text-primary)', userSelect: 'all', letterSpacing: '-0.01em' }}>
                                {emailAddress}
                            </span>
                            <motion.button
                                type="button"
                                onClick={handleCopyEmail}
                                whileTap={{ scale: 0.94 }}
                                style={{
                                    background: copied ? 'var(--accent-emerald)' : 'var(--badge-bg)',
                                    color: copied ? '#ffffff' : 'var(--primary-color)',
                                    border: '1px solid',
                                    borderColor: copied ? 'var(--accent-emerald)' : 'var(--badge-border)',
                                    padding: '6px 14px',
                                    borderRadius: '9999px',
                                    fontSize: '0.82rem',
                                    fontWeight: 600,
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '6px',
                                    transition: 'background 0.2s ease, color 0.2s ease'
                                }}
                            >
                                {copied ? <FiCheck size={14} /> : <FiCopy size={13} />}
                                {copied ? 'Copied' : 'Copy'}
                            </motion.button>
                        </div>

                        {/* Contact Form */}
                        <form 
                            action="https://formspree.io/f/mqaeveqe" 
                            method="POST"
                            style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}
                        >
                            <div>
                                <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.86rem', fontWeight: 500, color: 'var(--text-secondary)' }}>
                                    Your Name
                                </label>
                                <input
                                    type="text"
                                    name="name"
                                    required
                                    placeholder="Jane Doe"
                                    style={{
                                        width: '100%',
                                        padding: '12px 16px',
                                        background: 'var(--surface-color)',
                                        border: '1px solid var(--card-border)',
                                        borderRadius: 'var(--radius-button)',
                                        color: 'var(--text-primary)',
                                        fontSize: '0.94rem',
                                        outline: 'none',
                                        transition: 'border-color 0.2s ease, box-shadow 0.2s ease'
                                    }}
                                    onFocus={(e) => {
                                        e.target.style.borderColor = 'var(--primary-color)';
                                        e.target.style.boxShadow = '0 0 0 3px var(--badge-bg)';
                                    }}
                                    onBlur={(e) => {
                                        e.target.style.borderColor = 'var(--card-border)';
                                        e.target.style.boxShadow = 'none';
                                    }}
                                />
                            </div>

                            <div>
                                <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.86rem', fontWeight: 500, color: 'var(--text-secondary)' }}>
                                    Your Email
                                </label>
                                <input
                                    type="email"
                                    name="email"
                                    required
                                    placeholder="jane@company.com"
                                    style={{
                                        width: '100%',
                                        padding: '12px 16px',
                                        background: 'var(--surface-color)',
                                        border: '1px solid var(--card-border)',
                                        borderRadius: 'var(--radius-button)',
                                        color: 'var(--text-primary)',
                                        fontSize: '0.94rem',
                                        outline: 'none',
                                        transition: 'border-color 0.2s ease, box-shadow 0.2s ease'
                                    }}
                                    onFocus={(e) => {
                                        e.target.style.borderColor = 'var(--primary-color)';
                                        e.target.style.boxShadow = '0 0 0 3px var(--badge-bg)';
                                    }}
                                    onBlur={(e) => {
                                        e.target.style.borderColor = 'var(--card-border)';
                                        e.target.style.boxShadow = 'none';
                                    }}
                                />
                            </div>

                            <div>
                                <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.86rem', fontWeight: 500, color: 'var(--text-secondary)' }}>
                                    Message
                                </label>
                                <textarea
                                    name="message"
                                    required
                                    rows="4"
                                    placeholder="Let's connect regarding a Senior Data Engineer role..."
                                    style={{
                                        width: '100%',
                                        padding: '12px 16px',
                                        background: 'var(--surface-color)',
                                        border: '1px solid var(--card-border)',
                                        borderRadius: 'var(--radius-button)',
                                        color: 'var(--text-primary)',
                                        fontSize: '0.94rem',
                                        outline: 'none',
                                        resize: 'vertical',
                                        transition: 'border-color 0.2s ease, box-shadow 0.2s ease'
                                    }}
                                    onFocus={(e) => {
                                        e.target.style.borderColor = 'var(--primary-color)';
                                        e.target.style.boxShadow = '0 0 0 3px var(--badge-bg)';
                                    }}
                                    onBlur={(e) => {
                                        e.target.style.borderColor = 'var(--card-border)';
                                        e.target.style.boxShadow = 'none';
                                    }}
                                ></textarea>
                            </div>

                            <motion.button
                                type="submit"
                                className="btn-primary"
                                whileTap={{ scale: 0.96 }}
                                transition={SPRING_TRANSITION}
                                style={{
                                    width: '100%',
                                    padding: '13px',
                                    justifyContent: 'center',
                                    fontSize: '0.94rem',
                                    marginTop: '6px'
                                }}
                            >
                                <FiMail size={16} />
                                <span>Send Message</span>
                            </motion.button>
                        </form>
                    </motion.div>

                    {/* Right Column: Recruiter Quick Facts (Personal / For Me Mode) */}
                    <AnimatePresence>
                        {viewMode !== 'general' && (
                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                transition={SPRING_TRANSITION}
                                className="glass-card"
                                style={{ padding: '36px' }}
                            >
                                <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '20px', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <span>📋</span> Candidate Snapshot
                                </h3>
                                <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', marginBottom: '20px', lineHeight: 1.5 }}>
                                    Operational credentials for technical recruiters and hiring managers.
                                </p>
                                
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--card-border)', paddingBottom: '8px' }}>
                                        <span style={{ color: 'var(--text-secondary)', fontSize: '0.88rem' }}>Total Experience</span>
                                        <strong style={{ color: 'var(--text-primary)', fontSize: '0.92rem' }}>5+ Years</strong>
                                    </div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--card-border)', paddingBottom: '8px' }}>
                                        <span style={{ color: 'var(--text-secondary)', fontSize: '0.88rem' }}>Current CTC</span>
                                        <strong style={{ color: 'var(--text-primary)', fontSize: '0.92rem' }}>17 LPA Fixed + 20% Variable</strong>
                                    </div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--card-border)', paddingBottom: '8px' }}>
                                        <span style={{ color: 'var(--text-secondary)', fontSize: '0.88rem' }}>Expected CTC</span>
                                        <strong style={{ color: 'var(--text-primary)', fontSize: '0.92rem' }}>20 - 26 LPA</strong>
                                    </div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--card-border)', paddingBottom: '8px' }}>
                                        <span style={{ color: 'var(--text-secondary)', fontSize: '0.88rem' }}>Notice Period</span>
                                        <strong style={{ color: 'var(--accent-emerald)', fontSize: '0.92rem' }}>Serving (LWD: 19th Nov 2026)</strong>
                                    </div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--card-border)', paddingBottom: '8px' }}>
                                        <span style={{ color: 'var(--text-secondary)', fontSize: '0.88rem' }}>Current Location</span>
                                        <strong style={{ color: 'var(--text-primary)', fontSize: '0.92rem' }}>Gurugram / NCR</strong>
                                    </div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--card-border)', paddingBottom: '8px' }}>
                                        <span style={{ color: 'var(--text-secondary)', fontSize: '0.88rem' }}>Work Mode</span>
                                        <strong style={{ color: 'var(--text-primary)', fontSize: '0.92rem' }}>Hybrid / Remote</strong>
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
