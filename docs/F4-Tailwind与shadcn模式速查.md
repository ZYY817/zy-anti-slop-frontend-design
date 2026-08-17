# F4 · Tailwind 与 shadcn 模式速查

> AI 生成代码首选 Tailwind + shadcn/ui。但"能跑"和"高质量"之间差的是：
> 类名组合的品位、Token 复用、暗色模式、组件组合模式、常见陷阱。
> 本文件让 AI 写出**资深开发者级别**的 Tailwind 代码。

---

## 一、shadcn/ui 核心约定

### 设计哲学
- **复制而非安装**：组件代码在你的项目里，可随意修改
- **Radix 做行为，Tailwind 做样式**：headless + utility
- **CSS 变量做 Token**：颜色不直接写 Tailwind 颜色名，用语义变量

### 色彩 Token 体系（shadcn v4 默认 OKLCH）
```css
/* globals.css — shadcn/ui 在 Tailwind v4 时代使用 OKLCH 色彩空间 */
@import "tailwindcss";

@theme inline {
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  --color-primary: var(--primary);
  --color-primary-foreground: var(--primary-foreground);
  --color-secondary: var(--secondary);
  --color-muted: var(--muted);
  --color-muted-foreground: var(--muted-foreground);
  --color-accent: var(--accent);
  --color-border: var(--border);
  --color-ring: var(--ring);
  --radius-sm: calc(var(--radius) - 4px);
  --radius-md: calc(var(--radius) - 2px);
  --radius-lg: var(--radius);
}

:root {
  --background: oklch(1 0 0);
  --foreground: oklch(0.145 0 0);
  --primary: oklch(0.205 0 0);
  --primary-foreground: oklch(0.985 0 0);
  --secondary: oklch(0.97 0 0);
  --muted: oklch(0.97 0 0);
  --muted-foreground: oklch(0.556 0 0);
  --accent: oklch(0.97 0 0);
  --border: oklch(0.922 0 0);
  --ring: oklch(0.708 0 0);
  --radius: 0.625rem;
}
.dark {
  --background: oklch(0.145 0 0);
  --foreground: oklch(0.985 0 0);
  /* ... 重定义同名变量 */
}
```
Tailwind 类引用：`bg-background text-foreground border-border`。

> **注**：上面是 shadcn v4（Tailwind v4）的 OKLCH 写法。如果项目仍在 Tailwind v3，用旧格式 `--background: 0 0% 100%`（HSL 无单位）+ `tailwind.config.js` 里 `hsl(var(--background))`。

### cn() 工具函数
```ts
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
```
用途：安全合并类名、处理条件、消除冲突。

### CVA (Class Variance Authority)
```ts
import { cva, type VariantProps } from "class-variance-authority"

const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: { variant: "default", size: "default" },
  }
)
```
**规则**：所有变体组件用 CVA，不要在 JSX 里写三元条件类名地狱。

---

## 二、高质量 Tailwind 类组合（速查）

### 布局容器
```html
<!-- 页面容器 -->
<div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

<!-- 居中内容区 -->
<div class="flex min-h-dvh flex-col items-center justify-center">

<!-- Bento 网格 -->
<div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
```

### 卡片
```html
<div class="rounded-lg border border-border bg-card p-6 shadow-sm transition-shadow hover:shadow-md">
  <h3 class="text-lg font-semibold text-card-foreground">标题</h3>
  <p class="mt-2 text-sm text-muted-foreground">描述</p>
</div>
```

### 输入框
```html
<input class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50" />
```

### Badge
```html
<span class="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors">
```

### 数据表格行
```html
<tr class="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
  <td class="p-4 align-middle text-sm tabular-nums">¥12,847</td>
</tr>
```

### KPI 卡片
```html
<div class="rounded-lg border bg-card p-6">
  <p class="text-sm font-medium text-muted-foreground">月收入</p>
  <p class="mt-2 text-2xl font-bold tabular-nums tracking-tight">¥128,470</p>
  <p class="mt-1 flex items-center text-xs text-green-600">
    <ArrowUp class="mr-1 h-3 w-3" />+12.5%
  </p>
</div>
```

