import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

// Importação do Provider e Hook do Tema
import { ThemeProvider, useTheme } from './src/context/ThemeContext';

// Telas Principais (Tab Menu)
import HomeScreen from './screens/HomeScreen';
import StockScreens from './screens/StockScreen';
import EntryScreen from './screens/EntryScreen';
import ExitScreen from './screens/ExitScreen';
import HistoryScreen from './screens/HistoryScreen';

// Telas Secundárias (Stack)
import LoginScreen from './screens/LoginScreen';
import LocationScreen from './screens/LocationScreen';
import SensorsScreens from './screens/SensoresScreen';
import FornecedoresScreens from './screens/FornecedoresScreen';
import CaminhaoScreen from './screens/CaminhoesScreen';
import SettingsScreen from './screens/SettingsScreen';
import ProductsScreens from './screens/ProductsScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function TabNavigator() {
  const { theme, darkMode } = useTheme();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: {
          backgroundColor: theme.card, // Muda dinamicamente entre escuro e claro
          borderTopWidth: 1,
          borderTopColor: theme.border,
          height: 65,
        },
        tabBarIcon: ({ focused }) => {
          const icons = {
            Home: focused ? 'home' : 'home-outline',
            Estoque: focused ? 'layers' : 'layers-outline',
            Entrada: focused ? 'arrow-down-circle' : 'arrow-down-circle-outline',
            Saída: focused ? 'arrow-up-circle' : 'arrow-up-circle-outline',
            Histórico: focused ? 'time' : 'time-outline',
          };
          const iconName = icons[route.name] || 'alert-circle-outline';
          const activeColor = '#3B82F6';
          const inactiveColor = darkMode ? '#94A3B8' : '#64748B';

          return (
            <Ionicons
              name={iconName}
              size={24}
              color={focused ? activeColor : inactiveColor}
            />
          );
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Estoque" component={StockScreens} />
      <Tab.Screen name="Entrada" component={EntryScreen} />
      <Tab.Screen name="Saída" component={ExitScreen} />
      <Tab.Screen name="Histórico" component={HistoryScreen} />
    </Tab.Navigator>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <NavigationContainer>
        <Stack.Navigator
          screenOptions={{ headerShown: false }}
          initialRouteName="Login"
        >
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="MainApp" component={TabNavigator} />
          <Stack.Screen name="LocationScreen" component={LocationScreen} />
          <Stack.Screen name="SensorsScreens" component={SensorsScreens} />
          <Stack.Screen name="CaminhaoScreen" component={CaminhaoScreen} />
          <Stack.Screen name="SettingsScreen" component={SettingsScreen} />
          <Stack.Screen name="ProductsScreens" component={ProductsScreens} />
          <Stack.Screen name="FornecedoresScreens" component={FornecedoresScreens} />
          <Stack.Screen name="StockScreens" component={StockScreens} />
        </Stack.Navigator>
      </NavigationContainer>
    </ThemeProvider>
  );
}



// INSTRUÇÕES PARA RODAR O MOBILE 
// BAIXAR NO TERMINAL OS SEGUINTES