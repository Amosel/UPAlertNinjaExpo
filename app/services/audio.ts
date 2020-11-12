import {Platform} from 'react-native';
import {Audio, AVPlaybackStatus} from 'expo-av';

export async function checkForAudio() {
  await Audio.setAudioModeAsync({
    playsInSilentModeIOS: true,
    staysActiveInBackground: true,
    interruptionModeIOS: Audio.INTERRUPTION_MODE_IOS_DUCK_OTHERS,
    interruptionModeAndroid: Audio.INTERRUPTION_MODE_ANDROID_DO_NOT_MIX,
  });
}

let alertSound: Audio.Sound | null = null;
let status: AVPlaybackStatus | null = null;

export async function playSound() {
  if (alertSound == null) {
    alertSound = new Audio.Sound();
  }

  try {
    if (status == null || status.isLoaded == false) {
      status = await alertSound.loadAsync(
        Platform.select({
          ios: require('../assets/alert.caf'),
          android: require('../assets/alert.mp3'),
        }),
      );
    }

    if (
      status != null &&
      status.isLoaded == true &&
      status.isPlaying == false
    ) {
      status = await alertSound.playAsync();
      // Your sound is playing!

      console.log('successfully finished playing');
      // Don't forget to unload the sound from memory
      // when you are done using the Sound object
      status = await alertSound.unloadAsync();
    } else {
      console.log('already playing, doing nothing');
    }
  } catch (error) {
    console.log('failed to load the sound', error);
    status = null;
  }
}

export async function pauseSound() {
  if (
    alertSound != null &&
    status &&
    status.isLoaded == true &&
    status.isPlaying == true
  ) {
    status = await alertSound.pauseAsync();
  }
}
