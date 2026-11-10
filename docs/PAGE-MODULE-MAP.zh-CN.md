# 不周山设计 · 页面与模块命名说明

核对日期为 2026 年 11 月 10 日。本文以当前实现为基准，供标注截图、提交设计修改和核对范围时使用。表中的中文名称用于沟通，页面显示文案和网址以现有实现为准。

## 1. 先确定页面范围

| 指令中使用的名称 | 当前地址 | 所指范围 |
| --- | --- | --- |
| 首页 | `/` | 整张纵向滚动页面，包含首屏、作品区、关于区和联系页脚 |
| 首页 · 首屏 | `/#home` | 山体、橙色英文标志、多语言标语及首屏上下信息 |
| 首页 · 作品区 | `/#works` | 白底展示区，依次排列横向精选条带、`Selected Works` 标题和十二类面板组 |
| 首页 · 关于区 | `/#about` | 可拖动的纸质海报与原中文标语 |
| 首页 · 联系页脚 | `/#contact` | 亮绿色收尾区，包含接案状态、联系标题、邮件、电话和回到顶部 |
| 作品分类页 | `/works/[slug]` | 从首页分类入口打开的六张独立页面，共用一个模板 |

首页顶部导航在滚动时持续显示。`Works`、`About`、`Contact` 分别跳到同一张首页的三个区块。描述范围时，可用「首页首屏以下」指作品区、关于区和联系页脚，用「六个作品分类页」指独立页面。**独立作品总览、单个作品详情页和简历下载入口仍待建设。**

## 2. 首页模块

### 顶部导航与首屏

| 模块名 | 画面定位与现有行为 | 代码定位 |
| --- | --- | --- |
| 首页顶部导航 | 固定在页面上方的整条导航栏 | `.nav` |
| 首页导航中文标志 | 导航左侧「不周山」SVG，点击返回首屏 | `.brand` |
| 桌面导航链接 | 居中的 `Works / About / Contact` | `.nav-links` |
| 移动端菜单 | 窄屏下的「菜单 / 关闭」按钮及展开面板 | `.menu-button`、`.nav-links.open` |
| 下一座山按钮 | 导航右侧，切换山体、引语、标语和山名坐标；点击时有橙色选中态及短暂白色闪光 | `.contact-pill` |
| 首屏顶部信息带 | 上方横线下的引语、署名与右侧工作室文字 | `.hero-context`、`.hero-quote`、`.hero-context-brand` |
| 首屏主视觉舞台 | 山体、英文标志、标语与坐标的叠放区域 | `.hero-stage` |
| 山体线框 | 后景的三维线框，随「下一座山」切换 | `.hero-graphic`、`GenerativeCanvas` |
| 橙色英文标志 | 中央橙色 `STUDIO ALMOST,`，字形来自品牌 SVG | `.hero-en-logo` |
| 英文标志 TechText 动效 | 英文标志逐字悬停描边、选框和微粒；支持拖动、松手回弹和点击连锁弹跳 | `TechText`、`.tech-text` |
| 多语言标语 | 叠在橙色标志前方的标语，例如 `We’re almost there.`，切换时有中心向两侧展开的解密动效 | `.hero-slogan`、`LanguageDecryptedText` |
| 山名与坐标 | 标语下方的经纬度与山名 | `.hero-sequence` |
| 首屏底栏 | 首屏底部居中的工作室介绍和浏览提示，文案下方是向下箭头 | `.hero-footer`、`.studio-meta` |
| 首屏底栏文字动效 | `Since 2014`、`Visual Design`、`leVel`、`FuZhou`、`Scroll`、`Explore More` 快速随机轮换，带抖动和彩色错位重影。文案始终可见 | `StudioMeta`、`.studio-meta-glitch` |
| 向下浏览入口 | 首屏底栏文案下方的橙色圆形箭头，跳到首页作品区 | `.round-link` |

