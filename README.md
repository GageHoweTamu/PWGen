# PWGen

This is an open-source project, and is open to collaborators! If it's your first time collaborating on a browser extension/JS project, see LEARN.md and CONTRIBUTING.md f.or resources. If you have questions, don't hesitate to reach out at howe.gaged@gmail.com

## Summary

<img width="283" alt="Screenshot 2024-02-07 at 11 37 24 AM" src="https://github.com/GageHoweTamu/PWGen/assets/116420022/af5cc489-c6ba-45a5-849f-a9e7fc156635">

PWGen is a password generator that takes three parameters: your current website, an email or username, and a password. The algorithm is deterministic, meaning it always results to the same password. This means PWGen never stores your passwords; they will be generated again with your `main password` as a key. Protect your with your life, and don't tell anyone! :)

PWGen saves your email and automatically populates the website box, meaning you can quickly generate passwords from your `main password`.

## Code

```
foo
```

## TODO

Build and test for Firefox-based browsers; add features; market to a general audience

## Story Time

I originally wrote the password generation function in Rust, with wasm-bindgen glue for interfacing from JavaScript, but later learned that as of Manifest V3 (MV3), the unsafe-eval and wasm-eval directives, required for arbitrary WebAssembly code execution, are not allowed within the content_security_policy for Chrome extensions due to security reasons. Sadge.

So in summary, as of Spring 2024, you cannot use WebAssembly in a Chrome extension with MV3 due to the restrictions imposed by the CSP. Developers have attempted to work around this by using different methods to load WebAssembly in MV3, such as using static imports instead of importScripts, but these approaches are hacky at best and face similar limitations due to the CSP restrictions.

https://issuetracker.google.com/issues/40057219?pli=1

https://github.com/GoogleChrome/chrome-extensions-samples/issues/775
