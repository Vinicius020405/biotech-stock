import { 
  View, 
  Text, 
  TextInput, 
  FlatList 
} from 'react-native';

const pedidosSaida = [
  {
    id: 31,
    cliente: 'Hospital São Lucas',
    tipo: 'Injetável',
    quantidade: 120,
    data: '2026-09-02'
  },

  {
    id: 32,
    cliente: 'Farmácia Central',
    tipo: 'Comprimido',
    quantidade: 850,
    data: '2026-09-03'
  },

  {
    id: 33,
    cliente: 'Clínica Vida',
    tipo: 'Pomada',
    quantidade: 75,
    data: '2026-09-03'
  },

  {
    id: 34,
    cliente: 'UBS Itapira',
    tipo: 'Xarope',
    quantidade: 200,
    data: '2026-09-04'
  },

  {
    id: 35,
    cliente: 'Hospital Municipal',
    tipo: 'Cápsula',
    quantidade: 430,
    data: '2026-09-05'
  },

  {
    id: 36,
    cliente: 'DrogaMais',
    tipo: 'Comprimido',
    quantidade: 1600,
    data: '2026-09-05'
  },

  {
    id: 37,
    cliente: 'Farmácia Popular',
    tipo: 'Injetável',
    quantidade: 95,
    data: '2026-09-06'
  },

  {
    id: 38,
    cliente: 'Clínica Bem Estar',
    tipo: 'Pomada',
    quantidade: 40,
    data: '2026-09-06'
  },

  {
    id: 39,
    cliente: 'Santa Casa',
    tipo: 'Xarope',
    quantidade: 310,
    data: '2026-09-07'
  },

  {
    id: 40,
    cliente: 'Posto de Saúde Centro',
    tipo: 'Cápsula',
    quantidade: 520,
    data: '2026-09-08'
  }
];

export default function PedidosSaidaScreen() {
  return (
    <View style={{ flex: 1, backgroundColor: '#f4f4f4' }}>

      {/* HEADER */}
      <View
        style={{
          backgroundColor: '#28A9F6',
          padding: 16,
          alignItems: 'center',
        }}
      >
        <Text 
          style={{ 
            color: '#fff', 
            fontSize: 20, 
            fontWeight: 'bold' 
          }}
        >
          Pedidos de Saída
        </Text>
      </View>

      {/* CONTEÚDO */}
      <View style={{ padding: 16 }}>

        <Text 
          style={{ 
            fontSize: 28, 
            fontWeight: 'bold' 
          }}
        >
          Saída de Produtos
        </Text>

        <Text 
          style={{ 
            color: '#666', 
            marginBottom: 16 
          }}
        >
          Gerencie as saídas do estoque
        </Text>

        {/* BUSCA */}
        <TextInput
          placeholder="Pesquisar pedidos"
          style={{
            backgroundColor: '#fff',
            padding: 12,
            borderRadius: 10,
            marginBottom: 20
          }}
        />

        {/* LISTA */}
        <FlatList
          data={pedidosSaida}
          keyExtractor={(item) => 
            item.id.toString()
          }
          renderItem={({ item }) => (
            <View
              style={{
                backgroundColor: '#fff',
                padding: 16,
                borderRadius: 14,
                marginBottom: 16,
                elevation: 4,
                borderLeftWidth: 6,
                borderLeftColor: '#28A9F6'
              }}
            >
              <View
                style={{
                  marginBottom: 10
                }}
              >
                <Text 
                  style={{ 
                    fontWeight: 'bold', 
                    fontSize: 18 
                  }}
                >
                  Saída #{item.id}
                </Text>
              </View>

              <Text style={{ marginBottom: 4 }}>
                Cliente: {item.cliente}
              </Text>

              <Text style={{ marginBottom: 4 }}>
                Tipo: {item.tipo}
              </Text>

              <Text style={{ marginBottom: 4 }}>
                Quantidade: {item.quantidade}
              </Text>

              <Text>
                Data: {item.data}
              </Text>
            </View>
          )}
        />
      </View>
    </View>
  );
}