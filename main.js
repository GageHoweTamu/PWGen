// main.js

import init, { generate_password } from './static/wasm.js';

const websiteInput = document.getElementById('website');
const emailInput = document.getElementById('email');
const keyInput = document.getElementById('key');
const copyButton = document.getElementById('copyButton');

// Function to get the current tab's URL
async function getCurrentTabUrl() {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  return tab.url;
}

// Function to save the email to local storage
async function saveEmail(email) {
  await chrome.storage.local.set({ 'email': email });
}

// Function to retrieve the email from local storage and autofill
async function autofillEmail() {
  const data = await chrome.storage.local.get('email');
  const savedEmail = data.email || '';
  emailInput.value = savedEmail;
}

// Autofill the current website
getCurrentTabUrl().then(url => {
  websiteInput.value = url;
});

// Autofill the email if it's saved in local storage
autofillEmail();

copyButton.addEventListener('click', async () => {
  await init();

  const website = websiteInput.value.trim();
  const email = emailInput.value.trim();
  const key = keyInput.value.trim();

  if (website === '' || email === '' || key === '') {
    alert('Please fill all fields');
    return;
  }

  const password = generate_password(email, website, key);

  // Save the email to local storage
  saveEmail(email);

  // You can do whatever you want with the generated password here
  // For example, you can copy it to the clipboard
  navigator.clipboard.writeText(password);
  alert('Password copied to clipboard!');
});
