# IndieTools.ai 上线清单

**项目**: https://github.com/flybear16/indietools-ai
**更新时间**: 2026-05-15
**目标**: 快速上线 MVP 版本

---

## 🚀 第一天：部署 & 基础配置

### 1. Vercel 部署

```
已经有 GitHub repo，直接在 Vercel Import 即可
仓库: https://github.com/flybear16/indietools-ai
```

### 2. 配置 Vercel Environment Variables

在 Vercel Dashboard → 项目 → Settings → Environment Variables 添加：

| Key | Value | 说明 |
|-----|-------|------|
| `DATABASE_URL` | Neon PostgreSQL 连接字符串 | `.env` 文件中有 |
| `NEXTAUTH_SECRET` | 随机字符串 | 生成一个 |
| `NEXTAUTH_URL` | `https://indietools.ai` | 生产环境用这个 |
| `GITHUB_CLIENT_ID` | GitHub OAuth App 的 Client ID | 从 GitHub Developer Settings 获取 |
| `GITHUB_CLIENT_SECRET` | GitHub OAuth App 的 Secret | 从 GitHub Developer Settings 获取 |
| `GOOGLE_CLIENT_ID` | Google OAuth 的 Client ID | 还没配置，见下方说明 |
| `GOOGLE_CLIENT_SECRET` | Google OAuth 的 Secret | 还没配置，见下方说明 |
| `STRIPE_SECRET_KEY` | Stripe Secret Key | Stripe Dashboard 获取 |
| `STRIPE_WEBHOOK_SECRET` | Stripe Webhook Secret | 配置 webhook 后获取 |
| `NEXT_PUBLIC_STRIPE_PRICE_PRO_MONTHLY` | Stripe Price ID | 订阅月付的价格 ID |
| `NEXT_PUBLIC_STRIPE_PRICE_PRO_YEARLY` | Stripe Price ID | 订阅年付的价格 ID |
| `RESEND_API_KEY` | Resend API Key | Resend 后台获取 |
| `RESEND_FROM_EMAIL` | `hello@indietools.ai` | 发件邮箱 |

### 3. 域名解析

在域名服务商（你的域名在哪买的）添加 DNS 记录：

```
类型: CNAME
主机: www
目标: cname.vercel-dns.com

类型: CNAME
主机: @ (如果是 @ 需要用 ALIAS 或 ANAME)
目标: vercel-dns.com
```

### 4. Vercel 添加自定义域名

Vercel Dashboard → 项目 → Settings → Domains：
- 添加 `indietools.ai`
- 添加 `www.indietools.ai`

---

## 🔴 上线阻塞项（必须配置）

### 5. Stripe Webhook 配置

1. 登录 [Stripe Dashboard](https://dashboard.stripe.com)
2. 进入 Developers → Webhooks
3. 添加 endpoint：
   - URL: `https://indietools.ai/api/stripe/webhook`
   - Events to listen:
     - `checkout.session.completed`
     - `customer.subscription.created`
     - `customer.subscription.updated`
     - `customer.subscription.deleted`
4. 复制 Webhook Secret，填到 Vercel `STRIPE_WEBHOOK_SECRET`

### 6. Resend 域名验证

1. 登录 [Resend](https://resend.com)
2. 进入 Domains → Add Domain
3. 添加 `indietools.ai`
4. 按照要求添加 DNS 记录（MX、SPF、DKIM）
5. 等待验证通过（通常几分钟）
6. 设置默认发件邮箱：`hello@indietools.ai`

### 7. Google OAuth（可选但推荐）

如果没有 GitHub 登录就用 Google：

1. 打开 [Google Cloud Console](https://console.cloud.google.com/)
2. 创建项目（或选择现有项目）
3. APIs & Services → Credentials → Create OAuth Client ID
4. 设置 Authorized redirect URI: `https://indietools.ai/api/auth/callback/google`
5. 复制 Client ID 和 Secret 到 Vercel

---

## 🟡 强烈建议做

### 8. 搜索平台收录

#### Google Search Console
1. 打开 https://search.google.com/search-console
2. 添加属性（域名验证）
3. 提交 sitemap: `https://indietools.ai/sitemap.xml`

#### Bing Webmaster
1. 打开 https://www.bing.com/webmasters
2. 添加网站
3. 提交 sitemap: `https://indietools.ai/sitemap.xml`

### 9. 测试支付流程

1. 使用 Stripe 测试模式卡片：
   - 卡号: `4242 4242 4242 4242`
   - 到期: 任意未来日期
   - CVC: 任意 3 位数字
2. 测试订阅创建和取消流程

---

## 📋 检查清单

```
部署 & 域名
☐ Vercel 部署完成
☐ 自定义域名解析生效
☐ HTTPS 正常工作

环境变量
☐ DATABASE_URL 配置
☐ NEXTAUTH_SECRET 配置
☐ NEXTAUTH_URL 设为 https://indietools.ai
☐ STRIPE_SECRET_KEY 配置
☐ Stripe webhook 配置完成
☐ Resend API Key + 域名验证
☐ Google OAuth（可选）

功能验证
☐ 首页加载正常
☐ 工具列表显示
☐ 工具详情页正常
☐ 提交工具表单可用
☐ GitHub 登录正常（如已配置）
☐ Stripe 支付流程测试通过

SEO & 分析
☐ Google Search Console 已提交
☐ Bing Webmaster 已提交
☐ GA4 / Vercel Analytics 接入
```

---

## 📞 遇到问题？

| 问题 | 解决方向 |
|------|----------|
| 页面 500 错误 | 检查 Vercel Environment Variables |
| 数据库连接失败 | 确认 DATABASE_URL 正确 |
| Stripe webhook 不生效 | 检查 Webhook URL 和 Secret |
| 登录失败 | 检查 OAuth Client ID/Secret |

---

*明天实践完成后，删除这个清单中的已完成项即可。*