// src/hooks/useImagePickerPermissions.ts

import { useEffect, useState } from 'react';
import * as ImagePicker from 'expo-image-picker';
import { Alert } from 'react-native';

export const useImagePickerPermissions = () => {
    const [hasPermission, setHasPermission] = useState<boolean>(false);

    useEffect(() => {
        (async () => {
            const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
            if (status !== 'granted') {
                Alert.alert('Permissão Negada', 'Desculpe, precisamos de permissões de acesso à galeria para continuar!');
            } else {
                setHasPermission(true);
            }
        })();
    }, []);

    return hasPermission;
};
