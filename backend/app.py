from flask import Flask, request, jsonify
from flask_cors import CORS
import openai

app = Flask(__name__)
CORS(app)

# Configure OpenAI API (you'll need to set up your API key)
openai.api_key = 'your-openai-api-key'

@app.route('/generate-ideas', methods=['POST'])
def generate_ideas():
    data = request.json
    trending_word = data.get('trendingWord')
    user_dictionary = data.get('userDictionary', {})

    # Construct prompt using user dictionary and trending word
    prompt = f"Generate 5 unique content ideas related to '{trending_word}' considering the following themes: {', '.join(user_dictionary.keys())}. Each idea should have a different perspective (e.g., educational, humorous, emotional, factual)."

    try:
        response = openai.Completion.create(
            engine="text-davinci-002",
            prompt=prompt,
            max_tokens=200,
            n=1,
            stop=None,
            temperature=0.7,
        )

        ideas = response.choices[0].text.strip().split('\n')
        return jsonify({"ideas": ideas})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)