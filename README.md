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
