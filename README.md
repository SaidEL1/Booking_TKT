# Multilingual Ticket Booking System
## 🎥 Preview

![screenshot](./public/images/preview.png)

A full-featured, multilingual ticket booking web application built with Next.js 13 App Router and Tailwind CSS. Supports Arabic, English, French, and Spanish with locale-based routing.

## Features

- 🌍 **Multilingual Support**: Arabic, English, French, Spanish
- 🎫 **Complete Booking System**: Form validation, data persistence, QR code generation
- 📧 **Email Confirmation**: Automatic email with QR code attachment
- 📱 **Responsive Design**: Modern UI with Tailwind CSS
- 🔒 **Data Persistence**: JSON file-based storage
- 🎨 **RTL Support**: Proper right-to-left layout for Arabic

## Tech Stack

- **Framework**: Next.js 13 with App Router
- **Styling**: Tailwind CSS
- **QR Code Generation**: qrcode library
- **Email Service**: nodemailer
- **Unique IDs**: uuid
- **Languages**: JavaScript/React

## Project Structure

```
├── public/
│   ├── css/
│   ├── images/
│   └── qrcodes/          # Auto-generated QR codes
├── data/
│   └── bookings.json     # Auto-generated booking data
├── src/
│   ├── app/
│   │   ├── globals.css
│   │   ├── layout.js
│   │   ├── api/
│   │   │   └── book/
│   │   │       └── route.js
│   │   └── [locale]/
│   │       ├── page.js           # Home page
│   │       ├── book/
│   │       │   └── page.js       # Booking form
│   │       └── ticket/
│   │           └── [id]/
│   │               └── page.js   # Ticket details
│   └── lib/
│       └── translations.js
├── .env.local
├── next.config.mjs
├── tailwind.config.js
├── postcss.config.js
└── package.json
```

## Installation

1. **Clone or download the project**

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure environment variables**:
   - Copy `.env.local` and update with your email credentials
   - For Gmail, you need:
     - Enable 2-factor authentication
     - Generate an app-specific password
     - Use the app password in `EMAIL_PASS`

4. **Run the development server**:
   ```bash
   npm run dev
   ```

5. **Open your browser**:
   - Visit `http://localhost:3000/ar` (Arabic - default)
   - Or `http://localhost:3000/en` (English)
   - Or `http://localhost:3000/fr` (French)
   - Or `http://localhost:3000/es` (Spanish)

## Usage

### Booking Process

1. **Home Page**: Choose your language and click "Book Ticket"
2. **Booking Form**: Fill in:
   - Name (required)
   - Destination (required)
   - Date (required)
   - Number of tickets (required)
   - Email (required)
   - Payment status (checkbox)
3. **Confirmation**: View your ticket with QR code
4. **Email**: Receive confirmation email with QR code attachment

### Language Switching

- Use the language switcher in the header
- URLs follow the pattern: `/{locale}/path`
- Supported locales: `ar`, `en`, `fr`, `es`

## Configuration

### i18n Settings (next.config.mjs)
- Locales: `['ar', 'en', 'fr', 'es']`
- Default locale: `ar`
- Locale detection: disabled

### Email Configuration
Update `.env.local` with your email credentials:
```bash
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
```

## API Endpoints

### POST /api/book
Creates a new booking with:
- Form validation
- Unique ID generation
- QR code creation
- Data persistence
- Email confirmation

**Request Body**:
```json
{
  "name": "John Doe",
  "destination": "Paris",
  "date": "2024-08-15",
  "tickets": 2,
  "email": "john@example.com",
  "paid": true,
  "locale": "en"
}
```

**Response**:
```json
{
  "success": true,
  "bookingId": "uuid-string",
  "message": "Booking created successfully"
}
```

## File Structure Details

### Data Storage
- `data/bookings.json`: Auto-generated JSON file storing all bookings
- `public/qrcodes/`: Auto-generated QR code images

### Translations
- All text is stored in `src/lib/translations.js`
- Supports 4 languages with fallback to English
- Easy to extend with new languages

### Styling
- Tailwind CSS with custom components
- RTL support for Arabic
- Responsive design
- Custom color scheme and typography

## Development

### Adding New Languages
1. Add locale to `next.config.mjs`
2. Add translations to `src/lib/translations.js`
3. Update language switcher components

### Customizing Styles
- Modify `src/app/globals.css` for global styles
- Update `tailwind.config.js` for theme customization
- Use Tailwind utility classes in components

### Email Templates
- Customize email HTML in `src/app/api/book/route.js`
- Modify the `sendConfirmationEmail` function

## Production Deployment

1. **Build the application**:
   ```bash
   npm run build
   ```

2. **Start production server**:
   ```bash
   npm start
   ```

3. **Environment Variables**:
   - Ensure `.env.local` is properly configured
   - Consider using environment-specific variables

## Troubleshooting

### Email Issues
- Verify Gmail app password is correct
- Check 2FA is enabled on Gmail account
- Ensure EMAIL_USER and EMAIL_PASS are set

### QR Code Issues
- Check `public/qrcodes/` directory permissions
- Verify qrcode library is installed

### Booking Data
- Check `data/` directory permissions
- Verify JSON file format in `data/bookings.json`

## License

This project is open source and available under the MIT License.

## Support

For issues and questions, please check the troubleshooting section above or review the code comments for detailed implementation notes.
--------------------------------------------------
 ![demo](./public/images/booking-demo.gif)


A full-featured, multilingual ticket booking web application built with **Next.js (App Router)** and **Tailwind CSS**. Supports **Arabic**, **English**, **French**, and **Spanish** with locale-based routing and proper RTL for Arabic.

[![Node](https://img.shields.io/badge/node-20.x-blue.svg)](#) [![Next.js](https://img.shields.io/badge/nextjs-app--router-black.svg)](#) [![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](#)

## Table of Contents
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Usage](#usage)
- [Configuration](#configuration)
- [API](#api)
- [Development](#development)
- [Production](#production-deployment)
- [Security & Privacy](#security--privacy)
- [Troubleshooting](#troubleshooting)
- [Roadmap](#roadmap)
- [License](#license)

## Features
- 🌍 **Multilingual Support**: ar / en / fr / es
- 🎫 **Booking System**: validation, JSON persistence, QR code generation
- 📧 **Email Confirmation**: nodemailer with QR attachment
- 📱 **Responsive UI**: Tailwind + RTL for Arabic
- 🔒 **Data Persistence**: JSON file-based storage
- 🧭 **Locale Routing**: `/[locale]/...`

## Tech Stack
- **Framework**: Next.js (App Router)
- **Styling**: Tailwind CSS
- **QR**: `qrcode`
- **Email**: `nodemailer`
- **IDs**: `uuid`
- **Lang**: JavaScript/React

## Project Structure
