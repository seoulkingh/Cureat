from sqlalchemy.orm import Session
from backend import db
from . import models, schemas
from passlib.context import CryptContext
from datetime import datetime

# 비밀번호 해싱 설정
# bcrypt 해싱 알고리즘 사용
# deprecated="auto" 옵션은 이전에 사용되던 해싱 알고리즘을 자동으로 감지하여 처리
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto") 

def verify_password(plain_password, hashed_password): # 비밀번호 검증 함수
    return pwd_context.verify(plain_password, hashed_password) # 평문 비밀번호와 해시된 비밀번호 비교

def get_password_hash(password): # 비밀번호 해싱 함수
    return pwd_context.hash(password) # 평문 비밀번호를 해시로 변환

# 유저 관련 CRUD 함수
def create_user(db: Session, user: schemas.UserBase):
    # 이메일로 사용자 조회
    return db.query(models.User).filter(models.User.email == user.email).first()

# 새로운 필드와 비밀번호 해싱, 생년월일, 변환 포함하여 사용자 생성
def create_user(db: Session, user: schemas.UserCreate):
    hashed_password = get_password_hash(user.password) # 비밀번호 해싱
    # 문자열 생년월일을 date 객체로 변환
    birthdate_obj = datetime.strptime(user.birthdate, '%Y%m%d').date()
    
    # 데이터베이스 모델 객체 생성
    db_user = models.User(
        name=user.name,
        birthdate=birthdate_obj,
        email=user.email,
        phone=user.phone,
        address=user.address,
        interests=user.interests,
        allergies=user.allergies,
        allergies_detail=user.allergies_detail,
        hashed_password=hashed_password
    )
    
    db.add(db_user) # 세션에 추가
    db.commit() # 변경사항 커밋
    db.refresh(db_user) # 새로 생성된 사용자 정보 갱신
    return db_user # 생성된 사용자 반환