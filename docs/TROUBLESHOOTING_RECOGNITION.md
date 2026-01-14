# 🔧 辨識功能故障排除指南

## 問題：辨識功能無法正常工作

如果您遇到辨識功能無法正常工作的問題，請按照以下步驟診斷和解決。

---

## 📋 快速檢查清單

在開始排查之前，請確認：

- [ ] 已設定 Gemini API Key
- [ ] 網路連線正常
- [ ] 使用 HTTPS 連線
- [ ] 瀏覽器控制台沒有錯誤

---

## 🔑 步驟 1：設定 API Key

### 如何取得 Gemini API Key

1. 前往 Google AI Studio：
   👉 https://aistudio.google.com/apikey

2. 使用 Google 帳號登入

3. 點擊 **"Create API Key"** 或 **"Get API Key"**

4. 選擇或創建一個 Google Cloud 專案

5. 複製生成的 API Key（格式：`AIzaSy...`）

### 如何在應用程式中設定

1. 開啟發票稅務快算應用程式
2. 點擊右上角的 **⚙️ 齒輪圖示**（設定）
3. 在「Gemini API Key」欄位貼上您的 API Key
4. 點擊 **儲存設定**

> ⚠️ **重要**：確保 API Key 沒有多餘的空格或換行符號

---

## 🐛 步驟 2：檢查瀏覽器控制台

### 如何開啟開發者工具

**桌面版：**
- Windows/Linux: 按 `F12` 或 `Ctrl + Shift + I`
- macOS: 按 `Cmd + Option + I`

**手機版：**
- iOS Safari: 需要連接電腦使用 Safari 開發者工具
- Android Chrome: 使用桌面版 Chrome 的遠端調試

### 查看 Console 標籤

1. 開啟開發者工具
2. 點擊 **Console** 標籤
3. 尋找紅色的錯誤訊息
4. 查看下方的「常見錯誤」章節

---

## 🚨 常見錯誤及解決方案

### 錯誤 1：「未設定 API Key」

**錯誤訊息：**
```
未設定 API Key。請至設定選單輸入您的 Gemini API Key。
```

**解決方案：**
- 按照上方「步驟 1」設定 API Key
- 確認已點擊「儲存設定」
- 重新整理頁面後再試

---

### 錯誤 2：「API Key 無效」

**錯誤訊息：**
```
API Key 無效或未設定
API key not valid
```

**可能原因：**
1. API Key 複製錯誤（有空格或不完整）
2. API Key 已被撤銷
3. API Key 權限不足

**解決方案：**
1. 重新複製 API Key，確保完整且無空格
2. 前往 Google AI Studio 檢查 API Key 狀態
3. 如果已撤銷，創建新的 API Key
4. 確認 API Key 有權限訪問 Gemini API

---

### 錯誤 3：「模型不存在」

**錯誤訊息：**
```
模型不存在
Model not found
404 Not Found
```

**可能原因：**
1. API Key 沒有 Gemini 2.0 Flash 的訪問權限
2. 模型名稱錯誤

**解決方案：**
1. 確認您的 Google 帳號可以訪問 Gemini API
2. 前往 https://aistudio.google.com 確認模型可用性
3. 如果問題持續，請在 GitHub 回報 Issue

---

### 錯誤 4：「API 配額已用完」

**錯誤訊息：**
```
API 配額已用完
Quota exceeded
429 Too Many Requests
Resource has been exhausted
```

**原因：**
- 已達到 API 的免費配額限制
- 請求頻率過高

**解決方案：**
1. **等待配額重置**（通常每天或每月重置）
2. **升級 API 方案**：
   - 前往 Google Cloud Console
   - 啟用計費帳號
   - 升級到付費方案
3. **減少請求頻率**：
   - 避免連續多次掃描
   - 先手動輸入簡單的發票

**查看配額狀態：**
- Google Cloud Console → APIs & Services → Dashboard
- 查看 Gemini API 的使用量

---

### 錯誤 5：「網路連線失敗」

**錯誤訊息：**
```
網路連線失敗
Failed to fetch
Network error
CORS error
```

