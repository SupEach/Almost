# 首页定稿 · 素材数量与尺寸清单

定稿日期：**2026-11-12（Asia/Hong_Kong）**。版本基线：`codex/homepage-final-2026-11-12`。

模块名称对应 [PAGE-MODULE-MAP](PAGE-MODULE-MAP.zh-CN.md) 第 2 节；恢复版本见 [定稿备份说明](HOMEPAGE-FINAL-BACKUP-2026-11-12.zh-CN.md)。本清单记录已确认设计的现状，未把占位图算作正式项目素材。

## 1. 数量口径

| 类型 | 数量 | 计数说明 |
| --- | ---: | --- |
| 首页正文使用的独立图片 / 图标文件 | **12** | 10 个 SVG + 2 个 JPEG，见 A01–A12 |
| 页面分享图 | **1** | `og.png`，用于 Open Graph，不在正文显示 |
| 本地字体文件 | **5** | 4 个 Kanit 字重 + 1 个 Montserrat 可变字体 |
| 精选作品图像展示位 | **18** | 当前全部为 CSS 图形；循环复制后有 36 张卡片，不是 36 份素材 |
| 分类图像预览展示位 | **12** | 当前全部为 CSS 图形；不是 12 份图片文件 |
| 工作室成员照片 | **2** | 已包含在上述 12 个独立文件中；流动重复不增加素材数量 |
| 合作品牌图标 | **4** | 已包含在上述 12 个独立文件中；目前是技术品牌占位图标 |

正文图片 / 图标共 12 个独立文件；加上分享图共 **13 个图像文件**。字体不混入图像数量。CSS 图形、Canvas、文字箭头和动态粒子单列，不按图片文件计数。分类面板上的「18」是暂用案例数，不能据此推算已有 216 张项目图片。

## 2. 独立图片 / 图标文件

SVG 的尺寸列是 `viewBox` 坐标范围，不是位图分辨率；SVG 可按比例缩放。JPEG / PNG 的尺寸是文件实际像素。

| 编号 | 对应模块 | 文件（均在仓库内） | 类型 / 原始尺寸 | 数量 | 当前显示与素材状态 |
| --- | --- | --- | --- | ---: | --- |
| A01 | 首页导航中文标志 | `public/brand-logo-cn.svg` | SVG，672×120 | 1 | 桌面宽 106px，紧凑布局宽 92px；高度等比 |
| A02 | 橙色英文标志 / 英文标志 TechText 动效 | `public/brand-logo-en-orange.svg` | SVG，856×120 | 1 | 原版英文标志及 TechText 共用同一文件；桌面最大宽 1300px，紧凑布局宽 166vw 并由首屏裁切 |
| A03 | 海报图形占位 / 关于区纸质海报 | `public/about-poster-placeholder.svg` | SVG，600×800，3:4 | 1 | 可拖动纸张的图稿；平面预览与 Three.js 纹理共用，仍为占位 |
| A04 | 关于区横幅 | `public/about-image-placeholder.svg` | SVG，1440×420，24:7 | 1 | 当前为橙色占位。桌面容器 24:7、最高 44svh；紧凑布局为 2.2:1；居中 cover |
| A05 | 工作室成员 · leVel | `public/team/level-portrait-placeholder.jpg` | JPEG，480×480 | 1 | 灰度样图，圆形容器、居中 cover；不代表成员本人 |
| A06 | 工作室成员 · Pamela | `public/team/pamela-portrait-placeholder.jpg` | JPEG，480×480 | 1 | 灰度样图，圆形容器、居中 cover；不代表成员本人 |
| A07 | 合作品牌 Logo · React 占位 | `public/partners/react-placeholder.svg` | SVG，24×24 | 1 | 黑色，图像框 48×48px |
| A08 | 合作品牌 Logo · Next.js 占位 | `public/partners/nextjs-placeholder.svg` | SVG，24×24 | 1 | 黑色，图像框 48×48px |
| A09 | 合作品牌 Logo · TypeScript 占位 | `public/partners/typescript-placeholder.svg` | SVG，24×24 | 1 | 黑色，图像框 48×48px |
| A10 | 合作品牌 Logo · Tailwind CSS 占位 | `public/partners/tailwindcss-placeholder.svg` | SVG，24×24 | 1 | 黑色，图像框 48×48px；图形本身在框内有留白 |
| A11 | 一键联系 · 品牌图标 | `public/brand-logo-icon.svg` | SVG，120×120 | 1 | 在 56×56px 橙色按钮内显示为 44×44px 白色；CSS 滤镜处理，无需另交白色版本 |
| A12 | 页脚落款 · 完整版 Logo | `public/brand-logo-full-orange.svg` | SVG，1500×120 | 1 | 桌面 200×16px，紧凑布局首选 168×13.44px；空间不足时等比缩小 |
| S01 | 网站分享图（非正文模块） | `public/og.png` | PNG，**1731×909** | 1 | 实测原图；页面 metadata 已同步为该尺寸 |

