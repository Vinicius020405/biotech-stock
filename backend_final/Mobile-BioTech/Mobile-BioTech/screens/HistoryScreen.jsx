import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function HistoryScreen() {
  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* HEADER */}
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Histórico</Text>
          <Text style={styles.subtitle}>Movimentações do estoque</Text>
        </View>

        <View style={styles.profile}>
          <Ionicons name="person-circle" size={52} color="#38BDF8" />
          <View>
            <Text style={styles.userName}>Kaique</Text>
            <Text style={styles.userRole}>Administrador Geral</Text>
          </View>
        </View>
      </View>

      {/* PESQUISA */}
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={22} color="#94A3B8" />
        <TextInput
          placeholder="Pesquisar movimentações..."
          placeholderTextColor="#94A3B8"
          style={styles.searchInput}
        />
      </View>

      {/* CARD 1 */}
      <View style={styles.card}>
        <View style={styles.iconGreen}>
          <Ionicons name="arrow-down-circle" size={28} color="#22C55E" />
        </View>
        <View style={styles.info}>
          <Text style={styles.name}>Dipirona</Text>
          <Text style={styles.text}>Quantidade: 500</Text>
          <Text style={styles.text}>Data: 25/09/2030</Text>
          <Text style={[styles.tipo, { color: '#22C55E' }]}>Entrada</Text>
        </View>
      </View>

      {/* CARD 2 */}
      <View style={styles.card}>
        <View style={styles.iconRed}>
          <Ionicons name="arrow-up-circle" size={28} color="#EF4444" />
        </View>
        <View style={styles.info}>
          <Text style={styles.name}>Seki</Text>
          <Text style={styles.text}>Quantidade: 100</Text>
          <Text style={styles.text}>Data: 13/04/2029</Text>
          <Text style={[styles.tipo, { color: '#EF4444' }]}>Saída</Text>
        </View>
      </View>

      {/* CARD 3 */}
      <View style={styles.card}>
        <View style={styles.iconGreen}>
          <Ionicons name="arrow-down-circle" size={28} color="#22C55E" />
        </View>
        <View style={styles.info}>
          <Text style={styles.name}>Adrenalina</Text>
          <Text style={styles.text}>Quantidade: 50</Text>
          <Text style={styles.text}>Data: 22/11/2032</Text>
          <Text style={[styles.tipo, { color: '#22C55E' }]}>Entrada</Text>
        </View>
      </View>

      {/* CARD 4 */}
      <View style={styles.card}>
        <View style={styles.iconRed}>
          <Ionicons name="arrow-up-circle" size={28} color="#EF4444" />
        </View>
        <View style={styles.info}>
          <Text style={styles.name}>Paracetamol</Text>
          <Text style={styles.text}>Quantidade: 80</Text>
          <Text style={styles.text}>Data: 11/05/2031</Text>
          <Text style={[styles.tipo, { color: '#EF4444' }]}>Saída</Text>
        </View>
      </View>

      {/* CARD 5 */}
      <View style={styles.card}>
        <View style={styles.iconGreen}>
          <Ionicons name="arrow-down-circle" size={28} color="#22C55E" />
        </View>
        <View style={styles.info}>
          <Text style={styles.name}>Ibuprofeno</Text>
          <Text style={styles.text}>Quantidade: 320</Text>
          <Text style={styles.text}>Data: 07/12/2030</Text>
          <Text style={[styles.tipo, { color: '#22C55E' }]}>Entrada</Text>
        </View>
      </View>

      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F1F7FB', paddingHorizontal: 20 },
  header: { marginTop: 55, marginBottom: 30 },
  title: { color: '#0F172A', fontSize: 32, fontWeight: 'bold' },
  subtitle: { color: '#64748B', marginTop: 5, fontSize: 15 },
  profile: { flexDirection: 'row', alignItems: 'center', marginTop: 20 },
  userName: { color: '#0F172A', fontSize: 18, fontWeight: 'bold' },
  userRole: { color: '#28A9F6', fontSize: 13, marginTop: 2 },
  searchContainer: {
    backgroundColor: '#FFFFFF',
    height: 62,
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 18,
    marginBottom: 25,
    borderWidth: 1,
    borderColor: '#D6E4F0',
  },
  searchInput: { flex: 1, marginLeft: 10, color: '#0F172A', fontSize: 16 },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 18,
    marginBottom: 18,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#DCEAF5',
    elevation: 3,
  },
  iconGreen: {
    width: 65,
    height: 65,
    backgroundColor: '#DCFCE7',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  iconRed: {
    width: 65,
    height: 65,
    backgroundColor: '#FEE2E2',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  info: { flex: 1 },
  name: { color: '#0F172A', fontSize: 20, fontWeight: 'bold', marginBottom: 10 },
  text: { color: '#475569', fontSize: 15, marginBottom: 4 },
  tipo: { fontSize: 15, fontWeight: 'bold' },
});
