export interface InvoiceItem {
  id: string;
  name: string;
  quantity: number | string;
  unitPrice: number | string;
  amount: number | string;
}

export interface InvoiceData {
  items: InvoiceItem[];
  subtotal: number;
  tax: number;
  grandTotal: number;
  taxRate: number;
}

export interface InvoiceRecord {
  id: string;
  timestamp: number; // Unix timestamp
  dateStr: string; // YYYY-MM-DD
  items: InvoiceItem[];
  subtotal: number;
  tax: number;
  grandTotal: number;
  photoBase64?: string; // Optional image of the physical invoice
  buyerName?: string; // 買受人抬頭
  invoiceType?: 'duplicate' | 'triplicate'; // 二聯式 or 三聯式
}