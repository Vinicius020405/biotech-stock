import React from 'react';

import {
  View,
  Text,
  TextInput,
  FlatList,
} from 'react-native';

const caminhoes = [
  {
    id: 1,
    placa: 'PPA-2027',
    modelo: 'XF',
    marca: 'DAF',
    localizacao: 'Mogi Guaçu',
    status: 'Ativo',
  },

  {
    id: 2,
    placa: 'BRA-9087',
    modelo: 'FH 540',
    marca: 'Volvo',
    localizacao: 'Campinas',
    status: 'Manutenção',
  },

  {
    id: 3,
    placa: 'TRK-1122',
    modelo: 'Actros',
    marca: 'Mercedes',
    localizacao: 'São Paulo',
    status: 'Inativo',
  },

  {
    id: 4,
    placa: 'LOG-4500',
    modelo: 'Constellation',
    marca: 'Volkswagen',
    localizacao: 'Itapira',
    status: 'Ativo',
  },

  {
    id: 5,
    placa: 'CAR-7788',
    modelo: 'R450',
    marca: 'Scania',
    localizacao: 'Paulínia',
    status: 'Ativo',
  },

  {
    id: 6,
    placa: 'TRN-5511',
    modelo: 'Atego',
    marca: 'Mercedes',
    localizacao: 'Jaguariúna',
    status: 'Manutenção',
  },
];

export default function CaminhoesScreen() {

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
            fontWeight: 'bold',
          }}
        >
          Caminhões
        </Text>
      </View>

      {/* CONTEÚDO */}

      <View style={{ padding: 16 }}>

        <Text
          style={{
            fontSize: 28,
            fontWeight: 'bold',
          }}
        >
          Gestão de Caminhões
        </Text>

        <Text
          style={{
            color: '#666',
            marginBottom: 16,
          }}
        >
          Gerencie os caminhões do sistema
        </Text>

        {/* BUSCA */}

        <TextInput
          placeholder="Pesquisar caminhões"
          style={{
            backgroundColor: '#fff',
            padding: 12,
            borderRadius: 10,
            marginBottom: 20,
          }}
        />

        {/* LISTA */}

        <FlatList
          data={caminhoes}
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
                borderLeftColor:
                  getBorderColor(item.status),
              }}
            >
              <View
                style={{
                  marginBottom: 10,
                }}
              >
                <Text
                  style={{
                    fontWeight: 'bold',
                    fontSize: 18,
                  }}
                >
                  Caminhão #{item.id}
                </Text>
              </View>

              <Text style={{ marginBottom: 4 }}>
                Placa: {item.placa}
              </Text>

              <Text style={{ marginBottom: 4 }}>
                Modelo: {item.modelo}
              </Text>

              <Text style={{ marginBottom: 4 }}>
                Marca: {item.marca}
              </Text>

              <Text style={{ marginBottom: 4 }}>
                Localização: {item.localizacao}
              </Text>

              <Text
                style={{
                  color:
                    getStatusColor(item.status),
                  fontWeight: 'bold',
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