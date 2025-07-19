'use client';

import React, { useState, useRef, useEffect } from 'react';
import * as Icons from 'lucide-react';
import Styles from './Input.module.css';
import Button from '@/ui/button/Button';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { ChevronDown } from 'lucide-react';

interface InputProps {
  label?: string;
  name?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
  disabled?: boolean;
  type?:
    | 'text'
    | 'email'
    | 'password'
    | 'date'
    | 'datetime-local'
    | 'number'
    | 'tel'
    | 'url'
    | 'search';
  placeholder?: string;
  showIcon?: boolean;
  icon?: keyof typeof Icons; // icon name like 'User', 'Mail'
  showHelpText?: boolean;
  helpText?: string;
}

export default function Input({
  label,
  name,
  value,
  onChange,
  required,
  disabled,
  type = 'text',
  placeholder = '',
  showIcon = false,
  icon,
  showHelpText,
  helpText,
}: InputProps) {
  const [showPassword, setShowPassword] = useState(false);
  const togglePassword = () => setShowPassword((prev) => !prev);
  const isPassword = type === 'password';

  const [calendarOpen, setCalendarOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(
    value ? new Date(value) : null
  );

  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setCalendarOpen(false);
      }
    }

    if (calendarOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [calendarOpen]);

  const getDefaultIconByType = (): React.ElementType | undefined => {
    switch (type) {
      case 'search':
        return Icons.Search;
      case 'url':
        return Icons.Link;
      case 'tel':
        return Icons.Phone;
      case 'date':
      case 'datetime-local':
        return Icons.Calendar;
      case 'password':
        return Icons.Lock;
      case 'email':
        return Icons.Mail;
      case 'number':
        return Icons.Hash;
      default:
        return undefined;
    }
  };

  const IconComponent = (icon ? Icons[icon] : getDefaultIconByType()) as React.ElementType;

  const formatSelectedDate = (date: Date | null): string => {
    if (!date) return '';
    if (type === 'date') {
      return date.toISOString().slice(0, 10); // YYYY-MM-DD
    } else if (type === 'datetime-local') {
      return date.toISOString().slice(0, 16); // YYYY-MM-DDTHH:mm
    }
    return '';
  };

  const handleDateChange = (date: Date | null) => {
    setSelectedDate(date);
    if (!date) return;

    const formattedValue = formatSelectedDate(date);

    if (onChange) {
      onChange({
        target: {
          name: name ?? '',
          value: formattedValue,
        },
      } as React.ChangeEvent<HTMLInputElement>);
    }

    setCalendarOpen(false);
  };

  const safeOnChange = onChange ?? (() => {});

  return (
    <div className={Styles.container} ref={containerRef}>
      {label && <label htmlFor={name}>{label}</label>}

      <div className={Styles.wrapper}>
        <div className={Styles.inputWrapper}>
          {showIcon && IconComponent && (
            <IconComponent className={Styles.icon} size={24} />
          )}

          <input
            className={Styles.inputelement}
            id={name}
            name={name}
            type={
              type === 'date' || type === 'datetime-local'
                ? 'text'
                : isPassword && showPassword
                ? 'text'
                : type
            }
            placeholder={
              !value && (type === 'date' || type === 'datetime-local')
                ? formatSelectedDate(selectedDate) || placeholder
                : placeholder
            }
            value={value ?? ''}
            onChange={safeOnChange}
            required={required}
            disabled={disabled}
            autoComplete="off"
          />

          {(type === 'date' || type === 'datetime-local') && (
            <ChevronDown
              className={Styles.chevronIcon}
              size={20}
              onClick={() => setCalendarOpen((open) => !open)}
              style={{ cursor: 'pointer' }}
            />
          )}

          {calendarOpen && (type === 'date' || type === 'datetime-local') && (
            <div className={Styles.calendarPopup}>
              <DatePicker
                selected={selectedDate}
                onChange={handleDateChange}
                inline
                showTimeSelect={type === 'datetime-local'}
                dateFormat={
                  type === 'datetime-local' ? 'yyyy-MM-dd HH:mm' : 'yyyy-MM-dd'
                }
                timeIntervals={15}
                calendarClassName={Styles.customDatepicker}
              />
            </div>
          )}
        </div>

        {isPassword && (
          <Button
            variant="icon"
            showIcon
            icon={showPassword ? 'EyeOff' : 'Eye'}
            onClick={togglePassword}
          />
        )}
      </div>

      {showHelpText && helpText && (
        <p className="muted-text">{helpText}</p>
      )}
    </div>
  );
}
