import React, {useRef, useState} from 'react';
import {
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  useColorScheme,
  View,
  PermissionsAndroid,
  Platform,
  Alert,
} from 'react-native';

import {RNCamera} from 'react-native-camera';
import CameraRoll from '@react-native-community/cameraroll';
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

  const hasAndroidPermission = async () => {
    const permission = PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE;

    const hasPermission = await PermissionsAndroid.check(permission);
    if (hasPermission) {
      return true;
    }

    const status = await PermissionsAndroid.request(permission);
    return status === 'granted';
  };

  const savePicture = async (tag: string) => {
    if (Platform.OS === 'android' && !(await hasAndroidPermission())) {
      return;
    }
    try {
      CameraRoll.save(tag, {type: 'photo'});
    } catch {
      Alert.alert('An error ocurred', 'Failed saving photo to library.');
    }
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

  const handleSnap = async () => {
    if (cameraRef && cameraRef.current && cameraRef.current.takePictureAsync) {
      const options = {quality: 1.0};
      try {
        const pictureResponse = await cameraRef.current.takePictureAsync(
          options,
        );
        if (pictureResponse.uri) {
          savePicture(pictureResponse.uri);
        }
      } catch {
        Alert.alert('An error ocurred', 'Failed photo capture');
      }
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
    justifyContent: 'center',
  },
  btn: {
    backgroundColor: 'rgba(0, 0, 0, .8)',
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginHorizontal: 2.5,
  },
});

export default App;
