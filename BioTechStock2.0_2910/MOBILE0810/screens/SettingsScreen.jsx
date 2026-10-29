import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  Image,
  Alert,
  Modal,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../src/services/api';
import { useTheme } from '../src/context/ThemeContext'; // Import do Hook de Tema

export default function SettingsScreen({ navigation }) {
  const { darkMode, toggleDarkMode, theme } = useTheme();

  const [notifications, setNotifications] = useState(true);
  const [userData, setUserData] = useState({
    id: null,
    name: 'Carregando...',
    role: '...',
    email: '...',
  });

  // Estados para o Modal de Alteração de Senha
  const [modalVisible, setModalVisible] = useState(false);
  const [senhaAtual, setSenhaAtual] = useState('');
  const [novaSenha, setNovaSenha] = useState('');
  const [loadingSenha, setLoadingSenha] = useState(false);

  useEffect(() => {
    loadUserProfile();
    loadPreferences();
  }, []);

  const loadUserProfile = async () => {
    try {
      const userDataString = await AsyncStorage.getItem('@user_data');
      if (userDataString) {
        const user = JSON.parse(userDataString);
        setUserData({
          id: user.id_usuario || user.id || 1,
          name: user.nome || user.name || 'Utilizador',
          role: user.perfil || user.role || 'Operador de Estoque',
          email: user.email || 'sem email',
        });
      }
    } catch (error) {
      console.log('Erro ao carregar perfil local:', error);
    }
  };

  const loadPreferences = async () => {
    try {
      const savedNotif = await AsyncStorage.getItem('@pref_notificacoes');
      if (savedNotif !== null) setNotifications(JSON.parse(savedNotif));
    } catch (error) {
      console.log('Erro ao carregar preferências:', error);
    }
  };

  const handleToggleNotifications = async (value) => {
    setNotifications(value);
    await AsyncStorage.setItem('@pref_notificacoes', JSON.stringify(value));
  };

  const handleAlterarSenha = async () => {
    if (!senhaAtual.trim() || !novaSenha.trim()) {
      Alert.alert('Atenção', 'Preencha a senha atual e a nova senha.');
      return;
    }

    setLoadingSenha(true);

    try {
      let userId = userData.id;

      if (!userId) {
        const userDataString = await AsyncStorage.getItem('@user_data');
        if (userDataString) {
          const user = JSON.parse(userDataString);
          userId = user.id_usuario || user.id;
        }
      }

      if (!userId) {
        Alert.alert('Erro', 'Sessão inválida. Por favor, faça login novamente.');
        setLoadingSenha(false);
        return;
      }

      const response = await api.put(`/api/usuarios/${userId}/senha`, {
        senhaAtual: senhaAtual.trim(),
        novaSenha: novaSenha.trim(),
      });

      Alert.alert('Sucesso', response.data?.message || 'Senha alterada com sucesso!');

      setModalVisible(false);
      setSenhaAtual('');
      setNovaSenha('');
    } catch (error) {
      console.error('Erro na requisição:', error.response?.data || error.message);
      const errorMsg =
        error.response?.data?.message ||
        'Não foi possível alterar a senha. Verifique a conexão com o servidor.';
      Alert.alert('Erro', errorMsg);
    } finally {
      setLoadingSenha(false);
    }
  };

  const handleLogout = () => {
    Alert.alert('Sair da Conta', 'Deseja realmente sair da aplicação?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Sair',
        style: 'destructive',
        onPress: async () => {
          await AsyncStorage.clear();
          navigation.reset({
            index: 0,
            routes: [{ name: 'Login' }],
          });
        },
      },
    ]);
  };

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.bg }]}
      showsVerticalScrollIndicator={false}
    >
      {/* HEADER */}
      <View style={styles.header}>

        <TouchableOpacity
          style={[
            styles.backBtn,
            {
              backgroundColor: theme.card,
              borderColor: theme.border,
            }
          ]}
          onPress={() => navigation.goBack()}
        >
          <Ionicons
            name="arrow-back"
            size={23}
            color={theme.textPrimary}
          />
        </TouchableOpacity>

        <View style={styles.headerInfo}>

          <Text
            style={[
              styles.title,
              { color: theme.textPrimary }
            ]}
          >
            Configurações
          </Text>


          <Text
            style={[
              styles.subtitle,
              { color: theme.textSecondary }
            ]}
          >
            Gerencie preferências do sistema
          </Text>
        </View>
      </View>

      {/* PERFIL */}
      <View style={[styles.profileCard, { backgroundColor: theme.card }]}>
        <Image
          source={{
            uri: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=1200&auto=format&fit=crop',
          }}
          style={styles.avatar}
        />

        <View style={styles.profileInfo}>
          <Text style={[styles.userName, { color: theme.textPrimary }]}>{userData.name}</Text>
          <Text style={styles.userRole}>{userData.role}</Text>
          <Text style={[styles.userEmail, { color: theme.textSecondary }]}>{userData.email}</Text>
        </View>

        <TouchableOpacity style={styles.editButton} onPress={loadUserProfile}>
          <Ionicons name="refresh-outline" size={22} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* PREFERÊNCIAS */}
      <Text style={[styles.sectionTitle, { color: theme.textPrimary }]}>Preferências</Text>

      <View style={[styles.optionCard, { backgroundColor: theme.card }]}>
        <View style={styles.optionLeft}>
          <View style={[styles.iconBox, { backgroundColor: theme.cardIconBgBlue }]}>
            <Ionicons name="moon-outline" size={22} color="#3B82F6" />
          </View>
          <View>
            <Text style={[styles.optionTitle, { color: theme.textPrimary }]}>Modo Escuro</Text>
            <Text style={[styles.optionSubtitle, { color: theme.textSecondary }]}>
              Tema visual do aplicativo
            </Text>
          </View>
        </View>

        <Switch
          value={darkMode}
          onValueChange={toggleDarkMode}
          thumbColor={darkMode ? '#3B82F6' : '#f4f3f4'}
          trackColor={{ false: '#CBD5E1', true: '#1E3A8A' }}
        />
      </View>

      <View style={[styles.optionCard, { backgroundColor: theme.card }]}>
        <View style={styles.optionLeft}>
          <View style={[styles.iconBox, { backgroundColor: theme.cardIconBgGreen }]}>
            <Ionicons name="notifications-outline" size={22} color="#22C55E" />
          </View>
          <View>
            <Text style={[styles.optionTitle, { color: theme.textPrimary }]}>Notificações</Text>
            <Text style={[styles.optionSubtitle, { color: theme.textSecondary }]}>
              Alertas do sistema
            </Text>
          </View>
        </View>

        <Switch
          value={notifications}
          onValueChange={handleToggleNotifications}
          thumbColor={notifications ? '#22C55E' : '#f4f3f4'}
          trackColor={{ false: '#CBD5E1', true: '#14532D' }}
        />
      </View>

      {/* SEGURANÇA */}
      <Text style={[styles.sectionTitle, { color: theme.textPrimary }]}>Conta e Segurança</Text>

      <TouchableOpacity
        style={[styles.menuCard, { backgroundColor: theme.card }]}
        onPress={() => setModalVisible(true)}
      >
        <View style={styles.menuLeft}>
          <View style={[styles.iconBox, { backgroundColor: theme.cardIconBgPurple }]}>
            <Ionicons name="lock-closed-outline" size={22} color="#A855F7" />
          </View>
          <View>
            <Text style={[styles.menuTitle, { color: theme.textPrimary }]}>Alterar Senha</Text>
            <Text style={[styles.menuSubtitle, { color: theme.textSecondary }]}>
              Atualizar credenciais
            </Text>
          </View>
        </View>
        <Ionicons name="chevron-forward" size={22} color={theme.textSecondary} />
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.menuCard, { backgroundColor: theme.card }]}
        onPress={() =>
          Alert.alert(
            'Privacidade',
            'Seus dados estão protegidos com criptografia no banco de dados.'
          )
        }
      >
        <View style={styles.menuLeft}>
          <View style={[styles.iconBox, { backgroundColor: theme.cardIconBgOrange }]}>
            <Ionicons name="shield-checkmark-outline" size={22} color="#F97316" />
          </View>
          <View>
            <Text style={[styles.menuTitle, { color: theme.textPrimary }]}>Privacidade</Text>
            <Text style={[styles.menuSubtitle, { color: theme.textSecondary }]}>
              Configurações de acesso
            </Text>
          </View>
        </View>
        <Ionicons name="chevron-forward" size={22} color={theme.textSecondary} />
      </TouchableOpacity>

      {/* LOGOUT */}
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Ionicons name="log-out-outline" size={24} color="#fff" />
        <Text style={styles.logoutText}>Sair da Conta</Text>
      </TouchableOpacity>

      <View style={{ height: 50 }} />

      {/* MODAL ALTERAR SENHA */}
      <Modal visible={modalVisible} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View
            style={[
              styles.modalContent,
              { backgroundColor: theme.card, borderColor: theme.border },
            ]}
          >
            <Text style={[styles.modalTitle, { color: theme.textPrimary }]}>
              Alterar Senha
            </Text>

            <Text style={[styles.inputLabel, { color: theme.textSecondary }]}>
              Senha Atual
            </Text>
            <TextInput
              style={[
                styles.modalInput,
                {
                  backgroundColor: theme.inputBg,
                  color: theme.textPrimary,
                  borderColor: theme.border,
                },
              ]}
              placeholder="Digite a senha atual"
              placeholderTextColor={theme.textSecondary}
              secureTextEntry
              value={senhaAtual}
              onChangeText={setSenhaAtual}
            />

            <Text style={[styles.inputLabel, { color: theme.textSecondary }]}>
              Nova Senha
            </Text>
            <TextInput
              style={[
                styles.modalInput,
                {
                  backgroundColor: theme.inputBg,
                  color: theme.textPrimary,
                  borderColor: theme.border,
                },
              ]}
              placeholder="Digite a nova senha"
              placeholderTextColor={theme.textSecondary}
              secureTextEntry
              value={novaSenha}
              onChangeText={setNovaSenha}
            />

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.btnCancel}
                onPress={() => {
                  setModalVisible(false);
                  setSenhaAtual('');
                  setNovaSenha('');
                }}
              >
                <Text style={{ color: theme.textSecondary, fontWeight: '600' }}>
                  Cancelar
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.btnSave}
                onPress={handleAlterarSenha}
                disabled={loadingSenha}
              >
                {loadingSenha ? (
                  <ActivityIndicator color="#FFF" size="small" />
                ) : (
                  <Text style={{ color: '#FFF', fontWeight: 'bold' }}>
                    Salvar
                  </Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: 20 },
  header: { marginTop: 55, marginBottom: 30 },
  title: { fontSize: 32, fontWeight: 'bold' },
  subtitle: { marginTop: 5, fontSize: 15 },
  profileCard: {
    borderRadius: 28,
    padding: 22,
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: { width: 80, height: 80, borderRadius: 22 },
  profileInfo: { flex: 1, marginLeft: 18 },
  userName: { fontSize: 22, fontWeight: 'bold' },
  userRole: { color: '#3B82F6', marginTop: 5, fontWeight: '600' },
  userEmail: { marginTop: 6, fontSize: 14 },
  editButton: {
    width: 48,
    height: 48,
    backgroundColor: '#2563EB',
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginTop: 35,
    marginBottom: 18,
  },
  optionCard: {
    borderRadius: 22,
    padding: 18,
    marginBottom: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  optionLeft: { flexDirection: 'row', alignItems: 'center' },
  optionTitle: { fontSize: 17, fontWeight: 'bold' },
  optionSubtitle: { marginTop: 4, fontSize: 13 },
  menuCard: {
    borderRadius: 22,
    padding: 18,
    marginBottom: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  menuLeft: { flexDirection: 'row', alignItems: 'center' },
  menuTitle: { fontSize: 17, fontWeight: 'bold' },
  menuSubtitle: { marginTop: 4, fontSize: 13 },
  iconBox: {
    width: 50,
    height: 50,
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
  },
  logoutText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },

  /* ESTILOS DO MODAL */
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.65)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    width: '100%',
    borderRadius: 24,
    padding: 24,
    borderWidth: 1,
  },
  modalTitle: { fontSize: 22, fontWeight: 'bold', marginBottom: 20 },
  inputLabel: { fontSize: 14, marginBottom: 6, fontWeight: '500' },
  modalInput: {
    paddingHorizontal: 16,
    height: 50,
    borderRadius: 14,
    marginBottom: 16,
    borderWidth: 1,
  },
  modalButtons: { flexDirection: 'row', justifyContent: 'flex-end', marginTop: 10, gap: 12 },
  btnCancel: { paddingVertical: 12, paddingHorizontal: 18, justifyContent: 'center' },
  btnSave: {
    backgroundColor: '#2563EB',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
    justifyContent: 'center',
  },
});