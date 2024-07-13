import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, ActivityIndicator, FlatList, Image, TouchableOpacity,  Modal, Button } from 'react-native';
// import analytics from '@react-native-firebase/analytics';

export default function List() {
  const [data, setData] = useState<DataItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState<oneSelectedItem | null>(null);

  interface DataItem {
    id: number;
    firstName: string;
    lastName:String;
    title: String;
    family: String;
    imageUrl: String;
  }
  interface oneSelectedItem {
    id: number;
    firstName: string;
    lastName:String;
    imageUrl: String;
    title: String;
    family: String;
  }

  const handleItemPress = (item : oneSelectedItem) => {
    setSelectedItem(item);
    setModalVisible(true);

    // analytics().logEvent('item_selected', {
    //   id: item.id,
    //   firstName: item.firstName,
    //   lastName: item.lastName,
    // });
  };

  useEffect(() => {
    fetch('https://thronesapi.com/api/v2/Characters')
      .then(response => response.json())
      .then(json => {
        setData(json);
        setLoading(false);
      })
      .catch(error => {
        console.error(error);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#00ff00" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>My App</Text>
      <FlatList
        data={data}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => handleItemPress(item)}>
          <View style={styles.item}>
            <Image source={{ uri: `${item.imageUrl}` }}  style={styles.image} />
            <Text style={styles.firstName}>{item.firstName}</Text>
            <Text>{item.lastName}</Text>
          </View>
          </TouchableOpacity>
        )}
      />
      {selectedItem && (
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalView}>
              
              <Image source={{ uri: `${selectedItem.imageUrl}` }} style={styles.modalImage} />
              <Text style={styles.modalText}>First Name : {selectedItem.firstName}</Text>
              <Text style={styles.modalText}>Last Name : {selectedItem.lastName}</Text>
              <Text style={styles.modalText}>Title : {selectedItem.title}</Text>
              <Text style={styles.modalText}>Family : {selectedItem.family}</Text>
              <Button title="Close" onPress={() => setModalVisible(false)} />
            </View>
          </View>
        </Modal>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    // alignItems: 'center',
    paddingTop: 50,
    marginLeft: 0,
  },
  title: {
    fontSize: 24,
    color: '#000',
    textAlign: 'center',
    marginBottom: 30,
  },
  item: {
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 55,
    
  },
  firstName:{
    paddingLeft: 20,
    paddingRight: 7,
  },
  image: {
    width: 50,
    height: 50,
    marginRight: 10,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalView: {
    width: 300,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalText: {
    marginBottom: 18,
    textAlign: 'left',
    fontSize: 16,
  },
  modalImage: {
    width: 100,
    height: 100,
    marginBottom: 15,
  },
});