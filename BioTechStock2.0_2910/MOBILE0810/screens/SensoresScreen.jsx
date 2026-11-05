import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  TouchableOpacity
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import api from '../src/services/api';
import { useTheme } from '../src/context/ThemeContext';

export default function SensorsScreens({navigation}) {
  const { theme, darkMode } = useTheme();

  const [search, setSearch] = useState('');
  const [sensores, setSensores] = useState([]);
  const [erro, setErro] = useState('');
  const [carregando, setCarregando] = useState(true);

  const loadSensores = async () => {
    try {
      setCarregando(true);
      setErro('');

      const response = await api.get('/sensores');

      console.log('SENSORES:', response.data);

      setSensores(response.data);
    } catch (error) {
      console.log('ERRO:', error);
      console.log('MENSAGEM:', error.message);
      console.log('RESPOSTA:', error.response?.data);

      setErro(error.message);
    } finally {
      setCarregando(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadSensores();
    }, [])
  );

  const filteredSensores = sensores.filter(
    (item) =>
      item.nome?.toLowerCase().includes(search.toLowerCase()) ||
      item.tipo_sensor?.toLowerCase().includes(search.toLowerCase()) ||
      item.codigo_sensor?.toLowerCase().includes(search.toLowerCase()) ||
      item.status?.toLowerCase().includes(search.toLowerCase()) ||
      item.criado_em?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: theme.bg }
      ]}
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

        <View>

          <Text
            style={[
              styles.title,
              { color: theme.textPrimary }
            ]}
          >
            Sensores
          </Text>

          <Text
            style={[
              styles.subtitle,
              { color: theme.textSecondary }
            ]}
          >
            Sensores cadastrados
          </Text>

          </View>

        </View>

        <TouchableOpacity
          style={[
            styles.filterButton,
            {
              backgroundColor: theme.card,
              borderColor: theme.border,
            }
          ]}
          onPress={loadSensores}
        >

          <Ionicons
            name="refresh-outline"
            size={24}
            color={theme.textPrimary}
          />

        </TouchableOpacity>

      </View>

      {/* PESQUISA */}
      <View
        style={[
          styles.searchContainer,
          {
            backgroundColor: theme.card,
            borderColor: theme.border,
          }
        ]}
      >

        <Ionicons
          name="search"
          size={22}
          color="#94A3B8"
        />

        <TextInput
          style={[
            styles.searchInput,
            { color: theme.textPrimary }
          ]}
          placeholder="Pesquisar sensor, tipo ou código..."
          placeholderTextColor="#94A3B8"
          value={search}
          onChangeText={setSearch}
        />

      </View>

      {/* CARREGANDO */}
      {carregando && (

        <View style={styles.messageContainer}>

          <Ionicons
            name="hardware-chip-outline"
            size={45}
            color="#3B82F6"
          />

          <Text
            style={[
              styles.messageTitle,
              { color: theme.textPrimary }
            ]}
          >
            Carregando sensores...
          </Text>

        </View>

      )}

      {/* ERRO */}
      {!carregando && erro !== '' && (

        <View
          style={[
            styles.errorContainer,
            {
              backgroundColor: theme.card,
              borderColor: darkMode
                ? '#3A2630'
                : '#FECACA',
            }
          ]}
        >

          <Ionicons
            name="alert-circle-outline"
            size={45}
            color="#EF4444"
          />

          <Text style={styles.errorTitle}>
            Erro ao carregar sensores
          </Text>

          <Text
            style={[
              styles.errorText,
              { color: theme.textSecondary }
            ]}
          >
            {erro}
          </Text>

          <TouchableOpacity
            style={styles.retryButton}
            onPress={loadSensores}
          >

            <Text style={styles.retryText}>
              Tentar novamente
            </Text>

          </TouchableOpacity>

        </View>

      )}

      {/* LISTA */}
      {!carregando && erro === '' && (

        <FlatList
          data={filteredSensores}

          keyExtractor={(item) =>
            item.id_sensor.toString()
          }

          showsVerticalScrollIndicator={false}

          contentContainerStyle={{
            paddingBottom: 40
          }}

          ListEmptyComponent={

            <View style={styles.messageContainer}>

              <Ionicons
                name="hardware-chip-outline"
                size={55}
                color={darkMode ? '#475569' : '#94A3B8'}
              />

              <Text
                style={[
                  styles.messageTitle,
                  { color: theme.textPrimary }
                ]}
              >
                Nenhum sensor encontrado
              </Text>

              <Text
                style={[
                  styles.messageText,
                  { color: theme.textSecondary }
                ]}
              >
                Nenhum sensor corresponde à pesquisa.
              </Text>

            </View>

          }

          renderItem={({ item }) => (

            <View
              style={[
                styles.card,
                {
                  backgroundColor: theme.card,
                  borderColor: theme.border,
                }
              ]}
            >

              {/* CABEÇALHO */}
              <View style={styles.cardHeader}>

                <View
                  style={[
                    styles.sensorIcon,
                    {
                      backgroundColor: darkMode
                        ? '#0F172A'
                        : '#EFF6FF',
                      borderColor: darkMode
                        ? '#24334A'
                        : '#DBEAFE',
                    }
                  ]}
                >

                  <Ionicons
                    name="hardware-chip-outline"
                    size={32}
                    color="#3B82F6"
                  />

                </View>

                <View style={styles.headerInfo}>

                  <Text
                    style={[
                      styles.name,
                      { color: theme.textPrimary }
                    ]}
                    numberOfLines={1}
                  >
                    {item.nome || 'Sem nome'}
                  </Text>

                  <Text
                    style={[
                      styles.contact,
                      { color: theme.textSecondary }
                    ]}
                    numberOfLines={1}
                  >
                    {item.tipo_sensor || 'Sem tipo'}
                  </Text>

                </View>

                <View
                  style={[
                    styles.idBadge,
                    {
                      backgroundColor: darkMode
                        ? '#0F172A'
                        : '#EFF6FF',
                      borderColor: darkMode
                        ? '#24334A'
                        : '#DBEAFE',
                    }
                  ]}
                >

                  <Text style={styles.idText}>
                    #{item.id_sensor}
                  </Text>

                </View>

              </View>

              {/* STATUS */}
              <View
                style={[
                  styles.statusContainer,
                  {
                    backgroundColor: darkMode
                      ? '#0F172A'
                      : '#F1F5F9',
                  }
                ]}
              >

                <View
                  style={[
                    styles.statusDot,
                    {
                      backgroundColor:
                        item.status === 'ativo'
                          ? '#22C55E'
                          : '#EF4444'
                    }
                  ]}
                />

                <Text
                  style={[
                    styles.statusText,
                    {
                      color:
                        item.status === 'ativo'
                          ? '#22C55E'
                          : '#EF4444'
                    }
                  ]}
                >
                  {item.status === 'ativo'
                    ? 'Ativo'
                    : 'Inativo'}
                </Text>

              </View>

              {/* INFORMAÇÕES */}
              <View style={styles.infoRow}>

                <View
                  style={[
                    styles.infoCard,
                    {
                      backgroundColor: darkMode
                        ? '#0F172A'
                        : '#F8FAFC',
                      borderColor: darkMode
                        ? '#1B293D'
                        : '#E2E8F0',
                    }
                  ]}
                >

                  <Ionicons
                    name="card-outline"
                    size={20}
                    color="#3B82F6"
                  />

                  <View style={styles.infoContent}>

                    <Text
                      style={[
                        styles.infoLabel,
                        { color: theme.textSecondary }
                      ]}
                    >
                      codigo_sensor
                    </Text>

                    <Text
                      style={[
                        styles.infoValue,
                        { color: theme.textPrimary }
                      ]}
                      numberOfLines={1}
                    >
                      {item.codigo_sensor || 'Não informado'}
                    </Text>

                  </View>

                </View>

                <View
                  style={[
                    styles.infoCard,
                    {
                      backgroundColor: darkMode
                        ? '#0F172A'
                        : '#F8FAFC',
                      borderColor: darkMode
                        ? '#1B293D'
                        : '#E2E8F0',
                    }
                  ]}
                >

                  <Ionicons
                    name="radio-outline"
                    size={20}
                    color="#22C55E"
                  />

                  <View style={styles.infoContent}>

                    <Text
                      style={[
                        styles.infoLabel,
                        { color: theme.textSecondary }
                      ]}
                    >
                      status
                    </Text>

                    <Text
                      style={[
                        styles.infoValue,
                        { color: theme.textPrimary }
                      ]}
                      numberOfLines={1}
                    >
                      {item.status || 'Não informado'}
                    </Text>

                  </View>

                </View>

              </View>

              {/* DATA */}
              <View
                style={[
                  styles.detailContainer,
                  {
                    backgroundColor: darkMode
                      ? '#0F172A'
                      : '#F8FAFC',
                    borderColor: darkMode
                      ? '#1B293D'
                      : '#E2E8F0',
                  }
                ]}
              >

                <Ionicons
                  name="time-outline"
                  size={20}
                  color="#94A3B8"
                />

                <View style={styles.detailContent}>

                  <Text
                    style={[
                      styles.infoLabel,
                      { color: theme.textSecondary }
                    ]}
                  >
                    criado_em
                  </Text>

                  <Text
                    style={[
                      styles.detailValue,
                      { color: theme.textPrimary }
                    ]}
                    numberOfLines={1}
                  >
                    {item.criado_em || 'Não informado'}
                  </Text>

                </View>

              </View>

            </View>

          )}

        />

      )}

    </View>
  );
}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    paddingHorizontal: 20,
  },

  header: {
    marginTop: 55,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 25,
  },

  title: {
    fontSize: 32,
    fontWeight: 'bold',
  },

  subtitle: {
    marginTop: 5,
    fontSize: 15,
  },

  filterButton: {
    width: 52,
    height: 52,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
  },

  searchContainer: {
    height: 62,
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 18,
    marginBottom: 25,
    borderWidth: 1,
  },

  searchInput: {
    flex: 1,
    marginLeft: 10,
    fontSize: 15,
  },

  card: {
    borderRadius: 28,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
  },

  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  sensorIcon: {
    width: 62,
    height: 62,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
  },

  headerInfo: {
    flex: 1,
    marginLeft: 15,
    marginRight: 10,
  },

  name: {
    fontSize: 20,
    fontWeight: 'bold',
  },

  contact: {
    fontSize: 14,
    marginTop: 5,
  },

  idBadge: {
    paddingHorizontal: 12,
    paddingVertical: 9,
    borderRadius: 12,
    borderWidth: 1,
  },

  idText: {
    color: '#60A5FA',
    fontSize: 13,
    fontWeight: 'bold',
  },

  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 18,
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 12,
  },

  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 7,
  },

  statusText: {
    fontSize: 13,
    fontWeight: 'bold',
  },

  infoRow: {
    flexDirection: 'row',
    marginTop: 15,
    gap: 12,
  },

  infoCard: {
    flex: 1,
    borderRadius: 16,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    borderWidth: 1,
  },

  infoContent: {
    flex: 1,
  },

  infoLabel: {
    fontSize: 12,
    marginBottom: 3,
  },

  infoValue: {
    fontSize: 13,
    fontWeight: '600',
  },

  detailContainer: {
    marginTop: 12,
    borderRadius: 16,
    padding: 15,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderWidth: 1,
  },

  detailContent: {
    flex: 1,
  },

  detailValue: {
    fontSize: 14,
    marginTop: 2,
  },

  messageContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 70,
    paddingHorizontal: 30,
  },

  messageTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 15,
    textAlign: 'center',
  },

  messageText: {
    fontSize: 15,
    textAlign: 'center',
    marginTop: 10,
  },

  errorContainer: {
    borderRadius: 20,
    padding: 25,
    alignItems: 'center',
    marginTop: 20,
    borderWidth: 1,
  },

  errorTitle: {
    color: '#EF4444',
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 10,
    textAlign: 'center',
  },

  errorText: {
    fontSize: 14,
    textAlign: 'center',
    marginTop: 10,
  },

  retryButton: {
    backgroundColor: '#3B82F6',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12,
    marginTop: 18,
  },

  retryText: {
    color: '#fff',
    fontWeight: 'bold',
  },

});