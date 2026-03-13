from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship
from database import Base

class Level(Base):
    __tablename__ = "levels"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False) # ex: "2ème Année Bac"
    
    cycle_id = Column(Integer, ForeignKey("cycles.id", ondelete="CASCADE"))
    
    cycle = relationship("Cycle", back_populates="levels")
    filieres = relationship("Filiere", back_populates="level", cascade="all, delete-orphan")
    # Pour lier directement un utilisateur à son niveau
    # users = relationship("User", backref="level")
    users = relationship("User", back_populates="level")