合作品牌的四个技术图标只用于布局预览，不代表工作室真实客户。来源和 CC0 授权见 `public/partners/README.md`、`public/partners/LICENSE.md`。成员样图来源见 [开发说明](DEVELOPMENT-GUIDE.zh-CN.md) 的 About 与 Contact 部分。

## 3. 响应式显示尺寸实测

单位为 **CSS px，宽×高**，不是导出图片像素要求。使用 Chromium、DPR 1、减少动态效果的初始静态布局测量，未拖动海报、未放大卡片。该测试环境有 15px 竖向滚动条；例如 1848px 视口的正文可用宽度为 1833px。跨设备应以 CSS 规则为准，不能将这些样本值改写成固定宽高。

| 模块 / 图像框 | 1848×1243 | 1366×900 | 1024×768 | 800×1024 | 390×844 |
| --- | --- | --- | --- | --- | --- |
| 首页导航中文标志 | 106×18.92 | 106×18.92 | 106×18.92 | 92×16.42 | 92×16.42 |
| 橙色英文标志 | 1300×182.23 | 1256.72×176.17 | 942.08×132.06 | 1328×186.16 | 647.39×90.75 |
| 精选作品卡片外框 | 197.33×262.44 | 143.77×191.02 | 105.77×140.34 | 257.33×342.44 | 120.66×160.20 |
| 精选卡片画面（内框） | 195.33×260.44 | 141.77×189.02 | 103.77×138.34 | 255.33×340.44 | 118.66×158.20 |
| 单张分类图像预览 | 611×260 | 450.33×218.55 | 336.33×180 | 392.50×240 | 187.50×148 |
| 成员圆形照片 | 80.08×80.08 | 71.08×71.08 | 48.11×48.11 | 46.47×46.47 | 46.47×46.47 |
| 关于区纸质海报 | 560.97×747.97 | 390.25×520.34 | 323.97×431.97 | 431.27×575.02 | 328.80×438.39 |
| 关于区横幅 | 1797×524.13 | 1315×383.53 | 973×283.78 | 765×347.72 | 355×161.36 |
| 合作品牌循环条带 | 1440×55 | 1271×55 | 929×55 | 749×55 | 339×55 |
| 单个合作品牌图像框 | 48×48 | 48×48 | 48×48 | 48×48 | 48×48 |
| 一键联系品牌图标 | 44×44 | 44×44 | 44×44 | 44×44 | 44×44 |
| 一键联系圆形按钮 | 56×56 | 56×56 | 56×56 | 56×56 | 56×56 |
| 页脚完整版 Logo | 200×16 | 200×16 | 200×16 | 168×13.44 | 168×13.44 |
| 向下浏览入口按钮 | 34×34 | 34×34 | 34×34 | 30×30 | 30×30 |
| 分类进入箭头按钮 | 44×44 | 44×44 | 44×44 | 44×44 | 44×44 |

紧凑布局的首屏英文标志故意宽于视口，保持现有横向裁切构图；不应为适配素材而擅自缩小。海报、成员照片尺寸受行高和视口高度影响。条带的 55px 是行框高度，Logo 图像本身始终为 48px。

## 4. CSS、Canvas 与文字图标

| 对应模块 | 实际数量 | 尺寸 / 绘制方式 | 独立素材文件需求 |
| --- | ---: | --- | --- |
| 山体线框 | 1 个首屏绘制实例，36 份山体配置 | 随 `.hero-stage` 填满视口；由 Three.js 生成 | 0 张山体图片，数据在 `app/content/mountains.ts` |
| 精选卡片画面 | 18 个内容位，2 组共 36 个 DOM 卡片 | 画面比例 3:4，复用 6 类 `.art-*` CSS 图形 | 当前 0 张项目封面；未来 18 个内容位可逐项接入素材 |
| 分类图像预览 | 12 个内容位 | 桌面三列、紧凑布局两列，尺寸见上表；6 类专用图形 + 6 类 `.art-*` | 当前 0 张预览图片；未来 12 个内容位可逐项接入素材 |
| 分类图片聚光 | 12 个覆盖层 | SpotlightCard：白光半径 360px、强度 0.15、颗粒和边缘光 | 0 个独立光效文件 |
| 向下浏览入口 | 1 个 `↓` | 文字图标，桌面 15px；外部圆形按钮尺寸见上表 | 0 个箭头 SVG |
| 分类进入箭头 | 12 个 `→` | 24px 文字图标；每个按钮 44×44px | 0 个箭头 SVG |
| 菜单 / 下一座山 / DRAG ME → | 各 1 处 | 字体文字与 CSS 按钮 | 0 个图片文件 |
| 一键联系拉伸带、弧线及粒子 | 1 组程序 SVG + 最多 14 个粒子 | 控件 56px，特效 SVG 为 90×90px；粒子和轨迹由代码生成 | 品牌图标只计 A11，不增加图片数 |
| 噪点纹理 | 2 类内嵌 SVG 定义 | About 纸张和 SpotlightCard 使用 160×160 的代码纹理 | 0 个外部纹理文件 |
| 精选作品标题 / 邮箱掉落 | 各 1 组文字动效 | 字体渲染，邮箱拆为 7 个词元 | 0 个文字图片文件 |

