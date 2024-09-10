from flask import Flask, request, jsonify
from flask_cors import CORS
import openai
from sqlalchemy import create_engine, Column, Integer, String, JSON
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
import nltk
from nltk.corpus import wordnet
import os

app = Flask(__name__)
CORS(app)

# Download required NLTK data
nltk.download('wordnet')

# Configure OpenAI API (you'll need to set up your API key)
openai.api_key = os.environ.get('OPENAI_API_KEY')

# Configure PostgreSQL
DATABASE_URL = os.environ.get('DATABASE_URL', 'postgresql://username:password@localhost/dbname')
engine = create_engine(DATABASE_URL)
Session = sessionmaker(bind=engine)
Base = declarative_base()

class UserMetadata(Base):
    __tablename__ = 'user_metadata'

    id = Column(Integer, primary_key=True)
    user_id = Column(String, unique=True)
    meta_creator = Column(JSON)
    meta_content = Column(JSON)

Base.metadata.create_all(engine)

def parse_text(text):
    prompt = f"Based on the following text, generate a comprehensive set of relevant words and phrases:\n\n{text}\n\nGenerate words:"
    response = openai.ChatCompletion.create(
        model="gpt-4",
        messages=[
            {"role": "system", "content": "You are a helpful assistant that generates relevant words and phrases based on given text."},
            {"role": "user", "content": prompt}
        ]
    )
    return response.choices[0].message['content'].strip().split('\n')

def enrich_words(words):
    enriched = {
        'original': words,
        'synonyms': [],
        'antonyms': [],
        'related_nouns': []
    }
    
    for word in words:
        synsets = wordnet.synsets(word)
        for syn in synsets:
            enriched['synonyms'].extend([lemma.name() for lemma in syn.lemmas()])
            enriched['antonyms'].extend([lemma.name() for lemma in syn.lemmas() for ant in lemma.antonyms()])
            enriched['related_nouns'].extend([hyp.name().split('.')[0] for hyp in syn.hyponyms() + syn.hypernyms() if hyp.pos() == 'n'])
    
    # Remove duplicates and original words from enriched lists
    for key in ['synonyms', 'antonyms', 'related_nouns']:
        enriched[key] = list(set(enriched[key]) - set(words))
    
    return enriched

@app.route('/process-input', methods=['POST'])
def process_input():
    data = request.json
    user_id = data.get('user_id')
    creator_text = data.get('creator_text', '')
    content_text = data.get('content_text', '')
    
    creator_words = parse_text(creator_text)
    content_words = parse_text(content_text)
    
    meta_creator = enrich_words(creator_words)
    meta_content = enrich_words(content_words)
    
    session = Session()
    user_metadata = session.query(UserMetadata).filter_by(user_id=user_id).first()
    
    if user_metadata:
        user_metadata.meta_creator = meta_creator
        user_metadata.meta_content = meta_content
    else:
        new_metadata = UserMetadata(user_id=user_id, meta_creator=meta_creator, meta_content=meta_content)
        session.add(new_metadata)
    
    session.commit()
    session.close()
    
    return jsonify({
        "meta_creator": meta_creator,
        "meta_content": meta_content
    })

@app.route('/generate-ideas', methods=['POST'])
def generate_ideas():
    data = request.json
    user_id = data.get('user_id')
    trending_word = data.get('trendingWord')
    
    session = Session()
    user_metadata = session.query(UserMetadata).filter_by(user_id=user_id).first()
    session.close()
    
    if not user_metadata:
        return jsonify({"error": "User metadata not found"}), 404
    
    prompt = f"""Generate 5 unique content ideas related to '{trending_word}' considering the following:
    Creator context: {', '.join(user_metadata.meta_creator['original'])}
    Content themes: {', '.join(user_metadata.meta_content['original'])}
    Each idea should have a different perspective (e.g., educational, humorous, emotional, factual) and incorporate elements from both the creator context and content themes."""

    try:
        response = openai.ChatCompletion.create(
            model="gpt-4",
            messages=[
                {"role": "system", "content": "You are a creative content idea generator."},
                {"role": "user", "content": prompt}
            ]
        )
        ideas = response.choices[0].message['content'].strip().split('\n')
        return jsonify({"ideas": ideas})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)