# 🎓 Campus Event Planner

A full-stack web application that enables students to discover and participate in campus events while allowing organizers to manage events, assign tasks, and track performance with real-time updates and role-based access control.

---

## 🚀 Features

### 🔐 Authentication System

* Email/Password login
* University email restriction:

  * `@students.muet.edu.pk`
  * `@organizer.muet.edu.pk`
* Role-based access (Student / Organizer)
* Session persistence

---

### 👨‍🎓 Student Module

#### 🔍 Event Discovery

* View all events
* Event details page
* Capacity display
* Search functionality
* Advanced filters:

  * Category
  * Day (Today / Tomorrow / Week)
  * Time (Morning / Afternoon / Evening)

#### 📝 Event Registration

* Form-based registration
* Fields:

  * Name
  * Email
  * Phone Number
  * Role (Attendee / Volunteer)

#### 📌 Bookmark System

* Bookmark events
* Remove bookmarks
* Dedicated bookmarked page

#### 📋 Task Participation (Volunteers)

* View assigned tasks
* Deadline tracking
* Mark tasks as done
* Status badges

#### 👤 Dashboard

* Registered events
* Bookmarked events
* Task preview
* Progress overview

---

### 👨‍💼 Organizer Module

#### 🎯 Event Management

* Create, edit, delete events
* Multi-day support:

  * startDate
  * endDate

#### 📋 Task Management

* Create tasks
* Assign to volunteers
* Delete tasks
* Track task status

#### 👥 Participant Management

* Organizer view:

  * Full participant details
* Student view:

  * Count + limited visibility

#### 📊 Progress Tracker

* Task completion:

  * X / Y
* Visual progress bar

---

### 🛠️ Advanced Task System (Core)

* Deadline (date + time)
* Live countdown
* “Due Soon” warning (≤ 1 hour)
* Auto overdue detection
* Completion tracking:

  * completedAt
* Analysis:

  * On-Time
  * Late
  * Late duration

#### 📊 Task Priority Sorting

1. Overdue
2. Due Soon
3. Pending
4. Done

---

### ⭐ Feedback System

* Rating (stars)
* Comments
* One feedback per user per event
* Only after participation

---

### 🚨 Reporting System

* Users can report issues
* Private submissions
* Visible only to organizers

---

### 🔐 Role-Based Access Control

* Students:

  * Cannot manage events
* Organizers:

  * Cannot register or give feedback
* Data privacy enforced

---

### ⚡ Real-Time Features

* Live task updates
* Instant UI sync
* Countdown timers

---

## ☁️ Backend Architecture

### 🔥 Firebase Services

* Firebase Authentication
* Firestore Database
* Firebase Cloud Functions

### 📦 Collections

* users
* events
* registrations
* tasks
* feedback
* reports

### ⚙️ Cloud Functions

* User creation trigger
* Role assignment
* Task deadline scheduler

---

## 🧱 Tech Stack

* Frontend: React + Tailwind CSS
* Backend: Node.js + Express + TypeScript
* Database: Firebase Firestore
* Authentication: Firebase Auth
* Cloud: Firebase Functions

---

## 📱 UI/UX

* Modern SaaS design
* Responsive layout
* Card-based UI
* Gradient branding
* Mobile-friendly

---

## 🚀 Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Run project

```bash
npm run dev
```

### 3. Deploy backend

```bash
firebase deploy --only functions
```

---

## 🧠 Project Summary

Campus Event Planner is a scalable, real-world application that demonstrates advanced backend logic, real-time systems, and role-based architecture using Firebase.

---

## 🌏 Future Improvements

* Notifications system
* Calendar integration
* AI recommendations
* Mobile application

---

## 👨‍💻 Author

Mubashir Ahmed,
Abdullah & Jahanzeb
