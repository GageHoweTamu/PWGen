// lib.rs
// Compile with "wasm-pack build --target web --out-name wasm --out-dir ./static"

use std::ffi::{CStr, CString};
use std::os::raw::c_char;
use sha2::{Digest, Sha256};

// GENERATE_PASSWORD FUNCTION: TAKES EMAIL, WEBSITE, AND KEY AS INPUT AND RETURNS A PASSWORD

#[no_mangle] // makes sure the function is called `generate_password` in the wasm
pub extern "C" fn generate_password(email_ptr: *const c_char, website_ptr: *const c_char, key_ptr: *const c_char) -> *mut c_char {
    let email_cstr = unsafe { CStr::from_ptr(email_ptr) };
    let website_cstr = unsafe { CStr::from_ptr(website_ptr) };
    let key_cstr = unsafe { CStr::from_ptr(key_ptr) };

    let email = email_cstr.to_str().expect("Invalid UTF-8 in email");
    let website = website_cstr.to_str().expect("Invalid UTF-8 in website");
    let key = key_cstr.to_str().expect("Invalid UTF-8 in key");

    let input = format!("{}{}{}", email, website, key);
    let mut hasher = Sha256::new();
    hasher.update(input);
    let result = hasher.finalize();

    let password = format!("{:x}", result);
    CString::new(password).unwrap().into_raw()
}