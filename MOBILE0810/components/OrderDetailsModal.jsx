import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, FlatList } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import api from '../src/services/api';

export default function OrderDetailsModal({ visible, onClose, order }) {
  const [items, setItems] = useState([]);

  useEffect(() => {
    if (order) {
      loadOrderItems();
    }
  }, [order]);

  const loadOrderItems = async () => {
    try {
      const isEntrada = !!order.id_pedido_entrada;
      const endpoint = isEntrada
        ? `/item-pedido-entrada?id_pedido_entrada=${order.id_pedido_entrada}`
        : `/item-pedido-saida?id_pedido_saida=${order.id_pedido_saida}`;

      const res = await api.get(endpoint);
      setItems(res.data);
    } catch (err) {
      console.log('Erro ao carregar itens:', err);
    }
  };

  if (!order) return null;

  return (
    <Modal visible={visible} animationType="slide" transparent={true} onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <View>
              <Text style={styles.modalTitle}>
                {order.id_pedido_entrada ? 'Detalhes da Entrada' : 'Detalhes da Saída'}
              </Text>
              <Text style={styles.docText}>Doc: {order.numero_documento}</Text>
            </View>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close-circle" size={30} color="#94A3B8" />
            </TouchableOpacity>
          </View>

          <Text style={styles.sectionLabel}>Itens do Pedido</Text>

          <FlatList
            data={items}
            keyExtractor={(item) => (item.id_item_entrada || item.id_item_saida).toString()}
            renderItem={({ item }) => (
              <View style={styles.itemRow}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.itemTitle}>Produto ID: #{item.id_produto}</Text>
                  <Text style={styles.itemSub}>Localização ID: #{item.id_localizacao}</Text>
                </View>
                <View style={{ alignItems: 'flex-end' }}>
                  <Text style={styles.itemQty}>Qtd: {item.quantidade}</Text>
                  {item.valor_unitario && (
                    <Text style={styles.itemVal}>R$ {item.valor_unitario}</Text>
                  )}
                </View>
              </View>
            )}
          />

          <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
            <Text style={styles.closeBtnText}>Fechar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.7)', justifyContent: 'flex-end' },
  modalContent: { backgroundColor: '#1E293B', borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 20, maxHeight: '80%' },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 },
  modalTitle: { color: '#fff', fontSize: 20, fontWeight: 'bold' },
  docText: { color: '#38BDF8', fontSize: 14, marginTop: 2 },
  sectionLabel: { color: '#94A3B8', fontSize: 14, fontWeight: 'bold', marginVertical: 10 },
  itemRow: { backgroundColor: '#0F172A', padding: 14, borderRadius: 12, marginBottom: 8, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  itemTitle: { color: '#fff', fontWeight: 'bold', fontSize: 15 },
  itemSub: { color: '#64748B', fontSize: 12, marginTop: 2 },
  itemQty: { color: '#22C55E', fontWeight: 'bold', fontSize: 15 },
  itemVal: { color: '#94A3B8', fontSize: 12 },
  closeBtn: { backgroundColor: '#334155', height: 48, borderRadius: 12, justifyContent: 'center', alignItems: 'center', marginTop: 15 },
  closeBtnText: { color: '#fff', fontWeight: 'bold' },
}); 