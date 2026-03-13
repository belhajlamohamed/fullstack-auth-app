from sqlalchemy import Column, Integer, String
from sqlalchemy.orm import relationship
from database import Base

class Cycle(Base):
    __tablename__ = "cycles"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, nullable=False) # ex: "Lycée"

    levels = relationship("Level", back_populates="cycle", cascade="all, delete-orphan")