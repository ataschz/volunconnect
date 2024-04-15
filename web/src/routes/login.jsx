import { getAuth } from "firebase/auth";
import { useCreateUserWithEmailAndPassword } from "react-firebase-hooks/auth";
import { firebaseApp } from "../firebase";

const auth = getAuth(firebaseApp);

export default function Login() {
  const [createUserWithEmailAndPassword, user, loading, error] =
    useCreateUserWithEmailAndPassword(auth);

  return <div>Login</div>;
}
