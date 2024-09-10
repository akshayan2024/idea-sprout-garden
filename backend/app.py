from flask import Flask, request, jsonify
from flask_cors import CORS
from services.auth_service import AuthService
from services.content_service import ContentService
from services.database_service import DatabaseService

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}}, supports_credentials=True)

db_service = DatabaseService()
auth_service = AuthService(db_service)
content_service = ContentService(db_service)

@app.route('/process-input', methods=['POST'])
def process_input():
    data = request.json
    return content_service.process_input(data)

@app.route('/generate-ideas', methods=['POST'])
def generate_ideas():
    data = request.json
    return content_service.generate_ideas(data)

@app.route('/check-session', methods=['GET'])
def check_session():
    return auth_service.check_session()

@app.route('/login', methods=['POST'])
def login():
    data = request.json
    return auth_service.login(data)

@app.route('/logout', methods=['POST'])
def logout():
    return auth_service.logout()

if __name__ == '__main__':
    app.run(debug=True)