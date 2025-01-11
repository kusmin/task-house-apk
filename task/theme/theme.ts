import { DefaultTheme } from 'react-native-paper';

const theme = {
    ...DefaultTheme,
    colors: {
        ...DefaultTheme.colors,
        primary: '#6200ee', // Cor primária
        accent: '#03dac4',  // Cor de destaque
        background: '#f6f6f6',
        surface: '#ffffff',
        text: '#000000',
        error: '#B00020',
    },
};

export default theme;