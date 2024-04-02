// main.js

// import init, { generate_password } from './static/wasm.js';


const websiteInput = document.getElementById('website');
const emailInput = document.getElementById('email');
const keyInput = document.getElementById('key');
const copyButton = document.getElementById('copy-password'); // Updated ID
const messageElement = document.getElementById('message');

async function generate_password(email, website, key) {
  const input = email + website + key;
  const encoder = new TextEncoder();
  const data = encoder.encode(input);
  const hash = await window.crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hash)); 
  let password = btoa(String.fromCharCode.apply(null, hashArray)).substring(0, 10); // Convert to base64 and truncate

  const numbers = '123456789';
  const symbols = '!?.:;_^,';

  const numberIndex = hashArray[hashArray.length - 2] % numbers.length;
  const symbolIndex = hashArray[hashArray.length - 1] % symbols.length;

  password += numbers[numberIndex];
  password += symbols[symbolIndex];

  console.log('printing from main.js, password: ', password);

  return password;
}

// Function to get the current tab's URL
async function getCurrentTabUrl() {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  return clean_url(tab.url);
}

async function saveEmail(email) {
  console.log('saveEmail() called');
  await chrome.storage.local.set({ 'email': email });
}

async function autofillEmail() {
  const data = await chrome.storage.local.get('email');
  const savedEmail = data.email || '';
  emailInput.value = savedEmail;
}

getCurrentTabUrl().then(url => {
  websiteInput.value = url;
});

window.addEventListener('load', async () => {
  websiteInput.value = await getCurrentTabUrl();
  await autofillEmail();
});

emailInput.addEventListener('input', async () => {
  await saveEmail(emailInput.value);
});

function clean_url(url) {
  const urlObj = new URL(url);
  const domain = urlObj.hostname.split('.').slice(-2).join('.');
  return domain;
}

copyButton.addEventListener('click', async () => {
  const website = websiteInput.value.trim();
  const email = emailInput.value.trim();
  const key = keyInput.value.trim();

  if (!website || !email || !key) {
    messageElement.textContent = 'Please fill all fields!';
    return;
  }
  try {
    console.log('1');
    const password = await generate_password(website, email, key);
    console.log('2');
    saveEmail(email);
    console.log('4');
    await navigator.clipboard.writeText(password);
    messageElement.textContent = 'Password copied to clipboard!';
    console.log('Password copied to clipboard');
  } catch (error) {
    messageElement.textContent = 'Error generating password';
    console.error('Error generating password:', error);
  }
});