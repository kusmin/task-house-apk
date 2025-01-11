// src/screens/NoteListScreen.tsx

import React, { useEffect, useState } from 'react';
import { View, StyleSheet, FlatList, Alert, TextInput as RNTextInput } from 'react-native';
import { Text, Card, Title, Paragraph, FAB, IconButton, useTheme, ActivityIndicator, Button } from 'react-native-paper';
import api, { getWithParams } from '../services/api';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation';

type Note = {
    id: number;
    title: string;
    content: string;
    image_url?: string;
    link?: string;
    category?: {
        id: number;
        name: string;
    };
};

type NoteListScreenNavigationProp = StackNavigationProp<
    RootStackParamList,
    'NoteList'
>;

type Props = {
    navigation: NoteListScreenNavigationProp;
};

const NoteListScreen: React.FC<Props> = ({ navigation }) => {
    const { colors } = useTheme();
    const [notes, setNotes] = useState<Note[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [search, setSearch] = useState<string>('');
    const [page, setPage] = useState<number>(1);
    const [lastPage, setLastPage] = useState<number>(1);

    useEffect(() => {
        fetchNotes();
        const unsubscribe = navigation.addListener('focus', () => {
            fetchNotes();
        });

        return unsubscribe;
    }, [navigation, page, search]);

    const fetchNotes = async () => {
        setLoading(true);
        try {
            const params = {
                search: search,
                page: page,
                limit: 10,
            };
            const response = await getWithParams('/notes', params);
            if (page === 1) {
                setNotes(response.data);
            } else {
                setNotes((prevNotes) => [...prevNotes, ...response.data]);
            }
            setLastPage(response.pagination.last_page);
        } catch (error) {
            console.error(error);
            Alert.alert('Erro', 'Falha ao carregar notas.');
        } finally {
            setLoading(false);
        }
    };

    const handleLoadMore = () => {
        if (page < lastPage && !loading) {
            setPage(page + 1);
        }
    };

    const handleSearch = () => {
        setPage(1);
        fetchNotes();
    };

    const renderItem = ({ item }: { item: Note }) => (
        <Card style={styles.card}>
            <Card.Content>
                <Title>{item.title}</Title>
                <Paragraph>{item.content}</Paragraph>
                {item.category && (
                    <Text style={styles.categoryText}>Categoria: {item.category.name}</Text>
                )}
                {item.image_url && (
                    <Image source={{ uri: item.image_url }} style={styles.image} />
                )}
                {item.link && (
                    <Text style={styles.linkText} onPress={() => Linking.openURL(item.link)}>
                        {item.link}
                    </Text>
                )}
            </Card.Content>
            <Card.Actions>
                <IconButton
                    icon="pencil"
                    color={colors.primary}
                    size={20}
                    onPress={() => navigation.navigate('UpdateNote', { note: item })}
                />
                <IconButton
                    icon="delete"
                    color={colors.error}
                    size={20}
                    onPress={() => confirmDelete(item.id)}
                />
            </Card.Actions>
        </Card>
    );

    const confirmDelete = (id: number) => {
        Alert.alert(
            'Confirmar Deleção',
            'Você tem certeza que deseja deletar esta nota?',
            [
                { text: 'Cancelar', style: 'cancel' },
                { text: 'Deletar', style: 'destructive', onPress: () => deleteNote(id) },
            ]
        );
    };

    const deleteNote = async (id: number) => {
        try {
            await api.delete(`/notes/${id}`);
            Alert.alert('Sucesso', 'Nota deletada com sucesso.');
            setPage(1);
            fetchNotes();
        } catch (error) {
            console.error(error);
            Alert.alert('Erro', 'Falha ao deletar a nota.');
        }
    };

    return (
        <View style={styles.container}>
            {/* Barra de Busca */}
            <View style={styles.searchContainer}>
                <RNTextInput
                    placeholder="Buscar Notas..."
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

            {/* Lista de Notas */}
            {loading && page === 1 ? (
                <ActivityIndicator animating={true} color={colors.primary} style={styles.loader} />
            ) : (
                <FlatList
                    data={notes}
                    renderItem={renderItem}
                    keyExtractor={(item) => item.ID.toString()}
                    contentContainerStyle={styles.list}
                    onEndReached={handleLoadMore}
                    onEndReachedThreshold={0.5}
                    ListFooterComponent={
                        loading && page > 1 ? <ActivityIndicator animating={true} color={colors.primary} /> : null
                    }
                    ListEmptyComponent={
                        !loading && (
                            <Text style={styles.emptyText}>Nenhuma nota encontrada.</Text>
                        )
                    }
                />
            )}

            {/* FAB para Adicionar Nota */}
            <FAB
                style={styles.fab}
                icon="plus"
                label="Adicionar Nota"
                onPress={() => navigation.navigate('CreateNote')}
                color="#ffffff"
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f6f6f6',
    },
    searchContainer: {
        flexDirection: 'row',
        padding: 10,
        alignItems: 'center',
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
        paddingHorizontal: 15,
        height: 40,
        justifyContent: 'center',
    },
    list: {
        paddingHorizontal: 20,
    },
    card: {
        marginBottom: 15,
        backgroundColor: '#ffffff',
    },
    fab: {
        position: 'absolute',
        margin: 16,
        right: 0,
        bottom: 0,
        backgroundColor: '#6200ee',
    },
    loader: {
        marginTop: 20,
    },
    emptyText: {
        textAlign: 'center',
        marginTop: 50,
        fontSize: 18,
        color: '#777777',
    },
    categoryText: {
        marginTop: 10,
        fontStyle: 'italic',
        color: '#777777',
    },
    image: {
        width: '100%',
        height: 150,
        marginTop: 10,
        borderRadius: 8,
    },
    linkText: {
        marginTop: 10,
        color: '#6200ee',
        textDecorationLine: 'underline',
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
        paddingHorizontal: 15,
        height: 40,
        justifyContent: 'center',
    },
});

export default NoteListScreen;
