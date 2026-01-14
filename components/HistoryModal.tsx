import React, { useState, useMemo } from 'react';
import { ArrowLeft, Search, Calendar, Image as ImageIcon, ChevronDown, ChevronRight, FileText, Briefcase, User } from 'lucide-react';
import { InvoiceRecord } from '../types';

interface HistoryModalProps {
  isOpen: boolean; 
  onClose: () => void;
  records: InvoiceRecord[];
  onLoadRecord: (record: InvoiceRecord) => void;
  onDeleteRecord: (id: string) => void;
}

export const HistoryModal: React.FC<HistoryModalProps> = ({
  onClose,
  records,
  onLoadRecord,
  onDeleteRecord,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMonth, setSelectedMonth] = useState<string>('all');
  const [selectedType, setSelectedType] = useState<'all' | 'triplicate' | 'duplicate'>('all');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  // Extract unique months
  const months = useMemo(() => {
    const m = new Set<string>();
    records.forEach(r => {
      m.add(r.dateStr.substring(0, 7));
    });
    return Array.from(m).sort().reverse();
  }, [records]);

  // Filter records
  const filteredRecords = useMemo(() => {
    return records
      .filter(r => {
        const isTriplicate = !!(r.buyerName && r.buyerName.trim().length > 0) || r.invoiceType === 'triplicate';
        if (selectedType === 'triplicate' && !isTriplicate) return false;
        if (selectedType === 'duplicate' && isTriplicate) return false;
        if (selectedMonth !== 'all' && !r.dateStr.startsWith(selectedMonth)) return false;
        
        if (!searchTerm) return true;
        const lowerTerm = searchTerm.toLowerCase();
        const hasMatchingItem = r.items.some(item => item.name.toLowerCase().includes(lowerTerm));
        const hasMatchingAmount = r.grandTotal.toString().includes(searchTerm);
        const hasMatchingTitle = r.buyerName?.toLowerCase().includes(lowerTerm);
        const hasMatchingDate = r.dateStr.includes(searchTerm);
        return hasMatchingItem || hasMatchingAmount || hasMatchingTitle || hasMatchingDate;
      })
      .sort((a, b) => b.timestamp - a.timestamp);
  }, [records, selectedMonth, searchTerm, selectedType]);

  return (
    <div className="min-h-screen bg-[#f4f1ea] flex flex-col font-sans text-[#264653]">
        {/* Sticky Header */}
        <div className="bg-[#fffdf5] shadow-sm sticky top-0 z-10 border-b-2 border-[#eaddcf]">
            <div className="max-w-3xl mx-auto px-4 py-3 flex items-center gap-3">
                <button 
                    onClick={onClose} 
                    className="p-2 -ml-2 text-[#5c4d3c] hover:bg-[#eaddcf] rounded-full active:scale-95 transition-all"
                >
                    <ArrowLeft className="w-6 h-6" />
                </button>
                <h3 className="text-xl font-black text-[#264653] flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-[#e76f51]" /> 
                    歷史檔案 History
                </h3>
            </div>
        </div>

        <div className="flex-1 w-full max-w-3xl mx-auto flex flex-col">
            {/* Filters Area */}
            <div className="p-4 bg-[#f4f1ea] space-y-4">
                
                {/* Search - Retro Input */}
                <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#b0a695] w-5 h-5" />
                    <input 
                        type="text" 
                        placeholder="搜尋抬頭、品項或金額..." 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-12 pr-4 py-3 rounded-2xl border-2 border-[#eaddcf] bg-white focus:outline-none focus:border-[#e76f51] focus:ring-0 transition-all text-base font-bold text-[#264653] shadow-sm placeholder-[#d6ccc2]"
                    />
                </div>

                {/* Type Tabs - Pill Shape */}
                <div className="flex p-1.5 bg-[#d6ccc2] rounded-full">
                     {['all', 'triplicate', 'duplicate'].map((type) => (
                         <button 
                            key={type}
                            onClick={() => setSelectedType(type as any)}
                            className={`flex-1 py-2 text-sm font-bold rounded-full transition-all ${
                                selectedType === type 
                                ? 'bg-white text-[#264653] shadow-md transform scale-105' 
                                : 'text-[#fffdf5] hover:text-white'
                            }`}
                         >
                            {type === 'all' ? '全部' : type === 'triplicate' ? '三聯式' : '二聯式'}
                         </button>
                     ))}
                </div>

                {/* Month Filter - Chips */}
                <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
                    <button 
                        onClick={() => setSelectedMonth('all')}
                        className={`px-4 py-1.5 rounded-full text-sm font-bold whitespace-nowrap transition-colors border-2 ${
                            selectedMonth === 'all' 
                            ? 'bg-[#2a9d8f] text-white border-[#2a9d8f] shadow-[0_2px_0_0_#1d756a] translate-y-[-2px]' 
                            : 'bg-white text-[#b0a695] border-[#eaddcf] hover:border-[#b0a695]'
                        }`}
                    >
                        所有月份
                    </button>
                    {months.map(m => (
                    <button 
                        key={m}
                        onClick={() => setSelectedMonth(m)}
                        className={`px-4 py-1.5 rounded-full text-sm font-bold whitespace-nowrap transition-colors border-2 ${
                        selectedMonth === m 
                            ? 'bg-[#e9c46a] text-[#5c4d3c] border-[#e9c46a] shadow-[0_2px_0_0_#c5a044] translate-y-[-2px]' 
                            : 'bg-white text-[#b0a695] border-[#eaddcf] hover:border-[#b0a695]'
                        }`}
                    >
                        {m}
                    </button>
                    ))}
                </div>
            </div>
            
            {/* Records List */}
            <div className="flex-1 p-4 space-y-4">
            {filteredRecords.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 text-[#d6ccc2]">
                    <FileText className="w-16 h-16 mb-4" />
                    <p className="text-lg font-bold">沒有找到相關紀錄</p>
                </div>
            ) : (
                filteredRecords.map(record => {
                const isImageOnly = record.items.length === 0 && record.grandTotal === 0;
                const isTriplicate = !!(record.buyerName && record.buyerName.length > 0) || record.invoiceType === 'triplicate';

                return (
                    <div key={record.id} className="bg-white rounded-[1.5rem] shadow-[0_4px_0_0_#eaddcf] border-2 border-[#fff] overflow-hidden group">
                    <div 
                        className="p-5 flex justify-between items-center cursor-pointer hover:bg-[#fffdf5] transition-colors"
                        onClick={() => setExpandedId(expandedId === record.id ? null : record.id)}
                    >
                        <div className="flex flex-col gap-2">
                            <div className="flex items-center gap-2 flex-wrap">
                                <span className="text-xs font-bold tracking-wider text-[#b0a695] bg-[#f4f1ea] px-2 py-0.5 rounded-md">
                                    {record.dateStr}
                                </span>
                                {isTriplicate ? (
                                    <span className="text-xs text-white bg-[#e76f51] px-2 py-0.5 rounded-full font-bold flex items-center gap-1">
                                        <Briefcase size={10} /> 三聯式
                                    </span>
                                ) : (
                                    <span className="text-xs text-white bg-[#2a9d8f] px-2 py-0.5 rounded-full font-bold flex items-center gap-1">
                                        <User size={10} /> 二聯式
                                    </span>
                                )}
                                {isImageOnly && <span className="text-xs text-[#5c4d3c] bg-[#e9c46a] px-2 py-0.5 rounded-full font-bold">照片</span>}
                            </div>
                            
                            {isTriplicate && (
                                <div className="text-base font-black text-[#5c4d3c]">
                                    {record.buyerName}
                                </div>
                            )}

                            <div className={`text-2xl font-black font-mono ${isImageOnly ? 'text-[#d6ccc2]' : 'text-[#264653]'}`}>
                                {isImageOnly ? '---' : `$${record.grandTotal.toLocaleString()}`}
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                        {record.photoBase64 && <ImageIcon className="w-6 h-6 text-[#e9c46a]" />}
                        <div className="bg-[#f4f1ea] p-2 rounded-full text-[#b0a695] group-hover:text-[#e76f51] transition-colors">
                            {expandedId === record.id ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
                        </div>
                        </div>
                    </div>

                    {/* Expanded Details */}
                    {expandedId === record.id && (
                        <div className="border-t-2 border-[#f4f1ea] p-5 bg-[#fcfbf7]">
                        {record.photoBase64 && (
                            <div className="mb-4 rounded-xl overflow-hidden border-2 border-[#eaddcf] shadow-sm rotate-1">
                                <img src={`data:image/jpeg;base64,${record.photoBase64}`} alt="Invoice" className="w-full h-auto object-cover" />
                            </div>
                        )}
                        
                        {!isImageOnly && (
                            <div className="bg-white p-4 rounded-xl border-2 border-[#f4f1ea] mb-4">
                                <div className="space-y-2 mb-3">
                                {record.items.map((item, idx) => (
                                    item.name && (
                                        <div key={idx} className="flex justify-between text-sm text-[#5c4d3c] border-b border-[#f4f1ea] last:border-0 pb-2 last:pb-0">
                                            <span className="font-bold">{item.name} {item.quantity ? `x${item.quantity}` : ''}</span>
                                            <span className="font-mono text-[#2a9d8f] font-bold">${Number(item.amount).toLocaleString()}</span>
                                        </div>
                                    )
                                ))}
                                </div>
                            </div>
                        )}
                        
                        <div className="flex gap-3">
                            {!isImageOnly && (
                                <button 
                                    onClick={() => {
                                        onLoadRecord(record);
                                        onClose();
                                    }}
                                    className="flex-1 py-3 bg-[#264653] text-white rounded-xl hover:bg-[#1a313a] font-bold shadow-[0_4px_0_0_#1a313a] active:shadow-none active:translate-y-1 transition-all"
                                >
                                    載入 Load
                                </button>
                            )}
                            <button 
                                onClick={() => onDeleteRecord(record.id)}
                                className={`px-4 py-3 bg-white border-2 border-[#e76f51] text-[#e76f51] rounded-xl hover:bg-red-50 font-bold shadow-[0_4px_0_0_#ffddd6] active:shadow-none active:translate-y-1 transition-all ${isImageOnly ? 'flex-1' : ''}`}
                            >
                                刪除 Delete
                            </button>
                        </div>
                        </div>
                    )}
                    </div>
                );
                })
            )}
            </div>
        </div>
    </div>
  );
};