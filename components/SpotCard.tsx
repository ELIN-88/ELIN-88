
import React, { useState } from 'react';
import { MapPin, Camera, Car, Fuel, Users, Image as ImageIcon, Edit2, Trash2 } from 'lucide-react';
import { Spot, SpotCategory } from '../types';

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

  const getCategoryColor = (cat: SpotCategory) => {
    switch (cat) {
      case SpotCategory.FOOD: return 'bg-rose-100 text-[#FF4747] border-[#FF4747]/20';
      case SpotCategory.ACTIVITY: return 'bg-sky-100 text-[#4CB9E7] border-[#4CB9E7]/20';
      case SpotCategory.SHOPPING: return 'bg-pink-100 text-pink-500 border-pink-200';
      case SpotCategory.SIGHTS: return 'bg-emerald-100 text-emerald-600 border-emerald-200';
      case SpotCategory.HOTEL: return 'bg-indigo-100 text-indigo-600 border-indigo-200';
      case SpotCategory.TRANSPORT: return 'bg-slate-100 text-slate-500 border-slate-200';
      default: return 'bg-slate-100 text-slate-500 border-slate-200';
    }
  };

  return (
    <div className="anime-card p-6 border-4 border-white shadow-xl shadow-slate-100/50">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <span className="text-xl font-black text-gray-800 tracking-tight">{spot.time}</span>
          <span className={`px-3 py-1 rounded-full text-[10px] font-black border uppercase tracking-widest sticker-label ${getCategoryColor(spot.category)}`}>
            {spot.category}
          </span>
        </div>
        <div className="flex gap-1 opacity-20 hover:opacity-100 transition-opacity">
          <button onClick={() => onEdit(spot)} className="p-2 text-slate-400"><Edit2 size={16} /></button>
          <button onClick={() => onDelete(spot.id)} className="p-2 text-slate-400"><Trash2 size={16} /></button>
        </div>
      </div>

      <div className="mb-5">
        <h3 className="text-xl font-black text-gray-800 leading-tight mb-2">{spot.name}</h3>
        <p className="text-xs font-bold text-gray-400 leading-relaxed">{spot.description}</p>
      </div>

      {spot.tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-5">
          {spot.tags.map((tag) => (
            <span key={tag} className="px-3 py-1 rounded-xl text-[10px] font-black bg-[#FFD93D]/10 text-[#B08A00] border border-[#FFD93D]/30 italic shadow-sm">#{tag}</span>
          ))}
        </div>
      )}

      {(spot.parkingInfo || spot.gasInfo) && (
        <div className="flex gap-3 mb-6">
          {spot.parkingInfo && (
            <div className="flex-1 bg-slate-50/80 p-3 rounded-2xl flex items-center gap-2 border-2 border-slate-50">
              <Car size={14} className="text-[#4CB9E7]" />
              <span className="text-[10px] text-gray-400 font-black truncate">{spot.parkingInfo}</span>
            </div>
          )}
          {spot.gasInfo && (
            <div className="flex-1 bg-slate-50/80 p-3 rounded-2xl flex items-center gap-2 border-2 border-slate-50">
              <Fuel size={14} className="text-orange-400" />
              <span className="text-[10px] text-gray-400 font-black truncate">{spot.gasInfo}</span>
            </div>
          )}
        </div>
      )}

      <div className="flex gap-3">
        <a 
          href={spot.mapUrl}
          target="_blank" rel="noopener noreferrer"
          className="flex-1 bg-[#4CB9E7] text-white py-4 rounded-[24px] flex items-center justify-center gap-2 text-xs font-black active:bg-[#3AA8D6] shadow-lg shadow-blue-100 transition-all"
        >
          <MapPin size={16} /> 導航任務
        </a>
        <label className="w-14 bg-white border-2 border-slate-100 rounded-[24px] flex items-center justify-center cursor-pointer hover:bg-slate-50 transition-colors shadow-sm">
          <input type="file" className="hidden" onChange={handleFileUpload} />
          <ImageIcon size={18} className="text-slate-300" />
        </label>
      </div>

      {photos.length > 0 && (
        <div className="flex gap-3 mt-6 overflow-x-auto pb-2 custom-scrollbar">
          {photos.map((src, idx) => (
            <img key={idx} src={src} className="h-14 w-14 object-cover rounded-[18px] border-4 border-white shadow-md shrink-0" />
          ))}
        </div>
      )}
    </div>
  );
};

export default SpotCard;
