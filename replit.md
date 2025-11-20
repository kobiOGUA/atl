# Student Atlas

## Overview
Student Atlas is a React Native mobile application built with Expo that helps students track their academic journey. The app allows users to manage semesters and courses, calculate GPAs, and predict future academic performance.

**Current State**: Successfully migrated to Replit environment. All dependencies installed and Expo development server running.

## Recent Changes
- **2025-11-20**: Project imported to Replit
  - Installed all npm dependencies with `--legacy-peer-deps` flag to resolve react-native-svg-charts version conflicts
  - Configured workflow to run Expo development server
  - Expo server running on port 8081 with React Native Web support

## Key Features
- **Authentication**: Email/password authentication via Firebase Auth
- **Semester Management**: Add, view, and delete semesters (current/past)
- **Course Tracking**: Manage courses with CA scores, target grades, and final scores
- **GPA Calculation**: Automatic calculation of semester GPA, CGPA, and predicted CGPA
- **Data Export**: Export academic data as JSON backup or PDF report
- **Theming**: Multiple color themes (Default Dark, Dark, Blue, Light Pink, Light)
- **Achievements**: Gamification with unlockable achievements for academic milestones
- **Offline Support**: Local data storage using AsyncStorage

## Project Architecture

### Tech Stack
- **Framework**: React Native 0.81.5 with Expo 54
- **Navigation**: React Navigation (Native Stack + Bottom Tabs)
- **Authentication**: Firebase Auth
- **Storage**: AsyncStorage for offline data persistence
- **State Management**: React Context API
- **UI**: Custom theming system with multiple color schemes
- **PDF Generation**: expo-print
- **Notifications**: expo-notifications

### Directory Structure
```
├── components/         # Reusable UI components
├── contexts/          # React context providers (Auth, Theme, Achievement)
├── hooks/             # Custom React hooks
├── navigation/        # Navigation structure (Auth, Main Tabs, Stacks)
├── screens/           # Screen components
├── services/          # Business logic (Firebase, Storage, Export, Notifications)
├── types/             # TypeScript type definitions
├── utils/             # Utility functions (GPA calculations)
└── constants/         # Theme constants and colors
```

### Data Model
- **Semester**: Contains courses, GPA, type (current/past)
- **Course**: Includes name, code, units, CA scores, target grade, final score
- **Grading System**: A (5.0), B (4.0), C (3.0), D (2.0), E (1.0), F (0.0)

## Development Setup

### Running the App
- Development server runs on port 8081
- Web preview available via React Native Web
- For mobile testing, use Expo Go app with QR code

### Known Issues
- Some packages have version mismatches with Expo 54 (non-breaking)
- Node version 20.19.3 vs required 20.19.4 (minor version difference, working fine)

### Firebase Configuration
Firebase config is hardcoded in `services/firebase.ts` for:
- Project: kobi-s-student-atlas
- Authentication enabled

## User Preferences
None specified yet.

## Notes
- The app uses React Native Web for browser preview on Replit
- For the most accurate testing, use Expo Go on a physical device
- All user data is stored locally per user ID from Firebase Auth
