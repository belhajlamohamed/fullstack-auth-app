from pydantic import BaseModel

class CycleOut(BaseModel):
    id: int
    name: str
    class Config:
        from_attributes = True

class LevelOut(BaseModel):
    id: int
    name: str
    cycle_id: int
    class Config:
        from_attributes = True

class FiliereOut(BaseModel):
    id: int
    name: str
    level_id: int
    class Config:
        from_attributes = True