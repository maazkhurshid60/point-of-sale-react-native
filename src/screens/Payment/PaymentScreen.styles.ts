import { StyleSheet } from 'react-native';
import { COLORS } from '../../constants/colors';
import { TYPOGRAPHY } from '../../constants/typography';

export const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f1f5f9' },

  // Header
  header: {
    paddingHorizontal: 24,
    paddingVertical: 18,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  headerTopArea: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  headerRight: { alignItems: 'flex-end' },
  backBtn: { flexDirection: 'row', alignItems: 'center' },
  backIconCircle: {
    width: 32, height: 32, borderRadius: 16,
    backgroundColor: '#f1f5f9',
    alignItems: 'center', justifyContent: 'center', marginRight: 10,
  },
  backText: {
    ...TYPOGRAPHY.montserrat.bold,
    fontSize: 13, color: '#64748b',
    textTransform: 'uppercase', letterSpacing: 0.8,
  },
  title: { ...TYPOGRAPHY.montserrat.bold, fontSize: 22, color: '#0f172a', letterSpacing: -0.5 },
  customerPill: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: '#ede9fe',
    paddingHorizontal: 12, paddingVertical: 4,
    borderRadius: 20, marginTop: 6, gap: 7,
  },
  customerName: { ...TYPOGRAPHY.montserrat.semiBold, fontSize: 13, color: COLORS.primary },

  // Layout
  scrollContent: { padding: 24, paddingBottom: 60 },
  tabletLayout: { flexDirection: 'row', gap: 28 },
  mobileLayout: { flexDirection: 'column', gap: 28 },
  leftPane: { flex: 1.65 },
  rightPane: { flex: 1 },
  fullPane: { width: '100%' },

  // Section header
  sectionHeaderRow: {
    flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'flex-end', marginBottom: 18,
  },
  sectionTitle: { ...TYPOGRAPHY.montserrat.bold, fontSize: 18, color: '#1e293b' },
  sectionDesc: { ...TYPOGRAPHY.montserrat.medium, fontSize: 12, color: '#64748b', marginTop: 2 },

  // Add Tender Button
  addTenderBtn: {
    flexDirection: 'row', alignItems: 'center',
    gap: 8, paddingHorizontal: 16, paddingVertical: 10,
    backgroundColor: '#eef2ff',
    borderWidth: 1.5, borderColor: '#c7d2fe',
    borderRadius: 12,
  },
  addTenderText: { ...TYPOGRAPHY.montserrat.bold, fontSize: 14, color: COLORS.primary },

  // Table
  tableBlock: {
    borderWidth: 1.5, borderColor: '#e2e8f0',
    borderRadius: 16, backgroundColor: 'white',
    overflow: 'hidden',
    shadowColor: '#94a3b8',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08, shadowRadius: 12, elevation: 4,
  },
  tableHeaderRow: {
    flexDirection: 'row',
    backgroundColor: '#f8fafc',
    paddingVertical: 12, paddingHorizontal: 18,
    alignItems: 'center', gap: 10,
    borderBottomWidth: 1, borderBottomColor: '#e2e8f0',
  },
  columnHeader: {
    ...TYPOGRAPHY.montserrat.bold, fontSize: 11,
    color: '#64748b', textTransform: 'uppercase', letterSpacing: 0.6,
  },
  tableRow: {
    flexDirection: 'row',
    paddingVertical: 14, paddingHorizontal: 18,
    borderBottomWidth: 1, borderBottomColor: '#f1f5f9',
    alignItems: 'center', gap: 10,
  },

  // Method Badge
  methodBadge: {
    flexDirection: 'row', alignItems: 'center',
    paddingVertical: 10, paddingHorizontal: 10,
    borderRadius: 8, gap: 6,
  },
  badgeCash: { backgroundColor: '#10b981' },
  badgeBank: { backgroundColor: '#3b82f6' },
  badgeCard: { backgroundColor: '#8b5cf6' },
  badgeCoupon: { backgroundColor: '#f59e0b' },
  badgeOther: { backgroundColor: '#64748b' },
  methodBadgeText: { ...TYPOGRAPHY.montserrat.bold, color: 'white', fontSize: 12 },

  // Table Inputs
  tableCellInput: {
    height: 38, borderWidth: 1.5, borderColor: '#e2e8f0',
    borderRadius: 8, paddingHorizontal: 10,
    backgroundColor: '#f8fafc',
    ...TYPOGRAPHY.montserrat.semiBold, fontSize: 13, color: '#334155',
    justifyContent: 'center',
  },
  tableCellText: { ...TYPOGRAPHY.montserrat.semiBold, fontSize: 12, color: '#334155' },
  tableDropdown: {
    height: 38, borderWidth: 1.5, borderColor: '#e2e8f0',
    borderRadius: 8, backgroundColor: '#f8fafc',
  },
  amountInput: {
    backgroundColor: '#fffbeb', borderColor: '#fde68a',
    ...TYPOGRAPHY.montserrat.bold, fontSize: 14, color: '#d97706',
  },
  deleteIconBg: {
    width: 32, height: 32, borderRadius: 9,
    backgroundColor: '#fef2f2', alignItems: 'center', justifyContent: 'center',
  },
  validateBtn: {
    width: 40, height: 40, borderRadius: 8,
    backgroundColor: '#10b981',
    alignItems: 'center', justifyContent: 'center',
  },
  validateBtnText: {
    ...TYPOGRAPHY.montserrat.bold, fontSize: 11, color: 'white',
  },
  couponStatusRow: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    paddingHorizontal: 20, paddingBottom: 10, paddingTop: 2,
  },
  couponStatusText: {
    ...TYPOGRAPHY.montserrat.semiBold, fontSize: 12,
  },

  // Empty state
  emptyState: { paddingVertical: 55, alignItems: 'center', justifyContent: 'center', gap: 8 },
  emptyStateTitle: { ...TYPOGRAPHY.montserrat.bold, fontSize: 15, color: '#94a3b8' },
  emptyStateSubtitle: { ...TYPOGRAPHY.montserrat.medium, fontSize: 12, color: '#cbd5e1' },

  // Custom Dropdown
  dropdownTrigger: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 10, height: 38,
    borderWidth: 1.5, borderColor: '#e2e8f0',
    borderRadius: 8, backgroundColor: '#f8fafc', gap: 6,
  },
  dropdownTriggerText: { ...TYPOGRAPHY.montserrat.semiBold, fontSize: 12, color: '#334155', flex: 1 },
  dropdownPlaceholder: { color: '#94a3b8' },
  modalBackdrop: {
    flex: 1, backgroundColor: 'rgba(15,23,42,0.4)',
    justifyContent: 'center', alignItems: 'center',
  },
  dropdownModal: {
    backgroundColor: 'white', borderRadius: 16,
    minWidth: 280, maxWidth: 400,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.2, shadowRadius: 24, elevation: 16,
    overflow: 'hidden',
    maxHeight: 400,
  },
  dropdownModalHeader: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: 20, paddingVertical: 16,
    borderBottomWidth: 1, borderBottomColor: '#f1f5f9',
  },
  dropdownModalTitle: { ...TYPOGRAPHY.montserrat.bold, fontSize: 15, color: '#1e293b' },
  dropdownOption: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    paddingHorizontal: 20, paddingVertical: 14,
    borderBottomWidth: 1, borderBottomColor: '#f8fafc',
  },
  dropdownOptionSelected: { backgroundColor: '#f5f3ff' },
  dropdownOptionText: { ...TYPOGRAPHY.montserrat.semiBold, fontSize: 14, color: '#334155', flex: 1 },
  dropdownOptionTextSelected: { color: COLORS.primary },
  tenderIconBg: {
    width: 32, height: 32, borderRadius: 9,
    alignItems: 'center', justifyContent: 'center',
  },

  // Totals Card
  totalsContainer: {
    borderRadius: 20, overflow: 'hidden',
    marginBottom: 22, padding: 24,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3, shadowRadius: 20, elevation: 8,
    position: 'relative',
  },
  totalsHeaderText: {
    ...TYPOGRAPHY.montserrat.bold, fontSize: 11,
    color: '#c4b5fd', letterSpacing: 2.5, marginBottom: 22,
  },
  totalsBody: { gap: 14 },
  totalRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  totalRowDivider: {
    paddingTop: 14, marginTop: 4,
    borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.12)',
  },
  totalLabel: { ...TYPOGRAPHY.montserrat.medium, fontSize: 14, color: '#e0e7ff' },
  totalValue: { ...TYPOGRAPHY.montserrat.bold, fontSize: 17, color: 'white' },
  cardGlow: {
    position: 'absolute', top: -40, right: -40,
    width: 130, height: 130, borderRadius: 65,
    backgroundColor: 'rgba(255,255,255,0.06)',
  },

  // Meta Card
  metaContainer: {
    backgroundColor: 'white', borderRadius: 20,
    borderWidth: 1.5, borderColor: '#e2e8f0',
    padding: 22,
    shadowColor: '#94a3b8',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.05, shadowRadius: 8, elevation: 3,
  },
  inputGroup: { marginBottom: 16 },
  inputLabel: {
    ...TYPOGRAPHY.montserrat.semiBold, fontSize: 11,
    color: '#64748b', marginBottom: 8,
    textTransform: 'uppercase', letterSpacing: 0.6,
  },
  textInput: {
    borderWidth: 1.5, borderColor: '#e2e8f0', borderRadius: 12,
    padding: 13,
    ...TYPOGRAPHY.montserrat.semiBold, fontSize: 14, color: '#334155',
    backgroundColor: '#f8fafc',
  },
  textInputRow: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    borderWidth: 1.5, borderColor: '#e2e8f0', borderRadius: 12,
    padding: 13, backgroundColor: '#f8fafc',
  },
  iconBox: {
    width: 28, height: 28, borderRadius: 8,
    backgroundColor: '#ede9fe', alignItems: 'center', justifyContent: 'center',
  },

  // Action Buttons
  actionPanel: { flexDirection: 'row', marginTop: 22, gap: 14 },
  finalizeBtn: {
    flex: 1, flexDirection: 'row', height: 54,
    borderRadius: 14, alignItems: 'center', justifyContent: 'center',
    gap: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15, shadowRadius: 8, elevation: 4,
  },
  finalizeBtnText: {
    ...TYPOGRAPHY.montserrat.bold, color: 'white', fontSize: 15, letterSpacing: 0.5,
  },
});
