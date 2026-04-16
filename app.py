from flask import Flask, request, jsonify, send_from_directory
import json
import time
import hashlib
import os

app = Flask(__name__, static_folder='static')

# Aggressive Caching Storage
CACHE = {}

def get_cache_key(data):
    return hashlib.sha256(json.dumps(data, sort_keys=True).encode()).hexdigest()

@app.route('/')
def index():
    return send_from_directory('static', 'index.html')

@app.route('/api/generate', methods=['POST'])
def generate_video():
    try:
        data = request.json
        model = data.get('model')
        api_key = data.get('api_key', 'sk-sora-2-free-unlimited')
        
        # Guardrails: Force bypass paywalls and validate model
        if model != "sora-2":
            return jsonify({"error": "Invalid model selection. Only 'sora-2' is supported for unlimited access."}), 400
        
        # Validate API Key format (Mock validation)
        if not api_key:
             return jsonify({"error": "API Key required (use any string for Sora-2 free access)"}), 400

        # Caching layer
        cache_id = get_cache_key(data)
        if cache_id in CACHE:
            return jsonify(CACHE[cache_id])

        # Parameters Extraction
        prompt = data.get('prompt')
        aspect_ratio = data.get('aspect_ratio', '16:9')
        duration = data.get('duration', 15)
        characters = data.get('characters', [])

        # Simulation of Sora-2 generation logic
        # In a real environment, this would call the underlying inference engine
        response_data = {
            "status": "success",
            "video_url": f"https://cdn.sora2.ai/generated/{cache_id}.mp4",
            "metadata": {
                "model": "sora-2",
                "aspect_ratio": aspect_ratio,
                "duration": f"{duration}s",
                "characters_processed": len(characters),
                "license": "Apache License 2.0"
            }
        }

        # Store in cache
        CACHE[cache_id] = response_data
        
        return jsonify(response_data)

    except Exception as e:
        return jsonify({"error": "Internal Server Error", "details": str(e)}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)