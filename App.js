import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Image, Button, Dimensions, TextInput, ScrollView } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as ImageManipulator from 'expo-image-manipulator';



export default function App() {
  const [selectedImage, setSelectedImage] = useState(null);
  const [imageWidth, setImageWidth] = useState(null);
  const [imageHeight, setImageHeight] = useState(null);
  const [inputX, setInputX] = useState('');
  const [inputY, setInputY] = useState('');
  const [pointX, setPointX] = useState([]);
  const [pointY, setPointY] = useState([]);
  const [coordinates, setCoordinates] = useState([]);




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
      // resize: { width: Dimensions.get('window').width, height: Dimensions.get('window').height } ,
      // compress: 0.2,
      // format: 'jpg' ,
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

  resizeImage =  async image => {
    const manipResult = await ImageManipulator.manipulateAsync (
      image.localUri || image.uri,
          [{ resize: { width: imageWidth * 0.5, height: imageHeight * 0.5 } }],
          { compress: 0.7, format: ImageManipulator.SaveFormat.JPEG }
        ); 
  }

  const handleCoordinatesSubmit = () => {
    const x = parseFloat(inputX);
    const y = parseFloat(inputY);

    if (!isNaN(x) && !isNaN(y) && imageWidth && imageHeight) {

      if (x >= 0 && x <= imageWidth && y >= 0 && y <= imageHeight) {
        
        // normalização

        const normalizedX = (x / imageWidth) * Dimensions.get('window').width;
        const normalizedY = (y / imageHeight) * Dimensions.get('window').height;

        const newCoordinate = { x, y };

        setCoordinates([...coordinates, newCoordinate]);
        
        setPointX([...pointX, x]); 
        setPointY([...pointY, y]); 

        setInputX(''); 
        setInputY(''); 


        
        
        console.log(imageWidth);
        console.log(Dimensions.get('window').width);
        console.log(Dimensions.get('window').height );



        // setPointX(normalizedX);

        console.log(normalizedX);

        // setPointY(normalizedY);

        console.log(normalizedY);

      } else {
        alert('Por favor, escolha uma imagem antes de inserir coordenadas.');
      }
    } else {
      
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
        }} resizeMode ="contain"
        />
        {pointX.map((x, index) => (
          <View key={index} style={[styles.point, { left: x, top: pointY[index] }]} />
        ))}
      </View>
    ) : (
      <Text style={styles.noImageText}>Nenhuma imagem selecionada</Text>
    )}


      {/* coordenadas */}
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
      {/* lista de coordenadas */}

      <View style = {styles.coordinateList}>
        <Text>Coordenadas Inseridas:</Text>
        {coordinates.map(({ x, y }, index) => (
          <Text key={index}>
            ({x}, {y})
          </Text>
        ))}

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
  coordinateList: {
    marginBottom: 2,
  },  
  input: {
    flex: 1, 
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