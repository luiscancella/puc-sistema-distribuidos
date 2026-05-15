# Changelog

All notable changes to this project will be documented in this file.

## [Unreleased] — 2026-05-15

### Added
- `src/constants/brand.ts` — centralised design-system tokens (`Colors`, `Radius`, `Shadow`, `FontFamily`) sourced from the Campus Quest Brand Book v1.0
- `src/components/LogoMark.tsx` — reusable SVG logo mark (peach rounded square + lens circle + pin dot) using `react-native-svg`; accepts a `size` prop, defaults to 72 px

### Changed
- `src/screens/onboarding/WelcomeScreen.tsx` — full visual migration to Brand Book v1.0: warm-cream background (`#FBF7EE`), Quest Peach (`#FF8A6B`) primary, Bricolage Grotesque display typeface, Hanken Grotesk body typeface, pill button, brand-spec blobs and progress dots; navigation logic preserved
- `src/routes/AppRoutes.tsx` — loads `BricolageGrotesque_700Bold`, `HankenGrotesk_500Medium`, and `HankenGrotesk_800ExtraBold` via `useFonts` before rendering
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
- Login and Register screens (onboarding flow)
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
