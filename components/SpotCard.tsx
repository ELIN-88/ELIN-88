
import React, { useState } from 'react';
import { MapPin, Image as ImageIcon, Edit2, Trash2, Clock, Navigation, CheckCircle2, QrCode, ShieldCheck } from 'lucide-react';
import { Spot } from '../types';

interface SpotCardProps {
  spot: Spot;
  onEdit: (spot: Spot) => void;
  onDelete: (id: string) => void;
}

const SpotCard: React.FC<SpotCardProps> = ({ spot, onEdit, onDelete }) => {
  const [photos, setPhotos] = useState<string[]>([]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setPhotos((prev) => [...prev, event.target!.result as string]);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="comic-border p-4 mb-6 bg-white rounded-[28px] relative shadow-sm border-[3px] border-[#2D3436]">
      {/* 頂部時間與操作按鈕 */}
      <div className="flex items-center justify-between mb-3 border-b-2 border-slate-50 pb-2.5">
        <div className="flex items-center gap-2.5">
          <span className="text-[12px] font-black italic bg-[#FFD93D] px-2.5 py-1 rounded-lg border-2 border-slate-900 shadow-[2px_2px_0px_#2D3436]">{spot.time}</span>
        </div>
        <div className="flex gap-2.5">
          <button onClick={() => onEdit(spot)} className="text-slate-300 hover:text-slate-900 transition-colors"><Edit2 size={16} /></button>
          <button onClick={() => onDelete(spot.id)} className="text-slate-300 hover:text-red-500 transition-colors"><Trash2 size={16} /></button>
        </div>
      </div>

      {/* 核心內容區 */}
      <div className="mb-4">
        <h3 className="text-base font-black text-gray-800 mb-2 italic tracking-tight">{spot.name}</h3>
        
        {/* 狀態標籤區 - 直觀且清晰 */}
        <div className="flex flex-wrap gap-1.5 mb-3">
          {spot.isReserved && (
            <div className="flex items-center gap-1 bg-blue-500 text-white px-2 py-0.5 rounded-full border-2 border-[#2D3436] shadow-[1.5px_1.5px_0px_#2D3436] text-[8px] font-black italic">
              <CheckCircle2 size={10} /> 已預約
            </div>
          )}
          {spot.isPaid && (
            <div className="flex items-center gap-1 bg-emerald-500 text-white px-2 py-0.5 rounded-full border-2 border-[#2D3436] shadow-[1.5px_1.5px_0px_#2D3436] text-[8px] font-black italic">
              <ShieldCheck size={10} /> 已付款
            </div>
          )}
          {spot.showQRCode && (
            <div className="flex items-center gap-1 bg-purple-500 text-white px-2 py-0.5 rounded-full border-2 border-[#2D3436] shadow-[1.5px_1.5px_0px_#2D3436] text-[8px] font-black italic">
              <QrCode size={10} /> QR Code
            </div>
          )}
        </div>

        {/* 備註對話框 - 完整顯示，不截斷文字 */}
        <div className="relative bg-slate-50 p-3 rounded-2xl border-2 border-[#2D3436] mt-2 shadow-inner">
          <div className="absolute top-[-8px] left-4 w-0 h-0 border-l-[8px] border-l-transparent border-r-[8px] border-r-transparent border-b-[8px] border-b-[#2D3436]"></div>
          <p className="text-[10px] font-bold text-gray-700 leading-relaxed italic whitespace-pre-wrap">{spot.description || "暫無備註"}</p>
        </div>
      </div>

      {/* 交通估算 */}
      {(spot.travelTime || spot.travelDistance) && (
        <div className="mb-4 flex gap-2">
          <div className="flex-1 bg-blue-50 p-2 rounded-xl border-2 border-[#2D3436] flex items-center justify-center gap-1.5 shadow-[2px_2px_0px_#2D3436]">
            <Clock size={12} className="text-blue-500" />
            <span className="text-[9px] font-black text-[#2D3436] italic">{spot.travelTime}</span>
          </div>
          <div className="flex-1 bg-rose-50 p-2 rounded-xl border-2 border-[#2D3436] flex items-center justify-center gap-1.5 shadow-[2px_2px_0px_#2D3436]">
            <Navigation size={12} className="text-rose-500" />
            <span className="text-[9px] font-black text-[#2D3436] italic">{spot.travelDistance}</span>
          </div>
        </div>
      )}

      {/* 底部按鈕 */}
      <div className="flex gap-2">
        <a href={spot.mapUrl} target="_blank" rel="noopener noreferrer" className="flex-1 bg-[#FF4747] text-white py-3 rounded-[20px] flex items-center justify-center gap-2 text-[11px] font-black italic comic-border comic-button shadow-md">
          <MapPin size={16} /> 開啟導航
        </a>
        <label className="px-4 border-[3px] border-slate-900 rounded-[20px] flex items-center justify-center cursor-pointer bg-white comic-button shadow-sm">
          <input type="file" className="hidden" onChange={handleFileUpload} />
          <ImageIcon size={16} className="text-slate-900" />
        </label>
      </div>
    </div>
  );
};

export default SpotCard;
