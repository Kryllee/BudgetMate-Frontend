# BudgetMate App Documentation

## Overview
BudgetMate is a comprehensive personal finance application designed to help users manage their budget, track expenses, learn about finance, and find side income opportunities.

## 1. Onboarding Flow (`BudgetOnboarding.jsx`)
The app guides new users through a 4-step setup process to personalize their experience:
1.  **Welcome**: Introduction to the app.
2.  **Income Setup**: Users input their monthly income and payment frequency (Weekly, Bi-weekly, Monthly).
3.  **Spending & Savings**: Users select their primary spending categories (e.g., Housing, Food) and set a target savings rate (%). The app calculates an estimated monthly savings amount.
4.  **Goal Setting**: Users define their Emergency Fund goal and Annual Savings goal.
    *   **Data Storage**: All data is saved to `AsyncStorage` under the key `userBudget`.

## 2. Home Tab (`app/(tabs)/home.jsx`)
The central dashboard for financial tracking.

### Key Features
*   **Hero Card**: Displays "Available Balance", "Spend Percentage", and "Total Used" vs. Monthly Income.
*   **Quick Actions**:
    *   **Add Expense**: Navigates to the expense logging screen.
    *   **History**: View full transaction history.
*   **Financial Goals**:
    *   **Emergency Fund**: Visualizes progress towards the saved goal.
    *   **Savings Rate**: Compares actual savings vs. target rate.
*   **Analytics**: A `SpendingChart` showing expense trends.
*   **Recent Transactions**: A preview of the last 3 transactions.

## 3. Earn Tab (`app/(tabs)/earn.jsx`)
Focused on increasing income through side hustles.

### Key Features
*   **Job Listings**: A horizontal list of freelance opportunities (Writing, Virtual Assistant, Design).
    *   **Job Details**: Clicking a job opens a modal with requirements, pay range, and "How to Start" guide.
*   **Earnings Tracker**: Users can log extra income (Amount & Source).
*   **Visual Analytics**: A monthly earnings bar chart (`EarningsChart`) to track progress.
*   **Data Isolation**: Earnings are stored per-user (`earnings_${userId}`).

## 4. Profile Tab (`app/(tabs)/profile.jsx`)
The user's account management hub.

### Key Features
*   **Header**: Displays user avatar, name, and email.
*   **Menu System**: Grouped settings for "Account", "Finance", and "More".
*   **Emergency Fund Widget**: Quick view of emergency fund progress within the menu.
*   **Logout**: A standalone button that clears local storage and redirects to login.

## 5. Community Tab (`app/(tabs)/community.jsx`)
A social space for financial discussions.

### Key Features
*   **Feed**: Displays user posts categorized by topic (Budgeting, Savings, Side Hustles).
*   **Interactions**: Users can Like and Comment on posts.
*   **Create Post**: A Floating Action Button (FAB) positioned at the bottom right allows users to start new discussions.

## 6. Learn Tab (`app/(tabs)/learn.jsx`)
An educational hub for financial literacy.

### Key Features
*   **Resource Library**: A scrollable list of curated articles and guides.
*   **Topics**: Covers the 50/30/20 Rule, Emergency Funds, Investing, Debt Repayment, and Smart Shopping.
*   **External Links**: Tapping a card opens the full article in the browser.

## 7. Expense Management (`AddExpense.jsx`)
The core feature for tracking spending.

### Features
*   **Input Fields**: Amount, Category (Chip selection), Date (Picker), and Description.
*   **Validation**: Ensures amount and category are provided.
*   **API Integration**: Posts data to `/api/expenses`.

## 8. Technical Architecture

### Tech Stack
*   **Framework**: React Native with Expo Router.
*   **Styling**: Custom StyleSheet with a centralized Color Palette.
*   **Storage**: `@react-native-async-storage/async-storage` for local data persistence.
*   **Icons**: `@expo/vector-icons` (MaterialIcons, Ionicons).
*   **Charts**: `react-native-chart-kit`.

### Design System
*   **Colors**:
    *   Background: `#141326` (Dark Purple)
    *   Cards: `#433DA3` (Light Purple)
    *   Primary: `#E3823C` (Orange)
    *   Accent: `#FFC107` (Yellow)
*   **Typography**: Poppins font family (Bold, SemiBold, Medium, Regular).
*   **Responsiveness**: Uses `scale`, `verticalScale`, and `moderateScale` utilities to adapt to different screen sizes.

### Data Handling
*   **User Data**: Stored in `userData` (Auth token, Name, Email).
*   **Budget Settings**: Stored in `userBudget` (Income, Goals).
*   **Earnings**: Stored in `earnings_${userId}` to ensure privacy between users on the same device.
