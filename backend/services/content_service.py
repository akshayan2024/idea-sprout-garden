import openai

class ContentService:
    def __init__(self, db_service):
        self.db_service = db_service
        openai.api_key = os.getenv('OPENAI_API_KEY')

    def generate_idea(self, input_text):
        # Call OpenAI API to generate idea (example using GPT-3)
        response = openai.ChatCompletion.create(
            model="gpt-4o",
            prompt=f"Generate an idea based on: {input_text}",
            max_tokens=100
        )
        return response.choices[0].text.strip()

    def store_generated_idea(self, user_id, input_text, generated_text):
        self.db_service.store_generated_idea(user_id, input_text, generated_text)
