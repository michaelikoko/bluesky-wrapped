# Bluesky Wrapped 2025

A year-in-review web application for Bluesky users. Analyze your 2025 activity, engagement, and personality on Bluesky with visualizations and shareable summary cards.

## Features
- Activity overview (posts, replies, reposts, quotes)
- Engagement metrics (likes, reposts, replies, bookmarks)
- Top performing posts with full engagement breakdown
- Monthly activity and engagement patterns
- Hashtag and word usage analysis
- Community interactions tracking
- AI-powered personality analysis using Gemini
- Interactive story format with smooth animations
- Downloadable summary images for social sharing

## Tech Stack
- Next.js 14 (App Router)
- TypeScript
- TailwindCSS + DaisyUI
- Framer Motion (animations)
- AT Protocol / Bluesky API
- Tanstack Query (data fetching)
- Chart.js (data visualization)
- Takumi (OG image generation)
- Google Gemini AI (personality analysis)

### Installation
```bash
# Clone the repository
git clone https://github.com/michaelikoko/bluesky-wrapped.git

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local

# Add your Gemini API key to .env.local
GEMINI_API_KEY=your_api_key_here

# Run development server
npm run dev
```

Visit `http://localhost:3000` and enter any Bluesky handle to generate their wrapped.

## Environment Variables
```
GEMINI_API_KEY=your_gemini_api_key
```

## Contributing
Contributions welcome. Please open an issue first to discuss changes.