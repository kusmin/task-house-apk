// src/screens/CreateNoteScreen.tsx

import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, Picker, Platform, Image, TouchableOpacity } from 'react-native';
import api from '../services/api';
import { Picker as RNPicker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Category } from '../types';
import * as ImagePicker from 'expo-image-picker';

const CreateNoteScreen: React.FC<{ route: any; navigation: any }> = ({ route, navigation }) => {
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
        if (!title || !content) {
            Alert.alert('Erro', 'Por favor, preencha os campos obrigatórios.');
            return;
        }

        try {
            const isoDueDate = dueDate.toISOString();
            await api.post('/notes', { title, content, image_url: imageURL, link, category_id: categoryID, due_date: isoDueDate });
            Alert.alert('Sucesso', 'Nota criada com sucesso!');
            navigation.goBack();
        } catch (error) {
            console.error(error);
            Alert.alert('Erro', 'Falha ao criar nota.');
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

        if (!result.canceled) {
            setImage(result.assets[0].uri);
            setImageURL(result.assets[0].uri); // Dependendo de como você deseja armazenar
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
            {/* Botão para selecionar imagem */}
            <TouchableOpacity style={styles.imagePicker} onPress={pickImage}>
                <Text style={styles.imagePickerText}>Selecionar Imagem</Text>
            </TouchableOpacity>
            {image ? <Image source={{ uri: image }} style={styles.image} /> : null}

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
            <Button title="Criar Nota" onPress={handleCreate} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, padding: 16 },
    label: { fontSize: 16, marginTop: 16 },
    input: { borderWidth: 1, padding: 12, marginTop: 8, borderRadius: 8 },
    picker: { height: 50, width: '100%' },
    imagePicker: {
        backgroundColor: '#2196F3',
        padding: 10,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 8,
    },
    imagePickerText: {
        color: '#fff',
        fontSize: 16,
    },
    image: {
        width: 100,
        height: 100,
        marginTop: 10,
        borderRadius: 8,
    },
});

export default CreateNoteScreen;
