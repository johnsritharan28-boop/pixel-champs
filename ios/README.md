# Native iOS Build

This folder documents the generated iOS target location.

From the repository root on a Mac with Node.js installed:

```bash
npm install
npm run ios:prepare
npm run ios:sync
npm run ios:open
```

`npm run ios:prepare` generates the native `ios/` Xcode project using Capacitor. The generated project should then be opened in Xcode, configured with the Apple Developer team, tested on a physical iPhone, archived, and uploaded to TestFlight.

Do not treat this documentation folder as an Xcode project or as a submitted App Store build.
