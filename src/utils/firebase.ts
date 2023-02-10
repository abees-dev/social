import { initializeApp } from 'firebase/app';
import { getMessaging, getToken, onMessage, isSupported } from 'firebase/messaging';

const firebaseConfig = {
  apiKey: 'AIzaSyBHGNTaD1_ZcMEP9mNS87nRx0GH_VoFj-0',
  authDomain: 'notification-f19f8.firebaseapp.com',
  projectId: 'notification-f19f8',
  storageBucket: 'notification-f19f8.appspot.com',
  messagingSenderId: '533004631107',
  appId: '1:533004631107:web:573a8181e0322cf06c68f6',
  measurementId: 'G-GDZD7BYTXG',
};

const firebaseApp = initializeApp(firebaseConfig);

export const getMessagingFireBase = async () => {
  if (await isSupported()) {
    return getMessaging(firebaseApp);
  }
};

export const getPushToken = async () => {
  const messaging = await getMessagingFireBase();
  if (!messaging) {
    return '';
  }

  return await getToken(messaging, {
    vapidKey: 'BMrKj151LenJC2zW21tl3mWAT7tBWpuy5M_cOfYCI93I07xJOAwZZOFXuT-UVR9jJGRhvm-e7RgE1bM3eNrbS_U',
  });
};

export const onMessageListener = () =>
  new Promise((resolve) => {
    // onMessage(messaging, (payload: any) => {
    //   resolve(payload);
    // });
  });
