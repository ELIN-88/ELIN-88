
import React, { useState, useEffect } from 'react';
import { X, Save } from 'lucide-react';
import { DayPlan } from '../types';

interface DayModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (dayData: Partial<DayPlan>) => void;
  initialData: DayPlan;
}

const DayModal: React.FC<DayModalProps> = ({ isOpen, onClose, onSave, initialData }) => {
  const [formData, setFormData] = useState<Partial<DayPlan>>(initialData);

  useEffect(() => {
    setFormData(initialData);
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white w-full max-w-md rounded-3xl max-h-[90vh] overflow-y-auto shadow-2xl">
        <div className="sticky top-0 bg-white border-b border-gray-100 p-6 flex justify-between items-center z-10">
          <h2 className="text-xl font-black text-gray-800">編輯 Day {initialData.day} 資訊</h2>
          <button onClick={onClose} className="p-2 text-gray-400 hover:bg-gray-50 rounded-full">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div>
            <label className="block text-xs font-black text-gray-400 uppercase mb-1.5 tracking-wider">行程主題</label>
            <input 
              required
              className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-100 rounded-xl font-bold focus:border-[#F44336] focus:outline-none"
              value={formData.title}
              onChange={e => setFormData({...formData, title: e.target.value})}
            />
          </div>
          <div>
            <label className="block text-xs font-black text-gray-400 uppercase mb-1.5 tracking-wider">日期</label>
            <input 
              required
              className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-100 rounded-xl font-bold focus:border-[#F44336] focus:outline-none"
              value={formData.date}
              onChange={e => setFormData({...formData, date: e.target.value})}
              placeholder="例：2026/1/12 (一)"
            />
          </div>
          <div>
            <label className="block text-xs font-black text-gray-400 uppercase mb-1.5 tracking-wider">穿搭建議</label>
            <textarea 
              className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-100 rounded-xl font-bold focus:border-[#F44336] focus:outline-none"
              value={formData.clothingTips}
              onChange={e => setFormData({...formData, clothingTips: e.target.value})}
              rows={2}
            />
          </div>
          <div>
            <label className="block text-xs font-black text-gray-400 uppercase mb-1.5 tracking-wider">天氣重點</label>
            <textarea 
              className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-100 rounded-xl font-bold focus:border-[#F44336] focus:outline-none"
              value={formData.weatherTips}
              onChange={e => setFormData({...formData, weatherTips: e.target.value})}
              rows={2}
            />
          </div>
          <button 
            type="submit"
            className="w-full bg-[#F44336] text-white py-4 rounded-2xl font-black shadow-lg flex items-center justify-center gap-2"
          >
            <Save size={20} /> 更新資訊
          </button>
        </form>
      </div>
    </div>
  );
};

export default DayModal;
