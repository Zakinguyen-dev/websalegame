// App.js
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import React, { useState, useEffect } from "react";
import "./App.css";
import Main from "./pages/Main";
import AuthForm from "./components/AuthForm";
export const AppContext = React.createContext();

function App() {
  const [library, setLibrary] = useState([]);
  const [bag, setBag] = useState([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Kiểm tra trạng thái đăng nhập khi ứng dụng khởi động
  useEffect(() => {
    const userId = localStorage.getItem("userId");
    if (userId) {
      setIsAuthenticated(true); // Nếu có userId, đánh dấu đã đăng nhập
    }
  }, []);

  // Hàm xử lý đăng nhập
  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  // Hàm xử lý đăng xuất
  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("userId");
    setIsAuthenticated(false); // Đặt lại trạng thái chưa đăng nhập
  };

  return (
    <AppContext.Provider
      value={{
        library,
        setLibrary,
        bag,
        setBag,
        isAuthenticated,
        handleLogout, // Thêm handleLogout vào context để Header có thể dùng
      }}
    >
      {isAuthenticated ? <Main /> : <AuthForm onLogin={handleLogin} />}
    </AppContext.Provider>
  );
}

export default App;