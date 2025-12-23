
import React, { useState, useEffect, useMemo } from 'react';
import { TabType, DayPlan, Spot, SpotCategory, FoodItem } from './types';
import { INITIAL_ITINERARY } from './constants';
import BottomNav from './components/BottomNav';
import SpotCard from './components/SpotCard';
import SpotModal from './components/SpotModal';
import DayModal from './components/DayModal';
import FoodModal from './components/FoodModal';
import { GoogleGenAI, Type } from "@google/genai";
import { 
  Plane, Hotel, MapPin, Coins, CloudSun, Sun, Cloud, Plus, 
  FileCheck, Wifi, ShieldCheck, CreditCard, Map as MapIcon, Navigation, Car,
  CheckCircle2, Info, ArrowRight, Route, TrendingUp, Calculator, 
  Waves, Utensils, Beer, WashingMachine, HeartPulse, Smile, Luggage, Umbrella,
  Clock, Star, Wallet, ShoppingBag, Coffee, Store, Users, IceCream, Pizza,
  Edit2, Trash2, Briefcase, AlertTriangle, ShieldAlert, Navigation2, Loader2, Sparkles
} from 'lucide-react';

const ITINERARY_KEY = 'okinawa_itinerary_v6';
const FOOD_KEY = 'okinawa_food_v6';
const RATE_KEY = 'okinawa_rate_v6';
const HOTEL_ADDRESS = '3 Chome-18-33 Makishi, Naha, Okinawa 900-0013日本';

