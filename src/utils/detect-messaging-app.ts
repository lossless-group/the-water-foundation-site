export function isMessagingApp(userAgent: string): boolean {
  if (!userAgent) return false;
  
  // Common messaging app user agent patterns
  const messagingAppPatterns = [
    /WhatsApp/i,
    /iMessage/i,
    /Messenger\/[0-9.]/i,
    /FBAN\/MessengerForiOS/i,
    /Telegram/i,
    /Slack/i,
    /Discord/i,
    /Viber/i,
    /WeChat/i,
    /Line\//i,
    /KakaoTalk/i
  ];

  return messagingAppPatterns.some(pattern => pattern.test(userAgent));
}
