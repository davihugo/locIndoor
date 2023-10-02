import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Image, Button, Dimensions, TextInput } from 'react-native';
import * as ImagePicker from 'expo-image-picker';

export default function App() {
  const [selectedImage, setSelectedImage] = useState(null);
  const [imageWidth, setImageWidth] = useState(null);
  const [imageHeight, setImageHeight] = useState(null);
  const [inputX, setInputX] = useState('');
  const [inputY, setInputY] = useState('');
  const [pointX, setPointX] = useState(null);
  const [pointY, setPointY] = useState(null);

  

  useEffect(() => {
    (async () => {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        alert('Desculpe, precisamos de permissão para acessar sua galeria.');
      }
    })();
  }, []);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: false,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {

      setSelectedImage(result.uri);

      Image.getSize(result.uri, (width, height) => {
        setImageWidth(width);
        setImageHeight(height);

          
        console.log(width);
        console.log(height);

      });
    }
  };

  const handleCoordinatesSubmit = () => {
    const x = parseFloat(inputX);
    const y = parseFloat(inputY);

    if (!isNaN(x) && !isNaN(y) && imageWidth && imageHeight) {
      
      if (x >= 0 && x <= imageWidth && y >= 0 && y <= imageHeight) {
        // Normalizar as coordenadas para estar na mesma escala que a imagem

        const normalizedX = (x / imageWidth) * Dimensions.get('window').width;
        const normalizedY = (y / imageHeight) * Dimensions.get('window').height;

        console.log(imageWidth);
        
        console.log(Dimensions.get('window').width);
        
        setPointX(normalizedX);
        
        console.log(normalizedX);
        
        setPointY(normalizedY);
        
        console.log(normalizedY);

      } else {
        alert('Por favor, escolha uma imagem antes de inserir coordenadas.');
      }
    } else {
      // Exibir uma mensagem de erro caso as coordenadas não sejam válidas
      alert('Por favor, insira coordenadas válidas.');
    }
  };

  return (
    <View style={styles.container}>
      {selectedImage ? (
        <View>
          <Image source={{ uri: selectedImage }} style={{
            width: imageWidth,
            height: imageHeight,
          }} resizeMode="stretch" 
          />
          {pointX !== null && pointY !== null && (
            <View style={[styles.point, { left: pointX, top: pointY }]} />
          )}
        </View>
      ) : (
        <Text style={styles.noImageText}>Nenhuma imagem selecionada</Text>
      )}

      {/* Inserir coordenadas */}
      <View style={styles.coordinatesInput}>
        <Text>Coordenada X:</Text>
        <TextInput
          style={styles.input}
          value={inputX}
          onChangeText={(text) => setInputX(text)}
          keyboardType="numeric"
        />
        <Text>Coordenada Y:</Text>
        <TextInput
          style={styles.input}
          value={inputY}
          onChangeText={(text) => setInputY(text)}
          keyboardType="numeric"
        />
        <Button title="Mostrar Ponto" onPress={handleCoordinatesSubmit} />
      </View>

      <Button title="Escolher Imagem" onPress={pickImage} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
  noImageText: {
    fontSize: 18,
    marginBottom: 20,
  },
  coordinatesInput: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  input: {
    width: 50,
    height: 30,
    borderWidth: 1,
    borderColor: 'gray',
    marginHorizontal: 5,
  },
  point: {
    width: 10,
    height: 10,
    backgroundColor: 'red',
    position: 'absolute',
  },
});
