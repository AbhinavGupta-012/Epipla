// Firebase Configuration and Initialization
const firebaseConfig = {
    apiKey: "AIzaSyC9Me9ZjSvuXrJeMjU-_P_wvMHAkYIk-po",
    authDomain: "epipla-bc50c.firebaseapp.com",
    databaseURL: "https://epipla-bc50c-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "epipla-bc50c",
    storageBucket: "epipla-bc50c.firebasestorage.app",
    messagingSenderId: "1081884443035",
    appId: "1:1081884443035:web:845da94b965ec07f03213e"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Export database reference
const db = firebase.database();
window.db = db; // Make db accessible globally