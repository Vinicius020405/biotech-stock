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
import { useTheme } from '../src/context/ThemeContext';
import api from '../src/services/api';

export default function StockScreens({ navigation }) {
  const { theme, darkMode } = useTheme();

  const [search, setSearch] = useState('');
  const [estoques, setEstoques] = useState([]);
  const [erro, setErro] = useState('');
  const [carregando, setCarregando] = useState(true);

  const loadEstoques = async () => {
    try {
      setCarregando(true);
      setErro('');

      const response = await api.get('/stock');

      console.log('ESTOQUES DO BANCO:', response.data);

      setEstoques(response.data);
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
      loadEstoques();
    }, [])
  );

  const filteredEstoques = estoques.filter((item) => {
    const term = search.toLowerCase();

    return (
      String(item.id_estoque || '').includes(term) ||
      String(item.id_produto || '').includes(term) ||
      String(item.id_localizacao || '').includes(term) ||
      item.produto_nome?.toLowerCase().includes(term) ||
      item.codigo?.toLowerCase().includes(term) ||
      item.localizacao_nome?.toLowerCase().includes(term) ||
      item.setor?.toLowerCase().includes(term)
    );
  });

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
              Estoque
            </Text>

            <Text
              style={[
                styles.subtitle,
                { color: theme.textSecondary }
              ]}
            >
              {estoques.length} estoque(s) cadastrado(s)
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
          onPress={loadEstoques}
        >
          <Ionicons
            name="refresh-outline"
            size={24}
            color="#3B82F6"
          />
        </TouchableOpacity>
      </View>

      {/* PESQUISA */}
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
          placeholder="Pesquisar estoque..."
          placeholderTextColor={theme.textSecondary}
          value={search}
          onChangeText={setSearch}
        />
      </View>

      {/* CARREGANDO */}
      {carregando && (
        <View style={styles.messageContainer}>

          <Ionicons
            name="layers-outline"
            size={45}
            color="#3B82F6"
          />

          <Text
            style={[
              styles.messageTitle,
              { color: theme.textPrimary }
            ]}
          >
            Carregando estoques...
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
              borderColor: theme.border
            }
          ]}
        >

          <Ionicons
            name="alert-circle-outline"
            size={45}
            color="#EF4444"
          />

          <Text style={styles.errorTitle}>
            Erro ao carregar estoque
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
            onPress={loadEstoques}
          >
            <Text style={styles.retryText}>
              Tentar novamente
            </Text>
          </TouchableOpacity>

        </View>
      )}

      {/* LISTA DOS ESTOQUES */}
      {!carregando && erro === '' && (
        <FlatList
          data={filteredEstoques}

          keyExtractor={(item) =>
            String(item.id_estoque)
          }

          showsVerticalScrollIndicator={false}

          contentContainerStyle={{
            paddingBottom: 40
          }}

          ListEmptyComponent={
            <View style={styles.messageContainer}>

              <Ionicons
                name="layers-outline"
                size={55}
                color={theme.textSecondary}
              />

              <Text
                style={[
                  styles.messageTitle,
                  { color: theme.textPrimary }
                ]}
              >
                Nenhum estoque encontrado
              </Text>

              <Text
                style={[
                  styles.messageText,
                  { color: theme.textSecondary }
                ]}
              >
                Não existem registros de estoque para mostrar.
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

              {/* CABEÇALHO DO ESTOQUE */}
              <View style={styles.cardHeader}>

                <View
                  style={[
                    styles.stockIcon,
                    {
                      backgroundColor: darkMode
                        ? '#0F172A'
                        : '#EFF6FF'
                    }
                  ]}
                >
                  <Ionicons
                    name="layers-outline"
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
                  >
                    Estoque #{item.id_estoque}
                  </Text>

                  <Text
                    style={[
                      styles.contact,
                      { color: theme.textSecondary }
                    ]}
                  >
                    Registro cadastrado no banco
                  </Text>

                </View>

                <View
                  style={[
                    styles.idBadge,
                    {
                      backgroundColor: darkMode
                        ? '#0F172A'
                        : '#EFF6FF'
                    }
                  ]}
                >
                  <Text style={styles.idText}>
                    #{item.id_estoque}
                  </Text>
                </View>

              </View>

              {/* QUANTIDADE */}
              <View
                style={[
                  styles.quantityContainer,
                  {
                    backgroundColor: darkMode
                      ? '#0F172A'
                      : '#F8FAFC'
                  }
                ]}
              >

                <Ionicons
                  name="cube-outline"
                  size={28}
                  color="#22C55E"
                />

                <View style={styles.quantityContent}>

                  <Text
                    style={[
                      styles.infoLabel,
                      { color: theme.textSecondary }
                    ]}
                  >
                    Quantidade atual
                  </Text>

                  <Text style={styles.quantityValue}>
                    {item.quantidade_atual ?? 0}
                    {' '}
                    {item.unidade_medida || ''}
                  </Text>

                </View>

              </View>

              {/* PRODUTO E LOCALIZAÇÃO */}
              <View style={styles.infoRow}>

                <View
                  style={[
                    styles.infoCard,
                    {
                      backgroundColor: darkMode
                        ? '#0F172A'
                        : '#F8FAFC'
                    }
                  ]}
                >

                  <Ionicons
                    name="cube-outline"
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
                      ID Produto
                    </Text>

                    <Text
                      style={[
                        styles.infoValue,
                        { color: theme.textPrimary }
                      ]}
                      numberOfLines={1}
                    >
                      {item.id_produto}
                    </Text>

                  </View>

                </View>

                <View
                  style={[
                    styles.infoCard,
                    {
                      backgroundColor: darkMode
                        ? '#0F172A'
                        : '#F8FAFC'
                    }
                  ]}
                >

                  <Ionicons
                    name="location-outline"
                    size={20}
                    color="#A78BFA"
                  />

                  <View style={styles.infoContent}>

                    <Text
                      style={[
                        styles.infoLabel,
                        { color: theme.textSecondary }
                      ]}
                    >
                      ID Localização
                    </Text>

                    <Text
                      style={[
                        styles.infoValue,
                        { color: theme.textPrimary }
                      ]}
                      numberOfLines={1}
                    >
                      {item.id_localizacao}
                    </Text>

                  </View>

                </View>

              </View>

              {/* PRODUTO */}
              <View
                style={[
                  styles.detailContainer,
                  {
                    backgroundColor: darkMode
                      ? '#0F172A'
                      : '#F8FAFC'
                  }
                ]}
              >

                <Ionicons
                  name="cube-outline"
                  size={20}
                  color={theme.textSecondary}
                />

                <View style={styles.detailContent}>

                  <Text
                    style={[
                      styles.infoLabel,
                      { color: theme.textSecondary }
                    ]}
                  >
                    Produto
                  </Text>

                  <Text
                    style={[
                      styles.detailValue,
                      { color: theme.textPrimary }
                    ]}
                    numberOfLines={1}
                  >
                    {item.produto_nome || 'Não informado'}
                  </Text>

                </View>

              </View>

              {/* CÓDIGO */}
              <View
                style={[
                  styles.detailContainer,
                  {
                    backgroundColor: darkMode
                      ? '#0F172A'
                      : '#F8FAFC'
                  }
                ]}
              >

                <Ionicons
                  name="barcode-outline"
                  size={20}
                  color={theme.textSecondary}
                />

                <View style={styles.detailContent}>

                  <Text
                    style={[
                      styles.infoLabel,
                      { color: theme.textSecondary }
                    ]}
                  >
                    Código do produto
                  </Text>

                  <Text
                    style={[
                      styles.detailValue,
                      { color: theme.textPrimary }
                    ]}
                    numberOfLines={1}
                  >
                    {item.codigo || 'Não informado'}
                  </Text>

                </View>

              </View>

              {/* LOCALIZAÇÃO */}
              <View
                style={[
                  styles.detailContainer,
                  {
                    backgroundColor: darkMode
                      ? '#0F172A'
                      : '#F8FAFC'
                  }
                ]}
              >

                <Ionicons
                  name="location-outline"
                  size={20}
                  color={theme.textSecondary}
                />

                <View style={styles.detailContent}>

                  <Text
                    style={[
                      styles.infoLabel,
                      { color: theme.textSecondary }
                    ]}
                  >
                    Localização
                  </Text>

                  <Text
                    style={[
                      styles.detailValue,
                      { color: theme.textPrimary }
                    ]}
                    numberOfLines={1}
                  >
                    {item.localizacao_nome || 'Não informado'}
                  </Text>

                </View>

              </View>

              {/* SETOR */}
              <View
                style={[
                  styles.detailContainer,
                  {
                    backgroundColor: darkMode
                      ? '#0F172A'
                      : '#F8FAFC'
                  }
                ]}
              >

                <Ionicons
                  name="business-outline"
                  size={20}
                  color={theme.textSecondary}
                />

                <View style={styles.detailContent}>

                  <Text
                    style={[
                      styles.infoLabel,
                      { color: theme.textSecondary }
                    ]}
                  >
                    Setor
                  </Text>

                  <Text
                    style={[
                      styles.detailValue,
                      { color: theme.textPrimary }
                    ]}
                    numberOfLines={1}
                  >
                    {item.setor || 'Não informado'}
                  </Text>

                </View>

              </View>

              {/* DATA DE ATUALIZAÇÃO */}
              <View
                style={[
                  styles.detailContainer,
                  {
                    backgroundColor: darkMode
                      ? '#0F172A'
                      : '#F8FAFC'
                  }
                ]}
              >

                <Ionicons
                  name="time-outline"
                  size={20}
                  color={theme.textSecondary}
                />

                <View style={styles.detailContent}>

                  <Text
                    style={[
                      styles.infoLabel,
                      { color: theme.textSecondary }
                    ]}
                  >
                    Atualizado em
                  </Text>

                  <Text
                    style={[
                      styles.detailValue,
                      { color: theme.textPrimary }
                    ]}
                    numberOfLines={1}
                  >
                    {item.atualizado_em || 'Não informado'}
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
    fontSize: 30,
    fontWeight: '800',
    letterSpacing: 0.2,
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

  stockIcon: {
    width: 62,
    height: 62,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
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
  },

  idText: {
    color: '#60A5FA',
    fontSize: 13,
    fontWeight: 'bold',
  },

  quantityContainer: {
    marginTop: 18,
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },

  quantityContent: {
    marginLeft: 12,
  },

  quantityValue: {
    color: '#22C55E',
    fontSize: 22,
    fontWeight: 'bold',
    marginTop: 3,
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