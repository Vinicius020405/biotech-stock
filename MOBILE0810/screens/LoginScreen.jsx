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
  Alert,
  ActivityIndicator,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [loading, setLoading] = useState(false);

  async function entrarSistema() {
    if (!email.trim() || !senha.trim()) {
      Alert.alert('Atenção', 'Por favor, preencha o e-mail e a senha.');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('http://10.135.60.79:3000/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email.trim(),
          senha: senha.trim(),
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // Extrai o objeto do utilizador retornado pelo servidor
        const usuarioLogado = data.user || data.usuario || data;
        
        // Guarda os dados completos do utilizador no dispositivo
        await AsyncStorage.setItem('@user_data', JSON.stringify(usuarioLogado));

        // Redireciona e limpa o histórico de ecrãs
        navigation.reset({
          index: 0,
          routes: [{ name: 'MainApp' }],
        });
      } else {
        Alert.alert('Erro ao entrar', data.message || 'E-mail ou senha incorretos.');
      }
    } catch (error) {
      Alert.alert(
        'Erro de Conexão',
        'Não foi possível conectar ao servidor. Verifique se o backend está a rodar.'
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={styles.background} />

      <View style={styles.card}>
        <Image
          source={require('../assets/logobranca2.png')}
          style={styles.logo}
          resizeMode="contain"
        />

        <Text style={styles.title}>Acesso ao Sistema</Text>
        <Text style={styles.subtitle}>Entre com suas credenciais</Text>

        <Text style={styles.label}>Email</Text>
        <TextInput
          placeholder="Digite seu email"
          placeholderTextColor="#BFC7D5"
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <Text style={styles.label}>Senha</Text>
        <TextInput
          placeholder="Digite sua senha"
          placeholderTextColor="#BFC7D5"
          secureTextEntry
          style={styles.input}
          value={senha}
          onChangeText={setSenha}
        />

        <TouchableOpacity
          style={styles.loginButton}
          onPress={entrarSistema}
          activeOpacity={0.8}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#FFFFFF" size="small" />
          ) : (
            <Text style={styles.loginButtonText}>Entrar</Text>
          )}
        </TouchableOpacity>

        <View style={styles.line} />

        
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
    borderColor: 'rgba(255,255,255,0.08)',
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
  loginButton: {
    width: '100%',
    height: 58,
    backgroundColor: '#119CFF',
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
  },
  loginButtonText: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: 'bold',
  },
  line: {
    width: '100%',
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.15)',
    marginVertical: 22,
  },
  createButton: {
    width: '100%',
    height: 54,
    backgroundColor: '#4B5D6B',
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  createButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
});