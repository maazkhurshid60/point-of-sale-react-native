import { useMutation } from '@tanstack/react-query';
import axiosClient from '../axiosClient';
import { API_ENDPOINTS } from '../../constants/apiEndpoints';
import { formatSaleResponseToSlipData } from '../../utils/invoiceMapping';

export const useSaleInvoice = () => {
  return useMutation({
    mutationFn: async ({ saleId, invoiceType }: { saleId: number, invoiceType?: string }) => {
      const response = await axiosClient.post(API_ENDPOINTS.POS.GET_INVOICE, null, {
        params: { id: saleId, invoice_type: invoiceType || '' }
      });

      const res = response.data;
      if (res && (res.success || res.status === 'successfully' || res.status === 'success')) {
        const result = res.result;
        if (!result) throw new Error('No invoice data returned');
        return formatSaleResponseToSlipData(result);
      }
      throw new Error(res?.message || 'Failed to fetch invoice');
    }
  });
};
