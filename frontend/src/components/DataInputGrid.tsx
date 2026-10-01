import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { useAuth } from '../contexts/AuthContext';

export const DataInputGrid: React.FC = () => {
  const [year, setYear] = useState(new Date().getFullYear());
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchYearData = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get(`/day-status?year=${year}`);
      setData(res.data.data);
    } catch (err) {
      setError('Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchYearData();
  }, [year]);

  const handleSave = async (month: number, day: number, value: string) => {
    const dateStr = `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
    setSaving(dateStr);
    setError(null);
    try {
      if (value.trim() === '') return;
      const res = await api.put(`/day-status/${dateStr}`, { status: value });
      // Update local state
      setData(prev => {
        const idx = prev.findIndex(d => d.date === dateStr);
        if (idx !== -1) {
          const newData = [...prev];
          newData[idx] = res.data.data;
          return newData;
        }
        return [...prev, res.data.data];
      });
    } catch (err: any) {
      setError(err.response?.data?.error?.message || 'Failed to save');
    } finally {
      setSaving(null);
    }
  };

  const isLeapYear = (y: number) => (y % 4 === 0 && y % 100 !== 0) || (y % 400 === 0);
  const daysInMonth = [31, isLeapYear(year) ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Data Input Grid</h2>
        <select value={year} onChange={(e) => setYear(Number(e.target.value))} className="p-2 border rounded">
          {[2024, 2025, 2026, 2027].map(y => <option key={y} value={y}>{y}</option>)}
        </select>
      </div>
      
      {error && <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">{error}</div>}

      <div className="table-container overflow-x-auto bg-white shadow-md rounded">
        {loading ? (
          <div className="p-10 text-center text-gray-500">Loading...</div>
        ) : (
          <table className="min-w-full border-collapse border border-slate-300">
            <thead>
              <tr>
                <th className="border border-slate-300 p-2 bg-slate-100 sticky left-0 z-10 w-16">Day</th>
                {['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'].map(m => (
                  <th key={m} className="border border-slate-300 p-2 bg-slate-100 min-w-[150px]">{m}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {Array.from({ length: 31 }, (_, i) => i + 1).map(day => (
                <tr key={day} className="hover:bg-slate-50">
                  <td className="border border-slate-300 p-2 text-center font-bold bg-slate-100 sticky left-0 z-10">
                    {day}
                  </td>
                  {Array.from({ length: 12 }, (_, i) => i + 1).map(month => {
                    const isValidDate = day <= daysInMonth[month - 1];
                    const dateStr = `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
                    const record = data.find(d => d.date === dateStr);
                    const isSaving = saving === dateStr;

                    return (
                      <td key={`${month}-${day}`} className={`border border-slate-300 p-1 ${!isValidDate ? 'bg-gray-200' : ''}`}>
                        {isValidDate ? (
                          <div className="relative">
                            <input
                              type="text"
                              defaultValue={record?.status || ''}
                              placeholder="Enter status"
                              onBlur={(e) => {
                                if (e.target.value !== (record?.status || '')) {
                                  handleSave(month, day, e.target.value);
                                }
                              }}
                              disabled={isSaving}
                              className="w-full p-1 text-sm outline-none bg-transparent focus:bg-white focus:ring-1 focus:ring-blue-500 rounded"
                            />
                            {isSaving && <div className="absolute right-1 top-1 text-xs text-blue-500 animate-pulse">saving...</div>}
                          </div>
                        ) : (
                          <div className="text-gray-400 text-xs text-center">-</div>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};
