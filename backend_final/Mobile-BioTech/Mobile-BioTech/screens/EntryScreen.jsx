import { 
  View, 
  Text, 
  TextInput, 
  FlatList 
} from 'react-native';

const pedidos = [
  {
    id: 16,
    cliente: 'Paulo',
    tipo: 'Comprimido',
    quantidade: 1000,
    data: '2026-08-12'
  },

  {
    id: 17,
    cliente: 'Kaique',
    tipo: 'Injetável',
    quantidade: 250,
    data: '2026-08-14'
  },

  {
    id: 18,
    cliente: 'Marcos',
    tipo: 'Xarope',
    quantidade: 500,
    data: '2026-08-15'
  },

  {
    id: 19,
    cliente: 'Vinicius',
    tipo: 'Pomada',
    quantidade: 120,
    data: '2026-08-16'
  },

  {
    id: 20,
    cliente: 'Vitor',
    tipo: 'Cápsula',
    quantidade: 800,
    data: '2026-08-17'
  },

  {
    id: 21,
    cliente: 'Ana',
    tipo: 'Comprimido',
    quantidade: 1500,
    data: '2026-08-18'
  },

  {
    id: 22,
    cliente: 'Carlos',
    tipo: 'Injetável',
    quantidade: 320,
    data: '2026-08-18'
  },

  {
    id: 23,
    cliente: 'Juliana',
    tipo: 'Xarope',
    quantidade: 700,
    data: '2026-08-19'
  },

  {
    id: 24,
    cliente: 'Fernanda',
    tipo: 'Pomada',
    quantidade: 90,
    data: '2026-08-20'
  },

  {
    id: 25,
    cliente: 'Roberto',
    tipo: 'Cápsula',
    quantidade: 640,
    data: '2026-08-20'
  }
];

export default function PedidosScreen() {
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
          Pedidos Entrada
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
          Pedido de Entrada
        </Text>

        <Text 
          style={{ 
            color: '#666', 
            marginBottom: 16 
          }}
        >
          Gerencie os pedidos
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
          data={pedidos}
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
                elevation: 4
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
                  Pedido #{item.id}
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