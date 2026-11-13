# 作品总览页定稿备份与恢复说明 · 2026-11-13

用户于 **2026-11-13（Asia/Hong_Kong）** 确认作品总览页设计定稿。本文件与 [项目状态](PROJECT-STATE.md)、[设计系统](DESIGN-SYSTEM.md) 共同构成恢复依据。首页原有的 [2026-11-12 定稿备份](HOMEPAGE-FINAL-BACKUP-2026-11-12.zh-CN.md) 独立保留。

## 1. 固定版本

| 项目 | 标识 |
| --- | --- |
| GitHub 仓库 | [SupEach/Almost](https://github.com/SupEach/Almost) |
| 正常开发分支 | `main` |
| 固定备份分支 | **`codex/works-overview-final-2026-11-13`** |
| 定稿源码 | [GitHub 固定分支](https://github.com/SupEach/Almost/tree/codex/works-overview-final-2026-11-13) |
| 本地归档标签 | `works-overview-final-2026-11-13`，随 bundle 保存，不是 GitHub 远端标签 |
| 完整提交与源码树 SHA | 本地 `manifest.json` 和 GitHub 固定分支的提交记录 |

固定备份分支和归档标签不用于继续开发，也不应移动。完整提交 SHA 由 Git 与备份清单记录，避免在本提交文档中循环引用自身 SHA。后续修改在 `main` 或新的工作分支进行。

## 2. 定稿范围

- `/works` 独立总览页、共享导航、作品分类与所有动效。
- 桌面左侧 25% 的 OptionWheel，右侧 75% 的三列瀑布流；`≤800px` 时导航移至上方，卡片列数随宽度适配。
- 12 类导航与 Graphics / Books 之间的 All。默认 All 无选中高亮；操作后回到 All 显示橙色“全部”，其他选中类别显示中文。
- 导航沿统一圆弧运动，模糊为 `.5px/step`。Works 标题为零字距 Kanit，保留黑字和橙点，复用首页 TechText 交互。
- 分类小标题按字母使用 FallingText；数量只显示橙色数字；页脚版权与首页一致。
- 分类卡片按左、中、右列依次退出和进入。左列短距离左移并整卡淡出，无固定退出遮罩或裁切；新卡片由右侧水平进入。分类内上下滚动仍使用原有底部入场。
- All 沿用首页 18 项精选顺序；每个类别用现有 3 项父分类记录制作 9 张比例预览，比例为 `1:1`、`3:4`、`4:3`。这些重复预览不是新增真实项目。
- 卡片点击仍打开“详情页另行设计”的说明弹窗。详情页、正式素材和精准的 12 类作品归属不属于本次定稿。

源码 ZIP 包含本提交的全部 Git 受控文件，包括首页、字体、素材、依赖锁文件和已有六个分类页，确保可以独立恢复。首页改动仅为导航复用与 Works 链接；TechText 的 DOM 字形绑定支持总览标题，原有 SVG 模式保留。

保留在原工作区但不纳入本次提交/归档：`app/experiments/mountain-footer/`、用户原有 `AGENTS.md.txt`。不新增打包 `node_modules`、构建缓存、环境文件、临时输出或本地包仓库；Git 历史里原已受控的包仓库索引仍随受控源码保留。

## 3. 本地独立备份

```text
D:/Works/Almost/Portfolio/outputs/backups/works-overview-final-2026-11-13/
```

| 文件 | 用途 |
| --- | --- |
| `Almost-works-overview-final-2026-11-13.zip` | Git 定稿版本的源码 ZIP，不含 Git 历史 |
| `Almost-works-overview-final-2026-11-13.bundle` | 完整 Git 离线历史、main、固定备份分支与本地标签 |
| `manifest.json` | 提交/源码树 SHA、文件清单、检查记录、归档 SHA-256 |
| `SHA256SUMS.txt` | 源码、离线包、截图和清单等的校验值 |
| `works-desktop.png` / `works-mobile.png` | 桌面和手机的静态参考截图，实际视口记录在清单中 |
| `works-leading-exit.jpg` | 左列完整轮廓退场的参考截图 |
| 本文副本与 `README.txt` | 离线恢复入口 |

该目录不随 Git 提交，可复制到其他备份盘。GitHub 固定分支可在本地备份丢失时恢复；保留的 bundle 和 ZIP 可在远端不可用时恢复。截图只辅助比较，不保存滚动位置或浏览器中的动画相位。

## 4. 从 GitHub 恢复到新副本

先选择一个尚不存在的新目录，不覆盖当前未提交工作：

```powershell
git clone --branch codex/works-overview-final-2026-11-13 --single-branch https://github.com/SupEach/Almost.git Almost-works-overview-restored-2026-11-13
Set-Location Almost-works-overview-restored-2026-11-13
git switch -c codex/works-overview-recovery-2026-11-13
pnpm install --frozen-lockfile
pnpm dev
```

## 5. 从离线包恢复

```powershell
git bundle verify 'D:/Works/Almost/Portfolio/outputs/backups/works-overview-final-2026-11-13/Almost-works-overview-final-2026-11-13.bundle'
git clone --branch codex/works-overview-final-2026-11-13 'D:/Works/Almost/Portfolio/outputs/backups/works-overview-final-2026-11-13/Almost-works-overview-final-2026-11-13.bundle' Almost-works-overview-restored-from-bundle
Set-Location Almost-works-overview-restored-from-bundle
git switch -c codex/works-overview-recovery-from-bundle
pnpm install --frozen-lockfile
pnpm dev
```

ZIP 可解压至新目录后执行相同的安装和预览命令。源码包不带依赖安装目录，重新安装需要可用的包仓库网络或本地 pnpm 缓存。环境为 Node.js `>=22.13.0`、pnpm `11.22.0`，依赖以 `pnpm-lock.yaml` 为准。预览 `/works`；若 3000 端口已有原预览，可用 `node ./node_modules/vinext/dist/cli.js dev --hostname 127.0.0.1 --port 3001`，避免中断原服务。

## 6. 恢复校验与后续修改

```powershell
pnpm typecheck
pnpm test
```

生产构建和 11 项页面测试应通过。另在桌面与手机检查 All 初始状态、圆弧分类操作、三种卡片比例、分列切换、无裁切的左列退出、分类内滚动、标题交互、导航回首页与版权。静态页面测试不能代替这些动效检查。

对照 `manifest.json` 的完整提交和源码树 SHA，并用 `Get-FileHash -Algorithm SHA256 -LiteralPath '归档路径'` 核对 `SHA256SUMS.txt`。若要将旧设计恢复到未来的主分支，先保存当时工作、比较差异，再建立新的恢复提交；不要改写历史或移动固定分支。重点成组核对：

- `app/works/page.tsx`、`WorksOverview.tsx`、`works.css`。
- `OptionWheel.jsx/.css`、`Masonry.jsx/.css`、`SiteNavigation.tsx`、`TechText.jsx` 及其原有依赖组件。
- `app/page.tsx` 的共享导航接入、`app/content/home.ts` 的作品记录、`app/globals.css` 中复用的图形样式、本地字体与依赖锁文件。
- 页面测试、项目状态、设计系统和本恢复说明。

首页、详情页或其他后续工作可能共用这些组件，恢复时比较相关差异，保留无关修改。可向协作者提供以下指令：

> 请按本文件将作品总览页恢复至 `codex/works-overview-final-2026-11-13` 定稿版本。先保存当前工作并核对完整 SHA，再在新的恢复分支处理总览相关源码及共享组件，保留无关的后续修改。验证后建立新的恢复提交，不移动固定备份分支。
