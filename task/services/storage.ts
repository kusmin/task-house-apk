import { Platform } from 'react-native';
import * as SecureStore from 'expo-secure-store';

// Verifica se a plataforma é web
const isWeb = Platform.OS === 'web';

/**
 * Armazena um item de forma segura.
 * @param key - A chave associada ao valor.
 * @param value - O valor a ser armazenado.
 */
export const setItem = async (key: string, value: string): Promise<void> => {
    if (isWeb) {
        localStorage.setItem(key, value);
        return Promise.resolve();
    } else {
        return SecureStore.setItemAsync(key, value);
    }
};

/**
 * Recupera um item armazenado.
 * @param key - A chave associada ao valor.
 * @returns O valor armazenado ou null se não encontrado.
 */
export const getItem = async (key: string): Promise<string | null> => {
    if (isWeb) {
        const value = localStorage.getItem(key);
        return Promise.resolve(value);
    } else {
        return SecureStore.getItemAsync(key);
    }
};

/**
 * Remove um item armazenado.
 * @param key - A chave associada ao valor.
 */
export const deleteItem = async (key: string): Promise<void> => {
    if (isWeb) {
        localStorage.removeItem(key);
        return Promise.resolve();
    } else {
        return SecureStore.deleteItemAsync(key);
    }
}