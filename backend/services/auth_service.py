from werkzeug.security import generate_password_hash, check_password_hash
import uuid
from datetime import datetime, timedelta

class AuthService:
    def __init__(self, db_service):
        self.db_service = db_service

    def register(self, email, password):
        password_hash = generate_password_hash(password)
        return self.db_service.create_user(email, password_hash)

    def login(self, email, password):
        user = self.db_service.get_user_by_email(email)
        if user and check_password_hash(user['password_hash'], password):
            session_token = str(uuid.uuid4())
            expires_at = datetime.now() + timedelta(days=1)  # 1-day session expiration
            self.db_service.create_session(user['id'], session_token, expires_at)
            return session_token
        else:
            return None

    def validate_session(self, session_token):
        session = self.db_service.get_session(session_token)
        return session is not None

    def logout(self, session_token):
        self.db_service.delete_session(session_token)
