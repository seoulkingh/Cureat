# backend_test/main.py
import json
import sqlite3
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from datetime import datetime

# 데이터베이스 파일 경로 설정
DATABASE_FILE = "search_logs.db"
SEARCH_RESULTS_FILE = "restaurant_recommendations.json"

# FastAPI 앱 인스턴스 생성
app = FastAPI()

# CORS 설정 (모든 출처 허용)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Pydantic 모델
class SearchQuery(BaseModel):
    query: str

# 임시 사용자 ID (나중에 실제 로그인 시스템으로 교체)
GLOBAL_USER_ID = "user_abc_123"

# 데이터베이스 연결 및 테이블 생성 함수
def create_table_if_not_exists():
    """
    search_logs.db에 users_search_logs 테이블이 없으면 생성합니다.
    """
    conn = sqlite3.connect(DATABASE_FILE)
    cursor = conn.cursor()
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS users_search_logs (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id TEXT NOT NULL,
            query TEXT NOT NULL,
            timestamp TEXT NOT NULL
        )
    """)
    conn.commit()
    conn.close()

# 애플리케이션 시작 시 데이터베이스 테이블 생성
@app.on_event("startup")
def startup_event():
    create_table_if_not_exists()
    print("INFO: 데이터베이스 테이블이 준비되었습니다.")

# API 엔드포인트: 검색어 저장 (POST)
@app.post("/search-log")
def add_search_log(search_query: SearchQuery):
    """
    프론트엔드로부터 받은 검색어를 SQLite DB에 저장합니다.
    """
    try:
        conn = sqlite3.connect(DATABASE_FILE)
        cursor = conn.cursor()

        timestamp = datetime.now().isoformat()
        
        cursor.execute("""
            INSERT INTO users_search_logs (user_id, query, timestamp)
            VALUES (?, ?, ?)
        """, (GLOBAL_USER_ID, search_query.query, timestamp))
        
        conn.commit()
        conn.close()

        print(f"INFO: '{GLOBAL_USER_ID}' 사용자의 검색어 '{search_query.query}'가 DB에 성공적으로 저장되었습니다.")
        return {"message": "검색어가 성공적으로 저장되었습니다."}

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"DB 저장 중 오류 발생: {e}")

# API 엔드포인트: 검색 결과 반환 (GET)
@app.get("/restaurant_recommendations")
def get_search_results():
    """
    JSON 파일에서 모든 검색 결과를 불러와 반환합니다.
    """
    try:
        with open(SEARCH_RESULTS_FILE, "r", encoding="utf-8") as f:
            # 파일을 JSON 객체로 로드합니다.
            data = json.load(f) 
        return data
    except FileNotFoundError:
        raise HTTPException(status_code=404, detail="검색 결과를 찾을 수 없습니다.")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"파일 로드 중 오류 발생: {e}")