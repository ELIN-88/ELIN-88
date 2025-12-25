
import React, { useState, useEffect, useMemo } from 'react';
import { TabType, DayPlan, Spot, FoodItem, WeatherForecast, ExpenseItem, ExpenseCategory, SpotCategory } from './types';
import { INITIAL_ITINERARY, FEATURED_FOOD, DEFAULT_SUPERMARKETS } from './constants';
import BottomNav from './components/BottomNav';
import SpotModal from './components/SpotModal';
import FoodModal from './components/FoodModal';
import ExpenseModal from './components/ExpenseModal';
import { 
  Plane, Hotel, MapPin, CloudSun, Sun, Cloud, Plus, Coins,
  Car, Utensils, Navigation2, Moon, Sparkles, WashingMachine, 
  Equal, MoveLeft, QrCode, Instagram, Trash2, Edit2, Soup, 
  Wallet, Minus, Divide, X, Loader2, SmartphoneCharging, BeerOff, Beer, RefreshCw, CheckCircle2, 
  ReceiptText, Info, AlertCircle, ShoppingBag, Luggage, BatteryCharging, FlameKindling, ShieldAlert,
  Search, ShieldCheck
} from 'lucide-react';

const STORAGE_PREFIX = 'okinawa_staff_v2026_final';
const KEYS = {
  ITINERARY: `${STORAGE_PREFIX}_itinerary`,
  FOOD: `${STORAGE_PREFIX}_food`,
  EXPENSES: `${STORAGE_PREFIX}_expenses`,
  WEATHER: `${STORAGE_PREFIX}_weather`,
  RATE: `${STORAGE_PREFIX}_rate`
};

