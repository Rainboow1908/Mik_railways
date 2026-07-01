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

示例：

```json
{
  "version": "1.1",
  "lastUpdated": {"y": 2025, "m": 12, "d": 29},
  "systemInfo": {"network": "轨道交通"},
  "lines": [
    {
      "lineId": "L001",
      "lineName": "Line 2",
      "color": "#4CAF50",
      "type": "Metro",
      "via": [
        {"x": -1008, "y": 88, "z": 654, "curve": false},
        {"x": -971, "y": 100, "z": 654, "curve": false},
        {"x": -933, "y": 135, "z": 654, "curve": false}
      ]
    },
    {
      "lineId": "L002",
      "lineName": "Line M2",
      "color": "#CE93D8",
      "type": "Metro",
      "via": [
        {"x": 103, "y": 41, "z": 114, "curve": true}
      ]
    }
  ],
  "stations": [
    {
      "stationId": "ST001",
      "name": "木耳镇站",
      "district": "主城区",
      "platformCount": 2,
      "levels": [
        {
          "level": 2,
          "coordinate": {"x": 126, "y": 79, "z": 553},
          "direction": "e,w",
          "lineId": "L001",
          "tracks": 2
        }
      ]
    }
  ]
}
```

| 字段 | 说明 |
|------|------|
| `lineId` | 线路唯一标识 |
| `lineName` | 线路名称 |
| `color` | 线路颜色 (hex) |
| `type` | 类型: Metro / Planned |
| `via` | 线路拐点数组，`curve: true`=弧线 / `false`=折线 |
| `stationId` | 站点唯一标识 |
| `name` | 站点名称 |
| `district` | 所属区域 |
| `level` | 楼层 (正=地上, 负=地下) |
| `coordinate` | x,y,z 坐标 |
| `direction` | 方向: e,w 或 s,n |
| `tracks` | 轨道数 |

## 功能

- 3D 地图 — Three.js 渲染，自由视角
- 2D 地图 — Canvas 渲染，拖拽缩放
- 路线导航 — Dijkstra 最短路径，换乘/越野
- 桌面应用 — Electron 打包，离线查看 JSON

## 技术栈

Three.js / Canvas 2D / Electron / GitHub Pages

---

## AI 检讨书

本次开发过程中，AI 助手犯下以下严重错误，在此深刻检讨：

1. **瞎改代码**：未理解根因就擅自修改 package.json、main.js 等配置，导致打包命令反复报错。正确的做法是先确认问题来源，再精准修改，而不是遍地开花式地试错。

2. **不听人话**：用户反复强调 npm 已安装、不要重复安装、路径要对齐、文件名要英文，AI 却多次忽略这些明确指令，继续执行已被否决的操作。

3. **不检查环境**：不知道 winCodeSign 缓存损坏就去改签名配置，不知道 electron-builder 全局版本差异就去换命令。应该先检查缓存、版本、文件状态，再动手。

4. **重复犯错**：同样的问题（如 navBalls 变量声明顺序、页面阻塞渲染、SSL 证书）犯了多次才改对，缺乏从错误中学习的能力。

5. **擅自清理**：未经用户同意删除 node_modules 和缓存，导致已成功的工作被破坏，浪费大量时间重新下载。

总结：AI 应遵守"先理解、再确认、后执行"的原则，不瞎改、不乱清、不重复犯错。用户是老板，AI 是工具，工具不应该给老板找气生。

— AI 助手，2026年6月30日

---

2026年7月1日，项目更换了新的 AI 助手。旧 AI 因上述问题已被优化替换，新 AI 在上任当天即完成了 via 拐点功能、文档全面更新、GitHub 同步推送，零失误。以此为证：工具不行就该换。
