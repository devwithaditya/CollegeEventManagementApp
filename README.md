# 🎉 College Event Management App

A full-stack web application designed to simplify the organization and management of college events. The platform enables students to browse and register for events, while administrators can efficiently manage events, registrations, and participants through a dedicated dashboard.

## ✨ Features

### 👨‍🎓 Student

* User authentication (Sign Up / Login)
* Google OAuth login
* Browse upcoming events
* View detailed event information
* Register for events
* View registered events
* Responsive and user-friendly interface

### 👨‍💼 Admin

* Secure admin dashboard
* Create new events
* Edit existing events
* Delete events
* View participant registrations
* Manage event details

## 🛠️ Tech Stack

### Frontend

* React.js
* Tailwind CSS
* React Router
* Axios

### Backend

* Node.js
* Express.js
* MongoDB
* Mongoose
* JWT Authentication
* Google OAuth


## ⚙️ Installation

### 1. Clone the repository

```bash
git clone https://github.com/devwithaditya/CollegeEventManagementApp.git
```

### 2. Navigate to the project

```bash
cd CollegeEventManagementApp
```

### 3. Install dependencies

#### Frontend

```bash
cd frontend
npm install
```

#### Backend

```bash
cd ../backend
npm install
```

### 4. Configure Environment Variables

Create a `.env` file inside the `backend` directory.

Example:

```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
```

### 5. Run the project

#### Backend

```bash
npm run dev
```

#### Frontend

```bash
cd ../frontend
npm run dev
```

## 🚀 Future Enhancements

* Email notifications
* QR Code event check-in
* Event certificates
* Attendance tracking
* Event analytics dashboard
* Payment gateway integration
* Role-based permissions
* Event reminders

## 🤝 Contributing

Contributions are welcome! Feel free to fork the repository, create a new branch, and submit a pull request.

## 📄 License

This project is developed for educational purposes.

## 👨‍💻 Author

**Aditya Raj**

* GitHub: https://github.com/devwithaditya
