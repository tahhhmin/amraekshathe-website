import React, { useEffect, useRef, useCallback } from 'react';
import Styles from './VerificationCodeInput.module.css';

interface VerificationCodeInputProps {
  label?: string;
  value: string; // Should be a string of digits, length <= `length` prop
  onChange: (value: string) => void;
  helpText?: string;
  length?: number;  // Optional length of the code, default 6
  autoFocus?: boolean; // Optional autofocus on first input
}

export default function VerificationCodeInput({
  label,
  value = '',
  onChange,
  helpText,
  length = 6,
  autoFocus = false,
}: VerificationCodeInputProps) {
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const focusInput = useCallback((index: number) => {
    if (index < 0 || index >= length) return;
    const input = inputRefs.current[index];
    if (input) {
      input.focus();
      input.select();
    }
  }, [length]);

  const handleInputChange = (index: number, val: string) => {
    if (!/^\d?$/.test(val)) return;

    const otpArray = value.padEnd(length, ' ').split('');
    otpArray[index] = val;

    const newValue = otpArray.join('').trim();
    onChange(newValue);

    if (val && index < length - 1) {
      focusInput(index + 1);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === 'Backspace') {
      if (!value[index] && index > 0) {
        focusInput(index - 1);
      }
    } else if (e.key === 'ArrowLeft' && index > 0) {
      focusInput(index - 1);
    } else if (e.key === 'ArrowRight' && index < length - 1) {
      focusInput(index + 1);
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('Text').trim().slice(0, length);
    if (!new RegExp(`^\\d{1,${length}}$`).test(pasted)) return;

    const otpArray = Array(length).fill('');
    for (let i = 0; i < pasted.length; i++) {
      otpArray[i] = pasted[i];
    }

    onChange(otpArray.join(''));
    setTimeout(() => focusInput(Math.min(pasted.length, length - 1)), 0);
  };

  useEffect(() => {
    if (autoFocus) {
      focusInput(0);
    }
  }, [autoFocus, focusInput]);

  return (
    <div className={Styles.otpContainer}>
      {label && <label className={Styles.otpLabel}>{label}</label>}

      <div className={Styles.otpInputWrapper}>
        {Array.from({ length }).map((_, i) => (
          <input
            key={i}
            ref={(el) => {
              inputRefs.current[i] = el;
            }}
            type="text"
            inputMode="numeric"
            autoComplete="one-time-code"
            maxLength={1}
            className={Styles.otpInput}
            value={value[i] || ''}
            onChange={(e) => handleInputChange(i, e.target.value)}
            onKeyDown={(e) => handleKeyDown(e, i)}
            onPaste={handlePaste}
            autoFocus={autoFocus && i === 0}
          />
        ))}
      </div>

      {helpText && <p className="muted-text">{helpText}</p>}
    </div>
  );
}
