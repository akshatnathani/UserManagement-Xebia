import { useState, useRef, useEffect } from 'react';
import './PhoneInput.css';

/**
 * International Phone Input Component.
 * Implements country selection flags with autocomplete searches,
 * dial-code prefixes, and system locale country auto-detection.
 *
 * @author akshatnathani
 * @version 1.0.0
 * @component PhoneInput
 */
export interface Country {
  name: string;
  code: string;   // ISO alpha-2, e.g. "IN"
  dial: string;   // e.g. "+91"
  flag: string;   // emoji flag
}

// Comprehensive list of countries with dial codes
export const COUNTRIES: Country[] = [
  { name: 'Afghanistan', code: 'AF', dial: '+93', flag: '🇦🇫' },
  { name: 'Albania', code: 'AL', dial: '+355', flag: '🇦🇱' },
  { name: 'Algeria', code: 'DZ', dial: '+213', flag: '🇩🇿' },
  { name: 'Argentina', code: 'AR', dial: '+54', flag: '🇦🇷' },
  { name: 'Australia', code: 'AU', dial: '+61', flag: '🇦🇺' },
  { name: 'Austria', code: 'AT', dial: '+43', flag: '🇦🇹' },
  { name: 'Bangladesh', code: 'BD', dial: '+880', flag: '🇧🇩' },
  { name: 'Belgium', code: 'BE', dial: '+32', flag: '🇧🇪' },
  { name: 'Brazil', code: 'BR', dial: '+55', flag: '🇧🇷' },
  { name: 'Canada', code: 'CA', dial: '+1', flag: '🇨🇦' },
  { name: 'Chile', code: 'CL', dial: '+56', flag: '🇨🇱' },
  { name: 'China', code: 'CN', dial: '+86', flag: '🇨🇳' },
  { name: 'Colombia', code: 'CO', dial: '+57', flag: '🇨🇴' },
  { name: 'Czech Republic', code: 'CZ', dial: '+420', flag: '🇨🇿' },
  { name: 'Denmark', code: 'DK', dial: '+45', flag: '🇩🇰' },
  { name: 'Egypt', code: 'EG', dial: '+20', flag: '🇪🇬' },
  { name: 'Ethiopia', code: 'ET', dial: '+251', flag: '🇪🇹' },
  { name: 'Finland', code: 'FI', dial: '+358', flag: '🇫🇮' },
  { name: 'France', code: 'FR', dial: '+33', flag: '🇫🇷' },
  { name: 'Germany', code: 'DE', dial: '+49', flag: '🇩🇪' },
  { name: 'Ghana', code: 'GH', dial: '+233', flag: '🇬🇭' },
  { name: 'Greece', code: 'GR', dial: '+30', flag: '🇬🇷' },
  { name: 'Hong Kong', code: 'HK', dial: '+852', flag: '🇭🇰' },
  { name: 'Hungary', code: 'HU', dial: '+36', flag: '🇭🇺' },
  { name: 'India', code: 'IN', dial: '+91', flag: '🇮🇳' },
  { name: 'Indonesia', code: 'ID', dial: '+62', flag: '🇮🇩' },
  { name: 'Iran', code: 'IR', dial: '+98', flag: '🇮🇷' },
  { name: 'Iraq', code: 'IQ', dial: '+964', flag: '🇮🇶' },
  { name: 'Ireland', code: 'IE', dial: '+353', flag: '🇮🇪' },
  { name: 'Israel', code: 'IL', dial: '+972', flag: '🇮🇱' },
  { name: 'Italy', code: 'IT', dial: '+39', flag: '🇮🇹' },
  { name: 'Japan', code: 'JP', dial: '+81', flag: '🇯🇵' },
  { name: 'Jordan', code: 'JO', dial: '+962', flag: '🇯🇴' },
  { name: 'Kenya', code: 'KE', dial: '+254', flag: '🇰🇪' },
  { name: 'Kuwait', code: 'KW', dial: '+965', flag: '🇰🇼' },
  { name: 'Malaysia', code: 'MY', dial: '+60', flag: '🇲🇾' },
  { name: 'Mexico', code: 'MX', dial: '+52', flag: '🇲🇽' },
  { name: 'Morocco', code: 'MA', dial: '+212', flag: '🇲🇦' },
  { name: 'Nepal', code: 'NP', dial: '+977', flag: '🇳🇵' },
  { name: 'Netherlands', code: 'NL', dial: '+31', flag: '🇳🇱' },
  { name: 'New Zealand', code: 'NZ', dial: '+64', flag: '🇳🇿' },
  { name: 'Nigeria', code: 'NG', dial: '+234', flag: '🇳🇬' },
  { name: 'Norway', code: 'NO', dial: '+47', flag: '🇳🇴' },
  { name: 'Oman', code: 'OM', dial: '+968', flag: '🇴🇲' },
  { name: 'Pakistan', code: 'PK', dial: '+92', flag: '🇵🇰' },
  { name: 'Philippines', code: 'PH', dial: '+63', flag: '🇵🇭' },
  { name: 'Poland', code: 'PL', dial: '+48', flag: '🇵🇱' },
  { name: 'Portugal', code: 'PT', dial: '+351', flag: '🇵🇹' },
  { name: 'Qatar', code: 'QA', dial: '+974', flag: '🇶🇦' },
  { name: 'Romania', code: 'RO', dial: '+40', flag: '🇷🇴' },
  { name: 'Russia', code: 'RU', dial: '+7', flag: '🇷🇺' },
  { name: 'Saudi Arabia', code: 'SA', dial: '+966', flag: '🇸🇦' },
  { name: 'Singapore', code: 'SG', dial: '+65', flag: '🇸🇬' },
  { name: 'South Africa', code: 'ZA', dial: '+27', flag: '🇿🇦' },
  { name: 'South Korea', code: 'KR', dial: '+82', flag: '🇰🇷' },
  { name: 'Spain', code: 'ES', dial: '+34', flag: '🇪🇸' },
  { name: 'Sri Lanka', code: 'LK', dial: '+94', flag: '🇱🇰' },
  { name: 'Sweden', code: 'SE', dial: '+46', flag: '🇸🇪' },
  { name: 'Switzerland', code: 'CH', dial: '+41', flag: '🇨🇭' },
  { name: 'Taiwan', code: 'TW', dial: '+886', flag: '🇹🇼' },
  { name: 'Tanzania', code: 'TZ', dial: '+255', flag: '🇹🇿' },
  { name: 'Thailand', code: 'TH', dial: '+66', flag: '🇹🇭' },
  { name: 'Turkey', code: 'TR', dial: '+90', flag: '🇹🇷' },
  { name: 'UAE', code: 'AE', dial: '+971', flag: '🇦🇪' },
  { name: 'Uganda', code: 'UG', dial: '+256', flag: '🇺🇬' },
  { name: 'Ukraine', code: 'UA', dial: '+380', flag: '🇺🇦' },
  { name: 'United Kingdom', code: 'GB', dial: '+44', flag: '🇬🇧' },
  { name: 'United States', code: 'US', dial: '+1', flag: '🇺🇸' },
  { name: 'Venezuela', code: 'VE', dial: '+58', flag: '🇻🇪' },
  { name: 'Vietnam', code: 'VN', dial: '+84', flag: '🇻🇳' },
];

