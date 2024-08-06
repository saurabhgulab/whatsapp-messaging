const fs = require("fs");
const xlsx = require("xlsx");
const { Client } = require("whatsapp-web.js");
const qrcode = require("qrcode-terminal");

// Function to read phone numbers and messages from Excel
function readExcel(filePath) {
  const workbook = xlsx.readFile(filePath);
  const sheetName = workbook.SheetNames[0];
  const sheet = workbook.Sheets[sheetName];
  return xlsx.utils.sheet_to_json(sheet);
}

// Function to send messages
function sendMessages(client, contacts) {
  contacts.forEach((contact) => {
    const number = contact["Phone Number"];
    const message = contact["Message"];
    const chatId = `${number}@c.us`; // WhatsApp format for phone number

    client
      .sendMessage(chatId, message)
      .then((response) => {
        console.log(`Message sent to ${number}`);
      })
      .catch((err) => {
        console.error(`Failed to send message to ${number}`, err);
      });
  });
}

// Initialize WhatsApp client
function initializeWhatsApp() {
  const client = new Client();

  client.on("qr", (qr) => {
    qrcode.generate(qr, { small: true });
    console.log("QR code received, scan it with your phone");
  });

  client.on("ready", () => {
    console.log("Client is ready!");

    // Read the Excel file
    const contacts = readExcel("contacts.xlsx");

    // Send messages
    sendMessages(client, contacts);
  });

  client.initialize();
}

// Start the WhatsApp client initialization
initializeWhatsApp();
