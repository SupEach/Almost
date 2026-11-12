# 首页定稿备份与回滚说明 · 2026-11-12

确认日期：**2026-11-12，Asia/Hong_Kong**。用户已确认首页整体设计定稿。本文件与 [模块地图](PAGE-MODULE-MAP.zh-CN.md)、[素材清单](HOMEPAGE-ASSET-INVENTORY-2026-11-12.zh-CN.md)、[项目状态](PROJECT-STATE.md)、[设计系统](DESIGN-SYSTEM.md) 共同构成恢复依据。

## 1. 固定版本标识

| 项目 | 标识 |
| --- | --- |
| GitHub 仓库 | [SupEach/Almost](https://github.com/SupEach/Almost) |
| 正常开发分支 | `main` |
| **固定定稿备份分支** | **`codex/homepage-final-2026-11-12`** |
| 定稿源码入口 | [GitHub 定稿分支](https://github.com/SupEach/Almost/tree/codex/homepage-final-2026-11-12) |
| 本地归档标签 | `homepage-final-2026-11-12`，随本地 Git bundle 保存；不是 GitHub 远端标签 |
| 完整提交 SHA / 归档校验值 | 本地备份目录的 `manifest.json`、`SHA256SUMS.txt`，以及 GitHub 定稿分支的提交记录 |

备份分支固定在本次定稿提交，后续不要在该分支继续开发或移动它。以后的修改在 `main` 或新的工作分支进行。需要确认版本时，同时核对完整提交 SHA，不只看文件日期。本文随基线提交保存，因此不在自身正文中写入会形成循环引用的本提交 SHA；最终 SHA 由 Git 和归档清单记录。

## 2. 备份范围与已确认状态

- 首页源码、样式、动效组件、内容配置、全部已引用素材、本地字体及依赖锁文件均纳入版本。
- 已有六个分类页、根布局和项目构建配置随仓库一起保留；本次没有重做分类页。
- 首页顺序固定为：首屏 → 精选作品条带 / 标题 / 十二类面板 → 两行成员 / 纸质海报构图 → 合作品牌循环条带 → 联系页脚。
- 包含 TextPressure、分类 SpotlightCard、成员 FlowingMenu 的快速滚动残影修复、合作品牌 LogoLoop 的触摸捕获修复、七词元 FallingText、白色 44px 品牌联系图标、完整橙色页脚 Logo。
- 邮箱为 `studioalmostworks@gmail.com`。只有文字悬停触发掉落、只有文字点击打开邮件；空白区域不打开邮件，拖动不误打开邮件，键盘和手机点按可用。
- 主断点为 `800px`，联系提示在 `≤360px` 上移。品牌橙为 `#ff7824`；Selected Works 为黑色 Montserrat；其余字体与回退规则见设计系统。
- 本地未定稿的 `app/experiments/mountain-footer/` 和用户原有 `AGENTS.md.txt` 保留在原工作区，**不纳入本次定稿提交或源码归档**。
- 不把 `node_modules`、构建缓存、临时浏览器配置或 `outputs/` 纳入新提交。归档仅导出 Git 版本中的文件；仓库历史中已有的单个包仓库索引文件不是新增依赖备份。

定稿的是首页的设计和交互。18 个精选记录和 12 个分类预览仍使用 CSS 占位；2 张成员照片、4 个合作品牌图标、About 图稿仍是明确标记的占位。分类页项目档案与详情页尚未完成。当前图像数量与尺寸以素材清单为准。

## 3. 本地独立备份

原工作区中的目录为：

```text
D:/Works/Almost/Portfolio/outputs/backups/homepage-final-2026-11-12/
```

| 文件 | 用途 |
| --- | --- |
| `Almost-homepage-final-2026-11-12.zip` | 定稿源码 ZIP，不依赖当前工作区文件；解压到新目录即可检查源码 |
| `Almost-homepage-final-2026-11-12.bundle` | Git 离线归档，包含定稿提交、其历史、固定备份分支和本地归档标签 |
| `manifest.json` | 完整提交 SHA、源码树 SHA、版本标识、文件清单、校验值及检查记录 |
| `SHA256SUMS.txt` | ZIP、bundle 和截图等文件的 SHA-256 校验值 |
| `homepage-1848x1243.png` | 大桌面整页参考截图 |
| `homepage-390x844.png` | 手机整页参考截图 |
| `layout-measurements.json` | 5 组视口下的实际显示尺寸，支撑素材清单 |

该目录是独立的本地备份产物，不随 Git 提交。建议另存到个人备份盘。即使本地归档遗失，仍可从 GitHub 固定备份分支恢复源码；即使远端不可用，仍可从保留的 bundle 或 ZIP 恢复。

截图使用减少动态效果、未拖动的初始布局，以便稳定比较。截图不能代替交互源码，也不保存浏览器运行中的海报落点、动画相位或滚动位置。

## 4. 最安全的恢复：另建副本预览

先使用一个**尚不存在的新目录名**，保留当前项目与未提交工作。

### 从 GitHub 恢复

在要存放恢复副本的父目录执行：

```powershell
git clone --branch codex/homepage-final-2026-11-12 --single-branch https://github.com/SupEach/Almost.git Almost-homepage-restored-2026-11-12
Set-Location Almost-homepage-restored-2026-11-12
git switch -c codex/homepage-recovery-2026-11-12
pnpm install --frozen-lockfile
pnpm dev
```

这样会得到定稿源码的恢复副本，不会覆盖原目录。后续修复在新建的 recovery 分支完成，不向固定备份分支推送改动。

### 从本地 Git bundle 恢复

```powershell
git bundle verify 'D:/Works/Almost/Portfolio/outputs/backups/homepage-final-2026-11-12/Almost-homepage-final-2026-11-12.bundle'
git clone --branch codex/homepage-final-2026-11-12 'D:/Works/Almost/Portfolio/outputs/backups/homepage-final-2026-11-12/Almost-homepage-final-2026-11-12.bundle' Almost-homepage-restored-from-bundle
Set-Location Almost-homepage-restored-from-bundle
git switch -c codex/homepage-recovery-from-bundle
pnpm install --frozen-lockfile
pnpm dev
```

ZIP 恢复则直接解压到新目录，再运行安装和预览命令。ZIP 不包含 Git 历史，bundle 包含。源码归档不打包 `node_modules`；重新安装依赖需要可用的包仓库网络或已有的 pnpm 缓存。

运行环境为 Node.js `>=22.13.0`、项目声明的 pnpm `11.22.0`，依赖以 `pnpm-lock.yaml` 为准。预览地址为 `http://127.0.0.1:3000/`；启动恢复副本前，先停止原来的同端口预览服务。

## 5. 将修复后的版本恢复到主分支

先保留当前工作并比较差异，再建立新的恢复提交。不要把恢复副本直接覆盖到仍有未保存工作的原目录。

首页相关内容分散在下列位置，恢复时需成组核对，避免只恢复页面而遗漏动效、字体或依赖：

- `app/page.tsx`、`app/globals.css`、`app/layout.tsx`。
- `app/content/home.ts`、`app/content/mountains.ts` 及首页引用的 `app/components/` 文件。
- 素材清单列出的 `public/` 图像、`public/fonts/` 字体与相应授权文件。
- `package.json`、`pnpm-lock.yaml` 和本次基线所含的构建配置。
- 首页模块地图、素材清单、设计系统、项目状态和测试文件。

全局样式和部分组件也被分类页使用；若后续已有新的分类页工作，应比较差异后恢复首页相关改动，而非盲目覆盖整个仓库。将恢复结果作为新的提交推送，保留后续历史与固定备份分支。

可以直接给后续协作者以下指令：

> 请按 `docs/HOMEPAGE-FINAL-BACKUP-2026-11-12.zh-CN.md`，将首页恢复至 GitHub 分支 `codex/homepage-final-2026-11-12` 的定稿版本。先保存当前工作并核对 SHA，再恢复首页相关源码、依赖及素材，保留无关的后续修改。验证后用新的恢复提交推送，不改写历史，不移动固定备份分支。

## 6. 恢复后检查

```powershell
pnpm typecheck
pnpm test
```

`pnpm test` 包含生产构建和 10 项页面测试。另需在桌面与手机预览中检查：

1. 导航、下一座山、首屏 SVG 字形交互与多语言标语。
2. 精选条带、无括号 Selected Works、12 张分类预览和聚光。
3. leVel / Pamela 的悬停内容及快速滚动后的干净姓名。
4. About 海报的初始构图、拖动及合作品牌循环 / 暂停 / 滑动。
5. 邮箱文字触发、空白不触发、掉落 / 拖动 / 自动复位、文字点击邮件。
6. 白色品牌图标、DRAG ME →、确认弹窗、完整页脚 Logo。
7. `1848px`、`1366px`、`800px`、`390px`、`320px` 宽度无横向溢出，减少动态效果时文本清晰。

校验本地文件可使用 `Get-FileHash -Algorithm SHA256 -LiteralPath '备份文件完整路径'`，与 `SHA256SUMS.txt` 对照。字体和素材恢复后应与固定源码版本一致；不要将截图作为唯一恢复依据。
