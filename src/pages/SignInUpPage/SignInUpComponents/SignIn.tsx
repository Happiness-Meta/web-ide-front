import { RefObject, useRef, useState } from "react";
import LoginPageStore from "../../../store/LoginPageStore/LoginPageStore";
import styles from "../signInUpPage.module.css";
import LoginFormDto from "../../../dto/LoginFormDto";
import axios, { AxiosError } from "axios";
import { useNavigate } from "react-router-dom";
import SignInStore from "../../../store/LoginPageStore/SignInStore";
import { useMutation } from "@tanstack/react-query";
import { useCookies } from "react-cookie";

function SignIn() {
  const navigate = useNavigate();
  const [, setCookie] = useCookies(["email", "nickname", "token"]);

  const idInput: RefObject<HTMLInputElement> = useRef(null);
  const pwInput: RefObject<HTMLInputElement> = useRef(null);

  const { isVisible, visibleToggle, inUp, inUpToggle } = LoginPageStore();
  const {
    signInErrorMessage,
    signInErrorMessageStatus,
    signInErrorMessageAni,
    signInErrorMessageAniToggle,
  } = SignInStore();
  const [signInId, setSignInId] = useState("");
  const [signInPw, setSignInPw] = useState("");

  const loginUser = useMutation({
    mutationFn: async () => {
      if (idInput.current!.value === "")
        return signInErrorMessageStatus("아이디를 입력해주세요.");
      if (pwInput.current!.value === "")
        return signInErrorMessageStatus("비밀번호를 입력해주세요.");

      const body: LoginFormDto = {
        email: signInId,
        password: signInPw,
      };

      try {
        signInErrorMessageAniToggle();
        const response = await axios.post(
            import.meta.env.VITE_BASE_URL +"/api/sign/login",
          // "http://localhost:8080/api/sign/login",
          body
        );
        const expiration = new Date(Date.now() + 1000 * 60 * 30);
        setCookie("token", response.data.data.token, {
          path: "/",
          expires: expiration,
        });
        setCookie("email", response.data.data.email, {
          path: "/",
          expires: expiration,
        });
        setCookie("nickname", response.data.data.nickname, {
          path: "/",
          expires: expiration,
        });
        setTimeout(() => {
          alert("로그인 세션이 만료되었습니다.");
        }, 1000 * 60 * 30);
        signInErrorMessageStatus("");
        navigate("/dashboard");
      } catch (error) {
        if (axios.isAxiosError(error)) {
          const axiosError = error as AxiosError;

          if (axiosError.response) {
            console.log(error.response?.data);
            if (error.response?.data.code === 400) {
              return signInErrorMessageStatus(
                "이메일 또는 비밀번호를 잘못 입력하였습니다."
              );
            }
          }
        }
      }
    },
  });

  inUp ? undefined : idInput.current?.setAttribute("autoFocus", "true");

  return (
    <div className={styles.signInSection}>
      <h2 className={styles.signInText}>Sign In</h2>
      <div className={styles.inputSpace}>
        <div className={styles.inputEachSpace}>
          <i className={`${styles.inputIcon} material-symbols-outlined`}>
            person
          </i>
          <input
            {...(!inUp ? { autoFocus: true } : {})}
            ref={idInput}
            name="id"
            type="text"
            className={styles.input}
            placeholder="ID"
            value={signInId}
            onChange={(e) => setSignInId(e.target.value)}
          />
        </div>
        <div className={styles.inputEachSpace}>
          <i className={`${styles.inputIcon} material-symbols-outlined`}>
            lock
          </i>
          <input
            ref={pwInput}
            name="password"
            type={isVisible ? "text" : "password"}
            className={styles.input}
            placeholder="password"
            value={signInPw}
            onChange={(e) => setSignInPw(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") loginUser.mutate();
            }}
          />
          <i
            className={`${styles.visibility} material-symbols-outlined`}
            onClick={visibleToggle}
          >
            {isVisible ? "visibility" : "visibility_off"}
          </i>
          <span
            className={`${
              signInErrorMessageAni
                ? styles.errorMessageAni2
                : styles.errorMessageAni
            } ${styles.signInErrorMessage}`}
          >
            {signInErrorMessage}
          </span>
        </div>

        <button
          className={styles.signInUpBtn}
          onClick={() => {
            loginUser.mutate();
          }}
        >
          Sign In
        </button>
      </div>

      <div className={styles.signInBottom}>
        <div className={styles.bottomText}>Don't have an account?</div>
        <button
          className={styles.goToSignInUpBtn}
          onClick={() => {
            inUpToggle();
            signInErrorMessageStatus("");
            setSignInId("");
            setSignInPw("");
          }}
        >
          Sign Up
        </button>
      </div>
    </div>
  );
}

export default SignIn;
