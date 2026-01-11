
import React, { useState, useEffect, useRef } from 'react';
import { getStationSuggestions } from '../services/grok';

interface SearchHeroProps {
  onSearch: (from: string, to: string, date: string) => void;
}

export const SearchHero: React.FC<SearchHeroProps> = ({ onSearch }) => {
  const [from, setFrom] = useState('New Delhi (NDLS)');
  const [to, setTo] = useState('Mumbai Central (MMCT)');
  const [date, setDate] = useState('2026-09-01');

  const [fromSuggestions, setFromSuggestions] = useState<string[]>([]);
  const [toSuggestions, setToSuggestions] = useState<string[]>([]);
  const [sources, setSources] = useState<string[]>([]);
  const [activeField, setActiveField] = useState<'from' | 'to' | null>(null);
  const [loading, setLoading] = useState(false);

  const debounceTimer = useRef<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close suggestions on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setActiveField(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const fetchSuggestions = async (query: string, field: 'from' | 'to') => {
    if (debounceTimer.current) clearTimeout(debounceTimer.current);

    setLoading(true);
    debounceTimer.current = window.setTimeout(async () => {
      const result = await getStationSuggestions(query);
      if (field === 'from') setFromSuggestions(result.suggestions);
      else setToSuggestions(result.suggestions);
      setSources(result.sources);
      setLoading(false);
    }, 500);
  };

  const handleInputChange = (val: string, field: 'from' | 'to') => {
    if (field === 'from') setFrom(val);
    else setTo(val);

    if (val.length > 1) {
      setActiveField(field);
      fetchSuggestions(val, field);
    } else {
      if (field === 'from') setFromSuggestions([]);
      else setToSuggestions([]);
    }
  };

  const selectSuggestion = (val: string) => {
    if (activeField === 'from') setFrom(val);
    else if (activeField === 'to') setTo(val);
    setFromSuggestions([]);
    setToSuggestions([]);
    setActiveField(null);
  };

  return (
    <div className="gradient-blue pb-40 pt-16 px-6">
      <div className="max-w-5xl mx-auto text-center">
        <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-6">
          Book Tickets Faster, <br /><span className="text-blue-200">Travel Smoother.</span>
        </h1>
        <p className="text-blue-100 text-lg mb-12 max-w-2xl mx-auto">
          India's most intuitive railway booking platform. Powered by real-time AI search.
        </p>

        <div ref={containerRef} className="bg-white p-2 rounded-[2rem] shadow-2xl flex flex-col md:flex-row items-center relative max-w-5xl mx-auto border border-white/20">
          {/* FROM SECTION */}
          <div className="flex-1 w-full p-6 text-left relative">
            <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1 ml-1">From</label>
            <div className="relative">
              <input
                type="text"
                value={from}
                onChange={(e) => handleInputChange(e.target.value, 'from')}
                onFocus={() => setActiveField('from')}
                className="w-full text-xl font-bold text-gray-800 focus:outline-none bg-transparent"
                placeholder="Source Station"
              />
              {activeField === 'from' && fromSuggestions.length > 0 && (
                <div className="absolute top-full left-0 w-full mt-4 bg-white rounded-2xl shadow-2xl border border-gray-100 z-50 overflow-hidden">
                  {fromSuggestions.map((s, i) => (
                    <button
                      key={i}
                      onClick={() => selectSuggestion(s)}
                      className="w-full text-left px-6 py-4 hover:bg-blue-50 text-gray-700 font-semibold border-b border-gray-50 last:border-0"
                    >
                      {s}
                    </button>
                  ))}
                  {sources.length > 0 && (
                    <div className="p-2 bg-gray-50 text-[10px] text-gray-400 italic flex gap-2 overflow-hidden whitespace-nowrap px-6">
                      Sources: {sources.slice(0, 2).map((url, i) => <a key={i} href={url} target="_blank" className="underline">{url.substring(0, 20)}...</a>)}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* SWAP BUTTON */}
          <div className="px-2">
            <button
              onClick={() => { const temp = from; setFrom(to); setTo(temp); }}
              className="bg-blue-50 p-3 rounded-full text-blue-600 hover:bg-blue-100 transition shadow-sm border border-blue-100"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
              </svg>
            </button>
          </div>

          {/* TO SECTION */}
          <div className="flex-1 w-full p-6 text-left relative">
            <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1 ml-1">To</label>
            <div className="relative">
              <input
                type="text"
                value={to}
                onChange={(e) => handleInputChange(e.target.value, 'to')}
                onFocus={() => setActiveField('to')}
                className="w-full text-xl font-bold text-gray-800 focus:outline-none bg-transparent"
                placeholder="Destination Station"
              />
              {activeField === 'to' && toSuggestions.length > 0 && (
                <div className="absolute top-full left-0 w-full mt-4 bg-white rounded-2xl shadow-2xl border border-gray-100 z-50 overflow-hidden">
                  {toSuggestions.map((s, i) => (
                    <button
                      key={i}
                      onClick={() => selectSuggestion(s)}
                      className="w-full text-left px-6 py-4 hover:bg-blue-50 text-gray-700 font-semibold border-b border-gray-50 last:border-0"
                    >
                      {s}
                    </button>
                  ))}
                  {sources.length > 0 && (
                    <div className="p-2 bg-gray-50 text-[10px] text-gray-400 italic flex gap-2 overflow-hidden whitespace-nowrap px-6">
                      Sources: {sources.slice(0, 2).map((url, i) => <a key={i} href={url} target="_blank" className="underline">{url.substring(0, 20)}...</a>)}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* DATE SECTION */}
          <div className="flex-1 w-full p-6 text-left border-l border-gray-100 group relative">
            <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1 ml-1">Departure Date</label>
            <div className="flex items-center relative">
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full text-xl font-bold text-gray-800 focus:outline-none bg-transparent cursor-pointer relative z-10"
                style={{ appearance: 'none' }}
              />
              <div className="absolute right-0 pointer-events-none z-0">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
            </div>
          </div>

          {/* SEARCH BUTTON */}
          <div className="p-2">
            <button
              onClick={() => onSearch(from, to, date)}
              className="w-full md:w-auto bg-orange-500 hover:bg-orange-600 text-white font-extrabold py-5 px-12 rounded-[1.5rem] shadow-xl transition-all hover:scale-[1.02] active:scale-95 text-lg"
            >
              SEARCH
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
