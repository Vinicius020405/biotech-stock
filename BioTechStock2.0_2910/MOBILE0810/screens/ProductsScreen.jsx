import React, { useState, useCallback } from 'react';

import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  TouchableOpacity,
  Modal,
} from 'react-native';

import { Ionicons } from '@expo/vector-icons';

import QRCode from 'react-native-qrcode-svg';

import { useFocusEffect } from '@react-navigation/native';

import api from '../src/services/api';

import { useTheme } from '../src/context/ThemeContext';

export default function ProductsScreens({ navigation }) {
  const { theme, darkMode } = useTheme();

  const [search, setSearch] = useState('');
  const [produtos, setProdutos] = useState([]);
  const [erro, setErro] = useState('');
  const [carregando, setCarregando] = useState(true);
  const [selectedProduto, setSelectedProduto] = useState(null);

  const loadProdutos = async () => {
    try {
      setCarregando(true);
      setErro('');

      const response = await api.get('/produtos');
      setProdutos(response.data);
    } catch (error) {
      console.log('ERRO:', error);
      setErro(error.message);
    } finally {
      setCarregando(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadProdutos();
    }, [])
  );

  const filteredProdutos = produtos.filter((item) => {
    const term = search.toLowerCase();

    return (
      item.nome?.toLowerCase().includes(term) ||
      item.codigo?.toLowerCase().includes(term) ||
      item.descricao?.toLowerCase().includes(term) ||
      item.unidade_medida?.toLowerCase().includes(term) ||
      String(item.estoque_minimo || '').includes(term) ||
      String(item.estoque_maximo || '').includes(term) ||
      item.status?.toLowerCase().includes(term) ||
      item.criado_em?.toLowerCase().includes(term)
    );
  });

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: theme.bg,
        },
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
            },
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
              {
                color: theme.textPrimary,
              },
            ]}
          >
            Produtos
          </Text>

          <Text
            style={[
              styles.subtitle,
              {
                color: theme.textSecondary,
              },
            ]}
          >
            Produtos cadastrados
          </Text>

        </View>

        <TouchableOpacity
          style={[
            styles.filterButton,
            {
              backgroundColor: theme.card,
              borderColor: theme.border,
            },
          ]}
          onPress={loadProdutos}
        >
          <Ionicons
            name="refresh-outline"
            size={24}
            color={theme.textPrimary}
          />
        </TouchableOpacity>

      </View>

      {/* CAMPO DE BUSCA */}
      <View
        style={[
          styles.searchContainer,
          {
            backgroundColor: theme.card,
            borderColor: theme.border,
          },
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
            {
              color: theme.textPrimary,
            },
          ]}
          placeholder="Pesquisar produto, nome ou código..."
          placeholderTextColor="#94A3B8"
          value={search}
          onChangeText={setSearch}
        />

      </View>

      {/* CARREGANDO */}
      {carregando && (
        <View style={styles.messageContainer}>

          <Ionicons
            name="cube-outline"
            size={45}
            color="#3B82F6"
          />

          <Text
            style={[
              styles.messageTitle,
              {
                color: theme.textPrimary,
              },
            ]}
          >
            Carregando Produtos...
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
              borderColor: theme.border,
            },
          ]}
        >

          <Ionicons
            name="alert-circle-outline"
            size={45}
            color="#EF4444"
          />

          <Text style={styles.errorTitle}>
            Erro ao carregar produtos
          </Text>

          <Text
            style={[
              styles.errorText,
              {
                color: theme.textSecondary,
              },
            ]}
          >
            {erro}
          </Text>

          <TouchableOpacity
            style={styles.retryButton}
            onPress={loadProdutos}
          >
            <Text style={styles.retryText}>
              Tentar novamente
            </Text>
          </TouchableOpacity>

        </View>
      )}

      {/* LISTA DE PRODUTOS */}
      {!carregando && erro === '' && (
        <FlatList
          data={filteredProdutos}
          keyExtractor={(item) => item.id_produto.toString()}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            paddingBottom: 40,
          }}

          ListEmptyComponent={
            <View style={styles.messageContainer}>

              <Ionicons
                name="cube-outline"
                size={55}
                color={
                  darkMode
                    ? '#475569'
                    : '#94A3B8'
                }
              />

              <Text
                style={[
                  styles.messageTitle,
                  {
                    color: theme.textPrimary,
                  },
                ]}
              >
                Nenhum produto encontrado
              </Text>

              <Text
                style={[
                  styles.messageText,
                  {
                    color: theme.textSecondary,
                  },
                ]}
              >
                Nenhum produto corresponde à pesquisa.
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
                },
              ]}
            >

              {/* CABEÇALHO DO CARD */}
              <View style={styles.cardHeader}>

                <View
                  style={[
                    styles.productIcon,
                    {
                      backgroundColor: darkMode
                        ? '#0F172A'
                        : '#EFF6FF',

                      borderColor: darkMode
                        ? '#24334A'
                        : '#DBEAFE',
                    },
                  ]}
                >
                  <Ionicons
                    name="cube-outline"
                    size={32}
                    color="#3B82F6"
                  />
                </View>

                <View style={styles.productHeaderInfo}>

                  <Text
                    style={[
                      styles.name,
                      {
                        color: theme.textPrimary,
                      },
                    ]}
                    numberOfLines={1}
                  >
                    {item.nome || 'Sem nome'}
                  </Text>

                  <Text
                    style={[
                      styles.contact,
                      {
                        color: theme.textSecondary,
                      },
                    ]}
                    numberOfLines={2}
                  >
                    {item.descricao || 'Sem descrição'}
                  </Text>

                </View>

                {/* BOTÃO QR CODE */}
                <TouchableOpacity
                  style={[
                    styles.qrBadgeButton,
                    {
                      backgroundColor: darkMode
                        ? '#0F172A'
                        : '#EFF6FF',

                      borderColor: darkMode
                        ? '#24334A'
                        : '#DBEAFE',
                    },
                  ]}
                  onPress={() => setSelectedProduto(item)}
                >

                  <Ionicons
                    name="qr-code-outline"
                    size={18}
                    color="#3B82F6"
                  />

                  <Text style={styles.idText}>
                    #{item.id_produto}
                  </Text>

                </TouchableOpacity>

              </View>

              {/* BADGE DE STATUS */}
              <View
                style={[
                  styles.statusContainer,
                  {
                    backgroundColor: darkMode
                      ? '#0F172A'
                      : '#F1F5F9',
                  },
                ]}
              >

                <View
                  style={[
                    styles.statusDot,
                    {
                      backgroundColor:
                        item.status === 'ativo'
                          ? '#22C55E'
                          : '#EF4444',
                    },
                  ]}
                />

                <Text
                  style={[
                    styles.statusText,
                    {
                      color:
                        item.status === 'ativo'
                          ? '#22C55E'
                          : '#EF4444',
                    },
                  ]}
                >
                  {item.status === 'ativo'
                    ? 'Ativo'
                    : 'Inativo'}
                </Text>

              </View>

              {/* LINHA DE INFORMAÇÕES */}
              <View style={styles.infoRow}>

                <View
                  style={[
                    styles.infoCard,
                    {
                      backgroundColor: darkMode
                        ? '#0F172A'
                        : '#F8FAFC',

                      borderColor: theme.border,
                    },
                  ]}
                >

                  <Ionicons
                    name="barcode-outline"
                    size={20}
                    color="#3B82F6"
                  />

                  <View style={styles.infoContent}>

                    <Text
                      style={[
                        styles.infoLabel,
                        {
                          color: theme.textSecondary,
                        },
                      ]}
                    >
                      Código
                    </Text>

                    <Text
                      style={[
                        styles.infoValue,
                        {
                          color: theme.textPrimary,
                        },
                      ]}
                      numberOfLines={1}
                    >
                      {item.codigo || 'Não informado'}
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

                      borderColor: theme.border,
                    },
                  ]}
                >

                  <Ionicons
                    name="scale-outline"
                    size={20}
                    color="#22C55E"
                  />

                  <View style={styles.infoContent}>

                    <Text
                      style={[
                        styles.infoLabel,
                        {
                          color: theme.textSecondary,
                        },
                      ]}
                    >
                      Unid. Medida
                    </Text>

                    <Text
                      style={[
                        styles.infoValue,
                        {
                          color: theme.textPrimary,
                        },
                      ]}
                      numberOfLines={1}
                    >
                      {item.unidade_medida || 'Não informado'}
                    </Text>

                  </View>

                </View>

              </View>

              {/* ESTOQUE */}
              <View
                style={[
                  styles.detailContainer,
                  {
                    backgroundColor: darkMode
                      ? '#0F172A'
                      : '#F8FAFC',

                    borderColor: theme.border,
                  },
                ]}
              >

                <Ionicons
                  name="layers-outline"
                  size={20}
                  color={
                    darkMode
                      ? '#64748B'
                      : '#94A3B8'
                  }
                />

                <View style={styles.detailContent}>

                  <Text
                    style={[
                      styles.infoLabel,
                      {
                        color: theme.textSecondary,
                      },
                    ]}
                  >
                    Estoque (Mín. / Máx.)
                  </Text>

                  <Text
                    style={[
                      styles.detailValue,
                      {
                        color: theme.textPrimary,
                      },
                    ]}
                    numberOfLines={1}
                  >
                    {item.estoque_minimo ?? 0} / {item.estoque_maximo ?? 0}
                  </Text>

                </View>

              </View>

              {/* DATA DE CRIAÇÃO */}
              <View
                style={[
                  styles.detailContainer,
                  {
                    backgroundColor: darkMode
                      ? '#0F172A'
                      : '#F8FAFC',

                    borderColor: theme.border,
                  },
                ]}
              >

                <Ionicons
                  name="calendar-outline"
                  size={20}
                  color={
                    darkMode
                      ? '#64748B'
                      : '#94A3B8'
                  }
                />

                <View style={styles.detailContent}>

                  <Text
                    style={[
                      styles.infoLabel,
                      {
                        color: theme.textSecondary,
                      },
                    ]}
                  >
                    Criado em
                  </Text>

                  <Text
                    style={[
                      styles.detailValue,
                      {
                        color: theme.textPrimary,
                      },
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

      {/* MODAL QR CODE */}
      {selectedProduto && (
        <Modal
          transparent
          visible={!!selectedProduto}
          animationType="fade"
          onRequestClose={() => setSelectedProduto(null)}
        >

          <View style={styles.qrModalBg}>

            <View
              style={[
                styles.qrModalCard,
                {
                  backgroundColor: theme.card,
                  borderColor: theme.border,
                },
              ]}
            >

              <Text
                style={[
                  styles.qrModalTitle,
                  {
                    color: theme.textPrimary,
                  },
                ]}
              >
                {selectedProduto.nome || 'Produto'}
              </Text>

              <View style={styles.qrWrapper}>

                <QRCode
                  value={String(
                    selectedProduto.codigo ||
                    selectedProduto.id_produto
                  )}
                  size={180}
                  color="#000"
                  backgroundColor="#fff"
                />

              </View>

              <TouchableOpacity
                onPress={() => setSelectedProduto(null)}
              >
                <Text style={styles.qrCloseText}>
                  Fechar
                </Text>
              </TouchableOpacity>

            </View>

          </View>

        </Modal>
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
    marginTop: 48,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 25,
  },

  backBtn: {
    width: 48,
    height: 48,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    marginRight: 13,
  },

  headerInfo: {
    flex: 1,
  },

  title: {
    fontSize: 30,
    fontWeight: '800',
    letterSpacing: 0.2,
  },

  subtitle: {
    marginTop: 5,
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

  productIcon: {
    width: 60,
    height: 60,
    borderRadius: 17,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
  },

  productHeaderInfo: {
    flex: 1,
    marginLeft: 13,
    marginRight: 8,
  },

  name: {
    fontSize: 18,
    fontWeight: '700',
  },

  contact: {
    fontSize: 13,
    marginTop: 5,
  },

  qrBadgeButton: {
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 11,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    borderWidth: 1,
  },

  idText: {
    color: '#3B82F6',
    fontSize: 12,
    fontWeight: 'bold',
  },

  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 17,
    alignSelf: 'flex-start',
    paddingHorizontal: 11,
    paddingVertical: 7,
    borderRadius: 11,
  },

  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 7,
  },

  statusText: {
    fontSize: 12,
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

  qrModalBg: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },

  qrModalCard: {
    borderRadius: 24,
    padding: 24,
    alignItems: 'center',
    width: '100%',
    maxWidth: 320,
    borderWidth: 1,
  },

  qrModalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },

  qrWrapper: {
    padding: 15,
    backgroundColor: '#fff',
    borderRadius: 16,
    marginTop: 15,
  },

  qrCloseText: {
    color: '#3B82F6',
    marginTop: 20,
    fontWeight: 'bold',
    fontSize: 16,
  },

});