const evaluateExpression = (expr: string): number => {
  try {
    const allowed = "0123456789+-*/.";
    const sanitized = expr.split('').filter(c => allowed.includes(c)).join('');
    if (!sanitized) return 0;
    return new Function(`return ${sanitized}`)() || 0;
  } catch (e) { return 0; }
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
  
  const getSafeStorage = <T,>(key: string, fallback: T): T => {
    try {
      const saved = localStorage.getItem(key);
      if (!saved) return fallback;
      return JSON.parse(saved);
    } catch (e) { return fallback; }
  };

  const [customRate, setCustomRate] = useState<string>(() => getSafeStorage(KEYS.RATE, '0.215'));
  const [calcDisplay, setCalcDisplay] = useState<string>('0');
  const [isTwdToJpy, setIsTwdToJpy] = useState<boolean>(false);
  const [isWeatherRefreshing, setIsWeatherRefreshing] = useState(false);

  const [itinerary, setItinerary] = useState<DayPlan[]>(() => getSafeStorage(KEYS.ITINERARY, INITIAL_ITINERARY));
  const [foodItems, setFoodItems] = useState<FoodItem[]>(() => getSafeStorage(KEYS.FOOD, FEATURED_FOOD));
  const [expenses, setExpenses] = useState<ExpenseItem[]>(() => getSafeStorage(KEYS.EXPENSES, []));
  const [weatherForecast, setWeatherForecast] = useState<WeatherForecast[]>(() => getSafeStorage(KEYS.WEATHER, DEFAULT_WEATHER));

  useEffect(() => {
    localStorage.setItem(KEYS.ITINERARY, JSON.stringify(itinerary));
    localStorage.setItem(KEYS.FOOD, JSON.stringify(foodItems));
    localStorage.setItem(KEYS.EXPENSES, JSON.stringify(expenses));
    localStorage.setItem(KEYS.WEATHER, JSON.stringify(weatherForecast));
    localStorage.setItem(KEYS.RATE, JSON.stringify(customRate));
  }, [itinerary, foodItems, expenses, weatherForecast, customRate]);

  const activeDayPlan = useMemo(() => itinerary.find(d => d.day === selectedDay), [itinerary, selectedDay]);
  const totalExpenseJpy = useMemo(() => expenses.reduce((s, i) => s + (i.amountJpy || 0), 0), [expenses]);
  const totalExpenseTwd = useMemo(() => expenses.reduce((s, i) => s + (i.amountTwd || 0), 0), [expenses]);

  const [isSpotModalOpen, setIsSpotModalOpen] = useState(false);
  const [editingSpot, setEditingSpot] = useState<Spot | null>(null);
  const [isFoodModalOpen, setIsFoodModalOpen] = useState(false);
  const [editingFood, setEditingFood] = useState<FoodItem | null>(null);
  const [isExpenseModalOpen, setIsExpenseModalOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState<ExpenseItem | null>(null);

  const refreshWeather = () => {
    setIsWeatherRefreshing(true);
    setTimeout(() => {
      setWeatherForecast([...DEFAULT_WEATHER]);
      setIsWeatherRefreshing(false);
    }, 1200);
  };

  return (
    <div className="min-h-screen px-4 pt-10 pb-[100px] max-w-lg mx-auto overflow-x-hidden selection:bg-[#FFD93D]">
      <header className="mb-8 flex flex-col items-center">
        <div className="bg-[#FFD93D] px-8 py-3 rounded-[35px] comic-border rotate-[-1deg] mb-1.5 shadow-[4px_4px_0px_#2D3436]">
          <h1 className="text-3xl font-black text-slate-900 tracking-tighter uppercase text-center text-pop">沖繩旅遊 Go！</h1>
        </div>
        <span className="bg-slate-900 text-white px-4 py-0.5 rounded-full text-[10px] font-black uppercase tracking-widest mt-2 tracking-tight">2026.01.11 - 01.14 Staff Trip</span>
      </header>

      <main className="tab-content relative">
        {activeTab === TabType.OVERVIEW && (
          <div className="space-y-6 pb-4">
            {/* 1. 航班資訊 - 移至第一格 */}
            <section className="comic-border p-5 bg-white rounded-[32px]">
              <div className="flex items-center gap-2 mb-4">
                <div className="bg-[#4CB9E7] p-1.5 rounded-lg text-white shadow-sm"><Plane size={20} /></div>
                <h2 className="text-xl font-black italic tracking-tight">航班與行李情報</h2>
              </div>
              <div className="space-y-4">
                <div className="bg-slate-50 p-4 rounded-2xl border-2 border-slate-900">
                  <div className="flex justify-between items-center mb-2">
                    <span className="bg-slate-900 text-white px-2 py-0.5 rounded text-[10px] font-black">1/11 FD230 (去程)</span>
                    <div className="flex items-center gap-1.5 text-blue-600 font-black text-[10px]"><Luggage size={14}/> 托運 20kg / 7kg 手提</div>
                  </div>
                  <div className="flex justify-between items-center px-2">
                    <div className="text-center"><p className="text-[10px] text-slate-400 font-black">TPE</p><p className="text-2xl font-black">13:30</p></div>
                    <div className="flex-1 px-4"><div className="w-full h-[2px] bg-slate-200"></div></div>
                    <div className="text-center"><p className="text-[10px] text-slate-400 font-black">OKA</p><p className="text-2xl font-black">15:55</p></div>
                  </div>
                </div>
                <div className="bg-slate-50 p-4 rounded-2xl border-2 border-slate-900">
                  <div className="flex justify-between items-center mb-2">
                    <span className="bg-slate-900 text-white px-2 py-0.5 rounded text-[10px] font-black">1/14 BR185 (回程)</span>
                    <div className="flex items-center gap-1.5 text-emerald-600 font-black text-[10px]"><Luggage size={14}/> 托運 23kg / 7kg 手提</div>
                  </div>
                  <div className="flex justify-between items-center px-2">
                    <div className="text-center"><p className="text-[10px] text-slate-400 font-black">OKA</p><p className="text-2xl font-black">20:20</p></div>
                    <div className="flex-1 px-4"><div className="w-full h-[2px] bg-slate-200"></div></div>
                    <div className="text-center"><p className="text-[10px] text-slate-400 font-black">TPE</p><p className="text-2xl font-black">21:10</p></div>
                  </div>
                </div>
                <div className="bg-amber-50 p-4 rounded-2xl border-2 border-amber-500/20">
                  <h3 className="text-xs font-black flex items-center gap-1.5 mb-2 text-amber-700"><ShieldAlert size={16}/> 航空安全提醒</h3>
                  <div className="grid grid-cols-2 gap-2 text-[10px] font-black">
                    <div className="bg-white/60 p-2 rounded-lg border border-amber-200">行動電源 (嚴禁托運)</div>
                    <div className="bg-white/60 p-2 rounded-lg border border-amber-200">打火機 (限一隨身)</div>
                  </div>
                </div>
              </div>
            </section>

            {/* 2. 飯店資訊 */}
            <section className="comic-border p-5 bg-white rounded-[32px]">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h2 className="text-xl font-black flex items-center gap-2 text-[#2D3436] italic"><Hotel size={24} className="text-[#FFD93D]" /> 那霸逸之彩飯店</h2>
                  <p className="text-[11px] font-black text-slate-400 mt-1">牧志站 1 分鐘 / 拉麵啤酒 Happy Hour</p>
                </div>
                <a href="https://www.google.com/maps/search/?api=1&query=Okinawa+Hinode+Hotel" className="bg-[#4CB9E7] text-white p-3 rounded-2xl border-2 border-slate-900 comic-button shadow-[2px_2px_0px_#2D3436]"><Navigation2 size={24}/></a>
              </div>
              <div className="grid grid-cols-2 gap-3 text-[10px] font-black">
                 <div className="bg-rose-50 p-2.5 rounded-xl border-2 border-slate-900 flex items-center gap-2 font-black"><Utensils size={14}/> 早餐 06:30+</div>
                 <div className="bg-blue-50 p-2.5 rounded-xl border-2 border-slate-900 flex items-center gap-2 font-black"><Soup size={14}/> 宵夜拉麵 20:30+</div>
                 <div className="bg-amber-50 p-2.5 rounded-xl border-2 border-slate-900 flex items-center gap-2 font-black"><Beer size={14}/> 啤酒暢飲 10-22h</div>
                 <div className="bg-slate-50 p-2.5 rounded-xl border-2 border-slate-900 flex items-center gap-2 font-black"><WashingMachine size={14}/> 24h 洗衣</div>
              </div>
            </section>

            {/* 3. 自駕守則 - 移至最後一格 */}
            <section className="comic-border p-5 bg-[#FF4747] text-white rounded-[32px]">
              <h3 className="text-lg font-black flex items-center gap-2 mb-4 italic uppercase tracking-wider"><Car size={24} /> 沖繩自駕安全守則 ⚠️</h3>
              <div className="grid grid-cols-3 gap-3 text-center">
                {[
                  { icon: <MoveLeft size={24}/>, label: '靠左行駛' },
                  { icon: <span className="text-xl font-black">止</span>, label: '必停三秒' },
                  { icon: <SmartphoneCharging size={24} className="text-yellow-300"/>, label: '禁止手機' },
                  { icon: <BeerOff size={24} className="text-yellow-300"/>, label: '嚴禁酒駕' },
                  { icon: <Navigation2 size={24}/>, label: '地圖優先' },
                  { icon: <span className="text-xl font-black">60</span>, label: '遵守速限' }
                ].map((rule, i) => (
                  <div key={i} className="bg-white/10 p-2 rounded-xl flex flex-col items-center border border-white/20">
                    <div className="mb-1.5">{rule.icon}</div>
                    <span className="text-[10px] font-black uppercase">{rule.label}</span>
                  </div>
                ))}
              </div>
            </section>
          </div>
        )}

        {activeTab === TabType.ITINERARY && (
          <div className="space-y-6 pb-12">
            <div className="sticky top-0 z-[90] bg-[#FFFBEB]/90 backdrop-blur-md py-4 flex gap-3 overflow-x-auto hide-scrollbar -mx-4 px-4 border-b-2 border-slate-900/10">
              {[1, 2, 3, 4].map(d => (
                <button key={d} onClick={() => setSelectedDay(d)} className={`px-8 py-2 rounded-[24px] text-lg font-black border-2 border-slate-900 transition-all shrink-0 ${selectedDay === d ? 'bg-[#FF4747] text-white shadow-[3px_3px_0px_#2D3436]' : 'bg-white text-slate-300'}`}>Day {d}</button>
              ))}
            </div>
            {activeDayPlan && (
              <div className="animate-fadeIn">
                <div className="flex justify-between items-end mb-8 px-2">
                  <div>
                    <h2 className="text-2xl font-black italic text-slate-900">{activeDayPlan.title}</h2>
                    <p className="text-[11px] font-black text-[#FF4747] mt-1">{activeDayPlan.date} | {activeDayPlan.clothingTips}</p>
                  </div>
                  <button onClick={() => { setEditingSpot(null); setIsSpotModalOpen(true); }} className="bg-[#4CB9E7] text-white px-5 py-2 rounded-full border-2 border-slate-900 text-xs font-black shadow-[3px_3px_0px_#2D3436]">+ 景點</button>
                </div>
                <div className="relative border-l-[6px] border-slate-900 ml-6 pl-10 space-y-12 pb-10">
                  {activeDayPlan.spots.map((spot, idx) => (
                    <div key={spot.id} className="relative">
                      <div className="absolute -left-[68px] top-4 w-12 h-12 bg-[#FFD93D] text-slate-900 rounded-full flex items-center justify-center text-xl font-black border-[3px] border-slate-900 z-10 shadow-[2px_2px_0px_#2D3436]">{idx + 1}</div>
                      <div className="comic-border bg-white p-5 rounded-[32px]">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <span className="bg-[#FF4747] text-white px-3 py-0.5 rounded-lg text-[10px] font-black italic">{spot.time}</span>
                            <h4 className="text-lg font-black mt-1 text-slate-900 leading-tight">{spot.name}</h4>
                          </div>
                          <div className="flex gap-2">
                            <button onClick={() => { setEditingSpot(spot); setIsSpotModalOpen(true); }} className="text-slate-300 hover:text-slate-900"><Edit2 size={18} /></button>
                          </div>
                        </div>

                        {/* 狀態標籤 */}
                        <div className="flex flex-wrap gap-1.5 my-2">
                          {spot.isReserved && <span className="flex items-center gap-1 bg-blue-500 text-white px-2 py-0.5 rounded-full border border-slate-900 text-[8px] font-black italic tracking-tighter"><CheckCircle2 size={10}/>已預約</span>}
                          {spot.showQRCode && <span className="flex items-center gap-1 bg-purple-500 text-white px-2 py-0.5 rounded-full border border-slate-900 text-[8px] font-black italic tracking-tighter"><QrCode size={10}/>QR</span>}
                          {spot.isPaid && <span className="flex items-center gap-1 bg-emerald-500 text-white px-2 py-0.5 rounded-full border border-slate-900 text-[8px] font-black italic tracking-tighter"><ShieldCheck size={10}/>已付</span>}
                        </div>

                        {/* 修復備註顯示 */}
                        <div className="mt-4 p-3 bg-slate-50 border-2 border-slate-200 rounded-2xl relative shadow-inner">
                           <div className="absolute -top-2 left-4 w-3 h-3 bg-slate-50 border-l-2 border-t-2 border-slate-200 rotate-45"></div>
                           <p className="text-[11px] font-bold text-slate-600 italic whitespace-pre-wrap leading-relaxed">{spot.description || "暫無備註"}</p>
                        </div>
                        
                        {spot.mapUrl && <a href={spot.mapUrl} target="_blank" className="mt-4 w-full bg-[#4CB9E7] text-white py-3 rounded-2xl border-2 border-slate-900 flex items-center justify-center gap-2 text-sm font-black italic shadow-[2px_2px_0px_#2D3436] active:translate-y-0.5 transition-all"><Navigation2 size={20} /> 開啟導航</a>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === TabType.FOOD && (
          <div className="space-y-6 pb-12">
            <h2 className="text-2xl font-black italic text-center text-[#FF4747] text-pop">美食區域 IG 搜尋 🤤</h2>
            <div className="grid grid-cols-2 gap-4">
              {foodItems.filter(f => f.type === '區域搜尋').map(f => (
                <a key={f.id} href={`https://www.instagram.com/explore/tags/${encodeURIComponent(f.tags[0] + '美食')}/`} target="_blank" className="comic-border bg-white p-4 rounded-[28px] flex flex-col items-center gap-2 text-center shadow-sm">
                  <Instagram size={24} className="text-[#E4405F]"/>
                  <p className="text-[10px] font-black text-slate-400">Day {f.day} | {f.name}</p>
                  <p className="text-sm font-black italic">#{f.tags[0]}美食</p>
                </a>
              ))}
            </div>
          </div>
        )}

        {activeTab === TabType.SUPERMARKET && (
          <div className="space-y-6 pb-12">
            <h2 className="text-2xl font-black italic text-center text-[#4CB9E7] text-pop">飯店補給清單 🛒</h2>
            <p className="text-center text-[10px] font-black text-slate-400 -mt-4">專為那霸逸之彩飯店規劃</p>
            <div className="grid gap-5">
              {DEFAULT_SUPERMARKETS.map(shop => (
                <div key={shop.id} className="comic-border p-5 bg-white rounded-[32px]">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="text-lg font-black italic leading-tight">{shop.name}</h4>
                    <span className="bg-[#4CB9E7] text-white px-3 py-0.5 rounded-full text-[9px] font-black uppercase">Day {shop.day}</span>
                  </div>
                  <div className="flex flex-wrap gap-2 my-3 text-[10px] font-black text-slate-500">
                    <span className="flex items-center gap-1.5 bg-slate-100 px-2 py-1 rounded-lg"><RefreshCw size={12}/> {shop.openingHours}</span>
                    <span className="flex items-center gap-1.5 bg-slate-100 px-2 py-1 rounded-lg"><Wallet size={12}/> {shop.paymentMethods.join('/')}</span>
                  </div>
                  <p className="text-[11px] text-slate-400 mb-4 font-black">{shop.description}</p>
                  <a href={shop.mapUrl} className="w-full bg-[#2D3436] text-white py-3 rounded-xl flex items-center justify-center gap-2 font-black shadow-[3px_3px_0px_#4CB9E7] active:translate-y-0.5 transition-all"><Navigation2 size={18}/> 開啟導航</a>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === TabType.EXPENSES && (
          <div className="space-y-6 pb-12">
             <div className="comic-border p-6 bg-[#2D3436] text-white rounded-[32px] shadow-[6px_6px_0px_#FFD93D]">
                <p className="text-[10px] font-black text-[#FFD93D] uppercase tracking-widest mb-1 italic">支出預算控管</p>
                <h3 className="text-4xl font-black italic tracking-tighter">¥ {totalExpenseJpy.toLocaleString()}</h3>
                <p className="text-sm font-black text-[#4CB9E7] italic mt-1">≈ $ {totalExpenseTwd.toLocaleString()} TWD</p>
             </div>
             <div className="flex justify-between items-center px-2">
                <h3 className="text-xl font-black italic">記帳明細</h3>
                <button onClick={() => { setEditingExpense(null); setIsExpenseModalOpen(true); }} className="bg-[#FF4747] text-white px-5 py-2 rounded-full border-2 border-slate-900 text-sm font-black shadow-[3px_3px_0px_#2D3436]">+ 記一筆</button>
             </div>
             <div className="space-y-4">
               {expenses.length === 0 ? <div className="text-center py-10 text-slate-300 font-black italic">尚無支出紀錄</div> : expenses.map(item => (
                 <div key={item.id} className="comic-border p-4 bg-white rounded-[24px] flex justify-between items-center group active:scale-[0.98] transition-transform" onClick={() => { setEditingExpense(item); setIsExpenseModalOpen(true); }}>
                   <div className="flex items-center gap-3">
                     <div className="bg-slate-100 p-2 rounded-xl text-slate-400"><ReceiptText size={18}/></div>
                     <div><span className="text-[9px] font-black text-slate-300">[{item.category}]</span><h5 className="text-base font-black italic text-slate-900 leading-tight">{item.name}</h5></div>
                   </div>
                   <div className="text-right">
                     <p className="text-lg font-black italic text-slate-900">¥ {item.amountJpy}</p>
                     <p className="text-[9px] font-black text-slate-400">$ {item.amountTwd} TWD</p>
                   </div>
                 </div>
               ))}
             </div>
          </div>
        )}

        {activeTab === TabType.GUIDE && (
          <div className="flex flex-col animate-fadeIn space-y-6 pb-12">
            <h2 className="text-2xl font-black italic text-center text-[#FFD93D] text-pop">台日幣換算器 💴</h2>
            <div className="comic-border p-5 bg-white rounded-[32px] border-slate-900">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-[10px] font-black text-slate-400 uppercase italic">匯率 1 JPY = {customRate} TWD</h3>
                <input type="number" step="0.001" className="w-24 bg-slate-50 text-base font-black text-right border-2 border-slate-900 rounded-xl px-2 py-1 focus:outline-none" value={customRate} onChange={e => setCustomRate(e.target.value)} />
              </div>
              <div className="flex flex-col gap-4">
                <button onClick={() => setIsTwdToJpy(false)} className={`w-full p-6 rounded-[24px] border-2 flex justify-between items-center transition-all ${!isTwdToJpy ? 'bg-[#2D3436] text-white border-slate-900 shadow-[3px_3px_0px_#FFD93D]' : 'bg-slate-50 text-gray-300 border-transparent'}`}>
                  <p className="text-[10px] font-black opacity-40 uppercase italic tracking-widest">JPY</p>
                  <p className="text-3xl font-black italic">¥ {!isTwdToJpy ? calcDisplay : (evaluateExpression(calcDisplay) / parseFloat(customRate)).toFixed(0)}</p>
                </button>
                <button onClick={() => setIsTwdToJpy(true)} className={`w-full p-6 rounded-[24px] border-2 flex justify-between items-center transition-all ${isTwdToJpy ? 'bg-[#FF4747] text-white border-slate-900 shadow-[3px_3px_0px_#2D3436]' : 'bg-slate-50 text-gray-300 border-transparent'}`}>
                  <p className="text-[10px] font-black opacity-40 uppercase italic tracking-widest">TWD</p>
                  <p className="text-3xl font-black italic">$ {isTwdToJpy ? calcDisplay : (evaluateExpression(calcDisplay) * parseFloat(customRate)).toFixed(0)}</p>
                </button>
              </div>
            </div>
            <div className="grid grid-cols-4 gap-3">
              {['7','8','9','/','4','5','6','*','1','2','3','-','0','.','C','+'].map(btn => (
                <button key={btn} onClick={() => btn === 'C' ? setCalcDisplay('0') : setCalcDisplay(prev => prev === '0' ? btn : prev + btn)} className={`comic-button h-14 rounded-xl font-black text-xl border-2 border-slate-900 shadow-[2px_2px_0px_#2D3436] flex items-center justify-center transition-all ${btn === 'C' ? 'bg-rose-50 text-rose-500' : 'bg-white text-slate-900'}`}>{btn}</button>
              ))}
              <button onClick={() => setCalcDisplay(evaluateExpression(calcDisplay).toString())} className="comic-button col-span-4 h-14 bg-[#FF4747] text-white rounded-xl font-black border-2 border-slate-900 shadow-[3px_3px_0px_#2D3436] flex items-center justify-center italic tracking-widest uppercase text-sm">計算結果 <Equal size={20} className="ml-2" /></button>
            </div>
          </div>
        )}

        {activeTab === TabType.WEATHER && (
          <div className="space-y-6 pb-12">
            <div className="flex justify-between items-center px-2">
              <h2 className="text-2xl font-black italic text-indigo-600 text-pop">沖繩天氣預報 🌤️</h2>
              {/* 天氣更新鍵 */}
              <button onClick={refreshWeather} disabled={isWeatherRefreshing} className={`p-2.5 bg-white rounded-full border-2 border-slate-900 shadow-[3px_3px_0px_#2D3436] active:translate-y-0.5 transition-all ${isWeatherRefreshing ? 'animate-spin opacity-50' : ''}`}>
                <RefreshCw size={22} className="text-indigo-600" />
              </button>
            </div>
            <div className="space-y-4">
              {weatherForecast.map(w => (
                <div key={w.date} className="comic-border p-5 bg-white rounded-[32px]">
                  <div className="flex justify-between items-center mb-4 pb-2 border-b-2 border-slate-50">
                    <span className="text-lg font-black italic text-[#FF4747]">{w.date}</span>
                    <span className="bg-indigo-50 text-indigo-600 px-3 py-1 rounded-full text-[10px] font-black tracking-tighter">{w.clothingTip}</span>
                  </div>
                  <div className="grid grid-cols-3 gap-3 text-center">
                    {['上午', '中午', '晚上'].map((label, i) => {
                      const data = i === 0 ? w.morning : i === 1 ? w.noon : w.night;
                      return (
                        <div key={label} className="flex flex-col items-center gap-1.5 p-3 bg-slate-50 rounded-2xl border-2 border-slate-900">
                          <span className="text-[9px] font-black text-slate-400 uppercase">{label}</span>
                          {data.icon === 'sun' ? <Sun size={20} className="text-amber-400" /> : data.icon === 'cloud' ? <Cloud size={20} className="text-slate-400" /> : <Moon size={20} className="text-indigo-400" />}
                          <span className="text-base font-black italic tracking-tighter">{data.temp}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      <BottomNav activeTab={activeTab} setActiveTab={setActiveTab} />
      <SpotModal isOpen={isSpotModalOpen} onClose={() => setIsSpotModalOpen(false)} onSave={s => setItinerary(itinerary.map(d => d.day === selectedDay ? {...d, spots: editingSpot ? d.spots.map(x => x.id === s.id ? s : x) : [...d.spots, s].sort((a,b)=>a.time.localeCompare(b.time))} : d))} initialSpot={editingSpot} />
      <FoodModal isOpen={isFoodModalOpen} onClose={() => setIsFoodModalOpen(false)} onSave={f => setFoodItems(prev => editingFood ? prev.map(x => x.id === f.id ? f : x) : [...prev, f])} initialFood={editingFood} />
      <ExpenseModal isOpen={isExpenseModalOpen} onClose={() => setIsExpenseModalOpen(false)} onSave={e => setExpenses(prev => editingExpense ? prev.map(x => x.id === e.id ? e : x) : [...prev, e])} initialExpense={editingExpense} exchangeRate={parseFloat(customRate)} />
    </div>
  );
};

export default App;
