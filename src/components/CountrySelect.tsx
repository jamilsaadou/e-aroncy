"use client";

import React from 'react';
import { MapPin } from 'lucide-react';
import { getLocalizedCountries } from '../constants/country-codes';

type Props = {
  id?: string;
  name?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  required?: boolean;
  disabled?: boolean;
  placeholder?: string;
  locale?: string; // default 'fr'
  className?: string;
};

export default function CountrySelect({
  id = 'country',
  name = 'country',
  value,
  onChange,
  required,
  disabled,
  placeholder = 'Sélectionner un pays',
  locale = 'fr',
  className = ''
}: Props) {
  const countries = React.useMemo(() => getLocalizedCountries(locale), [locale]);

  return (
    <div className={`relative ${className}`}>
      <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-green-600 pointer-events-none" />
      <select
        id={id}
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        disabled={disabled}
        className="block w-full appearance-none pl-10 pr-10 py-2.5 bg-white text-green-700 border-2 border-green-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-green-600 hover:border-green-600 transition-colors"
      >
        <option value="">{placeholder}</option>
        {countries.map((c) => (
          <option key={c.code} value={c.code}>
            {c.name}
          </option>
        ))}
      </select>
      <svg
        className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-green-600"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 20 20"
        fill="currentColor"
        aria-hidden="true"
      >
        <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.937a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clipRule="evenodd" />
      </svg>
    </div>
  );
}

