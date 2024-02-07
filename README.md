# Password Generator

### Summary



### Story Time

I originally wrote the password generation function in Rust, with wasm-bindgen glue for interfacing from JavaScript, but later learned that as of Manifest V3 (MV3), the unsafe-eval and wasm-eval directives, required for arbitrary WebAssembly code execution, are not allowed within the content_security_policy for Chrome extensions due to security reasons. Sadge.

So in summary, as of Spring 2024, you cannot use WebAssembly in a Chrome extension with MV3 due to the restrictions imposed by the CSP. Developers have attempted to work around this by using different methods to load WebAssembly in MV3, such as using static imports instead of importScripts, but these approaches are hacky at best and face similar limitations due to the CSP restrictions.

https://issuetracker.google.com/issues/40057219?pli=1
