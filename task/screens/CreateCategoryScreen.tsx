// src/screens/CreateCategoryScreen.tsx

import React, { useState } from 'react';
import { StyleSheet, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { TextInput, Button, Title, useTheme } from 'react-native-paper';
import api from '../services/api';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation';

type CreateCategoryScreenNavigationProp = StackNavigationProp<
    RootStackParamList,
    'CreateCategory'
>;

type Props = {
    navigation: CreateCategoryScreenNavigationProp;
};

const CreateCategoryScreen: React.FC<Props> = ({ navigation }) => {
    const { colors } = useTheme();
    const [name, setName] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);

    const handleCreate = async () => {
        if (!name.trim()) {
            Alert.alert('Erro', 'Por favor, preencha o nome da categoria.');
            return;
        }

        setLoading(true);
        try {
            await api.post('/categories', { Name: name });
            Alert.alert('Sucesso', 'Categoria criada com sucesso!');
            navigation.goBack();
        } catch (error) {
            console.error(error);
            Alert.alert('Erro', 'Falha ao criar categoria.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.select({ ios: 'padding', android: undefined })}
        >
            <Title style={styles.title}>Adicionar Categoria</Title>
            <TextInput
                label="Nome da Categoria"
                value={name}
                mode="outlined"
                onChangeText={setName}
                style={styles.input}
                left={<TextInput.Icon name="tag-outline" />}
            />
            <Button
                mode="contained"
                onPress={handleCreate}
                style={styles.button}
                loading={loading}
                disabled={loading}
            >
                Criar Categoria
            </Button>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, padding: 16, backgroundColor: '#f6f6f6' },
    title: { textAlign: 'center', marginBottom: 20, fontSize: 28, color: '#6200ee' },
    input: { marginBottom: 15 },
    button: { marginTop: 10 },
});

export default CreateCategoryScreen;
