// src/screens/UpdateNoteScreen.tsx

import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, Switch, Platform, Linking } from 'react-native';
import api from '../services/api';
import { Picker as RNPicker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Note, Category } from '../types';

const UpdateNoteScreen: React.FC<{ route: any; navigation: any }> = ({ route, navigation }) => {
    const { note } = route.params;
    const [title, setTitle] = useState<string>(note.Title);
    const [content, setContent] = useState<string>(note.Content);
    const [imageURL, setImageURL] = useState<string>(note.ImageURL || '');
    const [link, setLink] = useState<string>(note.Link || '');
    const [categoryID, setCategoryID] = useState<number | ''>(note.CategoryID || '');
    const [categories, setCategories] = useState<Category[]>([]);
    const [completed, setCompleted] = useState<boolean>(note.Completed || false);
    const [dueDate, setDueDate] = useState<Date>(note.DueDate ? new Date(note.DueDate) : new Date());
    const [showDatePicker, setShowDatePicker] = useState<boolean>(false);

    // Buscar categorias quando o componente monta
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await api.get<Category[]>('/categories');
                setCategories(response.data);
            } catch (error) {
                console.error(error);
                Alert.alert('Erro', 'Falha ao buscar categorias.');
            }
        };
        fetchCategories();
    }, []);

    const handleUpdate = async () => {
        if (!title || !content) {
            Alert.alert('Erro', 'Por favor, preencha os campos obrigatórios.');
            return;
        }

        try {
            const isoDueDate = dueDate.toISOString();
            await api.put(`/notes/${note.ID}`, { title, content, image_url: imageURL, link, category_id: categoryID, completed, due_date: isoDueDate });
            Alert.alert('Sucesso', 'Nota atualizada com sucesso!');
            navigation.goBack();
        } catch (error) {
            console.error(error);
            Alert.alert('Erro', 'Falha ao atualizar nota.');
        }
    };

    const handleDelete = async () => {
        Alert.alert(
            'Confirmação',
            'Tem certeza que deseja deletar esta nota?',
            [
                { text: 'Cancelar', style: 'cancel' },
                { text: 'Deletar', style: 'destructive', onPress: async () => {
                        try {
                            await api.delete(`/notes/${note.ID}`);
                            Alert.alert('Sucesso', 'Nota deletada com sucesso!');
                            navigation.goBack();
                        } catch (error) {
                            console.error(error);
                            Alert.alert('Erro', 'Falha ao deletar nota.');
                        }
                    }},
            ]
        );
    };

    const showDatePickerModal = () => {
        setShowDatePicker(true);
    };

    const onDateChange = (event: any, selectedDate?: Date) => {
        setShowDatePicker(Platform.OS === 'ios');
        if (selectedDate) {
            setDueDate(selectedDate);
        }
    };

    const openLink = () => {
        if (link) {
            Linking.openURL(link);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.label}>Título</Text>
            <TextInput
                style={styles.input}
                value={title}
                onChangeText={setTitle}
                placeholder="Ex: Reunião de Projeto"
            />
            <Text style={styles.label}>Conteúdo</Text>
            <TextInput
                style={[styles.input, { height: 100 }]}
                value={content}
                onChangeText={setContent}
                placeholder="Detalhes da nota..."
                multiline
            />
            <Text style={styles.label}>URL da Imagem (Opcional)</Text>
            <TextInput
                style={styles.input}
                value={imageURL}
                onChangeText={setImageURL}
                placeholder="https://exemplo.com/imagem.png"
                keyboardType="url"
                autoCapitalize="none"
            />
            <Text style={styles.label}>Link (Opcional)</Text>
            <TextInput
                style={styles.input}
                value={link}
                onChangeText={setLink}
                placeholder="https://exemplo.com"
                keyboardType="url"
                autoCapitalize="none"
            />
            <Text style={styles.label}>Categoria</Text>
            <RNPicker
                selectedValue={categoryID}
                style={styles.picker}
                onValueChange={(itemValue) => setCategoryID(itemValue)}
            >
                <RNPicker.Item label="Sem Categoria" value="" />
                {categories.map((cat) => (
                    <RNPicker.Item key={cat.ID} label={cat.Name} value={cat.ID} />
                ))}
            </RNPicker>
            <View style={styles.switchContainer}>
                <Text style={styles.label}>Concluída</Text>
                <Switch
                    value={completed}
                    onValueChange={setCompleted}
                />
            </View>
            <Text style={styles.label}>Data de Vencimento</Text>
            <Button title={dueDate.toLocaleString()} onPress={showDatePickerModal} />
            {showDatePicker && (
                <DateTimePicker
                    value={dueDate}
                    mode="datetime"
                    display="default"
                    onChange={onDateChange}
                />
            )}
            <Button title="Atualizar Nota" onPress={handleUpdate} />
            {link ? <Button title="Abrir Link" onPress={openLink} /> : null}
            <Button title="Deletar Nota" onPress={handleDelete} color="red" />
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, padding: 16 },
    label: { fontSize: 16, marginTop: 16 },
    input: { borderWidth: 1, padding: 12, marginTop: 8, borderRadius: 8 },
    picker: { height: 50, width: '100%' },
    switchContainer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 16 },
});

export default UpdateNoteScreen;
