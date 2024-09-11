from sqlalchemy import create_engine, Column, Integer, String, JSON
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
import os
from dotenv import load_dotenv

load_dotenv()

Base = declarative_base()

class User(Base):
    __tablename__ = 'users'
    id = Column(Integer, primary_key=True)
    email = Column(String, unique=True, nullable=False)
    password = Column(String, nullable=False)

class UserMetadata(Base):
    __tablename__ = 'user_metadata'
    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, unique=True)
    meta_creator = Column(JSON)
    meta_content = Column(JSON)

class DatabaseService:
    def __init__(self):
        db_user = os.getenv('DB_USER')
        db_password = os.getenv('DB_PASSWORD')
        db_host = os.getenv('DB_HOST')
        db_name = os.getenv('DB_NAME')

        if not all([db_user, db_password, db_host, db_name]):
            raise ValueError("Database configuration is incomplete. Please check your .env file.")

        DATABASE_URL = f"postgresql://{db_user}:{db_password}@{db_host}/{db_name}"
        self.engine = create_engine(DATABASE_URL)
        self.Session = sessionmaker(bind=self.engine)
        
        try:
            Base.metadata.create_all(self.engine)
        except Exception as e:
            print(f"Error creating database tables: {e}")
            raise

    def create_user(self, email, hashed_password):
        session = self.Session()
        new_user = User(email=email, password=hashed_password)
        session.add(new_user)
        session.commit()
        user_id = new_user.id
        session.close()
        return user_id

    def get_user_by_email(self, email):
        session = self.Session()
        user = session.query(User).filter_by(email=email).first()
        session.close()
        return user.__dict__ if user else None

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