import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  Pressable,
  ActivityIndicator,
  Alert,
  useWindowDimensions,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
} from 'react-native';
import { FontAwesome6 } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';
import { useAuthStore } from '../../store/useAuthStore';
import { COLORS } from '../../constants/colors';
import { TYPOGRAPHY } from '../../constants/typography';
import { useUIStore } from '../../store/useUIStore';

const AddCustomerScreen: React.FC = () => {
  const { width } = useWindowDimensions();
  const isTablet = width > 768;
  const setScreen = useUIStore((state) => state.setScreen);

  const addNewCustomer = useAuthStore((state) => state.addNewCustomer);

  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    mobile: '',
    opening_balance: '0',
    company_name: '',
    company_email: '',
    company_website: '',
    cnic: "",
    street: "",
    postal: "",
    city: "",
    province: "",
    country: "",
    tax_number: "",
    car_number: "",
    car_milage: "",
    remarks: "",
    status: 'active',
    category: 'physical',
    customer_type: 'Regular',
  });

  const [errors, setErrors] = useState<any>({});

  const validate = () => {
    const newErrors: any = {};
    if (!formData.name) newErrors.name = 'Full name is required';
    if (!formData.mobile) newErrors.mobile = 'Mobile number is required';

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (formData.email && !emailRegex.test(formData.email)) {
      newErrors.email = 'Invalid email address';
    }

    if (formData.company_email && !emailRegex.test(formData.company_email)) {
      newErrors.company_email = 'Invalid company email address';
    }

    if (isNaN(Number(formData.opening_balance))) {
      newErrors.opening_balance = 'Opening balance must be a number';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) {
      Alert.alert("Please Fill the Required Fields", "Please correct the errors before saving.");
      return;
    }

    setIsLoading(true);
    const result = await addNewCustomer(formData);
    setIsLoading(false);

    if (result.success) {
      Alert.alert("Success", "Customer added successfully!");
      setFormData({
        name: '',
        email: '',
        mobile: '',
        opening_balance: '0',
        company_name: '',
        company_email: '',
        company_website: '',
        cnic: "",
        street: "",
        postal: "",
        city: "",
        province: "",
        country: "",
        tax_number: "",
        car_number: "",
        car_milage: "",
        remarks: "",
        status: 'active',
        category: 'physical',
        customer_type: 'Regular',
      });
      setErrors({});
    } else {
      Alert.alert("Error", result.message || "Failed to add customer. Please try again.");
    }
  };

  const renderHeader = () => (
    <View style={styles.header}>
      <TouchableOpacity style={{ flexDirection: "row", gap: 10, alignItems: "center" }} onPress={() => setScreen('POS_BILLING')}>
        <FontAwesome6 style={{
          backgroundColor: COLORS.primary,
          padding: 10,
          borderRadius: 100
        }} name="arrow-left" size={24} color={COLORS.white} />
        <Text style={styles.title}>Customers</Text>
      </TouchableOpacity>

    </View>
  );

  const renderInputField = (label: string, value: string, field: string, placeholder: string, keyboardType: any = 'default', required: boolean = false) => (
    <View style={[styles.inputGroup, { width: isTablet ? '48%' : '100%' }]}>
      <View style={styles.labelRow}>
        <Text style={styles.label}>{label}</Text>
        {required && <Text style={styles.requiredStar}>*</Text>}
      </View>
      <TextInput
        style={[styles.input, errors[field] && styles.inputError]}
        placeholder={placeholder}
        placeholderTextColor={COLORS.greyText}
        value={value}
        onChangeText={(text) => setFormData({ ...formData, [field]: text })}
        keyboardType={keyboardType}
      />
      {errors[field] && <Text style={styles.errorText}>{errors[field]}</Text>}
    </View>
  );

  const renderPickerField = (label: string, value: string, field: string, options: { label: string, value: string }[], required: boolean = false) => (
    <View style={[styles.inputGroup, { width: isTablet ? '48%' : '100%' }]}>
      <View style={styles.labelRow}>
        <Text style={styles.label}>{label}</Text>
        {required && <Text style={styles.requiredStar}>*</Text>}
      </View>
      <View style={[styles.input, { paddingHorizontal: 0, justifyContent: 'center', overflow: 'hidden' }, errors[field] && styles.inputError]}>
        <Picker
          selectedValue={value}
          onValueChange={(itemValue) => setFormData({ ...formData, [field]: itemValue })}
          style={{ width: '100%', marginLeft: Platform.OS === 'ios' ? 0 : 8 }}
          mode="dropdown"
          dropdownIconColor="transparent"
        >
          {options.map(option => (
            <Picker.Item key={option.value} label={option.label} value={option.value} color={COLORS.black} style={{ backgroundColor: COLORS.white }} />
          ))}
        </Picker>

      </View>
      {errors[field] && <Text style={styles.errorText}>{errors[field]}</Text>}
    </View>
  );

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {renderHeader()}

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <FontAwesome6 name="user-large" size={16} color={COLORS.primary} />
            <Text style={styles.sectionTitle}>Personal Details</Text>
          </View>
          <View style={styles.formGrid}>
            {renderInputField("Full Name", formData.name, "name", "John Doe", "default", true)}
            {renderInputField("Mobile No", formData.mobile, "mobile", "0312XXXXXXX", "phone-pad", true)}
            {renderInputField("Email Address", formData.email, "email", "john@example.com", "email-address")}
            {renderInputField("CNIC No", formData.cnic, "cnic", "1234567890123", "numeric")}
            {renderInputField("Street", formData.street, "street", "Enter your street", "default")}
            {renderInputField("City", formData.city, "city", "Enter your city", "default")}
            {renderInputField("Opening Balance", formData.opening_balance, "opening_balance", "0", "numeric")}
            {renderInputField("Car Number", formData.car_number, "car_number", "Enter your car number", "default")}
            {renderInputField("Car Milage", formData.car_milage, "car_milage", "Enter your car milage", "numeric")}
            {renderInputField("Remarks", formData.remarks, "remarks", "Enter your remarks", "default")}

            {renderPickerField("Status", formData.status, "status", [
              { label: "Active", value: "active" },
              { label: "In Active", value: "inactive" },
            ])}
            {renderPickerField("Category", formData.category, "category", [
              { label: "Physical", value: "physical" },
              { label: "Online", value: "online" },
            ])}
            {renderPickerField("Customer Type", formData.customer_type, "customer_type", [
              { label: "Builder", value: "Builder" },
              { label: "Architect", value: "Architect" },
              { label: "Carpenter", value: "Carpenter" },
              { label: "Contractor", value: "Contractor" },
              { label: "Designer", value: "Designer" },
              { label: "Door Manufacturer", value: "Door Manufacturer" },
              { label: "Govt Organisation", value: "Govt Organisation" },
              { label: "Home Owner", value: "Home Owner" },
              { label: "Kitchen Wardrobe Manufacturer", value: "Kitchen Wardrobe Manufacturer" },
              { label: "Private Organisation", value: "Private Organisation" },
              { label: "Project Customer", value: "Project Customer" },
              { label: "Purchaser", value: "Purchaser" },
              { label: "Regular", value: "Regular" },
              { label: "Vendor", value: "Vendor" },
              { label: "Walking", value: "Walking" },
              { label: "Wholesale Shop", value: "Wholesale Shop" },
            ])}

            {/* {renderInputField("Opening Balance", formData.opening_balance, "opening_balance", "0", "numeric")} */}
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <FontAwesome6 name="building" size={16} color={COLORS.primary} />
            <Text style={styles.sectionTitle}>Company Details (Optional)</Text>
          </View>
          <View style={styles.formGrid}>
            {renderInputField("Company Name", formData.company_name, "company_name", "Acme Corp")}
            {renderInputField("Company Email", formData.company_email, "company_email", "contact@acme.com", "email-address")}
            {renderInputField("Website", formData.company_website, "company_website", "www.acme.com", "url")}
            {renderInputField("Tax Number", formData.tax_number, "tax_number", "Enter your tax number", "numeric")}
            {renderInputField("Country", formData.country, "country", "Enter your country", "default")}
            {renderInputField("Province/State", formData.province, "province", "Enter your state", "default")}
            {renderInputField("Postal Code", formData.postal, "postal", "Enter your postal code", "numeric")}
          </View>
        </View>

        <Pressable
          style={[styles.submitBtn, isLoading && styles.submitBtnDisabled]}
          onPress={handleSubmit}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <>
              <FontAwesome6 name="user-plus" size={16} color="#fff" />
              <Text style={styles.submitBtnText}>Save Customer</Text>
            </>
          )}
        </Pressable>

        <View style={{ height: 100 }} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
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
  breadcrumb: {
    ...TYPOGRAPHY.montserrat.regular,
    fontSize: 12,
    color: COLORS.greyText,
    marginBottom: 4,
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
  submitBtnDisabled: {
    opacity: 0.7,
  },
  submitBtnText: {
    ...TYPOGRAPHY.montserrat.bold,
    color: '#fff',
    fontSize: 16,
  },
});

export default AddCustomerScreen;
