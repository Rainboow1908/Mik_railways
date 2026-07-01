# 铁路站点数据格式说明文档

## 1. 概述

本 JSON 结构用于描述城市轨道交通系统中的**车站、线路及轨道层级**信息。设计目标是：

- **可读性强**：字段命名清晰，专有名词（站名、区名、线路描述）保留中文原文。
- **易于扩展**：支持随时新增站点、线路或层级，无需改动现有数据。
- **便于程序处理**：所有日期、坐标均采用标准化对象格式，方向使用简写枚举。

---

## 2. 顶层结构

```json
{
  "version": "1.1",
  "lastUpdated": {"y": 2025, "m": 12, "d": 29},
  "systemInfo": { "network": "轨道交通" },
  "lines": [ ... ],
  "stations": [ ... ]
}
```

| 字段 | 类型 | 说明 |
|------|------|------|
| `version` | 字符串 | 数据格式版本号，便于兼容性管理 |
| `lastUpdated` | 日期对象 | 数据最后更新时间，格式见下文 **日期对象** |
| `systemInfo` | 对象 | 系统级信息，当前仅包含线网名称 `network` |
| `lines` | 数组 | 所有线路的集合，每个元素为一个线路对象 |
| `stations` | 数组 | 所有车站的集合，每个元素为一个车站对象 |

---

## 3. 日期对象

所有日期字段（如 `lastUpdated`、`openingDate`）均采用以下紧凑格式：

```json
{ "y": 2025, "m": 12, "d": 29 }
```

| 键 | 含义 | 取值范围 |
|----|------|----------|
| `y` | 年份 | 整数，如 2025 |
| `m` | 月份 | 1–12 |
| `d` | 日 | 1–31 |

该格式与坐标对象（`{ "x": ..., "y": ..., "z": ... }`）风格一致，便于统一解析。

---

## 4. 线路对象（`lines` 数组元素）

```json
{
  "lineId": "L001",
  "lineName": "Line XBRM1",
  "description": "x轴边界轨道线",
  "color": "#D32F2F",
  "type": "Metro"
}
```

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `lineId` | 字符串 | ✅ | 线路唯一标识，建议使用 `L` + 数字，如 `L001` |
| `lineName` | 字符串 | ✅ | 线路名称（可含英文代号） |
| `description` | 字符串 | ❌ | 线路补充描述（中文） |
| `color` | 字符串 | ❌ | 线路代表色（十六进制），用于地图可视化 |
| `type` | 字符串 | ❌ | 线路类型，如 `"Metro"`、`"Planned"`、`"Light Rail"` 等 |

---

## 5. 车站对象（`stations` 数组元素）

```json
{
  "stationId": "ST001",
  "name": "木耳镇站",
  "district": "主城区",
  "openingDate": {"y": 2025, "m": 12, "d": 29},
  "platformCount": 2,
  "levels": [ ... ]
}
```

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `stationId` | 字符串 | ✅ | 车站唯一标识，建议 `ST` + 数字 |
| `name` | 字符串 | ✅ | 车站正式名称（中文） |
| `district` | 字符串 | ❌ | 所属行政区（中文），如“主城区”、“未命名区” |
| `openingDate` | 日期对象或 `null` | ❌ | 投用日期，若未开通可设为 `null` |
| `platformCount` | 整数 | ❌ | 站台数量（不区分上下行） |
| `levels` | 数组 | ✅ | 该车站包含的所有轨道层级，每个元素为一个层级对象 |

---

## 6. 层级对象（`levels` 数组元素）

