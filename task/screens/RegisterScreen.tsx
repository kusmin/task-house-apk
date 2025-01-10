// src/screens/RegisterScreen.tsx

import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import api from '../services/api';
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
    const [username, setUsername] = useState<string>('');
    const [password, setPassword] = useState<string>('');

    const handleRegister = async () => {
        if (!username || !password) {
            Alert.alert('Erro', 'Por favor, preencha todos os campos.');
            return;
        }

        try {
            await api.post('/auth/register', { username, password });
            Alert.alert('Sucesso', 'Usuário registrado com sucesso!');
            navigation.navigate('Login');
        } catch (error) {
            console.error(error);
            Alert.alert('Erro', 'Falha no registro. Tente novamente.');
        }
    };

    return (
        <View style={styles.container}>
        <Text style={styles.title}>Registrar</Text>
            <TextInput
    style={styles.input}
    value={username}
    onChangeText={setUsername}
    placeholder="Username"
    autoCapitalize="none"
    />
    <TextInput
        style={styles.input}
    value={password}
    onChangeText={setPassword}
    placeholder="Password"
    secureTextEntry
    />
    <Button title="Registrar" onPress={handleRegister} />
    <TouchableOpacity onPress={() => navigation.navigate('Login')}>
    <Text style={styles.link}>Já tem uma conta? Faça Login</Text>
        </TouchableOpacity>
        </View>
);
};

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: 'center', padding: 16 },
    title: { fontSize: 24, marginBottom: 24, textAlign: 'center' },
    input: { borderWidth: 1, padding: 12, marginVertical: 8, borderRadius: 8 },
    link: { color: 'blue', marginTop: 16, textAlign: 'center' },
});

export default RegisterScreen;
