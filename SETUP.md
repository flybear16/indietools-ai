# IndieTools.ai 运营配置手册

**最后更新**: 2026-05-13
**项目**: https://github.com/flybear16/indietools-ai

---

## 🚀 新环境部署（首次运行）

### 1. 安装依赖
```bash
cd ~/ws2026/indietools-ai
npm install
```

### 2. 配置环境变量
复制 `.env.local.example`（如果存在）创建 `.env.local`，或手动添加：

```bash
# Database (Neon PostgreSQL)
DATABASE_URL="postgresql://user:password@ep-xxx.aws.us-east-1.neon.tech/indietools"

# NextAuth OAuth (必须)
NEXTAUTH_URL="https://indietools.ai"
NEXTAUTH_SECRET="生成命令: openssl rand -base64 32"
GITHUB_ID="从 GitHub Developer Settings 获取"
GITHUB_SECRET="从 GitHub Developer Settings 获取"
GOOGLE_ID="从 Google Cloud Console 获取"
GOOGLE_SECRET="从 Google Cloud Console 获取"

# Stripe 支付 (必须)
STRIPE_SECRET_KEY="sk_test_xxx 或 sk_live_xxx"
STRIPE_WEBHOOK_SECRET="whsec_xxx"
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_xxx 或 pk_live_xxx"

# Resend 邮件 (可选，MVP 阶段可跳过)
RESEND_API_KEY="re_xxx"
RESEND_FROM_EMAIL="hello@indietools.ai"
ADMIN_EMAIL="admin@indietools.ai"

# Vercel Analytics (可选)
VERCEL_ANALYTICS_ID="从 Vercel 获取"
```

### 3. GitHub OAuth App 创建
1. 打开 https://github.com/settings/developers
2. New OAuth App
   - Application name: `IndieTools.ai`
   - Homepage URL: `https://indietools.ai`
   - Callback URL: `https://indietools.ai/api/auth/callback/github`
3. 生成 Client ID 和 Secret

### 4. Google OAuth 创建
1. 打开 https://console.cloud.google.com
2. 新建项目 → APIs & Services → Credentials
3. 创建 OAuth 2.0 Client ID
4. Authorized redirect URI: `https://indietools.ai/api/auth/callback/google`

### 5. Stripe 配置
1. 打开 https://dashboard.stripe.com
2. 获取 API Keys (test mode → live mode)
3. 配置 Webhooks:
   - `https://indietools.ai/api/stripe/webhook`
   - Events: `checkout.session.completed`, `invoice.payment_succeeded`, `customer.subscription.deleted`, `customer.subscription.created`, `customer.subscription.updated`

4. 创建订阅产品（Pro Monthly / Pro Yearly）:
   - Products → Add Product → Subscription
   - 月费 $9/月，年费 $89/年
   - 获取 Price ID 添加到环境变量

### 6. Stripe Pro 订阅价格配置
在 `.env.local` 中添加:
```bash
# Stripe Price IDs (从 Stripe Dashboard 获取)
NEXT_PUBLIC_STRIPE_PRICE_PRO_MONTHLY="price_xxx"
NEXT_PUBLIC_STRIPE_PRICE_PRO_YEARLY="price_xxx"
```

### 7. Vercel 部署

#### 连接 GitHub
1. 打开 https://vercel.com/new
2. Import GitHub repository: `flybear16/indietools-ai`
3. Framework: Next.js
4. Environment Variables: 添加所有 `.env.local` 中的变量
5. Deploy

#### 域名配置
1. Vercel → Settings → Domains
2. 添加 `indietools.ai`
3. 按提示配置 DNS 记录

---

## 📧 Resend 邮件配置

### 获取 API Key
1. 打开 https://resend.com
2. 注册/登录账号
3. API Keys → Create API Key
4. 在 `.env.local` 中添加:
   ```bash
   RESEND_API_KEY="re_xxxxx"
   RESEND_FROM_EMAIL="hello@indietools.ai"
   ADMIN_EMAIL="your-email@example.com"
   ```

