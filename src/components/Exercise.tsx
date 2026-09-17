import React, { useState } from 'react';
import { Activity, Flame, Loader2, Sparkles, Timer } from 'lucide-react';
import { useAppContext } from '../store/AppContext';

export function Exercise() {
  const { addExerciseLog, exerciseLogs, profile } = useAppContext();
  
  const [type, setType] = useState('걷기');
  const [duration, setDuration] = useState('30');
  const [intensity, setIntensity] = useState<'low'|'moderate'|'high'>('moderate');
  
  const [isRecommending, setIsRecommending] = useState(false);
  const [program, setProgram] = useState<any>(null);

  const calculateCalories = () => {
    // Very simplified logic for demo
    const base = type === '걷기' ? 4 : type === '달리기' ? 8 : 6;
    const multi = intensity === 'low' ? 0.8 : intensity === 'high' ? 1.2 : 1;
    return Math.round(base * multi * parseInt(duration || '0') * (profile.weight / 60));
  };

  const handleSave = () => {
    addExerciseLog({
      date: new Date().toISOString(),
      type,
      duration: parseInt(duration),
      intensity,
      caloriesBurned: calculateCalories()
    });
    alert('운동이 기록되었습니다.');
  };

  const handleGetProgram = async () => {
    setIsRecommending(true);
    try {
      const response = await fetch('/api/ai/recommend-exercise', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          profile,
          recentExercises: exerciseLogs.slice(0, 3)
        })
      });
      if (!response.ok) throw new Error('Recommendation failed');
      const data = await response.json();
      setProgram(data.program);
    } catch (err) {
      alert("추천을 가져오는데 실패했습니다.");
    } finally {
      setIsRecommending(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <header className="mb-8 hidden md:block">
        <h2 className="text-3xl font-bold text-[#2D3748] tracking-tight">운동 기록 🏃</h2>
        <p className="text-gray-500 mt-2">오늘의 활동량을 기록하고 AI 운동 루틴을 받아보세요.</p>
      </header>

      <div className="bg-white rounded-2xl shadow-sm p-6 md:p-8 border border-gray-200">
        <h3 className="text-xl font-bold mb-6 text-[#2D3748]">운동 기록하기</h3>
        
        <div className="space-y-5">
          <div>
            <label className="text-sm font-bold text-gray-600 mb-2 block">운동 종류</label>
            <select 
              value={type} 
              onChange={e => setType(e.target.value)}
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-5 py-4 text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#059669]/20 focus:border-[#059669] appearance-none"
            >
              <option>걷기</option>
              <option>달리기</option>
              <option>실내 자전거</option>
              <option>수영</option>
              <option>웨이트 트레이닝</option>
              <option>요가</option>
            </select>
          </div>

          <div className="flex flex-col sm:flex-row space-y-5 sm:space-y-0 sm:space-x-5">
            <div className="flex-1">
              <label className="text-sm font-bold text-gray-600 mb-2 block">시간 (분)</label>
              <input 
                type="number" 
                value={duration}
                onChange={e => setDuration(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-5 py-4 text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#059669]/20 focus:border-[#059669]"
              />
            </div>
            <div className="flex-1">
              <label className="text-sm font-bold text-gray-600 mb-2 block">강도</label>
              <select 
                value={intensity} 
                onChange={e => setIntensity(e.target.value as any)}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-5 py-4 text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#059669]/20 focus:border-[#059669] appearance-none"
              >
                <option value="low">가볍게</option>
                <option value="moderate">보통</option>
                <option value="high">격렬하게</option>
              </select>
            </div>
          </div>

          <div className="bg-emerald-50/50 p-5 rounded-xl flex items-center justify-between border border-emerald-100">
            <div className="flex items-center text-gray-600 font-bold">
              <Flame size={20} className="mr-2 text-red-500" />
              예상 소모 칼로리
            </div>
            <div className="text-2xl font-bold text-[#2D3748]">{calculateCalories()} kcal</div>
          </div>

          <button 
            onClick={handleSave}
            className="w-full bg-[#059669] text-white py-4 rounded-xl font-bold hover:bg-[#047857] transition-colors"
          >
            기록 저장하기
          </button>
        </div>
      </div>

      <div className="bg-emerald-50/30 rounded-2xl p-6 md:p-8 border border-emerald-100">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <h3 className="text-xl font-bold text-[#2D3748] flex items-center">
            <Sparkles size={24} className="mr-2 text-[#059669]" />
            AI 맞춤 운동 프로그램
          </h3>
          <button 
            onClick={handleGetProgram}
            disabled={isRecommending}
            className="w-full sm:w-auto text-sm bg-white text-[#059669] border border-[#059669] px-5 py-2.5 rounded-xl font-bold hover:bg-emerald-50 disabled:opacity-50 flex items-center justify-center transition-colors shadow-sm"
          >
            {isRecommending ? <Loader2 size={18} className="animate-spin mr-2" /> : null}
            루틴 짜기
          </button>
        </div>

        {program && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {program.map((day: any, idx: number) => (
              <div key={idx} className="bg-white p-5 rounded-xl shadow-sm border border-gray-200 relative overflow-hidden hover:shadow-md transition-shadow">
                <div className="absolute top-0 left-0 w-1.5 h-full bg-[#059669]"></div>
                <div className="flex justify-between items-start mb-3">
                  <h4 className="font-bold text-[#2D3748]">{day.day} - {day.type}</h4>
                  <span className="text-xs font-bold px-2 py-1 bg-gray-100 text-gray-500 rounded-lg flex items-center">
                    <Timer size={12} className="mr-1" /> {day.duration}
                  </span>
                </div>
                <p className="text-sm font-bold text-[#059669] mb-2">{day.activity}</p>
                <p className="text-gray-500 text-sm">{day.reason}</p>
              </div>
            ))}
          </div>
        )}
        
        {!program && !isRecommending && (
          <p className="text-gray-600 bg-white p-4 rounded-xl border border-gray-200">
            나의 나이, 체중, 당뇨 유형에 맞춰 무리하지 않고 혈당을 낮출 수 있는 3일 운동 루틴을 생성합니다.
          </p>
        )}
      </div>
    </div>
  );
}
