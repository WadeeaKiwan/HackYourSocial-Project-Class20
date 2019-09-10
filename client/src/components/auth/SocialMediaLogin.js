import React, { Fragment, useState, useEffect } from 'react';
import firebase from 'firebase';
import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth';
import SubmitLogIn from './SubmitLogIn';
import './SocialMediaLogin.css';

firebase.initializeApp({
  apiKey: 'AIzaSyBzJx-uHixKqIsA8h8Dp91OS4Fasjdi8kk',
  authDomain: 'class20-b4669.firebaseapp.com',
});

const SocialMediaLogin = () => {
  const [isSignedIn, setIsSignedIn] = useState(false);

  const uiConfig = {
    signInFlow: 'popup',
    signInOptions: [
      firebase.auth.GoogleAuthProvider.PROVIDER_ID,
      firebase.auth.FacebookAuthProvider.PROVIDER_ID,
      firebase.auth.GithubAuthProvider.PROVIDER_ID,
    ],
    callbacks: {
      signInSuccessWithAuthResult: () => false,
    },
  };

  useEffect(() => {
    firebase.auth().onAuthStateChanged(user => {
      setIsSignedIn(user);
    });
  }, []);

  return (
    <div className="App">
      {isSignedIn ? (
        <Fragment>
          {firebase.auth().currentUser ? (
            <SubmitLogIn
              name={firebase.auth().currentUser.displayName}
              email={firebase.auth().currentUser.email}
              avatar={firebase.auth().currentUser.photoURL}
            />
          ) : (
            <Fragment></Fragment>
          )}
        </Fragment>
      ) : (
        <StyledFirebaseAuth uiConfig={uiConfig} firebaseAuth={firebase.auth()} />
      )}
    </div>
  );
};

export default SocialMediaLogin;
