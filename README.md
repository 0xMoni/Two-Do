# Two-Do

A gamified RPG-themed to-do app for duos — couples, friends, or long-distance partners. Turn everyday tasks into quests, earn XP, level up together, and keep each other accountable.

## Features

- **Quest System** — Create, assign, and complete tasks as "quests" with easy/medium/hard priority and XP rewards
- **Duo Pairing** — Pair up with your partner via a 6-character code or QR scan and track progress together in real-time
- **XP & Leveling** — Earn XP for completing quests, level up through 10 tiers, and celebrate with animated level-up screens
- **Streak Tracking** — Build daily streaks by completing quests consistently
- **Achievements** — Unlock 15 achievements based on milestones (quests completed, streaks, XP earned, and more)
- **Categories** — Organize quests by category (Daily, Errands, Self-Care, Fitness, etc.) with custom category support
- **Affection Counter** — Send hearts, letters, or chocolates to your partner with a real-time tap counter
- **Confetti Celebrations** — Animated confetti and toast on quest completion
- **Quest History** — View completed quests separately with earned XP
- **Swipe Actions** — Swipe right to complete, swipe left to edit or delete quests
- **Pull to Refresh** — Pull down to refresh and check for expired quests
- **Push Notifications** — Due date reminders and local notifications
- **Duo Types** — Choose between Couple, Friends, or Long-Distance modes with themed interactions
- **RPG Theme** — Pixel font, XP bars, character avatars, and game-inspired UI throughout

## Tech Stack

- **Framework**: [Expo](https://expo.dev) SDK 54 + React Native + TypeScript
- **Backend**: [Firebase](https://firebase.google.com) (Authentication + Cloud Firestore)
- **Navigation**: React Navigation (Stack + Bottom Tabs)
- **Animations**: React Native Animated API
- **Gestures**: react-native-gesture-handler (swipe actions)
- **Font**: Press Start 2P (pixel font)
- **Haptics**: expo-haptics for tactile feedback
- **Notifications**: expo-notifications for local/push notifications

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org) (v18+)
- [Expo CLI](https://docs.expo.dev/get-started/installation/)
- [Android Studio](https://developer.android.com/studio) (for Android emulator) or a physical device with [Expo Go](https://expo.dev/go)

### Installation

```bash
# Clone the repo
git clone https://github.com/0xMoni/Two-Do.git
cd Two-Do

# Install dependencies
npm install

# Start the development server
npx expo start
```

Then press `a` to open on Android emulator or scan the QR code with Expo Go on your phone.

### Build APK

To build a standalone APK for sharing:

```bash
# Install EAS CLI
npm install -g eas-cli

# Log in to Expo
eas login

# Build APK
eas build --platform android --profile preview
```

## Project Structure

```
Two-Do/
├── App.tsx                    # Root component with font loading & notifications
├── src/
│   ├── navigation/            # Stack & tab navigators
│   ├── screens/
│   │   ├── auth/              # Login & Signup
│   │   ├── home/              # Quest Log, Add/Edit Quest
│   │   ├── profile/           # Character Sheet
│   │   ├── onboarding/        # 4-screen onboarding flow
│   │   ├── PairingScreen.tsx  # Duo pairing via code/QR
│   │   └── SplashScreen.tsx   # Loading screen
│   ├── components/
│   │   ├── common/            # RPGCard, RPGButton, XPBar, PixelText, Badge, Modals
│   │   ├── home/              # PartnerCard, QuestItem, QuestList, CategoryChip, HeartButton
│   │   ├── profile/           # AvatarPicker, StatRow
│   │   └── auth/              # AuthForm
│   ├── contexts/              # Auth, Duo, Theme contexts
│   ├── lib/                   # Firebase, services, hooks, utilities
│   └── types/                 # TypeScript type definitions
└── assets/                    # Fonts, icons, images
```

## How It Works

1. **Sign up** and get a unique pairing code
2. **Pair** with your partner by sharing codes
3. **Create quests** and assign them to yourself or your partner
4. **Complete quests** to earn XP — swipe right or tap the checkbox
5. **Level up** together and unlock achievements
6. **Stay accountable** with streaks, due dates, and real-time sync

## License

This project is for personal use. All rights reserved.
