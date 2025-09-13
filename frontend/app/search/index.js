// frontend/app/search/index.js

import React, { useState, useEffect } from 'react';
import { useRoute } from '@react-navigation/native';
import ResultScreen from '../../components/ResultScreen';
import { search } from '../../services/searchService'; // 백엔드 API 호출 서비스

export default function SearchResultsScreen() {
    const route = useRoute();
    const { initialQuery } = route.params || { initialQuery: '' };
    const [searchQuery, setSearchQuery] = useState(initialQuery);
    const [searchResults, setSearchResults] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    // 이 함수가 백엔드 API 호출 로직을 담당합니다.
    const handleSearch = async () => {
        if (!searchQuery.trim()) {
            setSearchResults([]);
            return;
        }

        setIsLoading(true);
        try {
            const results = await search(searchQuery);
            setSearchResults(results);
        } catch (error) {
            console.error('Search error:', error);
            setSearchResults([]);
            // TODO: 사용자에게 에러를 알리는 UI를 추가할 수 있습니다.
        } finally {
            setIsLoading(false);
        }
    };

    // 컴포넌트가 처음 로드될 때 또는 initialQuery가 변경될 때 검색을 실행합니다.
    useEffect(() => {
        handleSearch();
    }, [initialQuery]);

    return (
        <ResultScreen
            searchResults={searchResults}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            handleSearch={handleSearch}
        />
    );
}
