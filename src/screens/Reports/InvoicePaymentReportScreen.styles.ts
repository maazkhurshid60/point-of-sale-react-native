import { StyleSheet } from 'react-native';
import { COLORS } from '../../constants/colors';
import { TYPOGRAPHY } from '../../constants/typography';

export const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  header: { 
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 20,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  backBtn: { 
    width: 44, 
    height: 44, 
    borderRadius: 14, 
    backgroundColor: '#F1F5F9', 
    justifyContent: 'center', 
    alignItems: 'center' 
  },
  headerTextContainer: { flex: 1, alignItems: 'center' },
  headerTitle: { ...TYPOGRAPHY.montserrat.bold, fontSize: 18, color: '#1A202C' },
  
  scrollContent: { paddingHorizontal: 20, paddingBottom: 60, paddingTop: 20 },
  filterWrapper: { marginBottom: 20 },
  
  loaderContainer: { marginTop: 60, alignItems: 'center' },
  loaderText: { ...TYPOGRAPHY.montserrat.medium, fontSize: 13, color: '#64748B', marginTop: 10 },
  
  reportContent: { gap: 20 },
  tabContainer: { 
    flexDirection: 'row', 
    backgroundColor: '#E2E8F0', 
    padding: 6, 
    borderRadius: 16, 
    gap: 8 
  },
  tab: { 
    flex: 1, 
    flexDirection: 'row',
    paddingVertical: 12, 
    alignItems: 'center', 
    justifyContent: 'center', 
    borderRadius: 12, 
  },
  activeTab: { 
    backgroundColor: COLORS.primary, 
    elevation: 2,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
  },
  tabText: { ...TYPOGRAPHY.montserrat.bold, fontSize: 13, color: '#64748B' },
  activeTabText: { color: 'white' },
  
  chartSection: { gap: 16 },
  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  chartCard: { 
    backgroundColor: 'white', 
    borderRadius: 24, 
    padding: 20, 
    elevation: 3, 
    shadowColor: '#000', 
    shadowOffset: { width: 0, height: 4 }, 
    shadowOpacity: 0.05,
    borderWidth: 1,
    borderColor: '#F1F5F9'
  },
  
  summarySection: { gap: 16 },
  tableCard: { 
    backgroundColor: 'white', 
    borderRadius: 24, 
    overflow: 'hidden', 
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    borderWidth: 1,
    borderColor: '#F1F5F9'
  },
  tableCardHeader: { padding: 20, borderBottomWidth: 1, borderBottomColor: '#F1F5F9' },
  tableCardTitle: { ...TYPOGRAPHY.montserrat.bold, fontSize: 16, color: '#1E293B' },
  tableHeader: { flexDirection: 'row', paddingHorizontal: 20, paddingVertical: 15, backgroundColor: '#F8FAFC' },
  headerCell: { ...TYPOGRAPHY.montserrat.bold, fontSize: 11, color: '#64748B', textTransform: 'uppercase', letterSpacing: 1 },
  tableRow: { flexDirection: 'row', paddingHorizontal: 20, paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: '#F8FAFC', alignItems: 'center' },
  cellMainText: { ...TYPOGRAPHY.montserrat.bold, fontSize: 14, color: '#1E293B' },
  cellSubText: { ...TYPOGRAPHY.montserrat.medium, fontSize: 11, color: '#94A3B8' },
  cellText: { ...TYPOGRAPHY.montserrat.bold, fontSize: 13, color: '#1E293B' },
  cellAmountText: { ...TYPOGRAPHY.montserrat.bold, fontSize: 14, color: COLORS.primary },
});
