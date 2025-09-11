import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { login } from '../../services/authService'; // 1. authService를 임포트합니다.

// 커스텀 버튼 컴포넌트
const CustomButton = ({ title, onPress, style, textStyle }) => (
    <TouchableOpacity style={[styles.button, style]} onPress={onPress}>
        <Text style={[styles.buttonText, textStyle]}>{title}</Text>
    </TouchableOpacity>
);

export default function LoginScreen() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    // 2. 로그인 로직을 담은 비동기 함수를 추가합니다.
    const handleLogin = async () => {
        if (!email || !password) {
            Alert.alert('오류', '이메일과 비밀번호를 모두 입력해주세요.');
            return;
        }

        try {
            const response = await login(email, password);

            // TODO: 실제 토큰을 저장하거나 상태 관리하는 로직 추가
            Alert.alert('로그인 성공', '홈 화면으로 이동합니다.');
            // router.push('/home');

        } catch (error) {
            Alert.alert('로그인 실패', error.message);
        }
    };

    return (
        <View style={styles.container}>
            {/* 뒤로가기 버튼 */}
            <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                <Text style={styles.backButtonText}>←</Text>
            </TouchableOpacity>

            {/* 제목 및 설명 */}
            <View style={styles.header}>
                <Text style={styles.title}>Cureat</Text>
                <Text style={styles.description}>
                    당신만의 미식 경험이 기다리고 있습니다.
                </Text>
            </View>

            {/* 입력 필드 */}
            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.input}
                    placeholder="이메일"
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                />
                <TextInput
                    style={styles.input}
                    placeholder="비밀번호"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                />
            </View>

            {/* 로그인 및 링크 버튼 */}
            <View style={styles.authContainer}>
                <CustomButton
                    title="로그인"
                    onPress={handleLogin} // 3. handleLogin 함수를 연결합니다.
                    style={styles.loginButton}
                    textStyle={styles.loginButtonText}
                />
                <View style={styles.linkContainer}>
                    <TouchableOpacity onPress={() => console.log('비밀번호 찾기')}>
                        <Text style={styles.linkText}>비밀번호 찾기</Text>
                    </TouchableOpacity>
                    <Text style={styles.linkText}>|</Text>
                    <TouchableOpacity onPress={() => console.log('회원가입')}>
                        <Text style={styles.linkText}>회원가입</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
        alignItems: 'center',
        padding: 20,
        justifyContent: 'center',
    },
    backButton: {
        position: 'absolute',
        top: 60,
        left: 20,
        zIndex: 1,
    },
    backButtonText: {
        fontSize: 24,
        color: '#000000',
    },
    header: {
        alignItems: 'center',
        marginBottom: 40,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#DE5897',
        marginBottom: 10,
    },
    description: {
        fontSize: 14,
        color: '#888888',
        textAlign: 'center',
    },
    inputContainer: {
        width: '100%',
        alignItems: 'center',
        marginBottom: 20,
    },
    input: {
        width: '85%',
        height: 50,
        borderWidth: 1,
        borderColor: '#CCCCCC',
        borderRadius: 8,
        paddingHorizontal: 15,
        marginBottom: 10,
        fontSize: 16,
    },
    authContainer: {
        width: '100%',
        alignItems: 'center',
    },
    loginButton: {
        width: '85%',
        backgroundColor: '#000000',
        borderRadius: 8,
        paddingVertical: 15,
    },
    loginButtonText: {
        color: '#FFFFFF',
        fontWeight: 'bold',
        fontSize: 16,
    },
    button: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    linkContainer: {
        flexDirection: 'row',
        marginTop: 20,
        width: '85%',
        justifyContent: 'space-around',
    },
    linkText: {
        color: '#888888',
        fontSize: 14,
    },
});
