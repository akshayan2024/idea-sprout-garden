from flask import Flask, request, jsonify
from flask_cors import CORS
from services.auth_service import AuthService
from services.content_service import ContentService
from services.database_service import DatabaseService
from dotenv import load_dotenv
import os

load_dotenv()  # Load environment variables from .env file

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}}, supports_credentials=True)

db_service = DatabaseService()
auth_service = AuthService(db_service)
content_service = ContentService(db_service)

@app.route('/register', methods=['POST'])
def register():
    return auth_service.register(request.json)

@app.route('/login', methods=['POST'])
def login():
    return auth_service.login(request.json)

@app.route('/process-input', methods=['POST'])
def process_input():
    return content_service.process_input(request.json)

@app.route('/generate-ideas', methods=['POST'])
def generate_ideas():
    return content_service.generate_ideas(request.json)

@app.route('/check-session', methods=['GET'])
def check_session():
    return auth_service.check_session()

@app.route('/logout', methods=['POST'])
def logout():
    return auth_service.logout()

if __name__ == '__main__':
    app.run(debug=os.getenv('FLASK_DEBUG', 'False') == 'True')