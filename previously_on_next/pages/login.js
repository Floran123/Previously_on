import { useState } from "react";
import styles from "../styles/Login.module.css";
import { useRouter } from "next/router";
var md5 = require("md5");

export default function Login() {
  const router = useRouter();
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");

  return (
    <div className={styles.login}>
      <div className={styles.title}>
        <h1>Login</h1>
      </div>
      <form
        className={styles.form}
        onSubmit={async (e) => {
          e.preventDefault();
          fetch("http://localhost:3000/api/login", {
            method: "POST",
            body: JSON.stringify({
              login: login,
              password: md5(password),
            }),
          })
            .then((res) => res.json())
            .then((data) => {
              document.cookie = "token=/^" + data.token + "$/; secure;";
              router.push("/");
            });
        }}
      >
        <label htmlFor="login">Email:</label>
        <input
          type="text"
          name="login"
          id="login"
          value={login}
          onChange={(e) => {
            setLogin(e.target.value);
          }}
        />
        <label htmlFor="password">Password:</label>
        <input
          type="password"
          name="password"
          id="password"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
          }}
        />
        <button>Login</button>
      </form>
    </div>
  );
}
