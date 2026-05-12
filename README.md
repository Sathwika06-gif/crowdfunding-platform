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

