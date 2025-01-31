const { google } = require("googleapis");
const { authorize } = require("./authorize");

async function getEmails() {
  const auth = await authorize();
  const gmail = google.gmail({ version: "v1", auth });

  const res = await gmail.users.messages.list({
    userId: "me",
    q: "from:notifications@replit.com after:2025/01/15",
    maxResults: 1,
  });

  if (!res.data.messages || res.data.messages.length === 0) {
    console.log("No emails found.");
    return;
  }

  const messageId = res.data.messages[0].id;
  const message = await gmail.users.messages.get({
    userId: "me",
    id: messageId,
  });

  console.log("Email Snippet:", message.data.payload.body);
  const decodedData = Buffer.from(message.data.payload.body.data, 'base64').toString('utf-8');

console.log("\nData Snippet:", decodedData);
}

getEmails();
