// src/screens/CreateTaskScreen.js

import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, Platform } from 'react-native';
import api from '../services/api';
import DateTimePicker from '@react-native-community/datetimepicker';

// @ts-ignore
const CreateTaskScreen = ({ navigation }) => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [dueDate, setDueDate] = useState(new Date());
    const [showDatePicker, setShowDatePicker] = useState(false);

    const handleCreate = async () => {
        if (!title || !description || !dueDate) {
            Alert.alert('Erro', 'Por favor, preencha todos os campos.');
            return;
        }

        try {
            const isoDueDate = dueDate.toISOString();
            await api.post('/tasks', { title, description, completed: false, due_date: isoDueDate });
            Alert.alert('Sucesso', 'Tarefa criada com sucesso!');
            navigation.goBack();
        } catch (error) {
            console.error(error);
            Alert.alert('Erro', 'Falha ao criar tarefa.');
        }
    };

    const showDatePickerModal = () => {
        setShowDatePicker(true);
    };

    const onDateChange = (event: any, selectedDate: React.SetStateAction<Date>) => {
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
            <Button title="Criar Tarefa" onPress={handleCreate} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, padding: 16 },
    label: { fontSize: 16, marginTop: 16 },
    input: { borderWidth: 1, padding: 12, marginTop: 8, borderRadius: 8 },
});

export default CreateTaskScreen;
