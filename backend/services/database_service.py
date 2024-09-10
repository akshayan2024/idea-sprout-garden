from sqlalchemy import create_engine, Column, Integer, String, JSON
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
import os

Base = declarative_base()

class UserMetadata(Base):
    __tablename__ = 'user_metadata'
    id = Column(Integer, primary_key=True)
    user_id = Column(String, unique=True)
    meta_creator = Column(JSON)
    meta_content = Column(JSON)

class DatabaseService:
    def __init__(self):
        DATABASE_URL = f"postgresql://{os.getenv('DB_USER')}:{os.getenv('DB_PASSWORD')}@{os.getenv('DB_HOST')}/{os.getenv('DB_NAME')}"
        self.engine = create_engine(DATABASE_URL)
        self.Session = sessionmaker(bind=self.engine)
        Base.metadata.create_all(self.engine)

    def update_user_metadata(self, user_id, meta_creator, meta_content):
        session = self.Session()
        user_metadata = session.query(UserMetadata).filter_by(user_id=user_id).first()
        
        if user_metadata:
            user_metadata.meta_creator = meta_creator
            user_metadata.meta_content = meta_content
        else:
            new_metadata = UserMetadata(user_id=user_id, meta_creator=meta_creator, meta_content=meta_content)
            session.add(new_metadata)
        
        session.commit()
        session.close()

    def get_user_metadata(self, user_id):
        session = self.Session()
        user_metadata = session.query(UserMetadata).filter_by(user_id=user_id).first()
        session.close()
        
        if user_metadata:
            return {
                "meta_creator": user_metadata.meta_creator,
                "meta_content": user_metadata.meta_content
            }
        return None