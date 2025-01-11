// src/screens/TaskListScreen.tsx

import React, { useState, useEffect, useCallback } from 'react';
import {View, StyleSheet, Alert, FlatList, TextInput as RNTextInput, Keyboard, RefreshControl} from 'react-native';
import { Text, Card, Title, Paragraph, FAB, IconButton, ActivityIndicator, Button } from 'react-native-paper';
import api, { getWithParams } from '../services/api';
import { useFocusEffect } from '@react-navigation/native';
import { Task } from '../types'; // Certifique-se de que o tipo Task está definido corretamente
import { deleteItem } from '../services/storage'; // Função de logout

type Props = {
    navigation: any; // Para tipagem mais precisa, ajuste conforme necessário
};

type Pagination = {
    total: number;
    per_page: number;
    current_page: number;
    last_page: number;
    next_page_url?: string;
    prev_page_url?: string;
};

type TaskResponse = {
    data: Task[];
    pagination: Pagination;
};

const TaskListScreen: React.FC<Props> = ({ navigation }) => {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [refreshing, setRefreshing] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);
    const [search, setSearch] = useState<string>('');
    const [page, setPage] = useState<number>(1);
    const [lastPage, setLastPage] = useState<number>(1);
    const [isFetchingMore, setIsFetchingMore] = useState<boolean>(false);

    // Função para buscar tarefas com busca e paginação
    const fetchTasks = async (isLoadMore: boolean = false) => {
        if (isLoadMore) {
            setIsFetchingMore(true);
        } else {
            setLoading(true);
        }

        try {
            const params = {
                search: search,
                page: page,
                limit: 10, // Você pode ajustar o limite conforme necessário
            };
            const response: TaskResponse = await getWithParams('/tasks', params);

            if (isLoadMore) {
                setTasks((prevTasks) => [...prevTasks, ...response.data]);
            } else {
                setTasks(response.data);
            }

            setLastPage(response.pagination.last_page);
        } catch (error) {
            console.error(error);
            Alert.alert('Erro', 'Falha ao buscar tarefas.');
        } finally {
            if (isLoadMore) {
                setIsFetchingMore(false);
            } else {
                setLoading(false);
            }
        }
    };

    // Hook para buscar tarefas ao focar na tela
    useFocusEffect(
        useCallback(() => {
            fetchTasks();
        }, [page, search])
    );

    // Função para lidar com o refresh
    const onRefresh = async () => {
        setRefreshing(true);
        setPage(1);
        await fetchTasks();
        setRefreshing(false);
    };

    // Função para lidar com a busca
    const handleSearch = () => {
        setPage(1);
        fetchTasks();
        Keyboard.dismiss(); // Fecha o teclado após a busca
    };

    // Função para carregar mais tarefas quando chegar ao final da lista
    const handleLoadMore = () => {
        if (page < lastPage && !isFetchingMore && !loading) {
            setPage(page + 1);
        }
    };

    // Atualizar tarefas quando a página for incrementada
    useEffect(() => {
        if (page > 1) {
            fetchTasks(true);
        }
    }, [page]);

    // Função para deletar uma tarefa
    const handleDelete = (id: number) => {
        Alert.alert(
            'Confirmar Deleção',
            'Você tem certeza que deseja deletar esta tarefa?',
            [
                { text: 'Cancelar', style: 'cancel' },
                {
                    text: 'Deletar',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            await api.delete(`/tasks/${id}`);
                            Alert.alert('Sucesso', 'Tarefa deletada com sucesso.');
                            fetchTasks();
                        } catch (error) {
                            console.error(error);
                            Alert.alert('Erro', 'Falha ao deletar a tarefa.');
                        }
                    },
                },
            ]
        );
    };

    // Função para lidar com o logout
    const handleLogout = async () => {
        await deleteItem('token');
        navigation.replace('Login');
    };

    // Renderização de cada item da lista
    const renderItem = ({ item }: { item: Task }) => (
        <Card style={styles.card}>
            <Card.Content>
                <Title style={item.completed ? styles.completed : styles.pending}>
                    {item.title}
                </Title>
                <Paragraph>{item.description}</Paragraph>
            </Card.Content>
            <Card.Actions>
                <IconButton
                    icon="pencil"
                    containerColor="#6200ee"
                    size={20}
                    onPress={() => navigation.navigate('UpdateTask', { task: item })}
                />
                <IconButton
                    icon="delete"
                    containerColor="#B00020"
                    size={20}
                    onPress={() => handleDelete(item.ID)} // Certifique-se de que o campo é 'id'
                />
            </Card.Actions>
        </Card>
    );

    return (
        <View style={styles.container}>
            {/* Barra de Busca */}
            <View style={styles.searchContainer}>
                <RNTextInput
                    placeholder="Buscar Tarefas..."
                    value={search}
                    onChangeText={setSearch}
                    style={styles.searchInput}
                    returnKeyType="search"
                    onSubmitEditing={handleSearch}
                />
                <Button mode="contained" onPress={handleSearch} style={styles.searchButton}>
                    Buscar
                </Button>
            </View>

            {/* Lista de Tarefas */}
            {loading && page === 1 ? (
                <ActivityIndicator animating={true} size="large" style={styles.loader} />
            ) : (
                <FlatList
                    data={tasks}
                    keyExtractor={(item) => item.ID.toString()} // Ajuste para 'id' se for o campo correto
                    renderItem={renderItem}
                    refreshControl={
                        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                    }
                    onEndReached={handleLoadMore}
                    onEndReachedThreshold={0.5}
                    ListFooterComponent={
                        isFetchingMore ? <ActivityIndicator animating={true} color="#6200ee" /> : null
                    }
                    ListEmptyComponent={
                        !loading && (
                            <Text style={styles.empty}>Nenhuma tarefa encontrada.</Text>
                        )
                    }
                />
            )}

            {/* FAB para Adicionar Tarefa */}
            <FAB
                style={styles.fab}
                icon="plus"
                label="Adicionar Tarefa"
                onPress={() => navigation.navigate('CreateTask')}
                color="#ffffff"
            />

            {/* Botões Adicionais */}
            <View style={styles.buttonsContainer}>
                <FAB
                    small
                    icon="folder"
                    style={styles.button}
                    onPress={() => navigation.navigate('CategoryList')}
                />
                <FAB
                    small
                    icon="note"
                    style={styles.button}
                    onPress={() => navigation.navigate('NoteList')}
                />
                <FAB
                    small
                    icon="logout"
                    style={styles.logoutButton}
                    onPress={handleLogout}
                />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, padding: 16, backgroundColor: '#f6f6f6' },
    searchContainer: {
        flexDirection: 'row',
        marginBottom: 10,
    },
    searchInput: {
        flex: 1,
        backgroundColor: '#ffffff',
        marginRight: 10,
        paddingHorizontal: 10,
        height: 40,
        borderRadius: 4,
    },
    searchButton: {
        justifyContent: 'center',
        paddingHorizontal: 10,
    },
    card: { marginBottom: 15, backgroundColor: '#ffffff' },
    completed: { textDecorationLine: 'line-through', color: 'green' },
    pending: { color: 'black' },
    empty: { textAlign: 'center', marginTop: 20, color: 'gray', fontSize: 16 },
    fab: {
        position: 'absolute',
        margin: 16,
        right: 0,
        bottom: 80,
        backgroundColor: '#6200ee',
    },
    buttonsContainer: {
        position: 'absolute',
        flexDirection: 'row',
        justifyContent: 'space-around',
        left: 16,
        right: 16,
        bottom: 16,
    },
    button: {
        backgroundColor: '#03dac4',
        marginHorizontal: 5,
    },
    logoutButton: {
        backgroundColor: '#B00020',
        marginHorizontal: 5,
    },
    loader: {
        flex: 1,
        justifyContent: 'center',
    },
});

export default TaskListScreen;
