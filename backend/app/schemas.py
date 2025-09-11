from pydantic import BaseModel, Field, EmailStr, validator
from typing import Optional
from datetime import date, datetime

# 유저 스키마

# User 모델 기본 필드
class UserBase(BaseModel):
    # 이름
    name : str = Field(..., example="홍길동")
    # 생년월일 : YYYYMMDD 형식
    birthdate : date = Field(..., min_length=8, max_length=8, example="19970914")
    # 성별 : 남자, 여자
    gender : str = Field(..., example="남자")
    # 이메일
    email : str = Field(..., example="user@example.com")
    # 연락처 : 01012345678 형식 (11자리)
    phone : str = Field(..., example="01012345678")
    # 집 주소
    address : str = Field(..., example = "서울시 강남구 테헤란로")
    # 관심사 : 데이트, 회식, 가족모임 등 
    interests : Optional[str] = Field(None, example="데이트, 회식, 가족모임")
    # 알러지 여부
    allergies : Optional[str] = Field(None, example = "땅콩, 새우")
    # 비밀번호 설정
    password : str = Field(..., min_length=8, max_length=20, example= "1q2w3e4r!")
    
    # birthdate 필드에 대한 유효성 검사기 (validator)
    @validator('birthdate')
    def validate_birthdate(cls, v):
        try:
            # YYYYMMDD 형식의 문자열을 실제 객체로 변환
            datetime.strptime(v, '%Y%m%d').date()
        except ValueError:
            raise ValueError('생년월일은 YYYYMMDD 형식이어야 합니다.')
        return v
    
# API 응답으로 보낼 사용자 정보 형식 정의 (비밀번호 제외)
class User(BaseModel):
    id : str
    name : str
    email : EmailStr
    phone : str
    address : str
    interests : Optional[str]
    allergies : Optional[str]
    is_verified : bool
    
    class Config : 
        orm_mode=True

# 나머지 스키마
class RestaurantBase(BaseModel):
    name: str
    address: str
    summary : Optional[str] = None # 가게 요약 정보
    category : Optional[str] = None # 가게 카테고리
    phone : Optional[str] = None # 가게 연락처
    opening_hours : Optional[str] = None # 가게 영업시간
    menu : Optional[str] = None # 가게 메뉴
    price_range : Optional[str] = None # 가게 가격대
    parking : Optional[bool] = None # 주차 가능 여부
    website : Optional[str] = None # 가게 웹사이트
    image_url : Optional[str] = None # 가게 이미지 URL
    is_favorite : Optional[bool] = None # 즐겨찾기 여부
    view_count : int = Field(default=0) # 조회수
    like_count : int = Field(default=0) # 좋아요 수
    dislike_count : int = Field(default=0) # 싫어요 수
    bookmark_count : int = Field(default=0) # 북마크 수
    comment_count : int = Field(default=0) # 댓글 수
    share_count : int = Field(default=0) # 공유 수

class Restaurant(RestaurantBase):
    id: int
    class Config: 
        orm_mode = True