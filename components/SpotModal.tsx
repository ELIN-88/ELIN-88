
import React, { useState, useEffect } from 'react';
import { X, Save, Clock, CheckCircle2, QrCode, Wallet, Navigation } from 'lucide-react';
import { Spot, SpotCategory } from '../types';

interface SpotModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (spot: Spot) => void;
  initialSpot?: Spot | null;
}

const SpotModal: React.FC<SpotModalProps> = ({ isOpen, onClose, onSave, initialSpot }) => {
  const [formData, setFormData] = useState<Partial<Spot>>({
    time: '',
    name: '',
    description: '',
    category: SpotCategory.SIGHTS,
    tags: [],
    mapUrl: '',
    address: '',
    isReserved: false,
    showQRCode: false,
    isPaid: false,
    travelTime: '',
    travelDistance: ''
  });

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
        isReserved: false,
        showQRCode: false,
        isPaid: false,
        travelTime: '',
        travelDistance: ''
      });
    }
  }, [initialSpot, isOpen]);

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
            <label className="block text-[10px] font-black text-gray-400 uppercase mb-2 tracking-wider">行程備註</label>
            <textarea className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-100 rounded-2xl font-bold focus:border-[#FF4747] focus:outline-none text-xs" rows={2} value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} placeholder="行李寄放、聯絡資訊..." />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-black text-gray-400 uppercase mb-2 tracking-wider">交通時間 (預估)</label>
              <input className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-100 rounded-2xl font-bold focus:border-[#FF4747] focus:outline-none text-xs" value={formData.travelTime} onChange={e => setFormData({...formData, travelTime: e.target.value})} placeholder="例：30 min" />
            </div>
            <div>
              <label className="block text-[10px] font-black text-gray-400 uppercase mb-2 tracking-wider">距離</label>
              <input className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-100 rounded-2xl font-bold focus:border-[#FF4747] focus:outline-none text-xs" value={formData.travelDistance} onChange={e => setFormData({...formData, travelDistance: e.target.value})} placeholder="例：15 km" />
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-black text-gray-400 uppercase mb-2 tracking-wider">地圖連結</label>
            <input className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-100 rounded-2xl font-bold focus:border-[#FF4747] focus:outline-none text-xs" value={formData.mapUrl} onChange={e => setFormData({...formData, mapUrl: e.target.value})} placeholder="貼上 Google Maps URL" />
          </div>

          <div className="space-y-3">
            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-wider">狀態標籤</label>
            <div className="grid grid-cols-3 gap-2">
              <button type="button" onClick={() => setFormData({...formData, isReserved: !formData.isReserved})} className={`flex items-center justify-center gap-1.5 p-2 rounded-xl border-2 font-black text-[9px] transition-all ${formData.isReserved ? 'bg-blue-50 border-blue-500 text-blue-600' : 'bg-gray-50 border-gray-100 text-gray-300'}`}>
                <CheckCircle2 size={12} /> 預約
              </button>
              <button type="button" onClick={() => setFormData({...formData, isPaid: !formData.isPaid})} className={`flex items-center justify-center gap-1.5 p-2 rounded-xl border-2 font-black text-[9px] transition-all ${formData.isPaid ? 'bg-emerald-50 border-emerald-500 text-emerald-600' : 'bg-gray-50 border-gray-100 text-gray-300'}`}>
                <Wallet size={12} /> 已付
              </button>
              <button type="button" onClick={() => setFormData({...formData, showQRCode: !formData.showQRCode})} className={`flex items-center justify-center gap-1.5 p-2 rounded-xl border-2 font-black text-[9px] transition-all ${formData.showQRCode ? 'bg-purple-50 border-purple-500 text-purple-600' : 'bg-gray-50 border-gray-100 text-gray-300'}`}>
                <QrCode size={12} /> QR
              </button>
            </div>
          </div>

          <button type="submit" className="w-full py-5 bg-[#FF4747] text-white rounded-2xl font-black shadow-lg flex items-center justify-center gap-2 active:scale-95 transition-all italic border-2 border-slate-900">
            <Save size={20} /> 儲存行程變動
          </button>
        </form>
      </div>
    </div>
  );
};

export default SpotModal;