合作品牌循环复制组数随视口变化：本次 1848px 宽为 7 组（28 个图标节点），390px 宽为 4 组（16 个节点），但仍只需 A07–A10 四个文件。成员流动照片同样会重复使用同一文件。

### 精选作品的 18 个素材位置

以下名称直接取自 `featuredProjects`，不是额外新增作品；当前每个位置都使用 CSS 占位画面。

| 编号 | 当前英文名称 | CSS 图形 |
| --- | --- | --- |
| 01 | HOLIDAY PARK | `art-park` |
| 02 | FLOATING PARK | `art-sea` |
| 03 | MAKER LIVE | `art-poster` |
| 04 | SEA CALLS | `art-poster` |
| 05 | RUN FOR LOVE | `art-ui` |
| 06 | WEEKEND LAB | `art-ui` |
| 07 | THE DRUG HUNTER | `art-poster` |
| 08 | CHINESE STYLE | `art-door` |
| 09 | INFRASOUND | `art-sea` |
| 10 | THE DOOR | `art-door` |
| 11 | DAWN | `art-tea` |
| 12 | THE LEGEND OF HEI | `art-park` |
| 13 | GUOLAN TEA | `art-tea` |
| 14 | FOUR SEASONS | `art-sea` |
| 15 | SUSAN FERMENTS | `art-tea` |
| 16 | YESOUL | `art-ui` |
| 17 | COM'Z | `art-park` |
| 18 | ZERO GRAVITY | `art-door` |

分类的 12 个位置分别为 Branding、Logos、Events、Exhibitions、Posters、Graphics、Books、Music、Packaging、Products、Commercial、Web，名称和路由对应模块地图中的分类表。

## 5. 本地字体

| 文件 | 字体 / 字重 | 主要用途 |
| --- | --- | --- |
| `public/fonts/kanit-400.ttf` | Kanit Regular 400 | 正文、首屏底栏、DRAG ME →、邮箱 |
| `public/fonts/kanit-500.ttf` | Kanit Medium 500 | 导航、分类标题、成员姓名等 |
| `public/fonts/kanit-600.ttf` | Kanit SemiBold 600 | 部分标题与文本样式 |
| `public/fonts/kanit-700.ttf` | Kanit Bold 700 | 部分标题与文本样式 |
| `public/fonts/montserrat-latin.woff2` | Montserrat 可变字体，100–900 | Selected Works；当前动效 Light 300 至 ExtraBold 800，指针可至 900 |

Montserrat 的授权见 `public/fonts/Montserrat-OFL.txt`。中文使用系统回退字体，不是额外打包的字体文件。不同操作系统的中文回退字形可能不同，源码恢复不会替换系统字体。

## 6. 后续交付与替换入口

| 模块 | 后续替换入口 | 尺寸与格式约束 |
| --- | --- | --- |
| 品牌标志 | A01、A02、A11、A12 对应 `public/` 文件 | 保留 SVG 和正确 viewBox；A02 的路径还作为 TechText 输入，不能直接改成 PNG 并期待相同字形交互 |
| 成员照片 | `app/content/home.ts` 的 `teamMembers[].image` | 2 张方形照片，现有 480×480 足够当前显示；人物主体需适合圆形裁切 |
| 合作品牌 | `app/content/home.ts` 的 `partnerLogos` | 目前 4 个占位，正式数量尚未指定；使用 SVG，保留品牌比例并同步配置宽高 / 名称；显示高度维持 48px |
| 精选作品 | `featuredProjects`、`.featured-visual` | 当前 18 个展示位；画面比例 3:4，悬停时卡片会放大；当前实现尚无独立封面图片字段 |
| 分类图像预览 | `homeCategoryPanels`、`.category-panel-art` | 当前 12 个展示位，容器比例随视口变化；当前为 CSS 图形，正式图片接入与裁切方式需在素材替换任务中落实 |
| 关于区海报与横幅 | A03、A04 | 海报 3:4；横幅一份素材在桌面和紧凑布局采用不同容器比例，关键内容应适合居中裁切 |

18 个精选封面位与 12 个分类预览位合计 **30 个展示位置**，不代表必须交付 30 个互不相同的文件；同一作品是否复用，由正式内容决定。成员照片与合作品牌仍为明确占位，首页设计定稿不代表这些正式素材已齐备。

未使用的 `brand-logo-en-green.svg`、`main-graphic-circle.svg`、`file.svg`、`globe.svg`、`window.svg`、`favicon.svg` 和简历 PDF 不计入本清单。定稿参考截图、原始实测记录的位置见备份说明。
