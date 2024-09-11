from flask import jsonify
from werkzeug.security import generate_password_hash, check_password_hash

class AuthService:
    def __init__(self, db_service):
        self.db_service = db_service

    def register(self, data):
        email = data.get('email')
        password = data.get('password')
        
        if not email or not password:
            return jsonify({"error": "Email and password are required"}), 400
        
        if self.db_service.get_user_by_email(email):
            return jsonify({"error": "User already exists"}), 409
        
        hashed_password = generate_password_hash(password)
        user_id = self.db_service.create_user(email, hashed_password)
        
        return jsonify({"message": "User registered successfully", "user_id": user_id}), 201

    def login(self, data):
        email = data.get('email')
        password = data.get('password')
        
        if not email or not password:
            return jsonify({"error": "Email and password are required"}), 400
        
        user = self.db_service.get_user_by_email(email)
        if not user or not check_password_hash(user['password'], password):
            return jsonify({"error": "Invalid email or password"}), 401
        
        # Here you would typically create a session or JWT token
        # For simplicity, we'll just return the user ID
        return jsonify({"message": "Login successful", "user_id": user['id']}), 200

    def check_session(self):
        # This is a placeholder. In a real app, you'd verify the session or JWT token
        return jsonify({
            "isAuthenticated": False,
            "profile": None
        })

    def logout(self):
        # This is a placeholder. In a real app, you'd invalidate the session or JWT token
        return jsonify({"message": "Logout successful"}), 200