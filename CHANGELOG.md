# Changelog

All notable changes to this project will be documented in this file.

---

## [0.13.0] — 2026-06-26

### Added
- Firebase Crashlytics — global crash/error reporting via `@react-native-firebase/app` + `@react-native-firebase/crashlytics`
- `src/components/ErrorBoundary.tsx` — top-level error boundary that reports caught errors to Crashlytics and renders a fallback UI
- Test suite (`jest` + `jest-expo` + `@testing-library/react-native`): unit and integration tests for services (`auth`, `cache`, `checkins`, `home`, `token`), hooks (`useOfflineResource`), and utils (`avatar`, `schedule`)
- `jest.setup.ts` and Jest config in `package.json`; `test` and `test:watch` scripts
- `.github/workflows/ci.yml` — CI workflow for Android build
- `README.md`

### Changed
- `EXPO_PUBLIC_API_URL` now points to the production API endpoint

### Dependencies
- Added `@react-native-firebase/app`, `@react-native-firebase/crashlytics`
- Added (dev) `jest-expo`, `@testing-library/react-native`, `@types/jest`

---

## [0.12.0] — 2026-06-24 → 2026-06-25

### Added
- Offline-first support: `src/hooks/useOfflineResource.ts` and `src/services/cache.ts` cache main-tab data (via `@react-native-async-storage/async-storage`) and serve it while offline
- Check-in submission now retries automatically on network errors

### Changed
- `HomeScreen` squad members sorted by points before rendering the top 3
- Fixed app being unable to connect to the test server

### Dependencies
- Added `@react-native-async-storage/async-storage`

---

## [0.11.0] — 2026-06-22 → 2026-06-23

### Added
- Backend integration — full services layer under `src/services/` (`client`, `auth`, `token`, `home`, `groups`, `checkins`, `profile`, `universities`, `push`)
- Push notifications via `expo-notifications` (`src/services/push.ts`)
- Location permission and GPS coordinates captured in `CameraScreen` and `ConfirmScreen` (`expo-location`)
- `HomeScreen` carousel showing upcoming classes; `src/utils/schedule.ts` for schedule logic
- `src/utils/avatar.ts` — extracted avatar color and initials helpers
- Firebase Google Services config (`firebase/google-services.json`) and `app.config.ts` updates
- `src/types/profile/profile.schema.ts`

### Changed
- `AuthContext` reworked to authenticate against the backend and persist the session with `expo-secure-store`
- `HomeScreen` — streak card now rendered conditionally; `HomeGroup` schema extended with `courses`
- `home.schema.ts` updated so `HomeResponse` includes course data within the group

### Dependencies
- Added `expo-notifications`, `expo-location`, `expo-secure-store`

---

## [0.10.0] — 2026-05-28

### Added
- `ProfileScreen` — user profile screen, integrated into `MainNavigator`
- `SettingsScreen` — settings screen, integrated into `MainNavigator`

### Removed
- `ScheduleScreen` and its standalone schedule tab/calendar view

---

## [0.9.0] — 2026-05-25

### Added
- `GroupsScreen` — full group screen with hero card (name, member count, weekly check-ins), invite card (shareable invite code), and members list with color-coded avatars and points ranking
- `GroupMemberSchema` in `src/types/groups/group.schema.ts` — Zod schema embedding `StudentSchema` with `points` and `isCurrentUser` fields
- `Groups` route added to `MainTabsParamList` in `src/types/navigation/app.stack.ts`

### Changed
- `GroupSchema` extended with `memberCount`, `memberLimit`, `inviteCode`, `weeklyCheckIns`, and `members` array (`GroupMemberSchema`)
- `MainNavigator` — Schedule tab replaced by Groups tab with `people` Ionicons icon
- `HomeScreen` — squad ranking migrated from flat `squadRanking` to `group.members`
- `home.schema.ts` — `squadRanking` field replaced by a direct `GroupSchema` reference
- `AuthContext` mock data updated to include a full `group` object with members

---

## [0.8.0] — 2026-05-24

### Added
- `HomeScreen` — full implementation with three UI states (loading, error, loaded): streak card, check-in card, and squad ranking with color-coded avatars and medal badges
- `src/types/home/home.schema.ts` — Zod schemas for `HomeScreenData` (`streak`, `checkIn`, `squadRanking`)
- Home type exports added to `src/types/index.ts` barrel

### Changed
- `HomeScreen` migrated from minimal placeholder to full component with `ScrollView`, `SafeAreaView`, ISO date formatters (`formatDeadline`, `formatDateLabel`), and avatar color rotation via `AVATAR_COLORS`
- `CameraScreen` — minor navigation adjustments

