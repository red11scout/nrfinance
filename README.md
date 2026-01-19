# Nations Roof Financial Analyzer

A comprehensive AI Transformation Financial Analysis tool built for Nations Roof, providing CFO-grade investment analysis, ROI projections, and scenario modeling for a 5-platform AI initiative.

## Overview

This application analyzes the financial impact of implementing five integrated AI platforms across the commercial roofing value chain, delivering end-to-end automation from autonomous lead generation through project delivery.

**Total Annual Financial Benefit: $111.9M**

### Key Metrics
- **5 AI Platforms** - Comprehensive coverage across the entire value chain
- **30+ AI Agents** - Specialized automation for each business function
- **<4 Month Payback** - Rapid return on investment
- **2,100%+ Year 1 ROI** - Exceptional financial performance

## Features

### Dashboard
- Executive summary with key financial metrics
- Platform breakdown with detailed use cases
- Interactive AI explainer for financial analysis
- Multiple export options (PDF, Excel)

### CFO Investment Analysis
- NPV sensitivity analysis with multiple discount rates
- IRR calculation with Newton-Raphson method
- 5-year financial projections
- Industry benchmark comparisons
- Investment decision criteria (NPV/IRR/Payback/PI tests)
- Risk-adjusted returns

### Monte Carlo Simulation
- 10,000+ scenario simulations
- Probability distribution histogram
- Confidence intervals (90%, 80%, 50%)
- Risk analysis with downside/upside probabilities

### Scenario Builder
- Custom scenario modeling
- Platform-level adjustments
- Real-time financial impact calculations

### Executive Reports
- Executive Summary PDF (Board-ready)
- CFO Analysis PDF with full metrics
- Comprehensive Excel Financial Model

## Tech Stack

- **Frontend**: React 19, TypeScript, Tailwind CSS 4
- **Backend**: Express 4, tRPC 11
- **Database**: MySQL/TiDB with Drizzle ORM
- **Charts**: Recharts
- **PDF Generation**: jsPDF
- **Excel Generation**: openpyxl (Python)

## Platform Breakdown

| Platform | Name | Annual Benefit |
|----------|------|----------------|
| P0 | Market Expansion Engine | $35.0M |
| P1 | Sales Intelligence Suite | $24.2M |
| P2 | Estimation Automation Suite | $23.2M |
| P3 | Project Management Suite | $21.6M |
| P4 | Knowledge Management System | $7.9M |

## Getting Started

### Prerequisites
- Node.js 22+
- pnpm
- MySQL/TiDB database

### Installation

```bash
# Install dependencies
pnpm install

# Set up environment variables
cp .env.example .env
# Edit .env with your database credentials

# Push database schema
pnpm db:push

# Start development server
pnpm dev
```

### Environment Variables

```
DATABASE_URL=mysql://user:password@host:port/database
JWT_SECRET=your-jwt-secret
```

## Project Structure

```
client/
  src/
    pages/          # Page components
    components/     # Reusable UI components
    utils/          # Utility functions (PDF, Excel export)
    lib/            # tRPC client configuration
server/
  routers.ts        # tRPC procedures
  db.ts             # Database helpers
  aiExplainer.ts    # AI explanation service
drizzle/
  schema.ts         # Database schema
shared/
  documentData.ts   # Financial data and calculations
```

## Branding

This application is branded for BlueAlly, featuring the BlueAlly logo throughout the interface and exported reports.

## License

Proprietary - BlueAlly / Nations Roof

## Contact

For questions or support, contact the BlueAlly team.
