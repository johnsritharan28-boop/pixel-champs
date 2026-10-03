# Pixel Champs — TestFlight next gate

V92 is wired into the Capacitor iOS build workflow.

## Remaining release gate
1. Confirm the GitHub Actions iOS build completes successfully.
2. Open the generated iOS project in Xcode on a Mac.
3. Select the Apple Developer team and configure signing for `com.pixelchamps.game`.
4. Connect a physical iPhone and verify the game flows on-device.
5. Create an Archive in Xcode.
6. Upload the archive to App Store Connect/TestFlight.
7. Install Pixel Champs from TestFlight on the iPhone and perform final QA.

## Important
A simulator build is not the same as a signed TestFlight build. Apple signing credentials and App Store Connect access are required for the final upload.

## Product model
Pixel Champs remains free-to-play with virtual rewards. No wagering, cash-out, or real-money prizes are part of the game design.
