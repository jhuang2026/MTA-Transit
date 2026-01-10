# Deployment Guide for NYC Proximity

This guide outlines the steps to build and deploy the iOS app to the App Store.

## Prerequisites

- Apple Developer Account with app registered on App Store Connect
- `eas-cli` installed globally: `npm install -g eas-cli`
- Logged into Expo: `eas login`

## Important: Version Management

**Before deploying, you MUST update the version in `app.json`:**

### Version vs Build Number

- **`version`** (e.g., `1.0.7`): The user-facing app version. **Must increase for each App Store submission.**
- **`buildNumber`** (e.g., `22`): Internal build counter. Auto-incremented by EAS Build.

Both are in `app.json` under the `ios` section:

```json
"ios": {
  "buildNumber": "22",        // Auto-bumped by EAS, do not manually change
  "runtimeVersion": "1.0.7",  // Keep in sync with version
  "version": "1.0.7"          // MUST INCREMENT before each App Store submission
}
```

### Common Mistake to Avoid

❌ **WRONG**: Submitting with the same version twice
```
Build #20: version 1.0.6 → Submission failed
Build #22: version 1.0.6 → REJECTED - duplicate version
```

✅ **RIGHT**: Increment version for each submission
```
Build #20: version 1.0.6 → Success
Build #22: version 1.0.7 → Success
```

## Deployment Steps

### 1. Update Version in `app.json`

Edit `app.json` and increment the `version` field:

```json
{
  "expo": {
    "version": "1.0.8",  // ← Change this (e.g., 1.0.7 → 1.0.8)
    "ios": {
      "runtimeVersion": "1.0.8",  // ← Keep in sync
      // buildNumber will be auto-bumped during build
    }
  }
}
```

### 2. Build for iOS

```bash
cd mta-transit-mobile
eas build --platform ios --profile production
```

This will:
- Prompt for Apple credentials (first time only)
- Build the app on EAS servers using Xcode 16 (iOS 18 SDK)
- Generate an `.ipa` file
- Output the build ID and artifact URL

### 3. Submit to App Store

```bash
eas submit --platform ios --profile production
```

When prompted, select the build you just created. EAS will:
- Submit to TestFlight first
- Run App Store validation
- Show submission details and status

You can monitor progress at: `https://expo.dev/accounts/noting/projects/NYCProximity/submissions/[SUBMISSION_ID]`

## SDK Requirements

- **Deployment Target**: iOS 13.0 (minimum version users need)
- **Build SDK**: iOS 18 (required by Apple as of Jan 2026)

The app builds with Xcode 16 (iOS 18 SDK) but runs on iOS 13.0+. Users don't need iOS 18.

## Troubleshooting

### "CFBundleShortVersionString [1.0.6] must be higher than previously approved version"

**Cause**: Trying to submit with a version that's already approved.

**Fix**: Increment the `version` in `app.json` before building.

### "App was built with iOS 17.5 SDK"

**Cause**: EAS used an older Xcode version.

**Fix**: Re-run the build command. EAS should auto-select Xcode 16 with iOS 18 SDK.

### "Invalid Pre-Release Train. Train version '1.0.6' is closed"

**Cause**: TestFlight submission for that version was already attempted.

**Fix**: Increment to a new version and submit again.

## Local Testing (Optional)

To test the app locally before deployment:

```bash
npx expo prebuild --clean --platform ios
npx expo run:ios
```

This builds and runs the app on the iOS simulator without EAS.

## Checklist Before Deployment

- [ ] Version in `app.json` is incremented
- [ ] `runtimeVersion` matches the `version`
- [ ] Code changes are committed to git
- [ ] Tested locally or reviewed changes
- [ ] App Store Connect shows correct app info
- [ ] Apple Developer certificate is valid

## Current App Status

- **Bundle ID**: `com.noting.NYCProximity`
- **ASC App ID**: `6463744023`
- **Current Version**: 1.0.7 (as of Build #22)
- **Deployment Target**: iOS 13.0
