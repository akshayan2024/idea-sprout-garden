from flask import Flask, request, jsonify
from flask_cors import CORS
from services.auth_service import AuthService
from services.content_service import ContentService
from services.database_service import DatabaseService
from dotenv import load_dotenv
import os

# Load environment variables
load_dotenv()

# Initialize Flask and services
app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}}, supports_credentials=True)

db_service = DatabaseService()
auth_service = AuthService(db_service)
content_service = ContentService(db_service)

# User registration route
@app.route('/register', methods=['POST'])
def register():
    data = request.json
    user_id = auth_service.register(data['email'], data['password'])
    return jsonify({'status': 'success', 'user_id': user_id})

# User login route
@app.route('/login', methods=['POST'])
def login():
    data = request.json
    session_token = auth_service.login(data['email'], data['password'])
    if session_token:
        return jsonify({'status': 'success', 'session_token': session_token})
    else:
        return jsonify({'status': 'error', 'message': 'Invalid credentials'})

# Route to generate ideas
@app.route('/generate-ideas', methods=['POST'])
def generate_ideas():
    data = request.json
    idea = content_service.generate_idea(data['input_text'])
    content_service.store_generated_idea(data['user_id'], data['input_text'], idea)
    return jsonify({'generated_idea': idea})

# Route to check the session
@app.route('/check-session', methods=['GET'])
def check_session():
    session_token = request.args.get('session_token')
    if auth_service.validate_session(session_token):
        return jsonify({'status': 'valid'})
    else:
        return jsonify({'status': 'invalid'})

# Logout route
@app.route('/logout', methods=['POST'])
def logout():
    data = request.json
    auth_service.logout(data['session_token'])
    return jsonify({'status': 'logged out'})

# New route for processing content aspirations
@app.route('/process-input', methods=['POST'])
def process_input():
    data = request.json
    user_id = data.get('user_id')
    creator_text = data.get('creator_text')
    content_text = data.get('content_text')
    
    # Process the input and store raw text
    content_service.store_raw_text(user_id, creator_text, content_text)
    
    # Extract keywords and generate processed data
    processed_data = content_service.process_content_aspiration(creator_text, content_text)
    
    return jsonify({
        'status': 'success',
        'message': 'Content aspirations processed successfully',
        'processed_data': processed_data
    })

# Route to fetch user ideas
@app.route('/user-ideas/<user_id>', methods=['GET'])
def get_user_ideas(user_id):
    ideas = content_service.get_user_ideas(user_id)
    return jsonify(ideas)

if __name__ == '__main__':
    app.run(debug=os.getenv('FLASK_DEBUG', 'False') == 'True')