// src/screens/CreateCategoryScreen.tsx

import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import api from '../services/api';

const CreateCategoryScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
    const [name, setName] = useState<string>('');

    const handleCreate = async () => {
        if (!name) {
            Alert.alert('Erro', 'Por favor, preencha o nome da categoria.');
            return;
        }

        try {
            await api.post('/categories', { name });
            Alert.alert('Sucesso', 'Categoria criada com sucesso!');
            navigation.goBack();
        } catch (error) {
            console.error(error);
            Alert.alert('Erro', 'Falha ao criar categoria.');
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.label}>Nome da Categoria</Text>
            <TextInput
                style={styles.input}
                value={name}
                onChangeText={setName}
                placeholder="Ex: Pessoal, Trabalho"
            />
            <Button title="Criar Categoria" onPress={handleCreate} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, padding: 16 },
    label: { fontSize: 16, marginTop: 16 },
    input: { borderWidth: 1, padding: 12, marginTop: 8, borderRadius: 8 },
});

export default CreateCategoryScreen;
