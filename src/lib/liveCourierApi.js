// Production Courier API Integration for PostEx, TCS Express, and Leopards Courier

export const COURIER_API_KEYS = {
  postexToken: import.meta.env.VITE_POSTEX_TOKEN || '',
  tcsApiKey: import.meta.env.VITE_TCS_API_KEY || '',
  leopardsApiKey: import.meta.env.VITE_LEOPARDS_API_KEY || ''
};

/**
 * Creates a real booking shipment order with PostEx COD API
 */
export const createPostexShipment = async (order) => {
  const token = COURIER_API_KEYS.postexToken;
  if (!token) return null;

  try {
    const response = await fetch('https://api.postex.pk/services/integration/api/order/create-order', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'token': token
      },
      body: JSON.stringify({
        cityName: order.city || 'Lahore',
        customerName: order.customerName,
        customerPhone: order.phone,
        deliveryAddress: order.address,
        invoiceDivision: 1,
        invoicePayment: order.totalAmount,
        orderRefNumber: order.id,
        orderType: 'Normal'
      })
    });
    const result = await response.json();
    if (result?.statusCode === '200' && result?.dist) {
      return {
        trackingNumber: result.dist.trackingNumber,
        courier: 'PostEx'
      };
    }
  } catch (err) {
    console.error('PostEx API shipment booking error:', err);
  }
  return null;
};
