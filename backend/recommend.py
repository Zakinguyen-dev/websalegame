from flask import Flask, request, jsonify
from flask_cors import CORS
from fuzzywuzzy import fuzz
import json

app = Flask(__name__)
CORS(app)  # Cho phép CORS để frontend gọi API

# Đọc dữ liệu games từ file gamesData.json
with open("../public/api/gamesData.json", "r") as file:
    games_data = json.load(file)

# API tìm kiếm game
@app.route("/search", methods=["POST"])
def search_games():
    search_term = request.json.get("search_term", "").lower()
    if not search_term:
        return jsonify({"message": "Search term is required"}), 400

    # Tìm kiếm game dựa trên fuzzy matching
    search_results = []
    for game in games_data:
        title = game["title"].lower()
        # Tính độ tương đồng giữa search_term và title
        # Sử dụng token_set_ratio để xử lý từ viết tắt tốt hơn
        similarity = fuzz.token_set_ratio(search_term, title)
        # Kết hợp với partial_ratio để tăng độ chính xác
        partial_similarity = fuzz.partial_ratio(search_term, title)
        # Lấy giá trị cao nhất giữa hai phương pháp
        final_similarity = max(similarity, partial_similarity)
        
        if final_similarity > 50:  # Hạ ngưỡng độ tương đồng xuống 50
            # Thêm độ tương đồng vào game để sắp xếp sau
            game_copy = game.copy()
            game_copy["similarity"] = final_similarity
            search_results.append(game_copy)

    # Sắp xếp theo độ tương đồng (cao xuống thấp)
    search_results.sort(key=lambda x: x["similarity"], reverse=True)

    # Xóa trường similarity trước khi trả về
    for game in search_results:
        game.pop("similarity", None)

    return jsonify(search_results)

# API đề xuất game (giữ nguyên)
@app.route("/recommend", methods=["POST"])
def recommend_games():
    game_id = request.json.get("game_id")
    if not game_id:
        return jsonify({"message": "Game ID is required"}), 400

    # Tìm game hiện tại
    current_game = next((game for game in games_data if game["_id"] == game_id), None)
    if not current_game:
        return jsonify({"message": "Game not found"}), 404

    # Đề xuất dựa trên category và rating
    recommendations = []
    for game in games_data:
        if game["_id"] != game_id:  # Không đề xuất chính game đó
            # Đề xuất nếu cùng category hoặc rating tương tự
            if game["category"] == current_game["category"] or abs(game["rating"] - current_game["rating"]) <= 1:
                recommendations.append(game)

    # Sắp xếp theo rating (cao xuống thấp)
    recommendations.sort(key=lambda x: x["rating"], reverse=True)

    return jsonify(recommendations[:5])  # Trả về tối đa 5 game đề xuất

if __name__ == "__main__":
    app.run(port=5001, debug=True)