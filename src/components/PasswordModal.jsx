import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiLock, FiUnlock, FiEye, FiEyeOff, FiX, FiCheck, FiAlertCircle } from 'react-icons/fi';

const PasswordModal = ({ isOpen, onClose, onSuccess, onAuthenticate }) => {
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [rememberDevice, setRememberDevice] = useState(true);
    const [error, setError] = useState(false);
    const [shake, setShake] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const inputRef = useRef(null);

    useEffect(() => {
        if (isOpen) {
            setPassword('');
            setError(false);
            setShake(false);
            setIsLoading(false);
            setTimeout(() => {
                inputRef.current?.focus();
            }, 100);
        }
    }, [isOpen]);

    const handleSubmit = async (e) => {
        e?.preventDefault();
        if (!password || isLoading) return;
        setIsLoading(true);
        setError(false);

        try {
            if (onAuthenticate) {
                const success = await onAuthenticate(password, rememberDevice);
                if (success) {
                    setError(false);
                    if (onSuccess) onSuccess();
                    onClose();
                } else {
                    setError(true);
                    setShake(true);
                    setTimeout(() => setShake(false), 500);
                }
            }
        } catch (err) {
            setError(true);
            setShake(true);
            setTimeout(() => setShake(false), 500);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div
                    style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        zIndex: 9999,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: '20px'
                    }}
                >
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            background: 'rgba(5, 8, 18, 0.75)',
                            backdropFilter: 'blur(8px)',
                            WebkitBackdropFilter: 'blur(8px)'
                        }}
                    />

                    {/* Modal Dialog */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.92, y: 20 }}
                        animate={{
                            opacity: 1,
                            scale: 1,
                            y: 0,
                            x: shake ? [-8, 8, -6, 6, -3, 3, 0] : 0
                        }}
                        exit={{ opacity: 0, scale: 0.92, y: 20 }}
                        transition={{ type: 'spring', duration: 0.35, bounce: 0.2 }}
                        className="glass-card"
                        style={{
                            position: 'relative',
                            width: '100%',
                            maxWidth: '440px',
                            padding: '32px 28px',
                            background: 'var(--surface-card)',
                            border: '1px solid var(--card-border-hover)',
                            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5), 0 0 30px var(--glow-color)',
                            zIndex: 1
                        }}
                    >
                        {/* Close button */}
                        <button
                            onClick={onClose}
                            style={{
                                position: 'absolute',
                                top: '18px',
                                right: '18px',
                                background: 'transparent',
                                border: 'none',
                                color: 'var(--text-muted)',
                                cursor: 'pointer',
                                padding: '6px',
                                display: 'flex',
                                alignItems: 'center',
                                borderRadius: '8px',
                                transition: 'color 0.2s'
                            }}
                            onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--text-primary)'; }}
                            onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--text-muted)'; }}
                            aria-label="Close modal"
                        >
                            <FiX size={20} />
                        </button>

                        {/* Icon & Title */}
                        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
                            <div
                                style={{
                                    width: '54px',
                                    height: '54px',
                                    borderRadius: '16px',
                                    background: 'var(--badge-bg)',
                                    border: '1px solid var(--badge-border)',
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    color: 'var(--primary-color)',
                                    marginBottom: '16px'
                                }}
                            >
                                <FiLock size={26} />
                            </div>
                            <h3 style={{ fontSize: '1.4rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '6px' }}>
                                For Me — Private Access
                            </h3>
                            <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.5, margin: 0 }}>
                                Enter password to unlock your interview tracker and private career notes.
                            </p>
                        </div>

                        {/* Form */}
                        <form onSubmit={handleSubmit}>
                            <div style={{ marginBottom: '16px' }}>
                                <div style={{ position: 'relative' }}>
                                    <input
                                        ref={inputRef}
                                        type={showPassword ? 'text' : 'password'}
                                        placeholder="Enter password..."
                                        value={password}
                                        onChange={(e) => {
                                            setPassword(e.target.value);
                                            if (error) setError(false);
                                        }}
                                        style={{
                                            width: '100%',
                                            padding: '13px 44px 13px 16px',
                                            borderRadius: '12px',
                                            border: error ? '1px solid #ef4444' : '1px solid var(--card-border)',
                                            background: 'var(--surface-color)',
                                            color: 'var(--text-primary)',
                                            fontSize: '0.95rem',
                                            outline: 'none',
                                            transition: 'border-color 0.2s',
                                            boxShadow: error ? '0 0 0 3px rgba(239, 68, 68, 0.15)' : 'none'
                                        }}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        style={{
                                            position: 'absolute',
                                            right: '14px',
                                            top: '50%',
                                            transform: 'translateY(-50%)',
                                            background: 'transparent',
                                            border: 'none',
                                            color: 'var(--text-muted)',
                                            cursor: 'pointer',
                                            display: 'flex',
                                            alignItems: 'center',
                                            padding: '4px'
                                        }}
                                        aria-label={showPassword ? 'Hide password' : 'Show password'}
                                    >
                                        {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                                    </button>
                                </div>

                                {error && (
                                    <motion.p
                                        initial={{ opacity: 0, y: -4 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        style={{
                                            color: '#ef4444',
                                            fontSize: '0.82rem',
                                            marginTop: '8px',
                                            marginBottom: 0,
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '6px'
                                        }}
                                    >
                                        <FiAlertCircle size={14} /> Incorrect password. Please try again.
                                    </motion.p>
                                )}
                            </div>

                            {/* Remember Device Checkbox */}
                            <label
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '10px',
                                    fontSize: '0.86rem',
                                    color: 'var(--text-secondary)',
                                    marginBottom: '22px',
                                    cursor: 'pointer',
                                    userSelect: 'none'
                                }}
                            >
                                <input
                                    type="checkbox"
                                    checked={rememberDevice}
                                    onChange={(e) => setRememberDevice(e.target.checked)}
                                    style={{
                                        width: '16px',
                                        height: '16px',
                                        accentColor: 'var(--primary-color)',
                                        cursor: 'pointer'
                                    }}
                                />
                                <span>Remember on this device (stay logged in)</span>
                            </label>

                            {/* Action Buttons */}
                            <div style={{ display: 'flex', gap: '12px' }}>
                                <button
                                    type="button"
                                    onClick={onClose}
                                    style={{
                                        flex: 1,
                                        padding: '12px',
                                        borderRadius: '10px',
                                        background: 'var(--surface-color)',
                                        border: '1px solid var(--card-border)',
                                        color: 'var(--text-secondary)',
                                        fontSize: '0.92rem',
                                        fontWeight: 600,
                                        cursor: 'pointer',
                                        transition: 'all 0.2s'
                                    }}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="btn-primary"
                                    disabled={isLoading}
                                    style={{
                                        flex: 1.4,
                                        padding: '12px',
                                        borderRadius: '10px',
                                        fontSize: '0.92rem',
                                        fontWeight: 600,
                                        cursor: isLoading ? 'not-allowed' : 'pointer',
                                        display: 'flex',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        gap: '8px',
                                        opacity: isLoading ? 0.7 : 1
                                    }}
                                >
                                    <FiUnlock size={16} /> {isLoading ? 'Decrypting...' : 'Unlock Access'}
                                </button>
                            </div>
                        </form>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default PasswordModal;
