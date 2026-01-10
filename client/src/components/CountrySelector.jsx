import React, { useState, useMemo } from 'react';
import { Search, ChevronDown, X } from 'lucide-react';

// Using ISO codes for flagcdn
const countries = [
    { code: '+1', name: 'USA', iso: 'us' },
    { code: '+1-809', name: 'Dominican', iso: 'do' },
    { code: '+1-876', name: 'Jamaica', iso: 'jm' },
    { code: '+44', name: 'UK', iso: 'gb' },
    { code: '+880', name: 'Bangladesh', iso: 'bd' },
    { code: '+91', name: 'India', iso: 'in' },
    { code: '+92', name: 'Pakistan', iso: 'pk' },
    { code: '+86', name: 'China', iso: 'cn' },
    { code: '+81', name: 'Japan', iso: 'jp' },
    { code: '+82', name: 'South Korea', iso: 'kr' },
    { code: '+971', name: 'UAE', iso: 'ae' },
    { code: '+966', name: 'Saudi Arabia', iso: 'sa' },
    { code: '+62', name: 'Indonesia', iso: 'id' },
    { code: '+60', name: 'Malaysia', iso: 'my' },
    { code: '+65', name: 'Singapore', iso: 'sg' },
    { code: '+63', name: 'Philippines', iso: 'ph' },
    { code: '+84', name: 'Vietnam', iso: 'vn' },
    { code: '+66', name: 'Thailand', iso: 'th' },
    { code: '+95', name: 'Myanmar', iso: 'mm' },
    { code: '+855', name: 'Cambodia', iso: 'kh' },
    { code: '+94', name: 'Sri Lanka', iso: 'lk' },
    { code: '+977', name: 'Nepal', iso: 'np' },
    { code: '+93', name: 'Afghanistan', iso: 'af' },
    { code: '+98', name: 'Iran', iso: 'ir' },
    { code: '+964', name: 'Iraq', iso: 'iq' },
    { code: '+90', name: 'Turkey', iso: 'tr' },
    { code: '+20', name: 'Egypt', iso: 'eg' },
    { code: '+27', name: 'South Africa', iso: 'za' },
    { code: '+234', name: 'Nigeria', iso: 'ng' },
    { code: '+254', name: 'Kenya', iso: 'ke' },
    { code: '+55', name: 'Brazil', iso: 'br' },
    { code: '+52', name: 'Mexico', iso: 'mx' },
    { code: '+54', name: 'Argentina', iso: 'ar' },
    { code: '+57', name: 'Colombia', iso: 'co' },
    { code: '+33', name: 'France', iso: 'fr' },
    { code: '+49', name: 'Germany', iso: 'de' },
    { code: '+39', name: 'Italy', iso: 'it' },
    { code: '+34', name: 'Spain', iso: 'es' },
    { code: '+7', name: 'Russia', iso: 'ru' },
    { code: '+61', name: 'Australia', iso: 'au' },
    { code: '+64', name: 'New Zealand', iso: 'nz' },
];

const CountrySelector = ({ value, onChange, name = "countryCode" }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    const selectedCountry = countries.find(c => c.code === value) || countries[0];

    const filteredCountries = useMemo(() => {
        return countries.filter(country =>
            country.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            country.code.includes(searchTerm)
        );
    }, [searchTerm]);

    const handleSelect = (code) => {
        const event = {
            target: {
                name: name,
                value: code
            }
        };
        onChange(event);
        setIsOpen(false);
    };

    return (
        <>
            {/* Trigger Button */}
            <button
                type="button"
                onClick={() => setIsOpen(true)}
                className="bg-glass-light backdrop-blur-md border border-white/10 rounded-2xl w-[90px] flex items-center justify-between text-sm px-3 py-3 text-white hover:bg-glass-medium transition-colors"
            >
                <span className="flex items-center gap-2">
                    <img
                        src={`https://flagcdn.com/w20/${selectedCountry.iso.toLowerCase()}.png`}
                        srcSet={`https://flagcdn.com/w40/${selectedCountry.iso.toLowerCase()}.png 2x`}
                        width="20"
                        alt={selectedCountry.name}
                        className="rounded-sm object-cover"
                    />
                    <span>{selectedCountry.code}</span>
                </span>
                <ChevronDown size={14} className="text-white/60" />
            </button>

            {/* Modal Overlay */}
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div
                        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                        onClick={() => setIsOpen(false)}
                    ></div>

                    <div className="bg-dark-200 border border-white/10 rounded-2xl w-full max-w-sm max-h-[80vh] flex flex-col relative z-10 animate-float shadow-glow-lg overflow-hidden">
                        {/* Header */}
                        <div className="p-4 border-b border-white/10 flex items-center justify-between bg-dark-200 sticky top-0 z-20">
                            <h3 className="text-white font-semibold">Choose Country Code</h3>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="text-white/60 hover:text-white transition-colors"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        {/* Search */}
                        <div className="p-4 bg-dark-200 sticky top-[60px] z-20">
                            <div className="relative">
                                <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" />
                                <input
                                    type="text"
                                    placeholder="Search country or code..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full bg-dark-300 border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-white text-sm focus:outline-none focus:border-primary/50 transition-colors"
                                />
                            </div>
                        </div>

                        {/* List */}
                        <div className="flex-1 overflow-y-auto p-2 scrollbar-thin">
                            {filteredCountries.map((country) => (
                                <button
                                    key={country.iso}
                                    onClick={() => handleSelect(country.code)}
                                    className={`w-full flex items-center gap-3 p-3 rounded-xl transition-colors ${value === country.code
                                        ? 'bg-primary/20 border border-primary/30'
                                        : 'hover:bg-white/5 border border-transparent'
                                        }`}
                                >
                                    <img
                                        src={`https://flagcdn.com/w40/${country.iso.toLowerCase()}.png`}
                                        width="30"
                                        alt={country.name}
                                        className="rounded-md object-cover"
                                    />
                                    <div className="flex-1 text-left">
                                        <div className="text-white text-sm font-medium">{country.name}</div>
                                        <div className="text-white/50 text-xs">{country.code}</div>
                                    </div>
                                    {value === country.code && (
                                        <div className="w-2 h-2 rounded-full bg-primary shadow-glow"></div>
                                    )}
                                </button>
                            ))}

                            {filteredCountries.length === 0 && (
                                <div className="text-center py-8 text-white/40 text-sm">
                                    No countries found
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default CountrySelector;
