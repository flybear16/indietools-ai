import { Resend } from 'resend';

const getResend = () => {
  if (!process.env.RESEND_API_KEY) {
    throw new Error('RESEND_API_KEY is not configured');
  }
  return new Resend(process.env.RESEND_API_KEY);
};

const FROM_EMAIL = process.env.RESEND_FROM_EMAIL || 'IndieTools <hello@indietools.ai>';
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@indietools.ai';

// ============ 邮件模板 ============

function baseTemplate(content: string) {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { border-bottom: 2px solid #6366f1; padding-bottom: 16px; margin-bottom: 24px; }
    .header h1 { color: #6366f1; margin: 0; font-size: 24px; }
    .card { background: #f9fafb; border-radius: 8px; padding: 20px; margin: 16px 0; }
    .btn { display: inline-block; background: #6366f1; color: white !important; padding: 12px 24px; border-radius: 6px; text-decoration: none; font-weight: 600; }
    .footer { border-top: 1px solid #e5e7eb; margin-top: 32px; padding-top: 16px; color: #6b7280; font-size: 14px; }
  </style>
</head>
<body>
  <div class="header">
    <h1>🛠️ IndieTools.ai</h1>
  </div>
  ${content}
  <div class="footer">
    <p>IndieTools.ai - 发现最好的独立开发者工具</p>
    <p><a href="https://indietools.ai">打开网站</a> · <a href="https://indietools.ai/unsubscribe">取消订阅</a></p>
  </div>
</body>
</html>
  `.trim();
}

// ============ 邮件发送函数 ============

export async function sendToolSubmitNotification(params: {
  toolName: string;
  toolSlug: string;
  submitterEmail: string;
  description: string;
  websiteUrl: string;
  pricingModel: string;
}) {
  const { toolName, toolSlug, submitterEmail, description, websiteUrl, pricingModel } = params;

  const content = `
    <div class="card">
      <h2 style="margin-top: 0;">📮 新工具提交</h2>
      <p><strong>工具名称:</strong> ${toolName}</p>
      <p><strong>Slug:</strong> ${toolSlug}</p>
      <p><strong>定价模式:</strong> ${pricingModel}</p>
      <p><strong>提交者邮箱:</strong> ${submitterEmail}</p>
      <p><strong>网站:</strong> <a href="${websiteUrl}">${websiteUrl}</a></p>
      <p><strong>描述:</strong></p>
      <p>${description}</p>
    </div>
    <p>
      <a href="https://indietools.ai/admin/tools" class="btn">前往后台审核</a>
    </p>
  `;

  try {
    const resend = getResend();
    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: ADMIN_EMAIL,
      subject: `🛠️ 新工具提交: ${toolName}`,
      html: baseTemplate(content),
    });

    if (error) {
      console.error('Resend error:', error);
      return { success: false, error };
    }
    return { success: true, data };
  } catch (err) {
    console.error('Email send error:', err);
    return { success: false, error: err };
  }
}

export async function sendToolReviewNotification(params: {
  toolName: string;
  toolSlug: string;
  userEmail: string;
  status: 'approved' | 'rejected';
  reviewNote?: string;
}) {
  const { toolName, toolSlug, userEmail, status, reviewNote } = params;

  const isApproved = status === 'approved';
  const content = `
    <div class="card">
      <h2 style="margin-top: 0;">${isApproved ? '✅' : '❌'} 工具审核结果</h2>
      <p>您好，</p>
      <p>您提交的工具 <strong>${toolName}</strong> 已被 <strong>${isApproved ? '审核通过' : '拒绝'}</strong>。</p>
      ${reviewNote ? `<p><strong>审核备注:</strong> ${reviewNote}</p>` : ''}
      ${isApproved ? `
        <p>恭喜！您的工具现在已经正式上线 IndieTools.ai，用户可以直接访问和评论。</p>
        <p><a href="https://indietools.ai/tools/${toolSlug}" class="btn">查看工具页面</a></p>
      ` : `
        <p>很抱歉，您的工具暂时未能通过审核。你可以修改后重新提交。</p>
        <p>常见拒绝原因：描述不够详细、链接失效、非独立开发者工具等。</p>
      `}
    </div>
    <p style="color: #6b7280; font-size: 14px;">
      如有疑问，请回复此邮件联系我们。
    </p>
  `;

  try {
    const resend = getResend();
    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: userEmail,
      subject: `${isApproved ? '✅' : '❌'} 您在 IndieTools.ai 提交的工具已审核${isApproved ? '通过' : '拒绝'}`,
      html: baseTemplate(content),
    });

    if (error) {
      console.error('Resend error:', error);
      return { success: false, error };
    }
    return { success: true, data };
  } catch (err) {
    console.error('Email send error:', err);
    return { success: false, error: err };
  }
}

export async function sendNewsletter(params: {
  subscribers: string[];
  subject: string;
  content: string;
}) {
  const { subscribers, subject, content } = params;

  if (subscribers.length === 0) {
    return { success: true, sent: 0 };
  }

  const html = baseTemplate(content);

  try {
    const resend = getResend();
    // 并行发送，但限制并发数避免 Resend 限流
    const BATCH_SIZE = 10;
    let sent = 0;
    let failed = 0;

    for (let i = 0; i < subscribers.length; i += BATCH_SIZE) {
      const batch = subscribers.slice(i, i + BATCH_SIZE);
      const results = await Promise.allSettled(
        batch.map((to) =>
          resend.emails.send({
            from: FROM_EMAIL,
            to,
            subject,
            html,
          })
        )
      );
      sent += results.filter((r) => r.status === 'fulfilled').length;
      failed += results.filter((r) => r.status === 'rejected').length;
    }

    return { success: true, sent, failed };
  } catch (err) {
    console.error('Newsletter send error:', err);
    return { success: false, error: err };
  }
}
