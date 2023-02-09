/* eslint-disable no-undef */
// Scripts for firebase and firebase messaging
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js');

// Initialize the Firebase app in the service worker by passing the generated config
const firebaseConfig = {
  apiKey: 'AIzaSyBHGNTaD1_ZcMEP9mNS87nRx0GH_VoFj-0',
  authDomain: 'notification-f19f8.firebaseapp.com',
  projectId: 'notification-f19f8',
  storageBucket: 'notification-f19f8.appspot.com',
  messagingSenderId: '533004631107',
  appId: '1:533004631107:web:573a8181e0322cf06c68f6',
  measurementId: 'G-GDZD7BYTXG',
};

// eslint-disable-next-line no-undef
firebase.initializeApp(firebaseConfig);

// Retrieve firebase messaging
// eslint-disable-next-line no-undef
const messaging = firebase.messaging();

messaging.onBackgroundMessage(function (payload) {});