**可能原因：**
1. 網路不穩定或中斷
2. 防火牆阻擋
3. 瀏覽器擴充套件干擾（如廣告攔截器）

**解決方案：**
1. 檢查網路連線
2. 嘗試重新整理頁面
3. 暫時停用瀏覽器擴充套件
4. 嘗試使用其他網路（如切換 Wi-Fi / 行動網路）
5. 檢查防火牆設定

---

### 錯誤 6：「圖片太大」

**錯誤訊息：**
```
Image too large
Payload too large
413 Request Entity Too Large
```

**原因：**
- 拍攝的照片解析度過高
- 圖片檔案大小超過限制

**解決方案：**
1. 使用較低解析度拍照
2. 確保照片清晰但不過大
3. 如果從相簿上傳，先壓縮照片
4. 建議照片大小：< 4MB

---

## 🔍 進階診斷

### 檢查 API 請求詳情

在瀏覽器控制台中，您會看到詳細的請求日誌：

```
🔑 API Key found, initializing Gemini...
📤 Sending request to Gemini API...
✅ Response received from Gemini API
📋 Parsed data: {...}
✅ Extracted 3 items successfully
```

如果看到 `❌` 錯誤圖示，表示請求失敗，請查看後續的錯誤訊息。

### 測試 API Key 是否有效

您可以在瀏覽器控制台執行以下測試：

```javascript
// 測試 API Key
const apiKey = localStorage.getItem('gemini_api_key');
console.log('API Key:', apiKey ? '✅ 已設定' : '❌ 未設定');
console.log('Key 長度:', apiKey?.length);
console.log('Key 開頭:', apiKey?.substring(0, 10));
```

---

## 💡 最佳實踐

### 拍攝發票的技巧

1. **光線充足**：在明亮環境下拍攝
2. **對準框線**：將發票完整放入黃色框線內
3. **保持穩定**：避免手震導致模糊
4. **正面拍攝**：盡量垂直於發票
5. **避免反光**：調整角度避免反光遮蔽文字

### 提高辨識率

- ✅ 使用清晰、完整的發票照片
- ✅ 確保發票上的文字清晰可讀
- ✅ 避免發票有折痕或污損
- ✅ 使用後置鏡頭拍攝（通常畫質較好）
- ❌ 不要使用過度壓縮的照片
- ❌ 避免截圖或多次轉檔的照片

---

## 🆘 仍然無法解決？

如果以上方法都無法解決您的問題：

### 1. 收集錯誤資訊

在瀏覽器控制台中：
1. 右鍵點擊錯誤訊息
2. 選擇「Copy」或「Save as...」
3. 保存完整的錯誤堆疊

### 2. 提供以下資訊

- 使用的瀏覽器和版本
- 作業系統
- 完整的錯誤訊息
- 錯誤發生的步驟

### 3. 回報 Issue

前往 GitHub 專案頁面回報問題：
👉 https://github.com/tw092669-ctrl/-Invoice-helper/issues

請在 Issue 中包含：
- 問題描述
- 重現步驟
- 錯誤訊息截圖
- 瀏覽器控制台日誌

---

## 🔄 替代方案

如果辨識功能暫時無法使用，您可以：

### 方案 1：手動輸入

直接在主畫面輸入發票資料：
1. 品名
2. 數量
3. 單價
4. 金額

系統會自動計算稅額。

### 方案 2：使用歷史記錄

如果之前有成功辨識的記錄：
1. 點擊左上角 **📊 歷史記錄**
2. 查看之前的發票資料
3. 參考格式手動輸入新發票

---

## 📚 相關文件

- [README](../README.md)
- [相機權限設定指南](CAMERA_PERMISSION_GUIDE.md)
- [GitHub Pages 設定](FIX_404_ERROR.md)

---

## 📞 技術支援

- **GitHub Issues**: https://github.com/tw092669-ctrl/-Invoice-helper/issues
- **Google AI Studio**: https://aistudio.google.com
- **Gemini API 文件**: https://ai.google.dev/docs

---

**更新日期**：2026-01-14
