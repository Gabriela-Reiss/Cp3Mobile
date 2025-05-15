import { Ionicons } from '@expo/vector-icons';
import { createDrawerNavigator, DrawerContentScrollView, DrawerItem } from '@react-navigation/drawer';
import { NavigationContainer } from "@react-navigation/native";
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import CabecalhoHeader from './src/Components/CabecalhoHeader';
import TelaInicial from './src/Screens/TelaInicial';
import TelaEquipe from './src/Screens/TelaEquipe';

const Drawer = createDrawerNavigator();

function CustomDrawerContent(props) {
  return (
    <DrawerContentScrollView {...props} style={styles.drawerContainer}>
      <View style={styles.drawerHeader}>
        <View style={styles.userIconContainer}>
          <Ionicons name="person" size={48} color="white" />
        </View>
        <Text style={styles.drawerTitle}>Funcionário</Text>
      </View>

      <DrawerItem
        label="Início"
        icon={() => (
          <Ionicons name="home" size={24} color="#000" style={{ marginRight: 10 }} />
        )}
        onPress={() => props.navigation.navigate('TelaInicial')}
        labelStyle={styles.drawerLabel}
        style={styles.drawerItem}
      />

      <DrawerItem
        label="Nossa Equipe"
        icon={() => (
          <Ionicons name="people" size={24} color="#000" style={{ marginRight: 10 }} />
        )}
        onPress={() => props.navigation.navigate('TelaEquipe')}
        labelStyle={styles.drawerLabel}
        style={styles.drawerItem}
      />
    </DrawerContentScrollView>
  );
}

// Componente principal App
export default function App() {
  return (
    <NavigationContainer>
      <Drawer.Navigator
        drawerContent={(props) => <CustomDrawerContent {...props} />}
        screenOptions={{
          drawerActiveBackgroundColor: '#333',
          drawerActiveTintColor: 'white',
          drawerInactiveTintColor: '#ccc',
          drawerStyle: {
            backgroundColor: '#000',
            width: 280,
          },
          header: (props) => <CabecalhoHeader {...props} />,
        }}
      >
        <Drawer.Screen 
          name="TelaInicial" 
          component={TelaInicial} 
          options={{ 
            title: 'Início',
            drawerIcon: ({ color }) => (
              <Ionicons name="home" size={24} color={color} />
            )
          }}
        />
        <Drawer.Screen 
          name="TelaEquipe" 
          component={TelaEquipe} 
          options={{ title: 'Equipe'}}
        />
      </Drawer.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  drawerContainer: {
    backgroundColor: '#fff',
  },
  drawerHeader: {
    padding: 20,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#000',
  },
  userIconContainer: {
    backgroundColor: '#000',
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    marginBottom: 10,
  },
  drawerTitle: {
    fontSize: 22,
    color: '#000',
    marginTop: 10,
    letterSpacing: 0.5,
  },
  drawerLabel: {
    fontSize: 19,
    color: '#000',
    marginLeft: -16,
    letterSpacing: 0.3,
  },
  drawerItem: {
    marginVertical: 4,
    borderRadius: 8,
    backgroundColor: 'transparent',
  }
});