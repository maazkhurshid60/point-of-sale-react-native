import { StyleSheet } from 'react-native';
import { COLORS } from '../../constants/colors';
import { TYPOGRAPHY } from '../../constants/typography';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  loadingText: {
    ...TYPOGRAPHY.montserrat.medium,
    marginTop: 12,
    color: '#64748B',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
    elevation: 2,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  backBtn: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#F1F5F9',
  },
  title: {
    ...TYPOGRAPHY.montserrat.bold,
    fontSize: 18,
    color: '#1E293B',
  },
  subtitle: {
    ...TYPOGRAPHY.montserrat.medium,
    fontSize: 12,
    color: '#94A3B8',
  },
  refreshBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F1F5F9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  filterBar: {
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
    paddingVertical: 10,
  },
  filterScroll: {
    paddingHorizontal: 16,
    alignItems: 'center',
    gap: 8,
  },
  filterLabel: {
    ...TYPOGRAPHY.montserrat.semiBold,
    fontSize: 12,
    color: '#64748B',
    marginRight: 4,
  },
  filterTab: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: '#F1F5F9',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  activeTab: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  filterTabText: {
    ...TYPOGRAPHY.montserrat.medium,
    fontSize: 12,
    color: '#475569',
  },
  activeTabText: {
    color: 'white',
    ...TYPOGRAPHY.montserrat.bold,
  },
  filterDivider: {
    width: 1,
    height: 20,
    backgroundColor: '#E2E8F0',
    marginHorizontal: 8,
  },
  content: {
    flex: 1,
  },
  tabletGrid: {
    flex: 1,
    flexDirection: 'row',
    padding: 10,
    gap: 10,
  },
  column: {
    flex: 1,
    backgroundColor: '#F1F5F9',
    borderRadius: 12,
    overflow: 'hidden',
  },
  columnHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
    borderLeftWidth: 4,
  },
  columnTitle: {
    ...TYPOGRAPHY.montserrat.bold,
    fontSize: 14,
    color: '#1E293B',
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  badgeText: {
    color: 'white',
    fontSize: 11,
    fontWeight: 'bold',
  },
  listContent: {
    padding: 10,
  },
  mobileListContent: {
    padding: 16,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 100,
  },
  emptyText: {
    ...TYPOGRAPHY.montserrat.medium,
    color: '#94A3B8',
    marginTop: 16,
    fontSize: 14,
  },
});
