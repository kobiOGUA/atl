# Student Atlas - Academic Tracking App

## Overview
Student Atlas is a React Native mobile application built with Expo that helps students track their academic journey. Users can manage semesters, courses, calculate GPAs, and monitor their academic performance.

## Project Architecture

### Tech Stack
- **Framework**: React Native with Expo SDK 54
- **Language**: TypeScript
- **Navigation**: React Navigation (Tab + Stack navigators)
- **Authentication**: Firebase Auth (email/password)
- **Storage**: AsyncStorage (offline-first)
- **State Management**: React Context API
- **UI Components**: Custom themed components with multiple color schemes

### Key Features
1. **Authentication System**: Email/password login via Firebase
2. **Semester Management**: Add, edit, and track current/past semesters
3. **Course Tracking**: Manage courses with CA scores, target grades, and final scores
4. **GPA Calculations**: Automatic CGPA, semester GPA, and predicted CGPA
5. **Data Export**: Export data as JSON or PDF reports
6. **Achievements System**: Gamification with unlockable achievements
7. **Multiple Themes**: 5 color themes (Default Dark, Dark, Blue, Light Pink, Light)
8. **Offline Support**: All data stored locally with AsyncStorage

## Project Structure
```
├── screens/          # All screen components
├── navigation/       # Navigation configuration (Tab & Stack)
├── components/       # Reusable UI components
├── contexts/         # React Context providers (Auth, Theme, Achievement)
├── services/         # Business logic (Firebase, Storage, Export, Notifications)
├── utils/            # Utility functions (GPA calculations)
├── constants/        # Theme constants and design tokens
├── types/            # TypeScript type definitions
└── assets/           # Images, icons, and static files
```

## Recent Changes
- **2025-11-20**: Successfully imported and configured project on Replit
  - Installed all dependencies with `--legacy-peer-deps` flag
  - Configured Expo workflow for development
  - Added EAS Build configuration for APK generation

## Development Setup

### Running the App
The app runs via Expo development server:
```bash
npm run dev
```

### Testing Options
1. **Physical Device**: Scan QR code with Expo Go app
2. **Web Preview**: React Native Web version (browser-based)
3. **Emulator**: Use Android/iOS emulators (requires setup)

## Building APK

### Prerequisites
1. Create a free Expo account at https://expo.dev/signup
2. EAS CLI is already installed in this project

### Build Steps
1. Login to Expo:
   ```bash
   eas login
   ```

2. Build APK for testing/distribution:
   ```bash
   # For preview/testing build
   eas build --profile preview --platform android
   
   # For production build
   eas build --profile production --platform android
   ```

3. Wait for build to complete (10-15 minutes)
4. Download APK from the provided URL
5. Install on Android device

### Build Configuration
- `eas.json` is configured to generate APK files (not AAB)
- Three build profiles available: development, preview, production
- All profiles create installable APK files

## Firebase Configuration
Firebase is configured for authentication with the following services:
- **Auth Domain**: kobi-s-student-atlas.firebaseapp.com
- **Project ID**: kobi-s-student-atlas

**Note**: Firebase credentials are public (client-side config) but secured via Firebase security rules.

## Design System
The app uses a comprehensive design system with:
- Consistent spacing scale (xs: 4, sm: 8, md: 12, lg: 16, xl: 24, xxl: 32)
- Border radius values (sm: 8, md: 12, lg: 16, xl: 24)
- Typography scale (8 text styles from xs to xxl)
- 5 complete color themes

## User Preferences
- None documented yet

## Known Issues
- Some package version mismatches (non-critical warnings during npm install)
- Metro bundler requires Node >= 20.19.4 (currently using 20.19.3, but works)

## Future Enhancements
- Cloud sync across devices
- Class scheduling
- Study timer
- GPA trend charts
