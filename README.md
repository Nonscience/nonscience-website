# Nonscience (扯淡官网)

![Design Style](https://img.shields.io/badge/Design-Swiss%20Style-8b0000)
![License](https://img.shields.io/badge/License-MIT-black)
![Platform](https://img.shields.io/badge/Platform-GitHub%20Pages-blue)

**Nonscience** 是一个专注非科学话题和意义领域的原创内容平台。本仓库包含该平台的官方网站源码，旨在通过极简的视觉语言展示平台理念、收录深度文章并发布征稿信息。

---

## 🖋️ 项目简介

“废话皆真理，扯淡即科学。”

Nonscience 试图在严肃的学术与荒诞的表达之间寻找一种新的平衡。网站设计深度致敬**国际主义设计风格 (Swiss Style)**，通过严谨的网格系统、非对称的有机形状以及经典的衬线字体组合，呈现出一个高质感的数字阅读空间。

---

## 🛠️ 技术栈

* **架构**: 纯静态网站 (Static Site)
* **前端核心**: HTML5 / CSS3 / Vanilla JavaScript
* **视觉语言**: 
    * **字体**: EB Garamond (Serif), Inter (Sans-serif)
    * **排版**: 响应式网格布局 (Responsive Grid), `clamp()` 动态函数适配
* **内容管理**: Decap CMS (原 Netlify CMS)
* **部署**: GitHub Pages / Netlify

---

## 📂 目录结构

```text
.
├── index.html          # 网站主落地页（包含核心布局与交互逻辑）
├── articles.json       # 存储文章元数据及列表信息
├── data/               # 存放文章正文及静态数据
├── admin/              # Decap CMS 管理后台配置
│   └── config.yml      # CMS 字段映射与路径定义
├── assets/             # 静态资源库
│   ├── img/            # 图片及视觉元素
│   └── fonts/          # 本地字体补丁（如需）
├── README.md           # 项目说明文档
└── LICENSE             # MIT 许可证