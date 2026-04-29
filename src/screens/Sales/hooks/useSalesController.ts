import { useState, useCallback, useEffect } from 'react';
import { useWindowDimensions, DimensionValue } from 'react-native';
import { useSalesStore } from '../../../store/useSalesStore';
import { useUIStore } from '../../../store/useUIStore';
import { useDialogStore, DialogType } from '../../../store/useDialogStore';
import { useSales } from '../../../api/sales/queries';
import { useSaleInvoice } from '../../../api/pos/queries';
import { useCustomers } from '../../../api/catalog/queries';

export const useSalesController = () => {
  const { width, height } = useWindowDimensions();
  const isTablet = width > 768;
  const isLandscape = width > height;
  const isLargeTablet = width > 1024;

  const filters = useSalesStore((state) => state.filters);
  const setFilter = useSalesStore((state) => state.setFilter);
  const resetFilters = useSalesStore((state) => state.resetFilters);
  const fetchEditSaleForm = useSalesStore((state) => state.fetchEditSaleForm);

  const [currentPage, setCurrentPage] = useState(1);
  const { data: salesData, isLoading, refetch, isFetching } = useSales(filters, currentPage);
  const { data: customers = [] } = useCustomers();
  const { mutateAsync: getInvoice } = useSaleInvoice();

  const showDialog = useDialogStore((state) => state.showDialog);
  const setScreen = useUIStore((state) => state.setScreen);

  const sales = salesData?.data || [];
  const totalRecords = salesData?.total || 0;
  const hasNextPage = !!salesData?.next_page_url;
  const hasPrevPage = !!salesData?.prev_page_url;

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  const onRefresh = useCallback(() => {
    refetch();
  }, [refetch]);

  const handleAction = async (action: string, sale: any) => {
    if (action === 'Select' || !action) return;

    let type = '';
    let dialogType: DialogType = 'INVOICE_SLIP';

    switch (action) {
      case 'Invoice':
        type = 'invoice';
        dialogType = 'INVOICE_SLIP';
        break;
      case 'Ticket':
        type = 'Ticket';
        dialogType = 'TICKET_SLIP';
        break;
      case 'GDS':
        type = 'gdn';
        dialogType = 'GOODS_DELIVERY_SLIP';
        break;
      case 'GIS':
        type = 'goods_issuance_slip';
        dialogType = 'GOODS_ISSUANCE_SLIP';
        break;
      case 'Sample':
        type = 'sample_sale_slip';
        dialogType = 'SAMPLE_SALE_SLIP';
        break;
      default:
        return;
    }

    try {
      const slipData = await getInvoice({ saleId: sale.sale_id, invoiceType: type });
      if (slipData) {
        showDialog(dialogType, { slipData });
      }
    } catch (err: any) {
      showDialog('ERROR', { errorMessage: err.message || 'Failed to fetch slip data.' });
    }
  };

  const handleEdit = async (sale: any) => {
    try {
      await fetchEditSaleForm(sale.sale_id, sale);
      setScreen('EDIT_SALE');
    } catch (err) {
      showDialog('ERROR', { errorMessage: 'Failed to load sale for editing.' });
    }
  };

  const contentMaxWidth: DimensionValue = isLargeTablet ? 1200 : isTablet ? 1000 : '100%';

  return {
    // State
    width,
    isTablet,
    isLandscape,
    isLargeTablet,
    contentMaxWidth,
    sales,
    isLoading: isLoading || isFetching,
    filters,
    customers,
    pagination: {
      currentPage,
      totalRecords,
      hasNextPage,
      hasPrevPage,
    },

    // Actions
    setFilter,
    resetFilters: () => {
      resetFilters();
      setCurrentPage(1);
    },
    handlePageChange,
    onRefresh,
    handleAction,
    handleEdit,
    showDialog,
  };
};
