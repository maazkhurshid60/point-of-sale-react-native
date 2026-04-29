import { StyleSheet } from 'react-native';
import { COLORS } from '../../constants/colors';
import { TYPOGRAPHY } from '../../constants/typography';

export const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  header: { 
    backgroundColor: 'white',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 25,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  headerTop: { flexDirection: 'row', alignItems: 'center', gap: 15, marginBottom: 25 },
  backBtn: { width: 44, height: 44, borderRadius: 14, backgroundColor: '#F1F5F9', justifyContent: 'center', alignItems: 'center' },
  headerTextContainer: { flex: 1, alignItems: 'center' },
  headerTitle: { ...TYPOGRAPHY.montserrat.bold, fontSize: 18, color: '#1A202C' },
  refreshBtn: { width: 44, height: 44, borderRadius: 14, backgroundColor: '#F1F5F9', justifyContent: 'center', alignItems: 'center' },
  
  statsGrid: { flexDirection: 'row', gap: 15 },
  statsGridMobile: { flexWrap: 'wrap' },
  headerStatCard: { flex: 1, backgroundColor: 'white', paddingHorizontal: 16, paddingVertical: 12, borderRadius: 18, borderWidth: 1, borderColor: '#F1F5F9', elevation: 2, shadowColor: '#000', shadowOpacity: 0.05 },
  headerStatLabel: { ...TYPOGRAPHY.montserrat.medium, fontSize: 11, color: '#64748B', marginBottom: 4 },
  headerStatValue: { ...TYPOGRAPHY.montserrat.bold, fontSize: 15, color: '#1E293B' },

  scrollContent: { paddingHorizontal: 20, paddingTop: 20, paddingBottom: 60 },
  tabContainer: { marginBottom: 20 },
  tabScroll: { gap: 10 },
  tabItem: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 12, gap: 8, backgroundColor: 'white', borderRadius: 16, borderWidth: 1, borderColor: '#E2E8F0' },
  activeTabItem: { backgroundColor: COLORS.primary, borderColor: COLORS.primary, elevation: 4, shadowColor: COLORS.primary, shadowOpacity: 0.2 },
  tabLabel: { ...TYPOGRAPHY.montserrat.bold, fontSize: 13, color: '#64748B' },
  activeTabLabel: { color: 'white' },

  contentWrapper: { flex: 1 },
  tableCard: { backgroundColor: 'white', borderRadius: 24, overflow: 'hidden', elevation: 3, shadowColor: '#000', shadowOpacity: 0.05, borderWidth: 1, borderColor: '#F1F5F9' },
  tableCardHeader: { padding: 20, borderBottomWidth: 1, borderBottomColor: '#F1F5F9' },
  tableCardTitle: { ...TYPOGRAPHY.montserrat.bold, fontSize: 16, color: '#1E293B' },
  tableHeader: { flexDirection: 'row', paddingHorizontal: 20, paddingVertical: 15, backgroundColor: '#F8FAFC' },
  headerCell: { ...TYPOGRAPHY.montserrat.bold, fontSize: 11, color: '#64748B', textTransform: 'uppercase', letterSpacing: 1 },
  tableRow: { flexDirection: 'row', paddingHorizontal: 20, paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: '#F8FAFC', alignItems: 'center' },
  reportRow: { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 20, paddingVertical: 18, borderBottomWidth: 1, borderBottomColor: '#F8FAFC' },
  reportKey: { ...TYPOGRAPHY.montserrat.bold, fontSize: 14, color: '#64748B', textTransform: 'capitalize' },
  reportValue: { ...TYPOGRAPHY.montserrat.bold, fontSize: 14, color: '#1E293B' },
  cellMainText: { ...TYPOGRAPHY.montserrat.bold, fontSize: 14, color: '#1E293B' },
  cellSubText: { ...TYPOGRAPHY.montserrat.medium, fontSize: 12, color: '#94A3B8' },
  cellAmountText: { ...TYPOGRAPHY.montserrat.bold, fontSize: 14, color: COLORS.primary },

  loaderContainer: { marginTop: 60, alignItems: 'center' },
  loaderText: { ...TYPOGRAPHY.montserrat.medium, fontSize: 13, color: COLORS.textSecondary, marginTop: 10 },
  emptyContainer: { marginTop: 60, alignItems: 'center', padding: 40 },
  emptyText: { ...TYPOGRAPHY.montserrat.medium, fontSize: 14, color: '#94A3B8', textAlign: 'center', marginTop: 15 },
  emptyInternalText: { padding: 30, textAlign: 'center', color: '#94A3B8', ...TYPOGRAPHY.montserrat.medium },
});
