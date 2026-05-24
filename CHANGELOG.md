# Changelog

All notable changes to this project will be documented in this file.

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
