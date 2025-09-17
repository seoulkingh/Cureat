import requests
import json
import os
import logging
from typing import Dict, Any, List, Optional
from datetime import datetime
from dotenv import load_dotenv
from bs4 import BeautifulSoup
from readability import Document
import google.generativeai as genai

# 환경 변수 로드
load_dotenv()

# API 키 설정
KAKAO_REST_KEY = os.getenv('KAKAO_REST_KEY')
GOOGLE_API_KEY = os.getenv('GOOGLE_API_KEY')

# Gemini AI 설정
genai.configure(api_key=GOOGLE_API_KEY)
model = genai.GenerativeModel('gemini-1.5-flash')

# 로깅 설정
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')

class RestaurantCrawler:
    def __init__(self):
        self.session = requests.Session()
        self.session.headers.update({
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"
        })
        
    def kakao_search_local(self, query: str, size: int = 10) -> List[Dict[str, Any]]:
        """카카오 지역 검색 API로 맛집 검색"""
        if not KAKAO_REST_KEY:
            logging.error("카카오 API 키가 설정되지 않았습니다.")
            return []
            
        url = "https://dapi.kakao.com/v2/search/local.json"
        headers = {"Authorization": f"KakaoAK {KAKAO_REST_KEY}"}
        params = {
            "query": query,
            "size": size
        }
        
        try:
            response = self.session.get(url, headers=headers, params=params, timeout=10)
            if response.status_code == 200:
                data = response.json()
                documents = data.get('documents', [])
                logging.info(f"카카오 API: {len(documents)}개 맛집 찾음")
                return documents
            else:
                logging.error(f"카카오 API 오류: {response.status_code}")
                return []
        except Exception as e:
            logging.error(f"카카오 API 요청 오류: {e}")
            return []
    
    def kakao_search_web(self, query: str, size: int = 5) -> List[Dict[str, Any]]:
        """카카오 웹 검색 API로 리뷰 검색"""
        if not KAKAO_REST_KEY:
            return []
            
        url = "https://dapi.kakao.com/v2/search/web"
        headers = {"Authorization": f"KakaoAK {KAKAO_REST_KEY}"}
        params = {
            "query": f"{query} 리뷰 맛집",
            "size": size
        }
        
        try:
            response = self.session.get(url, headers=headers, params=params, timeout=10)
            if response.status_code == 200:
                data = response.json()
                documents = data.get('documents', [])
                logging.info(f"카카오 웹 검색: {len(documents)}개 리뷰 페이지 찾음")
                return documents
            else:
                logging.error(f"카카오 웹 검색 오류: {response.status_code}")
                return []
        except Exception as e:
            logging.error(f"카카오 웹 검색 요청 오류: {e}")
            return []
    
    def fetch_page_content(self, url: str) -> str:
        """웹페이지 내용 크롤링"""
        try:
            response = self.session.get(url, timeout=10)
            if response.status_code == 200:
                # Readability로 본문 추출
                doc = Document(response.text)
                soup = BeautifulSoup(doc.summary(), 'html.parser')
                text = soup.get_text()
                # 텍스트 정제
                lines = [line.strip() for line in text.split('\n') if line.strip()]
                clean_text = '\n'.join(lines)
                return clean_text[:2000]  # 2000자로 제한
            return ""
        except Exception as e:
            logging.warning(f"페이지 크롤링 실패 {url}: {e}")
            return ""
    
    def extract_reviews_from_content(self, content: str) -> List[str]:
        """크롤링한 내용에서 리뷰 추출"""
        if not content:
            return []
            
        # 리뷰 관련 키워드
        review_keywords = [
            "맛있", "추천", "별로", "최고", "불친절", "친절", 
            "가격", "가성비", "재방문", "웨이팅", "분위기", 
            "서비스", "음식", "맛", "후기"
        ]
        
        lines = content.split('\n')
        reviews = []
        
        for line in lines:
            line = line.strip()
            if len(line) > 20 and len(line) < 200:  # 적당한 길이
                if any(keyword in line for keyword in review_keywords):
                    reviews.append(line)
                    
        return reviews[:10]  # 최대 10개
    
    def analyze_with_gemini(self, restaurant_name: str, reviews: List[str]) -> Dict[str, Any]:
        """Gemini AI로 맛집 정보 상세 분석"""
        if not GOOGLE_API_KEY or not reviews:
            return {}
            
        reviews_text = '\n'.join(reviews)
        
        prompt = f"""
다음은 '{restaurant_name}' 맛집에 대한 리뷰들입니다:

{reviews_text}

위 리뷰들을 분석해서 다음 형식의 상세한 JSON으로 답변해주세요:

{{
    "restaurant_summary": {{
        "name": "{restaurant_name}",
        "category": "음식 카테고리 (예: 한식, 일식, 중식, 양식, 카페 등)",
        "overall_rating": 4.2,
        "price_range": "가격대 (예: 1만원 이하, 1-2만원, 2-3만원, 3만원 이상)",
        "recommended_for": ["데이트", "가족식사", "회식", "혼밥", "친구모임"] 중 적절한 것들
    }},
    "menu_info": {{
        "signature_dishes": ["대표메뉴1", "대표메뉴2", "대표메뉴3"],
        "popular_items": ["인기메뉴1", "인기메뉴2"],
        "menu_variety": "메뉴 다양성 평가",
        "taste_rating": 4.1
    }},
    "ambiance_service": {{
        "atmosphere": "분위기 상세 설명",
        "interior": "인테리어 특징",
        "service_quality": "서비스 품질 평가",
        "staff_friendliness": 4.0,
        "cleanliness": "청결도 평가"
    }},
    "practical_info": {{
        "parking": "주차 정보",
        "waiting_time": "대기시간 정보",
        "reservation": "예약 가능 여부",
        "opening_hours": "영업시간 정보 (있다면)",
        "best_time_to_visit": "방문 추천 시간대"
    }},
    "detailed_analysis": {{
        "pros": ["구체적인 장점1", "구체적인 장점2", "구체적인 장점3"],
        "cons": ["구체적인 단점1", "구체적인 단점2", "구체적인 단점3"],
        "keywords": ["특징키워드1", "특징키워드2", "특징키워드3", "특징키워드4", "특징키워드5"],
        "customer_types": "주요 고객층 분석",
        "revisit_intention": "재방문 의향 분석"
    }},
    "recommendation": {{
        "overall_recommendation": "전체적인 추천도 (5점 만점)",
        "target_audience": "추천 대상",
        "best_menu_combo": "추천 메뉴 조합",
        "visit_tips": "방문 팁"
    }}
}}

JSON 형식으로만 답변해주세요.
"""
        
        try:
            response = model.generate_content(prompt)
            response_text = response.text.strip()
            
            # JSON 추출
            start = response_text.find('{')
            end = response_text.rfind('}') + 1
            if start != -1 and end != 0:
                json_str = response_text[start:end]
                analysis = json.loads(json_str)
                logging.info(f"Gemini 분석 완료: {restaurant_name}")
                return analysis
            else:
                logging.warning("Gemini 응답에서 JSON을 찾을 수 없습니다.")
                return {}
                
        except Exception as e:
            logging.error(f"Gemini AI 분석 오류: {e}")
            return {}
    
    def crawl_restaurant(self, restaurant_name: str, location: str = "") -> Dict[str, Any]:
        """개별 맛집 크롤링 및 분석"""
        logging.info(f"맛집 크롤링 시작: {restaurant_name}")
        
        # 1. 카카오 지역 검색으로 기본 정보 수집
        search_query = f"{location} {restaurant_name}" if location else restaurant_name
        kakao_results = self.kakao_search_local(search_query, size=5)
        
        restaurant_info = {
            "name": restaurant_name,
            "search_query": search_query,
            "crawled_at": datetime.now().isoformat(),
            "kakao_basic_info": kakao_results[0] if kakao_results else {},
            "reviews": [],
            "analysis": {}
        }
        
        # 2. 카카오 웹 검색으로 리뷰 페이지 찾기
        web_results = self.kakao_search_web(search_query, size=10)
        
        all_reviews = []
        
        # 3. 각 웹페이지에서 리뷰 크롤링
        for web_result in web_results[:5]:  # 상위 5개 페이지만
            url = web_result.get('url', '')
            title = web_result.get('title', '')
            
            # 더 넓은 범위의 사이트에서 크롤링
            if any(site in url for site in ['blog.naver.com', 'tistory.com', 'kakao.com', 'daum.net', 'zum.com']):
                logging.info(f"크롤링 시도: {url}")
                content = self.fetch_page_content(url)
                if content:
                    page_reviews = self.extract_reviews_from_content(content)
                    logging.info(f"페이지에서 {len(page_reviews)}개 리뷰 추출")
                    for review in page_reviews:
                        all_reviews.append({
                            "text": review,
                            "source_url": url,
                            "source_title": title
                        })
        
        restaurant_info["reviews"] = all_reviews[:20]  # 최대 20개 리뷰
        
        # 4. Gemini AI로 분석
        if all_reviews:
            review_texts = [r["text"] for r in all_reviews]
            analysis = self.analyze_with_gemini(restaurant_name, review_texts)
            restaurant_info["analysis"] = analysis
        
        logging.info(f"맛집 크롤링 완료: {restaurant_name} ({len(all_reviews)}개 리뷰)")
        return restaurant_info
    
    def crawl_multiple_restaurants(self, restaurant_list: List[str], location: str = "강남") -> List[Dict[str, Any]]:
        """여러 맛집 크롤링"""
        results = []
        
        for restaurant in restaurant_list:
            try:
                result = self.crawl_restaurant(restaurant, location)
                results.append(result)
            except Exception as e:
                logging.error(f"맛집 크롤링 오류 {restaurant}: {e}")
                continue
                
        return results
    
    def save_to_json(self, data: List[Dict[str, Any]], filename: str = None):
        """결과를 JSON 파일로 저장"""
        if filename is None:
            timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
            filename = f"restaurant_crawling_{timestamp}.json"
        
        try:
            with open(filename, 'w', encoding='utf-8') as f:
                json.dump(data, f, ensure_ascii=False, indent=2)
            logging.info(f"결과 저장 완료: {filename}")
            return filename
        except Exception as e:
            logging.error(f"파일 저장 오류: {e}")
            return None


    def print_restaurant_summary(self, results: List[Dict[str, Any]]):
        """가게별 요약 정보 출력"""
        print("\n" + "="*80)
        print("🏪 맛집 크롤링 결과 요약")
        print("="*80)
        
        for i, result in enumerate(results, 1):
            name = result.get('name', '알 수 없음')
            review_count = len(result.get('reviews', []))
            analysis = result.get('analysis', {})
            
            print(f"\n📍 {i}. {name}")
            print("-" * 50)
            
            if analysis:
                restaurant_summary = analysis.get('restaurant_summary', {})
                menu_info = analysis.get('menu_info', {})
                detailed_analysis = analysis.get('detailed_analysis', {})
                recommendation = analysis.get('recommendation', {})
                
                # 기본 정보
                category = restaurant_summary.get('category', '정보 없음')
                rating = restaurant_summary.get('overall_rating', '정보 없음')
                price_range = restaurant_summary.get('price_range', '정보 없음')
                recommended_for = restaurant_summary.get('recommended_for', [])
                
                print(f"🍴 카테고리: {category}")
                print(f"⭐ 평점: {rating}")
                print(f"💰 가격대: {price_range}")
                print(f"👥 추천 대상: {', '.join(recommended_for) if recommended_for else '정보 없음'}")
                
                # 메뉴 정보
                signature_dishes = menu_info.get('signature_dishes', [])
                if signature_dishes:
                    print(f"🥘 대표메뉴: {', '.join(signature_dishes)}")
                
                # 장단점
                pros = detailed_analysis.get('pros', [])
                cons = detailed_analysis.get('cons', [])
                
                if pros:
                    print(f"✅ 장점: {', '.join(pros[:2])}")  # 상위 2개만
                if cons:
                    print(f"❌ 단점: {', '.join(cons[:2])}")  # 상위 2개만
                
                # 추천도
                overall_recommendation = recommendation.get('overall_recommendation', '정보 없음')
                target_audience = recommendation.get('target_audience', '정보 없음')
                
                print(f"🎯 추천도: {overall_recommendation}")
                print(f"👤 추천 대상: {target_audience}")
                
            else:
                print("📝 리뷰 정보 없음 - 분석 불가")
            
            print(f"📊 수집된 리뷰: {review_count}개")


