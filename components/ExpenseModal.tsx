
import React, { useState, useEffect, useRef } from 'react';
import { X, Save, Camera, CreditCard, Banknote, Percent, Info, Trash2 } from 'lucide-react';
import { ExpenseItem, ExpenseCategory } from '../types';

interface ExpenseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (expense: ExpenseItem) => void;
  initialExpense?: ExpenseItem | null;
  exchangeRate: number;
}

const ExpenseModal: React.FC<ExpenseModalProps> = ({ isOpen, onClose, onSave, initialExpense, exchangeRate }) => {
  const [formData, setFormData] = useState<Partial<ExpenseItem>>({
    name: '',
    category: ExpenseCategory.OTHER,
    amountJpy: 0,
    amountTwd: 0,
    taxIncluded: true,
    paymentMethod: '現金',
    note: '',
    photo: '',
    date: new Date().toISOString().split('T')[0]
  });

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (initialExpense) {
      setFormData(initialExpense);
    } else {
      setFormData({
        name: '',
        category: ExpenseCategory.OTHER,
        amountJpy: 0,
        amountTwd: 0,
        taxIncluded: true,
        paymentMethod: '現金',
        note: '',
        photo: '',
        date: new Date().toISOString().split('T')[0]
      });
    }
  }, [initialExpense, isOpen]);

  // 當日幣金額或稅金切換或匯率變動時更新台幣
  useEffect(() => {
    const jpy = formData.amountJpy || 0;
    const finalJpy = formData.taxIncluded ? jpy : Math.round(jpy * 1.1);
    const twd = Math.round(finalJpy * exchangeRate);
    setFormData(prev => ({ ...prev, amountTwd: twd }));
  }, [formData.amountJpy, formData.taxIncluded, exchangeRate]);

  if (!isOpen) return null;

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setFormData(prev => ({ ...prev, photo: event.target!.result as string }));
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...formData as ExpenseItem,
      id: initialExpense?.id || Math.random().toString(36).substr(2, 9),
      createdAt: initialExpense?.createdAt || Date.now()
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white w-full max-w-md rounded-[32px] max-h-[90vh] overflow-y-auto shadow-2xl border-4 border-[#2D3436]">
        <div className="sticky top-0 bg-white border-b-4 border-[#2D3436] p-5 flex justify-between items-center z-10">
          <h2 className="text-xl font-black text-gray-800 italic flex items-center gap-2 tracking-tighter">
            <ReceiptText size={22} className="text-[#FF4747]"/> 記下一筆支出
          </h2>
          <button onClick={onClose} className="p-2 bg-slate-100 rounded-full border-2 border-[#2D3436] comic-button">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* 金額輸入 - 特大號 */}
          <div className="bg-[#FFFBEB] p-4 rounded-2xl border-2 border-[#2D3436] shadow-inner">
            <label className="block text-[10px] font-black text-slate-400 uppercase mb-1 italic">日幣金額 (JPY)</label>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-black">¥</span>
              <input 
                required 
                type="number" 
                className="w-full bg-transparent text-3xl font-black focus:outline-none" 
                value={formData.amountJpy || ''} 
                onChange={e => setFormData({...formData, amountJpy: parseFloat(e.target.value)})} 
                placeholder="0"
              />
            </div>
            <div className="mt-2 flex items-center justify-between">
              <span className="text-[10px] font-bold text-slate-500 italic">台幣預估: $ {formData.amountTwd}</span>
              <button 
                type="button" 
                onClick={() => setFormData({...formData, taxIncluded: !formData.taxIncluded})}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-full border-2 font-black text-[9px] transition-all ${formData.taxIncluded ? 'bg-emerald-500 text-white border-slate-900' : 'bg-orange-500 text-white border-slate-900'}`}
              >
                {formData.taxIncluded ? <Percent size={10}/> : <Percent size={10}/>}
                {formData.taxIncluded ? '含稅價' : '未稅 (+10%)'}
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-black text-gray-400 uppercase mb-2 italic">項目名稱 *</label>
              <input required className="w-full px-4 py-3 bg-gray-50 border-2 border-[#2D3436] rounded-xl font-bold focus:outline-none" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="例: 炸雞君" />
            </div>
            <div>
              <label className="block text-[10px] font-black text-gray-400 uppercase mb-2 italic">日期</label>
              <input type="date" className="w-full px-4 py-3 bg-gray-50 border-2 border-[#2D3436] rounded-xl font-bold focus:outline-none text-xs" value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} />
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-black text-gray-400 uppercase mb-2 italic">支出類別</label>
            <div className="grid grid-cols-3 gap-1.5">
              {Object.values(ExpenseCategory).map(cat => (
                <button 
                  key={cat} 
                  type="button" 
                  onClick={() => setFormData({...formData, category: cat})}
                  className={`py-2 rounded-lg border-2 font-black text-[10px] transition-all ${formData.category === cat ? 'bg-[#FFD93D] border-[#2D3436] shadow-[2px_2px_0px_#2D3436]' : 'bg-white border-slate-200 text-slate-400'}`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-black text-gray-400 uppercase mb-2 italic">支付方式</label>
              <div className="flex gap-2">
                <button 
                  type="button" 
                  onClick={() => setFormData({...formData, paymentMethod: '現金'})}
                  className={`flex-1 py-3 rounded-xl border-2 font-black text-[10px] flex items-center justify-center gap-1.5 transition-all ${formData.paymentMethod === '現金' ? 'bg-[#4CB9E7] text-white border-slate-900' : 'bg-white text-slate-300 border-slate-200'}`}
                >
                  <Banknote size={14}/> 現金
                </button>
                <button 
                  type="button" 
                  onClick={() => setFormData({...formData, paymentMethod: '信用卡'})}
                  className={`flex-1 py-3 rounded-xl border-2 font-black text-[10px] flex items-center justify-center gap-1.5 transition-all ${formData.paymentMethod === '信用卡' ? 'bg-[#FF4747] text-white border-slate-900' : 'bg-white text-slate-300 border-slate-200'}`}
                >
                  <CreditCard size={14}/> 刷卡
                </button>
              </div>
            </div>
            <div>
              <label className="block text-[10px] font-black text-gray-400 uppercase mb-2 italic">收據副本</label>
              <button 
                type="button" 
                onClick={() => fileInputRef.current?.click()}
                className={`w-full py-3 rounded-xl border-2 border-dashed font-black text-[10px] flex items-center justify-center gap-1.5 transition-all ${formData.photo ? 'bg-emerald-50 border-emerald-500 text-emerald-600' : 'bg-slate-50 border-slate-300 text-slate-400'}`}
              >
                <Camera size={14}/> {formData.photo ? '已拍下' : '拍照存檔'}
              </button>
              <input type="file" accept="image/*" capture="environment" ref={fileInputRef} onChange={handlePhotoUpload} className="hidden" />
            </div>
          </div>

          {formData.photo && (
            <div className="relative w-full h-32 rounded-xl overflow-hidden border-2 border-[#2D3436]">
              <img src={formData.photo} className="w-full h-full object-cover" />
              <button 
                type="button" 
                onClick={() => setFormData({...formData, photo: ''})}
                className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full shadow-md"
              >
                <Trash2 size={12}/>
              </button>
            </div>
          )}

          <div>
            <label className="block text-[10px] font-black text-gray-400 uppercase mb-2 italic">備註</label>
            <textarea 
              className="w-full px-4 py-3 bg-gray-50 border-2 border-[#2D3436] rounded-xl font-bold focus:outline-none text-xs" 
              rows={2} 
              value={formData.note} 
              onChange={e => setFormData({...formData, note: e.target.value})} 
              placeholder="還有什麼要紀錄的嗎？"
            />
          </div>

          <button type="submit" className="w-full py-5 bg-[#FFD93D] text-[#2D3436] rounded-[24px] font-black shadow-[4px_4px_0px_#2D3436] flex items-center justify-center gap-2 active:translate-y-1 active:shadow-none border-2 border-[#2D3436] transition-all">
            <Save size={20} /> 儲存支出
          </button>
        </form>
      </div>
    </div>
  );
};

export default ExpenseModal;

const ReceiptText = ({ size, className }: { size: number, className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M4 2v20l2-1 2 1 2-1 2 1 2-1 2 1 2-1 2 1V2l-2 1-2-1-2 1-2-1-2 1-2-1-2 1-2-1Z" />
    <path d="M16 8H8" />
    <path d="M16 12H8" />
    <path d="M13 16H8" />
  </svg>
);
