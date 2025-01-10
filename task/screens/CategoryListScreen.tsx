// src/screens/CategoryListScreen.tsx

import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, FlatList, Button, StyleSheet, TouchableOpacity, RefreshControl, Alert } from 'react-native';
import api from '../services/api';
import { useFocusEffect } from '@react-navigation/native';
import { ListItem, Icon } from 'react-native-elements';
import { Category } from '../types';

const CategoryListScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
    const [categories, setCategories] = useState<Category[]>([]);
    const [refreshing, setRefreshing] = useState<boolean>(false);

    const fetchCategories = async () => {
        try {
            const response = await api.get<Category[]>('/categories');
            setCategories(response.data);
        } catch (error) {
            console.error(error);
            Alert.alert('Erro', 'Falha ao buscar categorias.');
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

    const renderItem = ({ item }: { item: Category }) => (
        <ListItem bottomDivider onPress={() => navigation.navigate('CreateNote', { category: item })}>
            <Icon name="folder" type="ionicon" color="blue" />
            <ListItem.Content>
                <ListItem.Title>{item.Name}</ListItem.Title>
            </ListItem.Content>
            <ListItem.Chevron />
        </ListItem>
    );

    return (
        <View style={styles.container}>
            <Button title="Adicionar Categoria" onPress={() => navigation.navigate('CreateCategory')} />
            <FlatList
                data={categories}
                keyExtractor={(item) => item.ID.toString()}
                renderItem={renderItem}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                }
                ListEmptyComponent={<Text style={styles.empty}>Nenhuma categoria encontrada.</Text>}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, padding: 16 },
    empty: { textAlign: 'center', marginTop: 20, color: 'gray' },
});

export default CategoryListScreen;
