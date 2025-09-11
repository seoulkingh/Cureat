from pydantic import BaseModel, Field, EmailStr, validator # pydantic의 BaseModel, Field, EmailStr, validator 임포트
from typing import Optional # Optional 임포트
from datetime import date, datetime # date, datetime 임포트

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
    allergies : bool =Field(False)
    # 알러지 정보
    allergies_detail : Optional[str] = Field(None, example = "땅콩, 새우")
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
    id : str # 사용자 ID
    name : str # 사용자 이름
    birthdate : date # 사용자 생년월일
    email : EmailStr # 사용자 이메일
    phone : str # 사용자 전화번호
    address : str # 사용자 주소
    interests : Optional[str] # 사용자 관심사
    allergies : bool # 사용자 알레르기
    allergies_detail : Optional[str] # 사용자 알레르기 상세
    is_verified : bool # 사용자 이메일 인증 여부

    class Config : # Config 클래스
        orm_mode=True # ORM 모드 활성화

# 나머지 스키마
class RestaurantBase(BaseModel): # 가게 기본 필드
    name: str # 가게 이름
    address: str # 가게 주소
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
    is_favorite_count : int = Field(default=0) # 즐겨찾기 수

class Restaurant(RestaurantBase): # 가게 응답 필드
    id: int # 가게 ID
    class Config: # Config 클래스
        orm_mode = True # ORM 모드 활성화