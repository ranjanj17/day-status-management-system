import React, { useState, useEffect } from 'react';
import { api } from '../services/api';

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
    <div className="max-w-4xl mx-auto p-4 bg-white rounded shadow mt-6">
      <h2 className="text-2xl font-bold mb-4 text-center">Day Status Viewer</h2>
      
      <div className="flex justify-center mb-6 space-x-4">
        <select value={year} onChange={(e) => setYear(Number(e.target.value))} className="p-2 border rounded">
          {[2024, 2025, 2026, 2027].map(y => <option key={y} value={y}>{y}</option>)}
        </select>
        <select value={month} onChange={(e) => setMonth(Number(e.target.value))} className="p-2 border rounded">
          {['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'].map((m, i) => (
            <option key={i+1} value={i+1}>{m}</option>
          ))}
        </select>
      </div>

      {loading ? (
        <div className="text-center py-10 text-gray-500">Loading...</div>
      ) : (
        <div className="grid grid-cols-7 gap-2">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div key={day} className="text-center font-bold py-2 bg-gray-100">{day}</div>
          ))}
          {blanks.map(b => <div key={`blank-${b}`} className="p-4 bg-gray-50"></div>)}
          {days.map(day => {
            const dateStr = `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
            const hasData = data.some(d => d.date === dateStr);
            return (
              <div 
                key={day} 
                onClick={() => handleDayClick(day)}
                className={`p-4 border text-center cursor-pointer hover:bg-blue-50 transition-colors 
                  ${selectedDate === dateStr ? 'ring-2 ring-blue-500 bg-blue-100' : ''}
                  ${hasData ? 'bg-green-100 border-green-300' : 'bg-white'}`}
              >
                {day}
              </div>
            );
          })}
        </div>
      )}

      {selectedDate && (
        <div className="mt-8 p-6 bg-slate-50 border rounded">
          <h3 className="text-xl font-bold mb-2">Status for {selectedDate}</h3>
          {selectedStatus ? (
            <p className="text-gray-800 whitespace-pre-wrap">{selectedStatus}</p>
          ) : (
            <p className="text-gray-500 italic">No status recorded for this day.</p>
          )}
        </div>
      )}
    </div>
  );
};
