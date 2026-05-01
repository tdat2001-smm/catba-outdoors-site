#!/usr/bin/env node
// Fetch the most recent chat_id(s) the bot has seen, so you know what
// to set as TELEGRAM_CHAT_ID. Send any message to your bot first
// (or add it to a group and post a message there), then run:
//   TELEGRAM_BOT_TOKEN=... node scripts/telegram-get-chat-id.js

const token = process.env.TELEGRAM_BOT_TOKEN;
if (!token) {
  console.error('Missing TELEGRAM_BOT_TOKEN env var.');
  process.exit(1);
}

(async () => {
  const r = await fetch(`https://api.telegram.org/bot${token}/getUpdates`);
  const body = await r.json();
  if (!body.ok) {
    console.error('Telegram API error:', body);
    process.exit(1);
  }
  if (!body.result.length) {
    console.log('No updates yet. Send /start to your bot (or post in your group), then re-run.');
    return;
  }
  const seen = new Map();
  for (const u of body.result) {
    const chat = u.message?.chat || u.channel_post?.chat || u.my_chat_member?.chat;
    if (chat) seen.set(chat.id, chat);
  }
  console.log('Chats seen by this bot:');
  for (const [id, chat] of seen) {
    const label = chat.title || [chat.first_name, chat.last_name].filter(Boolean).join(' ') || chat.username || '(no name)';
    console.log(`  ${id}\t${chat.type.padEnd(8)}\t${label}`);
  }
})();
