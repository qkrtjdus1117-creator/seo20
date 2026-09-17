import React, { useState } from 'react';
import { useAppContext } from '../store/AppContext';

export function BloodSugar() {
  const { addBloodSugarLog, bloodSugarLogs, profile } = useAppContext();
  
  const [value, setValue] = useState('');
  const [timing, setTiming] = useState('fasting');
  const [memo, setMemo] = useState('');

  const handleSave = () => {
    if (!value) return;
    addBloodSugarLog({
      date: new Date().toISOString(),
      timing: timing as any,
      value: parseInt(value),
      memo
    });
    setValue('');
    setMemo('');
    alert('혈당이 기록되었습니다.');
  };

  const getStatusColor = (val: number, timing: string) => {
    // Very simplified logic
    if (timing === 'fasting') {
      if (val < profile.targetBloodSugarMin) return 'text-orange-500 bg-orange-50';
      if (val > profile.targetBloodSugarMax) return 'text-red-500 bg-red-50';
      return 'text-emerald-600 bg-emerald-50';
    } else {
      if (val > 180) return 'text-red-500 bg-red-50';
      return 'text-emerald-600 bg-emerald-50';
    }
  };

  const timingLabels: Record<string, string> = {
    'fasting': '공복',
    'after_breakfast': '아침 식후',
    'after_lunch': '점심 식후',
    'after_dinner': '저녁 식후',
    'before_sleep': '취침 전',
    'other': '기타'
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <header className="mb-8 hidden md:block">
        <h2 className="text-3xl font-bold text-[#2D3748] tracking-tight">혈당 수치 🩸</h2>
        <p className="text-gray-500 mt-2">시간대별 혈당을 꼼꼼하게 기록하고 관리해 보세요.</p>
      </header>

      <div className="bg-white rounded-2xl shadow-sm p-6 md:p-8 border border-gray-200">
        <h3 className="text-xl font-bold mb-6 text-[#2D3748]">혈당 기록하기</h3>
        
        <div className="space-y-5">
          <div className="flex flex-col sm:flex-row space-y-5 sm:space-y-0 sm:space-x-5">
            <div className="flex-1">
              <label className="text-sm font-bold text-gray-600 mb-2 block">측정 시기</label>
              <select 
                value={timing} 
                onChange={e => setTiming(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-5 py-4 text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#059669]/20 focus:border-[#059669] appearance-none transition"
              >
                {Object.entries(timingLabels).map(([k, v]) => (
                  <option key={k} value={k}>{v}</option>
                ))}
              </select>
            </div>
            <div className="flex-1">
              <label className="text-sm font-bold text-gray-600 mb-2 block">수치 (mg/dL)</label>
              <input 
                type="number" 
                value={value}
                onChange={e => setValue(e.target.value)}
                placeholder="예: 110"
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-5 py-4 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#059669]/20 focus:border-[#059669] transition"
              />
            </div>
          </div>

          <div>
            <label className="text-sm font-bold text-gray-600 mb-2 block">메모 (선택)</label>
            <input 
              type="text" 
              value={memo}
              onChange={e => setMemo(e.target.value)}
              placeholder="특이사항 (스트레스, 과식 등)"
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-5 py-4 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#059669]/20 focus:border-[#059669] transition"
            />
          </div>

          <button 
            onClick={handleSave}
            disabled={!value}
            className="w-full bg-[#059669] text-white py-4 rounded-xl font-bold hover:bg-[#047857] transition-colors disabled:opacity-50 disabled:bg-gray-400"
          >
            기록 저장하기
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm p-6 md:p-8 border border-gray-200">
        <h3 className="text-xl font-bold mb-6 text-[#2D3748]">최근 기록</h3>
        <div className="space-y-4">
          {bloodSugarLogs.slice(0, 5).map(log => {
            const dateObj = new Date(log.date);
            const statusClass = getStatusColor(log.value, log.timing);
            return (
              <div key={log.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100">
                <div>
                  <div className="flex items-center space-x-3 mb-1.5">
                    <span className="font-bold text-gray-800">{timingLabels[log.timing]}</span>
                    <span className="text-sm text-gray-500">{dateObj.getMonth()+1}/{dateObj.getDate()} {dateObj.getHours()}:{dateObj.getMinutes().toString().padStart(2, '0')}</span>
                  </div>
                  {log.memo && <p className="text-sm text-gray-600 bg-white px-3 py-1.5 rounded-lg inline-block border border-gray-200 shadow-sm">{log.memo}</p>}
                </div>
                <div className={`px-4 py-2 rounded-xl font-bold text-lg ${statusClass}`}>
                  {log.value}
                </div>
              </div>
            );
          })}
          {bloodSugarLogs.length === 0 && (
            <div className="text-center bg-gray-50 rounded-xl py-8 border border-gray-200">
              <p className="text-gray-500">아직 기록된 혈당이 없습니다.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
