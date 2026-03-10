# Dynamic Green Energy - Company Website

## Overview
A modern, responsive company website for Dynamic Green Energy, a solar energy EPC developer based in Madurai, Tamil Nadu, India. The site showcases the company's solar project portfolio, services, and contact information.

## Architecture
- **Frontend**: React + TypeScript with Vite, Tailwind CSS, shadcn/ui components
- **Backend**: Express.js (minimal - primarily serves the frontend)
- **Styling**: Tailwind CSS with custom green energy theme, Poppins font
- **Animations**: Framer Motion for scroll animations and transitions

## Structure
- `client/src/pages/home.tsx` - Main single-page website with all sections
- `client/src/App.tsx` - Router setup
- `client/public/images/` - Generated images for hero, services, and about sections

## Key Sections
1. **Hero** - Full-screen hero with solar panel background
2. **Stats** - Key metrics (120+ MW, 50+ projects, 6+ years, 100+ team)
3. **About** - Company overview and mission
4. **Services** - EPC, O&M, Installation & Commissioning
5. **Turnkey Solutions** - 4-step process timeline
6. **Projects** - Portfolio of completed solar installations
7. **Growth Timeline** - Year-by-year company growth
8. **Leadership** - Company board members
9. **Contact** - Address, phone, email, GSTIN

## Company Details
- **Name**: Dynamic Green Energy
- **Address**: Flat No:189, Thamirabarani Street, Park Town, Madurai-625017, Tamil Nadu, India
- **Phone**: +91 80728 24034
- **Email**: dynamicmdu2018@gmail.com
- **GSTIN**: 33ATLPV5789M1ZK

## Running
- `npm run dev` starts the Express + Vite dev server