---

## [0.7.0] — 2026-05-23

### Added
- Check-in flow: `CameraScreen` (live camera preview, countdown timer, shutter capture), `ConfirmScreen` (photo review with course/location pill), `SuccessScreen` (attendance confirmation)
- `src/types/checkin/checkin.schema.ts` — Zod schema for check-in payload
- `src/types/navigation/check-in.stack.ts` — `CheckInStackParamList` type
- `AppStackParamList` in `src/types/navigation/app.stack.ts` — typed root authenticated stack separating check-in routes from tab routes

### Changed
- Navigation architecture refactored: monolithic `AppRoutes.tsx` split into `OnboardingNavigator.tsx`, `GroupSetupNavigator.tsx`, `MainNavigator.tsx` (with co-located `MainTabs`), and a thin 31-line `AppRoutes.tsx` orchestrator
- Check-in screens promoted to the root authenticated stack (alongside `MainTabs`), not nested inside a tab
- `HomeScreen` gains a "Fazer check-in" button that pushes into the check-in stack
- `HomeScreen` and `MainNavigator` updated to use `AppStackParamList` for typed navigation

### Dependencies
- Added `expo-camera`

---

## [0.6.0] — 2026-05-23

### Added
- Group setup flow: `GroupChoiceScreen` (create or join decision), `CreateGroupScreen` (group name, course, invite code generation), `JoinGroupScreen` (join by invite code)
- `src/types/groups/group.schema.ts` — Zod schema for group data
- `src/types/navigation/group-setup.stack.ts` — `GroupSetupStackParamList` type

### Changed
- `AuthContext` extended to track group membership state and drive post-registration routing
- `RegisterScreen` refactored: personal-info step extracted to its own concern, group-setup step delegated to the group setup stack

---

## [0.5.0] — 2026-05-21 → 2026-05-22

### Added
- `LoginScreen` — full implementation with `react-hook-form` + Zod validation, error states, and brand-spec visual design
- `RegisterScreen` — multi-step form: personal info, university/course selection (with `university.schema.ts`), and password; Zod schemas translated to Portuguese field labels
- `src/types/university/university.schema.ts` — Zod schema for university and course data
- `src/types/users/user.schema.ts` — student user profile type
- Auth Zod schemas (`auth.schema.ts`) fully revised to match back-end contract

### Dependencies
- Added `react-hook-form`
- Added `zod`

---

## [0.4.0] — 2026-05-15

### Added
- `src/constants/brand.ts` — centralised design-system tokens (`Colors`, `Radius`, `Shadow`, `FontFamily`) sourced from the Campus Quest Brand Book v1.0
- `src/components/LogoMark.tsx` — reusable SVG logo mark (peach rounded square + lens circle + pin dot) using `react-native-svg`; accepts a `size` prop, defaults to 72 px

### Changed
- `WelcomeScreen` — full visual migration to Brand Book v1.0: warm-cream background (`#FBF7EE`), Quest Peach (`#FF8A6B`) primary, Bricolage Grotesque display typeface, Hanken Grotesk body typeface, pill button, brand-spec blobs and progress dots
- `AppRoutes` — loads `BricolageGrotesque_700Bold`, `HankenGrotesk_500Medium`, and `HankenGrotesk_800ExtraBold` via `useFonts` before rendering
- `app.config.ts` — added `expo-font` plugin; migrated from JSON to TypeScript config format

### Dependencies
- Added `@expo-google-fonts/bricolage-grotesque`
- Added `@expo-google-fonts/hanken-grotesk`
- Added `react-native-svg`

---

## [0.3.0] — 2026-04-18

### Added
- Schedule screen with weekly calendar view and class session cards
- Bottom-tab navigation updated to include Schedule tab

---

## [0.2.0] — 2026-04-17

### Added
- Home screen
- Login and Register screens (onboarding flow, initial scaffolding)
- Authentication context (`useAuth`, `session` state)
- `AppRoutes` navigator: onboarding stack (Welcome → Login / Register) and authenticated tab navigator (Home + Schedule)
- Navigation type definitions (`OnboardingStackParamList`)

### Changed
- Replaced root `App` component with `AppRoutes`
- Updated `package.json` build and development scripts

---

## [0.1.0] — 2026-04-15

### Added
- Initial project setup (Expo SDK 54, React Navigation, React Native Safe Area Context)
- Welcome screen (onboarding entry point)
