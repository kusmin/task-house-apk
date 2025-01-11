// src/screens/CreateNoteScreen.tsx

import React, { useState, useEffect } from 'react';
import { StyleSheet, Alert, KeyboardAvoidingView, Platform, Image, TouchableOpacity, ScrollView } from 'react-native';
import { TextInput, Button, Title, useTheme } from 'react-native-paper';
import api from '../services/api';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Category, Note } from '../types';
import * as ImagePicker from 'expo-image-picker';
import { Picker as RNPicker } from '@react-native-picker/picker';
import { Text } from 'react-native-paper';

type Props = {
    route: any;
    navigation: any;
};

const CreateNoteScreen: React.FC<Props> = ({ route, navigation }) => {
    const { colors } = useTheme();
    const { category } = route.params || {};
    const [title, setTitle] = useState<string>('');
    const [content, setContent] = useState<string>('');
    const [imageURL, setImageURL] = useState<string>('');
    const [link, setLink] = useState<string>('');
    const [categoryID, setCategoryID] = useState<number | ''>(category ? category.ID : '');
    const [categories, setCategories] = useState<Category[]>([]);
    const [dueDate, setDueDate] = useState<Date>(new Date());
    const [showDatePicker, setShowDatePicker] = useState<boolean>(false);
    const [image, setImage] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);

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

    const handleCreate = async () => {
        if (!title.trim() || !content.trim()) {
            Alert.alert('Erro', 'Por favor, preencha os campos obrigatórios.');
            return;
        }

        setLoading(true);
        try {
            const isoDueDate = dueDate.toISOString();
            await api.post('/notes', {
                Title: title,
                Content: content,
                ImageURL: imageURL,
                Link: link,
                CategoryID: categoryID === '' ? null : categoryID,
                DueDate: isoDueDate,
                Completed: false, // Assumindo que uma nova nota não está concluída
            });
            Alert.alert('Sucesso', 'Nota criada com sucesso!');
            navigation.goBack();
        } catch (error) {
            console.error(error);
            Alert.alert('Erro', 'Falha ao criar nota.');
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

    const pickImage = async () => {
        // Solicitar permissões
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
            Alert.alert('Permissão Negada', 'Desculpe, precisamos de permissões para acessar a galeria!');
            return;
        }

        // Abrir Image Picker
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        if (!result.canceled && result.assets.length > 0) {
            const selectedImage = result.assets[0].uri;
            setImage(selectedImage);
            setImageURL(selectedImage); // Dependendo de como você deseja armazenar
        }
    };

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.select({ ios: 'padding', android: undefined })}
        >
            <ScrollView>
                <Title style={styles.title}>Adicionar Nota</Title>
                <TextInput
                    label="Título"
                    value={title}
                    mode="outlined"
                    onChangeText={setTitle}
                    style={styles.input}
                    left={<TextInput.Icon name="clipboard-text-outline" />}
                />
                <TextInput
                    label="Conteúdo"
                    value={content}
                    mode="outlined"
                    onChangeText={setContent}
                    style={styles.input}
                    multiline
                    numberOfLines={4}
                    left={<TextInput.Icon name="text-box-outline" />}
                />
                <TextInput
                    label="URL da Imagem (Opcional)"
                    value={imageURL}
                    mode="outlined"
                    onChangeText={setImageURL}
                    style={styles.input}
                    placeholder="https://exemplo.com/imagem.png"
                    keyboardType="url"
                    autoCapitalize="none"
                    left={<TextInput.Icon name="image-outline" />}
                />
                {/* Botão para selecionar imagem */}
                <TouchableOpacity style={styles.imagePicker} onPress={pickImage}>
                    <Text style={styles.imagePickerText}>Selecionar Imagem</Text>
                </TouchableOpacity>
                {image ? <Image source={{ uri: image }} style={styles.image} /> : null}

                <TextInput
                    label="Link (Opcional)"
                    value={link}
                    mode="outlined"
                    onChangeText={setLink}
                    style={styles.input}
                    placeholder="https://exemplo.com"
                    keyboardType="url"
                    autoCapitalize="none"
                    left={<TextInput.Icon name="link-outline" />}
                />

                <Text style={styles.label}>Categoria</Text>
                <RNPicker
                    selectedValue={categoryID}
                    style={styles.picker}
                    onValueChange={(itemValue) => setCategoryID(itemValue)}
                >
                    <RNPicker.Item label="Sem Categoria" value="" />
                    {categories.map((cat) => (
                        <RNPicker.Item key={cat.ID} label={cat.name} value={cat.ID} />
                    ))}
                </RNPicker>

                <Text style={styles.label}>Data de Vencimento</Text>
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
                    Criar Nota
                </Button>
            </ScrollView>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, padding: 16, backgroundColor: '#f6f6f6' },
    title: { textAlign: 'center', marginBottom: 20, fontSize: 28, color: '#6200ee' },
    input: { marginBottom: 15 },
    picker: { height: 50, width: '100%', backgroundColor: '#ffffff', borderRadius: 8 },
    dateButton: { marginBottom: 20 },
    button: { marginTop: 10 },
    imagePicker: {
        backgroundColor: '#2196F3',
        padding: 10,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 8,
        marginBottom: 10,
    },
    imagePickerText: {
        color: '#fff',
        fontSize: 16,
    },
    image: {
        width: '100%',
        height: 200,
        borderRadius: 8,
        marginTop: 10,
    },
    label: { fontSize: 16, marginTop: 16, marginBottom: 8 },
});

export default CreateNoteScreen;
