from flask import Flask, jsonify
from config import Config
from routes import bp

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)
    
    # Standard components registration
    app.register_blueprint(bp)
    
    # Global exception handler wrapper for oversized payloads
    @app.errorhandler(413)
    def file_too_large(e):
        return jsonify({"error": "Payload exceeds allowed size boundaries. Maximum limit is 10 MB."}), 413
        
    return app

if __name__ == '__main__':
    app = create_app()
    app.run(debug=True, host='0.0.0.0', port=5000)