调整橙色标志的大小、对齐或叠放位置时，定位到「橙色英文标志」。调整虚线、拖动边界、回弹或弹跳时，定位到「英文标志 TechText 动效」，并指明触发方式。两处导航所用的中文标志是 `brand-logo-cn.svg`，首屏橙色英文标志是 `brand-logo-en-orange.svg`。

### 作品区

| 模块名 | 画面定位与现有行为 | 代码定位 |
| --- | --- | --- |
| 横向精选条带 | 位于标题上方，连续横向滚动，共 18 条精选作品记录 | `.featured-projects`、`.featured-track` |
| 精选作品标题 | 紧接条带下方的单行 `Selected Works`，使用 Montserrat。指针靠近时字母逐个增重，移开后回到 Medium | `.works-heading`、`VariableProximity` |
| 精选作品卡片 | 条带里的单个编号作品，如 `01 HOLIDAY PARK`；鼠标悬停时放大 | `.featured-card` |
| 精选卡片画面 | 卡片内部的 CSS 占位图形、编号和英文名 | `.featured-visual`、`.art-*` |
| 十二类面板组 | 精选条带下方的全宽白底网格，桌面三列、窄屏两列。横线两端缩进，竖线逐行断开，上下各留出 `16px` 圆角空间 | `.category-grid` |
| 单张分类面板 | 左上英文名，左下黑底中文标签与白底案例数，右下进入箭头 | `.category-panel`、`.category-panel-title`、`.category-panel-badges`、`.category-enter` |
| 分类图像预览 | 桌面悬停或手机轻点时，图像铺满面板，英文名和标签淡出，图像圆角与精选卡片同为 `16px` | `.category-preview`、`.category-panel-art` |
| 分类进入箭头 | 面板右下向内缩进的 `→`，预览时在同一位置显示橙色圆形底，链接到子类所属的原分类页 | `.category-enter` |

指定单张精选作品卡片时，可用「精选卡片 01 HOLIDAY PARK」。指定面板时，可用「Branding / 品牌面板」。面板的 `18` 是暂用的案例数，图像预览沿用现有占位图形。

| 首页分类面板 | 所属分类页 |
| --- | --- |
| Branding 品牌、Logos 徽标 | 01 品牌及徽标 |
| Events 活动、Exhibitions 展览 | 02 活动和展览 |
| Posters 海报、Graphics 图形 | 03 海报和图形 |
| Books 书籍、Music 音乐装帧 | 04 书籍和音乐装帧 |
| Packaging 包装、Products 产品 | 05 包装和产品 |
| Commercial 商业、Web 网站 | 06 商业和网站 |

### 关于区与联系页脚

| 模块名 | 画面定位 | 代码定位 |
| --- | --- | --- |
| 关于区纸质海报 | 标语上方可拖动的纸质海报，拖动时卷曲，松开后回到中央 | `.about-poster-stage`、`AboutPoster` |
| 海报图形占位 | 带山形线条和橙色圆形的可替换图稿 | `public/about-poster-placeholder.svg` |
| 关于区标语 | 「不完整，才是事情开始变好的地方」 | `.about-slogan` |
| 联系区编号 | `03 — CONTACT` | `.contact .index` |
| 接案状态 | `AVAILABLE FOR SELECTED PROJECTS` 和状态圆点 | `.availability` |
| 联系主标题 | 「让我们创造 / 值得被记住的作品。」两行大字 | `.contact h2` |
| 邮件入口 | 邮箱和右上箭头 | `.mail-link` |
| 页脚底部信息行 | 版权、电话和「回到顶部」 | `.footer-row` |

「首屏底栏」位于山体首屏底部。「联系页脚」位于首页最末端。「山体线框」是首屏主视觉，「关于区纸质海报」位于首页下方的关于区。

## 3. 六个作品分类页

