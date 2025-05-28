# Elev8 Business Website

A modern, responsive business website built with React, TypeScript, and Tailwind CSS. Features an elevator pitch style homepage, comprehensive service offerings, portfolio showcase, and contact functionality.

## 🚀 Features

- **Modern Design**: Clean, professional design with smooth animations
- **Responsive**: Fully responsive design that works on all devices
- **Performance Optimized**: Built with performance best practices
- **TypeScript**: Full TypeScript support for better development experience
- **SEO Ready**: Structured for search engine optimization
- **Accessible**: Built with accessibility best practices

## 📁 Project Structure

```
elev8-website/
├── public/
│   ├── index.html
│   └── favicon.ico
├── src/
│   ├── components/
│   │   ├── common/           # Reusable UI components
│   │   └── layout/           # Layout components
│   │       ├── Header.tsx    # Navigation header
│   │       ├── Footer.tsx    # Site footer
│   │       └── Layout.tsx    # Main layout wrapper
│   ├── pages/                # Page components
│   │   ├── Home.tsx          # Elevator pitch homepage
│   │   ├── About.tsx         # Company information
│   │   ├── Services.tsx      # Service offerings
│   │   ├── Portfolio.tsx     # Project showcase
│   │   └── Contact.tsx       # Contact form and info
│   ├── hooks/                # Custom React hooks
│   ├── utils/                # Utility functions
│   ├── types/                # TypeScript type definitions
│   ├── assets/               # Static assets
│   │   ├── images/           # Image files
│   │   └── icons/            # Icon files
│   ├── App.tsx               # Main App component
│   ├── index.tsx             # Entry point
│   └── index.css             # Global styles
├── tailwind.config.js        # Tailwind CSS configuration
├── postcss.config.js         # PostCSS configuration
├── tsconfig.json             # TypeScript configuration
└── package.json              # Dependencies and scripts
```

## 🛠️ Technologies Used

- **React 18**: Modern React with hooks and functional components
- **TypeScript**: Type safety and better development experience
- **Tailwind CSS**: Utility-first CSS framework for styling
- **React Router DOM**: Client-side routing
- **PostCSS**: CSS processing with autoprefixer

## 📦 Installation

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Start the development server**
   ```bash
   npm start
   ```

3. **Open your browser**
   Navigate to `http://localhost:3000` to view the website

## 🎨 Customization

### Brand Colors
The primary brand colors can be customized in `tailwind.config.js`:

```javascript
theme: {
  extend: {
    colors: {
      primary: {
        50: '#eff6ff',
        500: '#3b82f6',
        600: '#2563eb',
        700: '#1d4ed8',
      }
    }
  }
}
```

### Content Updates
- **Company Information**: Update in `src/pages/About.tsx`
- **Services**: Modify service offerings in `src/pages/Services.tsx`
- **Portfolio**: Add your projects in `src/pages/Portfolio.tsx`
- **Contact Information**: Update contact details in `src/components/layout/Footer.tsx` and `src/pages/Contact.tsx`

## 📱 Pages Overview

### Home Page
- Hero section with compelling value proposition
- Key benefits and features
- Social proof and statistics
- Call-to-action sections

### About Page
- Company story and mission
- Team member profiles
- Core values and principles

### Services Page
- Comprehensive service listings
- Service process explanation
- Feature highlights

### Portfolio Page
- Project case studies
- Client testimonials
- Success metrics

### Contact Page
- Contact form with validation
- Business information
- Office hours

## 🚀 Available Scripts

### `npm start`
Runs the app in development mode. Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

### `npm test`
Launches the test runner in interactive watch mode.

### `npm run build`
Builds the app for production to the `build` folder.

### `npm run eject`
**Note: this is a one-way operation. Once you `eject`, you can't go back!**

## 🚀 Deployment

### Build for Production
```bash
npm run build
```

### Deploy to Netlify
1. Build the project: `npm run build`
2. Deploy the `build` folder to Netlify
3. Configure redirects for React Router

### Deploy to Vercel
1. Install Vercel CLI: `npm i -g vercel`
2. Run: `vercel`
3. Follow the prompts

## 📄 License

This project is licensed under the MIT License.

---

Built with ❤️ by the Elev8 team
