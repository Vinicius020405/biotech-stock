import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  Modal,
  FlatList
} from 'react-native';

import api from '../src/services/api';
import QRCodeScannerModal from '../src/components/QRCodeScannerModal';

// Lista de localizações disponíveis no seu sistema
const ALL_LOCATIONS = [
  { id_localizacao: 2, nome: 'SALA MAQUINARIO' },
  { id_localizacao: 3, nome: 'Almoxarifado Principal' },
  { id_localizacao: 4, nome: 'Depósito Secundário' }
];

export default function EntryScreen({ navigation }) {
  const [docNumber, setDocNumber] = useState('');
  const [supplier, setSupplier] = useState('');
  const [quantity, setQuantity] = useState('');

  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);

  // Armazena as localizações enriquecidas com o saldo atual do produto selecionado
  const [availableLocations, setAvailableLocations] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [currentStock, setCurrentStock] = useState(0);

  // Modais
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);

  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    try {
      const resProd = await api.get('/produtos').catch(() => api.get('/produto'));
      setProducts(resProd.data);

      if (resProd.data && resProd.data.length > 0) {
        const prod = resProd.data[0];
        setSelectedProduct(prod);
        await fetchStockForProduct(prod);
      }
    } catch (err) {
      console.log('Erro ao carregar produtos:', err);
    }
  };

  // Busca o saldo atual do produto em TODAS as localizações possíveis
  const fetchStockForProduct = async (product) => {
    if (!product) return;

    const targetProductId = Number(product.id_produto || product.id);

    try {
      const resStock = await api.get('/estoque');
      const stockData = Array.isArray(resStock.data) ? resStock.data : [];

      // Mapeia todas as localizações e descobre o saldo atual do produto em cada uma
      const locationsWithStock = ALL_LOCATIONS.map((loc) => {
        const stockRecord = stockData.find(
          (s) =>
            Number(s.id_produto || s.id) === targetProductId &&
            Number(s.id_localizacao) === Number(loc.id_localizacao)
        );

        return {
          ...loc,
          quantidade_atual: stockRecord
            ? Number(stockRecord.quantidade_atual || stockRecord.quantidade || 0)
            : 0
        };
      });

      setAvailableLocations(locationsWithStock);

      // Define por padrão a primeira localização (ex: SALA MAQUINARIO ou Almoxarifado)
      const defaultLoc = locationsWithStock[0];
      setSelectedLocation(defaultLoc);
      setCurrentStock(defaultLoc.quantidade_atual);
    } catch (err) {
      console.log('Erro ao consultar estoque para entrada:', err);
      // Se falhar a API de estoque, inicializa locais com saldo zero
      const defaultLocations = ALL_LOCATIONS.map((loc) => ({
        ...loc,
        quantidade_atual: 0
      }));
      setAvailableLocations(defaultLocations);
      setSelectedLocation(defaultLocations[0]);
      setCurrentStock(0);
    }
  };

  const handleSelectProduct = (product) => {
    setSelectedProduct(product);
    setIsProductModalOpen(false);
    fetchStockForProduct(product);
  };

  const handleSelectLocation = (locationItem) => {
    setSelectedLocation(locationItem);
    setCurrentStock(locationItem.quantidade_atual);
    setIsLocationModalOpen(false);
  };

  const handleReadQRCode = async (data) => {
    setIsScannerOpen(false);
    try {
      const response = await api.get(`/produtos/code/${data}`);
      const prod = response.data;

      setSelectedProduct(prod);
      await fetchStockForProduct(prod);

      Alert.alert('Produto encontrado', `${prod.nome} foi selecionado.`);
    } catch (error) {
      console.log('Erro ao buscar produto pelo QR Code:', error);
      Alert.alert('Erro', 'Produto não encontrado no banco.');
    }
  };

  const handleConfirmEntry = async () => {
    const qtyNum = Number(quantity);

    if (!docNumber || !supplier) {
      return Alert.alert('Erro', 'Preencha todos os campos obrigatórios.');
    }

    if (!selectedProduct) {
      return Alert.alert('Erro', 'Selecione um produto.');
    }

    if (!selectedLocation) {
      return Alert.alert('Erro', 'Selecione uma localização de destino.');
    }

    if (!quantity || isNaN(qtyNum) || qtyNum <= 0) {
      return Alert.alert('Erro', 'Informe uma quantidade válida para entrada.');
    }

    try {
      // 1. Cria o Registro de Pedido de Entrada
      const resPedido = await api.post('/pedido-entrada', {
        numero_documento: docNumber,
        fornecedor: supplier,
        data_entrada: new Date().toISOString().slice(0, 10),
        id_usuario: 15,
        status: 'finalizado'
      });

      const idPedido =
        resPedido.data.id_pedido_entrada ||
        resPedido.data.id ||
        resPedido.data.insertId;

      if (!idPedido) {
        throw new Error('Não foi possível obter o ID do pedido de entrada.');
      }

      // 2. Insere o Item do Pedido de Entrada na Localização Escolhida
      await api.post('/item-pedido-entrada', {
        id_pedido_entrada: idPedido,
        id_produto: Number(selectedProduct.id_produto || selectedProduct.id),
        id_localizacao: Number(selectedLocation.id_localizacao),
        quantidade: qtyNum
      });

      Alert.alert('Sucesso', 'Entrada de estoque registrada com sucesso!', [
        { text: 'OK', onPress: () => navigation.navigate('Home') }
      ]);
    } catch (err) {
      console.log('Erro ao registrar entrada:', err);
      const serverMessage =
        err.response?.data?.message ||
        err.response?.data?.erro ||
        err.message ||
        'Falha ao registrar entrada no estoque.';

      Alert.alert('Erro', serverMessage);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        <Text style={styles.title}>Lançar Entrada</Text>
        <Text style={styles.subtitle}>
          Registre o recebimento/entrada de produtos no estoque
        </Text>

        <View style={styles.actionButtonsRow}>
          <TouchableOpacity
            style={styles.qrButton}
            onPress={() => setIsScannerOpen(true)}
          >
            <Text style={styles.qrButtonText}>Escanear QR Code</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.selectButton}
            onPress={() => setIsProductModalOpen(true)}
          >
            <Text style={styles.selectButtonText}>Escolher Produto</Text>
          </TouchableOpacity>
        </View>

        {/* Card do Produto Selecionado */}
        {selectedProduct && (
          <View style={styles.productCard}>
            <TouchableOpacity onPress={() => setIsProductModalOpen(true)}>
              <Text style={styles.cardTag}>Produto Selecionado (Toque p/ alterar)</Text>
              <Text style={styles.productName}>{selectedProduct.nome}</Text>
              <Text style={styles.productCode}>Código: {selectedProduct.codigo}</Text>
            </TouchableOpacity>

            <View style={styles.divider} />

            {/* Selector da Localização de Destino */}
            <Text style={styles.cardTag}>Local de Destino/Depósito:</Text>
            {selectedLocation && (
              <TouchableOpacity
                style={styles.locationSelector}
                onPress={() => setIsLocationModalOpen(true)}
              >
                <View>
                  <Text style={styles.locationText}>
                    📍 {selectedLocation.nome}
                  </Text>
                  <Text style={styles.stockBadge}>
                    Saldo atual neste local: {currentStock}
                  </Text>
                </View>
                <Text style={styles.changeLocBtn}>Alterar Local</Text>
              </TouchableOpacity>
            )}
          </View>
        )}

        <Text style={styles.label}>Número Documento / Nota Fiscal *</Text>
        <TextInput
          style={styles.input}
          placeholder="Ex: NF-10524"
          placeholderTextColor="#94A3B8"
          value={docNumber}
          onChangeText={setDocNumber}
        />

        <Text style={styles.label}>Fornecedor / Origem *</Text>
        <TextInput
          style={styles.input}
          placeholder="Ex: EUROFARMA LABORATORIOS"
          placeholderTextColor="#94A3B8"
          value={supplier}
          onChangeText={setSupplier}
        />

        <Text style={styles.label}>Quantidade a Adicionar *</Text>
        <TextInput
          style={styles.input}
          placeholder="Ex: 100"
          keyboardType="numeric"
          placeholderTextColor="#94A3B8"
          value={quantity}
          onChangeText={setQuantity}
        />

        <TouchableOpacity style={styles.button} onPress={handleConfirmEntry}>
          <Text style={styles.buttonText}>Confirmar Entrada</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Modal: Escolher Produto */}
      <Modal
        visible={isProductModalOpen}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setIsProductModalOpen(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Selecione um Produto</Text>
            <FlatList
              data={products}
              keyExtractor={(item) => String(item.id_produto || item.id || item.codigo)}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.modalItem}
                  onPress={() => handleSelectProduct(item)}
                >
                  <Text style={styles.modalItemTitle}>{item.nome}</Text>
                  <Text style={styles.modalItemSub}>Código: {item.codigo}</Text>
                </TouchableOpacity>
              )}
            />
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setIsProductModalOpen(false)}
            >
              <Text style={styles.closeButtonText}>Fechar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Modal: Escolher Localização de Destino */}
      <Modal
        visible={isLocationModalOpen}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setIsLocationModalOpen(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>
              Local de Entrada para {selectedProduct?.nome}
            </Text>
            <FlatList
              data={availableLocations}
              keyExtractor={(item) => String(item.id_localizacao)}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.modalItem}
                  onPress={() => handleSelectLocation(item)}
                >
                  <Text style={styles.modalItemTitle}>📍 {item.nome}</Text>
                  <Text style={styles.modalItemSub}>
                    Saldo Atual do Produto: {item.quantidade_atual}
                  </Text>
                </TouchableOpacity>
              )}
            />
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setIsLocationModalOpen(false)}
            >
              <Text style={styles.closeButtonText}>Fechar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <QRCodeScannerModal
        visible={isScannerOpen}
        onClose={() => setIsScannerOpen(false)}
        onReadCode={handleReadQRCode}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#020617'
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 40
  },
  title: {
    color: '#fff',
    fontSize: 26,
    fontWeight: 'bold'
  },
  subtitle: {
    color: '#94A3B8',
    fontSize: 14,
    marginTop: 5,
    marginBottom: 20
  },
  actionButtonsRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 5
  },
  qrButton: {
    flex: 1,
    backgroundColor: '#2563EB',
    height: 52,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center'
  },
  qrButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold'
  },
  selectButton: {
    flex: 1,
    backgroundColor: '#334155',
    height: 52,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center'
  },
  selectButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold'
  },
  productCard: {
    backgroundColor: '#0F172A',
    borderRadius: 14,
    padding: 15,
    marginTop: 15,
    borderWidth: 1,
    borderColor: '#334155'
  },
  cardTag: {
    color: '#94A3B8',
    fontSize: 12
  },
  productName: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 2
  },
  productCode: {
    color: '#94A3B8',
    fontSize: 13,
    marginTop: 2
  },
  divider: {
    height: 1,
    backgroundColor: '#1E293B',
    marginVertical: 12
  },
  locationSelector: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#1E293B',
    padding: 12,
    borderRadius: 10,
    marginTop: 6
  },
  locationText: {
    color: '#F8FAFC',
    fontSize: 15,
    fontWeight: '600'
  },
  stockBadge: {
    color: '#10B981',
    fontSize: 13,
    fontWeight: 'bold',
    marginTop: 4
  },
  changeLocBtn: {
    color: '#2563EB',
    fontSize: 12,
    fontWeight: 'bold'
  },
  label: {
    color: '#94A3B8',
    fontSize: 14,
    marginTop: 15,
    marginBottom: 6
  },
  input: {
    backgroundColor: '#1E293B',
    height: 50,
    borderRadius: 12,
    paddingHorizontal: 15,
    color: '#fff'
  },
  button: {
    backgroundColor: '#16A34A',
    height: 52,
    borderRadius: 14,
    marginTop: 30,
    justifyContent: 'center',
    alignItems: 'center'
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold'
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    justifyContent: 'flex-end'
  },
  modalContent: {
    backgroundColor: '#0F172A',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    maxHeight: '80%'
  },
  modalTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15
  },
  modalItem: {
    backgroundColor: '#1E293B',
    padding: 15,
    borderRadius: 12,
    marginBottom: 10
  },
  modalItemTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold'
  },
  modalItemSub: {
    color: '#94A3B8',
    fontSize: 13,
    marginTop: 3
  },
  closeButton: {
    backgroundColor: '#334155',
    height: 48,
    borderRadius: 12,
    marginTop: 10,
    justifyContent: 'center',
    alignItems: 'center'
  },
  closeButtonText: {
    color: '#fff',
    fontWeight: 'bold'
  }
});