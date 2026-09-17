# iOS Build Trigger

This commit intentionally triggers the Pixel Champs iOS build validation workflow on `v80-ios-foundation`.

The workflow prepares the V92 web assets, generates the Capacitor iOS project, runs an unsigned iPhone simulator build, and uploads the generated iOS project as an artifact.

A successful simulator build is a packaging validation step; Apple signing and TestFlight upload remain separate release steps.
