import { initializeApp } from 'firebase/app'
import {
  getFirestore, collection, onSnapshot,
  addDoc , deleteDoc , doc,
  query, where, getDoc, updateDoc,
  orderBy, serverTimestamp, Timestamp
} from 'firebase/firestore'

import {
    getAuth,
    createUserWithEmailAndPassword,
    signOut,
    signInWithEmailAndPassword,
    onAuthStateChanged
} from 'firebase/auth'

const firebaseConfig = {
  apiKey: "AIzaSyA0-4z0Hg8eyg6KjrCiPDp4Y7fIkPnAYbg",
  authDomain: "fir-playground-3d8e3.firebaseapp.com",
  databaseURL: "https://fir-playground-3d8e3.firebaseio.com",
  projectId: "fir-playground-3d8e3",
  storageBucket: "fir-playground-3d8e3.appspot.com",
  messagingSenderId: "44165205168",
  appId: "1:44165205168:web:bca44b4e809d6ddfd9ff75",
  measurementId: "G-YNCTHSPKS3"
};

// init firebase
initializeApp(firebaseConfig)

// init services
const db = getFirestore()
const auth = getAuth()

// collection ref
const colRef = collection(db, 'customers')

//queries
//TODO add query to pull the customer info for specific customer

const q = query(colRef, orderBy('createdAt','desc'))
//const querySnapshot = getDoc(q)
//console.log("query",querySnapshot)

  //relatime collection data 

  const unsubCollection = onSnapshot(q, (snapshot) => {
      let customers = []
    snapshot.docs.forEach(doc => {
      customers.push({ ...doc.data(), id: doc.id })
    })
    console.log(customers)

  })
 
  //adding customer information 
  //TODO add unique customer Id and display on the form

  const addCustomer = document.querySelector('.add')
  //console.log(addCustomer.customerName.value)
   
  addCustomer.addEventListener('submit', (e) => {
      e.preventDefault()

      addDoc(colRef, {
          name: addCustomer.customerName.value,
          address : {addressLine1: addCustomer.addressLine1.value,
          addressLine2 : addCustomer.addressLine2.value,
          city : addCustomer.city.value,
          state : addCustomer.state.value,
          pinCode : addCustomer.pinCode.value },
          createdAt : serverTimestamp()
        })
        .then(() => {
           alert("Customer Added Successfully!")
        })
  })

  //deleting customer
//TODO search customer and then delete single / multiple records

  const deleteCustomer = document.querySelector('.delete')
  deleteCustomer.addEventListener('submit', (e) => {
      e.preventDefault()

    const docRef = doc (db, 'customers', deleteCustomer.id.value)
    console.log(docRef)
    deleteDoc(docRef)
    .then(() => {
        alert("Customer deleted Successfully!")
    })
  })

  //get single Doc
   //TODO get value to find the doc from form input value

  const docRef = doc(db, 'customers', 'uacKXuDaGeCQVtVd5qKw')


  const unsubDoc = onSnapshot(docRef, (doc) => {
      console.log(doc.data(), doc.id)
  })

  //update a customer information 
   //TODO update customer details from form input 

  const updateCustomer = document.querySelector('.update')
  updateCustomer.addEventListener('submit', (e) => {
      e.preventDefault()

      const docRef = doc(db, 'customers', updateCustomer.id.value)

      updateDoc(docRef, {
          name : 'Sagar Mehendale updated'
      })
      .then(() => {
           alert("Customer details updated successfully!")
           
        })

  })

  //signing up users

  const signupForm = document.querySelector('.signup')
  signupForm.addEventListener('submit', (e) => {
      e.preventDefault()

    const email = signupForm.email.value
    const password = signupForm.password.value
    createUserWithEmailAndPassword(auth, email, password)
    .then((cred) => {
      console.log('user created:',cred.user)
  })
  .catch((err) => {
    alert(err.message)
  })
  })

  //login and logout 
  //TODO Display Error Message on the Web Page
  const logoutButton = document.querySelector('.logout')
  logoutButton.addEventListener('click', () => {
      signOut(auth)
      .then(() => {
          alert("User is logged out successfully!")

      })
      .catch((err) => {
          console.log(err.message)
      })

  })

//TODO Display Error Message on the Web Page
  const loginForm = document.querySelector('.login')
  loginForm.addEventListener('submit', (e) => {
      e.preventDefault()

      const email = loginForm.email.value
      const password = loginForm.password.value

      signInWithEmailAndPassword(auth, email, password)
      .then(() => {
          alert("User logged in successfully!")

      })
      .catch((err) => {
          console.log(err.message)
      })

  })

  //Subscribing to Auth change
  const unsubAuth =onAuthStateChanged(auth, (user) => {
      console.log('User status changed', user)
  })

  //Unsubscribing from changes (auth and db)
  const unsubButton = document.querySelector('.unsubscribe')
  unsubButton.addEventListener('click', () => {
      console.log("unsubscribing from auth and db")
      unsubCollection()
      unsubDoc
      unsubAuth()
  })