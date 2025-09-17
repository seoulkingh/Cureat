// frontend/components/MapScreen.js
import React from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity } from 'react-native';
import MapView from 'react-native-maps';
import Footer from './Footer';

export default function MapScreen() {
    const seoulRegion = {
        latitude: 37.5665,
        longitude: 126.9780,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
    };

    return (
        <View style={styles.container}>
            {/* 상단 내비게이션 바 */}
            <View style={styles.topContainer}>
                <View style={styles.searchBar}>
                    <Text style={styles.searchBarText}>○ 출발지</Text>
                </View>
                <View style={styles.searchBar}>
                    <Text style={styles.searchBarText}>+ 경유지 추가</Text>
                </View>
                <View style={styles.searchBar}>
                    <Text style={styles.searchBarText}>● 도착지</Text>
                </View>
            </View>

            {/* 지도 영역 */}
            <MapView
                style={styles.map}
                initialRegion={seoulRegion}
            />

            {/* 하단 검색창 */}
            <View style={styles.bottomSearchContainer}>
                <View style={styles.bottomSearchBox}>
                    <Text style={styles.searchIcon}>🔍</Text>
                    <TextInput
                        style={styles.bottomSearchInput}
                        placeholder="Search for restaurants or cuisines"
                        placeholderTextColor="#888"
                    />
                </View>
            </View>
            
            {/* Footer 컴포넌트: marginBottom을 추가하여 위로 올림 */}
            <View style={styles.footerWrapper}>
                <Footer />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f0f0f0',
        position: 'relative',
    },
    topContainer: {
        position: 'absolute',
        top: 50,
        left: 0,
        right: 0,
        zIndex: 1,
        paddingHorizontal: 20,
    },
    searchBar: {
        backgroundColor: 'white',
        padding: 15,
        borderRadius: 10,
        marginBottom: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    searchBarText: {
        color: '#888',
    },
    map: {
        flex: 1,
    },
    bottomSearchContainer: {
        position: 'absolute',
        bottom: 100, // footer가 위로 올라간 만큼 여백을 더 줌
        left: 0,
        right: 0,
        zIndex: 1,
        alignItems: 'center',
        paddingHorizontal: 20,
    },
    bottomSearchBox: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'white',
        borderRadius: 25,
        paddingHorizontal: 15,
        paddingVertical: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
        width: '100%',
    },
    searchIcon: {
        marginRight: 10,
        fontSize: 16,
        color: '#888',
    },
    bottomSearchInput: {
        flex: 1,
        color: '#000',
    },
    footerWrapper: {
        // Footer를 감싸는 View
        marginBottom: 30,
    },
});