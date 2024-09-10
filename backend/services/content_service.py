from flask import jsonify
import openai
import nltk
from nltk.corpus import wordnet

class ContentService:
    def __init__(self, db_service):
        self.db_service = db_service
        nltk.download('wordnet')

    def process_input(self, data):
        user_id = data.get('user_id')
        creator_text = data.get('creator_text', '')
        content_text = data.get('content_text', '')
        
        creator_words = self._parse_text(creator_text)
        content_words = self._parse_text(content_text)
        
        meta_creator = self._enrich_words(creator_words)
        meta_content = self._enrich_words(content_words)
        
        self.db_service.update_user_metadata(user_id, meta_creator, meta_content)
        
        return jsonify({
            "meta_creator": meta_creator,
            "meta_content": meta_content
        })

    def generate_ideas(self, data):
        user_id = data.get('user_id')
        trending_word = data.get('trendingWord')
        
        user_metadata = self.db_service.get_user_metadata(user_id)
        
        if not user_metadata:
            return jsonify({"error": "User metadata not found"}), 404
        
        prompt = f"""Generate 5 unique content ideas related to '{trending_word}' considering the following:
        Creator context: {', '.join(user_metadata['meta_creator']['original'])}
        Content themes: {', '.join(user_metadata['meta_content']['original'])}
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

    def _parse_text(self, text):
        prompt = f"Based on the following text, generate a comprehensive set of relevant words and phrases:\n\n{text}\n\nGenerate words:"
        response = openai.ChatCompletion.create(
            model="gpt-4",
            messages=[
                {"role": "system", "content": "You are a helpful assistant that generates relevant words and phrases based on given text."},
                {"role": "user", "content": prompt}
            ]
        )
        return response.choices[0].message['content'].strip().split('\n')

    def _enrich_words(self, words):
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