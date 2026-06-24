from flask import Flask, request, jsonify
from flask_cors import CORS

from predict import predict_condition

app = Flask(__name__)

CORS(app)

@app.route("/")
def home():
    return "PCOD-PCOS Prediction API Running"

@app.route("/predict", methods=["POST"])
def predict():

    try:
        user_data = request.get_json()

        result = predict_condition(user_data)

        return jsonify(result)

    except Exception as e:

        return jsonify({
            "error": str(e)
        }), 500


if __name__ == "__main__":
    app.run(debug=True)