# Data Ingestion Portal

A data ingestion application with a React frontend and Node.js backend designed to interact with ClickHouse databases. This app allows users to connect to a ClickHouse instance, import CSV data into ClickHouse, export data from ClickHouse to CSV, and load sample datasets for testing.

## Features

- Connect to ClickHouse database
- Import CSV files into ClickHouse
- Export ClickHouse data to CSV
- Load sample datasets (people, UK price paid, ontime flights)
- Progress indication during data ingestion
- Responsive and user-friendly React frontend

## Tech Stack

- **Frontend:** React, TypeScript, Vite, TailwindCSS
- **Backend:** Node.js, Express, ClickHouse client
- **Other:** Docker, Papaparse, Zod, Lucide-react icons

## Installation

### Prerequisites

- Node.js (v16+ recommended)
- npm (comes with Node.js)
- Docker (optional, for containerized setup)

### Backend Setup

```bash
cd server
npm install
npm start
```

The backend server will start on port 4000 by default.

### Frontend Setup

From the project root directory:

```bash
npm install
npm run dev
```

The frontend development server will start (usually on port 3000).

## Running with Docker

You can run the entire application stack using Docker and Docker Compose:

```bash
docker-compose up
```

This will start the ClickHouse server, backend, and frontend services.

## Usage

1. Open the frontend in your browser (e.g., http://localhost:3000).
2. Use the connection form to connect to your ClickHouse database.
3. Choose the direction of data flow:
   - **ClickHouse to CSV:** Export data from ClickHouse tables to CSV files.
   - **CSV to ClickHouse:** Import CSV files into ClickHouse tables.
4. Select the schema and columns to preview data.
5. Start the ingestion or export process and monitor progress.
6. Optionally, use the backend API endpoints to load sample datasets for testing:
   - `/api/setup-sample-data`
   - `/api/setup-uk-price-paid`
   - `/api/setup-ontime`

## Project Structure

```
.
├── server/                 # Backend Node.js Express server
│   ├── index.js            # Backend main entry point
│   ├── package.json        # Backend dependencies and scripts
├── src/                    # Frontend React source code
│   ├── components/         # React components (ConnectionForm, SchemaViewer, etc.)
│   ├── lib/                # Utility libraries (ClickHouse client, CSV parsing)
│   ├── App.tsx             # Main React component
│   ├── main.tsx            # Frontend entry point
├── Dockerfile              # Dockerfile for backend or full app
├── docker-compose.yml      # Docker Compose configuration
├── package.json            # Frontend dependencies and scripts
├── vite.config.ts          # Vite configuration
├── tailwind.config.js      # Tailwind CSS configuration
└── README.md               # This file
```



