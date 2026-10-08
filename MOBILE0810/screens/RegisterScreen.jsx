import React, { useState } from 'react';

import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';

export default function RegisterScreen({
  navigation,
}) {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');

  function cadastrar() {
    navigation.navigate('App');
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={
        Platform.OS === 'ios'
          ? 'padding'
          : undefined
      }
    >
      {/* FUNDO */}
      <View style={styles.background} />

      {/* CARD */}
      <View style={styles.card}>
        
        {/* LOGO */}
        <Image
          source={require('../assets/logobranca2.png')}
          style={styles.logo}
          resizeMode="contain"
        />

        {/* TÍTULO */}
        <Text style={styles.title}>
          Criar Conta
        </Text>

        <Text style={styles.subtitle}>
          Cadastre-se para acessar o sistema
        </Text>

        {/* NOME */}
        <Text style={styles.label}>
          Nome
        </Text>

        <TextInput
          placeholder="Digite seu nome"
          placeholderTextColor="#BFC7D5"
          style={styles.input}
          value={nome}
          onChangeText={setNome}
        />

        {/* EMAIL */}
        <Text style={styles.label}>
          Email
        </Text>

        <TextInput
          placeholder="Digite seu email"
          placeholderTextColor="#BFC7D5"
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        {/* SENHA */}
        <Text style={styles.label}>
          Senha
        </Text>

        <TextInput
          placeholder="Digite sua senha"
          placeholderTextColor="#BFC7D5"
          secureTextEntry
          style={styles.input}
          value={senha}
          onChangeText={setSenha}
        />

        {/* BOTÃO CADASTRAR */}
        <TouchableOpacity
          style={styles.registerButton}
          onPress={cadastrar}
          activeOpacity={0.8}
        >
          <Text style={styles.registerButtonText}>
            Cadastrar
          </Text>
        </TouchableOpacity>

        {/* DIVISÃO */}
        <View style={styles.line} />

        {/* BOTÃO LOGIN */}
        <TouchableOpacity
          style={styles.loginButton}
          activeOpacity={0.8}
          onPress={() =>
            navigation.navigate('Login')
          }
        >
          <Text style={styles.loginButtonText}>
            Já tenho conta
          </Text>
        </TouchableOpacity>

      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#031826',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },

  background: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    backgroundColor: '#031826',
  },

  card: {
    width: '100%',
    backgroundColor: '#1C3144',
    borderRadius: 30,
    padding: 28,
    borderWidth: 1,
    borderColor:
      'rgba(255,255,255,0.08)',
  },

  logo: {
    width: 110,
    height: 110,
    alignSelf: 'center',
    marginBottom: 5,
  },

  title: {
    fontSize: 34,
    color: '#FFFFFF',
    fontWeight: 'bold',
    textAlign: 'center',
  },

  subtitle: {
    fontSize: 18,
    color: '#D7DCE2',
    textAlign: 'center',
    marginTop: 5,
    marginBottom: 30,
  },

  label: {
    color: '#FFFFFF',
    fontSize: 16,
    marginBottom: 8,
    marginLeft: 5,
    fontWeight: '500',
  },

  input: {
    width: '100%',
    height: 56,
    backgroundColor: '#4B5D6B',
    borderRadius: 18,
    paddingHorizontal: 18,
    color: '#FFFFFF',
    fontSize: 16,
    marginBottom: 20,
  },

  registerButton: {
    width: '100%',
    height: 58,
    backgroundColor: '#119CFF',
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
  },

  registerButtonText: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: 'bold',
  },

  line: {
    width: '100%',
    height: 1,
    backgroundColor:
      'rgba(255,255,255,0.15)',
    marginVertical: 22,
  },

  loginButton: {
    width: '100%',
    height: 54,
    backgroundColor: '#4B5D6B',
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },

  loginButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
});