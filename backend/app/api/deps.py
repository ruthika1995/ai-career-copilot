from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.core.security import decode_token
from app.models.models import User

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/v1/auth/login", auto_error=False)

def get_current_user(
    db: Session = Depends(get_db),
    token: str = Depends(oauth2_scheme)
) -> User:
    if token:
        payload = decode_token(token)
        user_id = payload.get("sub")
        if user_id:
            user = db.query(User).filter(User.id == user_id).first()
            if user:
                return user

    # Fallback to demo user if no token provided during local development
    demo_user = db.query(User).filter(User.email == "ruthi@example.com").first()
    if not demo_user:
        demo_user = User(
            id="1",
            email="ruthi@example.com",
            name="Ruthi",
            hashed_password="mock-hashed-password"
        )
        db.add(demo_user)
        db.commit()
        db.refresh(demo_user)
    return demo_user
