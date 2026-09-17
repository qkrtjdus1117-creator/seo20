import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceArea } from 'recharts';
import { useAppContext } from '../store/AppContext';
import { format, subDays, isSameDay, parseISO } from 'date-fns';
import { ko } from 'date-fns/locale';
import { ChevronLeft, ChevronRight, Pause, Search, Apple, PlusSquare, FileText, Heart, User, Droplet, Stethoscope, Activity, Settings } from 'lucide-react';

export function Dashboard({ onNavigate }: { onNavigate: (tab: string) => void }) {
  const { profile, bloodSugarLogs, dietLogs, exerciseLogs } = useAppContext();

  const today = new Date();
  
  // Calculate today's summary
  const todaysDiet = dietLogs.filter(log => isSameDay(parseISO(log.date), today));
  const todaysExercise = exerciseLogs.filter(log => isSameDay(parseISO(log.date), today));
  const todaysBloodSugar = bloodSugarLogs.filter(log => isSameDay(parseISO(log.date), today));

  const totalCaloriesIn = todaysDiet.reduce((sum, log) => sum + log.calories, 0);
  const totalCaloriesOut = todaysExercise.reduce((sum, log) => sum + log.caloriesBurned, 0);
  
  const fastingLog = todaysBloodSugar.find(log => log.timing === 'fasting');
  const latestPostMealLog = todaysBloodSugar.filter(log => log.timing.startsWith('after_')).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0];

  // Prepare chart data (Last 7 days average)
  const chartData = Array.from({ length: 7 }).map((_, i) => {
    const d = subDays(today, 6 - i);
    const dayLogs = bloodSugarLogs.filter(log => isSameDay(parseISO(log.date), d));
    const avg = dayLogs.length ? dayLogs.reduce((sum, log) => sum + log.value, 0) / dayLogs.length : null;
    return {
      date: format(d, 'M/d', { locale: ko }),
      value: avg ? Math.round(avg) : null
    };
  });

  return (
    <div className="w-full animate-in fade-in duration-500 pb-20">
      {/* Hero Section */}
      <div className="bg-[#059669] w-full h-[380px] relative flex justify-center text-white overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute inset-0 opacity-20 pointer-events-none flex justify-between items-end px-20">
          <div className="w-96 h-64 bg-white/20 rounded-tr-[100px]" style={{ clipPath: 'polygon(0 100%, 100% 100%, 100% 40%, 80% 40%, 80% 0, 40% 0, 40% 20%, 0 20%)' }}></div>
          <div className="w-64 h-48 bg-white/20 rounded-tl-[100px]" style={{ clipPath: 'polygon(0 100%, 100% 100%, 100% 20%, 60% 20%, 60% 0, 20% 0, 20% 40%, 0 40%)' }}></div>
        </div>
        
        {/* Left Carousel Controls */}
        <div className="absolute left-8 top-8 flex items-center gap-4 text-sm font-bold opacity-80">
          <span className="text-[#FFD54F]">1</span> / 3
          <button className="hover:text-white transition"><ChevronLeft size={20} /></button>
          <button className="hover:text-white transition"><ChevronRight size={20} /></button>
          <button className="border border-white/50 rounded-full p-1 hover:bg-white/10 transition"><Pause size={14} fill="currentColor" /></button>
        </div>

        {/* Center Content */}
        <div className="flex flex-col items-center justify-center z-10 w-full max-w-2xl text-center mt-8">
          <h2 className="text-3xl font-medium mb-3 tracking-tight">
            당뇨인의 <span className="relative inline-block z-10 font-bold mx-1">건강<span className="absolute -inset-1 border-2 border-white/40 rounded-full -z-10"></span></span>과 
            <span className="relative inline-block z-10 font-bold mx-1">행복</span>을 이어주는
          </h2>
          <h1 className="text-[52px] font-bold mb-6">당당케어</h1>
          <p className="text-lg opacity-90 mb-10">당당케어는 당뇨 관련 정보 및 관리 서비스를 종합적으로 제공하는 대국민 포털입니다.</p>

          <div className="relative w-[600px] h-16 bg-white rounded-full flex items-center px-6 shadow-lg">
            <input 
              type="text" 
              placeholder="음식 영양성분을 검색해보세요" 
              className="flex-1 h-full bg-transparent text-gray-800 focus:outline-none text-lg placeholder-gray-400"
            />
            <button className="w-11 h-11 bg-[#064E3B] rounded-full flex items-center justify-center text-white hover:bg-[#022C22] transition shadow-md">
              <Search size={22} />
            </button>
          </div>
        </div>

        {/* Right Quick Menu */}
        <div className="absolute right-12 top-1/2 -translate-y-1/2 flex flex-col items-center">
          <div className="flex items-end gap-3 mb-6 w-full px-2">
            <span className="text-sm font-bold border-b-2 border-white/30 pb-1 flex-1">바로가기 서비스</span>
            <span className="font-[cursive] text-2xl opacity-70 italic">Quick</span>
          </div>
          
          <div className="grid grid-cols-2 gap-x-8 gap-y-6">
            <button onClick={() => onNavigate('diet')} className="group flex flex-col items-center gap-2">
              <div className="w-[72px] h-[72px] rounded-full bg-[#4DD0E1] flex items-center justify-center shadow-lg group-hover:scale-105 transition transform">
                <Apple size={36} className="text-white" strokeWidth={1.5} />
              </div>
              <span className="text-xs font-medium">식단 기록</span>
            </button>
            <button onClick={() => onNavigate('exercise')} className="group flex flex-col items-center gap-2">
              <div className="w-[72px] h-[72px] rounded-full bg-[#81C784] flex items-center justify-center shadow-lg group-hover:scale-105 transition transform">
                <PlusSquare size={36} className="text-white" strokeWidth={1.5} />
              </div>
              <span className="text-xs font-medium">운동 관리</span>
            </button>
            <button onClick={() => onNavigate('bloodsugar')} className="group flex flex-col items-center gap-2">
              <div className="w-[72px] h-[72px] rounded-full bg-[#B39DDB] flex items-center justify-center shadow-lg group-hover:scale-105 transition transform">
                <FileText size={36} className="text-white" strokeWidth={1.5} />
              </div>
              <span className="text-xs font-medium">혈당 일지</span>
            </button>
            <button onClick={() => onNavigate('profile')} className="group flex flex-col items-center gap-2">
              <div className="w-[72px] h-[72px] rounded-full bg-[#4FC3F7] flex items-center justify-center shadow-lg group-hover:scale-105 transition transform">
                <Settings size={36} className="text-white" strokeWidth={1.5} />
              </div>
              <span className="text-xs font-medium">내 설정</span>
            </button>
          </div>
        </div>
      </div>

      {/* Major Services Section */}
      <div className="w-full bg-white py-16 flex flex-col items-center border-b border-gray-200">
        <h3 className="text-3xl font-black text-[#333333] mb-12">
          <span className="text-[#38B2AC] border-b-[3px] border-[#38B2AC]/30 pb-1">당당케어 주요</span> 서비스
        </h3>
        
        <div className="flex gap-10 flex-wrap justify-center max-w-5xl">
          {[
            { icon: <Stethoscope size={32} className="text-[#38B2AC]" />, label: '건강증진' },
            { icon: <PlusSquare size={32} className="text-[#38B2AC]" />, label: '질병관리' },
            { icon: <Activity size={32} className="text-[#38B2AC]" />, label: '통계조회' },
            { icon: <Apple size={32} className="text-[#38B2AC]" />, label: '영양관리' },
            { icon: <Heart size={32} className="text-[#38B2AC]" />, label: '정신보건' },
            { icon: <User size={32} className="text-[#38B2AC]" />, label: '가족건강' },
            { icon: <Droplet size={32} className="text-[#38B2AC]" />, label: '검진안내' },
            { icon: <FileText size={32} className="text-[#38B2AC]" />, label: '증명발급' },
          ].map((service, i) => (
            <button key={i} className="group flex flex-col items-center gap-4">
              <div className="w-[90px] h-[90px] rounded-full bg-white border border-gray-200 shadow-[0_4px_12px_rgba(0,0,0,0.05)] flex items-center justify-center group-hover:shadow-[0_8px_16px_rgba(56,178,172,0.15)] group-hover:border-[#38B2AC]/30 transition">
                {service.icon}
              </div>
              <span className="font-bold text-[15px] text-[#4A5568]">{service.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Dashboard Metrics (Original Functionality preserved below) */}
      <div className="max-w-5xl mx-auto pt-16 px-8">
        <h3 className="text-xl font-bold mb-6 text-[#2D3748]">나의 건강 요약</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
            <p className="text-sm text-gray-500 font-bold mb-2">오늘 공복 혈당</p>
            <p className="text-3xl font-black text-[#059669]">
              {fastingLog ? fastingLog.value : '-'} <span className="text-base font-normal text-gray-400">mg/dL</span>
            </p>
          </div>
          <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
            <p className="text-sm text-gray-500 font-bold mb-2">최근 식후 혈당</p>
            <p className="text-3xl font-black text-[#E53E3E]">
              {latestPostMealLog ? latestPostMealLog.value : '-'} <span className="text-base font-normal text-gray-400">mg/dL</span>
            </p>
          </div>
          <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
            <p className="text-sm text-gray-500 font-bold mb-2">오늘 섭취 칼로리</p>
            <p className="text-3xl font-black text-[#38B2AC]">
              {totalCaloriesIn} <span className="text-base font-normal text-gray-400">kcal</span>
            </p>
          </div>
          <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
            <p className="text-sm text-gray-500 font-bold mb-2">오늘 소모 칼로리</p>
            <p className="text-3xl font-black text-[#DD6B20]">
              {totalCaloriesOut} <span className="text-base font-normal text-gray-400">kcal</span>
            </p>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm p-8 border border-gray-200">
          <h3 className="text-lg font-bold mb-8 text-[#2D3748]">주간 혈당 변화 추이</h3>
          <div className="h-[320px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ top: 10, right: 20, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                <XAxis dataKey="date" tick={{ fontSize: 13, fill: '#718096' }} axisLine={false} tickLine={false} />
                <YAxis domain={['auto', 'auto']} tick={{ fontSize: 13, fill: '#718096' }} axisLine={false} tickLine={false} />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: '1px solid #E2E8F0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  labelStyle={{ color: '#2D3748', fontWeight: 'bold', marginBottom: '4px' }}
                />
                {/* @ts-ignore */}
                <ReferenceArea 
                  y1={profile.targetBloodSugarMin} 
                  y2={profile.targetBloodSugarMax} 
                  fill="#E6FFFA" 
                  fillOpacity={0.6} 
                />
                <Line 
                  type="monotone" 
                  dataKey="value" 
                  stroke="#319795" 
                  strokeWidth={3}
                  dot={{ r: 5, fill: '#319795', strokeWidth: 2, stroke: '#fff' }}
                  activeDot={{ r: 7, fill: '#234E52', stroke: '#fff', strokeWidth: 2 }}
                  connectNulls
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="flex items-center justify-center mt-6 text-sm text-gray-600 font-medium space-x-6">
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-[#E6FFFA] border border-[#319795] mr-2"></div>
              설정 목표 범위 ({profile.targetBloodSugarMin}~{profile.targetBloodSugarMax})
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-[#319795] mr-2"></div>
              일별 평균 혈당
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
