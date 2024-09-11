import openai
import os
from nltk.tokenize import word_tokenize
from nltk.corpus import stopwords
from collections import Counter

class ContentService:
    def __init__(self):
        openai.api_key = os.getenv('OPENAI_API_KEY')

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

    def process_content_aspiration(self, creator_text, content_text):
        # Process creator text
        creator_keywords = self._extract_keywords(creator_text)
        
        # Process content text
        content_keywords = self._extract_keywords(content_text)
        
        return {
            "creator": {
                "keywords": creator_keywords
            },
            "content": {
                "keywords": content_keywords
            }
        }

    def _extract_keywords(self, text):
        tokens = word_tokenize(text.lower())
        stop_words = set(stopwords.words('english'))
        keywords = [word for word in tokens if word.isalnum() and word not in stop_words]
        return [word for word, _ in Counter(keywords).most_common(15)]