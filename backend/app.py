from flask import Flask, request, jsonify
from flask_cors import CORS
from services.auth_service import AuthService
from services.content_service import ContentService
from services.database_service import DatabaseService
from dotenv import load_dotenv
import os
import logging
from logging.handlers import RotatingFileHandler
from google.oauth2 import id_token
from google.auth.transport import requests

# Load environment variables
load_dotenv()

# Initialize Flask and services
app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}}, supports_credentials=True)

# Configure logging
log_directory = 'logs'
if not os.path.exists(log_directory):
    os.makedirs(log_directory)

log_file_path = os.path.join(log_directory, 'app.log')
file_handler = RotatingFileHandler(log_file_path, maxBytes=10485760, backupCount=10)
file_handler.setFormatter(logging.Formatter(
    '%(asctime)s - %(name)s - %(levelname)s - %(message)s'
))

app.logger.addHandler(file_handler)
app.logger.setLevel(logging.INFO)

db_service = DatabaseService()
auth_service = AuthService(db_service)
content_service = ContentService(db_service)

@app.route('/auth/google', methods=['POST'])
def google_auth():
    token = request.json['credential']
    try:
        idinfo = id_token.verify_oauth2_token(token, requests.Request(), os.getenv('GOOGLE_CLIENT_ID'))
        userid = idinfo['sub']
        email = idinfo['email']
        name = idinfo.get('name', '')
        
        # Here you would typically check if the user exists in your database
        # If not, create a new user entry
        user = auth_service.get_or_create_user(userid, email, name)
        
        return jsonify(user)
    except ValueError:
        return jsonify({'error': 'Invalid token'}), 401

@app.route('/auth/logout', methods=['POST'])
def logout():
    # Implement logout logic here
    return jsonify({'status': 'success'})

@app.route('/auth/session', methods=['GET'])
def check_session():
    # Implement session check logic here
    # This is a placeholder implementation
    return jsonify({'isAuthenticated': True, 'profile': {'id': 'placeholder', 'email': 'placeholder@example.com'}})

@app.route('/upload-aspiration', methods=['POST'])
def upload_aspiration():
    data = request.json
    app.logger.info(f"Uploading aspiration for user: {data['user_id']}")
    result = content_service.store_raw_text(data['user_id'], data['creator_text'], data['content_text'])
    app.logger.info(f"Aspiration uploaded for user: {data['user_id']}")
    return jsonify(result)

@app.route('/process-aspiration', methods=['POST'])
def process_aspiration():
    data = request.json
    app.logger.info(f"Processing aspiration for user: {data['user_id']}")
    result = content_service.process_content_aspiration(data['user_id'])
    app.logger.info(f"Aspiration processed for user: {data['user_id']}")
    return jsonify(result)

@app.route('/generate-ideas', methods=['POST'])
def generate_ideas():
    data = request.json
    app.logger.info(f"Generating ideas for user: {data['user_id']}")
    idea = content_service.generate_idea(data['input_text'])
    content_service.store_generated_idea(data['user_id'], data['input_text'], idea)
    app.logger.info(f"Ideas generated and stored for user: {data['user_id']}")
    return jsonify({'generated_idea': idea})

@app.route('/user-ideas/<user_id>', methods=['GET'])
def get_user_ideas(user_id):
    app.logger.info(f"Fetching ideas for user: {user_id}")
    ideas = content_service.get_user_ideas(user_id)
    app.logger.info(f"Ideas fetched for user: {user_id}, count: {len(ideas)}")
    return jsonify(ideas)

@app.route('/log', methods=['POST'])
def log():
    log_entry = request.json
    log_level = getattr(logging, log_entry['level'])
    app.logger.log(log_level, f"[FRONTEND] {log_entry['message']}", extra=log_entry['data'])
    return jsonify({'status': 'success'})

if __name__ == '__main__':
    app.run(debug=os.getenv('FLASK_DEBUG', 'False') == 'True')