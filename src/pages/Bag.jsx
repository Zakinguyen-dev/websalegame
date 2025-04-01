import React, { useState, useEffect } from "react";
import "./bag.css";
import ShopBagItem from "../components/ShopBagItem";

function Bag({ games, reference, setGames }) { // Thêm setGames vào props
  const [total, setTotal] = useState(0);
  const [showSuccess, setShowSuccess] = useState(false); // State để hiển thị thông báo

  const handleTotalPayment = () => {
    return games
      .map((game) => game.price * (1 - game.discount))
      .reduce((accumulator, currentValue) => accumulator + currentValue, 0)
      .toFixed(2);
  };

  useEffect(() => {
    setTotal(handleTotalPayment());
  }, [games]);

  const handleCheckout = async () => {
    const userId = localStorage.getItem("userId");
    
    if (!userId) {
      alert("Please login first!");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId,
          games,
        }),
      });

      const data = await response.json();
      if (response.ok) {
        setShowSuccess(true); // Hiển thị thông báo thành công
        setGames([]); // Xóa danh sách game trong giỏ hàng
        setTimeout(() => setShowSuccess(false), 3000); // Ẩn thông báo sau 3 giây
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error("Checkout error:", error);
      alert("checkout");
    }
  };

  return (
    <section id="bag" className="bag" ref={reference}>
      <div className="container-fluid">
        <div className="row mb-3">
          <h2>My Bag</h2>
        </div>
      </div>

      {games.length === 0 && !showSuccess ? (
        <h2>Your bag is empty</h2>
      ) : (
        <div className="row">
          {showSuccess ? (
            <div className="success-message">
              <h3>Payment successful!</h3>
            </div>
          ) : (
            <>
              <div className="table-responsive">
                <table className="shopBagTable table table-borderless align-middle">
                  <thead>
                    <tr>
                      <th scope="col">No.</th>
                      <th scope="col">Preview</th>
                      <th scope="col">Game</th>
                      <th scope="col">Price</th>
                      <th scope="col">Discount</th>
                      <th scope="col">Payment</th>
                      <th scope="col">Remove</th>
                    </tr>
                  </thead>
                  <tbody>
                    {games.map((game, index) => (
                      <ShopBagItem index={index} key={game._id} game={game} />
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="row d-flex justify-content-between mt-5">
                <div className="col-lg-2 d-flex align-items-center">
                  <p className="itemCount">Total Items: {games.length} </p>
                </div>
                <div className="col-lg-10 d-flex justify-content-end">
                  <div className="payment">
                    Total: {total}
                    <a
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        handleCheckout();
                      }}
                    >
                      Check out <i className="bi bi-wallet-fill"></i>
                    </a>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </section>
  );
}

export default Bag;