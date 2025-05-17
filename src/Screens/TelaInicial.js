import AsyncStorage from '@react-native-async-storage/async-storage';
import { useState, useEffect } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  TextInput, 
  TouchableOpacity, 
  FlatList, 
  Keyboard, 
  ScrollView,
  SafeAreaView
} from 'react-native';
import { TextInputMask } from 'react-native-masked-text';

export default function TelaInicial() {
  const [nomeProduto, setNomeProduto] = useState("");
  const [dataFabricacao, setDataFabricacao] = useState("");
  const [prazoValidade, setPrazoValidade] = useState("");
  const [quantidade, setQuantidade] = useState("");
  const [lote, setLote] = useState("");
  const [listaProdutos, setListaProdutos] = useState([]);
  const [produtoEditado, setProdutoEditado] = useState(null);

  useEffect(() => {
    buscarDados();
  }, []);

  async function salvar() {
    Keyboard.dismiss();
    
    if (!nomeProduto || !dataFabricacao || !prazoValidade || !quantidade || !lote) {
      alert("Por favor, preencha todos os campos!");
      return;
    }

    let produtos = [];
    if (await AsyncStorage.getItem("PRODUTOS") != null) {
      produtos = JSON.parse(await AsyncStorage.getItem("PRODUTOS"));
    }

    const novoProduto = {
      nome: nomeProduto,
      fabricacao: dataFabricacao,
      validade: prazoValidade,
      quantidade: quantidade,
      lote: lote.toUpperCase()
    };

    if (produtoEditado) {
      produtos[produtoEditado.index] = novoProduto;
    } else {
      produtos.push(novoProduto);
    }

    await AsyncStorage.setItem("PRODUTOS", JSON.stringify(produtos));
    alert(produtoEditado ? "Produto atualizado com sucesso!" : "Produto cadastrado no estoque!");

    setNomeProduto('');
    setDataFabricacao('');
    setPrazoValidade('');
    setQuantidade('');
    setLote('');
    setProdutoEditado(null);
    
    buscarDados();
  }

  async function buscarDados() {
    const p = await AsyncStorage.getItem("PRODUTOS");
    setListaProdutos(JSON.parse(p) || []);
  }

  async function deletarProduto(index) {
    const tempDados = listaProdutos;
    const dados = tempDados.filter((item, ind) => {
      return ind !== index;
    });

    setListaProdutos(dados);
    await AsyncStorage.setItem("PRODUTOS", JSON.stringify(dados));
    alert("Produto removido do estoque!");
  }

  function editarProduto(index) {
    const produto = listaProdutos[index];
    setNomeProduto(produto.nome);
    setDataFabricacao(produto.fabricacao);
    setPrazoValidade(produto.validade);
    setQuantidade(produto.quantidade);
    setLote(produto.lote);
    setProdutoEditado({ index });
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>CONTROLE DE ESTOQUE</Text>
          <Text style={styles.headerSubtitle}>Gerencie seus produtos com eficiência</Text>
        </View>

        <View style={styles.formContainer}>
          <Text style={styles.sectionTitle}>CADASTRO DE PRODUTOS</Text>
          
          <TextInput
            placeholder='Nome do produto*'
            placeholderTextColor="#999"
            style={styles.input}
            value={nomeProduto}
            onChangeText={(value) => setNomeProduto(value)}
          />
          
          <TextInputMask
            placeholder='Data de fabricação* (DD/MM/AAAA)'
            placeholderTextColor="#999"
            style={styles.input}
            type={'datetime'}
            options={{
              format: 'DD/MM/YYYY'
            }}
            value={dataFabricacao}
            onChangeText={(value) => setDataFabricacao(value)}
            keyboardType="numeric"
          />

          <TextInputMask
            placeholder='Prazo de validade* (DD/MM/AAAA)'
            placeholderTextColor="#999"
            style={styles.input}
            type={'datetime'}
            options={{
              format: 'DD/MM/YYYY'
            }}
            value={prazoValidade}
            onChangeText={(value) => setPrazoValidade(value)}
            keyboardType="numeric"
          />

          <TextInput
            placeholder='Quantidade*'
            placeholderTextColor="#999"
            style={styles.input}
            value={quantidade}
            onChangeText={(value) => setQuantidade(value.replace(/[^0-9]/g, ''))}
            keyboardType="numeric"
          />

          <TextInput
            placeholder='Lote* (letras e números)'
            placeholderTextColor="#999"
            style={styles.input}
            value={lote}
            onChangeText={(value) => setLote(value)}
            autoCapitalize="characters"
          />

          <TouchableOpacity 
            style={[styles.btn, produtoEditado ? styles.btnUpdate : styles.btnSave]} 
            onPress={salvar}
          >
            <Text style={styles.btnText}>{produtoEditado ? "ATUALIZAR" : "CADASTRAR"}</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.listContainer}>
          <Text style={styles.sectionTitle}>PRODUTOS EM ESTOQUE</Text>
          
          <TouchableOpacity style={styles.refreshBtn} onPress={buscarDados}>
            <Text style={styles.refreshText}>↻ ATUALIZAR LISTA</Text>
          </TouchableOpacity>

          <FlatList
            data={listaProdutos}
            scrollEnabled={false}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item, index }) => {
              if (!item || !item.nome) return null;
              return (
                <View style={styles.listItem}>
                  <View style={styles.productInfo}>
                    <Text style={styles.productName}>{item.nome}</Text>
                    <Text style={styles.productDetail}>Fabricação: {item.fabricacao}</Text>
                    <Text style={styles.productDetail}>Validade: {item.validade}</Text>
                    <Text style={styles.productDetail}>Quantidade: {item.quantidade}</Text>
                    <Text style={styles.productDetail}>Lote: {item.lote}</Text>
                  </View>

                  <View style={styles.actions}>
                    <TouchableOpacity
                      style={styles.editBtn}
                      onPress={() => editarProduto(index)}
                    >
                      <Text style={styles.btnText}>EDITAR</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={styles.deleteBtn}
                      onPress={() => deletarProduto(index)}
                    >
                      <Text style={styles.btnText}>EXCLUIR</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              );
            }}
            ListEmptyComponent={
              <View style={styles.emptyList}>
                <Text style={styles.emptyText}>Nenhum produto cadastrado</Text>
              </View>
            }
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollContainer: {
    flexGrow: 1,
    paddingBottom: 20,
  },
  header: {
    backgroundColor: '#333',
    padding: 20,
    paddingTop: 40,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  headerTitle: {
    color: '#fff',
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  headerSubtitle: {
    color: '#ccc',
    fontSize: 14,
    textAlign: 'center',
    marginTop: 5,
  },
  formContainer: {
    padding: 20,
    backgroundColor: '#fff',
    margin: 15,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  listContainer: {
    flex: 1,
    padding: 15,
    backgroundColor: '#fff',
    marginTop: 10,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 15,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    height: 50,
    paddingHorizontal: 15,
    borderRadius: 8,
    marginBottom: 15,
    backgroundColor: '#fff',
    fontSize: 16,
    color: '#000',
  },
  btn: {
    height: 50,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 15,
  },
  btnSave: {
    backgroundColor: "#000",
  },
  btnUpdate: {
    backgroundColor: "#333",
  },
  btnText: {
    color: "white",
    fontWeight: 'bold',
    fontSize: 16,
  },
  refreshBtn: {
    alignSelf: 'flex-end',
    marginBottom: 10,
  },
  refreshText: {
    color: '#000',
    fontSize: 12,
    fontWeight: 'bold',
  },
  listItem: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#eee',
    borderRadius: 8,
    padding: 15,
    marginBottom: 10,
  },
  productInfo: {
    flex: 1,
    marginBottom: 10,
  },
  productName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 5,
  },
  productDetail: {
    fontSize: 14,
    color: '#333',
    marginBottom: 3,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  editBtn: {
    backgroundColor: '#333',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  deleteBtn: {
    backgroundColor: '#ff4444',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
  },
  emptyList: {
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    color: '#999',
    fontSize: 16,
  },
});