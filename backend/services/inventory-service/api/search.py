from fastapi import APIRouter
from fastapi import Depends

from sqlalchemy.orm import Session

from db.database import SessionLocal
from models.search_index import SearchIndex

router = APIRouter(
    prefix="/search",
    tags=["Search"]
)

def get_db():

    db = SessionLocal()

    try:
        yield db

    finally:
        db.close()

@router.get("")
def global_search(
    q: str,
    db: Session = Depends(get_db)
):

    results = (
        db.query(SearchIndex)
        .filter(
            SearchIndex.search_text.ilike(
                f"%{q}%"
            )
        )
        .limit(20)
        .all()
    )

    return {
        "status": "success",
        "data": [
            {
                "entity_type": r.entity_type,
                "entity_name": r.entity_name,
                "entity_code": r.entity_code,
                "url": r.url
            }
            for r in results
        ]
    }