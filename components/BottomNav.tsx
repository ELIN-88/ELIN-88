
import React from 'react';
import { Plane, Calendar, Map as MapIcon, Coins, CloudSun, Utensils, ShoppingBag } from 'lucide-react';
import { TabType } from '../types';

interface BottomNavProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
}

const BottomNav: React.FC<BottomNavProps> = ({ activeTab, setActiveTab }) => {
  const tabs = [
    { id: TabType.OVERVIEW, icon: <Plane size={20} />, label: '總覽' },
    { id: TabType.ITINERARY, icon: <Calendar size={20} />, label: '行程' },
    { id: TabType.FOOD, icon: <Utensils size={20} />, label: '美食' },
    { id: TabType.SUPERMARKET, icon: <ShoppingBag size={20} />, label: '超市' },
    { id: TabType.MAP, icon: <MapIcon size={20} />, label: '地圖' },
    { id: TabType.GUIDE, icon: <Coins size={20} />, label: '匯率' },
    { id: TabType.WEATHER, icon: <CloudSun size={20} />, label: '天氣' },
  ];

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[92%] max-w-md bg-white/95 backdrop-blur-xl rounded-[40px] shadow-2xl shadow-yellow-200/50 border-4 border-slate-50 z-50 overflow-hidden">
      <div className="flex items-center overflow-x-auto py-4 px-4 custom-scrollbar scroll-smooth snap-x">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex flex-col items-center gap-1.5 min-w-[65px] flex-shrink-0 snap-center transition-all duration-300 ${
              activeTab === tab.id ? 'text-[#FF4747] scale-105' : 'text-slate-300'
            }`}
          >
            <div className={`p-2 rounded-[18px] transition-colors ${activeTab === tab.id ? 'bg-[#FF4747]/10' : 'bg-transparent'}`}>
              {tab.icon}
            </div>
            <span className={`text-[10px] font-black tracking-tighter ${activeTab === tab.id ? 'opacity-100' : 'opacity-60'}`}>{tab.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default BottomNav;
