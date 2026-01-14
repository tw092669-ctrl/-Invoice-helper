# Vite Public 資料夾說明

## ⚠️ 重要提醒

本專案已將 Vite 的 `public` 資料夾功能**停用**。

## 為什麼停用？

Vite 預設會將 `public` 資料夾的內容直接複製到 `dist` 目錄。如果 `public` 中有 `index.html`，它會覆蓋 Vite 構建生成的 `index.html`，導致應用無法正常運作。

## 當前配置

在 `vite.config.ts` 中設定：

```typescript
export default defineConfig({
  publicDir: false, // 禁用 public 目錄
  // ... 其他配置
});
```

## 如果需要靜態資源？

### 方案 1: 使用 assets 資料夾（推薦）

將靜態資源放在 `src/assets/` 或直接在組件中 import：

```typescript
import logo from './assets/logo.png'

function App() {
  return <img src={logo} alt="Logo" />
}
```

### 方案 2: 啟用 public 並使用子資料夾

如果確實需要 public 資料夾，可以：

1. 修改 `vite.config.ts`：
```typescript
publicDir: 'public', // 或指定其他名稱
```

2. **絕對不要**在 public 資料夾放置：
   - `index.html`
   - 任何會與構建輸出衝突的文件

3. 在 public 中只放置：
   - `favicon.ico`
   - `robots.txt`
   - `manifest.json`
   - 其他真正需要在根目錄的靜態文件

## 目錄結構建議

```
-Invoice-helper/
├── src/
│   ├── assets/          ← 圖片、字體等資源放這裡
│   │   ├── images/
│   │   └── fonts/
│   └── index.css
├── index.html           ← Vite 的 HTML 模板（根目錄）
└── vite.config.ts
```

## 參考資料

- [Vite Static Assets](https://vitejs.dev/guide/assets.html)
- [Vite Public Directory](https://vitejs.dev/guide/assets.html#the-public-directory)
