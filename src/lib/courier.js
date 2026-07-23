// Courier Logistics Integration Gateway for Pakistan E-Commerce
// Supports TCS Express, Leopards Courier, PostEx COD, Trax Logistics, CallCourier

export const COURIER_PARTNERS = [
  {
    id: 'tcs',
    name: 'TCS Express (COD)',
    code: 'TCS',
    prefix: 'TCS',
    logo: '🚚',
    estimatedDays: '1 - 2 Business Days',
    trackingUrl: 'https://www.tcsexpress.com/tracking?cn=',
    supportPhone: '021-111-123-456'
  },
  {
    id: 'leopards',
    name: 'Leopards Courier (Nationwide)',
    code: 'LPD',
    prefix: 'LPD',
    logo: '🐆',
    estimatedDays: '2 - 3 Business Days',
    trackingUrl: 'https://www.leopardscourier.com/tracking?cn=',
    supportPhone: '021-111-300-786'
  },
  {
    id: 'postex',
    name: 'PostEx E-Commerce Delivery',
    code: 'PEX',
    prefix: 'PEX',
    logo: '📦',
    estimatedDays: '1 - 2 Business Days',
    trackingUrl: 'https://postex.pk/tracking?trackingNo=',
    supportPhone: '042-111-767-839'
  },
  {
    id: 'trax',
    name: 'Trax Logistics COD',
    code: 'TRX',
    prefix: 'TRX',
    logo: '⚡',
    estimatedDays: '2 - 3 Business Days',
    trackingUrl: 'https://trax.pk/tracking?tracking_number=',
    supportPhone: '021-111-118-729'
  }
];

export const generateTrackingDetails = (courierId = 'tcs', city = 'Lahore') => {
  const partner = COURIER_PARTNERS.find(p => p.id === courierId) || COURIER_PARTNERS[0];
  const randomDigits = Math.floor(10000000 + Math.random() * 90000000);
  const waybillNumber = `${partner.prefix}-${randomDigits}`;

  const now = new Date();
  const dispatchDate = new Date(now.getTime() + 2 * 60 * 60 * 1000);
  const transitDate = new Date(now.getTime() + 18 * 60 * 60 * 1000);
  const estimatedDeliveryDate = new Date(now.getTime() + (city.toLowerCase() === 'lahore' ? 36 : 60) * 60 * 60 * 1000);

  const timeline = [
    {
      status: 'Manifested & Booked',
      location: 'Store Fulfillment Center, Lahore',
      time: now.toLocaleString('en-PK', { dateStyle: 'short', timeStyle: 'short' }),
      completed: true,
      description: `Parcel booked under Waybill #${waybillNumber} via ${partner.name}.`
    },
    {
      status: 'Dispatched to Sorting Hub',
      location: `${partner.name} Central Hub, Lahore`,
      time: dispatchDate.toLocaleString('en-PK', { dateStyle: 'short', timeStyle: 'short' }),
      completed: true,
      description: 'Package scanned at automated sorting facility.'
    },
    {
      status: 'In Transit across Linehaul Network',
      location: `Linehaul Route -> ${city}`,
      time: transitDate.toLocaleString('en-PK', { dateStyle: 'short', timeStyle: 'short' }),
      completed: false,
      description: `Vehicle en route to ${city} destination express facility.`
    },
    {
      status: 'Out for Doorstep Delivery',
      location: `${city} Delivery Express Station`,
      time: estimatedDeliveryDate.toLocaleString('en-PK', { dateStyle: 'short', timeStyle: 'short' }),
      completed: false,
      description: 'Assigned to courier rider for final customer delivery.'
    }
  ];

  return {
    courierPartner: partner.name,
    courierCode: partner.code,
    waybillNumber,
    trackingUrl: `${partner.trackingUrl}${waybillNumber}`,
    supportPhone: partner.supportPhone,
    estimatedDays: partner.estimatedDays,
    estimatedDeliveryDate: estimatedDeliveryDate.toLocaleDateString('en-PK', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' }),
    timeline
  };
};
