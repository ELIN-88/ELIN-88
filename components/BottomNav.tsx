
import React from 'react';
import { Plane, Calendar, Utensils, Coins, ShoppingBag, ReceiptText } from 'lucide-react';
import { TabType } from '../types';

interface BottomNavProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
}

const BottomNav: React.FC<BottomNavProps> = ({ activeTab, setActiveTab }) => {
  const tabs = [
    { id: TabType.OVERVIEW, icon: <Plane size={18} />, label: '總覽' },
    { id: TabType.ITINERARY, icon: <Calendar size={18} />, label: '行程' },
    { id: TabType.FOOD, icon: <Utensils size={18} />, label: '美食' },
    { id: TabType.SUPERMARKET, icon: <ShoppingBag size={18} />, label: '超市' },
    { id: TabType.EXPENSES, icon: <ReceiptText size={18} />, label: '支出' },
    { id: TabType.GUIDE, icon: <Coins size={18} />, label: '匯率' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 w-full bg-[#FFFBEB] border-t-4 border-[#2D3436] z-[100] h-[72px] flex items-center shadow-[0_-4px_12px_rgba(0,0,0,0.1)]">
      <div className="flex overflow-x-auto hide-scrollbar px-3 gap-3 w-full snap-x scroll-smooth">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex flex-col items-center justify-center gap-0.5 min-w-[64px] h-[54px] rounded-[16px] transition-all snap-center border-2 ${
              activeTab === tab.id 
              ? 'bg-[#FFD93D] border-[#2D3436] shadow-[2px_2px_0px_#2D3436]' 
              : 'bg-white/50 border-transparent opacity-60'
            }`}
          >
            <div className={`${activeTab === tab.id ? 'scale-110' : 'scale-90'} transition-transform`}>
              {tab.icon}
            </div>
            <span className="text-[9px] font-black tracking-tighter">{tab.label}</span>
          </button>
        ))}
      </div>
    </nav>
  );
};

export default BottomNav;
