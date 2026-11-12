# 不周山设计 · 页面与模块命名说明

首页设计定稿日期为 **2026 年 11 月 12 日（Asia/Hong_Kong）**。本文以当日确认的首页实现为基准，供标注截图、提交设计修改和核对范围时使用。表中的中文名称用于沟通，页面显示文案和网址以现有实现为准。

- [首页素材数量与尺寸清单](HOMEPAGE-ASSET-INVENTORY-2026-11-12.zh-CN.md)：按本文模块名称列出独立文件、展示位、原始尺寸、响应式显示尺寸及替换入口。
- [定稿备份与回滚说明](HOMEPAGE-FINAL-BACKUP-2026-11-12.zh-CN.md)：固定版本标识、备份范围、校验方式及恢复步骤。

定稿基线为 `codex/homepage-final-2026-11-12`。首页视觉、布局和交互已确认；下文明确标记的成员照片、合作品牌图标、作品图形等仍是素材占位，后续替换素材不等同于重新设计首页。

## 1. 先确定页面范围

| 指令中使用的名称 | 当前地址 | 所指范围 |
| --- | --- | --- |
| 首页 | `/` | 整张纵向滚动页面，依次包含首屏、作品区、关于区、合作品牌 Logo 和联系页脚 |
| 首页 · 首屏 | `/#home` | 山体、橙色英文标志、多语言标语及首屏上下信息 |
| 首页 · 作品区 | `/#works` | 白底展示区，依次排列横向精选条带、`Selected Works` 标题和十二类面板组 |
| 首页 · 关于区 | `/#about` | 两行成员介绍位于顶部，下接桌面一屏的英文标语、橙色横幅和可拖动纸质海报 |
| 首页 · 联系页脚 | `/#contact` | 上方为合作品牌 Logo 循环条带；白底联系行左侧邮箱带悬停词元掉落，右侧是拖动联系按钮，下方为版权和完整版 Logo |
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
| 精选作品标题 | 条带下方的单行 `Selected Works`，无括号。Montserrat 正体、字距 `-5%`、自然居中；循环从 Light（300、全透明）到 ExtraBold（800、全不透明），顶峰停留 1 秒，鼠标交互可到 Heavy（900）；字色 `#000000`。减少动态效果时为不透明静态 Bold | `.works-heading`、`TextPressure` |
| 精选作品卡片 | 条带里的单个编号作品，如 `01 HOLIDAY PARK`；鼠标悬停时放大 | `.featured-card` |
| 精选卡片画面 | 卡片内部的 CSS 占位图形、编号和英文名 | `.featured-visual`、`.art-*` |
| 十二类面板组 | 精选条带下方的全宽白底网格，桌面三列、窄屏两列。横线两端缩进，竖线逐行断开，上下各留出 `16px` 圆角空间。全部 12 张图片预览带白色聚光、颗粒、边缘光和按压增强 | `.category-grid`、`SpotlightCard` |
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
| 关于区纸质海报 | 可在纯白关于区内拖动并遮挡标语。拖动时卷曲、倾斜，松手后保留落点和角度，纸张逐渐舒展 | `.about-poster-stage`、`AboutPoster` |
| 工作室成员 | 与橙色横幅等宽的两行 `leVel` / `Pamela`，上下及中间有黑线；悬停、聚焦或触摸时流动带显示 `Director` / `Co-founder` 和圆形人物样图。快速滚动离开后清除流动层，未悬停时干净显示姓名 | `.about-team`、`FlowingMenu`、`teamMembers` |
| 海报图形占位 | 带山形线条和橙色圆形的可替换图稿 | `public/about-poster-placeholder.svg` |
| 关于区标语 | 海报下层居中的英文大字 `Complete Incomplete` | `.about-slogan` |
| 关于区横幅 | 标语下方的橙色图片占位，左右与首页顶部导航对齐 | `.about-image`、`public/about-image-placeholder.svg` |
| 合作品牌 Logo | 关于区与联系页脚之间的黑色 SVG 循环条带，向右滚动、悬停暂停、可拖动；当前四个技术品牌图标为临时占位，后续替换 `partnerLogos` 即可 | `.partners`、`LogoLoop`、`partnerLogos` |
| 邮件入口 | 邮箱为 `studioalmostworks@gmail.com`，按 `studio/almost/works/@/gmail/./com` 七项掉落，静止时连续显示，前三项为品牌橙。仅经过文字触发掉落，仅点击文字打开邮件，静止及掉落时的空白点击均不打开邮件。散落底线与右侧按钮下沿对齐，词元可拖动，指针离开且静止 2 秒后复位；拖动不打开邮件，键盘回车可打开 | `.mail-link`、`FallingText` |
| 一键联系 | 无半透明外圈的橙色按钮使用放大至 44px 的白色附件品牌图标，固定提示「DRAG ME →」与首屏底栏共用字体，间距桌面 24px / 窄屏 18px；≤360px 提示位于图标上方。拉动后松手会溅出橙色粒子并打开确认弹窗 | `.contact-sling`、`SlingButton` |
| 项目确认弹窗 | 「有项目？看看我最近有没有空。」，「没错」「点错了」暂时仅关闭弹窗，后续接入二级页面 | `.contact-dialog` |
| 页脚落款 | 分割线左下为两行 STUDIO ALMOST 版权，右下为附件完整版橙色横版 SVG Logo，窄屏按剩余空间等比缩小 | `.contact-meta`、`.contact-copyright`、`.contact-wordmark` |

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

同一模块有多种状态时，可附「默认、悬停、键盘聚焦、点击、拖动中、松手回弹」之一。手机问题可附视口宽度，例如 `390px`。当前紧凑布局的宽度断点是 `800px` 及以下；联系区在 `360px` 及以下将「DRAG ME →」移到图标上方。

## 5. 对照文件

| 要查的内容 | 文件 |
| --- | --- |
| 首页的结构与交互 | [首页模板](../app/page.tsx) |
| 六个分类页的共用结构 | [分类页模板](../app/works/%5Bslug%5D/page.tsx) |
| 分类名称、路径和介绍 | [分类数据](../app/content/categories.ts) |
| 精选作品、十二类面板、成员、合作品牌占位图标、多语言标语 | [首页数据](../app/content/home.ts) |
| 山体资料、引语与坐标 | [山体数据](../app/content/mountains.ts) |
| 英文标志逐字交互 | [TechText](../app/components/TechText.jsx) 和 [TechText 样式](../app/components/TechText.css) |
| 精选标题、分类聚光、成员和合作品牌动效 | [TextPressure](../app/components/TextPressure.jsx)、[SpotlightCard](../app/components/SpotlightCard.jsx)、[FlowingMenu](../app/components/FlowingMenu.jsx)、[LogoLoop](../app/components/LogoLoop.jsx) |
| 邮箱词元掉落与联系按钮 | [FallingText](../app/components/FallingText.jsx)、[SlingButton](../app/components/SlingButton.jsx)、[首页点击范围约束](../app/page.tsx) |
| 首页图片、图标数量与尺寸 | [定稿素材清单](HOMEPAGE-ASSET-INVENTORY-2026-11-12.zh-CN.md) |
| 定稿版本备份与回滚 | [定稿备份说明](HOMEPAGE-FINAL-BACKUP-2026-11-12.zh-CN.md) |
| 主要布局样式、项目状态与视觉规则 | [全局样式](../app/globals.css)、[项目状态](PROJECT-STATE.md)、[设计系统](DESIGN-SYSTEM.md) |
