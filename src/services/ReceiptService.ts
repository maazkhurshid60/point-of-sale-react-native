import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import { TicketData, InvoiceData, SoftwareSettings } from '../models';

export class ReceiptService {
  /**
   * Universal rounding logic matching Flutter implementation
   */
  static formatAmount(value: string | number, settings: SoftwareSettings | null): string {
    const num = typeof value === 'string' ? parseFloat(value) : value;
    if (isNaN(num)) return '0.00';

    const rounding = settings?.rounding || 'no';
    if (rounding === 'next') return Math.ceil(num).toString();
    if (rounding === 'floor') return Math.floor(num).toString();
    return num.toFixed(2);
  }

  /**
   * Generates a thermal-optimized 80mm ticket HTML
   */
  static async generateTicketHtml(data: TicketData, settings: SoftwareSettings | null): Promise<string> {
    const formattedSubtotal = this.formatAmount(data.subtotal, settings);
    const formattedTotal = this.formatAmount(data.totalBill, settings);
    const formattedPaid = this.formatAmount(data.amountPaid, settings);
    const formattedBalance = this.formatAmount(data.balance, settings);
    const formattedTax = this.formatAmount(data.totalTax, settings);
    const formattedDiscount = this.formatAmount(data.totalDiscount, settings);

    const ticketNum = data.ticketNo.split('-')[1] || data.ticketNo;

    return `
      <html>
        <head>
          <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scalable=no" />
          <style>
            @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;700&display=swap');
            body { 
              font-family: 'Montserrat', sans-serif; 
              width: 80mm; 
              padding: 0; 
              margin: 0; 
              color: black;
              font-size: 10px;
            }
            .header { text-align: center; margin-bottom: 20px; }
            .store-name { font-size: 14px; font-weight: bold; }
            .details-row { display: flex; justify-content: space-between; margin-bottom: 3px; font-size: 8px; }
            .details-label { font-weight: bold; }
            table { width: 100%; border-collapse: collapse; margin-top: 10px; font-size: 7px; border: 0.5px solid black; }
            th, td { border: 0.5px solid black; padding: 3px; text-align: center; }
            .totals { margin-left: auto; width: 60%; margin-top: 10px; font-size: 8px; }
            .totals-row { display: flex; justify-content: space-between; margin-bottom: 3px; font-weight: bold; }
            .footer { text-align: center; margin-top: 20px; border-top: 2px solid black; padding-top: 5px; }
            .barcode { margin: 10px auto; display: block; }
          </style>
          <script src="https://cdn.jsdelivr.net/npm/jsbarcode@3.11.5/dist/JsBarcode.all.min.js"></script>
        </head>
        <body>
          <div class="header">
            <div class="store-name">${data.crtStoreName}</div>
            <div>${data.crtStoreCompleteAddress}</div>
            <div>Contact: ${data.crtStoreContact}</div>
          </div>

          <div style="width: 150px; margin: 0 auto;">
            <div class="details-row"><span class="details-label">Date:</span><span>${data.date}</span></div>
            <div class="details-row"><span class="details-label">Customer:</span><span>${data.customerName}</span></div>
            <div class="details-row"><span class="details-label">Sale ID:</span><span>${data.saleId}</span></div>
            <div class="details-row"><span class="details-label">Cashier:</span><span>${data.userName}</span></div>
            <div class="details-row"><span class="details-label">Customer ID:</span><span>${data.customerId}</span></div>
          </div>

          <table>
            <thead>
              <tr>
                <th>SKU</th>
                <th>Product</th>
                <th>Qty</th>
                <th>Price</th>
                <th>Disc</th>
                <th>GST %</th>
                <th>GST</th>
                <th>Sub Total</th>
              </tr>
            </thead>
            <tbody>
              ${data.saleItems.map(item => `
                <tr>
                  <td>${item[0]}</td>
                  <td style="text-align: left;">${item[1]}</td>
                  <td>${item[2]}</td>
                  <td>${item[3]}</td>
                  <td>${item[4]}</td>
                  <td>${item[5]}</td>
                  <td>${item[6]}</td>
                  <td>${item[7]}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>

          <div class="totals">
            <div class="totals-row"><span>Sub-Total</span><span>${formattedSubtotal}</span></div>
            ${formattedTax !== '0.00' ? `<div class="totals-row"><span>GST (${data.tax})</span><span>${formattedTax}</span></div>` : ''}
            <div class="totals-row"><span>Discount</span><span>${formattedDiscount}</span></div>
            <div class="totals-row"><span>Total</span><span>${formattedTotal}</span></div>
            <div class="totals-row"><span>Paid</span><span>${formattedPaid}</span></div>
            <div class="totals-row"><span>Balance</span><span>${formattedBalance}</span></div>
          </div>

          <div style="text-align: center; margin-top: 20px;">
            <svg id="barcode"></svg>
            <div style="font-size: 8px;">${data.ticketNo}</div>
          </div>

          <div class="footer">
            <div>Software by Red Star Technologies</div>
            <div style="font-weight: bold; margin-top: 5px;">03335749683</div>
          </div>

          <script>
            JsBarcode("#barcode", "${ticketNum}", {
              format: "CODE128",
              width: 1,
              height: 25,
              displayValue: false
            });
          </script>
        </body>
      </html>
    `;
  }

  /**
   * Generates a professional A4 invoice HTML
   */
  static async generateInvoiceHtml(data: InvoiceData, settings: SoftwareSettings | null): Promise<string> {
    const { saleData, saleItemsData, companyData, settingsInvoiceFields } = data;

    // Permission Checks (Parity with InvoiceFieldsPermissions)
    const canShow = (constKey: string) => settingsInvoiceFields?.[constKey] === "1" || !settingsInvoiceFields;

    return `
      <html>
        <head>
          <style>
            @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;700&display=swap');
            body { font-family: 'Montserrat', sans-serif; padding: 40px; color: #4B5C69; font-size: 12px; }
            .header-info { display: flex; justify-content: space-between; color: #8E8E8E; margin-bottom: 5px; }
            .status-badge { color: #6750A4; font-weight: bold; font-size: 10px; }
            .divider { border-bottom: 1.5px solid #8E8E8E; margin: 10px 0; }
            .company-banner { 
              background-color: #6750A4; 
              color: white; 
              padding: 15px; 
              border-radius: 10px; 
              display: flex; 
              align-items: center;
              font-size: 16px;
              margin-bottom: 20px;
            }
            .bill-to { margin-bottom: 20px; }
            .bill-to-title { font-weight: bold; color: #4B5C69; margin-bottom: 5px; }
            .info-row { display: flex; justify-content: space-between; margin-bottom: 2px; }
            .info-label { color: #8E8E8E; }
            .info-value { font-weight: bold; color: #4B5C69; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th { background-color: #F4F6F8; padding: 12px; text-align: left; color: #8E8E8E; font-size: 10px; text-transform: uppercase; }
            td { padding: 12px; border-bottom: 1px solid #F4F6F8; font-size: 11px; }
            .totals-container { margin-left: auto; width: 40%; margin-top: 20px; }
            .total-final { background-color: #6750A4; color: white; padding: 10px; border-radius: 5px; margin-top: 10px; }
          </style>
        </head>
        <body>
          <div class="header-info">
            <div>
              <span>Sale Invoice </span>
              <span class="status-badge">(${saleData.status || ''})</span>
            </div>
            <div>Invoice No: ${saleData.invoice_no}</div>
          </div>
          
          <div class="divider"></div>

          <div class="company-banner">
            <span>🏢</span>
            <span style="margin-left: 10px;">${companyData.company_name}</span>
          </div>

          <div class="bill-to">
            <div class="bill-to-title">Bill To:</div>
            <div class="info-row">
              <span class="info-label">Customer:</span>
              <span class="info-value">${data.customerData.name || 'Walk-in Customer'}</span>
            </div>
            <div class="info-row">
              <span class="info-label">Date Issued:</span>
              <span class="info-value">${new Date(saleData.created_at).toLocaleString()}</span>
            </div>
          </div>

          <table>
            <thead>
              <tr>
                <th>Item</th>
                <th>Qty</th>
                <th>Price</th>
                <th>Tax</th>
                <th>Subtotal</th>
              </tr>
            </thead>
            <tbody>
              ${saleItemsData.map(item => `
                <tr>
                  <td>${item.product?.product_name || 'Product'}</td>
                  <td>${item.qty}</td>
                  <td>${this.formatAmount(item.actual_price, settings)}</td>
                  <td>${this.formatAmount(item.tax, settings)}</td>
                  <td>${this.formatAmount(item.subtotal, settings)}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>

          <div class="totals-container">
            <div class="info-row"><span>Actual Bill</span><span>${this.formatAmount(saleData.actual_bill, settings)}</span></div>
            <div class="info-row"><span>Total Tax</span><span>${this.formatAmount(saleData.total_tax, settings)}</span></div>
            <div class="info-row"><span>Discount</span><span>${this.formatAmount(saleData.total_discount, settings)}</span></div>
            <div class="total-final info-row">
              <span>Total Bill</span>
              <span>${this.formatAmount(saleData.total_bill, settings)}</span>
            </div>
          </div>
        </body>
      </html>
    `;
  }

  /**
   * Main function to trigger printing
   */
  static async printReceipt(data: any, type: 'ticket' | 'invoice', settings: SoftwareSettings | null) {
    try {
      let html = '';
      if (type === 'ticket') {
        html = await this.generateTicketHtml(data as TicketData, settings);
      } else {
        html = await this.generateInvoiceHtml(data as InvoiceData, settings);
      }

      const { uri } = await Print.printToFileAsync({ html });

      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(uri);
      } else {
        await Print.printAsync({ uri });
      }
    } catch (error) {
      console.error('Printing failed:', error);
      throw error;
    }
  }
}
