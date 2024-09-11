from flask import Flask, request, jsonify
from flask_cors import CORS
from services.auth_service import AuthService
from services.content_service import ContentService
from services.database_service import DatabaseService
from dotenv import load_dotenv
import os
import logging
from logging.handlers import RotatingFileHandler

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

@app.route('/register', methods=['POST'])
def register():
    data = request.json
    app.logger.info(f"Attempting to register user: {data['email']}")
    user_id = auth_service.register(data['email'], data['password'])
    app.logger.info(f"User registered successfully: {user_id}")
    return jsonify({'status': 'success', 'user_id': user_id})

@app.route('/login', methods=['POST'])
def login():
    data = request.json
    app.logger.info(f"Attempting login for user: {data['email']}")
    session_token = auth_service.login(data['email'], data['password'])
    if session_token:
        app.logger.info(f"Login successful for user: {data['email']}")
        return jsonify({'status': 'success', 'session_token': session_token})
    else:
        app.logger.warning(f"Login failed for user: {data['email']}")
        return jsonify({'status': 'error', 'message': 'Invalid credentials'})

@app.route('/generate-ideas', methods=['POST'])
def generate_ideas():
    data = request.json
    app.logger.info(f"Generating ideas for user: {data['user_id']}")
    idea = content_service.generate_idea(data['input_text'])
    content_service.store_generated_idea(data['user_id'], data['input_text'], idea)
    app.logger.info(f"Ideas generated and stored for user: {data['user_id']}")
    return jsonify({'generated_idea': idea})

@app.route('/check-session', methods=['GET'])
def check_session():
    session_token = request.args.get('session_token')
    app.logger.info(f"Checking session for token: {session_token}")
    if auth_service.validate_session(session_token):
        app.logger.info(f"Session valid for token: {session_token}")
        return jsonify({'status': 'valid'})
    else:
        app.logger.warning(f"Session invalid for token: {session_token}")
        return jsonify({'status': 'invalid'})

@app.route('/logout', methods=['POST'])
def logout():
    data = request.json
    app.logger.info(f"Logging out user with session token: {data['session_token']}")
    auth_service.logout(data['session_token'])
    app.logger.info(f"User logged out successfully: {data['session_token']}")
    return jsonify({'status': 'logged out'})

@app.route('/process-input', methods=['POST'])
def process_input():
    data = request.json
    user_id = data.get('user_id')
    creator_text = data.get('creator_text')
    content_text = data.get('content_text')
    
    app.logger.info(f"Processing content aspiration for user: {user_id}")
    
    content_service.store_raw_text(user_id, creator_text, content_text)
    processed_data = content_service.process_content_aspiration(creator_text, content_text)
    
    app.logger.info(f"Content aspiration processed for user: {user_id}")
    
    return jsonify({
        'status': 'success',
        'message': 'Content aspirations processed successfully',
        'processed_data': processed_data
    })

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

@app.route('/log-info', methods=['GET'])
def log_info():
    return jsonify({
        'log_file_path': os.path.abspath(log_file_path),
        'log_directory': os.path.abspath(log_directory)
    })

if __name__ == '__main__':
    app.run(debug=os.getenv('FLASK_DEBUG', 'False') == 'True')