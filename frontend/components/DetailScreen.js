// frontend/components/DetailScreen.js

import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, Image, TouchableOpacity, ScrollView, Modal, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import Footer from './Footer';

// 임시 리스트 데이터 (실제로는 서버에서 가져와야 함)
const dummyLists = [
    { id: '1', name: '가고 싶은 곳' },
    { id: '2', name: '친구 추천 맛집' },
    { id: '3', name: '데이트 코스' },
];

const DetailScreen = ({ data, onBack }) => {
    const router = useRouter();
    const [modalVisible, setModalVisible] = useState(false);

    const handleAddToList = () => {
        setModalVisible(true);
    };

    const handleMapAdd = () => {
        Alert.alert(
            "지도에 추가",
            `${data.name}을(를) 지도에 목적지로 추가합니다.`
        );
        // TODO: 지도 페이지로 이동하는 로직 구현
        router.push({ pathname: 'map', params: { destination: data.name } });
    };

    const handleListSelect = (listName) => {
        Alert.alert(
            "리스트에 추가",
            `${data.name}이(가) \"${listName}\" 리스트에 추가되었습니다.`
        );
        setModalVisible(false);
    };

    const handleBack = () => {
        router.back();
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <ScrollView style={styles.container}>
                <View style={styles.header}>
                    <TouchableOpacity onPress={handleBack} style={styles.backButton}>
                        <Text style={styles.backButtonText}>←</Text>
                    </TouchableOpacity>
                    {/* <TouchableOpacity onPress={handleAddToList} style={styles.listButton}>
                        <Text style={styles.listButtonText}>리스트 추가</Text>
                    </TouchableOpacity> */}
                </View>

                {/* 음식점 정보 섹션 */}
                <View style={styles.infoContainer}>
                    {/* 상단 이미지 (임시로 placeholder 사용) */}
                    <Image
                        source={{ uri: 'https://placehold.co/400x200/A8A8A8/FFFFFF?text=Cureat' }}
                        style={styles.image}
                    />

                    <Text style={styles.title}>{data.name}</Text>

                    {/* 주소, 전화번호 */}
                    <View style={styles.row}>
                        <Text style={styles.label}>주소: </Text>
                        <Text style={styles.text}>{data.address}</Text>
                    </View>
                    <View style={styles.row}>
                        <Text style={styles.label}>전화번호: </Text>
                        <Text style={styles.text}>{data.phone}</Text>
                    </View>
                    <View style={styles.row}>
                        <Text style={styles.label}>가격대: </Text>
                        <Text style={styles.text}>{data.price_range}</Text>
                    </View>

                    {/* 대표 메뉴 */}
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>대표 메뉴</Text>
                        <Text style={styles.sectionText}>
                            {data.signature_dishes && data.signature_dishes.join(', ')}
                        </Text>
                    </View>

                    {/* 장점 */}
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>장점</Text>
                        {data.pros && data.pros.map((pro, index) => (
                            <Text key={index} style={styles.bulletText}>• {pro}</Text>
                        ))}
                    </View>

                    {/* 단점 */}
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>단점</Text>
                        {data.cons && data.cons.map((con, index) => (
                            <Text key={index} style={styles.bulletText}>• {con}</Text>
                        ))}
                    </View>

                    {/* 키워드 */}
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>키워드</Text>
                        <Text style={styles.sectionText}>
                            {data.keywords && data.keywords.join(', ')}
                        </Text>
                    </View>
                </View>

                {/* 버튼 영역 */}
                <View style={styles.buttonContainer}>
                    {/* <TouchableOpacity style={styles.mapButton} onPress={handleAddToList}>
                        <Text style={styles.mapButtonText}>리스트 추가</Text>
                    </TouchableOpacity> */}

                    <TouchableOpacity style={styles.mapButton} onPress={handleMapAdd}>
                        <Text style={styles.mapButtonText}>지도에 추가</Text>
                    </TouchableOpacity>
                </View>

                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={modalVisible}
                    onRequestClose={() => setModalVisible(false)}
                >
                    <TouchableOpacity
                        style={styles.modalOverlay}
                        activeOpacity={1}
                        onPressOut={() => setModalVisible(false)}
                    >
                        <View style={styles.modalContent}>
                            <Text style={styles.modalTitle}>리스트 선택</Text>
                            {dummyLists.map(list => (
                                <TouchableOpacity
                                    key={list.id}
                                    style={styles.listButton}
                                    onPress={() => handleListSelect(list.name)}
                                >
                                    <Text style={styles.listButtonText}>{list.name}</Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </TouchableOpacity>
                </Modal>
            </ScrollView>
            <Footer />
        </SafeAreaView>
    );
};

// styles를 컴포넌트 바로 아래에 위치시킵니다.
const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#fff',
    },
    container: {
        flex: 1,
        padding: 20,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    backButton: {
        padding: 10,
    },
    backButtonText: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#000',
    },
    listButton: {
        backgroundColor: '#DE5897',
        paddingVertical: 8,
        paddingHorizontal: 15,
        borderRadius: 20,
    },
    listButtonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
    infoContainer: {
        marginBottom: 20,
    },
    image: {
        width: '100%',
        height: 200,
        borderRadius: 10,
        marginBottom: 15,
    },
    title: {
        fontSize: 26,
        fontWeight: 'bold',
        marginBottom: 10,
        color: '#000',
    },
    row: {
        flexDirection: 'row',
        marginBottom: 5,
    },
    label: {
        fontWeight: 'bold',
        color: '#DE5897',
        fontSize: 16,
    },
    text: {
        fontSize: 16,
        color: '#333',
    },
    section: {
        marginTop: 15,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#000',
        marginBottom: 8,
    },
    sectionText: {
        fontSize: 16,
        color: '#333',
    },
    bulletText: {
        fontSize: 16,
        color: '#333',
        marginBottom: 5,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginBottom: 20,
    },
    mapButton: {
        backgroundColor: '#4CAF50',
        paddingVertical: 12,
        paddingHorizontal: 30,
        borderRadius: 25,
    },
    mapButtonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
    },
    // Modal 관련 스타일
    modalOverlay: {
        flex: 1,
        justifyContent: 'flex-end',
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    modalContent: {
        backgroundColor: '#fff',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        padding: 20,
        alignItems: 'center',
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 20,
        color: '#000',
    },
    listButton: {
        width: '100%',
        padding: 15,
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: '#E0E0E0',
    },
    listButtonText: {
        fontSize: 18,
        color: '#333',
    },
});

// 컴포넌트를 내보내는 export default 구문
export default DetailScreen;