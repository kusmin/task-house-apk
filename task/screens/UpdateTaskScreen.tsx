// src/screens/UpdateTaskScreen.js

import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, Switch, Platform } from 'react-native';
import api from '../services/api';
import DateTimePicker from '@react-native-community/datetimepicker';

const UpdateTaskScreen = ({ route, navigation }) => {
    const { task } = route.params;
    const [title, setTitle] = useState(task.title);
    const [description, setDescription] = useState(task.description);
    const [completed, setCompleted] = useState(task.completed);
    const [dueDate, setDueDate] = useState(new Date(task.due_date));
    const [showDatePicker, setShowDatePicker] = useState(false);

    const handleUpdate = async () => {
        if (!title || !description || !dueDate) {
            Alert.alert('Erro', 'Por favor, preencha todos os campos.');
            return;
        }

        try {
            const isoDueDate = dueDate.toISOString();
            await api.put(`/tasks/${task.ID}`, { title, description, completed, due_date: isoDueDate });
            Alert.alert('Sucesso', 'Tarefa atualizada com sucesso!');
            navigation.goBack();
        } catch (error) {
            console.error(error);
            Alert.alert('Erro', 'Falha ao atualizar tarefa.');
        }
    };

    const handleDelete = async () => {
        Alert.alert(
            'Confirmação',
            'Tem certeza que deseja deletar esta tarefa?',
            [
                { text: 'Cancelar', style: 'cancel' },
                { text: 'Deletar', style: 'destructive', onPress: async () => {
                        try {
                            await api.delete(`/tasks/${task.ID}`);
                            Alert.alert('Sucesso', 'Tarefa deletada com sucesso!');
                            navigation.goBack();
                        } catch (error) {
                            console.error(error);
                            Alert.alert('Erro', 'Falha ao deletar tarefa.');
                        }
                    }},
            ]
        );
    };

    const showDatePickerModal = () => {
        setShowDatePicker(true);
    };

    const onDateChange = (event, selectedDate) => {
        setShowDatePicker(Platform.OS === 'ios');
        if (selectedDate) {
            setDueDate(selectedDate);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.label}>Título</Text>
            <TextInput
                style={styles.input}
                value={title}
                onChangeText={setTitle}
                placeholder="Ex: Comprar leite"
            />
            <Text style={styles.label}>Descrição</Text>
            <TextInput
                style={styles.input}
                value={description}
                onChangeText={setDescription}
                placeholder="Ex: Comprar 2 litros de leite"
            />
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
            <Button title="Atualizar Tarefa" onPress={handleUpdate} />
            <Button title="Deletar Tarefa" onPress={handleDelete} color="red" />
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, padding: 16 },
    label: { fontSize: 16, marginTop: 16 },
    input: { borderWidth: 1, padding: 12, marginTop: 8, borderRadius: 8 },
    switchContainer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 16 },
});

export default UpdateTaskScreen;
