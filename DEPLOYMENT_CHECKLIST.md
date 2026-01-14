# 部署前檢查清單

## ✅ 已完成項目

### 1. Vite 配置
- ✅ 設定 `base: '/-Invoice-helper/'` 用於 GitHub Pages
- ✅ 配置構建輸出目錄為 `dist`
- ✅ 設定代碼分割優化 (React、Lucide)
- ✅ 配置環境變數處理 (GEMINI_API_KEY)

### 2. Tailwind CSS 配置
- ✅ 安裝 Tailwind CSS v3.x
- ✅ 安裝 PostCSS 和 Autoprefixer
- ✅ 創建 `tailwind.config.js`
- ✅ 創建 `postcss.config.js`
- ✅ 創建 `src/index.css` 並引入 Tailwind 指令
- ✅ 在 `index.tsx` 中引入 CSS 文件
- ✅ 移除 HTML 中的 Tailwind CDN

### 3. 文件配置
- ✅ 更新 `.gitignore` (包含 .env 文件)
- ✅ 更新 `README.md` (繁體中文，完整說明)
- ✅ 創建 `.env.example` 範例文件

### 4. GitHub Pages 部署
- ✅ 創建 `.github/workflows/deploy.yml`
- ✅ 配置自動部署流程
- ✅ 設定正確的權限和環境

### 5. HTML 和資源配置
- ✅ HTML 中已移除 Tailwind CDN
- ✅ HTML 中正確引入 script 標籤 (`/index.tsx`)
- ✅ 構建後的 HTML 自動包含正確的資源路徑
- ✅ Import map 正確配置 ESM 依賴

### 6. 構建測試
- ✅ 成功執行 `npm run build`
- ✅ 生成的文件包含正確的基礎路徑
- ✅ CSS 文件正確生成並優化

## 📋 GitHub Pages 設定步驟

### 必須在 GitHub 儲存庫中完成：

1. **啟用 GitHub Pages**
   - 前往儲存庫 Settings → Pages
   - Source: 選擇 "GitHub Actions"

2. **設定 Secrets**
   - 前往 Settings → Secrets and variables → Actions
   - 新增 Repository secret:
     - Name: `GEMINI_API_KEY`
     - Value: 您的 Gemini API 金鑰

3. **推送代碼觸發部署**
   ```bash
   git add .
   git commit -m "Configure for GitHub Pages deployment"
   git push origin main
   ```

4. **檢查部署狀態**
   - 前往 Actions 標籤查看 workflow 執行狀態
   - 部署完成後，訪問: https://tw092669-ctrl.github.io/-Invoice-helper/

## 📁 專案結構

```
-Invoice-helper/
├── .github/
│   └── workflows/
│       └── deploy.yml          # GitHub Actions 部署配置
├── components/                  # React 組件
│   ├── CameraScanner.tsx
│   ├── HistoryModal.tsx
│   └── SettingsModal.tsx
├── services/                    # 服務層
│   └── geminiService.ts
├── utils/                       # 工具函數
│   └── numberToChinese.ts
├── src/                         # 樣式文件
│   └── index.css               # Tailwind CSS 入口
├── dist/                        # 構建輸出 (自動生成)
├── .env.example                 # 環境變數範例
├── .gitignore                   # Git 忽略文件
├── App.tsx                      # 主應用組件
├── index.html                   # HTML 模板
├── index.tsx                    # 應用入口
├── package.json                 # 依賴管理
├── postcss.config.js            # PostCSS 配置
├── tailwind.config.js           # Tailwind CSS 配置
├── tsconfig.json                # TypeScript 配置
├── types.ts                     # 類型定義
└── vite.config.ts              # Vite 配置
```

## 🚀 本地開發

```bash
# 安裝依賴
npm install

# 創建 .env.local 文件並設定 API 金鑰
echo "GEMINI_API_KEY=your_api_key" > .env.local

# 啟動開發伺服器
npm run dev

# 構建生產版本
npm run build

# 預覽生產版本
npm run preview
```

## 🔍 部署驗證

部署完成後，請驗證：
- [ ] 頁面能正常載入
- [ ] CSS 樣式正確顯示
- [ ] JavaScript 正常執行
- [ ] API 呼叫正常運作
- [ ] 相機功能正常 (需 HTTPS)
- [ ] 歷史記錄功能正常

## ⚠️ 注意事項

1. **API 金鑰安全**
   - 永遠不要將 `.env.local` 提交到 Git
   - 使用 GitHub Secrets 管理敏感資訊

2. **HTTPS 要求**
   - GitHub Pages 自動提供 HTTPS
   - 相機 API 需要 HTTPS 環境

3. **瀏覽器兼容性**
   - 確保目標瀏覽器支援 ESM 和 Import Maps
   - 建議使用現代瀏覽器（Chrome 89+, Firefox 108+, Safari 16.4+）

4. **持續部署**
   - 每次推送到 main 分支會自動觸發部署
   - 可在 Actions 標籤查看部署日誌

## 📊 構建輸出分析

最新構建結果：
```
dist/index.html                    0.98 kB │ gzip:   0.50 kB
dist/assets/index-BOxO3ExH.css    27.62 kB │ gzip:   5.40 kB
dist/assets/lucide-CHeJkr9b.js    10.01 kB │ gzip:   2.53 kB
dist/assets/react-vendor-*.js     11.79 kB │ gzip:   4.21 kB
dist/assets/index-*.js           466.44 kB │ gzip: 116.48 kB
```

總大小（gzipped）: ~129 kB

---

🎉 所有配置已完成，準備好部署到 GitHub Pages！
