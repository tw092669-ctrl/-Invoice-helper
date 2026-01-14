# 快速部署指南

## 一鍵部署到 GitHub Pages

### 前置需求檢查
```bash
# 檢查 Node.js 版本 (需要 18+)
node --version

# 檢查 npm 版本
npm --version

# 檢查 git 配置
git status
```

### 部署步驟

#### 1. 設定 GitHub Repository (只需執行一次)
```bash
# 如果還沒有遠端儲存庫，執行：
git remote add origin https://github.com/tw092669-ctrl/-Invoice-helper.git

# 確認遠端儲存庫
git remote -v
```

#### 2. 在 GitHub 設定 Secrets
1. 前往 https://github.com/tw092669-ctrl/-Invoice-helper/settings/secrets/actions
2. 點擊 "New repository secret"
3. Name: `GEMINI_API_KEY`
4. Value: 填入您的 Gemini API 金鑰
5. 點擊 "Add secret"

#### 3. 啟用 GitHub Pages
1. 前往 https://github.com/tw092669-ctrl/-Invoice-helper/settings/pages
2. Source: 選擇 "GitHub Actions"
3. 儲存設定

#### 4. 推送代碼觸發部署
```bash
# 查看變更
git status

# 加入所有變更
git add .

# 提交變更
git commit -m "Configure Tailwind CSS and GitHub Pages deployment"

# 推送到 GitHub
git push origin main
```

#### 5. 監控部署進度
```bash
# 在瀏覽器開啟 Actions 頁面
echo "部署進度: https://github.com/tw092669-ctrl/-Invoice-helper/actions"

# 或使用 GitHub CLI (如果已安裝)
gh run list
gh run watch
```

#### 6. 訪問部署的網站
```bash
echo "網站地址: https://tw092669-ctrl.github.io/-Invoice-helper/"
```

## 常用命令

### 本地開發
```bash
# 安裝依賴
npm install

# 啟動開發伺服器 (http://localhost:3000)
npm run dev

# 構建生產版本
npm run build

# 預覽生產版本
npm run preview
```

### Git 操作
```bash
# 查看狀態
git status

# 查看變更
git diff

# 撤銷變更
git checkout -- <file>

# 更新遠端代碼
git pull origin main

# 查看提交歷史
git log --oneline -10
```

### 故障排除
```bash
# 清理構建快取
rm -rf dist node_modules package-lock.json
npm install
npm run build

# 檢查 Tailwind 配置
npx tailwindcss --help

# 驗證 PostCSS 配置
cat postcss.config.js

# 檢查環境變數
cat .env.local
```

## 部署檢查清單

在推送代碼前，確保：
- [x] `.env.local` 不在版本控制中
- [x] `vite.config.ts` 中設定了正確的 `base` 路徑
- [x] GitHub Secrets 中設定了 `GEMINI_API_KEY`
- [x] GitHub Pages 已啟用
- [x] 本地構建成功 (`npm run build`)

## 預期結果

部署成功後，您將看到：
- ✅ GitHub Actions workflow 顯示綠色勾選
- ✅ 網站可在 https://tw092669-ctrl.github.io/-Invoice-helper/ 訪問
- ✅ 所有功能正常運作
- ✅ CSS 樣式正確顯示

## 部署時間

- 構建時間: ~5-10 秒
- 部署時間: ~30-60 秒
- 總時間: ~1-2 分鐘

---

📝 **提示**: 每次推送到 `main` 分支都會自動觸發部署！
