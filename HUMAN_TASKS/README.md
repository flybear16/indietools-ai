# 人工待办事项清单

> 所有需要飞熊人工介入/决策的任务，按优先级排列，标注 AI 辅助能力。

**更新时间**: 2026-05-14
**项目**: IndieTools.ai

---

## 🔴 必须在人工操作前配置的服务

> ⚠️ 这些需要账号注册、身份验证，AI 无法代替

### 1. Stripe 配置 ✅ 已完成（开发者侧）
| 任务 | 状态 | 关联文件 |
|------|------|----------|
| Stripe 账号注册 | ✅ 已完成 | - |
| Webhook 端点配置 | ✅ 已完成 | Stripe Dashboard |
| 产品/价格 ID 配置 | ✅ 已完成 | `.env` |
| **需要人工**：测试支付流程，验证 Webhook 回调 | ⏳ 待做 | `app/api/stripe/webhook/route.ts` |

### 2. Resend 邮件配置 ✅ 已完成（开发者侧）
| 任务 | 状态 | 关联文件 |
|------|------|----------|
| Resend API Key 配置 | ✅ 已完成 | `.env` |
| 域名验证 (indietools.ai) | ⚠️ 待操作 | Resend Dashboard |
| **需要人工**：验证发件邮箱域名所有权 | ⏳ 待做 | Resend → Domains |

### 3. OAuth 社交登录
| 任务 | 状态 | 关联文件 |
|------|------|----------|
| GitHub OAuth App 注册 | ✅ 已完成 | - |
| Google OAuth App 注册 | ⚠️ 待配置 | Google Cloud Console |
| **需要人工**：在 Google Cloud Console 创建 OAuth 2.0 客户端 | ⏳ 待做 | `.env` → `GOOGLE_CLIENT_ID` |

### 4. 第三方 API Keys（后续添加）
| API | 用途 | 状态 |
|-----|------|------|
| OpenAI API | AI 工具推荐/评分 | ❌ 未申请 |
| SerpAPI / Google Search API | 搜索功能 | ❌ 未申请 |

---

## 🟡 AI 可以辅助，但需要人工确认/操作

### 1. 搜索平台收录
| 任务 | AI 能做什么 | 人工需要做什么 |
|------|-------------|----------------|
| Google Search Console 提交 sitemap | 生成提交URL格式 | 手动登录添加 sitemap |
| Bing Webmaster Tools 提交 | 生成提交URL格式 | 手动登录添加 |
| Google Analytics 4 接入 | 生成 gtag 代码片段 | 手动复制到 HTML head |
| Google Tag Manager 接入 | 生成容器代码 | 手动创建 GTM 账号 |

### 2. 内容运营
| 任务 | AI 能做什么 | 人工需要做什么 |
|------|-------------|----------------|
| 博客文章写作（每周1-2篇）| ✅ 完全可以 AI 辅助生成初稿 | 人工审核、补充亲测体验 |
| Newsletter 周刊内容 | ✅ AI 生成工具推荐列表 | 人工确认发送列表 |
| 社交媒体文案（Twitter/X）| ✅ AI 生成多版本 | 人工发布 |

### 3. 联盟计划注册
| 计划 | AI 能做什么 | 人工需要做什么 |
|------|-------------|----------------|
| GitHub Copilot Affiliate | ✅ 帮写申请文案 | 手动注册、填表 |
| Cursor Referral | ✅ 帮写推广文案 | 手动注册 |
| Vercel Partner | ✅ 帮写合作申请 | 手动注册 |
| Supabase Partner | ✅ 帮写合作申请 | 手动注册 |
| Semrush / Ahrefs | ✅ 帮写申请邮件 | 手动注册（高门槛）|

---

## 🟢 低优先级人工任务

### 1. 域名相关
| 任务 | 说明 |
|------|------|
| DNS 配置确认 | 确认 www/cname 指向 Vercel |
| 域名续费 | 监控过期时间 |

### 2. 托管平台
| 任务 | 说明 |
|------|------|
| Vercel 团队邀请成员 | 可选 |
| Vercel Analytics 开启 | 可选，已有 GA4 |

### 3. 监控报警
| 任务 | 说明 |
|------|------|
| 设置 Uptime Robot 监控 | 免费监控服务 |
| 配置 Errortracking (Sentry) | 可选 |

---

## 📁 文件夹说明

```
HUMAN_TASKS/
├── README.md              # 本文件
├── api-keys-checklist.md # API Key 配置状态
├── affiliate-steps.md    # 联盟计划注册详细步骤
├── content-calendar.md   # 内容运营日历（博客/Newsletter）
└── seo-submission-guide.md # 搜索平台提交指南
```

---

## 🤖 AI 辅助工作流

### 场景1：写一篇博客文章
1. AI 生成初稿（基于工具数据 + SEO 关键词）
2. AI 生成配图建议
3. 人工审核内容准确性
4. 人工发布到博客

### 场景2：注册联盟计划
1. AI 帮助了解各联盟计划要求
2. AI 生成申请邮件/文案
3. 人工注册、填表、提交

### 场景3：提交 sitemap 到搜索平台
1. AI 生成提交链接和操作步骤
2. 人工登录平台操作

---

*最后更新: 2026-05-14*