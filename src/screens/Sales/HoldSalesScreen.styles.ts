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
  backBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 24,
  },
  backText: {
    ...TYPOGRAPHY.montserrat.semiBold,
    color: COLORS.primary,
    marginLeft: 8,
    fontSize: 14,
  },
  headerTitle: {
    ...TYPOGRAPHY.montserrat.bold,
    fontSize: 20,
    color: '#1E293B',
  },
  headerSubtitle: {
    ...TYPOGRAPHY.montserrat.medium,
    fontSize: 12,
    color: '#64748B',
  },
  listContent: {
    padding: 16,
  },
  // Tablet Table Styles
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: 'white',
    padding: 16,
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 8,
    borderBottomWidth: 2,
    borderBottomColor: '#F1F5F9',
  },
  headerCell: {
    ...TYPOGRAPHY.montserrat.bold,
    fontSize: 14,
    color: '#475569',
  },
  tableRow: {
    flexDirection: 'row',
    backgroundColor: 'white',
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 8,
    borderRadius: 8,
    alignItems: 'center',
  },
  cell: {
    ...TYPOGRAPHY.montserrat.medium,
    fontSize: 14,
    color: '#334155',
  },
  actionsCell: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
  },
  // Mobile Card Styles
  saleCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  cardTitle: {
    ...TYPOGRAPHY.montserrat.bold,
    fontSize: 16,
    color: '#1E293B',
  },
  cardDate: {
    ...TYPOGRAPHY.montserrat.medium,
    fontSize: 12,
    color: '#64748B',
  },
  cardBody: {
    marginBottom: 16,
  },
  cardRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  cardLabel: {
    ...TYPOGRAPHY.montserrat.medium,
    fontSize: 14,
    color: '#64748B',
  },
  cardValue: {
    ...TYPOGRAPHY.montserrat.semiBold,
    fontSize: 14,
    color: '#334155',
  },
  cardActions: {
    flexDirection: 'row',
    gap: 12,
  },
  actionBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 8,
    gap: 8,
  },
  recallBtn: {
    backgroundColor: COLORS.primary,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
    gap: 6,
  },
  deleteBtn: {
    backgroundColor: COLORS.posRed,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
    justifyContent: 'center',
  },
  btnText: {
    ...TYPOGRAPHY.montserrat.bold,
    color: 'white',
    fontSize: 13,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    ...TYPOGRAPHY.montserrat.medium,
    color: '#94A3B8',
    marginTop: 16,
    fontSize: 16,
  },
});
