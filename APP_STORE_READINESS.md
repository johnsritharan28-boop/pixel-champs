# Pixel Champs — App Store Readiness

## Product
- Free-to-play game
- Virtual rewards only
- No wagering
- No cash-out
- No real-money prizes

## Completed foundation
- iPhone-first responsive shell
- Installable web manifest
- App icon source
- Offline service worker
- Native-wrapper configuration
- Bundle identifier: `com.pixelchamps.game`

## Before TestFlight
1. Generate the native iOS project from the web app.
2. Open/build the iOS target in Xcode on a Mac.
3. Test navigation, touch controls, safe areas, sound, rotation, persistence, and offline behavior on physical iPhone hardware.
4. Add production privacy disclosures and required App Store metadata.
5. Configure signing/team settings and a unique App Store Connect app record.
6. Archive and upload a release build to TestFlight.
7. Run TestFlight QA and fix any launch, performance, or gameplay issues.

## Important
This repository foundation is not itself an App Store/TestFlight binary. A successful Xcode archive and device QA are still required before submission.
