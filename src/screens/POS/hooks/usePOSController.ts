import React, { useState, useCallback } from 'react';
import { useWindowDimensions } from 'react-native';
import { useCartStore } from '../../../store/useCartStore';
import { useShiftStore } from '../../../store/useShiftStore';
import { usePaymentStore } from '../../../store/usePaymentStore';
import { useUIStore } from '../../../store/useUIStore';
import { useDialogStore } from '../../../store/useDialogStore';
import { Logger } from '../../../utils/logger';
import { formatSaleResponseToSlipData } from '../../../utils/invoiceMapping';

export const usePOSController = () => {
  const { width: windowWidth, height: windowHeight } = useWindowDimensions();
  const isLandscape = windowWidth > windowHeight;
  const isTablet = windowWidth > 900;

  const setScreen = useUIStore((state) => state.setScreen);
  const setPaymentScreenValues = usePaymentStore((state) => state.setPaymentScreenValues);

  const cartItems = useCartStore((state) => state.cartItems);
  const clearCart = useCartStore((state) => state.clearCart);
  const totalToPay = useCartStore((state) => state.totalToPay);
  const discountAmount = useCartStore((state) => state.discountAmount);
  const taxAmount = useCartStore((state) => state.taxAmount);
  const selectedCustomer = useCartStore((state) => state.selectedCustomer);
  const makeSale = useCartStore((state) => state.makeSale);
  const holdCurrentSale = useCartStore((state) => state.holdCurrentSale);

  const currentShift = useShiftStore((state) => state.currentShift);
  const selectedSalesman = useShiftStore((state) => state.selectedSalesman);

  const showDialog = useDialogStore((state) => state.showDialog);

  const [showMoreOptions, setShowMoreOptions] = useState(false);
  const [isHolding, setIsHolding] = useState(false);

  const handleMoreAction = useCallback(async (type: string) => {
    setShowMoreOptions(false);

    if (type === 'coupon') {
      showDialog('GENERATE_COUPON', {});
      return;
    }

    const result = await makeSale(type);
    if (result) {
      const slipData = formatSaleResponseToSlipData(result);
      if (!slipData) return;

      Logger.debugPayload('POSScreen Final standardized slipData for dialog', slipData);

      switch (type) {
        case 'print-invoice':
          showDialog('TICKET_SLIP', { slipData });
          break;
        case 'print-bill':
          showDialog('RAW_BILL_SLIP', { slipData });
          break;
        case 'print-quotation':
          showDialog('QUOTATION_SLIP', { slipData });
          break;
        case 'print-sample':
          showDialog('SAMPLE_SALE_SLIP', { slipData });
          break;
      }
    }
  }, [makeSale, showDialog]);

  const handleHold = useCallback(async () => {
    if (cartItems.length === 0) return;
    setIsHolding(true);
    await holdCurrentSale();
    setIsHolding(false);
  }, [cartItems.length, holdCurrentSale]);

  const navigateToPayment = useCallback(() => {
    if (cartItems.length > 0) {
      setPaymentScreenValues(totalToPay, totalToPay);
      setScreen('PAYMENT');
    }
  }, [cartItems.length, totalToPay, setPaymentScreenValues, setScreen]);

  return {
    // State
    isLandscape,
    isTablet,
    cartItems,
    totalToPay,
    discountAmount,
    taxAmount,
    selectedCustomer,
    currentShift,
    selectedSalesman,
    showMoreOptions,
    isHolding,

    // Actions
    setShowMoreOptions,
    handleMoreAction,
    handleHold,
    clearCart,
    showDialog,
    navigateToPayment,
  };
};
