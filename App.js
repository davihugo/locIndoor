import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Image, Button, Dimensions } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
// import ImageSize from 'react-native-image-size';
// import { getSize } from 'react-native-image-size-get';




export default function App() {
  const [selectedImage, setSelectedImage] = useState(null);
  const [imageWidth, setImageWidth ] = useState(null);
  const [imageHeight, setImageHeight ] = useState(null);

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
      setSelectedImage(result.assets[0].uri);
      
      Image.getSize(result.assets[0].uri, (width, height) => {
        setImageWidth(width);
        setImageHeight(height);
      });
    }
  };

  return (
    <View style={styles.container}>
      {selectedImage ? (
        <View>
          <Image source={{ uri: selectedImage }} style={styles.image} resizeMode="contain" />
          <Text>Largura da Imagem : {imageWidth} px </Text>
          <Text>Altura da Imagem: {imageHeight} px </Text>

        </View>
      ) : (
        <Text style={styles.noImageText}>Nenhuma imagem selecionada</Text>
      )}
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
    width: Dimensions.get('window').width - 0.2*(Dimensions.get('window').width),
    height: Dimensions.get('window').height - 0.2*(Dimensions.get('window').height),
  },
  noImageText: {
    fontSize: 18,
    marginBottom: 20,
  },
});

