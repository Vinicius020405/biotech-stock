import React from 'react';

import {
  createNativeStackNavigator,
} from '@react-navigation/native-stack';

import {
  createBottomTabNavigator,
} from '@react-navigation/bottom-tabs';

import {
  createDrawerNavigator,
} from '@react-navigation/drawer';

import { Ionicons } from '@expo/vector-icons';

import GestaoFornecedor from '../../screens/GestaoFornecedor';

/* TELAS */

import LoginScreen from '../../screens/LoginScreen';
import HomeScreen from '../../screens/HomeScreen';
import ProductsScreen from '../../screens/ProductsScreen.jsx';
import EntryScreen from '../../screens/EntryScreen';
import ExitScreen from '../../screens/ExitScreen';
import HistoryScreen from '../../screens/HistoryScreen';
import SettingsScreen from '../../screens/SettingsScreen';
import CaminhoesScreen from '../../screens/CaminhoesScreen';
import SensoresScreen from '../../screens/SensoresScreen';    
import RegisterScreen from '../../screens/RegisterScreen.jsx';

/* NAVIGATORS */

const Stack = createNativeStackNavigator();

const Tab = createBottomTabNavigator();

const Drawer = createDrawerNavigator();

/* BOTTOM TABS */

function BottomRoutes() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,

        tabBarStyle: {
          backgroundColor: '#111827',
          borderTopWidth: 0,
          height: 65,
          paddingBottom: 8,
          paddingTop: 5,
        },

        tabBarActiveTintColor: '#3B82F6',

        tabBarInactiveTintColor: '#9CA3AF',
      }}
    >
      {/* HOME */}

      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarIcon: ({
            color,
            size,
          }) => (
            <Ionicons
              name="home"
              size={size}
              color={color}
            />
          ),
        }}
      />

      {/* PRODUTOS */}

      <Tab.Screen
        name="Produtos"
        component={ProductsScreen}
        options={{
          tabBarIcon: ({
            color,
            size,
          }) => (
            <Ionicons
              name="cube"
              size={size}
              color={color}
            />
          ),
        }}
      />

      {/* HISTÓRICO */}

      <Tab.Screen
        name="Histórico"
        component={HistoryScreen}
        options={{
          tabBarIcon: ({
            color,
            size,
          }) => (
            <Ionicons
              name="time"
              size={size}
              color={color}
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

/* DRAWER */

function DrawerRoutes() {
  return (
    <Drawer.Navigator
      screenOptions={{
        headerStyle: {
        backgroundColor: '#03273c',
},

        headerTintColor: '#fff',

        drawerStyle: {
          backgroundColor: '#03273c',
          width: 280,
        },

        drawerActiveBackgroundColor:
          '#03273c',

        drawerActiveTintColor: '#fff',

        drawerInactiveTintColor:
          '#CBD5E1',

        drawerLabelStyle: {
          marginLeft: -10,
          fontSize: 15,
        },
      }}
    >
      {/* DASHBOARD */}

      <Drawer.Screen
        name="Dashboard"
        component={BottomRoutes}
        options={{
          title: 'Início',

          drawerIcon: ({
            color,
            size,
          }) => (
            <Ionicons
              name="home-outline"
              size={size}
              color={color}
            />
          ),
        }}
      />

      {/* ENTRADA */}

      <Drawer.Screen
        name="Pedido Entrada"
        component={EntryScreen}
        options={{
          drawerIcon: ({
            color,
            size,
          }) => (
            <Ionicons
              name="arrow-down-circle-outline"
              size={size}
              color={color}
            />
          ),
        }}
      />

      {/* SAÍDA */}

      <Drawer.Screen
        name="Pedido Saída"
        component={ExitScreen}
        options={{
          drawerIcon: ({
            color,
            size,
          }) => (
            <Ionicons
              name="arrow-up-circle-outline"
              size={size}
              color={color}
            />
          ),
        }}
      />

      {/* FORNECEDOR */}

<Drawer.Screen
  name="Fornecedor"
  component={GestaoFornecedor}
  options={{
    drawerIcon: ({
      color,
      size,
    }) => (
      <Ionicons
        name="people-outline"
        size={size}
        color={color}
      />
    ),
  }}
/>

{/* CAMINHÕES */}

<Drawer.Screen
  name="Caminhões"
  component={CaminhoesScreen}
  options={{
    drawerIcon: ({
      color,
      size,
    }) => (
      <Ionicons
        name="bus-outline"
        size={22}
        color={color}
      />
    ),

    drawerLabelStyle: {
      fontSize: 16,
      fontWeight: '600',
    },
  }}
/>

{/* SENSORES */}

<Drawer.Screen
  name="Sensores"
  component={SensoresScreen}
  options={{
    drawerIcon: ({
      color,
      size,
    }) => (
      <Ionicons
        name="hardware-chip-outline"
        size={size}
        color={color}
      />
    ),
  }}
/>

      {/* CONFIGURAÇÕES */}

      <Drawer.Screen
        name="Configurações"
        component={SettingsScreen}
        options={{
          drawerIcon: ({
            color,
            size,
          }) => (
            <Ionicons
              name="settings-outline"
              size={size}
              color={color}
            />
          ),
        }}
      />
    </Drawer.Navigator>
  );
}

/* ROTAS PRINCIPAIS */

export default function Routes() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      {/* LOGIN */}

      <Stack.Screen
        name="Login"
        component={LoginScreen}
      />

      {/* CADASTRO */}

<Stack.Screen
  name="Register"
  component={RegisterScreen}
/>

      {/* APP */}

      <Stack.Screen
        name="App"
        component={DrawerRoutes}
      />
    </Stack.Navigator>
  );
}


