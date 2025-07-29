# MERN Chat App

A real-time private messaging chat application built using the MERN stack (MongoDB, Express, React, Node.js) with WebSocket support.

## 📌 Features

- **Real-Time Messaging:** Users can chat back and forth instantly using WebSockets.
- **Message History:** All messages are saved in the database. When a user logs back in, their entire chat history is visible.
- **Offline Message Support:** Messages sent while a recipient is offline are saved and retrieved when they come online.
- **User Status Tracking:** Online and offline users are clearly shown.
- **Private Messaging:** Chats are private and uniquely stored per sender and recipient, so users only see messages relevant to that specific conversation.

## Tech Stack

### 🖥️ Frontend
- **React**
- **TailwindCSS** – For modern and responsive UI design
- **Formik** & **Yup** – For handling and validating login/register forms
- **React Redux** – For managing global state
- **Redux Persist** – For storing user data locally, preventing frequent re-logins
- **React Router** – For routing and navigation between pages

### ⚙️ Backend
- **Node.js**
- **Express.js**
- **WebSockets** – For real-time bi-directional communication
- **MongoDB** – To store users and messages
- **JSON Web Token (JWT)** – For secure authentication
- **bcrypt** – For hashing passwords

## 🔒 Security
- Passwords are securely hashed using bcrypt before being stored.
- JSON Web Tokens are used to authenticate and protect user sessions.

## 🧠 Logic Overview

- Messages are stored with both sender and recipient IDs to ensure chat privacy and conversation history.
- When users reconnect or reload the app, their stored messages are retrieved from MongoDB.
- Offline messages are handled through backend persistence therefore no messages are lost during disconnection.

---

Feel free to contribute, fork, or customize this project to suit your own needs.
