import React, { useState, useEffect, useRef } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { search } from '../../services/searchService';
import ResultScreen from '../../components/ResultScreen';

export default function SearchResultsScreen() {
    const { initialQuery } = useLocalSearchParams();
    const router = useRouter();
    const [searchQuery, setSearchQuery] = useState('');
    const [activeFilters, setActiveFilters] = useState([]);
    const [searchResults, setSearchResults] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const textInputRef = useRef(null);

    const performSearch = async (query) => {
        if (!query) {
            setSearchResults([]);
            return;
        }
        setIsLoading(true);
        try {
            await search(query); // search 함수에 단일 문자열 전달
            // 이 프로젝트에서는 검색 결과를 받지 않으므로, 이 줄은 그대로 둡니다.
        } catch (error) {
            console.error('Search error:', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (initialQuery) {
            const initialFilter = { id: Date.now(), text: initialQuery, active: true };
            setActiveFilters([initialFilter]);
            performSearch(initialQuery);
        }
    }, [initialQuery]);

    const handleSearch = () => {
        if (searchQuery.trim()) {
            const newFilter = { id: Date.now(), text: searchQuery.trim(), active: true };
            const newFilters = [...activeFilters, newFilter];
            setActiveFilters(newFilters);
            performSearch(searchQuery.trim()); // `searchQuery` 변수(단일 문자열)만 전달
            setSearchQuery('');
        }
    };

    const handleBack = () => {
        router.back();
    };

    const toggleFilter = (id) => {
        const updatedFilters = activeFilters.map(filter =>
            filter.id === id ? { ...filter, active: !filter.active } : filter
        );
        setActiveFilters(updatedFilters);
        const lastActiveFilter = updatedFilters.filter(f => f.active).slice(-1)[0];
        if (lastActiveFilter) {
            performSearch(lastActiveFilter.text);
        } else {
            performSearch('');
        }
    };

    return (
        <ResultScreen
            searchResults={searchResults}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            handleSearch={handleSearch}
            handleBack={handleBack}
            isLoading={isLoading}
            activeFilters={activeFilters}
            toggleFilter={toggleFilter}
            textInputRef={textInputRef}
        />
    );
}
