from sqlalchemy import Column, Integer, String, JSON, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from database import Base
import datetime

class Course(Base):
    __tablename__ = "courses"
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    description = Column(String, nullable=True)
    
    # Stockage du contenu (MathLive, texte, etc.)
    content = Column(JSON, nullable=True) 
    
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    
    # Relations
    subject_id = Column(Integer, ForeignKey("subjects.id"))
    teacher_id = Column(Integer, ForeignKey("users.id"))
    
    subject = relationship("Subject", backref="courses")
    teacher = relationship("User", backref="created_courses")