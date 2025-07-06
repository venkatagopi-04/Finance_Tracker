# Personal Finance Assistant

A full-stack **Personal Finance Assistant** application to help users track, manage, and understand their financial activities with a clean, modern interface and advanced features.

Built with the **MERN stack (MongoDB, Express, React, Node.js)**.

# Demo

## [Video Link https://youtu.be/PjFFJe6Ve4c](https://youtu.be/PjFFJe6Ve4c)

---

## Features

**Meets all assignment requirements:**

- Create income and expense entries via web app.
- List income/expenses in a selected time range.
- Graphs: Expenses by category, date, etc. (Pie, Bar, Line charts, Heatmaps).
- Extract expenses from uploaded **Receipts (images, PDFs)**.
- Persist data securely in a MongoDB database.
- Frontend communicates with backend through APIs (clean separation).

**Implements all bonus features:**

- Upload and parse transaction history from **tabular PDFs**.
- Pagination in list API & UI.
- Multi-user support with authentication & profiles.

**Additional features:**

- Integrated AI chatbot for financial queries.
- Single or multiple bills extraction from PDF/image uploads.
- Filters for transactions by date, category, type, etc.
- Dedicated dashboards with user profiles, settings, and visual summaries.
- Edit and delete transactions.
- Dark and light theme toggle.

---

## Tech Stack

- **Frontend:** React.js, Chart.js / Recharts, Axios, Context API
- **Backend:** Node.js, Express.js, JWT Auth
- **Database:** MongoDB (Mongoose)
- **AI Integration:** Finance domain chatbot Functionality using [Gemini-Flash]
- **PDF & Image Processing:** Tesseract.js, pdf-parse
- **Other:**
  - Concurrently (to run frontend & backend together)
  - dotenv for config
  - Multer for file uploads

---

## Setup & Run

### Prerequisites

- Node.js
- MongoDB (local or Atlas)
- npm

### Clone the repository

```bash
git clone https://github.com/venkatagopi-04/Finance_Tracker
cd <repo-folder>
```


### Configure environment variables

Create a `.env` file inside the `backend/` folder and set up:

```
MONGO_URI=<your-mongodb-uri>
GOOGLE_GEMINI_APIKEY=<key>
```

---

### Install dependencies

Run from **root folder**:

```bash
npm install
```

This will install dependencies for both `frontend` and `backend` via `postinstall`.
 

---

## Running the App

### Run both frontend & backend together

From **root folder** (which contains `package.json` to run both servers with one command):

```bash
npm run dev
```

This uses `concurrently` to run:

- Frontend on [http://localhost:3000](http://localhost:3000)
- Backend on [http://localhost:5000](http://localhost:5000)

---

### Or run separately

#### Backend

```bash
cd backend
npm install
npm run server
```

#### Frontend

Open a new terminal:

```bash
cd frontend
npm install
npm start
```

---

## Folder Structure

```
/frontend       # React.js app (has its own package.json)
/backend        # Node.js + Express API (has its own package.json)
package.json    # Root: manages both servers, with concurrently
```

---

## Graph Types Included

- Expenses by category: Pie chart
- Expenses over time: Line chart
- Spending summary: Bar chart
- Heatmaps of spending patterns

---

## Multi-user Support

- Secure signup/login with JWT auth.
- User-specific transactions, settings, and dashboards.

---

## Notes

- Clean, modular, and documented code
- Robust error handling & validations
- README with clear setup instructions

---

