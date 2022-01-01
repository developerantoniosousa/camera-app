import React, {useRef, useState} from 'react';
import {
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  useColorScheme,
  View,
} from 'react-native';

import {RNCamera} from 'react-native-camera';

import {Colors} from 'react-native/Libraries/NewAppScreen';

const App = () => {
  const isDarkMode = useColorScheme() === 'dark';
  const [currentCamera, setCurrentCamera] = useState(
    RNCamera.Constants.Type.front,
  );
  const [flashMode, setFlashMode] = useState(RNCamera.Constants.FlashMode.off);

  const cameraRef = useRef<RNCamera>();

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  const handleFlipCamera = () => {
    let nextCamera = RNCamera.Constants.Type.back;
    if (currentCamera === RNCamera.Constants.Type.back) {
      nextCamera = RNCamera.Constants.Type.front;
    }
    setCurrentCamera(nextCamera);
  };

  const handleFlashMode = () => {
    let nextFlashMode = RNCamera.Constants.FlashMode.on;
    if (currentCamera === RNCamera.Constants.FlashMode.on) {
      nextFlashMode = RNCamera.Constants.FlashMode.off;
    }
    setFlashMode(nextFlashMode);
  };

  const handleSnap = () => {
    if (cameraRef && cameraRef.current && cameraRef.current.takePictureAsync) {
      const options = {quality: 1.0};
      cameraRef.current.takePictureAsync(options).then(console.log);
    }
  };

  return (
    <SafeAreaView style={backgroundStyle}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <RNCamera
        ref={cameraRef}
        style={styles.cameraPreview}
        type={currentCamera}
        flashMode={flashMode}
        androidCameraPermissionOptions={{
          title: 'Permission to use camera',
          message: 'We need your permission to use your camera',
          buttonPositive: 'Ok',
          buttonNegative: 'Cancel',
        }}
        androidRecordAudioPermissionOptions={{
          title: 'Permission to use audio recording',
          message: 'We need your permission to use your audio',
          buttonPositive: 'Ok',
          buttonNegative: 'Cancel',
        }}
        useNativeZoom
        playSoundOnCapture
      />
      <View style={styles.btnContainer}>
        <TouchableOpacity style={styles.btn} onPress={handleFlipCamera}>
          <Text>Flip</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.btn} onPress={handleFlashMode}>
          <Text>Flash</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.btn} onPress={handleSnap}>
          <Text>Snap</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  cameraPreview: {
    width: '100%',
    height: '100%',
  },
  btnContainer: {
    position: 'absolute',
    bottom: 30,
    left: 20,
    right: 20,
    flexDirection: 'row',
  },
  btn: {
    backgroundColor: 'rgba(0, 0, 0, .8)',
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginHorizontal: 2.5,
  },
});

export default App;
