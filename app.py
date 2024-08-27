from flask import Flask, request, jsonify, send_from_directory
import requests
from flask_cors import CORS
import logging

app = Flask(__name__)
CORS(app)

# Setup logging
logging.basicConfig(level=logging.DEBUG)

API_KEY = "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"
API_ENDPOINT = "https://api.groq.com/openai/v1/chat/completions"

@app.route('/')
def serve_index():
    return send_from_directory('templates', 'index.html')

@app.route('/static/<path:filename>')
def serve_static(filename):
    return send_from_directory('static', filename)

@app.route('/api/chat', methods=['POST'])
def chat():
    data = request.json
    user_message = data.get('message')

    logging.debug(f"User message received: {user_message}")

    headers = {
        "Authorization": f"Bearer {API_KEY}",
        "Content-Type": "application/json"
    }
    payload = {
        "messages": [
            {"role": "user", "content": user_message}
        ],
        "model": "mixtral-8x7b-32768",
        "max_tokens": 1000
    }

    try:
        response = requests.post(API_ENDPOINT, headers=headers, json=payload)
        response.raise_for_status()
        response_data = response.json()
        bot_message = response_data.get("choices")[0]["message"]["content"]
        return jsonify({"response": bot_message})
    except requests.RequestException as e:
        logging.error(f"Request failed: {e}")
        return jsonify({"response": "Sorry, something went wrong."}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8080, debug=True)

