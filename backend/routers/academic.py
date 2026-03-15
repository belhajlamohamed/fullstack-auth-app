from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from database import get_db
import models
import schemas

router = APIRouter(
    prefix="/academic",
    tags=["Academic Structure"]
)

# --- ROUTES POUR LES CYCLES ---
@router.get("/cycles", response_model=List[schemas.CycleOut])
def get_cycles(db: Session = Depends(get_db)):
    return db.query(models.Cycle).all()

# --- ROUTES POUR LES NIVEAUX (LEVELS) ---
@router.get("/levels", response_model=List[schemas.LevelOut])
def get_levels(db: Session = Depends(get_db)):
    """Retourne tous les niveaux (L1, L2, L3, etc.)"""
    return db.query(models.Level).all()

@router.get("/cycles/{cycle_id}/levels", response_model=List[schemas.LevelOut])
def get_levels_by_cycle(cycle_id: int, db: Session = Depends(get_db)):
    """Retourne les niveaux liés à un cycle spécifique"""
    return db.query(models.Level).filter(models.Level.cycle_id == cycle_id).all()

# --- ROUTES POUR LES FILIÈRES ---
@router.get("/filieres", response_model=List[schemas.FiliereOut])
def get_filieres(db: Session = Depends(get_db)):
    """Retourne toutes les filières existantes"""
    return db.query(models.Filiere).all()

@router.get("/levels/{level_id}/filieres", response_model=List[schemas.FiliereOut])
def get_filieres_by_level(level_id: int, db: Session = Depends(get_db)):
    """Retourne les filières disponibles pour un niveau donné"""
    return db.query(models.Filiere).filter(models.Filiere.level_id == level_id).all()