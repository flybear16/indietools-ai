# IndieTools.ai 任务列表

**最后更新**: 2026-05-11
**负责人**: dev 🧑‍💻

---

## 🔴 高优先级

### 1. 用户系统集成
- [x] 接入 NextAuth（GitHub/Google 登录）
- [x] 用户注册/登录页面
- [x] 用户个人主页（收藏、提交历史）
- [x] 会话管理 + 中间件保护

**关联文件**: `app/api/auth/**`, `lib/auth.ts`, `app/profile/page.tsx`

### 2. 支付系统集成
- [x] Stripe 账号注册 + Webhook 配置
- [x] Submit & Boost 付费流程（$29 加速审核）
- [x] Featured 展示位购买流程
- [x] 支付状态同步 + 订单记录

**关联文件**: `app/api/stripe/**`, `app/submit/page.tsx`

---

## 🟡 中优先级

### 3. 邮件系统集成
- [x] Resend API 配置
- [x] 提交审核通知邮件（管理员）
- [x] 审核结果通知邮件（用户）
- [ ] Newsletter 邮件模板
- [x] API 路由已完成（submit-notification / review-notification）

**关联文件**: `lib/email.ts`, `app/api/email/**`

### 4. SEO 优化
- [x] 添加 robots.txt
- [x] Open Graph 图片生成
- [x] Open Graph 图片素材制作
- [x] 结构化数据（JSON-LD） - Organization + WebSite + SoftwareApplication
- [x] Twitter Card 素材制作
- [ ] 提交sitemap到搜索平台

**关联文件**: `app/robots.ts`, `app/sitemap.ts`, `app/layout.tsx`

### 5. Pro 会员功能
- [ ] 会员等级设计（Free/Pro）
- [ ] 高级筛选权限控制
- [ ] 工具对比次数限制
- [ ] 个人收藏夹
- [x] 订阅页面 + Stripe 订阅
- [x] Stripe Webhook 订阅生命周期处理

**关联文件**: `app/api/subscription/**`, `app/subscription/page.tsx`

---

## 🟢 低优先级

### 6. 内容运营
- [ ] 每周 AI Tools 周刊（内容策划 + 发送）
- [ ] 博客文章持续更新（每周 1-2 篇）
- [ ] 场景页面（Scenes）工具组合优化

### 7. 联盟计划注册
- [ ] 注册 GitHub Copilot Affiliate
- [ ] 注册 Cursor Referral
- [ ] 注册 Vercel Partner
- [ ] 注册 Supabase Partner
- [ ] 其他高佣金工具（Semrush, Ahrefs, Jasper）

**参考**: `docs/Affiliate计划注册清单.md`

---

## ✅ 已完成

| 功能 | Commit | 日期 |
|------|--------|------|
| MVP 核心功能 | e0ca24c | 2026-03 |
| 评论系统 | b543ad1 | 2026-04 |
| 真实评分显示 | e9ce77b | 2026-04 |
| 排序 + Phase 筛选 | e9ce77b | 2026-04 |
| 工具对比增强 | 5352c1d | 2026-04 |
| Blog 系统 | 83f544c | 2026-04 |
| Newsletter 订阅 | dd77dbc | 2026-04 |
| 高级筛选 | 19034e8 | 2026-04 |
| 联盟链接追踪 | f05554d | 2026-05 |
| 公开 API | 683ad93 | 2026-05 |
| Sponsor 页面 | 683ad93 | 2026-05 |
| 分析面板 | bf373e2 | 2026-05 |
| NextAuth OAuth 集成 | d263865 | 2026-05 |
| 用户个人主页 + 收藏功能 | 5c025ad | 2026-05 |

---

## 📋 开发规范

- 分支命名: `feature/xxx`, `fix/xxx`
- Commit 规范: `feat:`, `fix:`, `chore:`, `docs:`
- PR 要求: 至少 1 个 review，CI 通过
- 测试: 关键功能需手动测试后合并

---

*最后更新: 2026-05-11*