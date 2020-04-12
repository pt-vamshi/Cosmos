import * as firebase from 'firebase';
import shorthash from 'shorthash';
import mainServerApi from '../api/mainServerApi';

export const isUserLoggedIn = () => {
  return new Promise(async (resolve, reject) => {
    try {
      firebase.auth().onAuthStateChanged((user) => {
        if (user) {
          resolve(true);
        } else {
          resolve(false);
        }
      });
    } catch (err) {
      reject(err);
    }
  });
};

export const updateDisplayName = (username) => {
  return new Promise((resolve, reject) => {
    var user = firebase.auth().currentUser;
    user
      .updateProfile({displayName: username})
      .then((resp) => {
        resolve(true);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

export const addUserToDB = (user) => {
  return new Promise((resolve, reject) => {
    const userDB = firebase.database().ref('users/').child(user.uid);
    userDB
      .set(user)
      .then((_resp) => {
        resolve(true);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

export const getUserObject = (uid) => {
  return new Promise((resolve, reject) => {
    const userDB = firebase.database().ref('users/').child(uid);
    userDB
      .once('value')
      .then((user) => {
        resolve(user.val());
      })
      .catch((err) => {
        reject(err);
      });
  });
};

export const updateUserObject = (uid, updates) => {
  return new Promise((resolve, reject) => {
    const userDB = firebase.database().ref('users/').child(uid);
    userDB
      .update(updates)
      .then((_resp) => {
        resolve();
      })
      .catch((_err) => {
        reject();
      });
  });
};

export const uploadImage = (uid, file, image) => {
  return new Promise(async (resolve, reject) => {
    try {
      // eslint-disable-next-line prettier/prettier
      const path = `posts/${uid}-${shorthash.unique(image.uri)}.${image.uri.split('.').pop()}`;
      const storageImage = firebase.storage().ref(path);
      await storageImage.put(file);
      const url = storageImage.getDownloadURL();
      resolve(url);
    } catch (err) {
      reject(err);
    }
  });
};

export const uploadDownloadUrlDB = (downloadURL, caption) => {
  return new Promise(async (resolve, reject) => {
    try {
      await mainServerApi.post('/addNewPost', {
        caption,
        downloadURL,
        pid: shorthash.unique(downloadURL),
      });
      resolve();
    } catch (err) {
      console.log(err);
      reject(err);
    }
  });
};