| 编号 | 当前中文显示 | 当前英文标题 | 项目标准分类名 | 路径 |
| --- | --- | --- | --- | --- |
| 01 | 品牌及徽标 | Branding & Logos | Brand / Identity | `/works/branding-logos` |
| 02 | 活动和展览 | Events & Exhibitions | Events / Exhibitions | `/works/events-exhibitions` |
| 03 | 海报和图形 | Posters & Graphics | Posters / Graphics | `/works/posters-graphics` |
| 04 | 书籍和音乐装帧 | Editorial & Music | Books / Music | `/works/editorial-music` |
| 05 | 包装和产品 | Packaging & Products | Packaging / Products | `/works/packaging-products` |
| 06 | 商业和网站 | Commercial & Web | Commercial / Web | `/works/commercial-web` |

沟通时可用「04 书籍和音乐装帧」定位分类。涉及改名时，分别指定「首页面板名称」「分类页显示名称」「项目标准分类名」或「网址」。分类首屏采用表中的英文标题。

| 模块名 | 画面定位与现有行为 | 代码定位 |
| --- | --- | --- |
| 分类页导航 | 左侧中文标志回首页，右侧 `← ALL WORKS` 回首页作品区 | `.category-nav` |
| 分类首屏 | 大幅分类图形及其上的编号、中文副标题与英文主标题 | `.category-hero`、`.category-art-*` |
| 分类介绍区 | `SELECTED CATEGORY` 小标签与对应分类的中文介绍 | `.category-intro` |
| 项目档案占位区 | 分类页底部的深色 `PROJECT ARCHIVE` 区块，当前显示后续补充提示 | `.category-coming-soon` |
| 未知分类提示 | 无效分类地址显示 `CATEGORY NOT FOUND` 和返回作品区链接 | `.category-not-found` |

「分类页共用模板」指六页的结构与布局。「04 分类页」指书籍和音乐装帧这一页。部分分类图形在首页面板与分类首屏之间复用，调整时可指定「仅分类首屏」「仅首页分类面板」或「两处统一」。

## 4. 指令写法

推荐用 **页面 → 模块 → 具体对象 → 设备或交互状态 → 期望结果**。有浏览器标注时，把图上的编号和这里的模块名写在一起。

| 想调整什么 | 可以直接这样写 |
| --- | --- |
| 单个动效 | 「首页 → 首屏 → 英文标志 TechText 动效。桌面拖动时扩大边界，拖到首屏边缘时字形仍完整显示，松手按当前节奏回弹。」 |
| 首页一个局部 | 「首页 → 作品区 → 十二类面板组。仅在手机宽度下增加横向分隔线两端的留白。」 |
| 一张独立页 | 「分类页 04 书籍和音乐装帧 → 分类首屏。仅调整这页英文主标题的位置，使其与中文副标题左对齐。」 |
| 所有分类页 | 「六个分类页 → 共用模板 → 分类介绍区。统一缩小标签和正文之间的垂直间距。」 |
| 区分首页与其他页面 | 「调整首页首屏以下的三个区块」或「调整六个独立作品分类页」。 |

同一模块有多种状态时，可附「默认、悬停、键盘聚焦、点击、拖动中、松手回弹」之一。手机问题可附视口宽度，例如 `390px`。当前紧凑布局的宽度断点是 `800px` 及以下。

## 5. 对照文件

| 要查的内容 | 文件 |
| --- | --- |
| 首页的结构与交互 | [首页模板](../app/page.tsx) |
| 六个分类页的共用结构 | [分类页模板](../app/works/%5Bslug%5D/page.tsx) |
| 分类名称、路径和介绍 | [分类数据](../app/content/categories.ts) |
| 精选作品、十二类面板、能力项、多语言标语 | [首页数据](../app/content/home.ts) |
| 山体资料、引语与坐标 | [山体数据](../app/content/mountains.ts) |
| 英文标志逐字交互 | [TechText](../app/components/TechText.jsx) 和 [TechText 样式](../app/components/TechText.css) |
| 主要布局样式、项目状态与视觉规则 | [全局样式](../app/globals.css)、[项目状态](PROJECT-STATE.md)、[设计系统](DESIGN-SYSTEM.md) |
