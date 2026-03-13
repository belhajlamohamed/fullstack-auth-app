from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship
from database import Base

class Filiere(Base):
    __tablename__ = "filieres"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False) # ex: "Sciences Physiques"
    
    level_id = Column(Integer, ForeignKey("levels.id", ondelete="CASCADE"))
    
    level = relationship("Level", back_populates="filieres")
    # Une filière contient plusieurs matières (Matière = Subject dans ton code)
    subjects = relationship("Subject", backref="filiere")
    # users = relationship("User", backref="filiere")
    users = relationship("User", back_populates="filiere")