# 📝 My Inner Voice

A simple **note-taking web app** built with **Firebase Authentication** and **Cloud Firestore**.
Users can log in with Google, create notes, edit, favorite, and delete them (moved to a "deleted" collection instead of hard deletion).

---

## 🚀 Features

* Google Authentication (Firebase Auth)
* Add, edit, and delete notes
* Favorite/unfavorite notes
* Search by note content or author
* Filter to show only favorite notes
* Timestamps formatted as `8 August 2025, 00:46:35`
* Deleted notes are stored in a separate `deleted` collection

---

## 🛠️ Tech Stack

* **Frontend**: Vanilla JavaScript, HTML, CSS
* **Backend**: Firebase Authentication & Firestore
* **Hosting**: Any static hosting service (Firebase Hosting, Vercel, Netlify, etc.)

---

## ⚡ Setup Instructions

### 1. Clone the repository

```bash
git clone https://github.com/YOUR_USERNAME/my-inner-voice.git
cd my-inner-voice
```

### 2. Configure Firebase

Create a Firebase project at [Firebase Console](https://console.firebase.google.com/) and enable:

* **Authentication** → Google Sign-In
* **Firestore Database**

Then copy your project’s config and replace the placeholders in `main.js`:

```javascript
const firebaseConfig = {
  apiKey: "YOUR_API_KEY_HERE",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};
```

⚠️ **Important:** Do not commit your real keys to public repos. Keep them in `.env` if using a bundler (Vite/Next.js/etc.), or use placeholders like above.

---

### 3. Run locally

Open `index.html` directly in your browser (or use a local server).

If using VS Code:

```bash
npx serve
```

---

## 🔐 Security Notes

* The Firebase API key is not a true secret, but you must set proper **Firestore rules** to protect your data.
* Example rule (only authenticated users can read/write their own notes):

```js
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /notes/{noteId} {
      allow read, write: if request.auth != null;
    }
    match /deleted/{noteId} {
      allow read, write: if request.auth != null;
    }
  }
}
```

---

## 📌 Roadmap

* [ ] Add dark mode
* [ ] Add tags/categories for notes
* [ ] Allow restoring notes from "deleted" collection
* [ ] Deploy live demo

---

## 📄 License

This project is licensed under the **MIT License**.
