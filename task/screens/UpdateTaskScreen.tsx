// src/screens/UpdateTaskScreen.tsx

import React, { useState } from 'react';
import { View, StyleSheet, Alert, Platform, KeyboardAvoidingView } from 'react-native';
import { TextInput, Button, Title, Switch, useTheme } from 'react-native-paper';
import api from '../services/api';
import DateTimePicker from '@react-native-community/datetimepicker';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation';
import { RouteProp } from '@react-navigation/native';
import { Task } from '../types'; // Certifique-se de que o tipo Task está definido corretamente

type UpdateTaskScreenRouteProp = RouteProp<RootStackParamList, 'UpdateTask'>;

type UpdateTaskScreenNavigationProp = StackNavigationProp<
    RootStackParamList,
    'UpdateTask'
>;

type Props = {
    route: UpdateTaskScreenRouteProp;
    navigation: UpdateTaskScreenNavigationProp;
};

const UpdateTaskScreen: React.FC<Props> = ({ route, navigation }) => {
    const { colors } = useTheme();
    const { task } = route.params;
    const [title, setTitle] = useState<string>(task.title);
    const [description, setDescription] = useState<string>(task.description);
    const [completed, setCompleted] = useState<boolean>(task.completed);
    const [dueDate, setDueDate] = useState<Date>(new Date(task.due_date));
    const [showDatePicker, setShowDatePicker] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);

    const handleUpdate = async () => {
        if (!title.trim() || !description.trim()) {
            Alert.alert('Erro', 'Por favor, preencha todos os campos.');
            return;
        }

        setLoading(true);
        try {
            const isoDueDate = dueDate.toISOString();
            await api.put(`/tasks/${task.ID}`, {
                Title: title,
                Description: description,
                Completed: completed,
                Due_date: isoDueDate,
            });
            Alert.alert('Sucesso', 'Tarefa atualizada com sucesso!');
            navigation.goBack();
        } catch (error) {
            console.error(error);
            Alert.alert('Erro', 'Falha ao atualizar tarefa.');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = () => {
        Alert.alert(
            'Confirmação',
            'Tem certeza que deseja deletar esta tarefa?',
            [
                { text: 'Cancelar', style: 'cancel' },
                {
                    text: 'Deletar',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            await api.delete(`/tasks/${task.ID}`);
                            Alert.alert('Sucesso', 'Tarefa deletada com sucesso!');
                            navigation.goBack();
                        } catch (error) {
                            console.error(error);
                            Alert.alert('Erro', 'Falha ao deletar tarefa.');
                        }
                    },
                },
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

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.select({ ios: 'padding', android: undefined })}
        >
            <Title style={styles.title}>Editar Tarefa</Title>
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
            <View style={styles.switchContainer}>
                <Title>Concluída</Title>
                <Switch
                    value={completed}
                    onValueChange={() => setCompleted(!completed)}
                    color={colors.primary}
                />
            </View>
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
                onPress={handleUpdate}
                style={styles.button}
                loading={loading}
                disabled={loading}
            >
                Atualizar Tarefa
            </Button>
            <Button
                mode="outlined"
                onPress={handleDelete}
                style={styles.deleteButton}
                color="#B00020"
            >
                Deletar Tarefa
            </Button>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, padding: 16, backgroundColor: '#f6f6f6' },
    title: { textAlign: 'center', marginBottom: 20, fontSize: 28, color: '#6200ee' },
    input: { marginBottom: 15 },
    switchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginVertical: 16,
    },
    dateButton: { marginBottom: 20 },
    button: { marginTop: 10 },
    deleteButton: { marginTop: 10, borderColor: '#B00020' },
});

export default UpdateTaskScreen;
