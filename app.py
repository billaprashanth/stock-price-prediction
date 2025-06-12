from flask import Flask, request, jsonify, render_template
import joblib
import pandas as pd
from flask_cors import CORS
app = Flask(__name__)
CORS(app)

# Load the model
model = joblib.load("stock_price_model.pkl")
feature_cols = joblib.load("feature_cols.pkl")

@app.route('/')
def home():
    return "Stock Price Prediction API is running!"

@app.route('/predict', methods=['POST'])
def predict():
    # Assume JSON input: { "Close":..., "SMA_7":..., ... }
    input_data = request.get_json(force=True)
    df = pd.DataFrame([input_data], columns=feature_cols)
    prediction = model.predict(df)[0]
    return jsonify({'predicted_close': prediction})

if __name__ == '__main__':
    app.run(debug=True)