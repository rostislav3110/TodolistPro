import firebase from "firebase/compat/app";
import "firebase/compat/auth"; // Import Firebase Authentication
import "firebase/compat/firestore"; // Import Firestore

const firebaseConfig = {
  apiKey: "AIzaSyB2sdqG8whHy5DRSEEcc2fbnqGcY8xDrsw",
  authDomain: "todolistpro-d4107.firebaseapp.com",
  projectId: "todolistpro-d4107",
  storageBucket: "todolistpro-d4107.appspot.com",
  messagingSenderId: "722031782427",
  appId: "1:722031782427:web:6e4a1791481e98ca66e6be",
};

class Fire {
  constructor(callback) {
    this.init(callback);
  }

  init(callback) {
    if (!firebase.apps.length) {
      firebase.initializeApp(firebaseConfig);
    }

    // Ensure firebase.auth() is available after importing the auth module
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        callback(null, user);
      } else {
        firebase
          .auth()
          .signInAnonymously()
          .catch((error) => {
            callback(error);
          });
      }
    });
  }

  getLists(callback) {
    let ref = this.ref.orderBy("name");

    this.unsubscribe = ref.onSnapshot(snapshot => {
      lists = []

      snapshot.forEach(doc => {
        lists.push({id: doc.id, ...doc.data()})
      })

      callback(lists)
    })
  }

  addList(list) {
    let ref = this.ref;

    ref.add(list);
  }

  updateList(list) {
    let ref = this.ref;

    ref.doc(list.id).update(list);
  }

  get userId() {
    return firebase.auth().currentUser.uid;
  }

  get ref() {
    return firebase
      .firestore()
      .collection("users")
      .doc(this.userId)
      .collection("lists");
  }

  detach() {
    this.unsubscribe();
  }

}

export default Fire;
