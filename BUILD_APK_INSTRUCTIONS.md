# How to Build Your APK

This guide will help you create an installable APK file for your Student Atlas app.

## What You Need

1. **Expo Account** (free): Sign up at https://expo.dev/signup
2. **EAS CLI** (already installed in this project)
3. **Internet connection** (builds happen on Expo's cloud servers)

---

## Step-by-Step Instructions

### Step 1: Login to Expo

Open the Shell tab in Replit and run:

```bash
eas login
```

Enter your Expo account email and password when prompted.

### Step 2: Build Your APK

Choose one of these commands based on your needs:

**For Testing (Recommended First)**
```bash
eas build --profile preview --platform android
```

**For Production Release**
```bash
eas build --profile production --platform android
```

### Step 3: Wait for Build

- The build process takes **10-15 minutes**
- You'll see a progress indicator in the terminal
- Expo will build your app on their cloud servers
- You can close the terminal and check status later with: `eas build:list`

### Step 4: Download Your APK

Once the build completes, you'll get a download link. You can:

1. **Click the link** in the terminal to download directly
2. **Visit** https://expo.dev/accounts/[your-account]/projects/student-atlas/builds
3. Share the link with others to distribute your app

### Step 5: Install on Android Device

1. **Transfer APK** to your Android device
2. **Enable "Install from Unknown Sources"** in Android settings
3. **Tap the APK file** to install
4. **Open Student Atlas** and enjoy!

---

## Build Profiles Explained

| Profile | Use Case | Distribution |
|---------|----------|--------------|
| `preview` | Testing, sharing with friends | Internal only |
| `production` | Official release, Play Store | Public or Internal |
| `development` | Development with hot reload | Developers only |

---

## Troubleshooting

### "Build failed: Missing credentials"
- EAS will guide you to create signing credentials automatically
- Just follow the prompts and select "Let Expo handle it"

### "You've reached your build limit"
- Free accounts get **30 builds/month**
- Wait until next month or upgrade to paid plan

### "Invalid Android package name"
- Already configured correctly in this project as `com.kobiogua.studentatlas`

---

## Important Notes

✅ **Free tier**: 30 builds per month  
✅ **APK vs AAB**: This project builds APK files (ready to install)  
✅ **Automatic signing**: Expo handles all certificates  
✅ **Build history**: View all builds at expo.dev  

---

## Advanced Options

### Check Build Status
```bash
eas build:list
```

### Cancel a Build
```bash
eas build:cancel
```

### Build for Both Platforms
```bash
eas build --profile preview --platform all
```

---

## Next Steps After Building

1. **Test thoroughly** on different Android devices
2. **Get feedback** from users
3. **Update version** in `app.json` for new releases
4. **Publish to Play Store** (optional) using the production profile

---

Need help? Check the official docs: https://docs.expo.dev/build/setup/
