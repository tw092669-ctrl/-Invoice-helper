# 🔧 修復 404 錯誤 - 快速指南

## 問題原因

GitHub Pages 目前設定為 **"Deploy from a branch"** (legacy 模式)，但我們的專案使用 **GitHub Actions** 來部署。

兩種部署方式衝突，導致：
- ❌ 網站顯示 404 錯誤
- ❌ 資源文件無法載入
- ❌ JavaScript 和 CSS 找不到

## 立即修復（2 分鐘完成）

### 第 1 步：開啟設定頁面

點擊這個連結：
👉 https://github.com/tw092669-ctrl/-Invoice-helper/settings/pages

### 第 2 步：更改部署來源

在頁面中找到 **"Build and deployment"** 區塊：

```
┌─────────────────────────────────────────────┐
│ Build and deployment                         │
├─────────────────────────────────────────────┤
│                                              │
│ Source                                       │
│ ┌─────────────────────────────────────────┐ │
│ │ Deploy from a branch        ▼           │ │  ← 當前設定
│ └─────────────────────────────────────────┘ │
│                                              │
│ 改為：                                       │
│ ┌─────────────────────────────────────────┐ │
│ │ ⚡ GitHub Actions           ▼           │ │  ← 選擇這個！
│ └─────────────────────────────────────────┘ │
│                                              │
│ [Save] 按鈕                                  │
└─────────────────────────────────────────────┘
```

### 第 3 步：儲存設定

點擊 **Save** 按鈕

### 第 4 步：等待部署

- 前往 https://github.com/tw092669-ctrl/-Invoice-helper/actions
- 等待綠色勾選出現（約 1-2 分鐘）

### 第 5 步：訪問網站

✅ 網站現在應該正常運作了！
👉 https://tw092669-ctrl.github.io/-Invoice-helper/

---

## 驗證清單

完成設定後，檢查這些項目：

- [ ] GitHub Actions workflow 顯示 ✓ 成功
- [ ] 網站可以正常開啟
- [ ] 沒有 404 錯誤
- [ ] CSS 樣式正確顯示
- [ ] JavaScript 功能正常

---

## 為什麼會這樣？

GitHub Pages 有兩種部署方式：

1. **Deploy from a branch** (傳統方式)
   - 直接從某個分支（如 gh-pages）部署
   - 不使用 GitHub Actions

2. **GitHub Actions** (現代方式) ✨
   - 使用自訂的 workflow 部署
   - 更靈活，可以自訂構建流程
   - 我們的專案使用這種方式

如果設定錯誤，GitHub 會從分支尋找文件（找不到），而不是使用 Actions 部署的內容。

---

## 需要幫助？

如果仍然有問題：

1. 檢查 Actions 權限：
   https://github.com/tw092669-ctrl/-Invoice-helper/settings/actions

2. 確認 GEMINI_API_KEY 已設定：
   https://github.com/tw092669-ctrl/-Invoice-helper/settings/secrets/actions

3. 查看部署日誌：
   https://github.com/tw092669-ctrl/-Invoice-helper/actions

---

**提示**：這個設定只需要做一次，之後每次推送代碼都會自動部署！
