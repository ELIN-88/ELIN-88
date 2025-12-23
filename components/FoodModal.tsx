
import React, { useState, useEffect } from 'react';
import { X, Save, Star, Users } from 'lucide-react';
import { FoodItem } from '../types';

interface FoodModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (food: FoodItem) => void;
  initialFood?: FoodItem | null;
}

const FoodModal: React.FC<FoodModalProps> = ({ isOpen, onClose, onSave, initialFood }) => {
  const [formData, setFormData] = useState<Partial<FoodItem>>({
    name: '',
    type: '名店',
    time: '',
    mapUrl: '',
    tags: [],
    groupFriendly: false,
    day: 1,
    description: ''
  });

  const [tagInput, setTagInput] = useState('');

  useEffect(() => {
    if (initialFood) {
      setFormData(initialFood);
    } else {
      setFormData({
        name: '',
        type: '名店',
        time: '',
        mapUrl: '',
        tags: [],
        groupFriendly: false,
        day: 1,
        description: ''
      });
    }
  }, [initialFood, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...formData as FoodItem,
      id: initialFood?.id || Math.random().toString(36).substr(2, 9),
      tags: formData.tags || []
    });
    onClose();
  };

  const addTag = () => {
    if (tagInput.trim() && !formData.tags?.includes(tagInput.trim())) {
      setFormData({ ...formData, tags: [...(formData.tags || []), tagInput.trim()] });
      setTagInput('');
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white w-full max-w-md rounded-[40px] max-h-[90vh] overflow-y-auto shadow-2xl border-4 border-slate-50">
        <div className="sticky top-0 bg-white border-b border-gray-100 p-6 flex justify-between items-center z-10">
          <h2 className="text-xl font-black text-gray-800">{initialFood ? '編輯美食推薦' : '新增美食清單'}</h2>
          <button onClick={onClose} className="p-2 text-gray-400 hover:bg-gray-50 rounded-full transition-colors"><X size={24} /></button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div>
            <label className="block text-xs font-black text-gray-400 uppercase mb-2 tracking-wider">餐點名稱 *</label>
            <input required className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-100 rounded-2xl font-bold focus:border-[#FF4747] focus:outline-none" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="例：傑克牛排" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-black text-gray-400 uppercase mb-2 tracking-wider">類型</label>
              <select className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-100 rounded-2xl font-bold focus:border-[#FF4747] focus:outline-none" value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})}>
                <option value="名店">名店</option>
                <option value="小吃">小吃</option>
                <option value="點心">點心</option>
                <option value="必買">必買</option>
                <option value="咖啡">咖啡</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-black text-gray-400 uppercase mb-2 tracking-wider">行程天數</label>
              <select className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-100 rounded-2xl font-bold focus:border-[#FF4747] focus:outline-none" value={formData.day} onChange={e => setFormData({...formData, day: parseInt(e.target.value)})}>
                {[1, 2, 3, 4].map(d => <option key={d} value={d}>Day {d}</option>)}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-black text-gray-400 uppercase mb-2 tracking-wider">營業時間</label>
            <input className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-100 rounded-2xl font-bold focus:border-[#FF4747] focus:outline-none" value={formData.time} onChange={e => setFormData({...formData, time: e.target.value})} placeholder="11:00-22:30" />
          </div>

          <div>
            <label className="block text-xs font-black text-gray-400 uppercase mb-2 tracking-wider">短評描述</label>
            <textarea className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-100 rounded-2xl font-bold focus:border-[#FF4747] focus:outline-none min-h-[80px]" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} placeholder="推薦原因、必點菜色..." />
          </div>

          <div>
            <label className="block text-xs font-black text-gray-400 uppercase mb-2 tracking-wider">標籤 (按新增)</label>
            <div className="flex gap-2 mb-2">
              <input className="flex-1 px-4 py-3 bg-gray-50 border-2 border-gray-100 rounded-2xl font-bold focus:border-[#FF4747] focus:outline-none" value={tagInput} onChange={e => setTagInput(e.target.value)} onKeyPress={e => e.key === 'Enter' && (e.preventDefault(), addTag())} placeholder="例：排隊名店" />
              <button type="button" onClick={addTag} className="bg-gray-800 text-white px-4 rounded-2xl font-bold text-sm">新增</button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.tags?.map(tag => (
                <span key={tag} className="bg-gray-100 text-gray-600 px-2 py-1 rounded-xl text-[10px] font-bold flex items-center gap-1 shadow-sm">
                  {tag} <X size={10} className="cursor-pointer" onClick={() => setFormData({...formData, tags: formData.tags?.filter(t => t !== tag)})} />
                </span>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-black text-gray-400 uppercase mb-2 tracking-wider">地圖連結</label>
            <input className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-100 rounded-2xl font-bold focus:border-[#FF4747] focus:outline-none" value={formData.mapUrl} onChange={e => setFormData({...formData, mapUrl: e.target.value})} placeholder="Google Map URL" />
          </div>

          <div className="flex items-center gap-3 py-2">
            <input type="checkbox" id="groupFriendlyFood" className="w-6 h-6 accent-emerald-500 rounded-lg" checked={formData.groupFriendly} onChange={e => setFormData({...formData, groupFriendly: e.target.checked})} />
            <label htmlFor="groupFriendlyFood" className="font-bold text-gray-700 flex items-center gap-2">推薦 7 人同行 <Users size={16} className="text-emerald-500" /></label>
          </div>

          <button type="submit" className="w-full py-5 bg-[#FF4747] text-white rounded-[28px] font-black shadow-xl shadow-red-100 flex items-center justify-center gap-2 active:scale-95 transition-all"><Save size={20} /> 儲存推薦</button>
        </form>
      </div>
    </div>
  );
};

export default FoodModal;
