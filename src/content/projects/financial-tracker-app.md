---
title: "Personal Finance Tracker"
description: "Full-stack web application for tracking expenses, budgeting, and financial goal setting. Features automated transaction categorization and insightful spending analytics."
pubDate: 2025-10-05
featured: false
tags: ["Full Stack", "TypeScript", "Next.js", "PostgreSQL"]
image: "/images/projects/finance-tracker.png"
liveUrl: "https://finance-tracker-demo.vercel.app"
githubUrl: "https://github.com/kiteliudingyue/finance-tracker"
---

## Problem Statement

Managing personal finances can be overwhelming without the right tools. This application simplifies expense tracking and provides actionable insights to help users achieve their financial goals.

## Features

### Core Functionality
- **Transaction Management**: Add, edit, categorize income and expenses
- **Budget Planning**: Set monthly budgets by category with alerts
- **Goal Tracking**: Define savings goals with progress visualization
- **Analytics Dashboard**: Spending trends, category breakdown, net worth over time

### Smart Features
- Auto-categorization using ML classification
- Receipt scanning with OCR (Tesseract.js)
- Recurring transaction detection
- Export to CSV/Excel

## Architecture

### Frontend
- Next.js 14 with App Router
- TypeScript for type safety
- Tailwind CSS + shadcn/ui components
- React Query for data fetching
- Chart.js for visualizations

### Backend
- Next.js API routes
- PostgreSQL with Prisma ORM
- NextAuth.js for authentication
- Redis for caching

### Deployment
- Vercel for hosting
- Supabase for PostgreSQL
- AWS S3 for receipt storage

## Impact

Over 500 beta users have tracked $2M+ in transactions, with users reporting average savings increase of 18% within 3 months.
