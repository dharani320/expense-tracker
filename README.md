 # Expense Tracker

A full-stack expense tracking application built with React, Node.js, Express, and PostgreSQL.

## Features

- Add new expenses
- View all expenses
- Edit existing expenses
- Delete expenses
- Search expenses by title
- Filter expenses by category
- Category-wise expense summary
- Total expense calculation
- Transaction count
- Average expense calculation
- PostgreSQL database integration
- REST API using Express

## Tech Stack

### Frontend

- React
- Vite
- JavaScript
- HTML
- CSS

### Backend

- Node.js
- Express.js
- REST API
- CORS

### Database

- PostgreSQL

## Project Structure

```text
expense-tracker/
├── .gitignore
├── README.md
│
├── frontend/
│   ├── src/
│   │   └── App.jsx
│   ├── package.json
│   └── ...
│
└── backend/
	├── server.js
	├── package.json
	└── .env
```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/expenses` | Get all expenses |
| POST | `/expenses` | Add a new expense |
| PUT | `/expenses/:id` | Update an expense |
| DELETE | `/expenses/:id` | Delete an expense |

## Database

The application uses PostgreSQL with an `expenses` table containing:

- `id`
- `title`
- `category`
- `amount`
- `expense_date`
- `created_at`

## How to Run

### 1. Clone the repository

```bash
git clone YOUR_GITHUB_REPOSITORY_URL
cd expense-tracker
```

### 2. Start the backend

```bash
cd backend
npm install
npm start
```

The backend runs on:

```text
http://localhost:5000
```

### 3. Start the frontend

Open another terminal:

```bash
cd frontend
npm install
npm run dev
```

The frontend runs on:

```text
http://localhost:5173
```

## Environment Variables

Create a `.env` file inside the `backend` folder:

```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=expense_tracker
DB_USER=postgres
DB_PASSWORD=YOUR_POSTGRES_PASSWORD
```

Do not commit the `.env` file to GitHub.

## Future Improvements

- Expense charts and visual analytics
- Monthly expense reports
- User authentication
- Export expenses to CSV
- Responsive mobile improvements
- Deployment to a cloud platform

## Author

Dharani
