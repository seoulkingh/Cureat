import os
import requests
import google.generativeai as genai
from dotenv import load_dotenv

# .env 파일에서 환경변수 로드

# API Key 및 모델 설정
# Gemini API 설정
genai.configure(api_key=os.getenv("GENAI_API_KEY"))
# Naver API 설정
NAVER_CLIENT_ID = os.getenv("NAVER_CLIENT_ID")
NAVER_CLIENT_SECRET = os.getenv("NAVER_CLIENT_SECRET")

# 사용할 Gemini 모델 객체 생성
gemini_model = genai.Model.get("gemini-1.5-flash")

# 외부 API 호출 함수
def call_naver_api(url: str, params: dict = None, headers: dict =None):
    """네이버 API 호출 함수"""
    try: 
        response = requests.get(url,params=params, headers=headers) # API 호출
        response.raise_for_status() # 200 OK가 아니면 예외 발생
        return response.json() # JSON 응답 반환
    except requests.exceptions.RequestException as e:
        print(f"네이버 API 호출중 오류 발생: {url}, 오류: {e}")
        return None
    
def verify_place_with_naver(place_name: str):
    """네이버 '검색(Local Search)' API로 장소를 검증합니다.
    (백엔드에서 Dynamic Map 대신 사용하는 데이터 확인용)
    """
    # 이전 답변에서 제공한 네이버 검색 API 호출 코드
    url = "https://openapi.naver.com/v1/search/local.json"
    params = {"query": place_name, "display": 1} # display: 최대 1개 결과만 요청
    headers = {
        "X-Naver-Client-Id": NAVER_CLIENT_ID,
        "X-Naver-Client-Secret": NAVER_CLIENT_SECRET
    }
    # API 호출
    data = call_naver_api(url, params=params, headers=headers)
    if data and data.get("items"):
        return data["items"][0] # 첫번째 결과 반환
    return None

def geocode_address_with_naver(address: str):
    """네이버 'Geocoding' API로 텍스트 주소를 좌표로 반환"""
    url = "https://naveropenapi.apigw.ntruss.com/map-geocode/v2/geocode"
    params = {'query': address}
    headers = {
        "X-NCP-APIGW-API-KEY-ID": NAVER_CLIENT_ID,
        "X-NCP-APIGW-API-KEY": NAVER_CLIENT_SECRET
    }
    data = call_naver_api(url, params, headers)
    if data and data.get("addresses"):
        lon = data['addresses'][0].get('x') # 경도
        lat = data['addresses'][0].get('y') # 위도
        return f"{lon},{lat}"
    return None

def get_directions_from_naver(start_address: str, gool_coords: str):
    """네이버 'Directions 5' API로 경로를 탐색합니다."""
    start_coords = geocode_address_with_naver(start_address)
    if not start_coords:
        return {"error": "출발지 주소를 좌표로 반환할 수 없습니다."}

    url = "https://naveropenapi.apigw.ntruss.com/map-direction/v1/driving"
    