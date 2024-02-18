import styles from "./signInUpPage.module.css";
import LoginPageStore from "../../store/LoginPageStore/LoginPageStore.ts";
// import OauthSpace from "./OauthSpace/OauthSpace.tsx";
import LoginPageHeader from "./header/LoginPageHeader.tsx";
import SignIn from "./SignInUpComponents/SignIn.tsx";
import SignUp from "./SignInUpComponents/SignUp.tsx";
import { useCookies } from "react-cookie";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function SignInUpPage() {
  const navigate = useNavigate();
  const { inUp, welcomeMessage } = LoginPageStore();
  const [cookies] = useCookies(["token"]);

  useEffect(() => {
    if (cookies.token) {
      navigate("/");
    }
  }, [cookies, navigate]);

  return (
    <div className={styles.LoginPage_body}>
      <LoginPageHeader />
      <div className={styles.guideSpace}>
        <h1 className={styles.guideText}>
          {inUp ? "Sign up to Earth-IDEN" : "Sign in to Earth-IDEN"}
        </h1>
      </div>
      <main className={styles.signInUpSpace}>
        <div
          className={`${inUp ? styles.inUpToggle : undefined}  ${
            styles.sliderFrame
          }`}
        >
          {welcomeMessage ? (
            <div className={styles.signUpMessage}>
              <span>Congrats!</span>
              <span>Welcome to Join</span>
            </div>
          ) : undefined}
        </div>
        <SignIn />
        <SignUp />
      </main>
    </div>
  );
}

export default SignInUpPage;
