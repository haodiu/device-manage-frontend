import React, { useRef, useState } from "react";
import "./Form.css";
import { Route, Routes } from "react-router-dom";
import { Form } from "react-bootstrap";


const Login = () => {
  const hostLogin = process.env.REACT_APP_HOST_LOGIN;
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState("");
  const HandleLogin = async () => {
    const credentials = {
      email: email,
      password: password,
    };
    console.log(email, password);
    console.log(hostLogin);
    const response = await fetch(hostLogin, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(credentials),
    });

    if (response.ok) {
      const loginResponse = await response.json();
      const data = loginResponse.result.data;
      console.log(data);
      localStorage.setItem("auth", JSON.stringify(data));
      if (data.role === "maintenance_staff") {
        window.location = '/';
      } else {
        if (data.name) {
          window.location = '/user-devices';
        } else {
          window.location = '/profile';
        }
      }
    } else {
      setStatus("user not found!");
    }
  };
  const LogonButton = useRef();
  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      console.log(LogonButton);
      HandleLogin().catch((err) => console.log(err));
    }
  };
  return (
    <div className="form-container">
      <div className="form-content-left">
        <img style={{width: '500px'}} src="img/maintenance.png" alt="spaceship" className="form-img" />
      </div>
      <div className="form-content-right">
        <form className="form">
          <h1 style={{color: "#000"}}>Đăng nhập</h1>
          <div className="form-inputs">
            <label htmlFor="username" className="form-label">
              Email
            </label>
            <input
              id="email"
              type="text"
              name="email"
              className="form-input"
              placeholder="Email"
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="form-inputs">
            <label htmlFor="password" className="form-label">
              Mật khẩu
            </label>
            <input
              id="password"
              type="password"
              name="password"
              className="form-input"
              placeholder="Mật khẩu"
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={handleKeyDown}
            />
          </div>
          {status && <div className="status">{status}</div>}

          <button
            ref={LogonButton}
            className="form-input-btn"
            type="button"
            onClick={() => {
              HandleLogin();
            }}
          >
            Xác nhận
          </button>
          <span className="form-input-login" style={{color: "#000"}}>
                    Bạn chưa có tài khoản? <a href="/signup">Đăng ký</a>
          </span>
          <Routes>
              <Route path="/signup" element={<Form/>}/>
          </Routes>
        </form>
      </div>
    </div>
  );
};

export default Login;
