
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { TabType, DayPlan, Spot, SpotCategory, FoodItem, WeatherForecast, SupermarketItem, ExpenseItem, ExpenseCategory } from './types';
import { INITIAL_ITINERARY, FEATURED_FOOD, DEFAULT_SUPERMARKETS } from './constants';
import BottomNav from './components/BottomNav';
import SpotModal from './components/SpotModal';
import FoodModal from './components/FoodModal';
import ExpenseModal from './components/ExpenseModal';
import { GoogleGenAI, Type } from "@google/genai";
import { 
  Plane, Hotel, MapPin, CloudSun, Sun, Cloud, Plus, Coins,
  Car, Info, ArrowRight, Utensils, Beer, Luggage, Clock, ShoppingBag, 
  Navigation2, Moon, Lightbulb, Sparkles, PackageCheck, WashingMachine, 
  Equal, MoveLeft, AlertTriangle, QrCode, ShieldCheck, Instagram, CreditCard, 
  Trash2, Edit2, Soup, Wallet, Banknote, Search, Ban, XCircle, UserCheck,
  ReceiptText, Minus, Divide, X, Loader2, SmartphoneCharging, BeerOff, RefreshCw, CheckCircle2
} from 'lucide-react';

const ITINERARY_KEY = 'shin_okinawa_final_v120';
const FOOD_KEY = 'shin_okinawa_food_v120';
const EXPENSES_KEY = 'shin_okinawa_expenses_v120';
const WEATHER_KEY = 'shin_okinawa_weather_v120';

const evaluateExpression = (expr: string): number => {
  try {
    const sanitizedExpr = expr.replace(/[^-+*/.0-9]/g, '');
    if (!sanitizedExpr) return 0;
    return new Function(`return ${sanitizedExpr}`)() || 0;
  } catch { return 0; }
};

