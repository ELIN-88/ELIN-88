
import React from 'react';
import { Plane, Calendar, CloudSun, Utensils, Coins, ShoppingBag, ReceiptText } from 'lucide-react';
import { TabType } from '../types';

interface BottomNavProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
}

const BottomNav: React.FC<BottomNavProps> = ({ activeTab, setActiveTab }) => {
  const tabs = [
    { id: TabType.OVERVIEW, icon: <Plane size={24} />, label: '總覽' },
    { id: TabType.ITINERARY, icon: <Calendar size={24} />, label: '行程' },
    { id: TabType.FOOD, icon: <Utensils size={24} />, label: '美食' },
    { id: TabType.SUPERMARKET, icon: <ShoppingBag size={24} />, label: '超市' },
    { id: TabType.GUIDE, icon: <Coins size={24} />, label: '匯率' },
    { id: TabType.EXPENSES, icon: <ReceiptText size={24} />, label: '支出' },
    { id: TabType.WEATHER, icon: <CloudSun size={24} />, label: '天氣' },
  ];

  return (
    <div className="fixed bottom-0 left-0 w-full bg-white border-t-[5px] border-[#2D3436] z-[100] h-[90px] flex items-center shadow-[0_-5px_12px_rgba(0,0,0,0.1)]">
      <div className="flex overflow-x-auto overflow-y-visible hide-scrollbar px-4 gap-3 w-full snap-x scroll-smooth pt-3">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex flex-col items-center justify-center gap-0.5 min-w-[70px] h-[70px] rounded-[20px] transition-all snap-center border-[2px] ${
              activeTab === tab.id 
              ? 'bg-[#FFD93D] border-[#2D3436] shadow-[2.5px_2.5px_0px_#2D3436] -translate-y-1' 
              : 'bg-transparent border-transparent opacity-40'
            }`}
          >
            <div className="text-[#2D3436]">
              {tab.icon}
            </div>
            <span className="text-[9px] font-black tracking-tighter">{tab.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default BottomNav;