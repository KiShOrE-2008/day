/**
 * Email Notification Service powered by FormSubmit (submissions@formsubmit.co)
 * Sends notification emails when Sowmiya answers the proposal.
 */

export async function sendProposalNotificationEmail({ answer, note }) {
  const recipientEmail = import.meta.env.VITE_NOTIFICATION_EMAIL || 'kv.kishorevijay@gmail.com';

  const isYes = answer === 'YES' || answer === 'ACCEPTED';
  const subject = isYes
    ? '💖 PROPOSAL ACCEPTED! Sowmiya Said YES! 🎉'
    : '💭 Proposal Update: Sowmiya requested more time';

  const payload = {
    _subject: subject,
    _captcha: 'false',
    _template: 'table',
    "Question": "Will You Walk This Journey With Me Forever?",
    "Answer": isYes ? "YES! I'D LOVE TO! 💖" : "I need a little more time 💭",
    "Submitted At": new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }),
    "Status": isYes ? "Accepted 🎉" : "Pending 💭",
    "Details": note || (isYes ? "Sowmiya accepted the proposal on the birthday story site!" : "Sowmiya selected: I need a little more time.")
  };

  try {
    const response = await fetch(`https://formsubmit.co/ajax/${recipientEmail}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error sending FormSubmit notification:', error);
    return null;
  }
}
