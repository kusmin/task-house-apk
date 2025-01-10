// src/screens/NoteListScreen.tsx

import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, FlatList, Button, StyleSheet, TouchableOpacity, RefreshControl, Alert, Image, Linking } from 'react-native';
import api from '../services/api';
import { useFocusEffect } from '@react-navigation/native';
import { ListItem, Icon } from 'react-native-elements';
import { Note } from '../types';

const NoteListScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
    const [notes, setNotes] = useState<Note[]>([]);
    const [refreshing, setRefreshing] = useState<boolean>(false);

    const fetchNotes = async () => {
        try {
            const response = await api.get<Note[]>('/notes');
            setNotes(response.data);
        } catch (error) {
            console.error(error);
            Alert.alert('Erro', 'Falha ao buscar notas.');
        }
    };

    useFocusEffect(
        useCallback(() => {
            fetchNotes();
        }, [])
    );

    const onRefresh = async () => {
        setRefreshing(true);
        await fetchNotes();
        setRefreshing(false);
    };

    const renderItem = ({ item }: { item: Note }) => (
        <ListItem bottomDivider onPress={() => navigation.navigate('UpdateNote', { note: item })}>
            {item.ImageURL ? (
                <Image source={{ uri: item.ImageURL }} style={{ width: 50, height: 50 }} />
            ) : (
                <Icon name="document-text" type="ionicon" color="gray" />
            )}
            <ListItem.Content>
                <ListItem.Title>{item.Title}</ListItem.Title>
                <ListItem.Subtitle>{item.Category ? item.Category.Name : 'Sem Categoria'}</ListItem.Subtitle>
            </ListItem.Content>
            {item.Link && (
                <TouchableOpacity onPress={() => { Linking.openURL(item?.Link) }}>
                    <Icon name="link" type="ionicon" color="blue" />
                </TouchableOpacity>
            )}
            <ListItem.Chevron />
        </ListItem>
    );

    return (
        <View style={styles.container}>
            <Button title="Adicionar Nota" onPress={() => navigation.navigate('CreateNote')} />
            <FlatList
                data={notes}
                keyExtractor={(item) => item.ID.toString()}
                renderItem={renderItem}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                }
                ListEmptyComponent={<Text style={styles.empty}>Nenhuma nota encontrada.</Text>}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, padding: 16 },
    empty: { textAlign: 'center', marginTop: 20, color: 'gray' },
});

export default NoteListScreen;
