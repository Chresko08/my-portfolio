import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiMail, FiLinkedin, FiGithub, FiCopy, FiCheck, FiArrowUpRight } from 'react-icons/fi';
import { SiLeetcode } from 'react-icons/si';

const Contact = () => {
    const [copied, setCopied] = useState(false);
    const emailAddress = 'shubhamsrivastava08@gmail.com';

    const handleCopyEmail = () => {
        navigator.clipboard.writeText(emailAddress);
        setCopied(true);
        setTimeout(() => setCopied(false), 2500);
    };

    const contactChannels = [
        {
            title: 'Email',
            handle: 'shubhamsrivastava08@gmail.com',
            link: `mailto:${emailAddress}`,
            icon: <FiMail size={24} style={{ color: 'var(--primary-color)' }} />,
            actionLabel: 'Send Mail'
        },
        {
            title: 'LinkedIn',
            handle: 'linkedin.com/in/chresko',
            link: 'https://www.linkedin.com/in/chresko',
            icon: <FiLinkedin size={24} style={{ color: '#0077b5' }} />,
            actionLabel: 'Connect'
        },
        {
            title: 'GitHub',
            handle: 'github.com/Chresko08',
            link: 'https://github.com/Chresko08',
            icon: <FiGithub size={24} style={{ color: 'var(--text-primary)' }} />,
            actionLabel: 'View Repos'
        },
        {
            title: 'LeetCode',
            handle: 'leetcode.com/u/shubham_chresko',
            link: 'https://leetcode.com/u/shubham_chresko/',
            icon: <SiLeetcode size={24} style={{ color: '#f59e0b' }} />,
            actionLabel: 'View Profile'
        }
    ];

    return (
        <section id="contact" className="section" style={{ paddingBottom: '120px' }}>
            <div className="container" style={{ maxWidth: '960px' }}>
                <div className="section-title-wrap">
                    <span className="section-subtitle">Get In Touch</span>
                    <h2 className="section-heading">
                        Let's Work <span className="gradient-text">Together</span>
                    </h2>
                </div>

                {/* Main Contact Callout Box */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                    viewport={{ once: true }}
                    className="glass-card"
                    style={{
                        padding: '45px 30px',
                        textAlign: 'center',
                        marginBottom: '40px',
                        background: 'linear-gradient(180deg, var(--surface-card) 0%, rgba(99, 102, 241, 0.05) 100%)',
                        border: '1px solid var(--card-border-hover)'
                    }}
                >
                    <p style={{
                        fontSize: '1.2rem',
                        color: 'var(--text-secondary)',
                        maxWidth: '650px',
                        margin: '0 auto 30px',
                        lineHeight: 1.7
                    }}>
                        I am actively exploring roles in <strong style={{ color: 'var(--text-primary)' }}>Big Data Engineering</strong>, <strong style={{ color: 'var(--text-primary)' }}>Cloud Architecture</strong>, and <strong style={{ color: 'var(--text-primary)' }}>Data Analytics</strong>. Whether you have a challenging pipeline to build or would like to discuss technical solutions, my inbox is open!
                    </p>

                    {/* Action buttons */}
                    <div style={{ display: 'flex', gap: '15px', justifyContent: 'center', flexWrap: 'wrap' }}>
                        <a href={`mailto:${emailAddress}`} className="btn-primary" style={{ padding: '14px 34px', fontSize: '1.05rem' }}>
                            <FiMail size={18} />
                            <span>Say Hello</span>
                        </a>

                        <button
                            onClick={handleCopyEmail}
                            className="btn-secondary"
                            style={{ padding: '14px 28px', fontSize: '1rem', position: 'relative' }}
                        >
                            <AnimatePresence mode="wait" initial={false}>
                                {copied ? (
                                    <motion.span
                                        key="copied"
                                        initial={{ opacity: 0, y: -5 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: 5 }}
                                        style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: 'var(--accent-emerald)' }}
                                    >
                                        <FiCheck size={16} /> Copied!
                                    </motion.span>
                                ) : (
                                    <motion.span
                                        key="copy"
                                        initial={{ opacity: 0, y: 5 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -5 }}
                                        style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                                    >
                                        <FiCopy size={16} /> Copy Email
                                    </motion.span>
                                )}
                            </AnimatePresence>
                        </button>
                    </div>
                </motion.div>

                {/* Social Channels 4-Card Grid */}
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                    gap: '18px'
                }}>
                    {contactChannels.map((channel, index) => (
                        <motion.a
                            key={channel.title}
                            href={channel.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4, delay: index * 0.08 }}
                            viewport={{ once: true }}
                            whileHover={{ y: -5, borderColor: 'var(--primary-color)' }}
                            className="glass-card"
                            style={{
                                padding: '22px',
                                display: 'flex',
                                flexDirection: 'column',
                                textDecoration: 'none',
                                color: 'inherit'
                            }}
                        >
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                                <div style={{
                                    width: '44px',
                                    height: '44px',
                                    borderRadius: '12px',
                                    background: 'var(--surface-color)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    border: '1px solid var(--card-border)'
                                }}>
                                    {channel.icon}
                                </div>
                                <FiArrowUpRight size={18} style={{ color: 'var(--text-muted)' }} />
                            </div>

                            <div style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '4px' }}>
                                {channel.title}
                            </div>
                            <div style={{
                                fontSize: '0.82rem',
                                color: 'var(--text-secondary)',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap'
                            }}>
                                {channel.handle}
                            </div>
                        </motion.a>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Contact;
