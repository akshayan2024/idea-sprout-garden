import openai
import os
import nltk
from nltk.tokenize import word_tokenize
from nltk.corpus import stopwords
from collections import Counter

class ContentService:
    def __init__(self, db_service):
        self.db_service = db_service
        openai.api_key = os.getenv('OPENAI_API_KEY')
        nltk.download('punkt')
        nltk.download('stopwords')

    def generate_idea(self, input_text):
        response = openai.ChatCompletion.create(
            model="gpt-4",
            messages=[
                {"role": "system", "content": "You are a creative content idea generator."},
                {"role": "user", "content": f"Generate a content idea based on: {input_text}"}
            ],
            max_tokens=100
        )
        return response.choices[0].message['content'].strip()

    def store_generated_idea(self, user_id, input_text, generated_text):
        self.db_service.store_generated_idea(user_id, input_text, generated_text)

    def store_raw_text(self, user_id, creator_text, content_text):
        self.db_service.upsert_user_metadata(user_id, creator_text, content_text)

    def get_user_ideas(self, user_id):
        return self.db_service.get_user_generated_ideas(user_id)

    def _extract_keywords(self, text):
        tokens = word_tokenize(text.lower())
        stop_words = set(stopwords.words('english'))
        keywords = [word for word in tokens if word.isalnum() and word not in stop_words]
        return [word for word, _ in Counter(keywords).most_common(15)]