import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, ActivityIndicator, FlatList, Image, TouchableOpacity, Modal, Button } from 'react-native';
// import {analytics} from '../firebase/firebaseConfig';
import Voice from '@react-native-voice/voice';

export default function List() {
  const [data, setData] = useState<DataItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState<oneSelectedItem | null>(null);

  const [recognized, setRecognized] = useState('');
  const [pitch, setPitch] = useState('');
  const [error, setError] = useState('');
  const [end, setEnd] = useState('');
  const [started, setStarted] = useState('');
  const [results, setResults] = useState<string[]>([]);

  interface DataItem {
    id: number;
    firstName: string;
    lastName: String;
    title: String;
    family: String;
    imageUrl: String;
  }
  interface oneSelectedItem {
    id: number;
    firstName: string;
    lastName: String;
    imageUrl: String;
    title: String;
    family: String;
  }

  const handleItemPress = (item: oneSelectedItem) => {
    setSelectedItem(item);
    setModalVisible(true);

    // This implementation is not working
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


    Voice.onSpeechStart = onSpeechStart;
    Voice.onSpeechRecognized = onSpeechRecognized;
    Voice.onSpeechEnd = onSpeechEnd;
    Voice.onSpeechError = onSpeechError;
    Voice.onSpeechResults = onSpeechResults;
    Voice.onSpeechPartialResults = onSpeechPartialResults;
    Voice.onSpeechVolumeChanged = onSpeechVolumeChanged;

    return () => {
      Voice.destroy().then(Voice.removeAllListeners);
    };
  }, []);


  const onSpeechStart = (e: any) => {
    setStarted('√');
  };

  const onSpeechRecognized = (e: any) => {
    setRecognized('√');
  };

  const onSpeechEnd = (e: any) => {
    setEnd('√');
  };

  const onSpeechError = (e: any) => {
    setError(JSON.stringify(e.error));
  };

  const onSpeechResults = (e: any) => {
    setResults(e.value);
    handleVoiceCommand(e.value);
  };

  const onSpeechPartialResults = (e: any) => {
    setResults(e.value);
  };

  const onSpeechVolumeChanged = (e: any) => {
    setPitch(e.value);
  };

  const startRecognizing = async () => {
    try {
      await Voice.start('en-US');
      setError('');
      setStarted('');
      setResults([]);
      setPitch('');
      setRecognized('');
      setEnd('');
    } catch (e) {
      console.error(e);
    }
  };

  const handleVoiceCommand = (commands: string[]) => {
    const command = commands[0].toLowerCase();
    if (command.includes('close')) {
      setModalVisible(false);
    } else {
      const item = data.find(item =>
        item.firstName.toLowerCase() === command ||
        item.lastName.toLowerCase() === command
      );
      if (item) {
        handleItemPress(item);
      }
    }
  };

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
      {/* This option is still developing */}
      {/* <Button title="Start Voice Recognition" onPress={startRecognizing} /> */}
      <FlatList
        data={data}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => handleItemPress(item)}>
            <View style={styles.item}>
              <Image source={{ uri: `${item.imageUrl}` }} style={styles.image} />
              <Text style={styles.firstName}>{item.firstName}</Text>
              <Text>{item.lastName}</Text>
            </View>
          </TouchableOpacity>
        )}
      />
      {selectedItem && (
        // <Modal
        //   animationType="slide"
        //   transparent={true}
        //   visible={modalVisible}
        //   onRequestClose={() => setModalVisible(false)}
        // >
        //   <View style={styles.modalContainer}>
        //     <View style={styles.modalView}>

        //       <Image source={{ uri: `${selectedItem.imageUrl}` }} style={styles.modalImage} />
        //       <Text style={styles.modalText}>First Name : {selectedItem.firstName}</Text>
        //       <Text style={styles.modalText}>Last Name : {selectedItem.lastName}</Text>
        //       <Text style={styles.modalText}>Title : {selectedItem.title}</Text>
        //       <Text style={styles.modalText}>Family : {selectedItem.family}</Text>
        //       <Button title="Close" onPress={() => setModalVisible(false)} />
        //     </View>
        //   </View>
        // </Modal>


<Modal
      animationType="slide"
      transparent={true}
      visible={modalVisible}
      onRequestClose={() => setModalVisible(false)}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalView}>
          <Image source={{ uri: `${selectedItem.imageUrl}` }} style={styles.modalImage} />
          <Text style={styles.modalText}>First Name: {selectedItem.firstName}</Text>
          <Text style={styles.modalText}>Last Name: {selectedItem.lastName}</Text>
          <Text style={styles.modalText}>Title: {selectedItem.title}</Text>
          <Text style={styles.modalText}>Family: {selectedItem.family}</Text>
          <Button title="Close" onPress={() => setModalVisible(false)} color="#2196F3" />
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
    backgroundColor: '#ffffff',
    paddingTop: 50,
    marginLeft: 0,
  },
  title: {
    fontSize: 30,
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
  firstName: {
    paddingLeft: 20,
    paddingRight: 7,
  },
  image: {
    width: 70,
    height: 70,
    marginRight: 10,
  }, 
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalView: {
    width: '80%',
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 20,
  },
  modalText: {
    fontSize: 16,
    marginBottom: 10,
    color: '#333',
  },
});