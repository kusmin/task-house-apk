// src/screens/TaskListScreen.tsx

import React, {  useState, useCallback } from 'react';
import { View, Text, FlatList, Button, StyleSheet, RefreshControl, Alert } from 'react-native';
import api from '../services/api';
import { useFocusEffect } from '@react-navigation/native';
import { ListItem, Icon } from 'react-native-elements';
import { Task } from '../types';
import {deleteItem} from "../services/storage";

const TaskListScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [refreshing, setRefreshing] = useState<boolean>(false);

    const fetchTasks = async () => {
        try {
            const response = await api.get<Task[]>('/tasks');
            setTasks(response.data);
        } catch (error) {
            console.error(error);
            Alert.alert('Erro', 'Falha ao buscar tarefas.');
        }
    };

    useFocusEffect(
        useCallback(() => {
            fetchTasks();
        }, [])
    );

    const handleLogout = async () => {
        await deleteItem('token');
        navigation.replace('Login');
    };

    const onRefresh = async () => {
        setRefreshing(true);
        await fetchTasks();
        setRefreshing(false);
    };

    const renderItem = ({ item }: { item: Task }) => (
        <ListItem bottomDivider onPress={() => navigation.navigate('UpdateTask', { task: item })}>
            <Icon name={item.Completed ? 'check-circle' : 'circle-outline'} type="ionicon" color={item.Completed ? 'green' : 'gray'} />
            <ListItem.Content>
                <ListItem.Title style={item.Completed ? styles.completed : styles.pending}>{item.Title}</ListItem.Title>
                <ListItem.Subtitle>{item.Description}</ListItem.Subtitle>
            </ListItem.Content>
            <ListItem.Chevron />
        </ListItem>
    );

    return (
        <View style={styles.container}>
            <Button title="Adicionar Tarefa" onPress={() => navigation.navigate('CreateTask')} />
            <View style={styles.buttonsContainer}>
                <Button title="Categorias" onPress={() => navigation.navigate('CategoryList')} />
                <Button title="Notas" onPress={() => navigation.navigate('NoteList')} />
            </View>
            <FlatList
                data={tasks}
                keyExtractor={(item) => item.ID.toString()}
                renderItem={renderItem}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                }
                ListEmptyComponent={<Text style={styles.empty}>Nenhuma tarefa encontrada.</Text>}
            />
            <Button title="Logout" onPress={handleLogout} color="red" />
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, padding: 16 },
    buttonsContainer: { flexDirection: 'row', justifyContent: 'space-between', marginVertical: 10 },
    completed: { textDecorationLine: 'line-through', color: 'green' },
    pending: { color: 'black' },
    empty: { textAlign: 'center', marginTop: 20, color: 'gray' },
});

export default TaskListScreen;
