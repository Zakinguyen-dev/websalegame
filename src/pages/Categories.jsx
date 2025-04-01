import React, { useState, useEffect } from "react";
import "./categories.css";
import filterListData from "../data/filterListData";
import GameCard from "../components/GameCard";

function Categories({ games, reference }) {
  const [data, setData] = useState(games);
  const [filters, setFilters] = useState(filterListData);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [text, setText] = useState("");
  const [recommendations, setRecommendations] = useState([]); // State cho game đề xuất

  // Lọc game theo category
  useEffect(() => {
    if (selectedCategory === "All") {
      setData(games);
      setRecommendations([]); // Ẩn game đề xuất khi không tìm kiếm
    } else {
      setData(games.filter((game) => game.category === selectedCategory));
      setRecommendations([]); // Ẩn game đề xuất khi lọc theo category
    }
  }, [selectedCategory, games]);

  const handleFilterGames = (category) => {
    setFilters(
      filters.map((filter) => ({
        ...filter,
        active: filter.name === category,
      }))
    );
    setSelectedCategory(category);
    setText(""); // Xóa ô tìm kiếm khi lọc theo category
  };

  // Tìm kiếm game và lấy game đề xuất
  const handleSearchGames = async (e) => {
    const searchTerm = e.target.value;
    setText(searchTerm);

    if (searchTerm.trim() === "") {
      setData(games); // Nếu không có từ khóa, hiển thị tất cả game
      setRecommendations([]); // Ẩn game đề xuất
      return;
    }

    try {
      // Gọi API tìm kiếm
      const searchResponse = await fetch("http://localhost:5001/search", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ search_term: searchTerm }),
      });
      const searchResults = await searchResponse.json();
      setData(searchResults);

      // Nếu có kết quả tìm kiếm, lấy game đề xuất dựa trên game đầu tiên
      if (searchResults.length > 0) {
        const firstGameId = searchResults[0]._id;
        const recommendResponse = await fetch("http://localhost:5001/recommend", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ game_id: firstGameId }),
        });
        const recommendedGames = await recommendResponse.json();
        setRecommendations(recommendedGames);
      } else {
        setRecommendations([]); // Nếu không có kết quả tìm kiếm, ẩn game đề xuất
      }
    } catch (error) {
      console.error("Error searching games:", error);
      setData(games); // Fallback về danh sách ban đầu nếu có lỗi
      setRecommendations([]);
    }
  };

  return (
    <section id="categories" className="categories" ref={reference}>
      <div className="container-fluid mt-2">
        <div className="row">
          <div className="col-lg-8 d-flex align-items-center justify-content-start">
            <ul className="filters">
              {filters.map((filter) => (
                <li
                  key={filter._id}
                  className={filter.active ? "active" : undefined}
                  onClick={() => handleFilterGames(filter.name)}
                >
                  {filter.name}
                </li>
              ))}
            </ul>
          </div>
          <div className="col-lg-4 d-flex align-items-center justify-content-start">
            <div className="search">
              <i className="bi bi-search"></i>
              <input
                type="text"
                name="search"
                value={text}
                placeholder="Search"
                onChange={handleSearchGames}
              />
            </div>
          </div>
        </div>
        {/* Danh sách game chính */}
        <div className="row">
          {data.map((game) => (
            <GameCard key={game._id} game={game} />
          ))}
        </div>
        {/* Danh sách game đề xuất (chỉ hiển thị khi có tìm kiếm và có kết quả đề xuất) */}
        {text && recommendations.length > 0 && (
          <>
            <h3 className="mt-5">Recommended Games</h3>
            <div className="row">
              {recommendations.map((game) => (
                <GameCard key={game._id} game={game} />
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  );
}

export default Categories;