const DEFAULT_FOOD: FoodItem[] = [
  { id: 'f1', name: "傑克牛排 Jack's Steak House", type: "名店", time: "11:00-22:30", mapUrl: "https://www.google.com/maps/search/?api=1&query=Jack+Steak+House+Naha", tags: ["飯店步行 10 分", "經典 Tenderloin"], groupFriendly: false, day: 1, description: "沖繩老字號牛排，口感厚實。7人建議分桌。" },
  { id: 'f2', name: "Blue Seal 國際通店", type: "點心", time: "10:00-22:00", mapUrl: "https://www.google.com/maps/search/?api=1&query=Blue+Seal+Kokusai+Dori", tags: ["沖繩必吃冰", "紅芋口味"], groupFriendly: true, day: 1, description: "美式風情冰淇淋，口味超多。" },
  { id: 'f3', name: "暖暮拉麵 牧志店", type: "小吃", time: "11:00-02:00", mapUrl: "https://www.google.com/maps/search/?api=1&query=Danbo+Ramen+Makishi", tags: ["宵夜首選", "排隊名店"], groupFriendly: false, day: 1, description: "濃郁豚骨湯頭，適合少數人分批吃。" },
  { id: 'f4', name: "岸本食堂 (蕎麥麵)", type: "名店", time: "11:00-17:30", mapUrl: "https://www.google.com/maps/search/?api=1&query=Kishimoto+Shokudo", tags: ["水族館 10 分", "百年手打"], groupFriendly: true, day: 2, description: "百年名店，手打麵條超 Q。7人有和式大桌。" },
  { id: 'f5', name: "Kouri Shrimp 蝦蝦飯", type: "必買", time: "11:00-18:00", mapUrl: "https://www.google.com/maps/search/?api=1&query=Kouri+Shrimp", tags: ["古宇利島", "蒜香超濃"], groupFriendly: true, day: 2, description: "餐車發跡，戶外座位區適合 7 人。" },
  { id: 'f6', name: "幸福鬆餅 (瀨長島)", type: "點心", time: "11:00-19:00", mapUrl: "https://www.google.com/maps/search/?api=1&query=A+Happy+Pancake+Okinawa", tags: ["海景第一排", "需預約"], groupFriendly: true, day: 4, description: "超人氣鬆餅，蓬鬆可口。7人務必提早兩週預約。" }
];

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>(TabType.OVERVIEW);
  const [selectedDay, setSelectedDay] = useState<number>(1);
  const [mapSelectedDay, setMapSelectedDay] = useState<number>(1);
  const [isSyncing, setIsSyncing] = useState(false);
  
  const [itinerary, setItinerary] = useState<DayPlan[]>(() => {
    const saved = localStorage.getItem(ITINERARY_KEY);
    return saved ? JSON.parse(saved) : INITIAL_ITINERARY;
  });

  const [foodItems, setFoodItems] = useState<FoodItem[]>(() => {
    const saved = localStorage.getItem(FOOD_KEY);
    return saved ? JSON.parse(saved) : DEFAULT_FOOD;
  });

  const [customRate, setCustomRate] = useState<string>(() => {
    const saved = localStorage.getItem(RATE_KEY);
    return saved || '0.215';
  });

  useEffect(() => localStorage.setItem(ITINERARY_KEY, JSON.stringify(itinerary)), [itinerary]);
  useEffect(() => localStorage.setItem(FOOD_KEY, JSON.stringify(foodItems)), [foodItems]);
  useEffect(() => localStorage.setItem(RATE_KEY, customRate), [customRate]);

  const [isSpotModalOpen, setIsSpotModalOpen] = useState(false);
  const [isDayModalOpen, setIsDayModalOpen] = useState(false);
  const [isFoodModalOpen, setIsFoodModalOpen] = useState(false);
  const [editingSpot, setEditingSpot] = useState<Spot | null>(null);
  const [editingFood, setEditingFood] = useState<FoodItem | null>(null);

  const [jpyInput, setJpyInput] = useState<string>('1000');
  const twdResult = useMemo(() => {
    const jpy = parseFloat(jpyInput) || 0;
    const rate = parseFloat(customRate) || 0;
    return (jpy * rate).toFixed(0);
  }, [jpyInput, customRate]);

  const activeDayPlan = useMemo(() => {
    const plan = itinerary.find(d => d.day === selectedDay);
    if (!plan) return null;
    return { ...plan, spots: [...plan.spots].sort((a, b) => a.time.localeCompare(b.time)) };
  }, [itinerary, selectedDay]);

  const mapDayPlan = useMemo(() => {
    const plan = itinerary.find(d => d.day === mapSelectedDay);
    if (!plan) return null;
    return { ...plan, spots: [...plan.spots].sort((a, b) => a.time.localeCompare(b.time)) };
  }, [itinerary, mapSelectedDay]);

  // 自動同步交通資訊
  const syncDayTraffic = async (dayNum: number, spots: Spot[]) => {
    if (spots.length < 2) return;
    setIsSyncing(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const sortedSpots = [...spots].sort((a, b) => a.time.localeCompare(b.time));
      
      const locations = sortedSpots.map(s => `"${s.name}" (${s.address})`).join(' -> ');
      const prompt = `你是一位專業的沖繩導遊。請計算以下依序排列的景點之間的預估開車交通資訊：
      路線：${locations}
      
      請計算每一對相鄰景點間的開車時間與距離。
      必須返回 JSON 陣列，長度為 ${sortedSpots.length - 1}，格式如下：
      [
        {"time": "15 min", "distance": "5.2 km"},
        {"time": "30 min", "distance": "20.1 km"}
      ]
      請考慮沖繩當地實際道路狀況。`;

      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                time: { type: Type.STRING },
                distance: { type: Type.STRING }
              },
              required: ["time", "distance"]
            }
          }
        }
      });

      const trafficResults = JSON.parse(response.text || '[]');
      if (Array.isArray(trafficResults) && trafficResults.length === sortedSpots.length - 1) {
        setItinerary(prev => prev.map(d => {
          if (d.day === dayNum) {
            const updatedSpots = sortedSpots.map((spot, idx) => {
              if (idx < trafficResults.length) {
                return { 
                  ...spot, 
                  travelTime: trafficResults[idx].time, 
                  travelDistance: trafficResults[idx].distance 
                };
              }
              return { ...spot, travelTime: '', travelDistance: '' };
            });
            return { ...d, spots: updatedSpots };
          }
          return d;
        }));
      }
    } catch (error) {
      console.error("同步交通資訊失敗:", error);
    } finally {
      setIsSyncing(false);
    }
  };

  const handleSaveDay = (dayData: Partial<DayPlan>) => {
    setItinerary(prev => prev.map(d => d.day === selectedDay ? { ...d, ...dayData } : d));
  };

  const handleSaveSpot = async (spotData: Spot) => {
    let newSpots: Spot[] = [];
    setItinerary(prev => {
      const dayPlan = prev.find(d => d.day === selectedDay);
      if (!dayPlan) return prev;
      
      const existing = dayPlan.spots.some(s => s.id === spotData.id);
      newSpots = existing 
        ? dayPlan.spots.map(s => s.id === spotData.id ? spotData : s)
        : [...dayPlan.spots, spotData];
      
      newSpots.sort((a, b) => a.time.localeCompare(b.time));
      
      return prev.map(d => d.day === selectedDay ? { ...d, spots: newSpots } : d);
    });
    
    // 儲存後自動同步
    setTimeout(() => syncDayTraffic(selectedDay, newSpots), 100);
  };

  const handleDeleteSpot = (id: string) => {
    if (!window.confirm('確定要刪除這個景點嗎？')) return;
    
    let newSpots: Spot[] = [];
    setItinerary(prev => {
      const dayPlan = prev.find(d => d.day === selectedDay);
      if (!dayPlan) return prev;
      newSpots = dayPlan.spots.filter(s => s.id !== id);
      return prev.map(d => d.day === selectedDay ? { ...d, spots: newSpots } : d);
    });
    
    // 刪除後自動同步
    setTimeout(() => syncDayTraffic(selectedDay, newSpots), 100);
  };

  const handleSaveFood = (foodData: FoodItem) => {
    setFoodItems(prev => {
      const exists = prev.some(f => f.id === foodData.id);
      if (exists) return prev.map(f => f.id === foodData.id ? foodData : f);
      return [...prev, foodData];
    });
  };

  const handleDeleteFood = (id: string) => {
    if (window.confirm('確定要刪除這項美食推薦嗎？')) {
      setFoodItems(prev => prev.filter(f => f.id !== id));
    }
  };

  const renderDrivingTips = () => (
    <div className="anime-card p-6 bg-blue-50/30 border-[#4CB9E7]/20 border-2">
      <h3 className="text-xl font-black flex items-center gap-3 mb-6 text-gray-800">
        <div className="bg-[#4CB9E7] p-2 rounded-2xl text-white shadow-lg shadow-blue-100"><Car size={20} /></div>
        沖繩右駕新手村 🇯🇵
      </h3>
      
      <div className="space-y-4">
        <div className="flex gap-4 items-start bg-white p-4 rounded-3xl shadow-sm border border-slate-50">
          <div className="bg-red-50 p-3 rounded-2xl shrink-0"><AlertTriangle className="text-red-500" size={24} /></div>
          <div>
            <p className="font-black text-sm text-gray-800">靠左行駛 (Left Lane)</p>
            <p className="text-[10px] font-bold text-gray-500 leading-relaxed mt-1">口訣：左小轉、右大轉。駕駛者中心始終靠近路中間分界線。</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="bg-white p-4 rounded-3xl shadow-sm border border-slate-50">
            <div className="bg-amber-500 w-8 h-8 rounded-lg flex items-center justify-center text-white font-black text-[10px] mb-2 shadow-sm">止</div>
            <p className="font-black text-xs text-gray-800">必須完全停車</p>
            <p className="text-[9px] font-bold text-gray-400 mt-1">看到「止まれ」三角標誌，輪胎必須停止轉動 3 秒。</p>
          </div>
          <div className="bg-white p-4 rounded-3xl shadow-sm border border-slate-50">
            <div className="bg-blue-500 w-8 h-8 rounded-full flex items-center justify-center text-white mb-2 shadow-sm"><Navigation2 size={14} className="rotate-180" /></div>
            <p className="font-black text-xs text-gray-800">單行道注意</p>
            <p className="text-[9px] font-bold text-gray-400 mt-1">藍底白箭頭表示該路段為單向通行，請勿逆向。</p>
          </div>
        </div>

        <div className="bg-emerald-50 p-4 rounded-3xl border border-emerald-100">
          <p className="text-[11px] font-black text-emerald-700 flex items-center gap-2">
            <ShieldAlert size={14} /> 行人絕對優先
          </p>
          <p className="text-[10px] font-bold text-emerald-600/70 mt-1">日本駕駛極度禮讓行人，轉彎處務必減速查看有無路人。</p>
        </div>
      </div>
    </div>
  );

  const renderOverview = () => (
    <div className="space-y-6 animate-bounceIn pb-32 text-gray-800">
      <div className="anime-card p-6">
        <h3 className="text-xl font-black flex items-center gap-3 mb-6">
          <div className="bg-[#FF4747] p-2 rounded-2xl text-white shadow-lg shadow-red-100"><Plane size={20} /></div>
          飛行任務
        </h3>
        <div className="space-y-4">
          <div className="bg-rose-50 border-2 border-rose-100 p-4 rounded-[28px] relative overflow-hidden">
            <div className="flex justify-between items-center mb-2">
              <span className="text-[10px] font-black text-[#FF4747] uppercase">Departure</span>
              <div className="flex gap-2">
                <div className="flex items-center gap-1 text-[#FF4747]">
                  <Luggage size={12} />
                  <span className="text-[10px] font-black italic">20kg</span>
                </div>
                <div className="flex items-center gap-1 text-rose-300">
                  <Briefcase size={12} />
                  <span className="text-[10px] font-black italic">7kg</span>
                </div>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <div><p className="text-2xl font-black">13:25</p><p className="text-[10px] font-bold text-gray-400 italic">01/11 (日) TPE</p></div>
              <ArrowRight className="text-rose-200" />
              <div className="text-right"><p className="text-2xl font-black">15:55</p><p className="text-[10px] font-bold text-gray-400 italic">OKA</p></div>
            </div>
          </div>
          <div className="bg-sky-50 border-2 border-sky-100 p-4 rounded-[28px] relative overflow-hidden">
            <div className="flex justify-between items-center mb-2">
              <span className="text-[10px] font-black text-[#4CB9E7] uppercase">Return</span>
              <div className="flex gap-2">
                <div className="flex items-center gap-1 text-[#4CB9E7]">
                  <Luggage size={12} />
                  <span className="text-[10px] font-black italic">23kg</span>
                </div>
                <div className="flex items-center gap-1 text-sky-300">
                  <Briefcase size={12} />
                  <span className="text-[10px] font-black italic">7kg</span>
                </div>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <div><p className="text-2xl font-black">20:10</p><p className="text-[10px] font-bold text-gray-400 italic">01/14 (三) OKA</p></div>
              <ArrowRight className="text-sky-200" />
              <div className="text-right"><p className="text-2xl font-black">21:50</p><p className="text-[10px] font-bold text-gray-400 italic">TPE</p></div>
            </div>
          </div>
        </div>
      </div>

      {renderDrivingTips()}

      <div className="anime-card p-6 relative overflow-hidden">
        <div className="flex justify-between items-start mb-6">
            <h3 className="text-xl font-black flex items-center gap-3"><div className="bg-[#FF4747] p-2 rounded-2xl text-white shadow-lg shadow-red-100"><Hotel size={20} /></div>沖繩逸之彩飯店</h3>
            <span className="text-[10px] font-black text-white bg-[#4CB9E7] px-3 py-1 rounded-full sticker-label">4 Nights</span>
        </div>
        <div className="bg-slate-50 p-4 rounded-[24px] mb-6 flex items-start gap-3 border-2 border-white">
            <MapPin size={18} className="text-[#4CB9E7] shrink-0 mt-0.5" /><span className="text-xs font-bold text-gray-500 leading-relaxed">{HOTEL_ADDRESS}</span>
        </div>
        <div className="grid grid-cols-2 gap-3">
            {[ { icon: <Utensils size={14} />, title: '能量早餐', info: '07:00-10:00' }, { icon: <Beer size={14} />, title: '暢飲大會', info: '全日啤酒' }, { icon: <Waves size={14} />, title: '宵夜拉麵', info: '20:30-21:30' }, { icon: <WashingMachine size={14} />, title: '自助洗衣', info: '2F' } ].map((item, i) => (
                <div key={i} className="bg-white p-3.5 rounded-[22px] border-2 border-slate-50 shadow-sm flex flex-col gap-1">
                    <div className="flex items-center gap-2 text-[#4CB9E7]">{item.icon}<span className="text-[9px] font-black text-gray-400 uppercase">{item.title}</span></div>
                    <p className="text-[10px] font-black text-gray-600">{item.info}</p>
                </div>
            ))}
        </div>
      </div>
    </div>
  );

  const renderItinerary = () => {
    if (!activeDayPlan) return null;
    return (
      <div className="space-y-6 pb-32 animate-fadeIn">
        <div className="flex gap-2 overflow-x-auto pb-2 px-1 custom-scrollbar">
          {itinerary.map(d => (
            <button key={d.day} onClick={() => setSelectedDay(d.day)} className={`shrink-0 w-12 h-12 rounded-2xl font-black text-xs transition-all ${selectedDay === d.day ? 'bg-[#FF4747] text-white shadow-lg scale-110' : 'bg-white text-slate-300 shadow-sm'}`}>D{d.day}</button>
          ))}
        </div>
        <div className="px-2 flex justify-between items-start">
          <div>
            <h2 className="text-3xl font-black text-gray-800 tracking-tight">{activeDayPlan.title}</h2>
            <p className="text-[10px] font-black text-[#4CB9E7] mt-1 uppercase tracking-widest">{activeDayPlan.date}</p>
          </div>
          <div className="flex gap-2">
            {isSyncing && <div className="p-2 text-[#FF4747] animate-spin"><Loader2 size={20} /></div>}
            <button onClick={() => setIsDayModalOpen(true)} className="p-2 text-slate-300 hover:text-[#FF4747] transition-colors">
              <Edit2 size={20} />
            </button>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3 px-2">
          <div className="bg-amber-50 p-4 rounded-[24px] border-2 border-white shadow-sm flex items-start gap-2"><CheckCircle2 size={14} className="text-amber-500 shrink-0 mt-0.5" /><p className="text-[10px] font-bold text-amber-700 leading-relaxed">{activeDayPlan.clothingTips}</p></div>
          <div className="bg-blue-50 p-4 rounded-[24px] border-2 border-white shadow-sm flex items-start gap-2"><Info size={14} className="text-blue-500 shrink-0 mt-0.5" /><p className="text-[10px] font-bold text-blue-700 leading-relaxed">{activeDayPlan.weatherTips}</p></div>
        </div>
        
        <div className="px-2">
          <div className="bg-white p-3 rounded-2xl border-2 border-blue-50 flex items-center gap-3">
             <div className="bg-blue-500 p-2 rounded-xl text-white"><Car size={16} /></div>
             <div>
               <p className="text-[10px] font-black text-gray-800">自駕貼士：左小右大</p>
               <p className="text-[8px] font-bold text-gray-400 tracking-tighter italic">日本路口轉彎後，請保持在左側車道喔！</p>
             </div>
          </div>
        </div>

        <div className="space-y-6 px-2">
          {activeDayPlan.spots.map((spot, index) => (
            <React.Fragment key={spot.id}>
              <SpotCard 
                spot={spot} 
                onEdit={(s) => { setEditingSpot(s); setIsSpotModalOpen(true); }} 
                onDelete={(id) => handleDeleteSpot(id)} 
              />
              {index < activeDayPlan.spots.length - 1 && (
                <div className="flex items-center justify-center py-2 relative">
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none"><div className="w-[2px] h-full border-dashed border-l-2 border-slate-200"></div></div>
                  <div className="relative z-10 flex items-center gap-2 bg-slate-100 px-4 py-1.5 rounded-full border border-slate-200 shadow-sm">
                    {isSyncing ? <Loader2 size={12} className="text-[#FF4747] animate-spin" /> : <Car size={12} className="text-[#4CB9E7]" />}
                    <span className="text-[9px] font-black text-slate-400 italic">
                      {isSyncing ? '同步中...' : spot.travelTime ? `預計開車 ${spot.travelTime} (${spot.travelDistance})` : '點擊同步路線'}
                    </span>
                  </div>
                </div>
              )}
            </React.Fragment>
          ))}
          <button onClick={() => { setEditingSpot(null); setIsSpotModalOpen(true); }} className="w-full py-8 rounded-[32px] border-4 border-dashed border-slate-200 text-slate-300 flex flex-col items-center gap-2 hover:border-[#FF4747] hover:text-[#FF4747] bg-white/50 transition-all"><Plus size={24} /><span className="text-xs font-black uppercase tracking-widest">新增探險景點</span></button>
        </div>
      </div>
    );
  };

  const renderFood = () => (
    <div className="space-y-8 animate-bounceIn pb-32">
      <div className="px-2 flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-black text-gray-800 tracking-tight">沖繩美食指南 🤤</h2>
          <p className="text-[10px] font-black text-[#FF4747] mt-1 uppercase tracking-widest italic">Gourmet Checklist</p>
        </div>
        <button onClick={() => { setEditingFood(null); setIsFoodModalOpen(true); }} className="bg-[#FF4747] text-white p-3 rounded-2xl shadow-lg shadow-red-100"><Plus size={20} /></button>
      </div>

      <div className="space-y-8">
        {[1, 2, 3, 4].map(dayNum => {
          const dayFoods = foodItems.filter(f => f.day === dayNum);
          if (dayFoods.length === 0) return null;
          return (
            <div key={dayNum} className="space-y-4 px-1">
              <div className="flex items-center gap-3"><div className="bg-[#FF4747] w-2 h-6 rounded-full"></div><h3 className="text-lg font-black text-gray-700">Day {dayNum} 推薦</h3></div>
              <div className="grid grid-cols-1 gap-4">
                {dayFoods.map(food => (
                  <div key={food.id} className="anime-card p-5 border-4 border-white bg-white relative overflow-hidden shadow-xl shadow-slate-100/50">
                    {food.groupFriendly && (
                      <div className="absolute top-[-15px] right-[-15px] bg-emerald-500 text-white p-5 rotate-12 flex items-center gap-1 shadow-md z-10">
                        <Users size={12} className="mt-2" /><span className="text-[8px] font-black mt-2 tracking-tighter">7P OK</span>
                      </div>
                    )}
                    <div className="flex justify-between items-start mb-3 pr-10">
                      <div>
                        <span className="text-[10px] font-black text-[#4CB9E7] uppercase mb-0.5 block">{food.type}</span>
                        <h4 className="text-base font-black text-gray-800">{food.name}</h4>
                      </div>
                      <div className="flex gap-1">
                        <button onClick={() => { setEditingFood(food); setIsFoodModalOpen(true); }} className="p-2 text-slate-300 hover:text-[#4CB9E7] active:scale-90 transition-all"><Edit2 size={16} /></button>
                        <button onClick={() => handleDeleteFood(food.id)} className="p-2 text-slate-300 hover:text-rose-400 active:scale-90 transition-all"><Trash2 size={16} /></button>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 mb-3 text-gray-400 font-bold text-[10px]"><Clock size={12} /><span>{food.time}</span></div>
                    <p className="text-[11px] font-bold text-gray-500 leading-relaxed mb-4 bg-slate-50 p-3 rounded-xl border border-white shadow-inner">{food.description}</p>
                    <div className="flex flex-wrap gap-2 mb-5">
                      {food.tags.map(tag => <span key={tag} className="bg-[#FFD93D]/10 text-[#B08A00] px-2 py-0.5 rounded-lg text-[9px] font-black italic border border-[#FFD93D]/20">#{tag}</span>)}
                    </div>
                    <a href={food.mapUrl} target="_blank" rel="noopener noreferrer" className="w-full bg-[#FF4747] text-white py-3.5 rounded-2xl flex items-center justify-center gap-2 text-[10px] font-black shadow-lg shadow-red-100 active:scale-95 transition-all"><MapIcon size={14} /> 導航任務</a>
                  </div>
                ))}
              </div>
            </div>
          );
        })}

        <div className="px-1 mt-4">
          <button 
            onClick={() => { setEditingFood(null); setIsFoodModalOpen(true); }}
            className="w-full py-10 rounded-[40px] border-4 border-dashed border-slate-200 text-slate-300 flex flex-col items-center gap-3 hover:border-[#FF4747] hover:text-[#FF4747] bg-white/40 backdrop-blur-sm transition-all shadow-sm"
          >
            <div className="bg-white p-3 rounded-full shadow-md">
              <Plus size={28} />
            </div>
            <span className="text-xs font-black uppercase tracking-[0.2em] italic">新增美食發現任務</span>
          </button>
        </div>
      </div>
    </div>
  );

  const renderSupermarket = () => (
    <div className="space-y-6 animate-bounceIn pb-32 px-1">
      <div className="px-1">
        <h2 className="text-3xl font-black text-gray-800 tracking-tight">補給任務站 🛒</h2>
        <p className="text-xs font-black text-[#4CB9E7] mt-1 uppercase tracking-widest italic">Nearest Supplies</p>
      </div>
      {[
        { name: 'MaxValu 牧志店', near: 'Day 1: 飯店步行 5 分 (最方便)', time: '24H', map: 'https://www.google.com/maps/search/?api=1&query=MaxValu+Makishi', tips: '宵夜採買、消暑飲料。24小時隨時出發。' },
        { name: 'San-A 宜野灣店', near: 'Day 2: 去北部途中路過', time: '09:00-23:00', map: 'https://www.google.com/maps/search/?api=1&query=San-A+Ginowan', tips: '龍頭超市，熟食種類極多，適合買壽司拼盤。' },
        { name: 'Union 豐見城店', near: 'Day 4: OTS 還車點旁 2 分鐘', time: '24H', map: 'https://www.google.com/maps/search/?api=1&query=Union+Toyomi', tips: '在地價格最平，還車前最後掃貨餅乾、伴手禮。' }
      ].map((shop, i) => (
        <div key={i} className="anime-card p-6 border-4 border-white bg-white shadow-xl shadow-slate-100">
          <h3 className="text-xl font-black text-gray-800 mb-3">{shop.name}</h3>
          <div className="bg-slate-50 p-3 rounded-2xl mb-4 flex items-center gap-2 border border-slate-100"><MapPin size={14} className="text-[#FF4747]" /><p className="text-[11px] font-black text-gray-500">位置：<span className="text-[#4CB9E7]">{shop.near}</span></p></div>
          <div className="flex items-center gap-3 mb-4 text-xs font-bold text-gray-600"><Clock size={16} className="text-slate-400" /><span>營業時間：{shop.time}</span></div>
          <p className="text-xs font-bold text-gray-500 italic mb-6 leading-relaxed bg-emerald-50 p-3 rounded-2xl border border-emerald-100">{shop.tips}</p>
          <a href={shop.map} target="_blank" rel="noopener noreferrer" className="w-full bg-[#4CB9E7] text-white py-4 rounded-[24px] flex items-center justify-center gap-2 text-xs font-black shadow-lg shadow-blue-100 transition-all"><ShoppingBag size={16} /> 前往補給</a>
        </div>
      ))}
    </div>
  );

  const renderMap = () => (
    <div className="space-y-6 animate-bounceIn pb-32 px-1">
      <div className="flex justify-between items-center px-1">
        <h2 className="text-3xl font-black text-gray-800 tracking-tight">探險導覽 🗺️</h2>
        <div className="flex gap-1">
          {[1, 2, 3, 4].map(d => (
            <button key={d} onClick={() => setMapSelectedDay(d)} className={`w-9 h-9 rounded-xl font-black text-[10px] shadow-sm transition-all ${mapSelectedDay === d ? 'bg-gray-800 text-white scale-110' : 'bg-white text-slate-300'}`}>D{d}</button>
          ))}
        </div>
      </div>
      <div className="anime-card p-6 bg-white relative overflow-hidden min-h-[400px]">
        <div className="relative z-10 space-y-8">
          {mapDayPlan?.spots.map((spot, i) => (
            <div key={spot.id} className="relative pl-10">
              {i < mapDayPlan.spots.length - 1 && <div className="absolute left-[15px] top-8 w-[2px] h-full bg-slate-50"></div>}
              <div className="absolute left-0 top-0 w-8 h-8 rounded-full bg-white border-4 border-slate-50 flex items-center justify-center text-[10px] font-black text-gray-400 shadow-sm">{i+1}</div>
              <div className="flex justify-between items-start gap-4">
                <div className="flex-1 overflow-hidden">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] font-black text-gray-800 bg-slate-50 px-1.5 py-0.5 rounded-md">{spot.time}</span>
                    <h4 className="text-sm font-black text-gray-700 truncate">{spot.name}</h4>
                  </div>
                  <p className="text-[10px] font-bold text-gray-400 line-clamp-1 italic">{spot.address}</p>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <a href={spot.mapUrl} target="_blank" rel="noopener noreferrer" className="bg-[#4CB9E7] text-white p-2.5 rounded-xl shadow-md active:scale-90 transition-all shrink-0"><Navigation size={14} /></a>
                </div>
              </div>
              {i < mapDayPlan.spots.length - 1 && spot.travelTime && (
                <div className="mt-3 text-[9px] font-black text-[#4CB9E7] italic bg-blue-50/50 py-1 px-3 rounded-lg border border-blue-100/50 inline-block">
                  下站預計：{spot.travelTime} ({spot.travelDistance})
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderGuide = () => (
    <div className="space-y-6 animate-bounceIn pb-32">
      <div className="anime-card p-8 relative overflow-hidden bg-white">
        <div className="flex items-center justify-between mb-8">
            <h3 className="text-2xl font-black flex items-center gap-3 text-gray-800"><div className="bg-[#FFD93D] p-2.5 rounded-2xl text-white shadow-lg"><Coins size={26} /></div>匯率大補帖</h3>
            <Calculator className="text-slate-100" size={32}/>
        </div>
        
        <div className="bg-slate-50 p-5 rounded-[28px] border-4 border-white shadow-inner mb-8">
            <label className="block text-[11px] font-black text-gray-400 uppercase mb-4 tracking-widest flex items-center gap-2"><TrendingUp size={14} className="text-[#4CB9E7]"/> 設定匯率 (1 JPY = ? TWD)</label>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                <div className="bg-white px-4 py-3 rounded-2xl text-[11px] font-black text-gray-400 border-2 border-slate-100 shadow-sm flex items-center justify-center shrink-0">1 JPY =</div>
                <input 
                  type="number" 
                  step="0.0001" 
                  className="flex-1 px-5 py-3 bg-white border-2 border-[#FFD93D] rounded-2xl font-black text-gray-600 focus:ring-4 focus:ring-yellow-100 focus:outline-none shadow-sm text-lg text-center sm:text-left" 
                  value={customRate} 
                  onChange={(e) => setCustomRate(e.target.value)} 
                />
            </div>
        </div>

        <div className="space-y-8">
          <div className="relative">
            <label className="block text-[11px] font-black text-gray-400 uppercase mb-3 tracking-widest">輸入日圓 JPY</label>
            <input type="number" className="w-full px-7 py-6 bg-slate-50 border-4 border-slate-50 rounded-[28px] font-black text-4xl text-gray-800 focus:border-[#4CB9E7] focus:bg-white focus:outline-none transition-all shadow-inner" value={jpyInput} onChange={(e) => setJpyInput(e.target.value)} />
            <span className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-200 font-black text-xl italic">¥</span>
          </div>
          <div className="flex items-center gap-5"><div className="h-[2px] flex-1 bg-slate-100"></div><div className="p-3 bg-white rounded-full border-4 border-slate-50 text-[#FFD93D] shadow-sm"><ArrowRight size={20} /></div><div className="h-[2px] flex-1 bg-slate-100"></div></div>
          <div>
            <label className="block text-[11px] font-black text-gray-400 uppercase mb-3 tracking-widest">預估台幣 TWD</label>
            <div className="w-full px-7 py-8 bg-[#4CB9E7] border-4 border-[#4CB9E7] rounded-[32px] font-black text-5xl text-white shadow-xl shadow-blue-100 flex items-baseline gap-3 italic"><span className="text-xl opacity-80">NT$</span>{twdResult}</div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderWeather = () => (
    <div className="space-y-6 animate-bounceIn pb-32">
      <div className="anime-card p-6">
        <h3 className="text-xl font-black flex items-center gap-3 mb-8 text-gray-800"><div className="bg-[#FF4747] p-2 rounded-2xl text-white shadow-lg"><CloudSun size={20} /></div>沖繩天氣</h3>
        <div className="space-y-4">
          {[ { date: '1/11 (日)', temp: '16°C ~ 20°C', desc: '晴時多雲', tip: '洋蔥式穿法，內搭長袖+外套' }, { date: '1/12 (一)', temp: '15°C ~ 18°C', desc: '多雲', tip: '北部海風大，戴個帽子吧！' }, { date: '1/13 (二)', temp: '17°C ~ 21°C', desc: '晴空萬里', tip: '適合拍照！海邊體感還是涼' }, { date: '1/14 (三)', temp: '16°C ~ 19°C', desc: '局部陣雨', tip: '記得帶支小雨傘喔～' } ].map((item, i) => (
            <div key={i} className="p-5 bg-white border-2 border-slate-50 rounded-[28px] shadow-sm">
              <div className="flex justify-between items-center mb-3"><div><p className="text-sm font-black text-gray-800">{item.date}</p><p className="text-[10px] font-black text-gray-400 uppercase">{item.desc}</p></div><p className="text-lg font-black text-[#FF4747]">{item.temp}</p></div>
              <p className="text-[11px] text-gray-500 font-bold bg-slate-50 p-2 rounded-xl border border-slate-100 italic">💡 {item.tip}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#FFFBEB] px-4 pt-10 pb-10 font-sans">
      <header className="mb-10 flex justify-between items-end px-2">
        <div><h1 className="text-5xl font-black text-gray-800 tracking-tighter leading-none italic">沖繩之旅</h1><div className="flex items-center gap-3 mt-4"><span className="text-[10px] font-black text-white bg-[#FF4747] px-4 py-1 rounded-full shadow-md uppercase">Staff 2026</span><span className="text-[10px] font-black text-[#FFD93D] uppercase bg-gray-800 px-3 py-1 rounded-full">Explore</span></div></div>
      </header>
      <main className="max-w-md mx-auto">
        {activeTab === TabType.OVERVIEW && renderOverview()}
        {activeTab === TabType.ITINERARY && renderItinerary()}
        {activeTab === TabType.FOOD && renderFood()}
        {activeTab === TabType.SUPERMARKET && renderSupermarket()}
        {activeTab === TabType.MAP && renderMap()}
        {activeTab === TabType.GUIDE && renderGuide()}
        {activeTab === TabType.WEATHER && renderWeather()}
      </main>
      <BottomNav activeTab={activeTab} setActiveTab={setActiveTab} />
      <SpotModal 
        isOpen={isSpotModalOpen} 
        onClose={() => { setIsSpotModalOpen(false); setEditingSpot(null); }} 
        onSave={handleSaveSpot} 
        initialSpot={editingSpot} 
        previousSpot={editingSpot ? undefined : activeDayPlan?.spots[activeDayPlan.spots.length - 1]} 
      />
      {activeDayPlan && <DayModal isOpen={isDayModalOpen} onClose={() => setIsDayModalOpen(false)} onSave={handleSaveDay} initialData={activeDayPlan} />}
      <FoodModal isOpen={isFoodModalOpen} onClose={() => { setIsFoodModalOpen(false); setEditingFood(null); }} onSave={handleSaveFood} initialFood={editingFood} />
    </div>
  );
};

export default App;
