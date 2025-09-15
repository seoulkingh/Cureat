from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy.orm import Session
from . import crud, models, schemas, service
from .database import engine, get_db

# 애플리케이션 시작 시, PostgreSQL에 테이블들을 생성합니다.
models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="Cureat API", description="AI 기반 맛집 추천 및 코스 생성 서비스")

@app.get("/", tags=["Root"])
def read_root():
    """서버가 정상적으로 실행 중인지 확인하는 기본 경로입니다."""
    return {"message": "Cureat API 서버에 오신 것을 환영합니다!"}

# --- User & Auth ---
@app.post("/users/signup", response_model=schemas.User, tags=["User"])
def signup_user(user: schemas.UserCreate, db: Session = Depends(get_db)):
    db_user = crud.get_user_by_email(db, email=user.email)
    if db_user:
        raise HTTPException(status_code=400, detail="이미 등록된 이메일입니다.")
    new_user = crud.create_user(db=db, user=user)
    # (향후 이메일 인증 메일 발송 로직 추가)
    return new_user

# --- Recommendations & Course ---
@app.post("/recommendations", response_model=schemas.RecommendationResponse, tags=["Recommendation"])
def get_recommendations(request: schemas.ChatRequest, db: Session = Depends(get_db)):
    user = crud.get_user_by_id(db, user_id=request.user_id)
    if not user:
        raise HTTPException(status_code=404, detail="사용자를 찾을 수 없습니다.")
    
    recommendation_data = service.get_personalized_recommendation(db, request, user)
    crud.create_search_log(db, user_id=user.id, query=request.prompt)
    return recommendation_data

@app.post("/date-course", response_model=schemas.CourseResponse, tags=["Date Course"])
def create_date_course_api(request: schemas.CourseRequest, db: Session = Depends(get_db)):
    user = crud.get_user_by_id(db, user_id=request.user_id)
    if not user:
        raise HTTPException(status_code=404, detail="사용자를 찾을 수 없습니다.")
    
    course_data = service.create_date_course(db, request, user)
    return course_data

# --- Reviews (in PostgreSQL) ---
@app.post("/reviews", response_model=schemas.Review, tags=["Review"])
def write_review(review: schemas.ReviewCreate, db: Session = Depends(get_db)):
    # 리뷰 작성을 위해 PostgreSQL에 저장된 맛집 정보 조회
    # (실제 구현 시, 프론트에서 name, address를 받아 restaurant_id를 찾아야 함)
    restaurant = crud.get_or_create_restaurant_in_postgres(db, name="리뷰 대상 맛집 이름", address="리뷰 대상 맛집 주소")
    review.restaurant_id = restaurant.id
    
    return crud.create_review(db=db, review=review)