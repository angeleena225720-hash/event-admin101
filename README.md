# Event Registration – Admin Panel (MERN)

## 1. Backend
cd server
npm install
cp .env.example .env      # paste your MongoDB Atlas connection string in MONGO_URI
npm run dev               # runs on http://localhost:5001

## 2. Frontend (new terminal)
cd client
npm install
npm run dev               # runs on http://localhost:5173

## REST API
GET    /api/events        list events
GET    /api/events/:id    single event
POST   /api/events        create event {name, description, date, venue}
PUT    /api/events/:id    update event
DELETE /api/events/:id    delete event
