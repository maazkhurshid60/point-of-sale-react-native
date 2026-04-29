import { StyleSheet } from 'react-native';
import { TYPOGRAPHY } from '../../constants/typography';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
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
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: '#F1F5F9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    ...TYPOGRAPHY.montserrat.bold,
    fontSize: 18,
    color: '#1A202C',
  },
  scrollContent: {
    flexGrow: 1,
  },
  mainContent: {
    padding: 20,
  },
  sectionLabelContainer: {
    marginBottom: 20,
  },
  sectionLabel: {
    ...TYPOGRAPHY.montserrat.bold,
    fontSize: 12,
    color: '#64748B',
    letterSpacing: 1.5,
  },
  grid: {
    gap: 15,
  },
  card: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  imageContainer: {
    width: 60,
    height: 60,
    borderRadius: 15,
    backgroundColor: '#F8FAFC',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  image: {
    width: 35,
    height: 35,
  },
  contentContainer: {
    flex: 1,
  },
  title: {
    ...TYPOGRAPHY.montserrat.bold,
    fontSize: 16,
    color: '#1E293B',
    marginBottom: 4,
  },
  description: {
    ...TYPOGRAPHY.montserrat.medium,
    fontSize: 12,
    color: '#64748B',
    lineHeight: 18,
  },
  arrowContainer: {
    marginLeft: 10,
  },
  arrowCircle: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#F8FAFC',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
});
