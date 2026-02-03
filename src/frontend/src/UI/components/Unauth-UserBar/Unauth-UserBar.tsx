import { Button } from "../Button/Button";
import { Logo } from "../logo/Logo";
import "./Unauth-UserBar.css";
import { useNavigate } from "react-router-dom";

export function UnauthUserBar() {
  const navigate = useNavigate();

  const loginBtnHandler = () => {
    navigate("/login");
  };

  const signupBtnHandler = () => {
    navigate("/signup");
  };
  return (
    <div className="userbar">
      <div className="userbar-left">
        <Logo />
      </div>

      <div className="userbar-right">
        <Button variant="primary" size="md" onClick={loginBtnHandler}>
          Login
        </Button>
        <Button variant="primary" size="md" onClick={signupBtnHandler}>
          Signup
        </Button>
      </div>
    </div>
  ); 
}
