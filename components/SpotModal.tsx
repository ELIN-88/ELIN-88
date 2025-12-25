
import React, { useState, useEffect } from 'react';
import { X, Save, Clock, Loader2, Car, CheckCircle2, QrCode, Wallet } from 'lucide-react';
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
    travelDistance: '',
    isReserved: false,
    showQRCode: false,
    isPaid: false,
    isPendingPayment: false
  });

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
        travelDistance: '',
        isReserved: false,
        showQRCode: false,
        isPaid: false,
        isPendingPayment: false
      });
    }
  }, [initialSpot, isOpen]);

  const estimateTraffic = async (currentAddress: string) => {
    if (!previousSpot || !currentAddress || currentAddress.length < 5) return;
    
    setIsCalculating(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const prompt = `你是一位專業的沖繩導遊。請計算從「${previousSpot.address}」自駕開車到「${currentAddress}」的預估交通資訊。請務必返回純 JSON 格式，包含兩個欄位："time" (例如 "45 min") 和 "distance" (例如 "12.5 km")。`;

      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
        config: {
          thinkingConfig: { thinkingBudget: 0 },
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              time: { type: Type.STRING },
              distance: { type: Type.STRING }
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

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white w-full max-w-md rounded-3xl max-h-[90vh] overflow-y-auto shadow-2xl">
        <div className="sticky top-0 bg-white border-b border-gray-100 p-6 flex justify-between items-center z-10">
          <h2 className="text-xl font-black text-gray-800 italic">{initialSpot ? '編輯行程' : '新增行程'}</h2>
          <button onClick={onClose} className="p-2 text-gray-400 hover:bg-gray-50 rounded-full transition-colors">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div>
            <label className="block text-[10px] font-black text-gray-400 uppercase mb-2 tracking-wider">行程名稱 *</label>
            <input required className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-100 rounded-2xl font-bold focus:border-[#FF4747] focus:outline-none" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="例：萬座毛" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-black text-gray-400 uppercase mb-2 tracking-wider">時間 *</label>
              <input required type="time" className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-100 rounded-2xl font-bold focus:border-[#FF4747] focus:outline-none" value={formData.time} onChange={e => setFormData({...formData, time: e.target.value})} />
            </div>
            <div>
              <label className="block text-[10px] font-black text-gray-400 uppercase mb-2 tracking-wider">類別</label>
              <select className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-100 rounded-2xl font-bold focus:border-[#FF4747] focus:outline-none" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value as SpotCategory})}>
                {Object.values(SpotCategory).map(cat => <option key={cat} value={cat}>{cat}</option>)}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-black text-gray-400 uppercase mb-2 tracking-wider">目的地地址 (自動估算交通)</label>
            <div className="relative">
              <input className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-100 rounded-2xl font-bold focus:border-[#FF4747] focus:outline-none text-xs pr-10" value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} onBlur={e => estimateTraffic(e.target.value)} placeholder="輸入地名或地址" />
              {isCalculating && <Loader2 size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#FF4747] animate-spin" />}
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-black text-gray-400 uppercase mb-2 tracking-wider">行程備註</label>
            <textarea className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-100 rounded-2xl font-bold focus:border-[#FF4747] focus:outline-none text-xs" rows={2} value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} placeholder="行程詳細內容..." />
          </div>

          <div className="space-y-3">
            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-wider">狀態標籤</label>
            <div className="grid grid-cols-2 gap-2">
              <button type="button" onClick={() => setFormData({...formData, isReserved: !formData.isReserved})} className={`flex items-center justify-center gap-2 p-2.5 rounded-xl border-2 font-black text-[10px] transition-all ${formData.isReserved ? 'bg-blue-50 border-blue-500 text-blue-600' : 'bg-gray-50 border-gray-100 text-gray-300'}`}>
                <CheckCircle2 size={14} /> 已預約
              </button>
              <button type="button" onClick={() => setFormData({...formData, isPaid: !formData.isPaid})} className={`flex items-center justify-center gap-2 p-2.5 rounded-xl border-2 font-black text-[10px] transition-all ${formData.isPaid ? 'bg-emerald-50 border-emerald-500 text-emerald-600' : 'bg-gray-50 border-gray-100 text-gray-300'}`}>
                <Wallet size={14} /> 已付款
              </button>
              <button type="button" onClick={() => setFormData({...formData, isPendingPayment: !formData.isPendingPayment})} className={`flex items-center justify-center gap-2 p-2.5 rounded-xl border-2 font-black text-[10px] transition-all ${formData.isPendingPayment ? 'bg-orange-50 border-orange-500 text-orange-600' : 'bg-gray-50 border-gray-100 text-gray-300'}`}>
                <Wallet size={14} /> 待付款
              </button>
              <button type="button" onClick={() => setFormData({...formData, showQRCode: !formData.showQRCode})} className={`flex items-center justify-center gap-2 p-2.5 rounded-xl border-2 font-black text-[10px] transition-all ${formData.showQRCode ? 'bg-purple-50 border-purple-500 text-purple-600' : 'bg-gray-50 border-gray-100 text-gray-300'}`}>
                <QrCode size={14} /> QR Code
              </button>
            </div>
          </div>

          <button type="submit" disabled={isCalculating} className={`w-full py-5 rounded-2xl font-black shadow-lg flex items-center justify-center gap-2 active:scale-95 transition-all ${isCalculating ? 'bg-gray-200 text-gray-400' : 'bg-[#FF4747] text-white'}`}>
            <Save size={20} /> 儲存行程
          </button>
        </form>
      </div>
    </div>
  );
};

export default SpotModal;
