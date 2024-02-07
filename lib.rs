// lib.rs
// Compile with "wasm-pack build --target web --out-name wasm --out-dir ./static"

use sha2::{Digest, Sha256};
use wasm_bindgen::prelude::*;

#[wasm_bindgen]
pub fn generate_password(email: &str, website: &str, key: &str) -> String {
    let input = format!("{}{}{}", email, website, key);
    let mut hasher = Sha256::new();
    hasher.update(input);
    let result = hasher.finalize();

    let password = format!("{:x}", result);

    println!("printing from lib.rs, password: {}", password);

    password
}