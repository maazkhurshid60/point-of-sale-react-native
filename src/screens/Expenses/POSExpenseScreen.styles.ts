import { StyleSheet } from 'react-native';
import { COLORS } from '../../constants/colors';
import { TYPOGRAPHY } from '../../constants/typography';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
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
    flex: 1,
    ...TYPOGRAPHY.montserrat.bold,
    fontSize: 18,
    color: '#1E293B',
  },
  scrollContent: {
    padding: 20,
  },
  formCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 4,
  },
  row: {
    flexDirection: 'row',
    gap: 20,
    marginBottom: 20,
  },
  column: {
    flexDirection: 'column',
    gap: 15,
  },
  fieldContainer: {
    flex: 1,
  },
  tabletField: {
    maxWidth: '48%',
  },
  label: {
    ...TYPOGRAPHY.montserrat.bold,
    fontSize: 14,
    color: '#475569',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 10,
    padding: 12,
    ...TYPOGRAPHY.montserrat.regular,
    fontSize: 15,
    color: 'black',
    backgroundColor: '#F8FAFC',
    justifyContent: 'center',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  pickerContainer: {
    position: 'relative',
  },
  dropdown: {
    maxHeight: 150,
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: COLORS.primary,
    borderRadius: 8,
    marginTop: 4,
  },
  dropdownItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  dropdownText: {
    ...TYPOGRAPHY.montserrat.medium,
    fontSize: 14,
    color: '#334155',
  },
  methodToggle: {
    flexDirection: 'row',
    backgroundColor: '#F1F5F9',
    borderRadius: 10,
    padding: 4,
  },
  methodBtn: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 8,
  },
  activeMethod: {
    backgroundColor: COLORS.primary,
  },
  methodBtnText: {
    ...TYPOGRAPHY.montserrat.bold,
    fontSize: 12,
    color: '#64748B',
  },
  activeMethodText: {
    color: 'white',
  },
  payableSection: {
    marginTop: 10,
    padding: 20,
    backgroundColor: '#F1F5F9',
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.primary,
  },
  sectionTitle: {
    ...TYPOGRAPHY.montserrat.bold,
    fontSize: 16,
    color: '#1E293B',
    marginBottom: 15,
  },
  filePicker: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: COLORS.primary,
    borderStyle: 'dashed',
    borderRadius: 10,
    padding: 12,
    gap: 10,
  },
  filePickerText: {
    ...TYPOGRAPHY.montserrat.medium,
    fontSize: 14,
    color: COLORS.primary,
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 15,
    marginTop: 30,
  },
  cancelBtn: {
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  cancelBtnText: {
    ...TYPOGRAPHY.montserrat.semiBold,
    color: '#64748B',
  },
  saveBtn: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 32,
    paddingVertical: 14,
    borderRadius: 10,
    minWidth: 150,
    alignItems: 'center',
  },
});
