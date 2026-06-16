import React, { useState } from 'react';

import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  Image,
} from 'react-native';

import { Ionicons } from '@expo/vector-icons';

export default function SettingsScreen() {
  const [darkMode, setDarkMode] =
    useState(true);

  const [notifications, setNotifications] =
    useState(true);

  return (
    <ScrollView
      style={styles.container}
      showsVerticalScrollIndicator={false}
    >
      {/* HEADER */}

      <View style={styles.header}>
        <Image
          source={require('../assets/logo.png')}
          style={styles.logo}
          resizeMode="contain"
        />

        <Text style={styles.title}>
          Configurações
        </Text>

        <Text style={styles.subtitle}>
          Gerencie preferências do sistema
        </Text>
      </View>

      {/* PERFIL */}

      <View style={styles.profileCard}>
        <Image
          source={require('../assets/user.jpg')}
          style={styles.avatar}
        />

        <View style={styles.profileInfo}>
          <Text style={styles.userName}>
            Kaique
          </Text>

          <Text style={styles.userRole}>
            Administrador Geral
          </Text>

          <Text style={styles.userEmail}>
            kaique.palomo@aluno.senai.br
          </Text>
        </View>

        <TouchableOpacity
          style={styles.editButton}
        >
          <Ionicons
            name="create-outline"
            size={22}
            color="#fff"
          />
        </TouchableOpacity>
      </View>

      {/* PREFERÊNCIAS */}

      <Text style={styles.sectionTitle}>
        Preferências
      </Text>

      <View style={styles.optionCard}>
        <View style={styles.optionLeft}>
          <View style={styles.iconBlue}>
            <Ionicons
              name="moon-outline"
              size={22}
              color="#38BDF8"
            />
          </View>

          <View>
            <Text style={styles.optionTitle}>
              Modo Escuro
            </Text>

            <Text style={styles.optionSubtitle}>
              Tema visual do aplicativo
            </Text>
          </View>
        </View>

        <Switch
          value={darkMode}
          onValueChange={setDarkMode}
        />
      </View>

      <View style={styles.optionCard}>
        <View style={styles.optionLeft}>
          <View style={styles.iconGreen}>
            <Ionicons
              name="notifications-outline"
              size={22}
              color="#22C55E"
            />
          </View>

          <View>
            <Text style={styles.optionTitle}>
              Notificações
            </Text>

            <Text style={styles.optionSubtitle}>
              Alertas do sistema
            </Text>
          </View>
        </View>

        <Switch
          value={notifications}
          onValueChange={setNotifications}
        />
      </View>

      {/* SEGURANÇA */}

      <Text style={styles.sectionTitle}>
        Conta e Segurança
      </Text>

      <TouchableOpacity style={styles.menuCard}>
        <View style={styles.menuLeft}>
          <View style={styles.iconPurple}>
            <Ionicons
              name="lock-closed-outline"
              size={22}
              color="#C084FC"
            />
          </View>

          <View>
            <Text style={styles.menuTitle}>
              Alterar Senha
            </Text>

            <Text style={styles.menuSubtitle}>
              Atualizar credenciais
            </Text>
          </View>
        </View>

        <Ionicons
          name="chevron-forward"
          size={22}
          color="#94A3B8"
        />
      </TouchableOpacity>

      <TouchableOpacity style={styles.menuCard}>
        <View style={styles.menuLeft}>
          <View style={styles.iconOrange}>
            <Ionicons
              name="shield-checkmark-outline"
              size={22}
              color="#FB923C"
            />
          </View>

          <View>
            <Text style={styles.menuTitle}>
              Privacidade
            </Text>

            <Text style={styles.menuSubtitle}>
              Configurações de acesso
            </Text>
          </View>
        </View>

        <Ionicons
          name="chevron-forward"
          size={22}
          color="#94A3B8"
        />
      </TouchableOpacity>

      {/* LOGOUT */}

      <TouchableOpacity style={styles.logoutButton}>
        <Ionicons
          name="log-out-outline"
          size={24}
          color="#fff"
        />

        <Text style={styles.logoutText}>
          Sair da Conta
        </Text>
      </TouchableOpacity>

      <View style={{ height: 50 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F4F4F4',
    paddingHorizontal: 20,
  },

  header: {
    marginTop: 35,
    marginBottom: 30,
    alignItems: 'center',
  },

  logo: {
    width: 140,
    height: 100,
    marginBottom: 20,
  },

  title: {
    color: '#111827',
    fontSize: 32,
    fontWeight: 'bold',
  },

  subtitle: {
    color: '#6B7280',
    marginTop: 5,
    fontSize: 15,
  },

  profileCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 28,
    padding: 22,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 5,
    marginBottom: 15,
  },

  avatar: {
    width: 80,
    height: 80,
    borderRadius: 22,
  },

  profileInfo: {
    flex: 1,
    marginLeft: 18,
  },

  userName: {
    color: '#111827',
    fontSize: 22,
    fontWeight: 'bold',
  },

  userRole: {
    color: '#28A9F6',
    marginTop: 5,
    fontWeight: '600',
  },

  userEmail: {
    color: '#6B7280',
    marginTop: 6,
    fontSize: 14,
  },

  editButton: {
    width: 48,
    height: 48,
    backgroundColor: '#28A9F6',
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },

  sectionTitle: {
    color: '#111827',
    fontSize: 22,
    fontWeight: 'bold',
    marginTop: 35,
    marginBottom: 18,
  },

  optionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    padding: 18,
    marginBottom: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    elevation: 4,
  },

  optionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  optionTitle: {
    color: '#111827',
    fontSize: 17,
    fontWeight: 'bold',
  },

  optionSubtitle: {
    color: '#6B7280',
    marginTop: 4,
    fontSize: 13,
  },

  menuCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    padding: 18,
    marginBottom: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    elevation: 4,
  },

  menuLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  menuTitle: {
    color: '#111827',
    fontSize: 17,
    fontWeight: 'bold',
  },

  menuSubtitle: {
    color: '#6B7280',
    marginTop: 4,
    fontSize: 13,
  },

  iconBlue: {
    width: 50,
    height: 50,
    backgroundColor: '#DBEAFE',
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },

  iconGreen: {
    width: 50,
    height: 50,
    backgroundColor: '#DCFCE7',
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },

  iconPurple: {
    width: 50,
    height: 50,
    backgroundColor: '#F3E8FF',
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },

  iconOrange: {
    width: 50,
    height: 50,
    backgroundColor: '#FFEDD5',
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },

  logoutButton: {
    backgroundColor: '#DC2626',
    height: 65,
    borderRadius: 22,
    marginTop: 35,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
    marginBottom: 30,
  },

  logoutText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});