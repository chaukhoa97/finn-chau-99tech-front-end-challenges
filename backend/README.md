# Express TypeScript CRUD API

## Quick Start

```bash
# Install dependencies
pnpm install

# Start development server
pnpm run dev

# Build for production
pnpm run build

# Preview production build
pnpm start
```

## Project Structure

```
backend/
├── src/
│   ├── server.ts           # Main server file
│   ├── controllers.ts      # Route handlers
│   └── types/
│       └── index.ts        # TypeScript interfaces
├── dist/                   # Compiled JavaScript
├── database.json           # JSON data storage
├── package.json            # Dependencies & scripts
├── tsconfig.json          # TypeScript configuration
└── README.md              # This file
```

## Features

- Technology stack: Express.js, TypeScript, Node.js, JSON
- Full CRUD operations (Create, Read, Update, Delete)
- Resource filtering by category and status

## API Endpoints

| Method | Endpoint           | Description               |
| ------ | ------------------ | ------------------------- |
| GET    | /                  | API info & database stats |
| GET    | /api/resources     | Get all resources         |
| GET    | /api/resources/:id | Get resource by ID        |
| POST   | /api/resources     | Create new resource       |
| PUT    | /api/resources/:id | Update resource           |
| DELETE | /api/resources/:id | Delete resource           |

## Usage Examples

### Get All Resources

```bash
curl http://localhost:3000/api/resources
```

### Filter Resources

```bash
# By ID
curl http://localhost:3000/api/resources/1

# By category & status
curl "http://localhost:3000/api/resources?category=tutorial&status=active"
```

### Create Resource

```powershell
# PowerShell
$body = '{"name": "Learn TypeScript", "description": "TypeScript fundamentals", "category": "tutorial", "status": "active"}'
curl -X POST http://localhost:3000/api/resources -H "Content-Type: application/json" -d $body
```

```bash
# Unix/Linux/macOS
curl -X POST http://localhost:3000/api/resources \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Learn TypeScript",
    "description": "TypeScript fundamentals",
    "category": "tutorial",
    "status": "active"
  }'
```

### Update Resource

```powershell
# PowerShell
$body = '{"status": "inactive"}'
curl -X PUT http://localhost:3000/api/resources/1 -H "Content-Type: application/json" -d $body
```

```bash
# Unix/Linux/macOS
curl -X PUT http://localhost:3000/api/resources/1 \
  -H "Content-Type: application/json" \
  -d '{"status": "inactive"}'
```

### Delete Resource

```bash
curl -X DELETE http://localhost:3000/api/resources/1
```

## Resource Schema

```typescript
interface Resource {
  id: number
  name: string
  description: string
  category: string
  status: 'active' | 'inactive'
  createdAt: string
  updatedAt: string
}
```