### 添加域名（可选）
1. 在 Resend 控制台添加域名 `indietools.ai`
2. 配置 DNS 记录（SPF、DKIM、DMARC）
3. 验证后会显示验证状态

---

## 🔍 SEO - 提交 sitemap 到搜索引擎

### Google Search Console
1. 打开 https://search.google.com/search-console
2. 添加 property: `indietools.ai`
3. 验证域名所有权（DNS / HTML 文件 / GA）
4. 进入 "Sitemaps" 菜单
5. 输入: `sitemap.xml`
6. 点击提交

### Bing Webmaster
1. 打开 https://www.bing.com/webmasters
2. 添加网站: `indietools.ai`
3. 验证域名所有权
4. 进入 "Sitemaps" → 提交: `https://indietools.ai/sitemap.xml`

### 自动提交脚本（可选）
```bash
cd ~/ws2026/indietools-ai
node scripts/submit-sitemap.js
```

---

## 💰 Stripe 订阅配置

### 创建订阅产品
1. 在 Stripe Dashboard 创建产品/价格:
   - **Pro Monthly**: $9/month
   - **Pro Yearly**: $89/year (省 $19)
2. 获取 Price ID，添加到代码

### Webhook 本地测试
```bash
# 使用 Stripe CLI
stripe listen --forward-to localhost:3000/api/stripe/webhook
```

---

## 🚢 Vercel 部署

### 连接 GitHub
1. 打开 https://vercel.com/new
2. Import GitHub repository: `flybear16/indietools-ai`
3. Framework: Next.js
4. Environment Variables: 添加所有 `.env.local` 中的变量
5. Deploy

### 域名配置
1. Vercel → Settings → Domains
2. 添加 `indietools.ai`
3. 按提示配置 DNS 记录

---

## 🔧 日常维护

### 查看日志
```bash
# Vercel
vercel logs indietools-ai

# 本地开发
npm run dev
```

### 数据库迁移
```bash
npm run db:push      # 推送 schema 到数据库
npm run db:studio    # 查看数据库结构（Drizzle Studio）
```

### 构建测试
```bash
npm run build        # 生产构建
npm run lint         # ESLint 检查
```

---

## 📋 待手动完成的任务清单

| 优先级 | 任务 | 状态 |
|--------|------|------|
| 🔴 高 | GitHub OAuth App | ⬜ 未创建 |
| 🔴 高 | Google OAuth | ⬜ 未创建 |
| 🔴 高 | Stripe 账号配置（产品+Price ID） | ⬜ 未完成 |
| 🟡 中 | Resend API Key | ⬜ 未配置 |
| 🟡 中 | Google Search Console 提交 sitemap | ⬜ 未提交 |
| 🟡 中 | Bing Webmaster 提交 sitemap | ⬜ 未提交 |
| 🟢 低 | Vercel 部署 | ⬜ 未完成 |
| 🟢 低 | Vercel 域名绑定 | ⬜ 未完成 |
| 🟢 低 | Resend 域名验证 | ⬜ 可选 |

### Pro 订阅功能配置

完成代码部署后，还需要手动配置：

1. **在 Stripe 创建两个订阅产品**:
   - `Pro Monthly` - $9/月
   - `Pro Yearly` - $89/年（相当于 $7.42/月）


2. **将 Price ID 添加到环境变量**:
   ```bash
   NEXT_PUBLIC_STRIPE_PRICE_PRO_MONTHLY="price_xxx"
   NEXT_PUBLIC_STRIPE_PRICE_PRO_YEARLY="price_xxx"
   ```


3. **配置 Stripe Webhook 事件**:
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`

---

## 📞 联系方式

- 项目 Repo: https://github.com/flybear16/indietools-ai
- 生产地址: https://indietools.ai（待配置）

---

*配置完成后删除本文件的安全敏感信息*