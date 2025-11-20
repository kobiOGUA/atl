# Student Atlas - Mobile Design Guidelines

## Authentication
**Required** - The app handles user-specific academic data that must persist across devices.
- **Implementation**: Email/Password authentication via Firebase Auth
- **Screens Required**:
  - Login screen with email/password fields
  - Sign-up screen with email, password, and confirmation
  - Password reset flow
  - Account screen with logout and delete account options (nested: Settings > Account > Delete Account with double confirmation)

## Navigation Architecture

**Root Navigation**: Tab Navigation (3 tabs)
- **Tab 1 - Semesters**: Main dashboard showing all semesters grouped by Past/Current
- **Tab 2 - GPA**: Dedicated GPA view with CGPA, predicted CGPA, and semester GPAs
- **Tab 3 - Settings**: Theme switcher, account management, backup/export, about

**Floating Action Button**: Positioned above tab bar for "Add Semester" action (primary CTA throughout app)

## Screen Specifications

### 1. Semesters Dashboard (Tab 1)
- **Purpose**: Display all semesters, grouped by Current (max 1) and Past
- **Header**: Transparent, title "Semesters", no search bar
- **Layout**:
  - Scrollable root view
  - Top inset: headerHeight + Spacing.xl
  - Bottom inset: tabBarHeight + Spacing.xl
  - Section headers: "Current Semester" and "Past Semesters"
  - Cards for each semester showing: name, GPA badge, course count
  - Empty state illustration when no semesters exist
- **Floating Elements**: 
  - FAB for "Add Semester" (bottom right)
  - FAB insets: bottom: tabBarHeight + Spacing.xl, right: Spacing.xl
  - Shadow: {width: 0, height: 2}, opacity: 0.10, radius: 2

### 2. Semester Detail Screen (Stack Modal)
- **Purpose**: View all courses in a semester, edit semester, see semester GPA
- **Header**: Non-transparent, semester name as title, left: back button, right: edit icon
- **Layout**:
  - Scrollable root view
  - Top inset: Spacing.xl (has non-transparent header)
  - Bottom inset: insets.bottom + Spacing.xl (no tab bar in modal)
  - Semester stats card: GPA (current/predicted if current semester), total units, course count
  - Course list (cards with course name, code, grade/CA scores, units)
  - Delete semester button at bottom (destructive style)
- **Floating Elements**: 
  - FAB for "Add Course" (bottom right, same shadow specs)

### 3. Course Detail Screen (Stack Modal)
- **Purpose**: View/edit course details, CA scores, dynamic exam target table
- **Header**: Non-transparent, course name as title, left: back button, right: save icon
- **Layout**:
  - Scrollable form
  - Top inset: Spacing.xl
  - Bottom inset: insets.bottom + Spacing.xl
  - Form sections:
    - Course info (name, code, units - non-editable field group)
    - CA scores (midterm, assignment, quiz, attendance - editable for current semester)
    - Target grade selector (A/B/C chips)
    - Difficulty stars (1-5)
    - Dynamic exam target table (for current semester only)
    - Final score field (optional, for current semester)
  - Delete course button at bottom (destructive)
  - Submit/Cancel: Header right button (save), left button (cancel)

### 4. Add Semester Modal
- **Purpose**: Create new semester with type selection
- **Header**: Non-transparent, title "New Semester", left: cancel, right: create
- **Layout**:
  - Non-scrollable form (fits in viewport)
  - Top inset: Spacing.xl
  - Bottom inset: insets.bottom + Spacing.xl
  - Form fields:
    - Semester name input
    - Type segmented control: "Past" / "Current"
    - Conditional fields based on type selection
  - Submit/Cancel: in header

### 5. Add Course Modal
- **Purpose**: Add course to semester (past vs current flow differs)
- **Header**: Non-transparent, title "Add Course", left: cancel, right: add
- **Layout**:
  - Scrollable form (fields differ by semester type)
  - Past semester: name, code, units, final score
  - Current semester: name, code, units, CA scores, target grade, difficulty
  - Submit/Cancel: in header

