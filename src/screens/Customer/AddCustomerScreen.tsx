import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { FontAwesome6 } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';
import { COLORS } from '../../constants/colors';
import { CustomButton } from '../../components/common/CustomButton';
import { useAddCustomerController } from './hooks/useAddCustomerController';
import { styles } from './AddCustomerScreen.styles';

const AddCustomerScreen: React.FC = () => {
  const {
    isTablet,
    isLoading,
    formData,
    errors,
    setScreen,
    updateFormData,
    handleSubmit,
  } = useAddCustomerController();

  const renderHeader = () => (
    <View style={styles.header}>
      <CustomButton
        onPress={() => setScreen('POS_BILLING')}
        variant="primary"
        size="none"
        style={StyleSheet.flatten([{ padding: 10, borderRadius: 100, width: 44, height: 44 }])}
        iconComponent={<FontAwesome6 name="arrow-left" size={24} color={COLORS.white} />}
      />
      <Text style={styles.title}>Customers Management</Text>
    </View>
  );

  const renderInputField = (label: string, value: string, field: string, placeholder: string, keyboardType: any = 'default', required: boolean = false) => (
    <View style={StyleSheet.flatten([styles.inputGroup, { width: isTablet ? '48%' : '100%' }])}>
      <View style={styles.labelRow}>
        <Text style={styles.label}>{label}</Text>
        {required && <Text style={styles.requiredStar}>*</Text>}
      </View>
      <TextInput
        style={StyleSheet.flatten([styles.input, errors[field] && styles.inputError])}
        placeholder={placeholder}
        placeholderTextColor={COLORS.greyText}
        value={value}
        onChangeText={(text) => updateFormData(field, text)}
        keyboardType={keyboardType}
      />
      {errors[field] && <Text style={styles.errorText}>{errors[field]}</Text>}
    </View>
  );

  const renderPickerField = (label: string, value: string, field: string, options: { label: string, value: string }[], required: boolean = false) => (
    <View style={StyleSheet.flatten([styles.inputGroup, { width: isTablet ? '48%' : '100%' }])}>
      <View style={styles.labelRow}>
        <Text style={styles.label}>{label}</Text>
        {required && <Text style={styles.requiredStar}>*</Text>}
      </View>
      <View style={StyleSheet.flatten([styles.input, { paddingHorizontal: 0, justifyContent: 'center', overflow: 'hidden' }, errors[field] && styles.inputError])}>
        <Picker
          selectedValue={value}
          onValueChange={(itemValue) => updateFormData(field, itemValue)}
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

        <CustomButton
          title="Save Customer"
          onPress={handleSubmit}
          isLoading={isLoading}
          disabled={isLoading}
          style={styles.submitBtn}
          iconComponent={<FontAwesome6 name="user-plus" size={16} color="#fff" />}
        />

        <View style={{ height: 100 }} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default AddCustomerScreen;
