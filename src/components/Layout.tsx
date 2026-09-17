import React, { useState } from 'react';
import { PlusSquare, Monitor, Mail, Plus, Search, ChevronLeft, ChevronRight, Pause, Heart, Activity, Apple, Droplet, FileText, Settings, Stethoscope, Share2 } from 'lucide-react';
import { Dashboard } from './Dashboard';
import { Diet } from './Diet';
import { Exercise } from './Exercise';
import { BloodSugar } from './BloodSugar';
import { Profile } from './Profile';

export function Layout() {
  const [activeTab, setActiveTab] = useState('home');

  const tabs = [
    { id: 'home', label: '대시보드(홈)' },
    { id: 'diet', label: '식단관리' },
    { id: 'exercise', label: '운동서비스' },
    { id: 'bloodsugar', label: '혈당소식' },
    { id: 'profile', label: '정보·알림' },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'home': return <Dashboard onNavigate={setActiveTab} />;
      case 'diet': return <Diet />;
      case 'exercise': return <Exercise />;
      case 'bloodsugar': return <BloodSugar />;
      case 'profile': return <Profile />;
      default: return <Dashboard onNavigate={setActiveTab} />;
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-white text-[#333333] font-sans overflow-x-hidden min-w-[1024px]">
      {/* Top Utility Bar */}
      <div className="bg-white border-b border-gray-100 text-xs text-gray-600 py-2 px-8 flex justify-end items-center gap-4">
        <span className="font-medium">화면크기</span>
        <div className="flex items-center gap-1.5">
          <button className="w-5 h-5 rounded-full bg-[#4A5568] text-white flex items-center justify-center hover:bg-gray-800 transition"><Plus size={12} /></button>
          <span className="font-bold w-10 text-center">100%</span>
          <button className="w-5 h-5 rounded-full bg-[#4A5568] text-white flex items-center justify-center hover:bg-gray-800 transition"><div className="w-2.5 h-0.5 bg-white"></div></button>
        </div>
      </div>

      {/* Main Header */}
      <header className="bg-white h-[90px] flex items-center px-8 justify-between z-50">
        {/* Logo */}
        <div 
          className="flex items-center gap-2 cursor-pointer"
          onClick={() => setActiveTab('home')}
        >
          <div className="relative text-[#059669]">
            <PlusSquare size={36} strokeWidth={2} />
            <div className="absolute inset-0 flex items-center justify-center">
              <Heart size={16} className="text-[#38B2AC]" fill="#38B2AC" />
            </div>
          </div>
          <div className="flex items-baseline">
            <span className="text-[#059669] font-black text-2xl tracking-tight">당</span>
            <span className="text-[#4A5568] font-black text-2xl tracking-tight">당케어</span>
          </div>
        </div>
        
        {/* Nav Links */}
        <nav className="flex items-center gap-12 lg:gap-16 ml-12 font-bold text-[17px] text-[#2D3748]">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`hover:text-[#059669] transition-colors py-2 ${
                activeTab === tab.id ? 'text-[#059669]' : ''
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>

        {/* Right Actions */}
        <div className="flex items-center gap-2 ml-auto">
          <button className="flex items-center gap-1.5 border border-gray-300 rounded-full px-4 py-1.5 text-sm font-medium text-gray-600 hover:bg-gray-50 transition">
            <Monitor size={16} /> 원격지원
          </button>
          <button className="flex items-center gap-1.5 border border-[#1877F2]/30 text-[#1877F2] rounded-full px-4 py-1.5 text-sm font-medium hover:bg-emerald-50 transition">
            <Share2 size={16} /> SNS공유
          </button>
          <button className="flex items-center gap-1.5 border border-[#E53E3E]/30 text-[#E53E3E] rounded-full px-4 py-1.5 text-sm font-medium hover:bg-red-50 transition">
            <Mail size={16} /> 뉴스레터
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 w-full bg-gray-50/50 flex flex-col">
        {activeTab !== 'home' ? (
          <div className="max-w-5xl mx-auto w-full p-8 lg:p-12">
            {renderContent()}
          </div>
        ) : (
          renderContent()
        )}
      </main>
    </div>
  );
}
