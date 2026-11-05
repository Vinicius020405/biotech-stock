import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../src/context/ThemeContext';

export default function HomeScreen({ navigation }) {
  const { theme, darkMode } = useTheme();

  const quickAccessItems = [
    {
      title: 'Estoque',
      subtitle: 'Quantidade em estoque',
      icon: 'layers',
      screen: 'Estoque', // Abre a Tab de Estoque
      iconBg: 'rgba(59, 130, 246, 0.15)',
      iconColor: '#3B82F6',
    },
    {
      title: 'Localizações',
      subtitle: 'Setores e Prateleiras',
      icon: 'location',
      screen: 'LocationScreen',
      iconBg: 'rgba(59, 130, 246, 0.15)',
      iconColor: '#3B82F6',
    },
    {
      title: 'Sensores',
      subtitle: 'Dispositivos e Status',
      icon: 'hardware-chip',
      screen: 'SensorsScreens',
      iconBg: 'rgba(59, 130, 246, 0.15)',
      iconColor: '#3B82F6',
    },
    {
      title: 'Fornecedores',
      subtitle: 'Empresas fornecedoras',
      icon: 'business',
      screen: 'FornecedoresScreens',
      iconBg: 'rgba(59, 130, 246, 0.15)',
      iconColor: '#3B82F6',
    },
    {
      title: 'Caminhões',
      subtitle: 'Frota de Transporte',
      icon: 'bus',
      screen: 'CaminhaoScreen',
      iconBg: 'rgba(59, 130, 246, 0.15)',
      iconColor: '#3B82F6',
    },
    {
      title: 'Produtos',
      subtitle: 'Cadastro de Itens',
      icon: 'cube',
      screen: 'ProductsScreens',
      iconBg: 'rgba(59, 130, 246, 0.15)',
      iconColor: '#3B82F6',
    },
    {
      title: 'Histórico',
      subtitle: 'Entradas e Saídas',
      icon: 'time',
      screen: 'Histórico', // Abre a Tab de Histórico
      iconBg: 'rgba(59, 130, 246, 0.15)',
      iconColor: '#3B82F6',
    },
    {
      title: 'Ajustes',
      subtitle: 'Configurações',
      icon: 'settings',
      screen: 'SettingsScreen',
      iconBg: 'rgba(59, 130, 246, 0.15)',
      iconColor: '#3B82F6',
    },
  ];

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.bg }]}
      showsVerticalScrollIndicator={false}
    >
      <StatusBar barStyle={darkMode ? 'light-content' : 'dark-content'} />

      {/* HEADER */}
      <View style={styles.header}>
        <View>
          <Text style={[styles.welcomeText, { color: theme.textSecondary }]}>
            Bem-vindo,
          </Text>
          <Text style={[styles.headerTitle, { color: theme.textPrimary }]}>
            Sistema de Estoque
          </Text>
        </View>

        <View style={styles.headerRight}>
          <TouchableOpacity style={[styles.qrButton, { backgroundColor: theme.card }]}>
            <Ionicons name="qr-code-outline" size={24} color="#3B82F6" />
          </TouchableOpacity>
        </View>
      </View>

      {/* ACESSO RÁPIDO */}
      <Text style={[styles.sectionTitle, { color: theme.textPrimary }]}>
        Acesso Rápido
      </Text>

      <View style={styles.gridContainer}>
        {quickAccessItems.map((item, index) => (
          <TouchableOpacity
            key={index}
            style={[styles.gridCard, { backgroundColor: theme.card }]}
            onPress={() => navigation.navigate(item.screen)}
            activeOpacity={0.7}
          >
            <View style={[styles.iconBox, { backgroundColor: item.iconBg }]}>
              <Ionicons name={item.icon} size={22} color={item.iconColor} />
            </View>
            <Text style={[styles.cardTitle, { color: theme.textPrimary }]}>
              {item.title}
            </Text>
            <Text style={[styles.cardSubtitle, { color: theme.textSecondary }]}>
              {item.subtitle}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* ÚLTIMAS MOVIMENTAÇÕES */}
      <View style={styles.sectionHeader}>
        <Text style={[styles.sectionTitle, { color: theme.textPrimary }]}>
          Últimas Movimentações
        </Text>
        <TouchableOpacity onPress={() => navigation.navigate('Histórico')}>
          <Text style={styles.seeAllText}>Ver tudo</Text>
        </TouchableOpacity>
      </View>

      <View style={[styles.movementCard, { backgroundColor: theme.card }]}>
        {/* item 1 */}
        <View style={styles.movementItem}>
          <View style={[styles.movementIcon, { backgroundColor: 'rgba(34, 197, 94, 0.15)' }]}>
            <Ionicons name="arrow-down-circle" size={22} color="#22C55E" />
          </View>
          <View style={styles.movementDetails}>
            <Text style={[styles.movementTitle, { color: theme.textPrimary }]}>
              Entrada de Material
            </Text>
            <Text style={[styles.movementSubtitle, { color: theme.textSecondary }]}>
              50x Placas de Circuito
            </Text>
          </View>
          <Text style={[styles.movementTime, { color: theme.textSecondary }]}>
            Há 15 min
          </Text>
        </View>

        <View style={[styles.divider, { backgroundColor: theme.border }]} />

        {/* item 2 */}
        <View style={styles.movementItem}>
          <View style={[styles.movementIcon, { backgroundColor: 'rgba(239, 68, 68, 0.15)' }]}>
            <Ionicons name="arrow-up-circle" size={22} color="#EF4444" />
          </View>
          <View style={styles.movementDetails}>
            <Text style={[styles.movementTitle, { color: theme.textPrimary }]}>
              Saída de Estoque
            </Text>
            <Text style={[styles.movementSubtitle, { color: theme.textSecondary }]}>
              12x Sensores de Temperatura
            </Text>
          </View>
          <Text style={[styles.movementTime, { color: theme.textSecondary }]}>
            Há 2h
          </Text>
        </View>
      </View>

      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
  },
  header: {
    marginTop: 55,
    marginBottom: 25,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  welcomeText: {
    fontSize: 14,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 2,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  qrButton: {
    width: 48,
    height: 48,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  gridCard: {
    width: '48%',
    borderRadius: 20,
    padding: 18,
    marginBottom: 15,
  },
  iconBox: {
    width: 42,
    height: 42,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 14,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  cardSubtitle: {
    fontSize: 12,
    marginTop: 4,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 15,
  },
  seeAllText: {
    color: '#3B82F6',
    fontSize: 14,
    fontWeight: '600',
  },
  movementCard: {
    borderRadius: 20,
    padding: 16,
    marginTop: 10,
  },
  movementItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  movementIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  movementDetails: {
    flex: 1,
    marginLeft: 12,
  },
  movementTitle: {
    fontSize: 15,
    fontWeight: 'bold',
  },
  movementSubtitle: {
    fontSize: 13,
    marginTop: 2,
  },
  movementTime: {
    fontSize: 12,
  },
  divider: {
    height: 1,
    marginVertical: 14,
  },
});