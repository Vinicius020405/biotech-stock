import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import api from '../src/services/api';
import { useTheme } from '../src/context/ThemeContext';

export default function HistoryScreen({ navigation }) {
  const { theme, darkMode } = useTheme();

  const [search, setSearch] = useState('');
  const [historico, setHistorico] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [erro, setErro] = useState('');

  const fetchHistorico = async () => {
    try {
      setErro('');
      // Tenta a rota /history mapeada no backend
      const response = await api.get('/history');
      setHistorico(response.data);
    } catch (error) {
      console.error('Erro ao buscar histórico:', error);
      setErro(error.message || 'Erro ao carregar histórico');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchHistorico();
    }, [])
  );

  const onRefresh = () => {
    setRefreshing(true);
    fetchHistorico();
  };

  const filteredHistorico = historico.filter((item) => {
    const term = search.toLowerCase();
    const produto = item.product || item.produto || item.nome_produto || '';
    const tipo = item.type || item.tipo || item.acao || '';
    const loc = item.localizacao || '';
    const data = item.date || item.data || '';

    return (
      produto.toLowerCase().includes(term) ||
      tipo.toLowerCase().includes(term) ||
      loc.toLowerCase().includes(term) ||
      data.toLowerCase().includes(term)
    );
  });

  return (
    <View style={[styles.container, { backgroundColor: theme.bg }]}>
      {/* HEADER COM BOTÃO DE VOLTAR */}
      <View style={styles.header}>
        <TouchableOpacity
          style={[
            styles.backBtn,
            {
              backgroundColor: theme.card,
              borderColor: theme.border,
            },
          ]}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={23} color={theme.textPrimary} />
        </TouchableOpacity>

        <View style={styles.headerInfo}>
          <Text style={[styles.title, { color: theme.textPrimary }]}>
            Histórico
          </Text>
          <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
            Registro de movimentações e atividades
          </Text>
        </View>
      </View>

      {/* CAMPO DE PESQUISA */}
      <View
        style={[
          styles.searchContainer,
          {
            backgroundColor: theme.card,
            borderColor: theme.border,
          },
        ]}
      >
        <Ionicons name="search" size={21} color="#94A3B8" />
        <TextInput
          placeholder="Pesquisar por produto, ação ou local..."
          placeholderTextColor="#94A3B8"
          style={[styles.searchInput, { color: theme.textPrimary }]}
          value={search}
          onChangeText={setSearch}
        />
      </View>

      {/* CARREGANDO */}
      {loading ? (
        <ActivityIndicator size="large" color="#3B82F6" style={styles.loading} />
      ) : erro !== '' ? (
        /* ERRO */
        <View
          style={[
            styles.errorContainer,
            { backgroundColor: theme.card, borderColor: theme.border },
          ]}
        >
          <Ionicons name="alert-circle-outline" size={45} color="#EF4444" />
          <Text style={styles.errorTitle}>Erro ao carregar histórico</Text>
          <Text style={[styles.errorText, { color: theme.textSecondary }]}>
            {erro}
          </Text>
          <TouchableOpacity style={styles.retryButton} onPress={fetchHistorico}>
            <Text style={styles.retryText}>Tentar novamente</Text>
          </TouchableOpacity>
        </View>
      ) : (
        /* LISTA DE HISTÓRICO */
        <FlatList
          data={filteredHistorico}
          keyExtractor={(item, index) => (item.id ? item.id.toString() : index.toString())}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 40 }}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor="#3B82F6"
            />
          }
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Ionicons
                name="time-outline"
                size={52}
                color={darkMode ? '#475569' : '#94A3B8'}
              />
              <Text style={[styles.emptyTitle, { color: theme.textPrimary }]}>
                Nenhum registro encontrado
              </Text>
              <Text style={[styles.emptyText, { color: theme.textSecondary }]}>
                Não existem movimentações registradas para esta pesquisa.
              </Text>
            </View>
          }
          renderItem={({ item }) => {
            const isEntrada =
              (item.type || item.tipo || '').toLowerCase().includes('entrada') ||
              (item.type || item.tipo || '').toLowerCase().includes('adicion');

            return (
              <View
                style={[
                  styles.card,
                  {
                    backgroundColor: theme.card,
                    borderColor: theme.border,
                  },
                ]}
              >
                {/* CABEÇALHO DO CARD */}
                <View style={styles.cardHeader}>
                  <View
                    style={[
                      styles.iconBox,
                      {
                        backgroundColor: isEntrada
                          ? darkMode ? '#022C22' : '#DCFCE7'
                          : darkMode ? '#450A0A' : '#FEE2E2',
                        borderColor: isEntrada
                          ? darkMode ? '#065F46' : '#BBF7D0'
                          : darkMode ? '#991B1B' : '#FECACA',
                      },
                    ]}
                  >
                    <Ionicons
                      name={isEntrada ? 'arrow-down-circle' : 'arrow-up-circle'}
                      size={26}
                      color={isEntrada ? '#22C55E' : '#EF4444'}
                    />
                  </View>

                  <View style={styles.info}>
                    <Text
                      style={[styles.name, { color: theme.textPrimary }]}
                      numberOfLines={1}
                    >
                      {item.product || item.produto || 'Movimentação'}
                    </Text>

                    <Text
                      style={[styles.subtitleCard, { color: theme.textSecondary }]}
                      numberOfLines={1}
                    >
                      {item.localizacao ? `Local: ${item.localizacao}` : 'Sem localização'}
                    </Text>
                  </View>

                  <Text
                    style={[
                      styles.badge,
                      {
                        backgroundColor: isEntrada
                          ? darkMode ? '#022C22' : '#DCFCE7'
                          : darkMode ? '#450A0A' : '#FEE2E2',
                        color: isEntrada ? '#22C55E' : '#EF4444',
                        borderColor: isEntrada
                          ? darkMode ? '#065F46' : '#BBF7D0'
                          : darkMode ? '#991B1B' : '#FECACA',
                      },
                    ]}
                  >
                    {item.type || item.tipo || 'Registro'}
                  </Text>
                </View>

                {/* INFORMAÇÕES SECUNDÁRIAS */}
                <View style={styles.detailRow}>
                  <View style={styles.detailItem}>
                    <Ionicons
                      name="cube-outline"
                      size={15}
                      color={darkMode ? '#64748B' : '#94A3B8'}
                    />
                    <Text style={[styles.text, { color: theme.textSecondary }]}>
                      Qtd:{' '}
                      <Text style={[styles.bold, { color: theme.textPrimary }]}>
                        {item.quantidade ?? '-'}
                      </Text>
                    </Text>
                  </View>

                  <View style={styles.detailItem}>
                    <Ionicons
                      name="location-outline"
                      size={15}
                      color={darkMode ? '#64748B' : '#94A3B8'}
                    />
                    <Text style={[styles.text, { color: theme.textSecondary }]}>
                      <Text style={[styles.bold, { color: theme.textPrimary }]}>
                        {item.localizacao || 'N/A'}
                      </Text>
                    </Text>
                  </View>

                  <View style={styles.detailItem}>
                    <Ionicons
                      name="calendar-outline"
                      size={15}
                      color={darkMode ? '#64748B' : '#94A3B8'}
                    />
                    <Text style={[styles.text, { color: theme.textSecondary }]}>
                      {item.date ? new Date(item.date).toLocaleDateString('pt-BR') : '-'}
                    </Text>
                  </View>
                </View>
              </View>
            );
          }}
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
    borderWidth: 1,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  iconBox: {
    width: 50,
    height: 50,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    borderWidth: 1,
  },
  info: {
    flex: 1,
    marginRight: 8,
  },
  name: {
    fontSize: 16,
    fontWeight: '700',
  },
  subtitleCard: {
    fontSize: 13,
    marginTop: 2,
  },
  badge: {
    fontSize: 11,
    fontWeight: '700',
    paddingVertical: 6,
    paddingHorizontal: 9,
    borderRadius: 9,
    overflow: 'hidden',
    borderWidth: 1,
    textTransform: 'capitalize',
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: 'rgba(148, 163, 184, 0.15)',
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