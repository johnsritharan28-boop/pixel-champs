# Pixel Champs — iOS packaging

V80 establishes the web-to-iOS packaging configuration around the playable Pixel Champs shell.

## Current foundation
- `index.html` is the iPhone-first app shell.
- `manifest.webmanifest` and `service-worker.js` support installable/offline web use.
- `capacitor.config.json` defines the native app ID and app name.
- `package.json` defines the Capacitor dependencies and iOS sync/open commands.

## Native packaging
This repository snapshot is **not yet an Xcode archive or TestFlight build**. The next packaging step requires installing the Node dependencies and running Capacitor to generate the `ios/` project, then opening it in Xcode for signing, device QA, App Store metadata, and archive/TestFlight distribution.

## Release gates
1. Run the complete game on a physical iPhone.
2. Verify battles, missions, spin, gear, fusion, zodiac, and arena flows.
3. Verify local progress survives app relaunch.
4. Replace prototype/local-only persistence with production account/cloud storage before relying on cross-device saves.
5. Add final privacy policy/support URLs and App Store metadata.
6. Configure Apple signing and App Store Connect.
7. Archive and upload to TestFlight.

## Economy rule
Pixel Champs remains free-to-play. Rewards in this build are virtual. No wagering, cash-out, or real-money prizes are part of the game design.
