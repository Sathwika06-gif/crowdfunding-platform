# Crowdfunding Platform

A full-stack web application that enables users to create fundraising campaigns, browse projects, and make secure online donations. The platform supports role-based access for Donors, Campaign Creators, and Administrators, along with category-based recommendations, multilingual support, and analytics.

## Features

### Authentication & Authorization
- User registration and login
- JWT-based authentication
- Role-based access control:
  - Donor – Browse campaigns and donate
  - Creator – Create and manage campaigns
  - Admin – Manage users, campaigns, and view analytics

### Donation & Payments
- Secure donations using Razorpay (Test Mode)
- Donation history tracking
- Payment status storage in MongoDB

### Campaign Management
- Create, edit, and delete campaigns
- Upload campaign images using Cloudinary
- Browse campaigns by category:
  - Medical
  - Education
  - Technology
  - Community

###  Personalized Recommendations
- Recommends campaigns based on selected categories

### Analytics Dashboard
- Total users
- Total campaigns
- Total donations
- Payment insights

###  Responsive Design
- Mobile-friendly interface built with React

##  Tech Stack

### Frontend
- React.js
- React Router
- Axios / Fetch API
- CSS

### Backend
- Node.js
- Express.js
- JWT (JSON Web Tokens)

### Database
- MongoDB

### Third-Party Services
- Razorpay (Payments)
- Cloudinary (Image Uploads)

## Installation and Setup
### 1. Clone the Repository
        git clone https://github.com/Sathwika06-gif/crowdfunding-platform.gitcd crowdfunding-platform
### 2. Backend Setup
        cd backendnpm install
### 3. Create Environment Variables
        Create a .env file inside the backend folder and add the following:
     PORT=5000MONGO_URI=your_mongodb_connection_stringJWT_SECRET=your_jwt_secretRAZORPAY_KEY_ID=your_razorpay_key_idRAZORPAY_KEY_SECRET=your_razorpay_key_secretCLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_nameCLOUDINARY_API_KEY=your_cloudinary_api_keyCLOUDINARY_API_SECRET=your_cloudinary_api_secret
### 4. Start the Backend Server
        npm start
    The backend server will run at:
         http://localhost:5000
### 5. Frontend Setup
     Open a new terminal window and run:
           cd crowdfunding-platform/frontendnpm installnpm start
     The frontend application will run at:
            http://localhost:3000
### 6. Test Payment Details (Razorpay Test Mode)
### 7. Default User Roles:
      Donor,Creator,Admin
      After successful login, users are automatically redirected to their role-specific dashboards.

### 8. MongoDB Collections Used
       users
       campaigns
       donations
