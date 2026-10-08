import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import api from '../src/services/api';
import { useTheme } from '../src/context/ThemeContext';

const API_URL = 'http://10.135.60.79:3000/api/locations';

export default function LocationScreen({ navigation }) {
  const { theme, darkMode } = useTheme();

  const [search, setSearch] = useState('');
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchLocations = async () => {
    try {
      const response = await api.get('/locations');
      setLocations(response.data);
    } catch (error) {
      console.error('Erro ao buscar localizações:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchLocations();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchLocations();
  };

  const filteredLocations = locations.filter((loc) => {
    const term = search.toLowerCase();
    const nome = loc.nome || '';
    const setor = loc.setor || '';

    return (
      nome.toLowerCase().includes(term) ||
      setor.toLowerCase().includes(term)
    );
  });

  return (
    <ScrollView
      style={[
        styles.container,
        { backgroundColor: theme.bg }
      ]}
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          tintColor="#3B82F6"
        />
      }
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
            Localizações
          </Text>

          <Text
            style={[
              styles.subtitle,
              { color: theme.textSecondary }
            ]}
          >
            Setores e depósitos cadastrados
          </Text>

        </View>

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
          size={21}
          color="#94A3B8"
        />

        <TextInput
          placeholder="Pesquisar por nome ou setor..."
          placeholderTextColor="#94A3B8"
          style={[
            styles.searchInput,
            { color: theme.textPrimary }
          ]}
          value={search}
          onChangeText={setSearch}
        />

      </View>

      {/* CARREGANDO */}
      {loading ? (

        <ActivityIndicator
          size="large"
          color="#3B82F6"
          style={styles.loading}
        />

      ) : filteredLocations.length === 0 ? (

        /* VAZIO */
        <View style={styles.emptyContainer}>

          <Ionicons
            name="location-outline"
            size={52}
            color={darkMode ? '#475569' : '#94A3B8'}
          />

          <Text
            style={[
              styles.emptyTitle,
              { color: theme.textPrimary }
            ]}
          >
            Nenhuma localização encontrada
          </Text>

          <Text
            style={[
              styles.emptyText,
              { color: theme.textSecondary }
            ]}
          >
            Não existem localizações cadastradas para esta pesquisa.
          </Text>

        </View>

      ) : (

        /* LISTA */
        filteredLocations.map((item) => (

          <View
            key={item.id_localizacao}
            style={[
              styles.card,
              {
                backgroundColor: theme.card,
                borderColor: theme.border,
              }
            ]}
          >

            {/* ÍCONE */}
            <View
              style={[
                styles.iconBox,
                {
                  backgroundColor: darkMode
                    ? '#0B1220'
                    : '#EFF6FF',
                  borderColor: darkMode
                    ? '#24334A'
                    : '#DBEAFE',
                }
              ]}
            >

              <Ionicons
                name="location-sharp"
                size={27}
                color="#3B82F6"
              />

            </View>

            <View style={styles.info}>

              {/* CABEÇALHO */}
              <View style={styles.cardHeader}>

                <Text
                  style={[
                    styles.name,
                    { color: theme.textPrimary }
                  ]}
                >
                  {item.nome}
                </Text>

                <Text
                  style={[
                    styles.badge,
                    {
                      backgroundColor: darkMode
                        ? '#0B1220'
                        : '#EFF6FF',
                      color: '#3B82F6',
                      borderColor: darkMode
                        ? '#24334A'
                        : '#DBEAFE',
                    }
                  ]}
                >
                  {item.setor}
                </Text>

              </View>

              {/* DETALHES */}
              <View style={styles.detailRow}>

                <View style={styles.detailItem}>

                  <Ionicons
                    name="swap-horizontal-outline"
                    size={15}
                    color={darkMode ? '#64748B' : '#94A3B8'}
                  />

                  <Text
                    style={[
                      styles.text,
                      { color: theme.textSecondary }
                    ]}
                  >
                    Corredor:{' '}

                    <Text
                      style={[
                        styles.bold,
                        {
                          color: theme.textPrimary
                        }
                      ]}
                    >
                      {item.corredor || '-'}
                    </Text>

                  </Text>

                </View>

                <View style={styles.detailItem}>

                  <Ionicons
                    name="layers-outline"
                    size={15}
                    color={darkMode ? '#64748B' : '#94A3B8'}
                  />

                  <Text
                    style={[
                      styles.text,
                      { color: theme.textSecondary }
                    ]}
                  >
                    Prateleira:{' '}

                    <Text
                      style={[
                        styles.bold,
                        {
                          color: theme.textPrimary
                        }
                      ]}
                    >
                      {item.prateleira || '-'}
                    </Text>

                  </Text>

                </View>

              </View>

              {/* OBSERVAÇÃO */}
              {item.observacao ? (

                <View style={styles.obsContainer}>

                  <Ionicons
                    name="information-circle-outline"
                    size={15}
                    color={darkMode ? '#64748B' : '#94A3B8'}
                  />

                  <Text
                    style={[
                      styles.obsText,
                      { color: theme.textSecondary }
                    ]}
                  >
                    {item.observacao}
                  </Text>

                </View>

              ) : null}

            </View>

          </View>

        ))
      )}

      <View style={{ height: 40 }} />

    </ScrollView>
  );
}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    paddingHorizontal: 18,
  },

  header: {
    marginTop: 48,
    marginBottom: 22,
    flexDirection: 'row',
    alignItems: 'center',
  },

  backBtn: {
    width: 48,
    height: 48,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
  },

  headerInfo: {
    flex: 1,
    marginLeft: 13,
  },

  title: {
    fontSize: 30,
    fontWeight: '800',
    letterSpacing: 0.2,
  },

  subtitle: {
    fontSize: 14,
    marginTop: 6,
    fontWeight: '500',
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

  loading: {
    marginTop: 50,
  },

  card: {
    borderRadius: 22,
    padding: 17,
    marginBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
  },

  iconBox: {
    width: 60,
    height: 60,
    borderRadius: 17,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 13,
    borderWidth: 1,
  },

  info: {
    flex: 1,
  },

  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 9,
  },

  name: {
    fontSize: 17,
    fontWeight: '700',
    flex: 1,
    marginRight: 8,
  },

  badge: {
    fontSize: 11,
    fontWeight: '700',
    paddingVertical: 6,
    paddingHorizontal: 9,
    borderRadius: 9,
    overflow: 'hidden',
    borderWidth: 1,
  },

  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    marginBottom: 7,
  },

  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },

  text: {
    fontSize: 12,
  },

  bold: {
    fontWeight: '700',
  },

  obsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginTop: 2,
  },

  obsText: {
    fontSize: 12,
    fontStyle: 'italic',
    flex: 1,
  },

  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 65,
    paddingHorizontal: 30,
  },

  emptyTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginTop: 14,
    textAlign: 'center',
  },

  emptyText: {
    fontSize: 14,
    textAlign: 'center',
    marginTop: 8,
    lineHeight: 20,
  },

});