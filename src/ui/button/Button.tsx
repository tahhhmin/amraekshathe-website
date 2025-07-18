'use client';

import React from 'react';
import * as LucideIcons from 'lucide-react';
import Styles from './Button.module.css';

type ButtonVariant =
  | 'primary'
  | 'secondary'
  | 'outlined'
  | 'icon'
  | 'action'
  | 'danger'
  | 'submit';

interface ButtonProps {
  variant?: ButtonVariant;
  label?: string;
  showIcon?: boolean;
  icon?: string; // Icon name as string
  disabled?: boolean;
  loading?: boolean; // Added loading prop
  type?: 'button' | 'submit' | 'reset';
  onClick?: () => void;
}

export default function Button({
  variant = 'primary',
  label,
  showIcon,
  icon,
  type = 'button',
  disabled = false,
  loading = false, // default false
  onClick,
}: ButtonProps) {
  const IconComponent = (icon && icon in LucideIcons
    ? LucideIcons[icon as keyof typeof LucideIcons]
    : LucideIcons.CircleArrowRight) as React.ElementType;

  const buttonClassName = `${Styles.button} ${Styles[variant] || ''}`;

  return (
    <button
      className={buttonClassName}
      onClick={onClick}
      disabled={disabled || loading} // disable if loading or disabled
      type={type}
      aria-label={!label && showIcon ? 'button icon' : label}
    >
      {loading ? (
        // Show loading indicator or text
        <span className={Styles.loadingText}>Loading...</span>
      ) : (
        <>
          {label && <span>{label}</span>}
          {showIcon && IconComponent && (
            <IconComponent className={Styles.buttonIcon} size={24} />
          )}
        </>
      )}
    </button>
  );
}
