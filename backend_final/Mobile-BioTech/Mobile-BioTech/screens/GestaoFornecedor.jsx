import React from 'react';

import {
  View,
  Text,
  TextInput,
  FlatList,
} from 'react-native';

const fornecedores = [
  {
    id: 1,
    nome: 'Cristália',
    cnpj: '12.345.678/0001-95',
    email: 'cristalia@gmail.com',
    status: 'Ativo',
  },

  {
    id: 2,
    nome: 'Neo Química',
    cnpj: '22.395.678/0003-45',
    email: 'neoquimica@gmail.com',
    status: 'Ativo',
  },

  {
    id: 3,
    nome: 'EMS Pharma',
    cnpj: '45.678.123/0001-77',
    email: 'ems@gmail.com',
    status: 'Manutenção',
  },

  {
    id: 4,
    nome: 'Medley',
    cnpj: '88.111.222/0001-44',
    email: 'medley@gmail.com',
    status: 'Inativo',
  },

  {
    id: 5,
    nome: 'Eurofarma',
    cnpj: '77.444.222/0001-99',
    email: 'eurofarma@gmail.com',
    status: 'Ativo',
  },
];

export default function Fornecedor() {

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
          Fornecedores
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
          Gestão de Fornecedores
        </Text>

        <Text
          style={{
            color: '#666',
            marginBottom: 16,
          }}
        >
          Gerencie os fornecedores do sistema
        </Text>

        {/* BUSCA */}

        <TextInput
          placeholder="Pesquisar fornecedores"
          style={{
            backgroundColor: '#fff',
            padding: 12,
            borderRadius: 10,
            marginBottom: 20,
          }}
        />

        {/* LISTA */}

        <FlatList
          data={fornecedores}
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
                  Fornecedor #{item.id}
                </Text>
              </View>

              <Text style={{ marginBottom: 4 }}>
                Nome: {item.nome}
              </Text>

              <Text style={{ marginBottom: 4 }}>
                CNPJ: {item.cnpj}
              </Text>

              <Text style={{ marginBottom: 4 }}>
                Email: {item.email}
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