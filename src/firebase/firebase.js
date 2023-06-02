import { initializeApp } from 'firebase/app';
import { getMessaging, getToken } from "firebase/messaging";
// import { this.props.user, authorizationCompleted } from '../objects/user_login';
import { socket } from '../websocket/socket';
import { getCookie } from '../cookie_handler';

const firebaseConfig = {
  apiKey: "AIzaSyAjqJrNf8OsEU4JEYsNb6VRAYg5UjwAQyk",
  authDomain: "miscsituet.firebaseapp.com",
  projectId: "miscsituet",
  storageBucket: "miscsituet.appspot.com",
  messagingSenderId: "369130724243",
  appId: "1:369130724243:web:c2f3273ef386b987a86666",
  measurementId: "G-2FLDML5D5K"
};

const firebaseApp = initializeApp(firebaseConfig);
export const messaging = getMessaging(firebaseApp);

export const fetchToken = async (callback) => {
  return getToken(messaging, { vapidKey: process.env.REACT_APP_FIREBASE_FCM_VAPIDKEY }).then((currentToken) => {
    if (currentToken) {
      // console.log('[Firebase FCM] Current token for client:', currentToken);
      // console.log('[FCM] login_token',getCookie('login_token'))
      socket.emit('users/FCMTokenUpdate', { login_token: getCookie('login_token'), fcm_token: currentToken }, (res) => {
        if (res.code != 200) console.log('[FCM] error', res)
      })
      callback(true);
    } else {
      console.log('[Firebase FCM] No registration token available. Request permission to generate one.');
      callback(false);
    }
  }).catch((err) => {
    console.log('[Firebase FCM] An error occurred while retrieving token. ', err);
  });
}