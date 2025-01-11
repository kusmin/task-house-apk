// src/screens/CreateTaskScreen.tsx

import React, { useState } from 'react';
import { View, StyleSheet, Alert, Platform, KeyboardAvoidingView } from 'react-native';
import { TextInput, Button, Title, useTheme } from 'react-native-paper';
import api from '../services/api';
import DateTimePicker from '@react-native-community/datetimepicker';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation';

type CreateTaskScreenNavigationProp = StackNavigationProp<
    RootStackParamList,
    'CreateTask'
>;

type Props = {
    navigation: CreateTaskScreenNavigationProp;
};

const CreateTaskScreen: React.FC<Props> = ({ navigation }) => {
    const { colors } = useTheme();
    const [title, setTitle] = useState<string>('');
    const [description, setDescription] = useState<string>('');
    const [dueDate, setDueDate] = useState<Date>(new Date());
    const [showDatePicker, setShowDatePicker] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);

    const handleCreate = async () => {
        if (!title.trim() || !description.trim()) {
            Alert.alert('Erro', 'Por favor, preencha todos os campos.');
            return;
        }

        setLoading(true);
        try {
            const isoDueDate = dueDate.toISOString();
            await api.post('/tasks', { Title: title, Description: description, Completed: false, Due_date: isoDueDate });
            Alert.alert('Sucesso', 'Tarefa criada com sucesso!');
            navigation.goBack();
        } catch (error) {
            console.error(error);
            Alert.alert('Erro', 'Falha ao criar tarefa.');
        } finally {
            setLoading(false);
        }
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

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.select({ ios: 'padding', android: undefined })}
        >
            <Title style={styles.title}>Adicionar Tarefa</Title>
            <TextInput
                label="Título"
                value={title}
                mode="outlined"
                onChangeText={setTitle}
                style={styles.input}
                left={<TextInput.Icon name="clipboard-text-outline" />}
            />
            <TextInput
                label="Descrição"
                value={description}
                mode="outlined"
                onChangeText={setDescription}
                style={styles.input}
                multiline
                numberOfLines={4}
                left={<TextInput.Icon name="text-box-outline" />}
            />
            <Button
                mode="outlined"
                onPress={showDatePickerModal}
                style={styles.dateButton}
                icon="calendar"
            >
                {`Data de Vencimento: ${dueDate.toLocaleString()}`}
            </Button>
            {showDatePicker && (
                <DateTimePicker
                    value={dueDate}
                    mode="datetime"
                    display="default"
                    onChange={onDateChange}
                />
            )}
            <Button
                mode="contained"
                onPress={handleCreate}
                style={styles.button}
                loading={loading}
                disabled={loading}
            >
                Criar Tarefa
            </Button>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, padding: 16, backgroundColor: '#f6f6f6' },
    title: { textAlign: 'center', marginBottom: 20, fontSize: 28, color: '#6200ee' },
    input: { marginBottom: 15 },
    dateButton: { marginBottom: 20 },
    button: { marginTop: 10 },
});

export default CreateTaskScreen;
