// main.js

import { generate_password } from './static/wasm.js';

const websiteInput = document.getElementById('website');
const emailInput = document.getElementById('email');
const keyInput = document.getElementById('key');
const copyButton = document.getElementById('copy-password'); // Updated ID

// Function to get the current tab's URL
async function getCurrentTabUrl() {
  console.log('getCurrentTabUrl() called');
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  console.log('getCurrentTabUrl() returned ', tab.url);
  return clean_url(tab.url); // why does this not work? Error: Uncaught (in promise) TypeError: Cannot read properties of undefined (reading '__wbindgen_add_to_stack_pointer')
  // return tab.url;
}

async function saveEmail(email) {
  console.log('saveEmail() called');
  await chrome.storage.local.set({ 'email': email });
}

async function autofillEmail() {
  console.log('autofillEmail() called');
  const data = await chrome.storage.local.get('email');
  const savedEmail = data.email || '';
  emailInput.value = savedEmail;
}

getCurrentTabUrl().then(url => {
  websiteInput.value = url;
  console.log('getCurrentTabUrl() returned', url);
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

copyButton.addEventListener('click', async () => { // generate and copy password
  const website = websiteInput.value.trim();
  const email = emailInput.value.trim();
  const key = keyInput.value.trim();

  if (!website || !email || !key) {
    alert('Please fill all fields');
    return;
  }

  const password = await new Promise(resolve => {
    const result = generate_password(email, website, key);
    resolve(result);
  });

  await saveEmail(email);

  navigator.clipboard.writeText(password).then(function() {
    alert('Password copied to clipboard!');
    console.log('Password copied to clipboard');
  }, function(err) {
    console.error('Could not copy text: ', err);
  });
});