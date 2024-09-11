import psycopg2
from psycopg2.extras import RealDictCursor
import os

class DatabaseService:
    def __init__(self):
        self.conn = psycopg2.connect(
            host=os.getenv('DB_HOST'),
            database=os.getenv('DB_NAME'),
            user=os.getenv('DB_USER'),
            password=os.getenv('DB_PASSWORD')
        )
        self.cursor = self.conn.cursor(cursor_factory=RealDictCursor)

    # Create a new user
    def create_user(self, email, password_hash):
        query = """
        INSERT INTO users (email, password_hash) 
        VALUES (%s, %s) RETURNING id;
        """
        self.cursor.execute(query, (email, password_hash))
        self.conn.commit()
        return self.cursor.fetchone()['id']

    # Retrieve a user by email
    def get_user_by_email(self, email):
        query = "SELECT * FROM users WHERE email = %s;"
        self.cursor.execute(query, (email,))
        return self.cursor.fetchone()

    # Create a session
    def create_session(self, user_id, session_token, expires_at):
        query = """
        INSERT INTO sessions (user_id, session_token, expires_at)
        VALUES (%s, %s, %s);
        """
        self.cursor.execute(query, (user_id, session_token, expires_at))
        self.conn.commit()

    # Validate session by token
    def get_session(self, session_token):
        query = "SELECT * FROM sessions WHERE session_token = %s AND expires_at > NOW();"
        self.cursor.execute(query, (session_token,))
        return self.cursor.fetchone()

    # Delete session (logout)
    def delete_session(self, session_token):
        query = "DELETE FROM sessions WHERE session_token = %s;"
        self.cursor.execute(query, (session_token,))
        self.conn.commit()

    # Store a generated idea
    def store_generated_idea(self, user_id, input_text, generated_text):
        query = """
        INSERT INTO generated_ideas (user_id, input_text, generated_text)
        VALUES (%s, %s, %s);
        """
        self.cursor.execute(query, (user_id, input_text, generated_text))
        self.conn.commit()

    # Retrieve user-generated ideas
    def get_user_generated_ideas(self, user_id):
        query = "SELECT input_text, generated_text FROM generated_ideas WHERE user_id = %s;"
        self.cursor.execute(query, (user_id,))
        return self.cursor.fetchall()

    # Add or update user metadata
    def upsert_user_metadata(self, user_id, meta_key, meta_value):
        query = """
        INSERT INTO user_metadata (user_id, meta_key, meta_value)
        VALUES (%s, %s, %s)
        ON CONFLICT (user_id, meta_key) 
        DO UPDATE SET meta_value = EXCLUDED.meta_value;
        """
        self.cursor.execute(query, (user_id, meta_key, meta_value))
        self.conn.commit()

    # Retrieve user metadata
    def get_user_metadata(self, user_id, meta_key):
        query = "SELECT meta_value FROM user_metadata WHERE user_id = %s AND meta_key = %s;"
        self.cursor.execute(query, (user_id, meta_key))
        return self.cursor.fetchone()
