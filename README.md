# Mik Railways

Minecraft 轨道交通可视化工具，支持 3D / 2D 双模式地图。

## 快速开始

### 浏览器

```bash
cd page
python -m http.server 8080
# 打开 http://localhost:8080
```

### 桌面应用

```bash
npm install
npx electron .
```

启动后通过 **文件 → 打开 JSON** 选择数据文件。

## 数据格式

站点和线路数据由 `railway_data.json` 定义，格式见 `page/README.md`。

## 功能

- 3D 地图 — Three.js 渲染，自由视角
- 2D 地图 — Canvas 渲染，拖拽缩放
- 路线导航 — Dijkstra 最短路径，换乘/越野
- 桌面应用 — Electron 打包，离线查看 JSON

## 技术栈

Three.js / Canvas 2D / Electron / GitHub Pages
