import React, { useState } from 'react';
import { Camera, Search, Plus, Loader2, Sparkles } from 'lucide-react';
import { useAppContext } from '../store/AppContext';

export function Diet() {
  const { addDietLog, dietLogs, profile } = useAppContext();
  const [foodInput, setFoodInput] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analyzedData, setAnalyzedData] = useState<any>(null);
  
  const [isRecommending, setIsRecommending] = useState(false);
  const [recommendations, setRecommendations] = useState<any>(null);

  const handleAnalyze = async () => {
    if (!foodInput.trim()) return;
    setIsAnalyzing(true);
    setAnalyzedData(null);
    try {
      const response = await fetch('/api/ai/analyze-food', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ foodDescription: foodInput })
      });
      if (!response.ok) throw new Error('Analysis failed');
      const data = await response.json();
      setAnalyzedData(data);
    } catch (err) {
      alert("분석에 실패했습니다.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleSave = () => {
    if (!analyzedData) return;
    addDietLog({
      date: new Date().toISOString(),
      timing: 'lunch', // Default for demo
      food: foodInput,
      ...analyzedData
    });
    setFoodInput('');
    setAnalyzedData(null);
    alert('식단이 기록되었습니다.');
  };

  const handleGetRecommendations = async () => {
    setIsRecommending(true);
    try {
      const response = await fetch('/api/ai/recommend-meals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          profile,
          recentMeals: dietLogs.slice(0, 5).map(l => l.food)
        })
      });
      if (!response.ok) throw new Error('Recommendation failed');
      const data = await response.json();
      setRecommendations(data.recommendations);
    } catch (err) {
      alert("추천을 가져오는데 실패했습니다.");
    } finally {
      setIsRecommending(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <header className="mb-8 hidden md:block">
        <h2 className="text-3xl font-bold text-[#2D3748] tracking-tight">식단 관리 🍎</h2>
        <p className="text-gray-500 mt-2">오늘 먹은 음식을 기록하고 영양을 분석해 보세요.</p>
      </header>

      <div className="bg-white rounded-2xl shadow-sm p-6 md:p-8 border border-gray-200">
        <h3 className="text-xl font-bold mb-6 text-[#2D3748]">식단 기록하기</h3>
        
        <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3 mb-6">
          <input 
            type="text" 
            value={foodInput}
            onChange={(e) => setFoodInput(e.target.value)}
            placeholder="예: 현미밥 1공기, 구운 연어 샐러드" 
            className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-5 py-4 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#059669]/20 focus:border-[#059669] transition-all"
          />
          <button 
            onClick={handleAnalyze}
            disabled={isAnalyzing || !foodInput}
            className="bg-[#059669] text-white px-8 py-4 rounded-xl hover:bg-[#047857] disabled:opacity-50 flex items-center justify-center font-medium transition-colors"
          >
            {isAnalyzing ? <Loader2 size={20} className="animate-spin mr-2" /> : <Search size={20} className="mr-2" />}
            분석하기
          </button>
        </div>

        {analyzedData && (
          <div className="bg-emerald-50/50 rounded-xl p-6 border border-emerald-100 animate-in fade-in slide-in-from-bottom-2">
            <h4 className="font-bold text-[#2D3748] mb-4">AI 영양 분석 결과</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
                <span className="text-sm text-gray-500 block mb-1">칼로리</span>
                <span className="text-xl font-bold text-[#2D3748]">{analyzedData.calories} kcal</span>
              </div>
              <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
                <span className="text-sm text-gray-500 block mb-1">탄수화물 / 당류</span>
                <span className="text-xl font-bold text-red-500">{analyzedData.carbs}g / {analyzedData.sugar}g</span>
              </div>
              <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
                <span className="text-sm text-gray-500 block mb-1">단백질</span>
                <span className="text-xl font-bold text-green-600">{analyzedData.protein}g</span>
              </div>
              <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
                <span className="text-sm text-gray-500 block mb-1">지방</span>
                <span className="text-xl font-bold text-yellow-500">{analyzedData.fat}g</span>
              </div>
            </div>
            <button 
              onClick={handleSave}
              className="w-full bg-[#2D3748] text-white py-4 rounded-xl font-bold hover:bg-gray-800 transition-colors"
            >
              기록 저장하기
            </button>
          </div>
        )}
      </div>

      <div className="bg-emerald-50/30 rounded-2xl p-6 md:p-8 border border-emerald-100">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <h3 className="text-xl font-bold text-[#2D3748] flex items-center">
            <Sparkles size={24} className="mr-2 text-[#059669]" />
            AI 맞춤 식단 추천
          </h3>
          <button 
            onClick={handleGetRecommendations}
            disabled={isRecommending}
            className="w-full sm:w-auto text-sm bg-white text-[#059669] border border-[#059669] px-5 py-2.5 rounded-xl font-bold hover:bg-emerald-50 disabled:opacity-50 flex items-center justify-center transition-colors"
          >
            {isRecommending ? <Loader2 size={18} className="animate-spin mr-2" /> : null}
            추천받기
          </button>
        </div>

        {recommendations && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {recommendations.map((rec: any, idx: number) => (
              <div key={idx} className="bg-white p-5 rounded-xl shadow-sm border border-gray-200 flex flex-col h-full hover:shadow-md transition-shadow">
                <h4 className="font-bold text-[#2D3748] text-lg mb-2">{rec.name}</h4>
                <p className="text-gray-500 mb-4 flex-1">{rec.reason}</p>
                <div className="flex flex-wrap gap-2 text-sm text-[#059669] font-medium bg-gray-50 p-3 rounded-lg border border-gray-100">
                  <span>{rec.calories} kcal</span>
                  <span className="text-gray-300">•</span>
                  <span>탄 {rec.carbs}g</span>
                  <span className="text-gray-300">•</span>
                  <span>당 {rec.sugar}g</span>
                </div>
              </div>
            ))}
          </div>
        )}
        
        {!recommendations && !isRecommending && (
          <p className="text-gray-600 bg-white p-4 rounded-xl border border-gray-200">
            나의 프로필과 최근 기록을 분석하여 혈당 관리에 좋은 유기농 식단을 추천해 드립니다.
          </p>
        )}
      </div>
    </div>
  );
}
