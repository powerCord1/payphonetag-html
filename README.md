# Payphone Tag - HTML/EJS App (Basic HTML version)

A server-side rendered **Payphone Tag** web application built with **Express** and **EJS**, designed specifically for basic web browsers. All page rendering, navigation, and user interactions rely exclusively on standard server-based HTTP requests, HTML forms, and standard links.

## Overview

**Payphone Tag** is a real-world, location-based urban game that repurposes Telstra payphones as physical capture zones. Players navigate urban environments to claim payphones, build streaks, earn rank, and compete against rivals.

This web application provides a lightweight, JS-free interface to inspect live player activity, stats, and notifications directly from the Payphone Tag network API.

## Features

- **100% JavaScript-Disabled Compatible**: Fully functional with zero client-side scripts (`<script>` tags are not required or used).
- **Activity Alerts**: Displays rank promotions, rank demotions, badge unlocks, and payphone steals in chronological order from **oldest to newest**.
- **Player Statistics Dashboard**: Live statistics including current rank, score, streaks, captures, account status, rival nemesis, and unlocked badges.
- **Custom Notifications Feed**: View streak warnings and custom network alerts.
- **Seamless Server Session Management**: PIN-based authentication stored securely in HTTP cookies, with query parameter login support (`/?pin=YOUR_PIN`).

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18+ recommended)
- `npm`

### Installation

1. Clone or download the repository:
   ```bash
   git clone https://github.com/powerCord1/payphonetag-html.git
   cd payphonetag-html
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

### Running the App

Start the production server:
```bash
npm start
```

Or start the server in watch mode for development:
```bash
npm run dev
```

The application will be accessible at **`http://localhost:3000`**.

## Usage

1. Open `http://localhost:3000` in your web browser.
2. Enter your **Payphone Tag Player PIN** (e.g. `12345`) on the login screen.
3. Alternatively, pass your PIN via query parameter:
   ```
   http://localhost:3000/?pin=12345
   ```
4. Navigate between tabs using the HTML navigation links:
   - **Alerts**: `http://localhost:3000/?tab=alerts`
   - **Stats**: `http://localhost:3000/?tab=stats`
   - **Notifications**: `http://localhost:3000/?tab=notifications`
5. Click **Logout** anytime to clear your saved session cookie.