### 骨架屏
```html
<div class="animate-pulse space-y-3">
  <div class="h-4 w-3/4 rounded bg-muted"></div>
  <div class="h-4 w-full rounded bg-muted"></div>
  <div class="h-4 w-1/2 rounded bg-muted"></div>
</div>
```

---

## 三、常见组件的 shadcn 命名对照

| 你想要的 | shadcn 组件名 | 底层库 |
|---|---|---|
| 弹窗/对话框 | `Dialog` | Radix Dialog |
| 侧滑面板 | `Sheet` | Radix Dialog (side) |
| 下拉菜单 | `DropdownMenu` | Radix DropdownMenu |
| 右键菜单 | `ContextMenu` | Radix ContextMenu |
| 命令面板（⌘K） | `Command` | cmdk |
| Tab 切换 | `Tabs` | Radix Tabs |
| 手风琴 | `Accordion` | Radix Accordion |
| 提示气泡 | `Tooltip` | Radix Tooltip |
| 弹出卡片 | `Popover` | Radix Popover |
| 选择器 | `Select` | Radix Select |
| 自动补全 | `Combobox`（Command + Popover 组合） | cmdk + Radix |
| 日期选择 | `Calendar` + `Popover` | react-day-picker |
| 表格 | `Table` + `DataTable`（自己搭） | @tanstack/react-table |
| 轮播 | `Carousel` | embla-carousel |
| Toast 通知 | `Sonner` 或 `Toast` | sonner / Radix Toast |
| 表单 | `Form` | react-hook-form + zod |
| 导航菜单 | `NavigationMenu` | Radix NavigationMenu |
| 抽屉（移动端） | `Drawer` | vaul |
| 面包屑 | `Breadcrumb` | 原生 |
| 分页 | `Pagination` | 原生 |

---

## 四、Tailwind v4 要点（2026）

| 变化 | v3 | v4 |
|---|---|---|
| 配置方式 | `tailwind.config.js` | CSS `@theme`（config.js **可选保留**用于插件/自定义 content 路径） |
| 颜色 | `colors: { brand: '...' }` | `@theme { --color-brand: oklch(65% 0.2 260); }` |
| 自定义单位 | `extend: { spacing }` | `@theme { --spacing-4: 1rem; }` |
| 容器查询 | 插件 | 原生 `@container` + `@sm:` `@md:` 变体 |
| 暗色 | `dark:` class 策略 | `dark:` 或原生 `@custom-variant dark` |
| 作用域 | 无 | `@layer components { @scope (.card) { ... } }` |

### v4 的 @theme 示例
```css
@import "tailwindcss";
@theme {
  --font-display: "Cal Sans", sans-serif;
  --color-brand: oklch(65% 0.2 260);
  --radius-lg: 0.75rem;
}
```
类中直接用：`font-display text-brand rounded-lg`。

---

## 五、常见错误（AI 最容易犯的）

| ❌ 错误 | ✅ 正确 | 原因 |
|---|---|---|
| `text-gray-900 dark:text-white` | `text-foreground` | 用语义 Token，暗色自动切 |
| `bg-white dark:bg-gray-900` | `bg-background` | 同上 |
| `border-gray-200` | `border-border` | 语义化 |
| `rounded-[12px]` | `rounded-lg` (配置好 radius) | 保持 Token 系统一致 |
| `className={isActive ? "bg-blue-500" : "bg-gray-200"}` | 用 CVA variants | 类名条件地狱可读性差 |
| `bg-blue-500` 做品牌色 | `bg-primary` | 品牌色改了要全局搜替 |
| 动态拼接 `bg-${color}-500` | 完整写 `bg-red-500` | Tailwind 静态检测找不到动态类 |
| 超长类名一行写 | 安装 prettier-plugin-tailwindcss 自动排序 | 可读性 |
| 每个组件重复写完整类名 | 提取为组件（React/Vue），用 CVA | DRY |
| `outline-none` 去掉焦点 | `focus-visible:ring-2 focus-visible:ring-ring` | 无障碍 |

---

## 六、组合模式（实战常见）

