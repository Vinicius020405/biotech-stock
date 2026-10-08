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

const LOCATION_NAMES = {
  2: 'SALA MAQUINARIO',
  3: 'Almoxarifado Principal',
  4: 'Depósito Secundário'
};

export default function ExitScreen({ navigation }) {
  const [docNumber, setDocNumber] = useState('');
  const [applicant, setApplicant] = useState('');
  const [quantity, setQuantity] = useState('');

  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const [productLocations, setProductLocations] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [currentStock, setCurrentStock] = useState(0);

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
        await fetchStockAndLocationsForProduct(prod);
      }
    } catch (err) {
      console.log('Erro ao carregar produtos:', err);
    }
  };

  // Busca o estoque ESTRITAMENTE para o produto selecionado
  const fetchStockAndLocationsForProduct = async (product) => {
    if (!product) return;

    // Normaliza o ID do produto para número para evitar erros de comparação
    const targetProductId = Number(product.id_produto || product.id);

    try {
      const resStock = await api.get('/estoque');
      
      if (Array.isArray(resStock.data)) {
        // Filtra apenas os itens do estoque correspondentes ao ID do produto selecionado
        const stockItems = resStock.data.filter(
          (s) => Number(s.id_produto || s.id) === targetProductId
        );

        if (stockItems.length > 0) {
          setProductLocations(stockItems);
          const defaultLoc = stockItems[0];
          setSelectedLocation(defaultLoc);
          setCurrentStock(Number(defaultLoc.quantidade_atual || defaultLoc.quantidade || 0));
        } else {
          setProductLocations([]);
          setSelectedLocation(null);
          setCurrentStock(0);
        }
      }
    } catch (err) {
      console.log('Erro ao consultar estoque:', err);
      setProductLocations([]);
      setSelectedLocation(null);
      setCurrentStock(0);
    }
  };

  const handleSelectProduct = (product) => {
    setSelectedProduct(product);
    setIsProductModalOpen(false);
    fetchStockAndLocationsForProduct(product);
  };

  const handleSelectLocation = (locationItem) => {
    setSelectedLocation(locationItem);
    setCurrentStock(Number(locationItem.quantidade_atual || locationItem.quantidade || 0));
    setIsLocationModalOpen(false);
  };

  const handleReadQRCode = async (data) => {
    setIsScannerOpen(false);
    try {
      const response = await api.get(`/produtos/code/${data}`);
      const prod = response.data;

      setSelectedProduct(prod);
      await fetchStockAndLocationsForProduct(prod);

      Alert.alert('Produto encontrado', `${prod.nome} foi selecionado.`);
    } catch (error) {
      console.log('Erro ao buscar produto pelo QR Code:', error);
      Alert.alert('Erro', 'Produto não encontrado no banco.');
    }
  };

  const handleConfirmExit = async () => {
    const qtyNum = Number(quantity);

    if (!docNumber || !applicant) {
      return Alert.alert('Erro', 'Preencha todos os campos obrigatórios.');
    }

    if (!selectedProduct) {
      return Alert.alert('Erro', 'Selecione um produto.');
    }

    if (!selectedLocation) {
      return Alert.alert('Erro', 'Selecione uma localização válida para a saída.');
    }

    if (!quantity || isNaN(qtyNum) || qtyNum <= 0) {
      return Alert.alert('Erro', 'Informe uma quantidade válida.');
    }

    if (qtyNum > currentStock) {
      return Alert.alert(
        'Saldo Insuficiente',
        `Saldo disponível nesta localização: ${currentStock}`
      );
    }

    try {
      const resPedido = await api.post('/pedido-saida', {
        numero_documento: docNumber,
        solicitante: applicant,
        data_saida: new Date().toISOString().slice(0, 10),
        id_usuario: 15,
        id_caminhao: 4,
        status: 'finalizado'
      });

      const idPedido =
        resPedido.data.id_pedido_saida ||
        resPedido.data.id ||
        resPedido.data.insertId;

      if (!idPedido) {
        throw new Error('Não foi possível obter o ID do pedido de saída.');
      }

      await api.post('/item-pedido-saida', {
        id_pedido_saida: idPedido,
        id_produto: Number(selectedProduct.id_produto || selectedProduct.id),
        id_localizacao: Number(selectedLocation.id_localizacao),
        quantidade: qtyNum
      });

      Alert.alert('Sucesso', 'Saída registrada com sucesso!', [
        { text: 'OK', onPress: () => navigation.navigate('Home') }
      ]);
    } catch (err) {
      console.log('Erro ao registrar saída:', err);
      const serverMessage =
        err.response?.data?.message ||
        err.response?.data?.erro ||
        err.message ||
        'Falha ao registrar saída.';

      Alert.alert('Erro', serverMessage);
    }
  };

  const getLocationName = (idLoc) => {
    return LOCATION_NAMES[idLoc] || `Localização ID: ${idLoc}`;
  };

  return (
    <View style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        <Text style={styles.title}>Lançar Saída</Text>
        <Text style={styles.subtitle}>
          Registre a saída de produtos do estoque
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

            <Text style={styles.cardTag}>Local de Retirada:</Text>
            {selectedLocation ? (
              <TouchableOpacity
                style={styles.locationSelector}
                onPress={() => {
                  if (productLocations.length > 1) {
                    setIsLocationModalOpen(true);
                  }
                }}
              >
                <View>
                  <Text style={styles.locationText}>
                    📍 {getLocationName(selectedLocation.id_localizacao)}
                  </Text>
                  <Text style={styles.stockBadge}>
                    Saldo neste local: {currentStock}
                  </Text>
                </View>
                {productLocations.length > 1 && (
                  <Text style={styles.changeLocBtn}>Trocar Local</Text>
                )}
              </TouchableOpacity>
            ) : (
              <Text style={styles.noStockText}>Sem saldo registrado em nenhuma localização</Text>
            )}
          </View>
        )}

        <Text style={styles.label}>Número Documento / Pedido *</Text>
        <TextInput
          style={styles.input}
          placeholder="Ex: SAI-2024-088"
          placeholderTextColor="#94A3B8"
          value={docNumber}
          onChangeText={setDocNumber}
        />

        <Text style={styles.label}>Solicitante / Destino *</Text>
        <TextInput
          style={styles.input}
          placeholder="Ex: DROGA RAIA"
          placeholderTextColor="#94A3B8"
          value={applicant}
          onChangeText={setApplicant}
        />

        <Text style={styles.label}>Quantidade a Retirar *</Text>
        <TextInput
          style={styles.input}
          placeholder="Ex: 50"
          keyboardType="numeric"
          placeholderTextColor="#94A3B8"
          value={quantity}
          onChangeText={setQuantity}
        />

        <TouchableOpacity style={styles.button} onPress={handleConfirmExit}>
          <Text style={styles.buttonText}>Confirmar Saída</Text>
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

      {/* Modal: Localizações do Produto Selecionado */}
      <Modal
        visible={isLocationModalOpen}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setIsLocationModalOpen(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>
              Localizações de {selectedProduct?.nome}
            </Text>
            <FlatList
              data={productLocations}
              keyExtractor={(item) => String(item.id_estoque || item.id_localizacao)}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.modalItem}
                  onPress={() => handleSelectLocation(item)}
                >
                  <Text style={styles.modalItemTitle}>
                    📍 {getLocationName(item.id_localizacao)}
                  </Text>
                  <Text style={styles.modalItemSub}>
                    Saldo Atual do Produto: {item.quantidade_atual || 0}
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
    color: '#38BDF8',
    fontSize: 13,
    fontWeight: 'bold',
    marginTop: 4
  },
  changeLocBtn: {
    color: '#2563EB',
    fontSize: 12,
    fontWeight: 'bold'
  },
  noStockText: {
    color: '#EF4444',
    fontSize: 13,
    marginTop: 6
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
    backgroundColor: '#DC2626',
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