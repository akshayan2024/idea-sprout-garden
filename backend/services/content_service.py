import openai
import os
from nltk.tokenize import word_tokenize
from nltk.corpus import stopwords
from collections import Counter
import nltk

nltk.download('punkt')
nltk.download('stopwords')

class ContentService:
    def __init__(self, db_service):
        self.db_service = db_service
        openai.api_key = os.getenv('OPENAI_API_KEY')

    def store_raw_text(self, user_id, creator_text, content_text):
        return self.db_service.store_user_metadata(user_id, creator_text, content_text)

    def process_content_aspiration(self, user_id):
        raw_data = self.db_service.get_user_metadata(user_id)
        if not raw_data:
            raise ValueError("No raw data found for user")

        creator_keywords = self._extract_keywords(raw_data['meta_creator'])
        content_keywords = self._extract_keywords(raw_data['meta_content'])

        processed_data = {
            "creator": {
                "keywords": creator_keywords
            },
            "content": {
                "keywords": content_keywords
            }
        }

        # Use OpenAI to generate insights
        prompt = f"Based on these keywords about the creator: {creator_keywords} " \
                 f"and these keywords about their content aspirations: {content_keywords}, " \
                 f"provide 3 brief insights about their content strategy."

        response = openai.ChatCompletion.create(
            model="gpt-4",
            messages=[
                {"role": "system", "content": "You are a content strategy expert."},
                {"role": "user", "content": prompt}
            ],
            max_tokens=150
        )

        processed_data["ai_insights"] = response.choices[0].message['content'].strip().split('\n')

        # Store the processed data
        self.db_service.update_user_metadata(user_id, processed_data)

        return processed_data

    def _extract_keywords(self, text):
        tokens = word_tokenize(text.lower())
        stop_words = set(stopwords.words('english'))
        keywords = [word for word in tokens if word.isalnum() and word not in stop_words]
        return [word for word, _ in Counter(keywords).most_common(15)]

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

    def store_generated_idea(self, user_id, input_text, generated_idea):
        self.db_service.store_generated_idea(user_id, input_text, generated_idea)

    def get_user_ideas(self, user_id):
        return self.db_service.get_user_generated_ideas(user_id)