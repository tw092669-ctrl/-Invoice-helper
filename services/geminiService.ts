import { GoogleGenAI, Type } from "@google/genai";
import { InvoiceItem } from "../types";

export interface ExtractedData {
    items: InvoiceItem[];
    buyerName: string;
    date?: string;
    grandTotal?: number;
}

export const extractInvoiceData = async (
  base64Image: string
): Promise<ExtractedData> => {
  try {
    // Try to get key from storage first, then env
    const storageKey = localStorage.getItem("gemini_api_key");
    const apiKey = storageKey || process.env.API_KEY;

    if (!apiKey) {
      throw new Error("未設定 API Key。請至設定選單輸入您的 Gemini API Key。");
    }

    const ai = new GoogleGenAI({ apiKey: apiKey });
    
    // Schema for structured output
    const responseSchema = {
      type: Type.OBJECT,
      properties: {
          items: {
            type: Type.ARRAY,
            items: {
                type: Type.OBJECT,
                properties: {
                description: { type: Type.STRING, description: "Product name or description" },
                quantity: { type: Type.NUMBER, description: "Quantity of items" },
                unitPrice: { type: Type.NUMBER, description: "Unit price per item" },
                amount: { type: Type.NUMBER, description: "Total amount for this line item" }
                },
                required: ["description", "amount"],
            },
          },
          buyerName: { type: Type.STRING, description: "The name of the buyer (Title/抬頭) found on the invoice. Return empty string if not found." },
          date: { type: Type.STRING, description: "The date of the invoice in YYYY-MM-DD format. Convert ROC year (e.g. 114) to AD year (e.g. 2025)." },
          grandTotal: { type: Type.NUMBER, description: "The final total amount (總計) written on the invoice." }
      },
      required: ["items"]
    };

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-image",
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: "image/jpeg",
              data: base64Image,
            },
          },
          {
            text: "Extract all invoice data. 1. Line items (name, qty, price, amount). 2. Buyer Name (Title). 3. Date (convert to YYYY-MM-DD). 4. Grand Total. Return strictly JSON.",
          },
        ],
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: responseSchema,
      },
    });

    const text = response.text;
    if (!text) return { items: [], buyerName: '' };

    const rawData = JSON.parse(text);
    const rawItems = rawData.items || [];
    const buyerName = rawData.buyerName || "";
    const date = rawData.date;
    const grandTotal = rawData.grandTotal;
    
    // Map to our internal format with IDs
    const items = rawItems.map((item: any) => ({
      id: crypto.randomUUID(),
      name: item.description || "",
      quantity: item.quantity || "",
      unitPrice: item.unitPrice || "",
      amount: item.amount || 0
    }));

    return { items, buyerName, date, grandTotal };

  } catch (error: any) {
    console.error("Gemini Extraction Error:", error);
    // Pass the specific error message if it's about the API key
    if (error.message.includes("API Key")) {
        throw error;
    }
    throw new Error("無法辨識發票內容，請重試或手動輸入。");
  }
};