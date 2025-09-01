import { initializeApp } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-app.js";
import { 
  getAuth, 
  signInWithPopup, 
  GoogleAuthProvider, 
  onAuthStateChanged, 
  signOut,
  updateProfile // <-- ADDED: For updating user profile
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";
import {
  getFirestore,
  collection,
  addDoc,
  onSnapshot,
  query,
  orderBy,
  deleteDoc,
  doc,
  updateDoc,
  setDoc,
  getDoc,
  Timestamp,
  getDocs
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

// --- Firebase config (placeholder values, replace with your actual Firebase config) ---
const firebaseConfig = {
  apiKey: "YOUR_API_KEY_HERE",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};


const app = initializeApp(firebaseConfig);
const auth = getAuth();
const db = getFirestore();
const provider = new GoogleAuthProvider();

let currentUser = null;
let showFavoritesOnly = false;

// --- DOM Elements ---
const loginBtn = document.getElementById("loginBtn");
const logoutBtn = document.getElementById("logoutBtn");
const noteFormSection = document.getElementById("noteFormSection");
const addNoteBtn = document.getElementById("addNoteBtn");
const noteInput = document.getElementById("noteInput");
const notesList = document.getElementById("notesList");
const searchInput = document.getElementById("search");
const favToggleBtn = document.getElementById("favToggleBtn");

// --- Helper to format date as '8 August 2025, 00:46:35' ---
function formatCustomDate(date) {
  const day = date.getDate();
  const monthNames = [
    "January", "February", "March",
    "April", "May", "June", "July",
    "August", "September", "October",
    "November", "December"
  ];
  const month = monthNames[date.getMonth()];
  const year = date.getFullYear();

  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');

  return `${day} ${month} ${year}, ${hours}:${minutes}:${seconds}`;
}

// --- Authentication Handlers ---
loginBtn.onclick = () => signInWithPopup(auth, provider);
logoutBtn.onclick = () => signOut(auth);

// --- Favorite toggle handler ---
favToggleBtn.onclick = () => {
  showFavoritesOnly = !showFavoritesOnly;
  favToggleBtn.classList.toggle("active", showFavoritesOnly);
  favToggleBtn.textContent = showFavoritesOnly ? "★" : "☆";
  renderAllNotes();
};

// --- Monitor auth state changes ---
onAuthStateChanged(auth, async (user) => { // <-- CHANGED: Added 'async'
  currentUser = user;

  // --- NEW: This block ensures a display name is set after login ---
  if (user && !user.displayName) {
    const defaultName = user.email.split('@')[0] || "Anonymous";
    try {
      await updateProfile(user, { displayName: defaultName });
      console.log("User profile updated with a default name.");
    } catch (error) {
      console.error("Failed to update user profile:", error);
    }
  }
  // -----------------------------------------------------------------

  loginBtn.style.display = user ? "none" : "inline";
  logoutBtn.style.display = user ? "inline" : "none";
  noteFormSection.style.display = user ? "block" : "none";
  favToggleBtn.style.display = user ? "block" : "none";
  renderAllNotes();
});

// --- Add new note with Firestore Timestamp ---
addNoteBtn.onclick = async () => {
  const text = noteInput.value.trim();
  if (!text || !currentUser) return;

  await addDoc(collection(db, "notes"), {
    text,
    author: currentUser.displayName, // <-- This is now guaranteed to have a value
    uid: currentUser.uid,
    timestamp: Timestamp.now(),
    favorites: [],
  });

  noteInput.value = "";
};

// --- Helper to normalize timestamp (for legacy numeric timestamps) ---
async function normalizeTimestamp(note) {
  if (note.timestamp) {
    if (typeof note.timestamp === "number") {
      const ts = Timestamp.fromMillis(note.timestamp);
      const noteRef = doc(db, "notes", note.id);
      await updateDoc(noteRef, { timestamp: ts });
      note.timestamp = ts;
    }
  } else {
    note.timestamp = Timestamp.now();
  }
}

// --- Render notes list ---
const renderAllNotes = () => {
  const notesQuery = query(collection(db, "notes"), orderBy("timestamp", "desc"));

  // Unsubscribe previous listener if exists
  if (renderAllNotes.unsubscribe) {
    renderAllNotes.unsubscribe();
  }

  renderAllNotes.unsubscribe = onSnapshot(notesQuery, async (snapshot) => {
    // Get raw notes
    const rawNotes = snapshot.docs.map(docSnap => ({ id: docSnap.id, ...docSnap.data() }));

    // Normalize legacy timestamps
    for (const note of rawNotes) {
      if (typeof note.timestamp === "number") {
        await normalizeTimestamp(note);
      }
    }

    // Refresh notes after normalization
    const refreshedSnapshot = await getDocs(query(collection(db, "notes"), orderBy("timestamp", "desc")));
    const notes = refreshedSnapshot.docs.map(docSnap => ({ id: docSnap.id, ...docSnap.data() }));

    const queryVal = searchInput.value.toLowerCase();

    notesList.innerHTML = "";

    // Filter notes by search and favorite toggle
    const filteredNotes = notes.filter(note => {
      const textMatch = note.text.toLowerCase().includes(queryVal);
      const authorMatch = note.author.toLowerCase().includes(queryVal);
      const isFav = currentUser && note.favorites && note.favorites.includes(currentUser.uid);
      return (showFavoritesOnly && isFav) || (!showFavoritesOnly && (textMatch || authorMatch));
    });

    filteredNotes.forEach(note => {
      const noteDiv = document.createElement("div");
      noteDiv.className = "note";

      const content = document.createElement("p");
      content.textContent = note.text;

      // Format timestamp with custom format
      let formattedDate = "(no date)";
      if (note.timestamp && typeof note.timestamp.toDate === "function") {
        formattedDate = formatCustomDate(note.timestamp.toDate());
      } else if (note.timestamp) {
        formattedDate = formatCustomDate(new Date(note.timestamp));
      }

      const author = document.createElement("span");
      author.className = "author";
      author.textContent = `— anonymous • ${formattedDate}`; // <-- CHANGED: Always shows anonymous

      const buttons = document.createElement("div");
      buttons.className = "buttons";

      // Favorite toggle button for logged-in users
      if (currentUser) {
        const favBtn = document.createElement("button");
        const isFav = note.favorites && note.favorites.includes(currentUser.uid);
        favBtn.textContent = isFav ? "★" : "☆";
        favBtn.title = isFav ? "Remove from favorites" : "Add to favorites";
        favBtn.onclick = async () => {
          const newFavorites = isFav
            ? note.favorites.filter(uid => uid !== currentUser.uid)
            : [...(note.favorites || []), currentUser.uid];
          await updateDoc(doc(db, "notes", note.id), { favorites: newFavorites });
        };
        buttons.appendChild(favBtn);
      }

      // Edit and delete buttons only for the note's author
      if (currentUser && currentUser.uid === note.uid) {
        // Edit button
        const editBtn = document.createElement("button");
        editBtn.textContent = "✏️";
        editBtn.title = "Edit note";
        editBtn.onclick = () => {
          const textarea = document.createElement("textarea");
          textarea.className = "edit-area";
          textarea.value = note.text;

          const saveBtn = document.createElement("button");
          saveBtn.textContent = "Save";
          saveBtn.onclick = async () => {
            const newText = textarea.value.trim();
            if (newText) {
              await updateDoc(doc(db, "notes", note.id), { text: newText });
            }
            renderAllNotes();
          };

          noteDiv.innerHTML = "";
          noteDiv.appendChild(textarea);
          noteDiv.appendChild(saveBtn);
        };
        buttons.appendChild(editBtn);

        // DELETE button: move note to "deleted" collection instead of hard delete
        const delBtn = document.createElement("button");
        delBtn.textContent = "🗑️";
        delBtn.title = "Delete note";
        delBtn.onclick = async () => {
          if (confirm("Are you sure you want to delete this note?")) {
            try {
              const noteRef = doc(db, "notes", note.id);
              const noteSnap = await getDoc(noteRef);

              if (noteSnap.exists()) {
                const noteData = noteSnap.data();

                // Copy note data to the "deleted" collection with the same document ID
                const deletedRef = doc(db, "deleted", note.id);
                await setDoc(deletedRef, noteData);

                // Delete the note from the "notes" collection
                await deleteDoc(noteRef);

                renderAllNotes(); // refresh the notes
              }
            } catch (error) {
              console.error("Error moving note to deleted collection:", error);
              alert("Failed to delete the note. Please try again.");
            }
          }
        };
        buttons.appendChild(delBtn);
      }

      // Append all to noteDiv
      noteDiv.appendChild(content);
      noteDiv.appendChild(author);
      noteDiv.appendChild(buttons);

      // Add noteDiv to notesList container
      notesList.appendChild(noteDiv);
    });
  });
};

// --- Re-render notes when search input changes ---
searchInput.addEventListener("input", renderAllNotes);