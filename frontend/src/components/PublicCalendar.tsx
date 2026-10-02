import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { weekdaysWithColors } from '../data/constants';

export const PublicCalendar: React.FC = () => {
  const [year, setYear] = useState(new Date().getFullYear());
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);

  const fetchMonthData = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/day-status?year=${year}&month=${month}`);
      setData(res.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMonthData();
  }, [year, month]);

  const daysInMonth = new Date(year, month, 0).getDate();
  const firstDay = new Date(year, month - 1, 1).getDay();
  
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const blanks = Array.from({ length: firstDay }, (_, i) => i);

  const handleDayClick = (day: number) => {
    const dateStr = `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
    setSelectedDate(dateStr);
    
    const record = data.find(d => d.date === dateStr);
    setSelectedStatus(record ? record.status : null);
  };

  return (
    <div className="w-full h-full px-2 pb-2 pt-[4px] sm:px-4 sm:pb-2 sm:pt-[4px] md:px-6 md:pb-2 md:pt-[4px] animate-in fade-in duration-500 ease-out flex flex-col items-center justify-center overflow-hidden">
      <div className="bg-white/90 backdrop-blur-2xl rounded-xl border border-white shadow-[0_8px_30px_rgb(0,0,0,0.06)] pt-1 px-4 pb-2 sm:pt-1 sm:px-6 sm:pb-2 relative overflow-hidden w-full max-w-[100rem] h-full flex flex-col">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-1 sm:mb-2 relative z-10 flex-none">
          <div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-800 tracking-tight text-center sm:text-left">Day Status</h2>
            <p className="text-slate-500 mt-0 text-[10px] sm:text-sm font-semibold text-center sm:text-left">Select a date to view updates</p>
          </div>
          
          <div className="flex space-x-2 mt-3 sm:mt-0">
            <div className="relative">
              <select 
                value={year} 
                onChange={(e) => setYear(Number(e.target.value))} 
                className="pl-3 pr-8 py-1.5 sm:py-2 bg-white border border-blue-100 rounded-xl text-slate-800 font-bold focus:ring-2 focus:ring-blue-500/50 outline-none cursor-pointer hover:bg-blue-50/50 transition-all appearance-none text-xs sm:text-sm hover:border-blue-200"
              >
                {[2024, 2025, 2026, 2027].map(y => <option key={y} value={y}>{y}</option>)}
              </select>
              <svg className="w-4 h-4 text-blue-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
            </div>
            <div className="relative">
              <select 
                value={month} 
                onChange={(e) => setMonth(Number(e.target.value))} 
                className="pl-3 pr-8 py-1.5 sm:py-2 bg-white border border-blue-100 rounded-xl text-slate-800 font-bold focus:ring-2 focus:ring-blue-500/50 outline-none cursor-pointer hover:bg-blue-50/50 transition-all appearance-none text-xs sm:text-sm hover:border-blue-200"
              >
                {['January','February','March','April','May','June','July','August','September','October','November','December'].map((m, i) => (
                  <option key={i+1} value={i+1}>{m}</option>
                ))}
              </select>
              <svg className="w-4 h-4 text-slate-500 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center relative z-10 flex-1">
            <div className="animate-spin rounded-full h-8 w-8 border-2 border-blue-600 border-t-transparent"></div>
          </div>
        ) : (
          <div className="relative z-10 w-full flex-1 flex flex-col min-h-0">
            <div className="grid grid-cols-7 gap-1 sm:gap-2 flex-1 min-h-0" style={{ gridTemplateRows: 'min-content', gridAutoRows: 'minmax(0, 1fr)' }}>
              {weekdaysWithColors.map(day => (
                <div key={day.name} className={`text-center font-extrabold ${day.color} text-[9px] sm:text-[10px] py-1 tracking-widest uppercase flex items-end justify-center pb-1`}>
                  {day.name}
                </div>
              ))}
              {blanks.map(b => <div key={`blank-${b}`} className="p-1 sm:p-2 w-full h-full"></div>)}
              {days.map(day => {
                const dateStr = `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
                const record = data.find(d => d.date === dateStr);
                const isSelected = selectedDate === dateStr;
                
                return (
                  <div 
                    key={day} 
                    onClick={() => handleDayClick(day)}
                    className={`
                      relative flex flex-col items-center justify-start p-1.5 sm:p-2 pt-2 sm:pt-3 rounded-lg sm:rounded-xl cursor-pointer text-sm transition-all duration-300 w-full h-full overflow-hidden
                      ${isSelected 
                        ? 'bg-gradient-to-b from-blue-600 to-indigo-600 text-white shadow-[0_4px_12px_rgba(37,99,235,0.3)] scale-[1.02] z-10 border border-transparent' 
                        : record 
                          ? 'bg-pink-50 text-pink-900 hover:bg-pink-100 border border-pink-200' 
                          : 'bg-slate-100 text-slate-800 hover:bg-slate-200 border border-slate-200'}
                    `}
                  >
                    <span className="relative z-10 text-sm sm:text-base font-extrabold leading-none">{day}</span>
                    {record?.status && (
                      <span className={`text-[9px] sm:text-[10px] w-full text-center mt-1 sm:mt-2 px-1 font-bold line-clamp-2 leading-tight ${isSelected ? 'text-pink-100' : 'text-rose-600'}`}>
                        {record.status}
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Modal Popup */}
      {selectedDate && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200" 
          onClick={() => setSelectedDate(null)}
        >
          <div 
            className="bg-white rounded-2xl sm:rounded-3xl shadow-2xl w-full max-w-md overflow-hidden relative animate-in zoom-in-95 duration-200" 
            onClick={e => e.stopPropagation()}
          >
            <div className="p-5 sm:p-7 bg-gradient-to-br from-blue-50 to-indigo-50/50">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-[10px] sm:text-xs font-bold text-blue-600 tracking-widest uppercase flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                  {new Date(selectedDate).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                </h3>
                <button 
                  onClick={() => setSelectedDate(null)} 
                  className="text-slate-400 hover:text-slate-700 transition-colors bg-white/50 hover:bg-white rounded-full p-1"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
              </div>
              
              <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-5 shadow-sm border border-white/60">
                {selectedStatus ? (
                  <p className="text-rose-600 text-sm sm:text-base leading-relaxed whitespace-pre-wrap font-bold max-h-[300px] overflow-y-auto custom-scrollbar">
                    {selectedStatus}
                  </p>
                ) : (
                  <p className="text-slate-500 italic flex items-center justify-center py-4 font-semibold text-sm">
                    <svg className="w-5 h-5 mr-2 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                    No status recorded for this date.
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
