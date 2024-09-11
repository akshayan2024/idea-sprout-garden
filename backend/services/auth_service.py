from werkzeug.security import generate_password_hash, check_password_hash
import uuid
from datetime import datetime, timedelta

class AuthService:
    def __init__(self, db_service):
        self.db_service = db_service

    def get_or_create_user(self, google_id, email, name):
        user = self.db_service.get_user_by_google_id(google_id)
        if not user:
            user = self.db_service.create_user(google_id, email, name)
        return user

    def logout(self):
        # Implement logout logic if needed
        pass

    def validate_session(self, session_token):
        session = self.db_service.get_session(session_token)
        return session is not None