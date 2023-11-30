

const firebase = require('firebase');

//Firebase SDK Configs
const firebaseConfig = {
    apiKey: "AIzaSyCr1H9w2sKMI5VIAV4VCVYPgzVJaqHvrco",
    authDomain: "authapp-27fc7.firebaseapp.com",
    projectId: "authapp-27fc7",
    storageBucket: "authapp-27fc7.appspot.com",
    messagingSenderId: "915038199047",
    appId: "1:915038199047:web:1fb2e90976aedec41039a2",
    measurementId: "G-JN4SEWDPPX"
};
firebase.initializeApp(firebaseConfig);

module.exports = firebase;