```json
{
  "level": 2,
  "coordinate": {"x": 126, "y": 79, "z": 553},
  "direction": "e,w",
  "lineId": "L001",
  "tracks": 2
}
```

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `level` | 整数 | ✅ | 所在层数（正数表示地面以上，负数表示地下，如 -1 为地下一层） |
| `coordinate` | 坐标对象 | ✅ | 该层轨道中心点三维坐标，格式 `{ "x": 数值, "y": 数值, "z": 数值 }` |
| `direction` | 字符串 | ✅ | 轨道走向，使用 `"e,w"`（东西向）或 `"s,n"`（南北向），以逗号分隔两个方向端点 |
| `lineId` | 字符串 | ✅ | 所属线路的 `lineId`，必须已在 `lines` 中定义 |
| `tracks` | 整数 | ✅ | 该层轨道数量（此处固定为 2，表示双向复线） |

---

## 7. 扩展示例：如何新增站点

若需添加新车站，只需在 `stations` 数组末尾追加一个对象，并引用已有线路 ID。例如新增“人民广场站”：

```json
{
  "stationId": "ST003",
  "name": "人民广场站",
  "district": "主城区",
  "openingDate": {"y": 2026, "m": 1, "d": 15},
  "platformCount": 3,
  "levels": [
    {
      "level": 0,
      "coordinate": {"x": 0, "y": 50, "z": 200},
      "direction": "e,w",
      "lineId": "L001",
      "tracks": 2
    }
  ]
}
```

---

## 8. 如何新增线路

在 `lines` 数组末尾添加新线路对象，并为其分配新的 `lineId`，之后即可在站点层级中引用。

```json
{
  "lineId": "L003",
  "lineName": "环线",
  "description": "城市环形轨道",
  "color": "#FFA500",
  "type": "Metro"
}
```

---

## 9. 数据校验建议（可选）

- `lineId` 和 `stationId` 应全局唯一。
- 每个 `levels` 中的 `lineId` 必须存在于 `lines` 中。
- `direction` 仅允许 `"e,w"` 或 `"s,n"`（可扩展为其他组合，如 `"ne,sw"`，但需保持两字母加逗号格式）。
- 坐标值可为任意整数或浮点数，无单位限制。

---

## 10. 版本历史

| 版本 | 日期 | 变更说明 |
|------|------|----------|
| 1.1 | 2026-06-29 | 日期改为对象格式，移除 `city`、`status`、`electrified`、`speedLimit`，增加 `tracks`，方向简写为 `e,w` / `s,n` |

---

## 11. 整体示例

```json
{
  "version": "1.1",
  "lastUpdated": {"y": 2025, "m": 12, "d": 29},
  "systemInfo": {
    "network": "轨道交通"
  },
  "lines": [
    {
      "lineId": "L001",
      "lineName": "Line XBRM1",
      "description": "x轴边界轨道线",
      "color": "#D32F2F",
      "type": "Metro"
    },
    {
      "lineId": "L002",
      "lineName": "Line 404NOTFOUND",
      "description": "未命名线路",
      "color": "#388E3C",
      "type": "Planned"
    }
  ],
  "stations": [
    {
      "stationId": "ST001",
      "name": "木耳镇站",
      "district": "主城区",
      "openingDate": {"y": 2025, "m": 12, "d": 29},
      "platformCount": 2,
      "levels": [
        {
          "level": 2,
          "coordinate": {"x": 126, "y": 79, "z": 553},
          "direction": "e,w",
          "lineId": "L001",
          "tracks": 2
        },
        {
          "level": -1,
          "coordinate": {"x": 111, "y": 41, "z": 530},
          "direction": "s,n",
          "lineId": "L002",
          "tracks": 2
        }
      ]
    },
    {
      "stationId": "ST002",
      "name": "未命名站",
      "district": "未命名区",
      "openingDate": {"y": 2025, "m": 12, "d": 29},
      "platformCount": 1,
      "levels": [
        {
          "level": 1,
          "coordinate": {"x": -232, "y": 106, "z": 553},
          "direction": "e,w",
          "lineId": "L001",
          "tracks": 2
        }
      ]
    }
  ]
}
```

---

本格式适用于手工编辑、程序导入导出及GIS可视化。如有扩展需求（如增加换乘信息、运营时段等），可在车站或层级对象中自由添加新字段，不影响已有数据读取。
