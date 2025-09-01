# ✨ My Inner Voices

**A safe and anonymous platform to write down your inner thoughts, feelings, and secrets — the ones you can’t share with others.
Here you can express anything freely, without revealing your name or identity.**

🔗 **Live Project:** [https://my-inner-voices.web.app/](https://my-inner-voices.web.app/)

---

## 📸 Screenshots

### 📝 Home / Notes View
<img width="1916" height="753" alt="image" src="https://github.com/user-attachments/assets/62edbd3c-024e-429e-9c37-6ee05daa5fee" />






---

## 🚀 Features

* 🖊️ Write your inner thoughts safely and anonymously
* 🔒 No identity revealed, just pure self-expression
* 📂 Organize notes and keep track of deleted ones
* ☁️ Powered by Firebase for hosting & Firestore database
* 📱 Simple, clean, distraction-free design

---

## 🛠️ Tech Stack

* **Frontend:** HTML, CSS, JavaScript
* **Backend & Hosting:** Firebase Hosting
* **Database:** Firebase Firestore

---

## 🔧 Firebase Hosting Setup

### 1. Install Firebase CLI

```bash
npm install -g firebase-tools
firebase --version
```

### 2. Log in

```bash
firebase login
```

### 3. Initialize project

```bash
firebase init
```

* Choose: **Hosting**
* Select project: `my-inner-voices`
* Public directory: `public`
* Configure as single-page app: **Yes**

### 4. Move files into `public/`

```
My Inner Voices/
├── firebase.json
├── public/
    ├── index.html
    ├── style.css
    ├── main.js
```

### 5. Deploy

```bash
firebase deploy
```

Your app will go live at:

```
https://my-inner-voices.web.app
```

---

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

---

## 💡 Future Improvements

* 🧑‍🤝‍🧑 Optional login for personal journaling
* 🌙 Dark mode support
* 📱 PWA support for offline access
* 🔔 Reminders & notifications
