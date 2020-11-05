import {Platform} from 'react-native';
import Sound from 'react-native-sound';

export async function checkForAudio() {
  Sound.setCategory('Alarm', false);
}

let alertSound: Sound;

export async function playSound() {
  if (alertSound) {
    return;
  }
  alertSound = new Sound(
    Platform.select({ios: 'alert.caf', android: 'alert.mp3'}),
    Sound.MAIN_BUNDLE,
    error => {
      if (error) {
        console.log('failed to load the sound', error);
        return;
      }
      // loaded successfully
      console.log(
        'duration in seconds: ' +
          alertSound.getDuration() +
          'number of channels: ' +
          alertSound.getNumberOfChannels(),
      );

      // Play the sound with an onEnd callback
      alertSound.play(success => {
        if (success) {
          console.log('successfully finished playing');
        } else {
          console.log('playback failed due to audio decoding errors');
        }
      });
    },
  );
  alertSound.play(() => {
    alertSound.release();
  });
}

export function pauseSound() {
  if (alertSound && alertSound.isPlaying()) {
    const _sound = alertSound;
    alertSound = null;
    _sound.pause(() => {
      _sound.release();
    });
  }
}
