import { StyleSheet } from 'react-native';
import { COLORS } from '../../constants/colors';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.primary,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingBottom: 40,
  },
  card: {
    backgroundColor: COLORS.white,
    borderRadius: 30,
    paddingHorizontal: 25,
    paddingVertical: 35,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 8,
    alignSelf: 'center',
    width: '100%',
    overflow: 'hidden',
  },
  cardTabletLandscape: {
    paddingHorizontal: 0,
    paddingVertical: 0,
  },
  rowLayout: {
    flexDirection: 'row',
    minHeight: 450,
  },
  columnLayout: {
    flexDirection: 'column',
  },
  brandingSection: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 20,
  },
  brandingSectionTablet: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    padding: 40,
    borderRightWidth: 1,
    borderRightColor: '#F1F5F9',
    paddingTop: 40,
  },
  formSection: {
    flex: 1,
    paddingHorizontal: 10,
    paddingTop: 20,
  },
  formSectionTablet: {
    flex: 1.2,
    padding: 50,
    justifyContent: 'center',
  },
  welcomeContainer: {
    alignItems: 'center',
    marginTop: 10,
  },
  welcomeTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: COLORS.primary,
    marginBottom: 8,
    textAlign: 'center',
  },
  welcomeSubtitle: {
    fontSize: 16,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 22,
    maxWidth: 250,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 10,
  },
  logo: {
    resizeMode: 'contain',
  },
  title: {
    fontSize: 34,
    fontWeight: '600',
    color: COLORS.primary,
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: COLORS.greyText,
    textAlign: 'center',
    marginBottom: 30,
    lineHeight: 22,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: COLORS.greyText,
    marginBottom: 20,
  },
  inputIcon: {
    marginRight: 10,
    marginBottom: 12,
  },
  input: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 18,
    color: COLORS.posDark,
  },
  inputFocused: {
    borderBottomColor: COLORS.primary,
  },
  backButton: {
    position: 'absolute',
    top: 20,
    left: 20,
    flexDirection: 'row',
    alignItems: 'center',
    zIndex: 10,
  },
  backTextMobile: {
    color: COLORS.white,
    fontSize: 16,
    marginLeft: 8,
    fontWeight: '600'
  },
  button: {
    height: 56,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 6,
    overflow: 'hidden',
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
    letterSpacing: 1,
  },
});
