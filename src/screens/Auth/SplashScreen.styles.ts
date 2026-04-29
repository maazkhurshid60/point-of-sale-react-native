import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F6FB',
  },
  topCircle: {
    position: 'absolute',
    top: -60,
    right: -60,
    width: 240,
    height: 240,
    borderRadius: 120,
    backgroundColor: 'rgba(126, 87, 194, 0.05)',
  },
  bottomCircle: {
    position: 'absolute',
    bottom: -80,
    left: -40,
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: 'rgba(126, 87, 194, 0.03)',
  },
  content: {
    flex: 1,
  },
  mainContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  spacerTop: {
    flex: 3,
  },
  logo: {
    width: 160,
    height: 160,
  },
  textContainer: {
    marginTop: 24,
    alignItems: 'center',
  },
  appName: {
    fontSize: 22,
    fontWeight: '800',
    color: '#2D2D2D',
    letterSpacing: 1.5,
  },
  tagline: {
    fontSize: 14,
    fontWeight: '400',
    color: '#9E9E9E',
    letterSpacing: 0.5,
    marginTop: 8,
  },
  loaderContainer: {
    flex: 2,
    justifyContent: 'center',
  },
  spacerBottom: {
    flex: 1,
  },
  version: {
    fontSize: 12,
    color: '#BDBDBD',
    marginBottom: 20,
  },
});