def main():
    """메인 실행 함수 - 설정 가능한 크롤링"""
    crawler = RestaurantCrawler()
    
    print("🔍 맛집 크롤링 프로그램")
    print("=" * 50)
    
    # 크롤링 설정 입력
    try:
        restaurant_count = int(input("크롤링할 맛집 개수 (기본 3개): ") or "3")
        location = input("지역 (기본 강남): ") or "강남"
        
        print("\n맛집 이름을 입력하세요 (Enter로 완료):")
        restaurants = []
        
        for i in range(restaurant_count):
            restaurant = input(f"{i+1}. ").strip()
            if restaurant:
                restaurants.append(restaurant)
            elif i == 0:  # 첫 번째가 비어있으면 기본값 사용
                restaurants = ["강남역 맛집", "사당역 맛집", "홍대 파스타"]
                break
        
        if not restaurants:
            restaurants = ["강남역 맛집", "사당역 맛집", "홍대 파스타"]
            
    except (ValueError, KeyboardInterrupt):
        # 기본값 사용
        restaurant_count = 3
        location = "강남"
        restaurants = ["강남역 맛집", "사당역 맛집", "홍대 파스타"]
    
    print(f"\n🚀 크롤링 시작: {len(restaurants)}개 맛집 ({location} 지역)")
    print("맛집 목록:", ", ".join(restaurants))
    
    # 크롤링 실행
    results = crawler.crawl_multiple_restaurants(restaurants, location)
    
    # 가게별 요약 정보 출력
    crawler.print_restaurant_summary(results)
    
    # JSON 파일로 저장
    filename = crawler.save_to_json(results)
    
    if filename:
        print(f"\n✅ 크롤링 완료! 결과 파일: {filename}")
        print(f"총 {len(results)}개 맛집 정보가 저장되었습니다.")
    else:
        print("\n❌ 파일 저장 실패")


if __name__ == "__main__":
    main()
