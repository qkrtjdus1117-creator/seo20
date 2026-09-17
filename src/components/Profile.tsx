import React from 'react';
import { useAppContext } from '../store/AppContext';

export function Profile() {
  const { profile, updateProfile } = useAppContext();

  const handleChange = (field: keyof typeof profile, value: any) => {
    updateProfile({ [field]: value });
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <header className="mb-8 hidden md:block">
        <h2 className="text-3xl font-bold text-[#2D3748] tracking-tight">정보·알림 설정 👤</h2>
        <p className="text-gray-500 mt-2">나에게 맞는 목표와 프로필을 설정하고 맞춤형 추천을 받아보세요.</p>
      </header>

      <div className="bg-white rounded-2xl shadow-sm p-6 md:p-8 border border-gray-200">
        <h3 className="text-xl font-bold mb-8 text-[#2D3748]">내 정보 및 목표</h3>
        
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row space-y-6 sm:space-y-0 sm:space-x-6">
            <div className="flex-1">
              <label className="text-sm font-bold text-gray-600 mb-2 block">나이</label>
              <input 
                type="number" 
                value={profile.age}
                onChange={e => handleChange('age', parseInt(e.target.value))}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-5 py-4 text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#059669]/20 focus:border-[#059669] transition-all"
              />
            </div>
            <div className="flex-1">
              <label className="text-sm font-bold text-gray-600 mb-2 block">체중 (kg)</label>
              <input 
                type="number" 
                value={profile.weight}
                onChange={e => handleChange('weight', parseInt(e.target.value))}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-5 py-4 text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#059669]/20 focus:border-[#059669] transition-all"
              />
            </div>
          </div>

          <div>
            <label className="text-sm font-bold text-gray-600 mb-2 block">당뇨 유형</label>
            <select 
              value={profile.diabetesType}
              onChange={e => handleChange('diabetesType', e.target.value)}
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-5 py-4 text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#059669]/20 focus:border-[#059669] appearance-none transition-all"
            >
              <option value="prediabetes">당뇨 전단계</option>
              <option value="type1">제1형 당뇨</option>
              <option value="type2">제2형 당뇨</option>
              <option value="gestational">임신성 당뇨</option>
            </select>
          </div>

          <div>
            <label className="text-sm font-bold text-gray-600 mb-2 block">목표 공복 혈당 (mg/dL)</label>
            <div className="flex items-center space-x-4">
              <input 
                type="number" 
                value={profile.targetBloodSugarMin}
                onChange={e => handleChange('targetBloodSugarMin', parseInt(e.target.value))}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-5 py-4 text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#059669]/20 focus:border-[#059669] transition-all"
              />
              <span className="text-gray-400 font-bold">~</span>
              <input 
                type="number" 
                value={profile.targetBloodSugarMax}
                onChange={e => handleChange('targetBloodSugarMax', parseInt(e.target.value))}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-5 py-4 text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#059669]/20 focus:border-[#059669] transition-all"
              />
            </div>
          </div>

          <div>
            <label className="text-sm font-bold text-gray-600 mb-2 block">운동 수준</label>
            <select 
              value={profile.fitnessLevel}
              onChange={e => handleChange('fitnessLevel', e.target.value)}
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-5 py-4 text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#059669]/20 focus:border-[#059669] appearance-none transition-all"
            >
              <option value="beginner">초급 (운동 안함/가벼운 걷기)</option>
              <option value="intermediate">중급 (주 2~3회 꾸준한 운동)</option>
              <option value="advanced">고급 (매일 고강도 운동)</option>
            </select>
          </div>

        </div>
      </div>
    </div>
  );
}
