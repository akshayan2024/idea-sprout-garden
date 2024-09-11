import psycopg2
from psycopg2.extras import RealDictCursor
import os
import json

class DatabaseService:
    def __init__(self):
        self.conn = psycopg2.connect(
            host=os.getenv('DB_HOST'),
            database=os.getenv('DB_NAME'),
            user=os.getenv('DB_USER'),
            password=os.getenv('DB_PASSWORD')
        )
        self.cursor = self.conn.cursor(cursor_factory=RealDictCursor)

    def get_user_by_google_id(self, google_id):
        query = "SELECT * FROM users WHERE google_id = %s;"
        self.cursor.execute(query, (google_id,))
        return self.cursor.fetchone()

    def create_user(self, google_id, email, name):
        query = """
        INSERT INTO users (google_id, email, name)
        VALUES (%s, %s, %s)
        RETURNING *;
        """
        self.cursor.execute(query, (google_id, email, name))
        self.conn.commit()
        return self.cursor.fetchone()

    def store_user_metadata(self, user_id, meta_creator, meta_content):
        query = """
        INSERT INTO user_metadata (user_id, meta_creator, meta_content)
        VALUES (%s, %s, %s)
        ON CONFLICT (user_id) 
        DO UPDATE SET meta_creator = %s, meta_content = %s;
        """
        self.cursor.execute(query, (user_id, meta_creator, meta_content, meta_creator, meta_content))
        self.conn.commit()
        return {"status": "success"}

    def get_user_metadata(self, user_id):
        query = "SELECT meta_creator, meta_content FROM user_metadata WHERE user_id = %s;"
        self.cursor.execute(query, (user_id,))
        return self.cursor.fetchone()

    def update_user_metadata(self, user_id, processed_data):
        query = """
        UPDATE user_metadata
        SET processed_meta = %s
        WHERE user_id = %s;
        """
        self.cursor.execute(query, (json.dumps(processed_data), user_id))
        self.conn.commit()

    def store_generated_idea(self, user_id, input_text, generated_text):
        query = """
        INSERT INTO generated_ideas (user_id, input_text, generated_text)
        VALUES (%s, %s, %s);
        """
        self.cursor.execute(query, (user_id, input_text, generated_text))
        self.conn.commit()

    def get_user_generated_ideas(self, user_id):
        query = "SELECT input_text, generated_text FROM generated_ideas WHERE user_id = %s;"
        self.cursor.execute(query, (user_id,))
        return self.cursor.fetchall()