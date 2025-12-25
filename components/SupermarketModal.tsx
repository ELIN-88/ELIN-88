
import React, { useState, useEffect } from 'react';
import { X, Save, Clock, CreditCard, ShoppingBag, Calendar, Navigation } from 'lucide-react';
import { SupermarketItem } from '../types';

interface SupermarketModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (item: SupermarketItem) => void;
  initialItem?: SupermarketItem | null;
  defaultDay?: number;
}

const SupermarketModal: React.FC<SupermarketModalProps> = ({ isOpen, onClose, onSave, initialItem, defaultDay }) => {
  const [formData, setFormData] = useState<Partial<SupermarketItem>>({
    name: '',
    type: '超市',
    openingHours: '',
    paymentMethods: [],
    description: '',
    mapUrl: '',
    day: defaultDay || 1,
    travelTime: '',
    travelDistance: ''
  });

  const allPaymentMethods = ['現金', '信用卡', 'PayPay', '交通系IC'];

  useEffect(() => {
    if (initialItem) {
      setFormData(initialItem);
    } else {
      setFormData({ 
        name: '', 
        type: '超市', 
        openingHours: '', 
        paymentMethods: [], 
        description: '', 
        mapUrl: '', 
        day: defaultDay || 1,
        travelTime: '',
        travelDistance: ''
      });
    }
  }, [initialItem, isOpen, defaultDay]);

  if (!isOpen) return null;

  const togglePayment = (method: string) => {
    const current = formData.paymentMethods || [];
    setFormData({
      ...formData,
      paymentMethods: current.includes(method) ? current.filter(m => m !== method) : [...current, method]
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...formData as SupermarketItem,
      id: initialItem?.id || Math.random().toString(36).substr(2, 9)
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[130] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <div className="bg-white w-full max-w-md rounded-[40px] max-h-[90vh] overflow-y-auto shadow-2xl border-4 border-slate-50">
        <div className="sticky top-0 bg-white border-b border-gray-100 p-6 flex justify-between items-center z-10">
          <h2 className="text-xl font-black text-gray-800 italic">編輯超市資訊 🛍️</h2>
          <button onClick={onClose} className="p-2 text-gray-400 hover:bg-gray-50 rounded-full"><X size={24} /></button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-black text-gray-400 uppercase mb-2">店名 *</label>
              <input required className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-100 rounded-2xl font-bold focus:border-[#4CB9E7] focus:outline-none" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="例：MaxValu" />
            </div>
            <div>
              <label className="block text-[10px] font-black text-gray-400 uppercase mb-2">對應天數</label>
              <select className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-100 rounded-2xl font-bold focus:border-[#4CB9E7] focus:outline-none" value={formData.day} onChange={e => setFormData({...formData, day: parseInt(e.target.value)})}>
                {[1, 2, 3, 4].map(d => <option key={d} value={d}>Day {d}</option>)}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-black text-gray-400 uppercase mb-2">支付方式 (點擊選擇/取消)</label>
            <div className="flex flex-wrap gap-2">
              {allPaymentMethods.map(m => (
                <button key={m} type="button" onClick={() => togglePayment(m)} className={`px-4 py-2 rounded-xl border-2 font-black text-[11px] transition-all ${formData.paymentMethods?.includes(m) ? 'bg-[#FFD93D] border-slate-900 text-slate-900 shadow-[2px_2px_0px_#2D3436] scale-105' : 'bg-gray-50 border-gray-100 text-gray-300'}`}>{m}</button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-black text-gray-400 uppercase mb-2">營業時間</label>
            <input className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-100 rounded-2xl font-bold focus:border-[#4CB9E7] focus:outline-none" value={formData.openingHours} onChange={e => setFormData({...formData, openingHours: e.target.value})} placeholder="例：09:00 - 24:00" />
          </div>

          <div>
            <label className="block text-[10px] font-black text-gray-400 uppercase mb-2">地圖連結</label>
            <input className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-100 rounded-2xl font-bold focus:border-[#4CB9E7] focus:outline-none" value={formData.mapUrl} onChange={e => setFormData({...formData, mapUrl: e.target.value})} placeholder="貼上 Google Map 連結" />
          </div>

          <button type="submit" className="w-full py-5 bg-[#4CB9E7] text-white rounded-[28px] font-black shadow-xl flex items-center justify-center gap-2 active:scale-95 transition-all italic border-2 border-slate-900"><Save size={20} /> 存入導航清單</button>
        </form>
      </div>
    </div>
  );
};

export default SupermarketModal;
