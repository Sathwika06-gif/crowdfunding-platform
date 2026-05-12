Crowdfunding Platform

A full-stack web application that enables users to create fundraising campaigns, browse projects, and make secure online donations. The platform supports role-based access for Donors, Campaign Creators, and Administrators, along with category-based recommendations, multilingual support, and analytics.

🚀 Features
👤 Authentication & Authorization
User registration and login
JWT-based authentication
Role-based access control:
Donor – Browse campaigns and donate
Creator – Create and manage campaigns
Admin – Manage users, campaigns, and view analytics
💰 Donation & Payments
Secure donations using Razorpay (Test Mode)
Donation history tracking
Payment status storage in MongoDB
📢 Campaign Management
Create, edit, and delete campaigns
Upload campaign images using Cloudinary
Browse campaigns by category:
Medical
Education
Technology
Community
🎯 Personalized Recommendations
Recommends campaigns based on selected categories
🌐 Multilingual Support
Automatic translation of campaign content
Voice input support for search and descriptions
📊 Analytics Dashboard
Total users
Total campaigns
Total donations
Payment insights
📱 Responsive Design
Mobile-friendly interface built with React
🛠️ Tech Stack
Frontend
React.js
React Router
Axios / Fetch API
CSS
Backend
Node.js
Express.js
JWT (JSON Web Tokens)
Database
MongoDB
Third-Party Services
Razorpay (Payments)
Cloudinary (Image Uploads)
Google Translate API
📁 Project Structure
crowdfunding-platform/
├── backend/
│   ├── server.js
│   ├── models/
│   ├── routes/
│   ├── controllers/
│   └── .env
└── frontend/
    ├── src/
    ├── public/
    └── package.json
⚙️ Installation and Setup
1. Clone the Repository
git clone https://github.com/Sathwika06-gif/crowdfunding-platform.git
cd crowdfunding-platform
2. Backend Setup
cd backend
npm install

Create a .env file inside the backend/ folder:

PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

Start the backend server:

npm start

The backend will run at:

http://localhost:5000
3. Frontend Setup

Open a new terminal:

cd crowdfunding-platform/frontend
npm install
npm start

The frontend will run at:

http://localhost:3000
Default Roles

Users can register and access features according to their assigned role:

Donor
Creator
Admin

After login, users are redirected to their role-specific dashboard.

Sathwika Kota

GitHub: https://github.com/Sathwika0
