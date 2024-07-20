import Toast from 'react-native-root-toast';

export default function showToast(msg = '') {
  console.trace();
  Toast.show(msg, {
    duration: Toast.durations.LONG,
    position: Toast.positions.BOTTOM,
    shadow: true,
    animation: true,
    hideOnPress: true,
    delay: 0,
  });
}
