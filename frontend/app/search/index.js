// app/search/index.js
import React, { useState, useEffect, useRef } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
// search와 saveSearchLog 함수를 모두 가져옵니다.
import { search, saveSearchLog } from '../../services/searchService';
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
            // 1. 백엔드에 검색 로그를 저장합니다.
            await saveSearchLog(query);

            // 2. 백엔드에서 전체 결과를 가져와 필터링합니다.
            const results = await search(query);
            setSearchResults(results);
        } catch (error) {
            console.error('Search error:', error);
            setSearchResults([]);
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
            performSearch(searchQuery.trim());
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