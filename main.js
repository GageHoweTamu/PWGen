// main.js

import init, { generate_password } from './static/wasm.js';

await init();



const websiteInput = document.getElementById('website');
const emailInput = document.getElementById('email');
const keyInput = document.getElementById('key');
const copyButton = document.getElementById('copy-password'); // Updated ID

async function loadWasmModule() {
  const response = await fetch('path_to_your_wasm_file.wasm');
  const bytes = await response.arrayBuffer();
  const module = await WebAssembly.compile(bytes);
  const instance = new WebAssembly.Instance(module, imports);

  // You can now use the instance to call your WASM functions
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

function clean_url(url) { // Cleans urls: eg. https://github.com/GageHoweTamu/PWGen -> github.com
  const start = url.indexOf("://") >= 0 ? url.indexOf("://") + 3 : 0;
  const end = url.slice(start).indexOf('/') >= 0 ? url.slice(start).indexOf('/') : url.length - start;
  return url.slice(start, start + end);


}

copyButton.addEventListener('click', async () => {
  const website = websiteInput.value.trim();
  const email = emailInput.value.trim();
  const key = keyInput.value.trim();

  if (!website || !email || !key) {
    alert('Please fill all fields');
    return;
  }

  try {
    console.log('1');
    const password = await generate_password(website, email, key);
    console.log('2');
    saveEmail(email);
    console.log('4');
    await navigator.clipboard.writeText(password);
    console.log('4');
    alert('Password copied to clipboard!');
    console.log('Password copied to clipboard');
  } catch (error) {
    console.error('Error generating password:', error);
  }
});