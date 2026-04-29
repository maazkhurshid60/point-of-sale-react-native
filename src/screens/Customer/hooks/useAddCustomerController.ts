import { useState } from 'react';
import { useWindowDimensions, Alert } from 'react-native';
import { useUIStore } from '../../../store/useUIStore';
import { useCustomerStore } from '../../../store/useCustomerStore';

export const useAddCustomerController = () => {
  const { width } = useWindowDimensions();
  const isTablet = width > 768;
  const setScreen = useUIStore((state) => state.setScreen);
  const addNewCustomer = useCustomerStore((state) => state.addNewCustomer);

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

  const updateFormData = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
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

  return {
    isTablet,
    isLoading,
    formData,
    errors,
    setScreen,
    updateFormData,
    handleSubmit,
  };
};
