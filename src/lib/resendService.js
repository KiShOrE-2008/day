const RESEND_API_KEY =
  import.meta.env.VITE_RESEND_API_KEY ||
  import.meta.env.RESEND_API_KEY ||
  '';

export async function sendResendThankYouEmail({
  toEmail,
  recipientName,
  replyMessage,
  originalMessage,
}) {
  if (!toEmail) {
    throw new Error('Recipient email address is missing.');
  }

  if (!RESEND_API_KEY) {
    console.warn('Resend API key missing in environment. Email simulated.');
    return { success: true, simulated: true };
  }

  const htmlContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: 'Georgia', serif; background-color: #080808; color: #F5F1EA; margin: 0; padding: 20px; }
          .card { max-width: 550px; margin: 0 auto; background-color: #121212; border: 1px solid #333; border-radius: 24px; padding: 32px; box-shadow: 0 20px 40px rgba(0,0,0,0.8); }
          .badge { display: inline-block; padding: 4px 12px; background-color: rgba(183, 110, 121, 0.2); border: 1px solid rgba(183, 110, 121, 0.4); color: #E89CA7; border-radius: 20px; font-size: 12px; font-family: monospace; text-transform: uppercase; margin-bottom: 16px; }
          h2 { font-size: 24px; color: #F5F1EA; margin-top: 0; }
          .reply-box { background-color: rgba(183, 110, 121, 0.12); border-left: 4px solid #B76E79; padding: 18px; border-radius: 12px; margin: 20px 0; font-size: 16px; line-height: 1.6; color: #F5F1EA; }
          .original-quote { background-color: rgba(255,255,255,0.04); border-radius: 12px; padding: 14px; margin-top: 24px; font-size: 13px; color: rgba(245,241,234,0.6); font-style: italic; }
          .footer { margin-top: 28px; text-align: center; font-size: 12px; color: rgba(245,241,234,0.4); font-family: monospace; }
        </style>
      </head>
      <body>
        <div class="card">
          <div class="badge">A Note From Sowmiyaa ❤️</div>
          <h2>Hi ${recipientName || 'Friend'}! 🥰</h2>
          <p style="color: rgba(245,241,234,0.8); font-size: 15px; line-height: 1.6;">
            Thank you so much for leaving a birthday wish on my website! Here is a personal message from me to you:
          </p>

          <div class="reply-box">
            "${replyMessage || 'Thank you so much for your beautiful birthday wish! You made my day extra special! ❤️'}"
          </div>

          ${
            originalMessage
              ? `
            <div class="original-quote">
              <strong>Your Original Wish:</strong><br/>
              "${originalMessage}"
            </div>
          `
              : ''
          }

          <div class="footer">
            Sowmiyaa's Birthday Celebration ❤️
          </div>
        </div>
      </body>
    </html>
  `;

  const payload = {
    from: 'Sowmiyaa Birthday <onboarding@resend.dev>',
    to: [toEmail],
    subject: `Thank you for the birthday wish! ❤️ — Sowmiyaa`,
    html: htmlContent,
  };

  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${RESEND_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  const resData = await response.json().catch(() => ({}));

  if (!response.ok) {
    console.error('Resend API error response:', resData);
    throw new Error(resData.message || resData.name || 'Failed to send email via Resend API.');
  }

  return { success: true, data: resData };
}
