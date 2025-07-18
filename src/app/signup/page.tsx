'use client';

import { useState } from 'react';

interface FormState {
  username: string;
  email: string;
  password: string;
  code: string;
}

export default function SignupForm() {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [form, setForm] = useState<FormState>({
    username: '',
    email: '',
    password: '',
    code: '',
  });

  const [verificationToken, setVerificationToken] = useState<string>('');
  const [verificationTokenExpiresAt, setVerificationTokenExpiresAt] = useState<string>('');
  const [message, setMessage] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSendCode = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/users/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: form.username,
          email: form.email,
          password: form.password,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setVerificationToken(data.verificationToken);
        setVerificationTokenExpiresAt(data.verificationTokenExpiresAt);
        setStep(2);
        setMessage('Verification code sent to email.');
      } else {
        setMessage(data.message || 'Something went wrong.');
      }
    } catch (error) {
      setMessage('Network error.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyAndSignup = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/users/verify-signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          verificationToken,
          verificationTokenExpiresAt,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setStep(3);
        setMessage('Signup complete! ✅');
      } else {
        setMessage(data.message || 'Invalid code or expired token.');
      }
    } catch (error) {
      setMessage('Verification failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: '2rem auto', padding: '1rem', border: '1px solid #ccc' }}>
      <h2 style={{ marginBottom: '1rem' }}>
        {step === 1 && 'Step 1: Sign Up'}
        {step === 2 && 'Step 2: Verify Code'}
        {step === 3 && '✅ Signup Complete'}
      </h2>

      {step === 1 && (
        <>
          <input
            type="text"
            name="username"
            placeholder="Username"
            value={form.username}
            onChange={handleChange}
            required
            className="input"
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            required
            className="input"
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            required
            className="input"
          />
          <button onClick={handleSendCode} disabled={loading}>
            {loading ? 'Sending...' : 'Send Verification Code'}
          </button>
        </>
      )}

      {step === 2 && (
        <>
          <p>A 6-digit code was sent to your email.</p>
          <input
            type="text"
            name="code"
            placeholder="Enter code"
            value={form.code}
            onChange={handleChange}
            className="input"
          />
          <button onClick={handleVerifyAndSignup} disabled={loading}>
            {loading ? 'Verifying...' : 'Verify & Register'}
          </button>
        </>
      )}

      {step === 3 && (
        <p>🎉 Your account has been created successfully.</p>
      )}

      {message && (
        <div style={{ marginTop: '1rem', color: 'darkred' }}>{message}</div>
      )}
    </div>
  );
}
