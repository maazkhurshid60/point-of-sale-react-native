import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F6FB',
  },
  header: {
    paddingHorizontal: 20,
    alignItems: 'flex-end',
    paddingVertical: 10,
  },
  skipText: {
    fontSize: 14,
    color: '#757575',
  },
  page: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
  },
  imageContainer: {
    width: '100%',
    justifyContent: 'center',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  textContainer: {
    marginTop: 36,
    alignItems: 'center',
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#1C1B1F',
    textAlign: 'center',
    marginBottom: 18,
  },
  description: {
    fontSize: 16,
    color: '#757575',
    textAlign: 'center',
    lineHeight: 24,
    paddingHorizontal: 10,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 40,
    paddingVertical: 32,
  },
  indicatorContainer: {
    flexDirection: 'row',
  },
  dot: {
    height: 10,
    width: 10,
    borderRadius: 5,
    backgroundColor: '#D1D1D1',
    marginHorizontal: 4,
  },
  activeDot: {
    width: 30,
    backgroundColor: '#7E57C2',
  },
  button: {
    backgroundColor: '#7E57C2',
    paddingVertical: 14,
    paddingHorizontal: 36,
    borderRadius: 14,
    zIndex: 10,
    elevation: 3,
  },
  buttonText: {
    color: 'white',
    fontSize: 15,
    fontWeight: '600',
  },
});
