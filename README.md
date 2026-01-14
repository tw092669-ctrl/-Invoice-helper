<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# 發票稅務快算

一個快速計算發票稅務的工具，支援相機掃描和智能辨識。

🔗 **線上體驗**: [https://tw092669-ctrl.github.io/-Invoice-helper/](https://tw092669-ctrl.github.io/-Invoice-helper/)

## 功能特點

- 📸 相機掃描發票
- 🤖 AI 智能辨識
- 💰 自動計算稅額
- 📊 歷史記錄管理
- 🎨 復古風格介面

## 技術棧

- **前端框架**: React 19 + TypeScript
- **構建工具**: Vite 6
- **樣式**: Tailwind CSS
- **AI**: Google Gemini API
- **圖標**: Lucide React

## 本地開發

**前置需求**: Node.js 18+

1. 安裝依賴:
   ```bash
   npm install
   ```

2. 設定環境變數:
   在專案根目錄建立 `.env.local` 文件並設定 Gemini API 金鑰:
   ```
   GEMINI_API_KEY=your_api_key_here
   ```

3. 啟動開發伺服器:
   ```bash
   npm run dev
   ```

4. 在瀏覽器開啟: http://localhost:3000

## 打包部署

### 構建生產版本
```bash
npm run build
```

### 預覽生產版本
```bash
npm run preview
```

### 部署到 GitHub Pages

專案已配置 GitHub Actions 自動部署。每次推送到 `main` 分支時，會自動構建並部署到 GitHub Pages。

**手動部署步驟**:
1. 確保在 GitHub 儲存庫設定中啟用了 GitHub Pages
2. 設定 GitHub Actions 環境變數 `GEMINI_API_KEY`
3. 推送代碼到 `main` 分支

## 專案結構

```
-Invoice-helper/
├── components/          # React 組件
│   ├── CameraScanner.tsx
│   ├── HistoryModal.tsx
│   └── SettingsModal.tsx
├── services/           # 服務層
│   └── geminiService.ts
├── utils/              # 工具函數
│   └── numberToChinese.ts
├── src/                # 樣式文件
│   └── index.css
├── App.tsx             # 主應用組件
├── index.tsx           # 入口文件
├── types.ts            # TypeScript 類型定義
└── vite.config.ts      # Vite 配置
```

## 環境變數

| 變數名 | 說明 | 必填 |
|--------|------|------|
| `GEMINI_API_KEY` | Google Gemini API 金鑰 | 是 |

## 授權

MIT License

---

由 AI Studio 生成並優化
