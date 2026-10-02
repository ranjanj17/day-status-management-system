import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { monthsWithColors, dayColors } from '../data/constants';

const StatusCell = ({ record, month, day, isSaving, onClick }: any) => {
  if (isSaving) {
    return (
      <div className="relative w-full h-10 sm:h-12 px-3 sm:px-4 py-2 bg-slate-50 border border-slate-100 rounded-lg flex items-center justify-center shadow-inner">
        <svg className="animate-spin h-4 w-4 sm:h-5 sm:w-5 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      </div>
    );
  }

  if (!record?.status) {
    return (
      <button
        onClick={() => onClick(month, day, record)}
        className="w-full h-10 sm:h-12 px-3 py-2 outline-none font-bold text-[11px] sm:text-xs rounded-lg border bg-slate-50/80 border-transparent text-slate-400 hover:bg-blue-50/50 hover:border-blue-200 hover:text-blue-600 transition-all text-left flex items-center whitespace-nowrap overflow-hidden"
      >
        + Add
      </button>
    );
  }

  return (
    <button 
      onClick={() => onClick(month, day, record)}
      className="group/cell relative w-full h-10 sm:h-12 px-3 py-2 bg-pink-50/60 border border-pink-200 rounded-lg flex items-center shadow-sm transition-all hover:shadow-md cursor-pointer hover:border-pink-300 text-left overflow-hidden"
      title={record.status}
    >
      <span className="text-[11px] sm:text-xs font-bold text-rose-600 truncate w-full block">{record.status}</span>
    </button>
  );
};

const StatusModal = ({ month, day, year, record, onClose, onSave, onDelete, isSaving }: any) => {
  const [val, setVal] = useState(record?.status || '');
  const monthName = monthsWithColors[month - 1].name;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden border border-slate-100 animate-in zoom-in-95 duration-200">
        <div className="p-5 sm:p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
          <h3 className="text-lg sm:text-xl font-extrabold text-slate-800">
            {monthName} {day}, {year}
          </h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-700 transition-colors p-1 rounded-md hover:bg-slate-200">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>
        <div className="p-5 sm:p-6">
          <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Status Update</label>
          <textarea
            autoFocus
            value={val}
            onChange={e => setVal(e.target.value)}
            placeholder="Enter your status for the day..."
            className="w-full h-32 px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 outline-none transition-all resize-none text-slate-800 font-medium sm:text-sm text-base shadow-inner"
          />
        </div>
        <div className="p-4 sm:p-5 border-t border-slate-100 bg-slate-50/50 flex justify-end items-center space-x-3">
          {record && (
             <button
               onClick={() => onDelete(month, day)}
               disabled={isSaving}
               className="px-4 py-2 text-sm font-bold text-rose-600 hover:bg-rose-100 bg-rose-50 border border-rose-100 rounded-lg transition-colors mr-auto disabled:opacity-50"
             >
               Delete
             </button>
          )}
          <button onClick={onClose} disabled={isSaving} className="px-4 py-2 text-sm font-bold text-slate-600 hover:bg-slate-200 bg-slate-100 rounded-lg transition-colors disabled:opacity-50">
            Cancel
          </button>
          <button 
            onClick={() => onSave(month, day, val)}
            disabled={isSaving || val.trim() === ''}
            className="px-6 py-2 text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors shadow-md shadow-blue-500/20 disabled:opacity-50 flex items-center justify-center min-w-[100px]"
          >
            {isSaving ? 'Saving...' : 'Save'}
          </button>
        </div>
      </div>
    </div>
  );
};

export const DataInputGrid: React.FC = () => {
  const [year, setYear] = useState(new Date().getFullYear());
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  // Modal state
  const [editingCell, setEditingCell] = useState<{ month: number, day: number, record: any } | null>(null);

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
      if (value.trim() === '') {
        if (currentRecord) {
          await api.delete(`/day-status/${dateStr}`);
          setData(prev => prev.filter(d => d.date !== dateStr));
        }
        setEditingCell(null);
        return;
      }
      
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
      setEditingCell(null);
    } catch (err: any) {
      setError(err.response?.data?.error?.message || 'Failed to save');
    } finally {
      setSaving(null);
    }
  };

  const handleDelete = async (month: number, day: number) => {
    await handleSave(month, day, '');
  };

  const isLeapYear = (y: number) => (y % 4 === 0 && y % 100 !== 0) || (y % 400 === 0);
  const daysInMonth = [31, isLeapYear(year) ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

  return (
    <div className="w-full h-full px-2 pb-2 sm:px-4 sm:pb-4 pt-[4px] flex flex-col">
      {editingCell && (
        <StatusModal
          month={editingCell.month}
          day={editingCell.day}
          year={year}
          record={editingCell.record}
          isSaving={saving === `${year}-${editingCell.month.toString().padStart(2, '0')}-${editingCell.day.toString().padStart(2, '0')}`}
          onClose={() => setEditingCell(null)}
          onSave={handleSave}
          onDelete={handleDelete}
        />
      )}

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
              <table className="w-full table-fixed text-xs sm:text-sm text-left border-collapse bg-white">
                <thead className="text-[10px] text-slate-500 uppercase bg-slate-100/80 sticky top-0 z-30 shadow-sm font-extrabold tracking-widest border-b border-slate-200 backdrop-blur-md">
                  <tr>
                    <th className="px-2 py-3 sm:px-4 sm:py-4 border-r border-slate-200 bg-slate-100/90 backdrop-blur-md sticky left-0 z-40 w-[50px] sm:w-[60px] text-center shadow-[1px_0_0_0_#e2e8f0]">Day</th>
                    {monthsWithColors.map(m => (
                      <th key={m.name} className={`px-4 py-3 sm:px-6 sm:py-4 border-r border-slate-200 w-[120px] sm:w-[140px] xl:w-[150px] truncate ${m.color}`}>{m.name}</th>
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
                          <td key={`${month}-${day}`} className={`p-1 border-r border-slate-100 w-[120px] sm:w-[140px] xl:w-[150px] ${!isValidDate ? 'bg-[url("data:image/svg+xml,%3Csvg width=\'10\' height=\'10\' viewBox=\'0 0 10 10\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'%23f1f5f9\' fill-opacity=\'1\' fill-rule=\'evenodd\'%3E%3Cpath d=\'M-1 11L11 -1V1L1 11H-1ZM11 11L-1 -1V1L9 11H11Z\'/%3E%3C/g%3E%3C/svg%3E")] bg-slate-100 cursor-not-allowed border-slate-200' : record?.status ? 'bg-blue-50/20' : 'bg-transparent hover:bg-slate-50'}`}>
                            {isValidDate ? (
                              <StatusCell 
                                record={record} 
                                month={month} 
                                day={day} 
                                isSaving={isSaving} 
                                onClick={(m: number, d: number, r: any) => setEditingCell({ month: m, day: d, record: r })} 
                              />
                            ) : (
                              <div className="text-slate-300 text-[10px] sm:text-xs text-center w-full h-12 flex items-center justify-center font-extrabold uppercase tracking-widest opacity-80">Invalid</div>
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
