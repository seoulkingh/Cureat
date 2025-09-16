import json
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from pathlib import Path
from datetime import datetime

# 파일 경로 설정
SEARCH_LOGS_FILE = Path("search_logs.json")
SEARCH_RESULTS_FILE = Path("search_results.json")

app = FastAPI()

# CORS 설정
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

# 새로운 엔드포인트: 모든 검색 결과를 반환 (GET)
@app.get("/search-results")
def get_search_results():
    """
    JSON 파일에서 모든 검색 결과를 불러와 반환합니다.
    """
    try:
        with open(SEARCH_RESULTS_FILE, "r", encoding="utf-8") as f:
            data = json.load(f)
        return data
    except FileNotFoundError:
        raise HTTPException(status_code=404, detail="검색 결과를 찾을 수 없습니다.")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"파일 로드 중 오류 발생: {e}")

# 기존 엔드포인트: 검색어 저장 (POST)
@app.post("/search-log")
def add_search_log(search_query: SearchQuery):
    """
    프론트엔드로부터 검색어를 받아 JSON 파일에 저장합니다.
    """
    try:
        if not SEARCH_LOGS_FILE.exists() or SEARCH_LOGS_FILE.stat().st_size == 0:
            data = []
        else:
            with open(SEARCH_LOGS_FILE, "r", encoding="utf-8") as f:
                data = json.load(f)

        new_entry = {
            "query": search_query.query,
            "timestamp": datetime.now().isoformat(),
        }

        data.append(new_entry)

        with open(SEARCH_LOGS_FILE, "w", encoding="utf-8") as f:
            json.dump(data, f, indent=4, ensure_ascii=False)

        print(f"INFO: 새로운 검색어가 성공적으로 저장되었습니다: {search_query.query}")
        return {"message": "검색어가 성공적으로 저장되었습니다."}

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"파일 저장 중 오류 발생: {e}")