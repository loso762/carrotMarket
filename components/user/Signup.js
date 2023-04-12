import {useState} from "react";
import {auth, firestore} from "../firebase";
import classes from "./Signup.module.css";
import {useRouter} from "next/router";
import FooterMenu from "@/components/layout/FooterMenu";

function Signup() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [nickname, setNickname] = useState("");
  const [error, setError] = useState("");

  const temp = 36.5;

  const handleSignup = (e) => {
    e.preventDefault();

    // 중복여부 확인해 회원가입하는 코드
    firestore
      .collection("users")
      .where("email", "==", email)
      .get()
      .then((querySnapshot) => {
        if (!querySnapshot.empty) {
          setError("이미 존재하는 메일입니다.");
        } else {
          firestore
            .collection("users")
            .where("nickname", "==", nickname)
            .get()
            .then((querySnapshot) => {
              if (!querySnapshot.empty) {
                setError("이미 존재하는 닉네임입니다.");
              } else {
                auth
                  .createUserWithEmailAndPassword(email, password)
                  .then((userCredential) => {
                    const user = userCredential.user;
                    firestore.collection("users").doc(user.uid).set({
                      email,
                      nickname,
                      temp,
                      password,
                    });

                    router.push("/");
                  })
                  .catch((error) => {
                    const errorMessage = error.message;
                    setError(errorMessage);
                  });
              }
            });
        }
      });
  };

  return (
    <>
      <div className={classes.container}>
        <h1 className={classes.title}>회원가입</h1>
        <form className={classes.form} onSubmit={handleSignup}>
          <input
            className={classes.input}
            type="email"
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            required
          />
          <input
            className={classes.input}
            type="password"
            onChange={(e) => setPassword(e.target.value)}
            placeholder="비밀번호"
            required
          />
          <input
            className={classes.input}
            type="text"
            onChange={(e) => setNickname(e.target.value)}
            placeholder="닉네임"
            required
          />
          {error && <p className={classes.error}>{error}</p>}
          <button className={classes.button} type="submit">
            가입하기
          </button>
        </form>
      </div>

      <FooterMenu />
    </>
  );
}

export default Signup;
