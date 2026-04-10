import React, { useEffect } from 'react';
import { useProductStore } from '../../store/useProductStore';
import { LeftSideMenuDropdown } from '../common/LeftSideMenuDropdown';

export const CategorySelector: React.FC = () => {
  const listOfCategories = useProductStore((state) => state.listOfCategories);
  const selectedCategoryName = useProductStore((state) => state.selectedCategoryName);
  const fetchCategories = useProductStore((state) => state.fetchCategories);
  const fetchProducts = useProductStore((state) => state.fetchProducts);
  const setCategory = useProductStore((state) => state.setCategory);

  useEffect(() => {
    fetchCategories();
  }, []);

  return (
    <LeftSideMenuDropdown
      label="Category"
      value={selectedCategoryName}
      items={listOfCategories}
      onSelect={(item) => {
        setCategory(item.name);
        fetchProducts(item.value, false);
      }}
    />
  );
};
