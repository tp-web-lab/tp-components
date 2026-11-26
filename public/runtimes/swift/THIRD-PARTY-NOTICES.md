# Third-party notices

This project is MIT-licensed. It vendors, consumes, or links against the following
third-party work.

## The Swift toolchain (vendored at runtime)

`toolchain/swift-frontend.wasm`, `toolchain/wasm-ld.wasm` and
`toolchain/swift-sysroot-core.tar` are downloaded from the
[`swift-toolchain-wasm`](https://github.com/tothambrus11/swift-toolchain-wasm) release
`swift-6.3.3-wasm` and are **not** committed to this repository.

They contain the Swift compiler and standard library, LLVM, compiler-rt and wasi-libc.

- **Swift** — Copyright the Swift project authors. Apache License 2.0 **with the Swift
  Runtime Library Exception**. <https://github.com/swiftlang/swift/blob/main/LICENSE.txt>
- **LLVM / Clang** — Apache License 2.0 with LLVM Exceptions.
  <https://llvm.org/LICENSE.txt>
- **wasi-libc / wasi-sdk** — Apache License 2.0 with LLVM Exceptions / MIT.
  <https://github.com/WebAssembly/wasi-libc>

## `swift-toolchain-wasm`

The build scripts, patches and release process that produce the artifacts above.

- Copyright the `swift-toolchain-wasm` authors.
- Apache License 2.0.
- <https://github.com/tothambrus11/swift-toolchain-wasm>

## `@bjorn3/browser_wasi_shim`

The browser WASI implementation used to run the toolchain and the compiled programs.

- Copyright bjorn3 and contributors.
- MIT OR Apache-2.0.
- <https://github.com/bjorn3/browser_wasi_shim>

## `esbuild`

Used at build time only, to produce the IIFE bundles.

- Copyright esbuild contributors.
- MIT License.
- <https://github.com/evanw/esbuild>
