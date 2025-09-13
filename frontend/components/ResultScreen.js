// frontend/components/ResultScreen.js

import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity, FlatList, Image, TextInput } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const ResultCard = ({ item }) => (
    <View style={styles.card}>
        <Image source={{ uri: item.image }} style={styles.cardImage} />
        <View style={styles.cardContent}>
            <Text style={styles.cardTitle}>{item.name}</Text>
            <View style={styles.cardRatingContainer}>
                <Text style={styles.cardRating}>★ {item.rating}</Text>
                <Text style={styles.cardReviews}>({item.reviews} reviews)</Text>
            </View>
            <Text style={styles.cardDescription}>{item.description}</Text>
        </View>
    </View>
);

const ResultScreen = ({ searchResults, handleSearch, searchQuery, setSearchQuery }) => {
    const navigation = useNavigation();

    return (
        <SafeAreaView style={styles.safeArea}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Text style={styles.backIcon}>←</Text>
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Results</Text>
            </View>

            {/* Results List */}
            <FlatList
                data={searchResults}
                renderItem={({ item }) => <ResultCard item={item} />}
                keyExtractor={item => item.id}
                contentContainerStyle={styles.listContainer}
                ListEmptyComponent={<Text style={styles.noResultsText}>검색 결과가 없습니다.</Text>}
            />

            {/* Footer Search Bar */}
            <View style={styles.footerSearchContainer}>
                <View style={styles.footerSearchWrapper}>
                    <TextInput
                        style={styles.footerSearchInput}
                        placeholder="Search for restaurants or cuisines"
                        placeholderTextColor="#888"
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                        onSubmitEditing={handleSearch}
                    />
                </View>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 15,
        paddingHorizontal: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#E0E0E0',
    },
    backButton: {
        paddingRight: 10,
    },
    backIcon: {
        fontSize: 24,
        color: '#000',
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#000',
        flex: 1,
        textAlign: 'center',
        marginLeft: -34,
    },
    listContainer: {
        padding: 15,
    },
    card: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F9F9F9',
        borderRadius: 10,
        padding: 10,
        marginBottom: 15,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 3,
    },
    cardImage: {
        width: 80,
        height: 80,
        borderRadius: 8,
        marginRight: 15,
    },
    cardContent: {
        flex: 1,
    },
    cardTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#000',
    },
    cardRatingContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 4,
    },
    cardRating: {
        fontSize: 14,
        color: '#F4B400',
        fontWeight: 'bold',
        marginRight: 5,
    },
    cardReviews: {
        fontSize: 12,
        color: '#888',
    },
    cardDescription: {
        fontSize: 13,
        color: '#666',
    },
    noResultsText: {
        textAlign: 'center',
        marginTop: 50,
        fontSize: 16,
        color: '#888',
    },
    footerSearchContainer: {
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderTopWidth: 1,
        borderTopColor: '#E0E0E0',
    },
    footerSearchWrapper: {
        backgroundColor: '#F5F5F5',
        borderRadius: 25,
        height: 45,
        paddingHorizontal: 15,
        justifyContent: 'center',
    },
    footerSearchInput: {
        fontSize: 16,
        color: '#000',
    },
});

export default ResultScreen;
