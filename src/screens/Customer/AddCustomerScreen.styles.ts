import { StyleSheet } from 'react-native';
import { COLORS } from '../../constants/colors';
import { TYPOGRAPHY } from '../../constants/typography';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContent: {
    padding: 24,
  },
  header: {
    marginBottom: 30,
    flexDirection: "column",
    gap: 10
  },
  title: {
    ...TYPOGRAPHY.montserrat.bold,
    fontSize: 28,
    color: COLORS.black,
  },
  section: {
    backgroundColor: '#f8f9fa',
    borderRadius: 20,
    padding: 24,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 20,
  },
  sectionTitle: {
    ...TYPOGRAPHY.montserrat.bold,
    fontSize: 16,
    color: COLORS.black,
  },
  formGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 15,
  },
  inputGroup: {
    marginBottom: 16,
  },
  labelRow: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  label: {
    ...TYPOGRAPHY.montserrat.semiBold,
    fontSize: 13,
    color: '#495057',
  },
  requiredStar: {
    color: COLORS.posRed,
    marginLeft: 4,
  },
  input: {
    height: 52,
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: '#dee2e6',
    ...TYPOGRAPHY.montserrat.medium,
    fontSize: 15,
    color: COLORS.black,
  },
  inputError: {
    borderColor: COLORS.posRed,
  },
  errorText: {
    ...TYPOGRAPHY.montserrat.medium,
    fontSize: 11,
    color: COLORS.posRed,
    marginTop: 4,
  },
  submitBtn: {
    backgroundColor: COLORS.primary,
    height: 56,
    borderRadius: 16,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
    marginTop: 10,
    elevation: 4,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
});