### 响应式侧栏 + 移动端 Drawer
```tsx
// 桌面: 固定侧栏
<aside class="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col">
// 移动: vaul Drawer
<Drawer>
  <DrawerTrigger class="lg:hidden">
    <Menu class="h-5 w-5" />
  </DrawerTrigger>
  <DrawerContent>侧栏内容</DrawerContent>
</Drawer>
```

### Command 命令面板（⌘K 搜索）
```tsx
<CommandDialog>
  <CommandInput placeholder="搜索..." />
  <CommandList>
    <CommandGroup heading="页面">
      <CommandItem>首页</CommandItem>
      <CommandItem>设置</CommandItem>
    </CommandGroup>
  </CommandList>
</CommandDialog>
```

### 数据表格（@tanstack/react-table + shadcn Table）
```tsx
<Table>
  <TableHeader>
    {table.getHeaderGroups().map(group => (
      <TableRow>
        {group.headers.map(header => <TableHead>...</TableHead>)}
      </TableRow>
    ))}
  </TableHeader>
  <TableBody>
    {table.getRowModel().rows.map(row => (
      <TableRow data-state={row.getIsSelected() && "selected"}>
        {row.getVisibleCells().map(cell => <TableCell>...</TableCell>)}
      </TableRow>
    ))}
  </TableBody>
</Table>
```

---

## 七、Prompt 模板

```
【Tailwind + shadcn 约束】
- 颜色：用 shadcn 语义 Token（bg-background/text-foreground/border-border/bg-primary），
  不要写 bg-white/text-gray-900/bg-blue-500
- 组件：用 shadcn 组件名（Dialog/Sheet/Command/Tabs/Accordion），
  底层是 Radix headless，样式用 Tailwind
- 变体：用 CVA 管理 variant × size，不要三元条件类名
- 暗色：Token 自动切换，不需要手写 dark: 前缀（除非 Token 外的特殊效果）
- 焦点：focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2
- 类名排序：安装 prettier-plugin-tailwindcss
- 不要动态拼接类名（bg-${color}），只用完整静态类
- 容器查询用 @container + @sm: @md: 变体（v4）
- 表格数值：tabular-nums text-right
- 间距/圆角/字号全部用 Token（不要任意值 []），除非 Token 确实没有
```

---

## 九、DTCG → Tailwind v4 集成（design-system-as-code）

> tokens 单源（DTCG JSON，见 D3 第七节）→ Style Dictionary/Terrazzo 编译 → Tailwind v4 的 `@theme`。

```css
/* 编译产物：tokens.css（由 Style Dictionary 从 tokens.json 生成，勿手改） */
@import "tailwindcss";
@theme {
  --color-brand: oklch(65% 0.2 260);      /* DTCG $type: color */
  --spacing-4: 1rem;                        /* DTCG dimension */
  --font-display: "Cal Sans", sans-serif;   /* DTCG fontFamily */
}
```

- 工作流：**Figma/Tokens Studio 改 token → 导出 DTCG JSON → CI 构建 → PR 更新 CSS**；前端开发者永远不手改色值
- 语义层进 `@theme`，组件层留在组件（CVA variants 引用 `bg-brand` 等类）
- 检查点：`grep -r "#[0-9a-fA-F]" src/` 应为 0（除 DESIGN.md/示例外），保证无硬编码色值
- 与 shadcn 生态衔接：shadcn 的 OKLCH 语义变量（`--primary` 等）可映射到 DTCG `$type: color` 的 semantic 层

---

## 十、检验清单

- [ ] 颜色全用语义 Token，无 `bg-white`/`text-gray-900`
- [ ] 品牌色用 `bg-primary`，不用具体颜色名
- [ ] 变体用 CVA，无三元条件类名地狱
- [ ] 焦点用 `focus-visible:ring-*`，无 `outline-none`
- [ ] 类名无动态拼接
- [ ] 暗色模式只在 `:root`/`.dark` 切换 Token，组件无需感知
- [ ] 用了 shadcn 对应组件名（不自己造轮子）
- [ ] 数值列 `tabular-nums` + 右对齐
- [ ] 间距/圆角不用任意值，用 Token
- [ ] 安装了 prettier-plugin-tailwindcss 排序
