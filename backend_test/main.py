# backend_test/main.py
import json
from typing import List
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from pathlib import Path
from datetime import datetime

# JSON 파일 경로 설정
FILE_PATH = Path("search_logs.json")

# FastAPI 앱 인스턴스 생성
app = FastAPI()

# Pydantic 모델 정의
# 프론트엔드에서 보낼 데이터의 형식을 정의합니다.
class SearchQuery(BaseModel):
    query: str


# API 엔드포인트: 검색어 저장 (POST)
@app.post("/search-log")
def add_search_log(search_query: SearchQuery):
    """
    프론트엔드로부터 검색어를 받아 JSON 파일에 저장합니다.
    """
    try:
        # 파일이 없으면 빈 리스트로 초기화, 있으면 기존 데이터를 불러옵니다.
        if not FILE_PATH.exists() or FILE_PATH.stat().st_size == 0:
            data = []
        else:
            with open(FILE_PATH, "r", encoding="utf-8") as f:
                data = json.load(f)

        # 새로운 검색어 데이터 생성 (타임스탬프 포함)
        new_entry = {
            "query": search_query.query,
            "timestamp": datetime.now().isoformat(),
        }

        # 데이터에 새 항목을 추가
        data.append(new_entry)

        # 업데이트된 데이터를 JSON 파일에 덮어씁니다.
        with open(FILE_PATH, "w", encoding="utf-8") as f:
            json.dump(data, f, indent=4, ensure_ascii=False)

        print(f"새로운 검색어가 성공적으로 저장되었습니다: {search_query.query}")
        return {"message": "검색어가 성공적으로 저장되었습니다."}

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"파일 저장 중 오류 발생: {e}")
