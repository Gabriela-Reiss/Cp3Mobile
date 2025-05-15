import AsyncStorage from '@react-native-async-storage/async-storage';
import { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, FlatList, Keyboard, Image } from 'react-native';
import { TextInputMask } from 'react-native-masked-text';

export default function TelaInicial() {
  const [nomeProduto, setNomeProduto] = useState("")
  const [precoProduto, setPrecoProduto] = useState("")
  const [listaProdutos, setListaProdutos] = useState([])
  const [produtoEditado, setProdutoEditado] = useState(null)

  useEffect(() => {
    buscarDados()
  }, [])

  async function salvar() {
    Keyboard.dismiss()
    
    if (!nomeProduto || !precoProduto) {
      alert("Por favor, preencha todos os campos!");
      return;
    }

    let produtos = []
    if (await AsyncStorage.getItem("PRODUTOS") != null) {
      produtos = JSON.parse(await AsyncStorage.getItem("PRODUTOS"))
    }

    if (produtoEditado) {
      produtos[produtoEditado.index] = { nome: nomeProduto, preco: precoProduto }
    } else {
      produtos.push({ nome: nomeProduto, preco: precoProduto })
    }

    await AsyncStorage.setItem("PRODUTOS", JSON.stringify(produtos))
    alert(produtoEditado ? "Produto atualizado com sucesso!" : "Produto cadastrado no estoque!")

    setProdutoEditado(null)
    setNomeProduto('')
    setPrecoProduto('')
    buscarDados()
  }

  async function buscarDados() {
    const p = await AsyncStorage.getItem("PRODUTOS")
    setListaProdutos(JSON.parse(p) || [])
  }

  async function deletarProduto(index) {
    const tempDados = listaProdutos
    const dados = tempDados.filter((item, ind) => {
      return ind !== index
    })

    setListaProdutos(dados)
    await AsyncStorage.setItem("PRODUTOS", JSON.stringify(dados))
    alert("Produto removido do estoque!")
  }

  function editarProduto(index) {
    const produto = listaProdutos[index]
    setNomeProduto(produto.nome)
    setPrecoProduto(produto.preco)
    setProdutoEditado({ index })
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>CONTROLE DE ESTOQUE</Text>
        <Text style={styles.headerSubtitle}>Gerencie seus produtos com eficiência</Text>
      </View>

      <View style={styles.formContainer}>
        <Text style={styles.sectionTitle}>CADASTRO DE PRODUTOS</Text>
        
        <TextInput
          placeholder='Nome do produto'
          placeholderTextColor="#999"
          style={styles.input}
          value={nomeProduto}
          onChangeText={(value) => setNomeProduto(value)}
        />
        
        <TextInputMask
          placeholder='Preço unitário'
          placeholderTextColor="#999"
          style={styles.input}
          type='money'
          options={{
            precision: 2,
            separator: ',',
            delimiter: '.',
            unit: 'R$ ',
            suffixUnit: ''
          }}
          value={precoProduto}
          onChangeText={(value) => setPrecoProduto(value)}
          keyboardType="numeric"
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
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item, index }) => {
            if (!item || !item.nome) return null;
            return (
              <View style={styles.listItem}>
                <View style={styles.productInfo}>
                  <Text style={styles.productName}>{item.nome}</Text>
                  <Text style={styles.productPrice}>{item.preco}</Text>
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
            )
          }}
          ListEmptyComponent={
            <View style={styles.emptyList}>
              <Text style={styles.emptyText}>Nenhum produto cadastrado</Text>
            </View>
          }
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  productInfo: {
    flex: 1,
  },
  productName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 5,
  },
  productPrice: {
    fontSize: 14,
    color: '#333',
  },
  actions: {
    flexDirection: 'row',
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