import { Button } from "../Button/Button";
import "./Login.css";
import { useState } from "react";

//backend import
import { DungeonLedger } from "../../../app/index";

import { useNavigate } from "react-router-dom";
import { Events } from "../../../utility/Events";

export function LoginForm() {
    const dungeonLedger = DungeonLedger.get();
    const authSystem = dungeonLedger.getAuthSystem();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    //buttons
    let signInBtnDisabled = false;

    const eventBus = dungeonLedger.eventBus;

    eventBus.subscribe(Events.AUTH_LOGIN_FAILED, () => {
       //indicate login failure to user
         signInBtnDisabled = false;
    });

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        signInBtnDisabled = true;

        authSystem.login(email, password);
    };

    const handleSignUp = () => {
        navigate("/signup");
    };

    return (
        <div className="login-page">
            <form className="login-form" onSubmit={handleLogin}>
                <h2 className="login-title">Welcome Back</h2>

                <input
                    id="email"
                    name="email"
                    autoComplete="email"
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="input-field"
                    required
                />

                <input
                    id="password"
                    name="password"
                    autoComplete="current-password"
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="input-field"
                    required
                />

                <div className="button-group">
                    <Button
                        type="submit"
                        variant="primary"
                        size="md"
                        onClick={handleLogin}
                        disabled={signInBtnDisabled}
                    >
                        Log In
                    </Button>

                    <Button variant="primary" size="md" onClick={handleSignUp}>
                        Sign Up
                    </Button>
                </div>
            </form>
        </div>
    );
}
