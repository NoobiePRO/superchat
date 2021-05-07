import firebase from 'firebase';
import React,{useState,useRef} from 'react';
import './App.css';
import 'firebase/firestore'
import 'firebase/auth'
import {useAuthState} from 'react-firebase-hooks/auth'
import {useCollectionData} from 'react-firebase-hooks/firestore'

firebase.initializeApp({
  apiKey: "AIzaSyC8JZTB8WUqbuMD2KkMjKuX4nZrCIWxzQo",
  authDomain: "superchat-e249c.firebaseapp.com",
  projectId: "superchat-e249c",
  storageBucket: "superchat-e249c.appspot.com",
  messagingSenderId: "148104750105",
  appId: "1:148104750105:web:9f64a80e5619850f687688"
})


const auth = firebase.auth();
const firestore = firebase.firestore();

function App() {

  const [user] = useAuthState(auth); 
  return (
    <div className="App">
      

      <header className="App-header">
        <h1>⚛️🔥💬</h1>
        <SignOut />
      </header>
      <section>
        {user? <Chatroom />: <SignIn />}
      </section>
    </div>
  );
}

function SignIn(){
  const SignInWithGoogle=()=>{
    const provider = new firebase.auth.GoogleAuthProvider();
    auth.signInWithPopup(provider);
  }
  return(
    <>
      <button className="sign-in" onClick={SignInWithGoogle}>Sign in with Google</button>
      {/* <p>Do not violate the community guidelines or you will be banned for life!</p> */}
    </>
  )
}

function SignOut(){
  return auth.currentUser && (
    <button onClick={()=>auth.signOut()}>Sign Out</button>
  )
}

function Chatroom(){
  const messagesRef = firestore.collection('messages');
  const query = messagesRef.orderBy('createdAt').limit(25);

  const dummy = useRef()

  const [formValue, setFormValue] = useState('');
  const [messages] = useCollectionData(query, { idField: 'id' });

  const sendMessage = async(e) => {
    e.preventDefault();
    const{uid,photoURL}=auth.currentUser;
    await messagesRef.add({
      text:formValue,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      uid,
      photoURL
    });

    setFormValue('');

    dummy.current.scrollIntoView({ behavior: 'smooth' });
  }


  return(
    <>
    <main>
      {messages && messages.map(msg => <ChatMessage key={msg.id} message={msg}/>)}
      <div ref={dummy}></div>
    </main>

    <form onSubmit={sendMessage}>
      <input value={formValue} onChange={(e)=>setFormValue(e.target.value)} placeholder="Write text here.." />
      <button type="submit" disabled={!formValue}>🕊️</button>
    </form>
    </>
  )
}

function ChatMessage(props){
  const {text,uid,photoURL} = props.message;
  const messageClass = uid === auth.currentUser.uid ? 'sent' : 'recieved';
  return (
    <div className={`message ${messageClass}`}>
         <img src={photoURL} />
      <p>{text}</p>
    </div>

  )
}

export default App;
