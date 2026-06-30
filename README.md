# MCRMS-Minecraft Railway Manage System 0.2.0

Minecraft 轨道交通可视化项目，支持 3D 和 2D 两种地图模式。

## 功能

- **3D 地图** — Three.js 渲染，自由旋转/缩放/平移，支持站点方框、管道线路、CSS 标签
- **2D 地图** — Canvas 渲染，拖拽平移、滚轮缩放、坐标网格
- **路线导航** — Dijkstra 最短路径，支持换乘和越野步行模式
- **数据驱动** — 站点、线路、层级信息由 `railway_data.json` 统一管理

## 文件结构

```
page/
├── index.html           # 3D 地图主页面
├── map2d.html           # 2D 地图页面
├── railway_data.json    # 轨道交通数据
├── 地图1.png ~ 地图4.png # 地板背景图
└── README.md            # 数据格式说明
```

## 使用

```bash
cd page
python -m http.server 8080
```

浏览器打开 `http://localhost:8080`

## 数据格式

详见 `page/README.md`
