import React from 'react';
import { X } from 'lucide-react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  taxRate: number;
  setTaxRate: (rate: number) => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  taxRate,
  setTaxRate,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#264653]/40 backdrop-blur-sm p-4 font-sans">
      <div className="bg-[#fffdf5] rounded-[2rem] shadow-[0_10px_0_0_rgba(0,0,0,0.2)] w-full max-w-sm overflow-hidden flex flex-col border-4 border-white animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex justify-between items-center p-5 bg-[#e9c46a]">
          <h3 className="text-xl font-black text-[#5c4d3c]">Settings 設定</h3>
          <button onClick={onClose} className="bg-white/30 p-2 rounded-full hover:bg-white/50 text-[#5c4d3c] transition-colors">
            <X size={20} />
          </button>
        </div>
        
        <div className="p-6 space-y-6">
          {/* Tax Rate Section */}
          <div className="bg-[#f4f1ea] p-4 rounded-2xl border-2 border-[#eaddcf]">
            <label className="block text-sm font-bold text-[#e76f51] mb-2 uppercase tracking-wide">
              營業稅率 Tax Rate
            </label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                value={taxRate}
                onChange={(e) => setTaxRate(Number(e.target.value))}
                className="w-full bg-white border-2 border-[#d6ccc2] rounded-xl px-3 py-2 text-xl font-bold text-[#264653] focus:border-[#e76f51] outline-none text-center"
                placeholder="5"
              />
              <span className="text-xl font-black text-[#b0a695]">%</span>
            </div>
            <p className="text-xs text-[#5c4d3c] mt-2 font-medium">
              台灣一般稅率預設為 5%。
            </p>
          </div>
        </div>

        <div className="p-4 bg-[#f4f1ea] border-t-2 border-[#eaddcf]">
          <button
            onClick={onClose}
            className="w-full py-3 bg-[#264653] text-white rounded-xl font-bold text-lg shadow-[0_4px_0_0_#1a313a] active:shadow-none active:translate-y-1 transition-all"
          >
            完成儲存 Done
          </button>
        </div>
      </div>
    </div>
  );
};