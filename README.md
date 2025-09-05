# Echos of Silence

**A safe and anonymous platform to write down your inner thoughts, feelings, and secrets — the ones you can’t share with others.
Here you can express anything freely, without revealing your name or identity.**

🔗 **Live Project:** [https://my-inner-voices.web.app/](https://echosofsilence.web.app/)

-----

## 📸 Screenshots

### 📝 Home / Notes View

<img width="968" height="558" alt="image" src="https://github.com/user-attachments/assets/86ea66a8-58ec-4f8b-8bd8-13cce7541f41" />




-----

## 🚀 Features

  * 🔒 **Log in required** to write your inner thoughts safely and anonymously
  * 🖊️ Write your thoughts, knowing your **name is stored securely in the database but never revealed in the UI**
  * ☁️ Powered by Firebase for hosting & Firestore database
  * 📂 Organize notes and keep track of deleted ones
  * 📱 Simple, clean, distraction-free design

-----

## 🛠️ Tech Stack

  * **Frontend:** HTML, CSS, JavaScript
  * **Backend & Hosting:** Firebase Hosting
  * **Database:** Firebase Firestore

-----

### Firebase config (placeholder values)

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

-----

## 🔧 Firebase Hosting Setup

### 1\. Install Firebase CLI

```bash
npm install -g firebase-tools
firebase --version
```

### 2\. Log in

```bash
firebase login
```

### 3\. Initialize project

```bash
firebase init
```

  * Choose: **Hosting**
  * Select project: `my-inner-voices`
  * Public directory: `public`
  * Configure as single-page app: **Yes**

### 4\. Move files into `public/`

```
My Inner Voices/
├── firebase.json
├── public/
    ├── index.html
    ├── style.css
    ├── main.js
```

### 5\. Deploy

```bash
firebase deploy
```

Your app will go live at:

```
https://my-inner-voices.web.app
```

-----

## 🔐 Firestore Security Rules

To make sure notes are protected and only logged-in users can access them:

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

-----

## 💡 Future Improvements

  * 🌙 Dark mode support
  * 📱 PWA support for offline access
  * 🔔 Reminders & notifications

-----

Do you want to add a section about the new login flow or a contributing guide?
