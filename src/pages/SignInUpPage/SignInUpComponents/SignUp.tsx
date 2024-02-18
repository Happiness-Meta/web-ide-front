import { RefObject, useRef, useState } from "react";
import LoginPageStore from "../../../store/LoginPageStore/LoginPageStore";
import styles from "../signInUpPage.module.css";
import SignUpStore from "../../../store/LoginPageStore/SignUpStore";
import UserRegisterDto from "../../../dto/UserRegisterDto";
import axios, { AxiosError } from "axios";
import { useMutation } from "@tanstack/react-query";

function SignUp() {
  const idInput: RefObject<HTMLInputElement> = useRef(null);
  const nicknameInput: RefObject<HTMLInputElement> = useRef(null);
  const pwInput: RefObject<HTMLInputElement> = useRef(null);

  const { inUpToggle, isVisible, visibleToggle, toggleWelcomeMessage } =
    LoginPageStore();
  const {
    signUpErrorMessage,
    signUpErrorMessageStatus,
    signUpErrorMessageAni,
    signUpErrorMessageAniToggle,
  } = SignUpStore();

  const [signUpID, setSignUpId] = useState("");
  const [nickname, setNickname] = useState("");
  const [signUpPW, setSignUpPw] = useState("");

  const registerUser = useMutation({
    mutationFn: async () => {
      if (signUpErrorMessage) {
        signUpErrorMessageAniToggle();
      }
      if (idInput.current!.value === "")
        return signUpErrorMessageStatus("아이디를 입력해주세요.");
      if (!signUpID.includes("@") || !signUpID.includes("."))
        return signUpErrorMessageStatus("이메일 형식으로 적어주세요.");
      if (nicknameInput.current!.value === "")
        return signUpErrorMessageStatus("닉네임을 입력해주세요.");
      if (pwInput.current!.value === "")
        return signUpErrorMessageStatus("비밀번호를 입력해주세요.");

      const body: UserRegisterDto = {
        email: signUpID,
        nickname: nickname,
        password: signUpPW,
      };

      try {
        signUpErrorMessageStatus("");
        const response = await axios.post(
          "http://43.203.92.111/api/sign/register",
          // "http://localhost:8080/api/sign/register",
          body
        );
        signUpErrorMessageStatus("");
        setSignUpId("");
        setNickname("");
        setSignUpPw("");
        toggleWelcomeMessage();
        setTimeout(() => {
          inUpToggle();
        }, 1500);
        setTimeout(() => {
          toggleWelcomeMessage();
        }, 5000);

        console.log(response.data);
      } catch (error) {
        if (axios.isAxiosError(error)) {
          const axiosError = error as AxiosError;

          if (axiosError.response) {
            console.log(error.response?.data);
            if (error.response?.data.code !== 200) {
              return signUpErrorMessageStatus(error.response?.data.msg);
            }
          }
        }
      }
    },
  });

  return (
    <div className={styles.signUpSection}>
      <div className={styles.signInText}>Sign Up</div>
      <div className={styles.inputSpace}>
        <div className={styles.inputEachSpace}>
          <div
            className={`${
              signUpErrorMessageAni
                ? styles.errorMessageAni2
                : styles.errorMessageAni
            } ${styles.signUpErrorMessage}`}
          >
            {signUpErrorMessage}
          </div>
          <i className={`${styles.inputIcon} material-symbols-outlined`}>
            person
          </i>
          <input
            ref={idInput}
            name="id"
            type="text"
            className={styles.input}
            placeholder="ID"
            value={signUpID}
            onChange={(e) => setSignUpId(e.target.value)}
          />
        </div>
        <div className={styles.inputEachSpace}>
          <i className={`${styles.inputIcon} material-symbols-outlined`}>
            account_circle
          </i>
          <input
            ref={nicknameInput}
            maxLength={16}
            name="nickname"
            type="text"
            className={styles.input}
            placeholder="nickname"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
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
            value={signUpPW}
            onChange={(e) => setSignUpPw(e.target.value)}
          />
          <i
            className={`${styles.visibility} material-symbols-outlined`}
            onClick={visibleToggle}
          >
            {isVisible ? "visibility" : "visibility_off"}
          </i>
        </div>
        <button
          className={styles.signInUpBtn}
          onClick={() => {
            registerUser.mutate();
          }}
        >
          Sign Up
        </button>
      </div>

      <div className={styles.signInBottom}>
        <div className={styles.bottomText}>Ready to sign in?</div>
        <div
          className={styles.goToSignInUpBtn}
          onClick={() => {
            inUpToggle();
            signUpErrorMessageStatus("");
            setSignUpId("");
            setNickname("");
            setSignUpPw("");
          }}
        >
          Sign In
        </div>
      </div>
    </div>
  );
}

export default SignUp;
