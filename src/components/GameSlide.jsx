import React from "react";
import { SwiperSlide } from "swiper/react";

function GameSlide({ games, active, toggleVideo }) {
  return (
    <SwiperSlide>
      <div className="gameSlider">
        <img src={games.img} alt="Game Image" />
        <div className={`video ${active ? 'active' : ''}`}>
          <iframe
            width="1280"
            height="720"
            src={games.trailer}
            title={games.title}
            allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture;"
            allowFullScreen
          ></iframe>
        </div>
        <div className="content">
          <h2>{games.title}</h2>
          <p>{games.description}</p>
          <div className="buttons">
            <a href="#" className="orderBtn">
              Order Now
            </a>
            <a
              href="#"
              className={`playBtn ${active ? 'active' : ''}`}
              onClick={() => toggleVideo(games._id)} // Gọi toggleVideo với _id của game
            >
              <span className="pause">
                <i className="bi bi-pause-fill"></i>
              </span>
              <span className="play">
                <i className="bi bi-play-fill"></i>
              </span>
            </a>
          </div>
        </div>
      </div>
    </SwiperSlide>
  );
}

export default GameSlide;
