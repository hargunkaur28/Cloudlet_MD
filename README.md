# Mini Drive 🚀

Mini Drive is a full-stack, lightweight Google Drive clone built with the MERN stack (MongoDB, Express, React, Node.js) and Vite.

It features a clean, professional, and minimal aesthetic inspired by Linear or Vercel, completely stylized with Tailwind CSS. It supports a full dark and light mode toggle.

## Features

- **Authentication:** Secure JWT-based authentication using HTTP-only cookies.
- **File Management:** Upload files (images, PDFs) up to 10MB using a drag-and-drop interface.
- **Cloud Storage:** Files are seamlessly backed up to Cloudinary.
- **Access Control:** Share files securely. Users can request access to view private files, and owners can approve or reject these requests.
- **Admin Dashboard:** Specific users with the `admin` role have access to a system-wide overview of all users and files.
- **Responsive UI:** A fully responsive file dashboard with list/grid toggle options.

## Tech Stack

- **Frontend:** React (Vite), React Router v6, Tailwind CSS v4, Lucide React icons, Axios.
- **Backend:** Node.js, Express.js.
- **Database:** MongoDB Atlas + Mongoose.
- **File Storage:** Cloudinary, Multer (memory storage).

## Local Development Setup

### 1. Clone the repository

```bash
git clone <repo-url>
cd mini_drive
```

### 2. Backend Setup
```bash
cd server
npm install
```
Create a `.env` file in the `server` directory and add your credentials:
```
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
CLOUDINARY_CLOUD_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
CLIENT_URL=http://localhost:5173
PORT=5000
```
Run the backend server:
```bash
npm run dev
```

### 3. Frontend Setup
```bash
cd client
npm install
```
Create a `.env` file in the `client` directory (optional if backend is running on default 5000):
```
VITE_API_URL=http://localhost:5000/api
```
Run the frontend development server:
```bash
npm run dev
```

Visit `http://localhost:5173` to view the app!

## Deployment Instructions

### Backend (Render)
1. Connect your repository to Render using a **Web Service**.
2. Set the Root Directory to `server`.
3. Build Command: `npm install`
4. Start Command: `npm start` (or `node index.js`)
5. Add all Environmental Variables required.

### Frontend (Vercel)
1. Import the repository in Vercel.
2. Set the Framework Preset to **Vite**.
3. Set the Root Directory to `client`.
4. Add the `VITE_API_URL` Environment Variable pointing to your Render backend URL.
5. Deploy!

## API Structure

- `POST /api/auth/signup`
- `POST /api/auth/login`
- `POST /api/auth/logout`
- `GET /api/auth/me`
- `POST /api/files/upload`
- `GET /api/files`
- `GET /api/files/:id`
- `DELETE /api/files/:id`
- `POST /api/files/:id/request-access`
- `PATCH /api/files/:id/grant-access`
- `GET /api/files/shared-with-me`
- `GET /api/admin/files`
- `GET /api/admin/users`
- `DELETE /api/admin/files/:id`