const DEFAULT_WEATHER: WeatherForecast[] = [
  { date: '1/11 (日)', morning: { temp: '16°', icon: 'cloud', desc: '多雲' }, noon: { temp: '22°', icon: 'sun', desc: '晴' }, night: { temp: '17°', icon: 'moon', desc: '涼' }, clothingTip: '洋蔥式穿法，內層薄長袖。' },
  { date: '1/12 (一)', morning: { temp: '15°', icon: 'cloud', desc: '陰' }, noon: { temp: '21°', icon: 'sun', desc: '晴' }, night: { temp: '16°', icon: 'moon', desc: '涼' }, clothingTip: '海邊風強，必備防風外套。' },
  { date: '1/13 (二)', morning: { temp: '17°', icon: 'sun', desc: '晴' }, noon: { temp: '23°', icon: 'sun', desc: '晴' }, night: { temp: '18°', icon: 'moon', desc: '涼' }, clothingTip: '穿搭以輕鬆、拍照好看為主。' },
  { date: '1/14 (三)', morning: { temp: '16°', icon: 'cloud', desc: '多雲' }, noon: { temp: '20°', icon: 'cloud', desc: '陰' }, night: { temp: '17°', icon: 'moon', desc: '涼' }, clothingTip: '輕便保暖，方便搭機。' }
];

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>(TabType.OVERVIEW);
  const [selectedDay, setSelectedDay] = useState<number>(1);
  const [customRate, setCustomRate] = useState<string>('0.215');
  const [calcDisplay, setCalcDisplay] = useState<string>('0');
  const [isTwdToJpy, setIsTwdToJpy] = useState<boolean>(false);
  const [isTrafficUpdating, setIsTrafficUpdating] = useState(false);
  const [isWeatherUpdating, setIsWeatherUpdating] = useState(false);
  const mainContentRef = useRef<HTMLDivElement>(null);

  const [itinerary, setItinerary] = useState<DayPlan[]>(() => {
    const saved = localStorage.getItem(ITINERARY_KEY);
    return saved ? JSON.parse(saved) : INITIAL_ITINERARY;
  });

  const [foodItems, setFoodItems] = useState<FoodItem[]>(() => {
    const saved = localStorage.getItem(FOOD_KEY);
    return saved ? JSON.parse(saved) : FEATURED_FOOD;
  });

  const [expenses, setExpenses] = useState<ExpenseItem[]>(() => {
    const saved = localStorage.getItem(EXPENSES_KEY);
    return saved ? JSON.parse(saved) : [];
  });

  const [weatherForecast, setWeatherForecast] = useState<WeatherForecast[]>(() => {
    const saved = localStorage.getItem(WEATHER_KEY);
    return saved ? JSON.parse(saved) : DEFAULT_WEATHER;
  });

  useEffect(() => localStorage.setItem(ITINERARY_KEY, JSON.stringify(itinerary)), [itinerary]);
  useEffect(() => localStorage.setItem(FOOD_KEY, JSON.stringify(foodItems)), [foodItems]);
  useEffect(() => localStorage.setItem(EXPENSES_KEY, JSON.stringify(expenses)), [expenses]);
  useEffect(() => localStorage.setItem(WEATHER_KEY, JSON.stringify(weatherForecast)), [weatherForecast]);

  const activeDayPlan = useMemo(() => itinerary.find(d => d.day === selectedDay), [itinerary, selectedDay]);
  const totalExpenseJpy = useMemo(() => expenses.reduce((s, i) => s + (i.amountJpy || 0), 0), [expenses]);
  const totalExpenseTwd = useMemo(() => expenses.reduce((s, i) => s + (i.amountTwd || 0), 0), [expenses]);

  const handleRefreshWeather = async () => {
    setIsWeatherUpdating(true);
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    try {
      const prompt = `請搜尋沖繩那霸 2026/1/11-1/14 的天氣預測或該時段歷史氣候趨勢。請返回符合以下結構的 JSON 陣列 (4天): 
      [{"date":"1/11 (日)","morning":{"temp":"16°","icon":"cloud","desc":"多雲"},"noon":{"temp":"22°","icon":"sun","desc":"晴"},"night":{"temp":"17°","icon":"moon","desc":"涼"},"clothingTip":"洋蔥式穿法"}]
      icon 僅限: sun, cloud, moon。`;
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
        config: { tools: [{googleSearch: {}}], responseMimeType: "application/json" }
      });
      const result = JSON.parse(response.text || '[]');
      if (Array.isArray(result) && result.length === 4) setWeatherForecast(result);
    } catch (e) { console.error(e); } finally { setIsWeatherUpdating(false); }
  };

  const updateAutoTraffic = async (targetDay: number) => {
    const dayPlan = itinerary.find(d => d.day === targetDay);
    if (!dayPlan || dayPlan.spots.length < 2) return;
    setIsTrafficUpdating(true);
    const updatedSpots = [...dayPlan.spots];
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    for (let i = 1; i < updatedSpots.length; i++) {
      const prev = updatedSpots[i - 1];
      const curr = updatedSpots[i];
      if (prev.address && curr.address && (!curr.travelTime || !curr.travelDistance)) {
        try {
          const prompt = `計算沖繩自駕：「${prev.address}」到「${curr.address}」。返回純 JSON: {"time": "25 min", "distance": "8.5 km"}`;
          const response = await ai.models.generateContent({
            model: 'gemini-3-flash-preview',
            contents: prompt,
            config: { responseMimeType: "application/json", responseSchema: { type: Type.OBJECT, properties: { time: { type: Type.STRING }, distance: { type: Type.STRING } }, required: ["time", "distance"] } }
          });
          const result = JSON.parse(response.text || '{}');
          updatedSpots[i] = { ...curr, travelTime: result.time, travelDistance: result.distance };
        } catch (e) { console.error(e); }
      }
    }
    setItinerary(prev => prev.map(d => d.day === targetDay ? { ...d, spots: updatedSpots } : d));
    setIsTrafficUpdating(false);
  };

  useEffect(() => {
    if (activeTab === TabType.ITINERARY) {
      const dayPlan = itinerary.find(d => d.day === selectedDay);
      if (dayPlan && dayPlan.spots.length >= 2) {
        const needsUpdate = dayPlan.spots.some((s, idx) => idx > 0 && (!s.travelTime || !s.travelDistance));
        if (needsUpdate) updateAutoTraffic(selectedDay);
      }
    }
  }, [selectedDay, activeTab]);

  const deleteSpot = (day: number, spotId: string) => {
    setItinerary(prev => prev.map(d => d.day === day ? { ...d, spots: d.spots.filter(s => s.id !== spotId) } : d));
    setTimeout(() => updateAutoTraffic(day), 100);
  };

  const saveSpot = (day: number, spot: Spot) => {
    setItinerary(prev => prev.map(d => d.day === day ? { 
      ...d, 
      spots: d.spots.some(x => x.id === spot.id) 
        ? d.spots.map(x => x.id === spot.id ? spot : x) 
        : [...d.spots, spot].sort((a, b) => a.time.localeCompare(b.time))
    } : d));
    setTimeout(() => updateAutoTraffic(day), 100);
  };

  const deleteExpense = (id: string) => {
    setExpenses(prev => prev.filter(e => e.id !== id));
  };

  const [isSpotModalOpen, setIsSpotModalOpen] = useState(false);
  const [editingSpot, setEditingSpot] = useState<Spot | null>(null);
  const [isFoodModalOpen, setIsFoodModalOpen] = useState(false);
  const [editingFood, setEditingFood] = useState<FoodItem | null>(null);
  const [isExpenseModalOpen, setIsExpenseModalOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState<ExpenseItem | null>(null);

  const renderOverview = () => (
    <div className="space-y-4 pb-32 animate-fadeIn pt-4 px-1">
      <div className="comic-border p-3.5 bg-white rounded-[24px]">
        <h3 className="text-sm font-black flex items-center gap-2 mb-3 italic text-[#4CB9E7] uppercase tracking-tight"><Plane size={16} /> 航班資訊</h3>
        <div className="space-y-2">
          <div className="bg-blue-50 p-3 rounded-xl border-[3px] border-[#2D3436]">
            <p className="font-black text-[#4CB9E7] text-[10px] flex justify-between">1/11 去程 FD230 <span className="text-slate-400">11:00 Check-in</span></p>
            <div className="flex justify-between items-end mt-1">
              <span className="text-[20px] font-black tracking-tighter">13:30 - 15:55</span>
              <div className="flex gap-1.5">
                <span className="text-[10px] bg-white border-2 border-[#2D3436] px-2 py-0.5 rounded-lg font-black italic shadow-sm text-[#2D3436]">手提 7kg</span>
                <span className="text-[10px] bg-[#2D3436] text-white px-2 py-0.5 rounded-lg font-black italic shadow-sm">托運 20kg</span>
              </div>
            </div>
          </div>
          <div className="bg-emerald-50 p-3 rounded-xl border-[3px] border-[#2D3436]">
            <p className="font-black text-emerald-600 text-[10px] flex justify-between">1/14 回程 BR185 <span className="text-slate-400">17:30 Check-in</span></p>
            <div className="flex justify-between items-end mt-1">
              <span className="text-[20px] font-black tracking-tighter">20:20 - 21:10</span>
              <div className="flex gap-1.5">
                <span className="text-[10px] bg-white border-2 border-[#2D3436] px-2 py-0.5 rounded-lg font-black italic shadow-sm text-[#2D3436]">手提 7kg</span>
                <span className="text-[10px] bg-[#2D3436] text-white px-2 py-0.5 rounded-lg font-black italic shadow-sm">托運 23kg</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="comic-border p-4 bg-white rounded-[24px] border-[4px] border-[#2D3436] shadow-[6px_6px_0px_#2D3436]">
        <div className="flex justify-between items-start mb-3">
          <div>
            <h3 className="text-base font-black flex items-center gap-1.5 italic text-[#2D3436] bubble-font"><Hotel size={18} className="text-[#FFD93D]" /> 那霸逸之彩飯店 (Hinode)</h3>
            <p className="text-[9px] font-black text-slate-400 mt-0.5 uppercase tracking-tighter">那霸市牧志 3-18-33 (牧志站 1min)</p>
          </div>
          <a href="https://www.google.com/maps/search/?api=1&query=Okinawa+Hinode+Hotel" target="_blank" className="bg-[#4CB9E7] text-white p-3 rounded-2xl border-2 border-slate-900 comic-button shadow-sm active:translate-y-0.5 transition-all"><Navigation2 size={24}/></a>
        </div>
        <div className="grid grid-cols-2 gap-2 text-[9px] font-black">
          <div className="bg-rose-50 p-2 rounded-lg border-2 border-slate-900 flex items-center gap-1.5 shadow-sm"><Utensils size={12}/> 早餐 (06:30-10:00)</div>
          <div className="bg-blue-50 p-2 rounded-lg border-2 border-slate-900 flex items-center gap-1.5 shadow-sm"><Soup size={12}/> 宵夜拉麵 (20:30-21:30)</div>
          <div className="bg-amber-50 p-2 rounded-lg border-2 border-slate-900 flex items-center gap-1.5 shadow-sm"><Beer size={12}/> 啤酒暢飲 (10:00-22:00)</div>
          <div className="bg-slate-50 p-2 rounded-lg border-2 border-slate-900 flex items-center gap-1.5 shadow-sm"><WashingMachine size={12}/> 24h 自助洗衣</div>
        </div>
      </div>

      <div className="comic-border p-4 bg-white rounded-[24px] border-[4px] border-[#2D3436] shadow-[6px_6px_0px_#2D3436]">
        <h3 className="text-sm font-black flex items-center gap-2 mb-3 italic text-[#E4405F] uppercase tracking-tight"><Instagram size={18} /> 地區美食 IG 搜尋</h3>
        <div className="grid grid-cols-2 gap-2.5">
          {foodItems.filter(f => f.type === '區域搜尋').map((food) => (
            <a key={food.id} href={`https://www.instagram.com/explore/tags/${encodeURIComponent(food.tags[0] + '美食')}/`} target="_blank" className="bg-white p-2.5 rounded-xl border-2 border-[#2D3436] comic-button shadow-[2.5px_2.5px_0px_#2D3436] flex flex-col items-center justify-center gap-1 active:translate-y-0.5 transition-all">
              <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Day {food.day}</span>
              <span className="text-[11px] font-black text-slate-900 italic">#{food.tags[0]}美食</span>
            </a>
          ))}
        </div>
      </div>

      <div className="comic-border p-4 bg-[#FF4747] text-white rounded-[32px] shadow-[6px_6px_0px_#2D3436]">
        <h3 className="text-base font-black flex items-center gap-2 mb-4 italic uppercase tracking-wider"><Car size={20} /> 沖繩自駕安全守則 ⚠️</h3>
        <div className="grid grid-cols-3 gap-2">
          {[
            { icon: <MoveLeft size={20}/>, label: '靠左行駛' },
            { icon: <span className="font-black text-lg">止</span>, label: '必停三秒' },
            { icon: <SmartphoneCharging size={20} className="text-yellow-300"/>, label: '禁止手機' },
            { icon: <BeerOff size={20} className="text-yellow-300"/>, label: '嚴禁酒駕' },
            { icon: <AlertTriangle size={20}/>, label: '紅燈禁轉' },
            { icon: <span className="font-black text-lg">60</span>, label: '遵守速限' }
          ].map((rule, i) => (
            <div key={i} className="bg-white/10 p-2 rounded-xl flex flex-col items-center border border-white/20 text-center">
               <div className="mb-1">{rule.icon}</div>
               <span className="text-[8px] font-black leading-none">{rule.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen px-3 pt-8 pb-32 font-sans max-w-lg mx-auto overflow-x-hidden selection:bg-[#FFD93D]" ref={mainContentRef}>
      <header className="mb-6 flex flex-col items-center">
        <div className="bg-[#FFD93D] px-8 py-3 rounded-[30px] comic-border rotate-[-1deg] mb-1.5 shadow-[6px_6px_0px_#2D3436]">
          <h1 className="text-2xl font-black text-slate-900 tracking-tighter bubble-font italic uppercase">沖 繩 旅 遊 Go！</h1>
        </div>
      </header>

      <main className="relative">
        {activeTab === TabType.OVERVIEW && renderOverview()}
        
        {activeTab === TabType.ITINERARY && (
          <div className="space-y-4 pb-40 animate-fadeIn">
            <div className="sticky top-[-4px] z-[90] bg-[#FFFBEB]/95 backdrop-blur-md pt-3 pb-3 border-b-2 border-[#2D3436] -mx-3 px-3 shadow-sm flex items-center justify-between">
              <div className="flex gap-2.5 overflow-x-auto hide-scrollbar py-1">
                {[1, 2, 3, 4].map(d => (
                  <button key={d} onClick={() => setSelectedDay(d)} className={`px-7 py-2 rounded-[20px] text-[11px] font-black border-2 border-[#2D3436] transition-all ${selectedDay === d ? 'bg-[#FF4747] text-white shadow-[3px_3px_0px_#2D3436]' : 'bg-white text-slate-300'}`}>Day {d}</button>
                ))}
              </div>
              {isTrafficUpdating && <Loader2 size={16} className="text-[#4CB9E7] animate-spin ml-2"/>}
            </div>

            {activeDayPlan && (
              <div className="pt-6 relative">
                <div className="flex justify-between items-center px-2 mb-6">
                  <h2 className="text-lg font-black italic bubble-font tracking-tight text-[#2D3436]">{activeDayPlan.title}</h2>
                  <button onClick={() => { setEditingSpot(null); setIsSpotModalOpen(true); }} className="bg-[#4CB9E7] text-white px-4 py-1.5 rounded-full border-2 border-[#2D3436] font-black italic text-[10px] shadow-[2.5px_2.5px_0px_#2D3436] active:translate-y-1 transition-all">+ 增加景點</button>
                </div>

                <div className="relative border-l-[8px] border-[#2D3436] ml-6 pl-9 pb-4">
                  {activeDayPlan.spots.map((spot, idx) => (
                    <div key={spot.id} className="relative mb-24 last:mb-4 group">
                      {idx > 0 && (
                        <div className="absolute -top-[82px] -left-[62px] z-20 w-[135px] flex flex-col items-center">
                          <div className="bg-[#FFD93D] px-3.5 py-2 rounded-2xl border-[4px] border-[#2D3436] shadow-[5px_5px_0px_#2D3436] flex items-center gap-2.5 justify-center min-w-[115px]">
                            <Car size={20} className="text-[#2D3436]" />
                            <div className="flex flex-col items-start leading-none gap-0.5">
                              <span className="text-[13px] font-black italic text-[#2D3436] uppercase tracking-tighter">
                                {spot.travelTime || '-- min'}
                              </span>
                              <span className="text-[11px] font-black italic text-[#2D3436] uppercase tracking-tighter opacity-80">
                                {spot.travelDistance || '-- km'}
                              </span>
                            </div>
                          </div>
                          <div className="w-[4px] h-11 bg-[#2D3436] -mt-1 -z-10"></div>
                        </div>
                      )}
                      
                      <div className="relative bg-white p-3.5 rounded-[24px] border-[4px] border-[#2D3436] shadow-[6px_6px_0px_#2D3436] transition-transform active:scale-[0.97]">
                        <div className="absolute -left-[64px] top-4 w-11 h-11 bg-[#FFD93D] text-[#2D3436] rounded-full flex items-center justify-center font-black italic border-[4px] border-[#2D3436] z-10 text-lg shadow-[3px_3px_0px_#2D3436]">{idx + 1}</div>
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="text-lg font-black text-[#FF4747] italic mb-0.5 tracking-tighter leading-none">{spot.time}</p>
                            <h4 className="text-xl font-black italic tracking-tighter leading-tight mt-1 text-[#2D3436] uppercase">{spot.name}</h4>
                          </div>
                          <div className="flex gap-2.5">
                            <button onClick={() => { setEditingSpot(spot); setIsSpotModalOpen(true); }} className="text-slate-300 hover:text-slate-900 transition-all"><Edit2 size={16} /></button>
                            <button onClick={() => deleteSpot(selectedDay, spot.id)} className="text-slate-300 hover:text-red-500 transition-all"><Trash2 size={16} /></button>
                          </div>
                        </div>

                        <div className="flex flex-wrap gap-1.5 mt-2 mb-2">
                          {spot.isReserved && (
                            <span className="bg-blue-500 text-white px-2 py-0.5 rounded-lg border-2 border-[#2D3436] text-[8px] font-black italic shadow-[1.5px_1.5px_0px_#2D3436] flex items-center gap-1">
                              <CheckCircle2 size={10}/> 已預約
                            </span>
                          )}
                          {spot.isPaid && (
                            <span className="bg-emerald-500 text-white px-2 py-0.5 rounded-lg border-2 border-[#2D3436] text-[8px] font-black italic shadow-[1.5px_1.5px_0px_#2D3436] flex items-center gap-1">
                              <ShieldCheck size={10}/> 已付款
                            </span>
                          )}
                          {spot.isPendingPayment && (
                            <span className="bg-orange-500 text-white px-2 py-0.5 rounded-lg border-2 border-[#2D3436] text-[8px] font-black italic shadow-[1.5px_1.5px_0px_#2D3436] flex items-center gap-1">
                              <Wallet size={10}/> 待付款
                            </span>
                          )}
                          {spot.showQRCode && (
                            <span className="bg-purple-500 text-white px-2 py-0.5 rounded-lg border-2 border-[#2D3436] text-[8px] font-black italic shadow-[1.5px_1.5px_0px_#2D3436] flex items-center gap-1">
                              <QrCode size={10}/> QR 碼
                            </span>
                          )}
                        </div>

                        <p className="text-[10px] font-bold text-gray-400 italic mt-2 leading-relaxed border-t border-slate-50 pt-2">{spot.description}</p>
                        <a href={spot.mapUrl} target="_blank" className="bg-[#4CB9E7] text-white py-2.5 rounded-xl border-[3px] border-[#2D3436] comic-button shadow-sm flex items-center justify-center gap-2 text-[10px] font-black italic mt-3.5 uppercase active:translate-y-0.5 transition-all"><Navigation2 size={18} /> 開啟導航</a>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === TabType.WEATHER && (
          <div className="space-y-4 pb-40 animate-fadeIn px-1">
            <div className="flex justify-between items-center px-2">
              <h2 className="text-lg font-black italic bubble-font tracking-tight text-indigo-600 uppercase">天氣穿著建議 ☀️</h2>
              <button onClick={handleRefreshWeather} disabled={isWeatherUpdating} className="bg-[#FF4747] text-white px-4 py-1.5 rounded-full border-2 border-[#2D3436] font-black italic text-[10px] shadow-[3px_3px_0px_#2D3436] active:translate-y-1 transition-all flex items-center gap-1.5">
                {isWeatherUpdating ? <Loader2 size={14} className="animate-spin" /> : <RefreshCw size={14} />} 即時更新
              </button>
            </div>
            {weatherForecast.map(w => (
              <div key={w.date} className="comic-border p-5 bg-white rounded-[32px] shadow-sm">
                <div className="flex justify-between items-center mb-5 border-b-2 border-slate-50 pb-3">
                  <span className="text-[14px] font-black italic text-[#FF4747]">{w.date}</span>
                  <span className="text-[10px] font-black text-indigo-600 italic bg-indigo-50 px-3 py-1 rounded-xl border border-indigo-100">{w.clothingTip}</span>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { label: '上午', data: w.morning, color: 'text-amber-400' },
                    { label: '中午', data: w.noon, color: 'text-[#FF4747]' },
                    { label: '晚上', data: w.night, color: 'text-indigo-400' }
                  ].map(slot => (
                    <div key={slot.label} className="flex flex-col items-center gap-2 p-3 bg-slate-50 rounded-2xl border-2 border-[#2D3436] shadow-sm">
                      <span className="text-[10px] font-black text-slate-400 italic">{slot.label}</span>
                      {slot.data.icon === 'sun' ? <Sun size={26} className={slot.color} /> : slot.data.icon === 'cloud' ? <Cloud size={26} className="text-slate-400" /> : <Moon size={26} className={slot.color} />}
                      <span className="text-[15px] font-black italic">{slot.data.temp}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === TabType.FOOD && (
          <div className="space-y-5 pb-40 animate-fadeIn px-1">
            <div className="flex justify-between items-center px-2">
              <h2 className="text-lg font-black italic bubble-font tracking-tight text-[#FF4747] uppercase">美食口袋名單 🤤</h2>
              <button onClick={() => { setEditingFood(null); setIsFoodModalOpen(true); }} className="bg-[#FF4747] text-white px-4 py-1.5 rounded-full border-2 border-[#2D3436] font-black italic text-[10px] shadow-[3px_3px_0px_#2D3436] active:translate-y-1 transition-all">+ 增加美食</button>
            </div>
            {foodItems.map(food => (
              <div key={food.id} className="comic-border p-5 bg-white rounded-[32px] relative overflow-hidden shadow-sm">
                <div className="absolute top-0 left-0 bg-[#FFD93D] px-4 py-1.5 border-r-[3px] border-b-[3px] border-[#2D3436] text-[10px] font-black italic shadow-sm">Day {food.day}</div>
                <div className="flex justify-between items-start mt-6 mb-2">
                  <h4 className="text-xl font-black italic tracking-tight">{food.name}</h4>
                  <div className="flex gap-3">
                    <button onClick={() => { setEditingFood(food); setIsFoodModalOpen(true); }} className="text-slate-300 hover:text-[#2D3436] transition-all"><Edit2 size={18} /></button>
                    <button onClick={() => setFoodItems(prev => prev.filter(f => f.id !== food.id))} className="text-slate-300 hover:text-red-500 transition-all"><Trash2 size={18} /></button>
                  </div>
                </div>
                <div className="bg-slate-50 p-4 rounded-[24px] border-[2px] border-[#2D3436] mb-4 shadow-inner">
                  <p className="text-[11px] font-black italic text-slate-500 mb-2">{food.description}</p>
                  <p className="text-[11px] font-black text-[#FF4747] italic flex items-center gap-2"><Sparkles size={14}/> {food.recommended}</p>
                </div>
                <div className="flex gap-3">
                  <a href={`https://www.instagram.com/explore/tags/${encodeURIComponent(food.tags[0] + '美食')}/`} target="_blank" className="flex-1 bg-[#E4405F] text-white py-3.5 rounded-xl border-2 border-[#2D3436] comic-button shadow-md flex items-center justify-center gap-2 text-[11px] font-black italic uppercase"><Instagram size={18}/> IG 搜尋</a>
                  <a href={food.mapUrl} target="_blank" className="bg-[#4CB9E7] text-white px-5 rounded-xl border-2 border-[#2D3436] comic-button shadow-md flex items-center justify-center"><MapPin size={22}/></a>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === TabType.SUPERMARKET && (
          <div className="space-y-5 pb-40 animate-fadeIn px-1">
            <h2 className="text-lg font-black italic px-2 bubble-font tracking-tight text-[#4CB9E7] uppercase">補給 (飯店優先) 🛒</h2>
            {DEFAULT_SUPERMARKETS.map(shop => (
              <div key={shop.id} className="comic-border p-5 bg-white rounded-[32px] relative shadow-sm">
                <div className="absolute top-0 left-0 bg-[#4CB9E7] text-white px-4 py-1.5 border-r-[3px] border-b-[3px] border-[#2D3436] text-[10px] font-black italic">
                  {shop.id === 's3' || shop.id === 's-h1' ? '飯店首選' : `Day ${shop.day}`}
                </div>
                <h4 className="text-lg font-black italic mt-6">{shop.name}</h4>
                <div className="mt-4 grid grid-cols-2 gap-2 text-[10px] font-black mb-4">
                  <div className="bg-slate-50 p-2.5 rounded-xl flex items-center gap-2 shadow-sm border border-slate-100"><Clock size={14} className="text-[#4CB9E7]"/> {shop.openingHours}</div>
                  <div className="bg-slate-50 p-2.5 rounded-xl flex items-center gap-2 shadow-sm border border-slate-100"><Wallet size={14} className="text-[#4CB9E7]"/> {shop.paymentMethods.join('/')}</div>
                </div>
                <p className="text-[11px] font-bold text-slate-400 italic mb-4">{shop.description}</p>
                <a href={shop.mapUrl} target="_blank" className="bg-[#2D3436] text-white w-full py-4 rounded-xl flex items-center justify-center gap-2 text-[11px] font-black italic comic-button border-2 border-[#2D3436] uppercase active:translate-y-0.5 transition-all shadow-md"><MapPin size={18}/> 導航至該店</a>
              </div>
            ))}
          </div>
        )}

        {activeTab === TabType.EXPENSES && (
          <div className="space-y-4 pb-40 animate-fadeIn px-1">
            <div className="comic-border p-6 bg-[#2D3436] text-white rounded-[36px] shadow-[8px_8px_0px_#FFD93D]">
              <h3 className="text-[11px] font-black italic text-[#FFD93D] uppercase mb-4 tracking-widest">目前支出總計 💰</h3>
              <p className="text-5xl font-black italic tracking-tighter">¥ {totalExpenseJpy.toLocaleString()}</p>
              <p className="text-lg font-bold text-[#4CB9E7] italic mt-1">≈ $ {totalExpenseTwd.toLocaleString()} TWD</p>
            </div>
            <div className="flex justify-between items-center px-2 pt-5">
              <h4 className="text-sm font-black italic uppercase tracking-widest text-[#2D3436]">紀錄明細</h4>
              <button onClick={() => { setEditingExpense(null); setIsExpenseModalOpen(true); }} className="bg-[#FF4747] text-white px-6 py-2.5 rounded-full border-2 border-[#2D3436] font-black italic text-[11px] shadow-[4px_4px_0px_#2D3436] active:translate-y-1 transition-all">+ 新增支出</button>
            </div>
            <div className="space-y-3">
              {expenses.length === 0 ? (
                <div className="py-24 text-center text-slate-300 font-black italic border-2 border-dashed border-slate-200 rounded-[32px]">尚未有任何紀錄</div>
              ) : (
                expenses.map(item => (
                  <div key={item.id} className="comic-border p-4 bg-white rounded-[24px] flex justify-between items-center transition-all active:scale-[0.98] group" onClick={() => { setEditingExpense(item); setIsExpenseModalOpen(true); }}>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="bg-[#FFD93D] text-[#2D3436] text-[8.5px] font-black px-2 py-0.5 rounded-md border border-[#2D3436] shadow-[1px_1px_0px_#2D3436]">{item.category}</span>
                        <h5 className="text-[15px] font-black italic text-[#2D3436]">{item.name || item.category}</h5>
                      </div>
                      <p className="text-[10px] font-bold text-slate-300 italic">{item.date}</p>
                    </div>
                    <div className="text-right flex items-center gap-4">
                      <div>
                        <p className="text-[18px] font-black italic text-[#2D3436]">¥ {item.amountJpy}</p>
                        <p className="text-[10px] font-bold text-slate-400 italic">$ {item.amountTwd} TWD</p>
                      </div>
                      <button onClick={(e) => { e.stopPropagation(); deleteExpense(item.id); }} className="p-2 text-slate-300 hover:text-red-500 transition-colors">
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {activeTab === TabType.GUIDE && (
          <div className="flex flex-col pb-24 animate-fadeIn px-2">
            <div className="comic-border p-5 bg-white rounded-[32px] mb-5 shadow-lg border-[4px] border-[#2D3436]">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-widest italic">手動調整匯率</h3>
                <input type="number" step="0.001" className="w-24 bg-slate-50 text-[14px] font-black text-right border-[3px] border-[#2D3436] rounded-xl px-3 py-1.5 focus:outline-none focus:border-[#4CB9E7]" value={customRate} onChange={e => setCustomRate(e.target.value)} />
              </div>
              <div className="flex flex-col gap-3">
                <button onClick={() => setIsTwdToJpy(false)} className={`w-full p-5 rounded-[24px] border-[4px] flex justify-between items-center transition-all ${!isTwdToJpy ? 'bg-[#2D3436] text-white border-[#2D3436] shadow-[5px_5px_0px_#FFD93D]' : 'bg-slate-50 text-gray-300 border-transparent'}`}>
                  <p className="text-[12px] font-black opacity-40 uppercase tracking-widest">JPY</p>
                  <p className="text-3xl font-black italic">¥ {!isTwdToJpy ? calcDisplay : (evaluateExpression(calcDisplay) / parseFloat(customRate)).toFixed(0)}</p>
                </button>
                <button onClick={() => setIsTwdToJpy(true)} className={`w-full p-5 rounded-[24px] border-[4px] flex justify-between items-center transition-all ${isTwdToJpy ? 'bg-[#FF4747] text-white border-[#2D3436] shadow-[5px_5px_0px_#2D3436]' : 'bg-slate-50 text-gray-600 border-transparent'}`}>
                  <p className="text-[12px] font-black opacity-40 uppercase tracking-widest">TWD</p>
                  <p className="text-3xl font-black italic">$ {isTwdToJpy ? calcDisplay : (evaluateExpression(calcDisplay) * parseFloat(customRate)).toFixed(0)}</p>
                </button>
              </div>
            </div>
            <div className="flex gap-3">
              <div className="grid grid-cols-3 gap-3 flex-[3.5]">
                {['7','8','9','4','5','6','1','2','3','0','.','C'].map(btn => (
                  <button key={btn} onClick={() => btn === 'C' ? setCalcDisplay('0') : setCalcDisplay(prev => prev === '0' ? btn : prev + btn)} className={`comic-button h-16 rounded-2xl font-black text-2xl border-[3px] border-[#2D3436] shadow-[3px_3px_0px_#2D3436] flex items-center justify-center ${btn === 'C' ? 'bg-rose-50 text-rose-500 border-rose-200' : 'bg-white text-[#2D3436]'}`}>{btn}</button>
                ))}
                <button onClick={() => setCalcDisplay(prev => prev.length > 1 ? prev.slice(0, -1) : '0')} className="comic-button h-16 bg-slate-100 rounded-2xl border-[3px] border-[#2D3436] flex items-center justify-center col-span-3 text-slate-600 font-black italic text-sm uppercase tracking-[0.2em] shadow-[3px_3px_0px_#2D3436]">Delete</button>
              </div>
              <div className="flex flex-col gap-3 flex-1">
                <button onClick={() => setCalcDisplay(prev => prev + '/')} className="comic-button h-16 bg-white border-[3px] border-[#2D3436] rounded-2xl flex items-center justify-center shadow-[3px_3px_0px_#2D3436]"><Divide size={24} /></button>
                <button onClick={() => setCalcDisplay(prev => prev + '*')} className="comic-button h-16 bg-white border-[3px] border-[#2D3436] rounded-2xl flex items-center justify-center shadow-[3px_3px_0px_#2D3436]"><X size={24} /></button>
                <button onClick={() => setCalcDisplay(prev => prev + '-')} className="comic-button h-16 bg-white border-[3px] border-[#2D3436] rounded-2xl flex items-center justify-center shadow-[3px_3px_0px_#2D3436]"><Minus size={24} /></button>
                <button onClick={() => setCalcDisplay(prev => prev + '+')} className="comic-button flex-1 bg-[#4CB9E7] text-white rounded-2xl font-black text-3xl border-[3px] border-[#2D3436] shadow-[4px_4px_0px_#2D3436] flex items-center justify-center min-h-[100px]"><Plus size={36} /></button>
                <button onClick={() => setCalcDisplay(evaluateExpression(calcDisplay).toString())} className="comic-button flex-1 bg-[#FF4747] text-white rounded-2xl font-black border-[3px] border-[#2D3436] shadow-[5px_5px_0px_#2D3436] flex items-center justify-center min-h-[100px]"><Equal size={40} /></button>
              </div>
            </div>
          </div>
        )}
      </main>

      <BottomNav activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <SpotModal isOpen={isSpotModalOpen} onClose={() => { setIsSpotModalOpen(false); setEditingSpot(null); }} onSave={s => saveSpot(selectedDay, s)} initialSpot={editingSpot} />
      <FoodModal isOpen={isFoodModalOpen} onClose={() => { setIsFoodModalOpen(false); setEditingFood(null); }} onSave={food => setFoodItems(prev => editingFood ? prev.map(f => f.id === food.id ? food : f) : [...prev, food])} initialFood={editingFood} />
      <ExpenseModal isOpen={isExpenseModalOpen} onClose={() => { setIsExpenseModalOpen(false); setEditingExpense(null); }} onSave={exp => setExpenses(prev => editingExpense ? prev.map(e => e.id === exp.id ? exp : e) : [...prev, exp])} initialExpense={editingExpense} exchangeRate={parseFloat(customRate)} />
    </div>
  );
};

export default App;
