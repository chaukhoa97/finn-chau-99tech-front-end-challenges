# 99Tech Front-End Challenges

## Quick Start

```bash
# Install dependencies
pnpm install

# Start development server (shows Problem 2)
pnpm run dev

# Build for production
pnpm run build

# Preview production build
pnpm preview
```

## Project Structure

```
finn-chau-99tech-front-end-challenges/
├── src/
│   ├── Problem2.tsx         # Fancy Form with token selection
│   ├── Problem3.tsx         # Messy React code (original)
│   ├── Problem3Fixed.tsx    # Cleaned up React code
│   ├── Problem4.tsx         # Three algorithms to sum to n
│   └── components/
│       ├── TokenIcon.tsx    # Token icon component
│       └── WalletRow.ts     # Wallet row component
├── backend/                 # Problem 5 - Express CRUD API (see backend/README.md)
├── package.json            # Frontend dependencies
└── README.md              # This file
```

## Problems Solved

### Problem 2: Fancy Form

**Location**: `src/Problem2.tsx`

- **Tech Stack**: React + TypeScript + TailwindCSS + Vite
- **Features**:
  - Token selection with search and filtering
  - Real-time price fetching with loading states
  - Form validation and submission
  - Optimized for slow internet connections
  - Responsive design

### Problem 3: Messy React Code

**Location**: `src/Problem3.tsx` (original with comments), `src/Problem3Fixed.tsx` (refactored)

### Problem 4: Three Ways to Sum to N

**Location**: `src/Problem4.tsx`. Implement sum calculation using 3 different approaches. Time/space complexity analysis included.

### Problem 5: Express CRUD API

**Location**: `backend/`. Please check `backend/README.md`
