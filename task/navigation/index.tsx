// src/navigation/index.tsx

import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator, StackNavigationProp } from '@react-navigation/stack';

// Importar as telas
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import TaskListScreen from '../screens/TaskListScreen';
import CreateTaskScreen from '../screens/CreateTaskScreen';
import UpdateTaskScreen from '../screens/UpdateTaskScreen';
import CategoryListScreen from '../screens/CategoryListScreen';
import CreateCategoryScreen from '../screens/CreateCategoryScreen';
import NoteListScreen from '../screens/NoteListScreen';
import CreateNoteScreen from '../screens/CreateNoteScreen';
import UpdateNoteScreen from '../screens/UpdateNoteScreen';

// Definir os tipos das rotas
export type RootStackParamList = {
    Login: undefined;
    Register: undefined;
    TaskList: undefined;
    CreateTask: undefined;
    UpdateTask: { task: any };
    CategoryList: undefined;
    CreateCategory: undefined;
    NoteList: undefined;
    CreateNote: { category?: any };
    UpdateNote: { note: any };
};

const Stack = createStackNavigator<RootStackParamList>();

const AppNavigator: React.FC = () => {
    return (
        <NavigationContainer>
            <Stack.Navigator initialRouteName="Login">
                <Stack.Screen
                    name="Login"
                    component={LoginScreen}
                    options={{ headerShown: false }}
                />
                <Stack.Screen
                    name="Register"
                    component={RegisterScreen}
                    options={{ headerShown: false }}
                />
                <Stack.Screen
                    name="TaskList"
                    component={TaskListScreen}
                    options={{ title: 'Minhas Tarefas', headerLeft: () => null }}
                />
                <Stack.Screen
                    name="CreateTask"
                    component={CreateTaskScreen}
                    options={{ title: 'Adicionar Tarefa' }}
                />
                <Stack.Screen
                    name="UpdateTask"
                    component={UpdateTaskScreen}
                    options={{ title: 'Editar Tarefa' }}
                />
                <Stack.Screen
                    name="CategoryList"
                    component={CategoryListScreen}
                    options={{ title: 'Categorias' }}
                />
                <Stack.Screen
                    name="CreateCategory"
                    component={CreateCategoryScreen}
                    options={{ title: 'Adicionar Categoria' }}
                />
                <Stack.Screen
                    name="NoteList"
                    component={NoteListScreen}
                    options={{ title: 'Minhas Notas' }}
                />
                <Stack.Screen
                    name="CreateNote"
                    component={CreateNoteScreen}
                    options={{ title: 'Adicionar Nota' }}
                />
                <Stack.Screen
                    name="UpdateNote"
                    component={UpdateNoteScreen}
                    options={{ title: 'Editar Nota' }}
                />
            </Stack.Navigator>
        </NavigationContainer>
    );
};

export default AppNavigator;