### 6. GPA View (Tab 2)
- **Purpose**: Display comprehensive GPA overview with visualizations
- **Header**: Transparent, title "My GPA", no search bar
- **Layout**:
  - Scrollable root view
  - Top inset: headerHeight + Spacing.xl
  - Bottom inset: tabBarHeight + Spacing.xl
  - Summary cards: Current CGPA, Predicted CGPA
  - GPA chart (line/bar chart showing semester progression)
  - List of all semester GPAs with semester names
  - Empty state when no past semesters

### 7. Settings Screen (Tab 3)
- **Purpose**: Theme selection, account management, app info
- **Header**: Transparent, title "Settings"
- **Layout**:
  - Scrollable list
  - Top inset: headerHeight + Spacing.xl
  - Bottom inset: tabBarHeight + Spacing.xl
  - Settings groups:
    - Appearance (theme chips grid: 5 theme options with preview)
    - Account (nested navigation to account management)
    - Data (backup, export options)
    - About (developer info, app version)

## Design System

### Color Palette
**Five theme options** with these base color specifications:

**Default Dark Theme** (default):
- Background: #121212
- Surface: #1E1E1E
- Primary: #BB86FC (purple accent)
- Text Primary: #FFFFFF
- Text Secondary: #B3B3B3
- Success: #4CAF50 (grade A)
- Warning: #FF9800 (grade C)
- Error: #F44336 (fail grades)

**Dark Theme**:
- Background: #000000
- Surface: #1C1C1C
- Primary: #0A84FF (iOS blue)
- Text Primary: #FFFFFF
- Text Secondary: #8E8E93

**Blue Theme**:
- Background: #E3F2FD
- Surface: #FFFFFF
- Primary: #2196F3
- Text Primary: #1A237E
- Text Secondary: #5C6BC0

**Light Pink Theme**:
- Background: #FCE4EC
- Surface: #FFFFFF
- Primary: #E91E63
- Text Primary: #880E4F
- Text Secondary: #AD1457

**Light Theme**:
- Background: #FFFFFF
- Surface: #F5F5F5
- Primary: #6200EE
- Text Primary: #000000
- Text Secondary: #666666

### Typography
- **Header Large**: 32px, Bold, Primary Text
- **Header Medium**: 24px, Semibold, Primary Text
- **Title**: 18px, Semibold, Primary Text
- **Body**: 16px, Regular, Primary Text
- **Caption**: 14px, Regular, Secondary Text
- **Label**: 12px, Medium, Secondary Text

### Component Patterns

**GPA Badge**: Circular badge with GPA value, color-coded by performance (5.0=Success, 4.0=Primary, <3.0=Warning)

**Semester Card**: 
- Rounded corners (12px)
- Subtle border (1px, surface variant)
- No drop shadow
- Press feedback: opacity 0.7

**Course Card**:
- Rounded corners (8px)
- Subtle border
- Left accent bar (4px) color-coded by grade/status
- Press feedback: opacity 0.7

**Theme Chip**:
- Circular preview swatch (40px diameter)
- Label below
- Selected state: border (2px, primary color)
- Press feedback: scale 0.95

**Difficulty Stars**: 
- Filled/unfilled star icons
- Color: primary for filled, surface variant for unfilled

**Target Grade Chips**:
- Horizontal chip group
- Selected chip: filled with primary color
- Unselected: outlined with primary color
- Press feedback: scale 0.95

**Dynamic Exam Table**:
- Table with alternating row colors (surface/background)
- Headers: bold, primary text
- Borders: subtle (1px, surface variant)

**FAB** (Floating Action Button):
- Size: 56x56px
- Icon: Plus symbol
- Color: Primary
- Shadow: {width: 0, height: 2}, opacity: 0.10, radius: 2
- Press feedback: scale 0.9

### Critical Assets
1. **Empty State Illustrations** (3 required):
   - No semesters yet (dashboard)
   - No courses in semester
   - No GPA data yet
   - Style: Minimal line art in primary color, 200x200px

2. **Achievement Confetti Animation**: JSON Lottie file for GPA milestone celebrations

3. **App Icon**: Academic-themed icon with book/atlas imagery, 1024x1024px

### Accessibility
- All touchable elements minimum 44x44pt tap target
- Color contrast ratio ≥ 4.5:1 for text
- Dynamic type support for accessibility font sizes
- VoiceOver labels for all interactive elements
- Confirmation alerts for destructive actions (delete semester/course)
- Form field validation with clear error messages