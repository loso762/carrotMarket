import React, { useState, useContext } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { auth, firestore, googleAuthProvider } from "../firebase";
import classes from "./login.module.css";
import Image from "next/image";
import UserContext from "../user-context";

function Login(props) {
  const router = useRouter();
  const { setloginDisplayName, setIsLoggedIn, setloginTemp } =
    useContext(UserContext);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const temp = 36.5;

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const handleLogin = async (event) => {
    event.preventDefault();

    try {
      await auth.signInWithEmailAndPassword(email, password);

      // Get the user's nickname from Firestore
      const user = auth.currentUser;
      const userRef = firestore.collection("users").doc(user.uid);
      const doc = await userRef.get();

      if (doc.exists) {
        const userData = doc.data();
        const { nickname, temp } = userData;
        setIsLoggedIn(true);
        setloginTemp(temp);
        setloginDisplayName(nickname);
      } else {
        setError("사용자 정보를 찾을 수 없습니다.");
      }
    } catch (error) {
      setError("아이디/비밀번호를 다시 입력해주세요");
    }
  };

  const handleGoogleSignup = (e) => {
    e.preventDefault();

    auth
      .signInWithPopup(googleAuthProvider)
      .then((result) => {
        const credential = result.credential;
        const user = result.user;
        const { displayName, email } = user;

        // Check if the user already exists in Firestore
        firestore
          .collection("users")
          .where("email", "==", email)
          .get()
          .then((querySnapshot) => {
            if (!querySnapshot.empty) {
              setError("이미 존재하는 계정입니다.");
            } else {
              // Add the new user to Firestore
              firestore
                .collection("users")
                .doc(user.uid)
                .set({
                  email,
                  displayName,
                  temp,
                })
                .then(() => {
                  // Navigate to the home page after successful signup
                  router.push("/");
                })
                .catch((error) => {
                  const errorMessage = error.message;
                  setError(errorMessage);
                });
            }
          });
      })
      .catch((error) => {
        const errorMessage = error.message;
        setError(errorMessage);
      });
  };

  return (
    <>
      <div className={classes.container}>
        <Image
          src="/images/Marketlogo.png"
          alt="profileImg"
          width={110}
          height={130}
        />
        <form onSubmit={handleLogin} className={classes.form}>
          <div>
            <label htmlFor="email" className={classes.label}>
              {" "}
              이메일 :{" "}
            </label>
            <input
              type="email"
              id="email"
              onChange={handleEmailChange}
              className={classes.input}
              placeholder="이메일"
            />
          </div>
          <div>
            <label htmlFor="password" className={classes.label}>
              비밀번호 :{" "}
            </label>
            <input
              type="password"
              id="password"
              onChange={handlePasswordChange}
              className={classes.input}
              placeholder="비밀번호"
            />
          </div>
          <p className={classes.error}>{error}</p>
          <button type="submit" className={classes.button}>
            로그인
          </button>
        </form>
        <div className={classes.buttonContainer}>
          <button className={classes.button2}>
            <Link href={"/sign"}>이메일 가입</Link>
          </button>
          <button onClick={handleGoogleSignup} className={classes.button2}>
            Google로 가입
          </button>
        </div>
      </div>
    </>
  );
}

export default Login;
