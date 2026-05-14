# API Keys 配置状态

**更新时间**: 2026-05-14

---

## ✅ 已配置

| Key | 用途 | 状态 | 位置 |
|-----|------|------|------|
| `STRIPE_SECRET_KEY` | Stripe 支付 | ✅ 已配置 | `.env` |
| `STRIPE_WEBHOOK_SECRET` | Webhook 验签 | ✅ 已配置 | `.env` |
| `STRIPE_PRICE_ID_SUB` | Pro 订阅价格 | ✅ 已配置 | `.env` |
| `STRIPE_PRICE_ID_BOOST` | Boost 加速价格 | ✅ 已配置 | `.env` |
| `RESEND_API_KEY` | 邮件发送 | ✅ 已配置 | `.env` |
| `NEXTAUTH_SECRET` | Session 加密 | ✅ 已配置 | `.env` |
| `NEXTAUTH_URL` | 回调地址 | ✅ 已配置 | `.env` |
| `DATABASE_URL` | PostgreSQL | ✅ 已配置 | `.env` |

---

## ⚠️ 部分配置（需补充）

| Key | 用途 | 状态 | 如何获取 |
|-----|------|------|----------|
| `GITHUB_CLIENT_ID` | GitHub OAuth | ✅ 已配置 | GitHub Developer Settings |
| `GITHUB_CLIENT_SECRET` | GitHub OAuth | ✅ 已配置 | GitHub Developer Settings |
| `GOOGLE_CLIENT_ID` | Google OAuth | ❌ 未配置 | Google Cloud Console → OAuth 2.0 |
| `GOOGLE_CLIENT_SECRET` | Google OAuth | ❌ 未配置 | Google Cloud Console → OAuth 2.0 |

### Google OAuth 配置步骤
1. 打开 [Google Cloud Console](https://console.cloud.google.com/)
2. 创建项目（或选择现有项目）
3. 进入 **APIs & Services → Credentials**
4. 创建 **OAuth 2.0 Client ID**
5. 设置 Authorized redirect URI: `https://indietools.ai/api/auth/callback/google`
6. 复制 Client ID 和 Secret 到 `.env`

---

## ❌ 未申请

| API | 用途 | 推荐方案 | 申请链接 |
|-----|------|----------|----------|
| OpenAI API | AI 工具推荐 | GPT-4o 调用 | https://platform.openai.com/ |
| SerpAPI | 搜索功能 | 替代 Google Custom Search | https://serpapi.com/ |

---

## 🔒 安全注意

- 所有 `.env` 文件已加入 `.gitignore`，不会提交到 GitHub
- 生产环境使用 Vercel Environment Variables
- 定期轮换 API Keys