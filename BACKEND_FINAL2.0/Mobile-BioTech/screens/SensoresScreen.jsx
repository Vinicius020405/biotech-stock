import { 
  View, 
  Text, 
  TextInput, 
  FlatList 
} from 'react-native';

const sensores = [
  {
    id: 1,
    localizacao: 'Estoque A1',
    tipo: 'Temperatura',
    status: 'Ativo',
    leitura: '22°C'
  },

  {
    id: 2,
    localizacao: 'Câmara Fria',
    tipo: 'Umidade',
    status: 'Manutenção',
    leitura: '--'
  },

  {
    id: 3,
    localizacao: 'Setor Medicamentos',
    tipo: 'Temperatura',
    status: 'Inativo',
    leitura: '--'
  },

  {
    id: 4,
    localizacao: 'Corredor B',
    tipo: 'Movimento',
    status: 'Ativo',
    leitura: 'Detectado'
  },

  {
    id: 5,
    localizacao: 'Entrada Principal',
    tipo: 'Presença',
    status: 'Ativo',
    leitura: 'Online'
  },

  {
    id: 6,
    localizacao: 'Estoque Refrigerado',
    tipo: 'Temperatura',
    status: 'Manutenção',
    leitura: '--'
  },

  {
    id: 7,
    localizacao: 'Depósito',
    tipo: 'Fumaça',
    status: 'Inativo',
    leitura: '--'
  },

  {
    id: 8,
    localizacao: 'Sala Técnica',
    tipo: 'Umidade',
    status: 'Ativo',
    leitura: '48%'
  }
];

export default function SensoresScreen() {

  function getBorderColor(status) {
    if (status === 'Ativo') {
      return '#28A9F6';
    }

    if (status === 'Manutenção') {
      return '#FACC15';
    }

    return '#EF4444';
  }

  function getStatusColor(status) {
    if (status === 'Ativo') {
      return '#28A9F6';
    }

    if (status === 'Manutenção') {
      return '#EAB308';
    }

    return '#DC2626';
  }

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
          Sensores
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
          Monitoramento
        </Text>

        <Text 
          style={{ 
            color: '#666', 
            marginBottom: 16 
          }}
        >
          Gerencie os sensores do sistema
        </Text>

        {/* BUSCA */}
        <TextInput
          placeholder="Pesquisar sensores"
          style={{
            backgroundColor: '#fff',
            padding: 12,
            borderRadius: 10,
            marginBottom: 20
          }}
        />

        {/* LISTA */}
        <FlatList
          data={sensores}
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
                borderLeftColor: getBorderColor(item.status)
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
                  Sensor #{item.id}
                </Text>
              </View>

              <Text style={{ marginBottom: 4 }}>
                Localização: {item.localizacao}
              </Text>

              <Text style={{ marginBottom: 4 }}>
                Tipo: {item.tipo}
              </Text>

              <Text style={{ marginBottom: 4 }}>
                Leitura: {item.leitura}
              </Text>

              <Text
                style={{
                  color: getStatusColor(item.status),
                  fontWeight: 'bold'
                }}
              >
                Status: {item.status}
              </Text>
            </View>
          )}
        />
      </View>
    </View>
  );
}