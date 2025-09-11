# backend/app/models.py
# SQLAlchemy 모델 정의
from sqlalchemy import Column, Integer, String, Text, ForeignKey, Date, Boolean, DateTime
from sqlalchemy.orm import relationship # SQLAlchemy 관계
from sqlalchemy.sql import func # SQLAlchemy 함수
from database import Base # SQLAlchemy Base 가져오기

class User(Base): # User 모델 정의
    __tablename__ = "users" # 테이블 이름
    
    id = Column(Integer, primary_key=True, index=True) # 사용자 ID
    
    # 기본 정보
    name = Column(String, nullable=False) # 이름
    birthdate = Column(Date, nullable=True) # 생년월일
    email = Column(String, unique=True, index=True, nullable=False) # 이메일
    phone = Column(String, nullable=False, unique=True) # 전화번호
    address = Column(String, nullable=False) # 주소
    hashed_password = Column(String, nullable=False) # 해시된 비밀번호
    
    # 개인화 정보
    interest = Column(String, nullable=True) # 관심사
    allergies = Column(String, nullable=True) # 알레르기 정보
    allergies_detail = Column(String, nullable=True) # 알레르기 상세 정보
    
    # 계정 상태
    is_active = Column(Boolean, default=True) # 활성화 여부
    is_verified = Column(Boolean, default=True) # 이메일 인증 여부
    
    # 관계 설정
    search_logs = relationship("SearchLog", back_populates="user") # 검색 로그
    reviews = relationship("Review", back_populates="user") # 리뷰

# 나머지 모델 정의는 동일
class Restaurant(Base):
    __tablename__ = "restaurants"
    id = Column(Integer, primary_key=True, index=False)
    name = Column(String, index=True, nullable=False) # 음식점 이름
    address = Column(String, nullable=False) # 음식점 주소
    summary = Column(String, nullable=True) # 음식점 요약 정보
    category = Column(String, nullable=False) # 음식점 카테고리
    phone = Column(String, nullable=False) # 음식점 연락처
    opening_hours = Column(String, nullable=False) # 영업 시간
    menu = Column(Text, nullable=True) # 메뉴 정보
    price_range = Column(String, nullable=False) # 가격대
    parking = Column(Boolean, default=False) # 주차 가능 여부
    website = Column(String, nullable=True) # 웹사이트 URL
    image_url = Column(String, nullable=True) # 이미지 URL
    is_favorite = Column(Boolean, default=True) # 즐겨찾기 여부
    view_count = Column(Integer, default=0) # 조회수
    like_count = Column(Integer, default=0) # 좋아요 수
    dislike_count = Column(Integer, default=0) # 싫어요 수
    bookmark_count = Column(Integer, default=0) # 북마크 수
    comment_count = Column(Integer, default=0) # 댓글 수
    share_count = Column(Integer, default=0) # 공유 수
    is_favorite_count = Column(Integer, default=0) # 즐겨찾기 수
    
    reviews = relationship("Review", back_populates="restaurant") # 리뷰
    
class Review(Base): 
    __tablename__ = "reviews"
    id = Column(Integer, primary_key=True, index=True) # 리뷰 ID
    user_id = Column(Integer, ForeignKey("users.id")) # 사용자 ID
    restaurant_id = Column(Integer, ForeignKey("restaurants.id")) # 음식점 ID
    content = Column(Text, nullable=False) # 리뷰 내용
    rating = Column(Integer, nullable=False) # 평점
    user = relationship("User", back_populates="reviews") # 사용자와의 관계
    restaurant = relationship("Restaurant", back_populates="reviews") # 음식점과의 관계
    
class SearchLog(Base):
    __tablename__ = "search_logs"
    id = Column(Integer, primary_key=True, index=True) # 검색 로그 ID
    user_id = Column(Integer, ForeignKey("users.id")) # 사용자 ID
    query = Column(String, nullable=False) # 검색어
    timestamp = Column(DateTime(timezone=True), server_default=func.now()) # 검색 시간
    user = relationship("User", back_populates="search_logs") # 사용자와의 관계
    
