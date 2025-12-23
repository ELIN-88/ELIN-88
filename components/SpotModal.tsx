
import React, { useState, useEffect } from 'react';
// Added Car to imports from lucide-react
import { X, Save, Clock, Map as MapIcon, Sparkles, Loader2, Car } from 'lucide-react';
import { Spot, SpotCategory } from '../types';
import { GoogleGenAI, Type } from "@google/genai";

interface SpotModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (spot: Spot) => void;
  initialSpot?: Spot | null;
  previousSpot?: Spot;
}

const SpotModal: React.FC<SpotModalProps> = ({ isOpen, onClose, onSave, initialSpot, previousSpot }) => {
  const [formData, setFormData] = useState<Partial<Spot>>({
    time: '',
    name: '',
    description: '',
    category: SpotCategory.SIGHTS,
    tags: [],
    mapUrl: '',
    address: '',
    parkingInfo: '',
    gasInfo: '',
    photoTips: '',
    groupFriendly: false,
    travelTime: '',
    travelDistance: ''
  });

  const [tagInput, setTagInput] = useState('');
  const [isCalculating, setIsCalculating] = useState(false);

  useEffect(() => {
    if (initialSpot) {
      setFormData(initialSpot);
    } else {
      setFormData({
        time: '',
        name: '',
        description: '',
        category: SpotCategory.SIGHTS,
        tags: [],
        mapUrl: '',
        address: '',
        parkingInfo: '',
        gasInfo: '',
        photoTips: '',
        groupFriendly: false,
        travelTime: '',
        travelDistance: ''
      });
    }
  }, [initialSpot, isOpen]);

  const estimateTraffic = async (currentAddress: string) => {
    if (!previousSpot || !currentAddress || currentAddress.length < 5) return;
    
    setIsCalculating(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const prompt = `你是一位專業的沖繩導遊。請計算從「${previousSpot.address}」開車到「${currentAddress}」的預估交通資訊。
      請務必返回純 JSON 格式，包含兩個欄位："time" (例如 "45 min") 和 "distance" (例如 "12.5 km")。
      請考慮沖繩當地的地理與一般交通狀況。`;

      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              time: { type: Type.STRING, description: "Driving time like '15 min'" },
              distance: { type: Type.STRING, description: "Distance like '5.2 km'" }
            },
            required: ["time", "distance"]
          }
        }
      });

      const result = JSON.parse(response.text || '{}');
      if (result.time && result.distance) {
        setFormData(prev => ({
          ...prev,
          travelTime: result.time,
          travelDistance: result.distance
        }));
      }
    } catch (error) {
      console.error("AI 交通估算失敗:", error);
    } finally {
      setIsCalculating(false);
    }
  };

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...formData as Spot,
      id: initialSpot?.id || Math.random().toString(36).substr(2, 9),
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

  const removeTag = (tag: string) => {
    setFormData({ ...formData, tags: formData.tags?.filter(t => t !== tag) });
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white w-full max-w-md rounded-3xl max-h-[90vh] overflow-y-auto shadow-2xl">
        <div className="sticky top-0 bg-white border-b border-gray-100 p-6 flex justify-between items-center z-10">
          <h2 className="text-xl font-black text-gray-800">{initialSpot ? '編輯景點' : '新增景點'}</h2>
          <button onClick={onClose} className="p-2 text-gray-400 hover:bg-gray-50 rounded-full transition-colors">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div>
            <label className="block text-xs font-black text-gray-400 uppercase mb-1.5 tracking-wider">景點名稱 *</label>
            <input 
              required
              className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-100 rounded-xl font-bold focus:border-[#F44336] focus:outline-none"
              value={formData.name}
              onChange={e => setFormData({...formData, name: e.target.value})}
              placeholder="例：古宇利島"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-black text-gray-400 uppercase mb-1.5 tracking-wider">時間 *</label>
              <input 
                required
                type="time"
                className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-100 rounded-xl font-bold focus:border-[#F44336] focus:outline-none"
                value={formData.time}
                onChange={e => setFormData({...formData, time: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-xs font-black text-gray-400 uppercase mb-1.5 tracking-wider">類別</label>
              <select 
                className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-100 rounded-xl font-bold focus:border-[#F44336] focus:outline-none"
                value={formData.category}
                onChange={e => setFormData({...formData, category: e.target.value as SpotCategory})}
              >
                {Object.values(SpotCategory).map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-black text-gray-400 uppercase mb-1.5 tracking-wider">地址 *</label>
            <div className="relative">
              <input 
                required
                className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-100 rounded-xl font-bold focus:border-[#F44336] focus:outline-none text-xs pr-10"
                value={formData.address}
                onChange={e => setFormData({...formData, address: e.target.value})}
                onBlur={e => estimateTraffic(e.target.value)}
                placeholder="輸入詳細地址後自動估算交通"
              />
              {isCalculating ? (
                <Loader2 size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#F44336] animate-spin" />
              ) : (
                <Sparkles size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-amber-400 opacity-50" />
              )}
            </div>
          </div>

          <div>
            <label className="block text-xs font-black text-gray-400 uppercase mb-1.5 tracking-wider">描述</label>
            <textarea 
              className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-100 rounded-xl font-bold focus:border-[#F44336] focus:outline-none min-h-[80px]"
              value={formData.description}
              onChange={e => setFormData({...formData, description: e.target.value})}
              placeholder="景點簡介..."
            />
          </div>

          <div className={`bg-gray-50 p-4 rounded-2xl border-2 transition-all duration-500 ${isCalculating ? 'border-amber-200 animate-pulse bg-amber-50' : 'border-gray-100'} space-y-4`}>
            <div className="flex justify-between items-center">
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-1">
                {isCalculating ? <Sparkles size={12} className="text-amber-500" /> : <Car size={12} />}
                交通預估 {previousSpot && `(從 ${previousSpot.name})`}
              </p>
              {isCalculating && <span className="text-[9px] font-black text-amber-600 animate-pulse italic">AI 正在計算路徑...</span>}
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="relative">
                <Clock size={14} className={`absolute left-3 top-1/2 -translate-y-1/2 ${isCalculating ? 'text-amber-400' : 'text-gray-400'}`} />
                <input 
                  className={`w-full pl-9 pr-4 py-2 bg-white border border-gray-200 rounded-lg text-xs font-bold focus:border-[#F44336] focus:outline-none transition-all ${isCalculating ? 'text-amber-600' : 'text-gray-700'}`}
                  value={formData.travelTime}
                  onChange={e => setFormData({...formData, travelTime: e.target.value})}
                  placeholder={isCalculating ? "計算中..." : "時間 (如 15 min)"}
                />
              </div>
              <div className="relative">
                <MapIcon size={14} className={`absolute left-3 top-1/2 -translate-y-1/2 ${isCalculating ? 'text-amber-400' : 'text-gray-400'}`} />
                <input 
                  className={`w-full pl-9 pr-4 py-2 bg-white border border-gray-200 rounded-lg text-xs font-bold focus:border-[#F44336] focus:outline-none transition-all ${isCalculating ? 'text-amber-600' : 'text-gray-700'}`}
                  value={formData.travelDistance}
                  onChange={e => setFormData({...formData, travelDistance: e.target.value})}
                  placeholder={isCalculating ? "計算中..." : "距離 (如 8.5 km)"}
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-black text-gray-400 uppercase mb-1.5 tracking-wider">彩色標籤 (必吃/必買...)</label>
            <div className="flex gap-2 mb-2">
              <input 
                className="flex-1 px-4 py-3 bg-gray-50 border-2 border-gray-100 rounded-xl font-bold focus:border-[#F44336] focus:outline-none"
                value={tagInput}
                onChange={e => setTagInput(e.target.value)}
                onKeyPress={e => e.key === 'Enter' && (e.preventDefault(), addTag())}
                placeholder="輸入後按新增"
              />
              <button type="button" onClick={addTag} className="bg-gray-800 text-white px-4 rounded-xl font-bold text-sm">新增</button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.tags?.map(tag => (
                <span key={tag} className="bg-gray-100 text-gray-600 px-2 py-1 rounded-md text-[11px] font-bold flex items-center gap-1">
                  {tag} <X size={12} className="cursor-pointer" onClick={() => removeTag(tag)} />
                </span>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-black text-gray-400 uppercase mb-1.5 tracking-wider">停車資訊</label>
              <input 
                className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-100 rounded-xl font-bold focus:border-[#F44336] focus:outline-none text-xs"
                value={formData.parkingInfo}
                onChange={e => setFormData({...formData, parkingInfo: e.target.value})}
                placeholder="例：免費停車"
              />
            </div>
            <div>
              <label className="block text-xs font-black text-gray-400 uppercase mb-1.5 tracking-wider">拍照技巧</label>
              <input 
                className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-100 rounded-xl font-bold focus:border-[#F44336] focus:outline-none text-xs"
                value={formData.photoTips}
                onChange={e => setFormData({...formData, photoTips: e.target.value})}
                placeholder="例：入口處必拍"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-black text-gray-400 uppercase mb-1.5 tracking-wider">Google Map URL</label>
            <input 
              className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-100 rounded-xl font-bold focus:border-[#F44336] focus:outline-none"
              value={formData.mapUrl}
              onChange={e => setFormData({...formData, mapUrl: e.target.value})}
              placeholder="貼上地圖連結"
            />
          </div>

          <div className="flex items-center gap-3 py-2">
            <input 
              type="checkbox"
              id="groupFriendly"
              className="w-5 h-5 accent-[#F44336] rounded"
              checked={formData.groupFriendly}
              onChange={e => setFormData({...formData, groupFriendly: e.target.checked})}
            />
            <label htmlFor="groupFriendly" className="font-bold text-gray-700 text-sm">推薦 7 人同行</label>
          </div>

          <button 
            type="submit"
            disabled={isCalculating}
            className={`w-full py-4 rounded-2xl font-black shadow-lg flex items-center justify-center gap-2 mt-4 active:scale-[0.98] transition-all ${isCalculating ? 'bg-gray-300 cursor-not-allowed' : 'bg-[#F44336] text-white shadow-red-200'}`}
          >
            <Save size={20} /> {isCalculating ? '請稍候...' : '儲存變更'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default SpotModal;
