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
import api from '../src/services/api';
import { useTheme } from '../src/context/ThemeContext';

export default function FornecedoresScreen({ navigation }) {
  const { theme, darkMode } = useTheme();

  const [search, setSearch] = useState('');
  const [fornecedores, setFornecedores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchFornecedores = async () => {
    try {
      const response = await api.get('/fornecedores');
      setFornecedores(response.data);
    } catch (error) {
      console.error('Erro ao buscar fornecedores:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchFornecedores();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchFornecedores();
  };

  const filteredFornecedores = fornecedores.filter((item) => {
    const term = search.toLowerCase();
    const nome = item.nome || item.razao_social || '';
    const cnpj = item.cnpj || item.cpf_cnpj || '';
    const contato = item.contato || item.email || item.telefone || '';

    return (
      nome.toLowerCase().includes(term) ||
      cnpj.toLowerCase().includes(term) ||
      contato.toLowerCase().includes(term)
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
            Fornecedores
          </Text>

          <Text
            style={[
              styles.subtitle,
              { color: theme.textSecondary }
            ]}
          >
            Parceiros e fornecedores cadastrados
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
          placeholder="Pesquisar por nome, CNPJ ou contato..."
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
      ) : filteredFornecedores.length === 0 ? (
        /* VAZIO */
        <View style={styles.emptyContainer}>
          <Ionicons
            name="business-outline"
            size={52}
            color={darkMode ? '#475569' : '#94A3B8'}
          />

          <Text
            style={[
              styles.emptyTitle,
              { color: theme.textPrimary }
            ]}
          >
            Nenhum fornecedor encontrado
          </Text>

          <Text
            style={[
              styles.emptyText,
              { color: theme.textSecondary }
            ]}
          >
            Não existem fornecedores cadastrados para esta pesquisa.
          </Text>
        </View>
      ) : (
        /* LISTA */
        filteredFornecedores.map((item) => (
          <View
            key={item.id_fornecedor || item.id}
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
                name="business-sharp"
                size={27}
                color="#3B82F6"
              />
            </View>

            <View style={styles.info}>

              {/* CABEÇALHO DO CARD */}
              <View style={styles.cardHeader}>
                <Text
                  style={[
                    styles.name,
                    { color: theme.textPrimary }
                  ]}
                  numberOfLines={1}
                >
                  {item.nome || item.razao_social}
                </Text>

                {(item.categoria || item.status) && (
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
                    {item.categoria || item.status}
                  </Text>
                )}
              </View>

              {/* DETALHES */}
              <View style={styles.detailRow}>
                <View style={styles.detailItem}>
                  <Ionicons
                    name="call-outline"
                    size={15}
                    color={darkMode ? '#64748B' : '#94A3B8'}
                  />
                  <Text
                    style={[
                      styles.text,
                      { color: theme.textSecondary }
                    ]}
                  >
                    Tel:{' '}
                    <Text
                      style={[
                        styles.bold,
                        { color: theme.textPrimary }
                      ]}
                    >
                      {item.telefone || item.celular || '-'}
                    </Text>
                  </Text>
                </View>

                <View style={styles.detailItem}>
                  <Ionicons
                    name="document-text-outline"
                    size={15}
                    color={darkMode ? '#64748B' : '#94A3B8'}
                  />
                  <Text
                    style={[
                      styles.text,
                      { color: theme.textSecondary }
                    ]}
                  >
                    CNPJ:{' '}
                    <Text
                      style={[
                        styles.bold,
                        { color: theme.textPrimary }
                      ]}
                    >
                      {item.cnpj || item.cpf_cnpj || '-'}
                    </Text>
                  </Text>
                </View>
              </View>

              {/* OBSERVAÇÃO / EMAIL */}
              {(item.email || item.observacao) ? (
                <View style={styles.obsContainer}>
                  <Ionicons
                    name={item.email ? "mail-outline" : "information-circle-outline"}
                    size={15}
                    color={darkMode ? '#64748B' : '#94A3B8'}
                  />
                  <Text
                    style={[
                      styles.obsText,
                      { color: theme.textSecondary }
                    ]}
                    numberOfLines={1}
                  >
                    {item.email || item.observacao}
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