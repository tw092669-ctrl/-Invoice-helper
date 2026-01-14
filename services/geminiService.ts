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

    console.log("🔑 API Key found, initializing Gemini...");
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

    console.log("📤 Sending request to Gemini API...");
    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash-exp",
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: "image/jpeg",
              data: base64Image,
            },
          },
          {
            text: "Extract all invoice data from this image. 1. Line items (name, qty, price, amount). 2. Buyer Name (Title/抬頭). 3. Date (convert ROC year to YYYY-MM-DD). 4. Grand Total. Return JSON only.",
          },
        ],
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: responseSchema,
      },
    });

    console.log("✅ Response received from Gemini API");
    const text = response.text;
    if (!text) {
      console.warn("⚠️ Empty response from Gemini");
      return { items: [], buyerName: '' };
    }

    const rawData = JSON.parse(text);
    console.log("📋 Parsed data:", rawData);
    
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

    console.log(`✅ Extracted ${items.length} items successfully`);
    return { items, buyerName, date, grandTotal };

  } catch (error: any) {
    console.error("❌ Gemini Extraction Error:", error);
    console.error("Error details:", {
      message: error.message,
      status: error.status,
      statusText: error.statusText
    });
    
    // Provide specific error messages
    if (error.message.includes("API Key") || error.message.includes("API key")) {
      throw new Error("API Key 無效或未設定。請到設定中輸入正確的 Gemini API Key。");
    }
    
    if (error.status === 404 || error.message.includes("not found")) {
      throw new Error("模型不存在。請確認您的 API Key 有權限使用 Gemini API。");
    }
    
    if (error.status === 429 || error.message.includes("quota") || error.message.includes("limit")) {
      throw new Error("API 配額已用完。請稍後再試或升級您的 API 方案。");
    }
    
    if (error.message.includes("network") || error.message.includes("fetch")) {
      throw new Error("網路連線失敗。請檢查您的網路連線。");
    }
    
    throw new Error(`辨識失敗：${error.message || "未知錯誤"}。請重試或手動輸入。`);
  }
};