import React, { useState, useEffect } from "react";
import "./AuthForm.css";

function AuthForm({ onLogin }) {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    email: "",
    username: "",
    password: "",
  });
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const userId = localStorage.getItem("userId"); // Kiểm tra userId thay vì "user"
    if (userId) {
      onLogin(); // Nếu có userId, gọi onLogin
    }
  }, [onLogin]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = isLogin ? "http://localhost:5000/login" : "http://localhost:5000/signup";
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await response.json();

      if (response.ok) {
        console.log(data.message);
        if (isLogin) {
          // Lưu userId từ response của login
          localStorage.setItem("userId", data.userId);
          localStorage.setItem("user", JSON.stringify({ username: formData.username }));
        } else {
          // Signup không trả về userId ngay, cần đăng nhập lại hoặc lấy id từ DB
          setIsLogin(true); // Chuyển sang login sau khi signup thành công
          setErrorMessage("Sign up successful! Please log in.");
          return;
        }
        onLogin(); // Gọi hàm onLogin khi đăng nhập thành công
        setErrorMessage("");
      } else {
        setErrorMessage(data.message);
      }
    } catch (error) {
      console.error("Error:", error);
      setErrorMessage("Đã có lỗi xảy ra. Vui lòng thử lại.");
    }
  };

  return (
    <div className="auth-container">
      <div className="video-background">
        <iframe
          width="100%"
          height="100%"
          src="https://www.youtube.com/embed/Tc7_akJSdAQ?autoplay=1&loop=1&mute=1&playlist=Tc7_akJSdAQ"
          frameBorder="0"
          allow="autoplay; fullscreen"
          title="Background Video"
        />
      </div>
      <div className="auth-form">
        <h2>{isLogin ? "Login" : "Sign Up"}</h2>
        <form onSubmit={handleSubmit}>
          {!isLogin && (
            <div className="input-group">
              <label>Email id</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="Enter email"
                required
              />
            </div>
          )}
          <div className="input-group">
            <label>Username</label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleInputChange}
              placeholder="Enter username"
              required
            />
          </div>
          <div className="input-group">
            <label>Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              placeholder="Enter password"
              required
            />
          </div>
          <button type="submit">{isLogin ? "Login" : "Sign Up"}</button>
        </form>

        {errorMessage && <div className="error-message">{errorMessage}</div>}

        <div className="toggle">
          <span>
            {isLogin ? "No account?" : "Already have an account?"}{" "}
            <button onClick={() => setIsLogin(!isLogin)}>
              {isLogin ? "Sign Up" : "Login"}
            </button>
          </span>
        </div>
      </div>
    </div>
  );
}

export default AuthForm;