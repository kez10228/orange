import Sidebar from "./Sidebar";
import ContentContainer from "./content-container";  
import { useAuthState } from 'react-firebase-hooks/auth';

const [user] = useAuthState(auth);

const App = () => {
  return (
    <div>
      {user ? <><Sidebar /><ContentContainer /></> : <SignIn />}
      
    </div>
  );
};

const SignIn = () => {
  const [username, setUsername] = React.useState('');
  const [password, setPassword] = React.useState('');
  async function signIn(e) {
    e.preventDefault();
    const loginauth = getAuth();
    signInWithEmailAndPassword(loginauth, username + "@orange.is-great.net", password)
      .then((userCredential) => {
        // Signed in
        const user = userCredential.user;
        console.log(user);
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(errorCode, errorMessage);
      });
  }

  return (
    <div className='sign-in-container'>
        <h1>Log in</h1>
        <form onSubmit={signIn}>
            <input type="text" placeholder='Username' value={username} onChange={(e) => setUsername(e.target.value)} />
            <input type="password" placeholder='Password' value={password} onChange={(e) => setPassword(e.target.value)} />
            <button type='submit'>Log in</button>
        </form>
    </div>
  )
}

export default App;