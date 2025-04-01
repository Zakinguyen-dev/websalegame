import React, { useContext, useState, useEffect } from "react";
import "./header.css";
import { AppContext } from "../App";
import userImg from "../images/user.jpg";

function Header({ toggleActive }) {
  const { library, bag } = useContext(AppContext);
  const [username, setUsername] = useState("Guest");

  useEffect(() => {
    const updateUsername = () => {
      const user = JSON.parse(localStorage.getItem("user"));
      if (user && user.username) {
        setUsername(user.username);
      } else {
        setUsername("Guest");
      }
    };

    // Gọi ngay khi mount
    updateUsername();

    // Lắng nghe sự kiện thay đổi localStorage (nếu cần)
    window.addEventListener("storage", updateUsername);
    return () => window.removeEventListener("storage", updateUsername);
  }, []); // Chạy một lần khi mount, nhưng lắng nghe thay đổi

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("userId");
    setUsername("Guest"); // Cập nhật ngay lập tức
    window.location.reload();
  };

  return (
    <header>
      <a href="#" className="menu" onClick={toggleActive}>
        <i className="bi bi-sliders"></i>
      </a>
      <div className="userItems">
        <a href="#" className="icon">
          <i className="bi bi-heart-fill"></i>
          <span className="like">{library.length}</span>
        </a>
        <a href="#" className="icon">
          <i className="bi bi-bag-fill"></i>
          <span className="bag">{bag.length}</span>
        </a>
        <div className="avatar">
          <a href="#">
            <img src={userImg} alt="User Image" />
          </a>
          <div className="user">
            <span>{username}</span>
            <a href="#">View Profile</a>
          </div>
        </div>
        <div className="exit">
          <button onClick={handleLogout} className="logout-btn">
            Logout
          </button>
        </div>
      </div>
    </header>
  );
}

export default Header;