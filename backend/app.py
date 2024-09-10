from flask import Flask, request, jsonify
from flask_cors import CORS
import openai
from sqlalchemy import create_engine, Column, Integer, String, JSON
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
import nltk
from nltk.corpus import wordnet
import os
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}}, supports_credentials=True)

nltk.download('wordnet')

openai.api_key = os.getenv('OPENAI_API_KEY')

DATABASE_URL = f"postgresql://{os.getenv('DB_USER')}:{os.getenv('DB_PASSWORD')}@{os.getenv('DB_HOST')}/{os.getenv('DB_NAME')}"
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

    response = openai.ChatCompletion.create(
        model="gpt-4",
        messages=[
            {"role": "system", "content": "You are a creative content idea generator."},
            {"role": "user", "content": prompt}
        ]
    )
    ideas = response.choices[0].message['content'].strip().split('\n')
    return jsonify({"ideas": ideas})

@app.route('/check-session', methods=['GET'])
def check_session():
    # This is a placeholder. In a real application, you'd check the session or token
    # and return the user's profile if they're authenticated.
    return jsonify({
        "isAuthenticated": True,
        "profile": {
            "name": "John Doe",
            "email": "john@example.com",
            "avatarUrl": "https://example.com/avatar.jpg"
        }
    })

@app.route('/login', methods=['POST'])
def login():
    # This is a placeholder. In a real application, you'd validate credentials
    # and create a session or token.
    return jsonify({
        "name": "John Doe",
        "email": "john@example.com",
        "avatarUrl": "https://example.com/avatar.jpg"
    })

@app.route('/logout', methods=['POST'])
def logout():
    # This is a placeholder. In a real application, you'd invalidate the session or token.
    return jsonify({"message": "Logged out successfully"})

if __name__ == '__main__':
    app.run(debug=True)