interface PhoneInputProps {
  value: string;           // full value e.g. "+91 9876543210"
  onChange: (value: string) => void;
  id?: string;
  required?: boolean;
  className?: string;
}

// Detect country from system locale
function detectDefaultCountry(): Country {
  try {
    const locale = Intl.DateTimeFormat().resolvedOptions().locale;
    const region = locale.split('-')[1]?.toUpperCase();
    const found = COUNTRIES.find((c) => c.code === region);
    if (found) return found;
  } catch (_) { /* ignore */ }
  // Fallback to India
  return COUNTRIES.find((c) => c.code === 'IN')!;
}

export default function PhoneInput({ value, onChange, id, required, className }: PhoneInputProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<Country>(() => {
    // Try to match existing value's dial code
    if (value) {
      const match = COUNTRIES.find((c) => value.startsWith(c.dial));
      if (match) return match;
    }
    return detectDefaultCountry();
  });
  const [number, setNumber] = useState(() => {
    if (value && value.startsWith(selected.dial)) {
      return value.slice(selected.dial.length).trim();
    }
    return value || '';
  });

  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpen(false);
        setSearch('');
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  // Focus search when dropdown opens
  useEffect(() => {
    if (open) setTimeout(() => searchRef.current?.focus(), 50);
  }, [open]);

  const filtered = COUNTRIES.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.dial.includes(search) ||
      c.code.toLowerCase().includes(search.toLowerCase())
  );

  const selectCountry = (country: Country) => {
    setSelected(country);
    setOpen(false);
    setSearch('');
    onChange(`${country.dial} ${number}`.trim());
  };

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/[^\d\s\-()]/g, '');
    setNumber(raw);
    onChange(`${selected.dial} ${raw}`.trim());
  };

  return (
    <div className={`phone-input-wrapper ${className || ''}`} ref={dropdownRef}>
      {/* Country selector trigger */}
      <button
        type="button"
        id={`${id}-country`}
        className="phone-country-btn"
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="listbox"
        aria-expanded={open}
        title={`${selected.name} (${selected.dial})`}
      >
        <span className="phone-flag">{selected.flag}</span>
        <span className="phone-dial">{selected.dial}</span>
        <svg className={`phone-chevron ${open ? 'phone-chevron--up' : ''}`} width="12" height="12" viewBox="0 0 12 12" fill="none">
          <path d="M2.5 4.5L6 8L9.5 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>

      {/* Number input */}
      <input
        id={id}
        type="tel"
        className="phone-number-input"
        placeholder="98765 43210"
        value={number}
        onChange={handleNumberChange}
        required={required}
        autoComplete="tel-national"
        inputMode="tel"
      />

      {/* Dropdown */}
      {open && (
        <div className="phone-dropdown" role="listbox">
          <div className="phone-search-wrap">
            <svg className="phone-search-icon" width="14" height="14" viewBox="0 0 14 14" fill="none">
              <circle cx="6" cy="6" r="4.5" stroke="currentColor" strokeWidth="1.4"/>
              <path d="M9.5 9.5L12 12" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
            </svg>
            <input
              ref={searchRef}
              className="phone-search-input"
              type="text"
              placeholder="Search country or code…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              aria-label="Search country"
            />
          </div>
          <ul className="phone-country-list">
            {filtered.length === 0 && (
              <li className="phone-no-results">No countries found</li>
            )}
            {filtered.map((c) => (
              <li
                key={c.code}
                role="option"
                aria-selected={c.code === selected.code}
                className={`phone-country-item ${c.code === selected.code ? 'phone-country-item--active' : ''}`}
                onClick={() => selectCountry(c)}
              >
                <span className="phone-item-flag">{c.flag}</span>
                <span className="phone-item-name">{c.name}</span>
                <span className="phone-item-dial">{c.dial}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
