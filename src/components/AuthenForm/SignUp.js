import React, { useRef } from "react";
import useForm from "../../hooks/useForm";
import validate from "../../validations/validateInfo";
import "./Form.css";

const Signup = ({ submitForm }) => {
  const signupHost = "http://localhost:3000/api/v1/auth/register";
  const { errors } = useForm(submitForm, validate);

  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [password2, setPassword2] = React.useState("");
  const [status, setStatus] = React.useState("");
  const submitButton = useRef();
  const handleSignup = async () => {
    if (password !== password2) {
      setStatus("Mật khẩu không trùng khớp");
    } else {
      submitButton.current.disable = true;
      const userData = { email, password };
      // console.log(userData);
      let result = await fetch(signupHost, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      })
        .then((res) => {
          res.json().then((data) => {
            if (res.ok) {
              alert("Đăng kí tài khoản thành công");
              window.location = "/login";
            } else if (res.status === 422) {
              alert('Email cần đúng định dạng. Mật khẩu 6-40 ký tự!')
            } else {
              alert("Đăng ký không thành công");
            }
          });
        })
        .catch((err) => {
          alert("Đăng ký không thành công");
          console.log(err);
        });
    }
  };
  const checkPassword = (v) => {
    if (password !== password) {
      setPassword2(v);
      setStatus("Mật khẩu không trùng khớp");
    } else {
      setPassword2(v);
      setStatus("");
    }
  };
  return (
    <div className="form-container">
      <div className="form-content-left">
        <img src="img/admin.png" alt="spaceship" className="form-img" />
      </div>
      <div className="form-content-right">
        <form className="form">
          <h1 style={{ color: "#000" }}>Đăng ký</h1>
          <div className="form-inputs">
            <label htmlFor="username" className="form-label">
              Email
            </label>
            <input
              id="username"
              type="text"
              name="username"
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
              name="matKhau"
              className="form-input"
              placeholder="Mật khẩu"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            {errors.matKhau && <p>{errors.matKhau}</p>}
          </div>
          <div className="form-inputs">
            <label htmlFor="password2" className="form-label">
              Xác nhận mật khẩu
            </label>
            <input
              id="password2"
              type="password"
              name="matKhau2"
              className="form-input"
              placeholder="Xác nhận mật khẩu"
              value={password2}
              onChange={(e) => checkPassword(e.target.value)}
              onBlur={(e) => checkPassword(e.target.value)}
            />
            {errors.matKhau2 && <p>{errors.matKhau2}</p>}
          </div>
          {status && <div className="status">{status}</div>}

          <button
            ref={submitButton}
            className="form-input-btn"
            type="button"
            onClick={() => {
              handleSignup();
            }}
          >
            Xác nhận
          </button>
        </form>
      </div>
    </div>
  );
};

export default Signup;
