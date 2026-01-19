import React, { useState, useEffect, useRef } from 'react';
import { Settings, Calculator, Trash2, Plus, History, Search } from 'lucide-react';
import { InvoiceItem, InvoiceRecord } from './types';
import { getChineseAmountParts } from './utils/numberToChinese';
import { SettingsModal } from './components/SettingsModal';
import { HistoryModal } from './components/HistoryModal';

const App: React.FC = () => {
  // State
  const [view, setView] = useState<'home' | 'history'>('home');
  const [items, setItems] = useState<InvoiceItem[]>([
    { id: '1', name: '', quantity: '', unitPrice: '', amount: '' },
    { id: '2', name: '', quantity: '', unitPrice: '', amount: '' },
    { id: '3', name: '', quantity: '', unitPrice: '', amount: '' },
    { id: '4', name: '', quantity: '', unitPrice: '', amount: '' },
  ]);
  const [buyerName, setBuyerName] = useState<string>('');
  const [taxRate, setTaxRate] = useState<number>(5);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  
  // History State
  const [records, setRecords] = useState<InvoiceRecord[]>([]);

  // Load history from local storage
  useEffect(() => {
    const stored = localStorage.getItem('invoice_history');
    let loadedRecords: InvoiceRecord[] = [];
    if (stored) {
        try { loadedRecords = JSON.parse(stored); } catch (e) { console.error(e); }
    }
    // Demo data injection omitted for brevity, logic remains same as before if needed
    const demoId = 'demo-1141204';
    if (!loadedRecords.find(r => r.id === demoId)) {
        const demoRecord: InvoiceRecord = {
            id: demoId,
            timestamp: new Date('2025-12-04T12:00:00').getTime(),
            dateStr: '2025-12-04',
            items: [
                { id: 'd1', name: 'JCV-63RT', quantity: '1', unitPrice: '33600', amount: '33600' },
                { id: 'd2', name: 'JCV-28XT', quantity: '1', unitPrice: '13800', amount: '13800' }
            ],
            subtotal: 45143,
            tax: 2257,
            grandTotal: 47400,
            photoBase64: undefined,
            buyerName: "日華科技空調有限公司",
            invoiceType: "triplicate"
        };
        loadedRecords = [demoRecord, ...loadedRecords];
    }
    setRecords(loadedRecords);
  }, []);

  useEffect(() => {
    if (records.length > 0) {
        localStorage.setItem('invoice_history', JSON.stringify(records));
    }
  }, [records]);

  // Calculations
  const calculateItemBreakdown = (amountStr: string | number) => {
    const total = Number(amountStr) || 0;
    // 小計 ÷ 1.05 = 未稅（四捨五入）
    const net = Math.round(total / 1.05);
    // 未稅 × 0.05 = 稅金
    const tax = Math.round(net * 0.05);
    return { total, net, tax };
  };

  const totals = items.reduce((acc, item) => {
    const { net, tax, total } = calculateItemBreakdown(item.amount);
    return {
      subtotal: acc.subtotal + net,
      tax: acc.tax + tax,
      grandTotal: acc.grandTotal + total
    };
  }, { subtotal: 0, tax: 0, grandTotal: 0 });

  const handleItemChange = (id: string, field: keyof InvoiceItem, value: string | number) => {
    setItems(prev => prev.map(item => {
      if (item.id !== id) return item;
      const updatedItem = { ...item, [field]: value };
      if (field === 'quantity' || field === 'unitPrice') {
        const qty = field === 'quantity' ? Number(value) : Number(item.quantity);
        const price = field === 'unitPrice' ? Number(value) : Number(item.unitPrice);
        if (qty && price) {
          updatedItem.amount = Math.round(qty * price);
        }
      }
      return updatedItem;
    }));
  };

  const addItem = () => {
    setItems(prev => [...prev, { id: crypto.randomUUID(), name: '', quantity: '', unitPrice: '', amount: '' }]);
  };

  const removeItem = (id: string) => {
    if (items.length <= 1) return;
    setItems(prev => prev.filter(item => item.id !== id));
  };

  const loadRecord = (record: InvoiceRecord) => {
      const loadedItems = [...record.items];
      while(loadedItems.length < 4) {
          loadedItems.push({ id: crypto.randomUUID(), name: '', quantity: '', unitPrice: '', amount: '' });
      }
      setItems(loadedItems);
      setBuyerName(record.buyerName || '');
      setView('home');
  };

  const deleteRecord = (id: string) => {
      if(window.confirm('確定要刪除此紀錄嗎？')) {
          setRecords(prev => prev.filter(r => r.id !== id));
      }
  };

  const chineseAmountParts = getChineseAmountParts(totals.grandTotal);

  if (view === 'history') {
      return (
          <>
            <HistoryModal
                isOpen={true}
                onClose={() => setView('home')}
                records={records}
                onLoadRecord={loadRecord}
                onDeleteRecord={deleteRecord}
            />
             <SettingsModal 
                isOpen={isSettingsOpen} 
                onClose={() => setIsSettingsOpen(false)}
                taxRate={taxRate}
                setTaxRate={setTaxRate}
            />
          </>
      );
  }

  return (
    <div className="min-h-screen bg-[#f4f1ea] pb-12 flex flex-col items-center font-sans text-[#264653]">
      
      {/* Header */}
      <header className="w-full max-w-3xl mx-auto px-6 py-6 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="bg-[#e76f51] p-2 rounded-xl shadow-[2px_2px_0px_rgba(0,0,0,0.15)]">
            <Calculator className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-2xl font-extrabold tracking-tight text-[#264653]">小隼助手 <span className="text-sm font-normal opacity-60 ml-1">Tax</span></h1>
        </div>
        <div className="flex gap-2">
           <button 
              onClick={() => setView('history')}
              className="p-3 bg-[#e9c46a] text-[#5c4d3c] rounded-2xl hover:bg-[#dec27b] transition shadow-[0_4px_0_0_#c5a044] active:shadow-none active:translate-y-1 md:hidden"
           >
              <History className="w-5 h-5" />
          </button>
          <button 
              onClick={() => setIsSettingsOpen(true)}
              className="p-3 bg-[#fffdf5] text-[#264653] rounded-2xl border-2 border-[#eaddcf] hover:bg-white transition shadow-[0_4px_0_0_#d6ccc2] active:shadow-none active:translate-y-1"
          >
              <Settings className="w-5 h-5" />
          </button>
        </div>
      </header>

      <main className="w-full max-w-3xl px-4 space-y-8">
        
        {/* Search Bar / File Button */}
        <button 
            onClick={() => setView('history')}
            className="w-full bg-[#fffdf5] border-2 border-[#eaddcf] rounded-2xl p-4 flex items-center justify-between text-[#5c4d3c] shadow-[0_4px_0_0_#d6ccc2] active:shadow-none active:translate-y-1 transition-all group"
        >
            <div className="flex items-center gap-3">
                <div className="bg-[#e9c46a] p-2 rounded-xl text-white">
                    <Search size={20} />
                </div>
                <span className="font-bold text-lg">檔案查詢 History</span>
            </div>
            <div className="bg-[#f4f1ea] px-3 py-1 rounded-lg text-sm font-bold text-[#b0a695] group-hover:text-[#e76f51] transition-colors">
                {records.length} items
            </div>
        </button>

        {/* Invoice Paper Section - Keeps strict formal layout but wrapped in retro container */}
        <div className="bg-[#fffdf5] rounded-[1.5rem] shadow-xl border-4 border-[#fff] overflow-hidden relative">
            {/* Top decorative bar */}
            <div className="h-6 bg-[#e9c46a] w-full flex items-center justify-center gap-2">
                 <div className="w-2 h-2 rounded-full bg-white/50"></div>
                 <div className="w-2 h-2 rounded-full bg-white/50"></div>
                 <div className="w-2 h-2 rounded-full bg-white/50"></div>
            </div>

            <div className="p-1 md:p-6 invoice-font">
                 {/* Paper Texture Background */}
                 <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/paper.png')]"></div>

                {/* Invoice Header */}
                <div className="text-center mb-6 relative z-0">
                    <h2 className="text-2xl md:text-3xl font-bold text-[#264653] mb-2 tracking-widest border-b-2 border-[#264653] inline-block pb-1">
                        統一發票試算
                    </h2>
                    <div className="text-xs text-[#5c4d3c] tracking-wide mb-4 mt-1 font-sans font-bold">
                        INVOICE CALCULATION SHEET
                    </div>
                    
                    {/* Buyer Name Input - Styled */}
                    <div className="bg-[#f4f1ea] rounded-xl p-3 flex flex-col md:flex-row items-start md:items-center gap-2 mb-2">
                        <label className="text-sm font-bold text-[#e76f51] whitespace-nowrap px-2 bg-white rounded-md py-0.5">
                            買受人 (抬頭)
                        </label>
                        <input 
                            type="text"
                            value={buyerName}
                            onChange={(e) => setBuyerName(e.target.value)}
                            className="bg-transparent border-b-2 border-[#d6ccc2] px-2 py-1 text-[#264653] font-bold w-full focus:outline-none focus:border-[#2a9d8f] text-lg transition-colors placeholder-[#b0a695]"
                            placeholder="輸入公司名稱..."
                        />
                    </div>
                </div>

                {/* The Invoice Grid */}
                <div className="border-2 border-[#264653] bg-white relative z-0 rounded-lg overflow-hidden">
                    <div className="grid grid-cols-12 text-center text-sm font-bold bg-[#264653] text-[#fffdf5]">
                        <div className="col-span-1 py-2 border-r border-[#fffdf5]/30">刪</div>
                        <div className="col-span-4 py-2 border-r border-[#fffdf5]/30">品 名</div>
                        <div className="col-span-2 py-2 border-r border-[#fffdf5]/30">量</div>
                        <div className="col-span-2 py-2 border-r border-[#fffdf5]/30">單 價</div>
                        <div className="col-span-3 py-2">小 計</div>
                    </div>

                    {items.map((item, index) => {
                        const breakdown = calculateItemBreakdown(item.amount);
                        return (
                            <div key={item.id} className="grid grid-cols-12 text-sm border-b border-[#d6ccc2] min-h-[50px] hover:bg-[#fcfbf7] transition-colors">
                                <div className="col-span-1 border-r border-[#d6ccc2] flex items-center justify-center">
                                    <button onClick={() => removeItem(item.id)} className="text-[#e76f51] hover:bg-[#ffeadd] p-1 rounded">
                                        <Trash2 size={14} />
                                    </button>
                                </div>
                                <div className="col-span-4 border-r border-[#d6ccc2]">
                                    <input 
                                        type="text"
                                        value={item.name}
                                        onChange={(e) => handleItemChange(item.id, 'name', e.target.value)}
                                        className="w-full h-full p-2 bg-transparent outline-none text-[#264653] font-medium"
                                        placeholder="項目"
                                    />
                                </div>
                                <div className="col-span-2 border-r border-[#d6ccc2]">
                                    <input 
                                        type="number"
                                        value={item.quantity}
                                        onChange={(e) => handleItemChange(item.id, 'quantity', e.target.value)}
                                        className="w-full h-full p-2 bg-transparent outline-none text-center text-[#264653]"
                                        placeholder="0"
                                    />
                                </div>
                                <div className="col-span-2 border-r border-[#d6ccc2]">
                                    <input 
                                        type="number"
                                        value={item.unitPrice}
                                        onChange={(e) => handleItemChange(item.id, 'unitPrice', e.target.value)}
                                        className="w-full h-full p-2 bg-transparent outline-none text-right text-[#264653]"
                                        placeholder="0"
                                    />
                                </div>
                                <div className="col-span-3 relative flex flex-col justify-center bg-[#f4f1ea]/50">
                                    <input 
                                        type="number"
                                        value={item.amount}
                                        onChange={(e) => handleItemChange(item.id, 'amount', e.target.value)}
                                        className="w-full p-2 pb-0 bg-transparent outline-none text-right font-bold text-[#264653]"
                                        placeholder="0"
                                    />
                                    {breakdown.total > 0 && (
                                        <div className="text-[10px] text-right px-2 pb-1 text-[#5c4d3c]/70 font-mono font-bold whitespace-nowrap">
                                            未稅 {breakdown.net.toLocaleString()} | 稅 {breakdown.tax.toLocaleString()}
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                    
                    <div className="p-2 flex justify-center bg-[#f4f1ea]">
                        <button 
                            onClick={addItem}
                            className="text-[#2a9d8f] hover:text-[#21867a] text-sm font-bold flex items-center gap-1 bg-white px-3 py-1 rounded-full shadow-sm border border-[#d6ccc2]"
                        >
                            <Plus size={14} /> Add Item
                        </button>
                    </div>

                    {/* Totals Section */}
                    <div className="bg-[#264653] text-[#fffdf5]">
                        <div className="grid grid-cols-12 border-t border-[#fffdf5]/20">
                            <div className="col-span-8 p-2 text-right text-xs opacity-80 flex items-center justify-end">銷售額</div>
                            <div className="col-span-4 p-2 text-right font-mono font-bold">{totals.subtotal.toLocaleString()}</div>
                        </div>
                        <div className="grid grid-cols-12 border-t border-[#fffdf5]/20">
                            <div className="col-span-8 p-2 text-right text-xs opacity-80 flex items-center justify-end">稅額 ({taxRate}%)</div>
                            <div className="col-span-4 p-2 text-right font-mono font-bold">{totals.tax.toLocaleString()}</div>
                        </div>
                        <div className="grid grid-cols-12 border-t border-[#fffdf5]/20 bg-[#e76f51]">
                            <div className="col-span-8 p-3 text-right font-bold flex items-center justify-end">總計 TOTAL</div>
                            <div className="col-span-4 p-3 text-right font-mono text-xl font-black">{totals.grandTotal.toLocaleString()}</div>
                        </div>
                    </div>
                </div>

                {/* Chinese Amount - Retro Tag Style */}
                <div className="mt-4 bg-[#eaddcf] rounded-xl p-3 flex flex-wrap gap-2 items-center justify-center">
                     <span className="text-xs font-bold text-[#5c4d3c]">新台幣</span>
                     {chineseAmountParts.map((part, index) => (
                        <div key={index} className="flex items-baseline">
                            <span className="text-xl font-black text-[#264653]">{part.digit}</span>
                            <span className="text-xs text-[#5c4d3c] ml-0.5">{part.unit}</span>
                        </div>
                     ))}
                     <span className="text-xs text-[#5c4d3c]">整</span>
                </div>
            </div>
        </div>

      </main>

      <SettingsModal 
        isOpen={isSettingsOpen} 
        onClose={() => setIsSettingsOpen(false)}
        taxRate={taxRate}
        setTaxRate={setTaxRate}
      />
    </div>
  );
};

export default App;