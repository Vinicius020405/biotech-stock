import React from 'react';

import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
} from 'react-native';

export default function HomeScreen() {
  return (
    <View style={styles.container}>

      {/* HEADER */}

      <View style={styles.header}>

        <Image
          source={require('../assets/logobranca2.png')}
          style={styles.logo}
          resizeMode="contain"
        />

        <View style={styles.userArea}>

          <Image
            source={require('../assets/user.jpg')}
            style={styles.user}
          />

          <Text style={styles.userText}>
            Gestor
          </Text>

        </View>

      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
      >

        {/* GRÁFICOS */}

        <Text style={styles.sectionTitle}>
          Gráficos de vendas:
        </Text>

        <View style={styles.graphContainer}>

          {/* CARD 1 */}

          <View style={styles.graphCard}>

            <Text style={styles.graphTitle}>
              Vendas Mensais
            </Text>

            <Text style={styles.graphNumber}>
              1.250
            </Text>

            <Text style={styles.graphText}>
              Produtos vendidos
            </Text>

          </View>

          {/* CARD 2 */}

          <View style={styles.graphCard}>

            <Text style={styles.graphTitle}>
              Receita
            </Text>

            <Text style={styles.graphNumber}>
              R$ 12.500
            </Text>

            <Text style={styles.graphText}>
              Faturamento mensal
            </Text>

          </View>

        </View>

        {/* ITENS */}

        <Text style={styles.sectionTitle}>
          Itens mais vendidos:
        </Text>

        <View style={styles.productsContainer}>

          {/* CARD 1 */}

          <View style={styles.productCard}>

            <Text style={styles.productIcon}>
              💊
            </Text>

            <Text style={styles.productName}>
              Dipirona
            </Text>

            <Text style={styles.productInfo}>
              520 vendas
            </Text>

          </View>

          {/* CARD 2 */}

          <View style={styles.productCard}>

            <Text style={styles.productIcon}>
              🧴
            </Text>

            <Text style={styles.productName}>
              Paracetamol
            </Text>

            <Text style={styles.productInfo}>
              410 vendas
            </Text>

          </View>

          {/* CARD 3 */}

          <View style={styles.productCard}>

            <Text style={styles.productIcon}>
              💉
            </Text>

            <Text style={styles.productName}>
              Dorflex
            </Text>

            <Text style={styles.productInfo}>
              380 vendas
            </Text>

          </View>

        </View>

        {/* BOTÃO */}

        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>
            Ver Relatórios
          </Text>
        </TouchableOpacity>

      </ScrollView>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F3F3',
  },

  header: {
    width: '100%',
    height: 100,
    backgroundColor: '#28A9F6',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 25,
  },

  logo: {
    width: 140,
    height: 70,
    marginBottom: 20,
    left: 210,
  },

  userArea: {
    alignItems: 'center',
  },

  user: {
    width: 45,
    height: 45,
    borderRadius: 50,
  },

  userText: {
    fontWeight: 'bold',
    marginTop: 2,
  },

  sectionTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#222',
    marginTop: 30,
    marginLeft: 20,
    marginBottom: 20,
  },

  graphContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 10,
    marginBottom: 20,
  },

  graphCard: {
    width: 170,
    height: 140,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    padding: 15,
  },

  graphTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },

  graphNumber: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#28A9F6',
  },

  graphText: {
    fontSize: 14,
    color: '#666',
    marginTop: 10,
    textAlign: 'center',
  },

  productsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 10,
    paddingHorizontal: 10,
  },

  productCard: {
    width: 135,
    height: 150,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    padding: 10,
  },

  productIcon: {
    fontSize: 42,
    marginBottom: 12,
  },

  productName: {
    marginTop: 8,
    fontWeight: 'bold',
    fontSize: 16,
    color: '#222',
  },

  productInfo: {
    fontSize: 14,
    color: '#666',
    marginTop: 6,
  },

  button: {
    marginTop: 40,
    marginHorizontal: 20,
    height: 60,
    backgroundColor: '#28A9F6',
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 40,
  },

  buttonText: {
    color: '#FFF',
    fontSize: 20,
    fontWeight: 'bold',
  },
});