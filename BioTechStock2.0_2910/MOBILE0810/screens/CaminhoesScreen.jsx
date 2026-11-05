import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  TouchableOpacity,
  Image
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { useTheme } from '../src/context/ThemeContext';
import api from '../src/services/api';

export default function CaminhoesScreen({navigation}) {
  const { theme, darkMode } = useTheme();

  const [search, setSearch] = useState('');
  const [caminhoes, setCaminhoes] = useState([]);
  const [erro, setErro] = useState('');
  const [carregando, setCarregando] = useState(true);

  const loadCaminhoes = async () => {
    try {
      setCarregando(true);
      setErro('');

      const response = await api.get('/caminhoes');

      console.log('RESPOSTA:', response.data);

      setCaminhoes(response.data);
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
      loadCaminhoes();
    }, [])
  );

  const filteredCaminhoes = caminhoes.filter(
    (item) =>
      item.placa?.toLowerCase().includes(search.toLowerCase()) ||
      item.modelo?.toLowerCase().includes(search.toLowerCase()) ||
      item.marca?.toLowerCase().includes(search.toLowerCase()) ||
      item.cor?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: theme.bg }
      ]}
    >

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
              Caminhões
            </Text>

            <Text
              style={[
                styles.subtitle,
                { color: theme.textSecondary }
              ]}
            >
              Frota e veículos cadastrados
            </Text>
          </View>
        </View>

        <TouchableOpacity
          style={[
            styles.filterButton,
            {
              backgroundColor: theme.card,
              borderColor: theme.border
            }
          ]}
        >
          <Ionicons
            name="options-outline"
            size={24}
            color="#3B82F6"
          />
        </TouchableOpacity>

      </View>

      <View
        style={[
          styles.searchContainer,
          {
            backgroundColor: theme.card,
            borderColor: theme.border
          }
        ]}
      >

        <Ionicons
          name="search"
          size={22}
          color={theme.textSecondary}
        />

        <TextInput
          style={[
            styles.searchInput,
            { color: theme.textPrimary }
          ]}
          placeholder="Pesquisar por modelo, marca ou placa..."
          placeholderTextColor={theme.textSecondary}
          value={search}
          onChangeText={setSearch}
        />

      </View>

      {carregando && (
        <View style={styles.messageContainer}>

          <Ionicons
            name="car-outline"
            size={45}
            color="#3B82F6"
          />

          <Text
            style={[
              styles.messageTitle,
              { color: theme.textPrimary }
            ]}
          >
            Carregando caminhões...
          </Text>

        </View>
      )}

      {!carregando && erro !== '' && (
        <View
          style={[
            styles.errorContainer,
            {
              backgroundColor: theme.card,
              borderColor: theme.border
            }
          ]}
        >

          <Ionicons
            name="alert-circle-outline"
            size={40}
            color="#EF4444"
          />

          <Text style={styles.errorTitle}>
            Erro ao carregar caminhões
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
            onPress={loadCaminhoes}
          >
            <Text style={styles.retryText}>
              Tentar novamente
            </Text>
          </TouchableOpacity>

        </View>
      )}

      {!carregando && erro === '' && (
        <FlatList
          data={filteredCaminhoes}

          keyExtractor={(item) =>
            item.id_caminhao.toString()
          }

          showsVerticalScrollIndicator={false}

          contentContainerStyle={{
            paddingBottom: 40
          }}

          ListEmptyComponent={
            <View style={styles.messageContainer}>

              <Ionicons
                name="car-outline"
                size={55}
                color={theme.textSecondary}
              />

              <Text
                style={[
                  styles.messageTitle,
                  { color: theme.textPrimary }
                ]}
              >
                Nenhum caminhão encontrado
              </Text>

              <Text
                style={[
                  styles.messageText,
                  { color: theme.textSecondary }
                ]}
              >
                A API respondeu, mas nenhum caminhão foi encontrado.
              </Text>

            </View>
          }

          renderItem={({ item }) => (
            <View
              style={[
                styles.card,
                {
                  backgroundColor: theme.card,
                  borderColor: theme.border
                }
              ]}
            >

              <View style={styles.cardHeader}>

                <View
                  style={[
                    styles.truckIcon,
                    {
                      backgroundColor: darkMode
                        ? '#0B1220'
                        : '#EFF6FF',
                      borderColor: theme.border
                    }
                  ]}
                >

                  {item.imagem ? (
                    <Image
                      source={{
                        uri: `data:${item.imagem_tipo};base64,${item.imagem}`
                      }}
                      style={styles.truckImage}
                    />
                  ) : (
                    <Ionicons
                      name="car-outline"
                      size={32}
                      color="#3B82F6"
                    />
                  )}

                </View>

                <View style={styles.headerInfo}>

                  <Text
                    style={[
                      styles.model,
                      { color: theme.textPrimary }
                    ]}
                  >
                    {item.modelo || 'Sem modelo'}
                  </Text>

                  <Text
                    style={[
                      styles.brand,
                      { color: theme.textSecondary }
                    ]}
                  >
                    {item.marca || 'Sem marca'}
                  </Text>

                </View>

                <View
                  style={[
                    styles.idBadge,
                    {
                      backgroundColor: darkMode
                        ? '#0B1220'
                        : '#EFF6FF',
                      borderColor: theme.border
                    }
                  ]}
                >

                  <Text style={styles.idText}>
                    #{item.id_caminhao}
                  </Text>

                </View>

              </View>

              <View style={styles.infoRow}>

                <View
                  style={[
                    styles.infoCard,
                    {
                      backgroundColor: darkMode
                        ? '#0B1220'
                        : '#F8FAFC',
                      borderColor: theme.border
                    }
                  ]}
                >

                  <Ionicons
                    name="car-sport-outline"
                    size={20}
                    color="#3B82F6"
                  />

                  <View>

                    <Text
                      style={[
                        styles.infoLabel,
                        { color: theme.textSecondary }
                      ]}
                    >
                      Placa
                    </Text>

                    <Text
                      style={[
                        styles.infoValue,
                        { color: theme.textPrimary }
                      ]}
                    >
                      {item.placa || 'S/C'}
                    </Text>

                  </View>

                </View>

                <View
                  style={[
                    styles.infoCard,
                    {
                      backgroundColor: darkMode
                        ? '#0B1220'
                        : '#F8FAFC',
                      borderColor: theme.border
                    }
                  ]}
                >

                  <Ionicons
                    name="color-palette-outline"
                    size={20}
                    color="#22C55E"
                  />

                  <View>

                    <Text
                      style={[
                        styles.infoLabel,
                        { color: theme.textSecondary }
                      ]}
                    >
                      Cor
                    </Text>

                    <Text
                      style={[
                        styles.infoValue,
                        { color: theme.textPrimary }
                      ]}
                    >
                      {item.cor || 'S/C'}
                    </Text>

                  </View>

                </View>

              </View>

              <View
                style={[
                  styles.chassiContainer,
                  {
                    backgroundColor: darkMode
                      ? '#0B1220'
                      : '#F8FAFC',
                    borderColor: theme.border
                  }
                ]}
              >

                <Ionicons
                  name="barcode-outline"
                  size={20}
                  color={theme.textSecondary}
                />

                <View style={{ flex: 1 }}>

                  <Text
                    style={[
                      styles.infoLabel,
                      { color: theme.textSecondary }
                    ]}
                  >
                    Chassi
                  </Text>

                  <Text
                    style={[
                      styles.chassi,
                      { color: theme.textPrimary }
                    ]}
                  >
                    {item.chassi || 'Não informado'}
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
    paddingHorizontal: 18,
  },

  header: {
    marginTop: 48,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 22,
  },

  title: {
    fontSize: 30,
    fontWeight: '800',
    letterSpacing: 0.2,
  },

  subtitle: {
    marginTop: 6,
    fontSize: 14,
    fontWeight: '500',
  },

  filterButton: {
    width: 48,
    height: 48,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
  },

  searchContainer: {
    height: 56,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 22,
    borderWidth: 1,
  },

  searchInput: {
    flex: 1,
    marginLeft: 10,
    fontSize: 15,
    fontWeight: '500',
  },

  card: {
    borderRadius: 22,
    padding: 17,
    marginBottom: 16,
    borderWidth: 1,
  },

  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  truckIcon: {
    width: 60,
    height: 60,
    borderRadius: 17,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    borderWidth: 1,
  },

  truckImage: {
    width: 60,
    height: 60,
    borderRadius: 17,
  },

  headerInfo: {
    flex: 1,
    marginLeft: 13,
  },

  model: {
    fontSize: 19,
    fontWeight: '700',
  },

  brand: {
    fontSize: 14,
    marginTop: 4,
    fontWeight: '500',
  },

  idBadge: {
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderRadius: 10,
    borderWidth: 1,
  },

  idText: {
    color: '#60A5FA',
    fontSize: 12,
    fontWeight: '700',
  },

  infoRow: {
    flexDirection: 'row',
    marginTop: 16,
    gap: 10,
  },

  infoCard: {
    flex: 1,
    borderRadius: 14,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 9,
    borderWidth: 1,
  },

  infoLabel: {
    fontSize: 11,
    marginBottom: 3,
    fontWeight: '500',
  },

  infoValue: {
    fontSize: 14,
    fontWeight: '700',
  },

  chassiContainer: {
    marginTop: 10,
    borderRadius: 14,
    padding: 13,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 11,
    borderWidth: 1,
  },

  chassi: {
    fontSize: 13,
    marginTop: 2,
    fontWeight: '500',
  },

  messageContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 65,
    paddingHorizontal: 30,
  },

  messageTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginTop: 14,
    textAlign: 'center',
  },

  messageText: {
    fontSize: 14,
    textAlign: 'center',
    marginTop: 8,
    lineHeight: 20,
  },

  errorContainer: {
    borderRadius: 18,
    padding: 24,
    alignItems: 'center',
    marginTop: 18,
    borderWidth: 1,
  },

  errorTitle: {
    color: '#F87171',
    fontSize: 17,
    fontWeight: '700',
    marginTop: 10,
    textAlign: 'center',
  },

  errorText: {
    fontSize: 14,
    textAlign: 'center',
    marginTop: 9,
    lineHeight: 20,
  },

  retryButton: {
    backgroundColor: '#3B82F6',
    paddingHorizontal: 20,
    paddingVertical: 11,
    borderRadius: 11,
    marginTop: 17,
  },

  retryText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 14,
  },

});