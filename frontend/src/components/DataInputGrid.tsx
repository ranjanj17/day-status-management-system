import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { monthsWithColors, dayColors } from '../data/constants';

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
    
    const currentRecord = data.find(d => d.date === dateStr);
    
    try {
      if (value.trim() === '') return;
      
      const payload: any = { status: value };
      if (currentRecord?.version !== undefined) {
        payload.version = currentRecord.version;
      }

      const res = await api.put(`/day-status/${dateStr}`, payload);
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
    <div className="w-full h-full px-2 pb-2 sm:px-4 sm:pb-4 pt-[4px] flex flex-col">
      <div className="bg-white/95 backdrop-blur-2xl shadow-xl border border-white/50 rounded-xl pt-1 px-3 pb-3 sm:pt-1 sm:px-4 sm:pb-4 relative overflow-hidden flex flex-col flex-1 h-full">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-2 sm:mb-3 relative z-10 flex-none">
          <div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-800 tracking-tight">Data Input Dashboard</h2>
            <p className="text-slate-500 mt-0 font-semibold text-xs sm:text-sm">Manage daily statuses across the entire year</p>
          </div>
          
          <div className="mt-2 sm:mt-0 flex items-center space-x-3">
            <div className="relative">
              <select 
                value={year} 
                onChange={(e) => setYear(Number(e.target.value))} 
                className="pl-4 pr-10 py-1.5 sm:pl-5 sm:pr-12 sm:py-2 bg-white border border-blue-100 rounded-xl text-slate-700 font-extrabold focus:ring-2 focus:ring-blue-500/50 outline-none cursor-pointer hover:bg-blue-50/50 transition-all appearance-none text-sm sm:text-base hover:border-blue-200"
              >
                {[2024, 2025, 2026, 2027].map(y => <option key={y} value={y}>{y}</option>)}
              </select>
              <svg className="w-4 h-4 sm:w-5 sm:h-5 text-slate-500 absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>
        
        {error && (
          <div className="mb-3 p-3 sm:p-4 bg-red-50 border border-red-200 text-red-600 text-xs sm:text-sm font-bold rounded-xl flex items-center relative z-10 flex-none">
            <svg className="w-4 h-4 sm:w-5 sm:h-5 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
            {error}
          </div>
        )}

        <div className="rounded-xl sm:rounded-2xl border border-slate-200 overflow-hidden bg-slate-50 relative z-10 flex-1 flex flex-col min-h-0 shadow-sm">
          {loading ? (
            <div className="flex justify-center items-center py-32 flex-1">
              <div className="animate-spin rounded-full h-8 w-8 sm:h-10 sm:w-10 border-2 border-blue-500 border-t-transparent"></div>
            </div>
          ) : (
            <div className="flex-1 overflow-auto custom-scrollbar relative">
              <table className="w-full text-xs sm:text-sm text-left border-collapse bg-white">
                <thead className="text-[10px] text-slate-500 uppercase bg-slate-100/80 sticky top-0 z-30 shadow-sm font-extrabold tracking-widest border-b border-slate-200 backdrop-blur-md">
                  <tr>
                    <th className="px-2 py-3 sm:px-4 sm:py-4 border-r border-slate-200 bg-slate-100/90 backdrop-blur-md sticky left-0 z-40 min-w-[50px] sm:min-w-[60px] text-center shadow-[1px_0_0_0_#e2e8f0]">Day</th>
                    {monthsWithColors.map(m => (
                      <th key={m.name} className={`px-4 py-3 sm:px-6 sm:py-4 border-r border-slate-200 min-w-[120px] sm:min-w-[140px] xl:min-w-[160px] ${m.color}`}>{m.name}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {Array.from({ length: 31 }, (_, i) => i + 1).map((day) => {
                    const dayColor = dayColors[(day - 1) % dayColors.length];
                    
                    return (
                    <tr key={day} className="hover:bg-slate-50 transition-colors group">
                      <td className={`
                        px-2 py-2 sm:px-4 sm:py-2 border-r border-slate-200 bg-slate-50 group-hover:bg-slate-100
                        sticky left-0 z-20 text-center font-extrabold ${dayColor} transition-colors shadow-[1px_0_0_0_#e2e8f0] text-xs sm:text-sm
                      `}>
                        {day}
                      </td>
                      {Array.from({ length: 12 }, (_, i) => i + 1).map(month => {
                        const isValidDate = day <= daysInMonth[month - 1];
                        const dateStr = `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
                        const record = data.find(d => d.date === dateStr);
                        const isSaving = saving === dateStr;

                        return (
                          <td key={`${month}-${day}`} className={`p-1 border-r border-slate-100 ${!isValidDate ? 'bg-[url("data:image/svg+xml,%3Csvg width=\'10\' height=\'10\' viewBox=\'0 0 10 10\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'%23f1f5f9\' fill-opacity=\'1\' fill-rule=\'evenodd\'%3E%3Cpath d=\'M-1 11L11 -1V1L1 11H-1ZM11 11L-1 -1V1L9 11H11Z\'/%3E%3C/g%3E%3C/svg%3E")] bg-slate-100 cursor-not-allowed border-slate-200' : record?.status ? 'bg-blue-50/20' : 'bg-transparent hover:bg-slate-50'}`}>
                            {isValidDate ? (
                              <div className="relative h-full w-full">
                                <input
                                  type="text"
                                  defaultValue={record?.status || ''}
                                  placeholder="+ Add"
                                  onBlur={(e) => {
                                    if (e.target.value !== (record?.status || '')) {
                                      handleSave(month, day, e.target.value);
                                    }
                                  }}
                                  disabled={isSaving}
                                  className={`w-full h-10 sm:h-12 px-3 sm:px-4 py-2 outline-none focus:bg-white focus:ring-inset focus:ring-2 focus:ring-blue-500/50 transition-all font-bold disabled:opacity-50 text-xs sm:text-sm rounded-lg border cursor-text placeholder-transition ${record?.status ? 'bg-blue-50/40 border-blue-200 text-blue-700 shadow-sm' : 'bg-slate-50/80 border-transparent text-slate-800 placeholder-slate-400 hover:bg-blue-50/50 hover:border-blue-200 hover:placeholder-blue-500 hover:text-blue-600 hover:shadow-sm'}`}
                                />
                                {isSaving && (
                                  <div className="absolute right-2 sm:right-3 top-1/2 -translate-y-1/2">
                                    <svg className="animate-spin h-4 w-4 sm:h-5 sm:w-5 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                  </div>
                                )}
                              </div>
                            ) : (
                              <div className="text-slate-300 text-[10px] sm:text-xs text-center w-full h-12 sm:h-14 flex items-center justify-center font-extrabold uppercase tracking-widest opacity-80">Invalid</div>
                            )}
                          </td>
                        );
                      })}
                    </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
