// src/screens/RegisterScreen.tsx

import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Text, TextInput, Button, Title, useTheme } from 'react-native-paper';
import api from '../services/api';
import { setItem } from '../services/storage'; // Função de armazenamento abstrato
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation';

type RegisterScreenNavigationProp = StackNavigationProp<
    RootStackParamList,
    'Register'
>;

type Props = {
    navigation: RegisterScreenNavigationProp;
};

const RegisterScreen: React.FC<Props> = ({ navigation }) => {
    const { colors } = useTheme();
    const [username, setUsername] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [confirmPassword, setConfirmPassword] = useState<string>('');

    const handleRegister = async () => {
        if (!username || !password || !confirmPassword) {
            alert('Por favor, preencha todos os campos.');
            return;
        }

        if (password !== confirmPassword) {
            alert('As senhas não coincidem.');
            return;
        }

        try {
            const response = await api.post('/register', { username, password });
            const token: string = response.data.token;

            await setItem('token', token);
            navigation.replace('TaskList');
        } catch (error) {
            console.error(error);
            alert('Falha no registro. Tente novamente.');
        }
    };

    return (
        <View style={styles.container}>
            <Title style={styles.title}>Registrar</Title>
            <TextInput
                label="Usuário"
                value={username}
                mode="outlined"
                onChangeText={setUsername}
                style={styles.input}
                autoCapitalize="none"
                left={<TextInput.Icon name="account" />}
            />
            <TextInput
                label="Senha"
                value={password}
                mode="outlined"
                onChangeText={setPassword}
                style={styles.input}
                secureTextEntry
                left={<TextInput.Icon name="lock" />}
            />
            <TextInput
                label="Confirmar Senha"
                value={confirmPassword}
                mode="outlined"
                onChangeText={setConfirmPassword}
                style={styles.input}
                secureTextEntry
                left={<TextInput.Icon name="lock-check" />}
            />
            <Button
                mode="contained"
                onPress={handleRegister}
                style={styles.button}
                contentStyle={styles.buttonContent}
            >
                Registrar
            </Button>
            <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                <Text style={[styles.link, { color: colors.primary }]}>
                    Já tem uma conta? Faça Login
                </Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        justifyContent: 'center',
        backgroundColor: '#f6f6f6',
    },
    title: {
        textAlign: 'center',
        marginBottom: 20,
        fontSize: 32,
        fontWeight: 'bold',
        color: '#6200ee',
    },
    input: {
        marginBottom: 15,
    },
    button: {
        marginVertical: 10,
    },
    buttonContent: {
        paddingVertical: 8,
    },
    link: {
        textAlign: 'center',
        marginTop: 15,
        fontSize: 16,
    },
});

export default RegisterScreen;
