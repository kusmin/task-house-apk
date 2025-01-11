// src/screens/CategoryListScreen.tsx

import React, { useState, useCallback } from 'react';
import { View, StyleSheet, Alert, FlatList, RefreshControl } from 'react-native';
import {
    Text,
    Card,
    Title,
    Paragraph,
    FAB,
    IconButton,
    ActivityIndicator,
} from 'react-native-paper';
import api from '../services/api';
import { useFocusEffect } from '@react-navigation/native';
import { Category } from '../types'; // Assegure-se de que o tipo Category está definido corretamente

type Props = {
    navigation: any; // Para uma tipagem mais precisa, ajuste conforme necessário
};

const CategoryListScreen: React.FC<Props> = ({ navigation }) => {
    const [categories, setCategories] = useState<Category[]>([]);
    const [refreshing, setRefreshing] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);

    const fetchCategories = async () => {
        setLoading(true);
        try {
            const response = await api.get<Category[]>('/categories');
            console.log('Categorias retornadas:', response.data); // Log para depuração
            setCategories(response.data);
        } catch (error) {
            console.error(error);
            Alert.alert('Erro', 'Falha ao buscar categorias.');
        } finally {
            setLoading(false);
        }
    };

    useFocusEffect(
        useCallback(() => {
            fetchCategories();
        }, [])
    );

    const onRefresh = async () => {
        setRefreshing(true);
        await fetchCategories();
        setRefreshing(false);
    };

    const handleDelete = (id: number) => {
        Alert.alert(
            'Confirmar Deleção',
            'Você tem certeza que deseja deletar esta categoria?',
            [
                { text: 'Cancelar', style: 'cancel' },
                {
                    text: 'Deletar',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            await api.delete(`/categories/${id}`);
                            Alert.alert('Sucesso', 'Categoria deletada com sucesso.');
                            fetchCategories();
                        } catch (error) {
                            console.error(error);
                            Alert.alert('Erro', 'Falha ao deletar a categoria.');
                        }
                    },
                },
            ]
        );
    };

    const renderItem = ({ item }: { item: Category }) => (
        <Card style={styles.card}>
            <Card.Content>
                <Title>{item.name}</Title>
            </Card.Content>
            <Card.Actions>
                <IconButton
                    icon="pencil"
                    containerColor="#6200ee"
                    size={20}
                    onPress={() => navigation.navigate('CreateNote', { category: item })}
                />
                <IconButton
                    icon="delete"
                    containerColor="#B00020"
                    size={20}
                    onPress={() => handleDelete(item.ID)}
                />
            </Card.Actions>
        </Card>
    );

    return (
        <View style={styles.container}>
            {loading ? (
                <ActivityIndicator animating={true} size="large" style={styles.loader} />
            ) : (
                <>
                    <FlatList
                        data={categories}
                        keyExtractor={(item) => item.ID.toString()}
                        renderItem={renderItem}
                        refreshControl={
                            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                        }
                        ListEmptyComponent={
                            <Text style={styles.empty}>Nenhuma categoria encontrada.</Text>
                        }
                    />
                    <FAB
                        style={styles.fab}
                        icon="plus"
                        label="Adicionar Categoria"
                        onPress={() => navigation.navigate('CreateCategory')}
                        color="#ffffff"
                    />
                </>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, padding: 16, backgroundColor: '#f6f6f6' },
    card: { marginBottom: 15, backgroundColor: '#ffffff' },
    fab: {
        position: 'absolute',
        margin: 16,
        right: 0,
        bottom: 16,
        backgroundColor: '#6200ee',
    },
    empty: { textAlign: 'center', marginTop: 20, color: 'gray', fontSize: 16 },
    loader: { flex: 1, justifyContent: 'center' },
});

export default CategoryListScreen;
