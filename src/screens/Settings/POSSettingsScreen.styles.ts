import { StyleSheet } from 'react-native';
import { COLORS } from '../../constants/colors';
import { TYPOGRAPHY } from '../../constants/typography';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  scrollContent: {
    padding: 20,
    alignItems: 'center',
  },
  headerNav: {
    width: '100%',
    maxWidth: 900,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 20,
  },
  backText: {
    ...TYPOGRAPHY.montserrat.semiBold,
    fontSize: 16,
    color: COLORS.primary,
    marginLeft: 10,
  },
  headerTitle: {
    ...TYPOGRAPHY.montserrat.bold,
    fontSize: 24,
    color: '#212529',
  },
  mainCard: {
    width: '100%',
    maxWidth: 900,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    ...TYPOGRAPHY.montserrat.bold,
    fontSize: 18,
    color: COLORS.primary,
    marginBottom: 16,
  },
  sectionContent: {
    width: '100%',
  },
  tabletRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  inputContainer: {
    marginBottom: 16,
    width: '100%',
  },
  tabletInput: {
    width: '48%',
  },
  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  inputLabel: {
    ...TYPOGRAPHY.montserrat.medium,
    fontSize: 14,
    color: '#495057',
    marginLeft: 8,
  },
  pickerWrapper: {
    borderWidth: 1,
    borderColor: '#CED4DA',
    borderRadius: 8,
    backgroundColor: 'white',
    overflow: 'hidden',
    justifyContent: 'center',
  },
  picker: {
    height: 50,
    width: '100%',
    backgroundColor: 'transparent',
    color: '#000000',
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  checkboxLabel: {
    ...TYPOGRAPHY.montserrat.medium,
    fontSize: 15,
    color: '#212529',
    marginLeft: 12,
  },
  updateButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    height: 54,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  updateButtonText: {
    ...TYPOGRAPHY.montserrat.bold,
    fontSize: 16,
    color: 'white',
  },
  divider: {
    height: 1,
    backgroundColor: '#E9ECEF',
    marginVertical: 30,
  },
});
