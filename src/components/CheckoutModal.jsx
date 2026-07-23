import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { 
  CheckCircle, 
  Lock, 
  ArrowLeft, 
  Phone, 
  Copy,
  ShoppingBag,
  CreditCard,
  Smartphone,
  Building2,
  Calendar,
  ShieldCheck,
  Package
} from 'lucide-react';

export const CheckoutModal = () => {
  const { cart, appliedCoupon, placeOrder, setCurrentView, showToast } = useStore();

  const [formData, setFormData] = useState({
    customerName: '',
    email: '',
    phone: '',
    address: '',
    city: 'Lahore',
    deliveryNotes: '',
    paymentMethod: 'Cash on Delivery (COD)',
    
    // Mobile Wallet details
    walletNumber: '',

    // Card Details
    cardName: '',
    cardNumber: '',
    cardExpiry: '',
    cardCvv: '',

    // Bank Transfer
    bankTxRef: ''
  });

  const [showOtpModal, setShowOtpModal] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const [completedOrder, setCompletedOrder] = useState(null);

  // Calculations in PKR
  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  let discountAmount = 0;
  if (appliedCoupon) {
    discountAmount = appliedCoupon.type === 'percentage' ? (subtotal * appliedCoupon.value) / 100 : appliedCoupon.value;
  }
  const shippingFee = subtotal === 0 ? 0 : 0;
  const total = Math.max(0, subtotal - discountAmount + shippingFee);

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (!formData.customerName || !formData.phone || !formData.address) {
      showToast("Please fill in your Name, Phone Number, and Complete Address", "error");
      return;
    }

    if (formData.paymentMethod === 'Credit / Debit Card (Visa/Mastercard)') {
      setShowOtpModal(true);
      return;
    }

    processOrder();
  };

  const processOrder = () => {
    const order = placeOrder({
      customerName: formData.customerName,
      email: formData.email || `${formData.phone.replace(/[^0-9]/g, '')}@customer.pk`,
      phone: formData.phone,
      address: `${formData.address}, ${formData.city}`,
      city: formData.city,
      deliveryNotes: formData.deliveryNotes,
      paymentMethod: formData.paymentMethod,
      totalAmount: total
    });

    setCompletedOrder(order);
    setShowOtpModal(false);
    showToast("Order Placed Successfully!");
  };

  const handleCopyOrderId = () => {
    if (completedOrder) {
      navigator.clipboard.writeText(completedOrder.id);
      showToast("Order ID copied!");
    }
  };

  if (completedOrder) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-10">
        <div className="bg-white rounded-3xl p-6 sm:p-10 shadow-2xl border-2 border-green-200 text-center animate-fade-in space-y-6">
          <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto">
            <CheckCircle className="w-12 h-12" />
          </div>

          <div>
            <h2 className="text-3xl font-black text-gray-900">Order Confirmed!</h2>
            <p className="text-sm font-bold text-gray-600 mt-1">
              Thank you for shopping with us! Your order details have been recorded and sent to our team.
            </p>
          </div>

          {/* Clean Order Summary Card */}
          <div className="bg-gray-50 rounded-3xl p-6 border-2 border-gray-200 text-left max-w-xl mx-auto space-y-3 text-xs font-bold">
            <div className="flex items-center justify-between border-b border-gray-200 pb-3">
              <span className="text-gray-500">Order Reference ID:</span>
              <div className="flex items-center space-x-2 font-mono font-black text-brand-orange text-base">
                <span>{completedOrder.id}</span>
                <button onClick={handleCopyOrderId} className="text-brand-orange hover:underline" title="Copy Order ID">
                  <Copy className="w-4 h-4" />
                </button>
              </div>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Customer Name:</span>
              <span className="text-gray-900">{completedOrder.customerName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Mobile Phone:</span>
              <span className="text-gray-900">{completedOrder.phone}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Delivery Address:</span>
              <span className="text-gray-900 text-right max-w-xs">{completedOrder.address}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Payment Option:</span>
              <span className="text-gray-900 font-black text-green-700">{completedOrder.paymentMethod}</span>
            </div>
            <div className="flex justify-between border-t-2 border-gray-200 pt-3 text-base font-black text-brand-orange">
              <span>Total Amount:</span>
              <span>Rs. {completedOrder.totalAmount.toLocaleString()}</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <button 
              onClick={() => setCurrentView('shop')}
              className="bg-brand-orange hover:bg-brand-orange-hover text-white font-black text-xs px-8 py-4 rounded-2xl shadow transition uppercase tracking-wider"
            >
              Continue Shopping
            </button>
            <button 
              onClick={() => window.print()}
              className="bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold text-xs px-6 py-4 rounded-2xl transition border border-gray-300"
            >
              Print Invoice
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center">
        <ShoppingBag className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <h2 className="text-2xl font-black text-gray-900">Your Cart is Empty</h2>
        <p className="text-xs text-gray-500 mt-2 font-bold">Please add items to your cart before proceeding to checkout.</p>
        <button 
          onClick={() => setCurrentView('shop')}
          className="mt-6 bg-brand-orange text-white text-xs font-black px-6 py-3.5 rounded-xl shadow"
        >
          Return to Catalog
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <button 
        onClick={() => setCurrentView('shop')}
        className="inline-flex items-center space-x-1.5 text-xs font-black text-gray-700 hover:text-brand-orange mb-6 transition"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Storefront</span>
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Form */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 shadow-sm border-2 border-gray-200">
          <div className="flex items-center justify-between border-b-2 border-gray-100 pb-4 mb-6">
            <div className="flex items-center space-x-2">
              <Lock className="w-6 h-6 text-brand-orange" />
              <h2 className="text-xl font-black text-gray-900">Checkout & Delivery Details</h2>
            </div>
            <span className="inline-flex items-center space-x-1 text-[11px] font-extrabold text-green-700 bg-green-50 px-3 py-1 rounded-full border border-green-200">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>SSL Secure Checkout</span>
            </span>
          </div>

          <form onSubmit={handleFormSubmit} className="space-y-6">
            {/* Step 1: Customer Contact Info */}
            <div>
              <h3 className="text-xs font-black uppercase tracking-wider text-brand-orange mb-3 flex items-center space-x-2">
                <span className="w-5 h-5 bg-brand-orange text-white rounded-full text-[10px] inline-flex items-center justify-center font-bold">1</span>
                <span>Customer Contact Information</span>
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-black text-gray-800 mb-1">Your Full Name *</label>
                  <input 
                    type="text" 
                    required
                    value={formData.customerName}
                    onChange={e => setFormData({...formData, customerName: e.target.value})}
                    placeholder="e.g. Tariq Mehmood"
                    className="w-full px-3.5 py-3 text-sm font-bold bg-gray-50 border-2 border-gray-300 rounded-xl outline-none focus:border-brand-orange focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-black text-gray-800 mb-1">Mobile Phone Number *</label>
                  <input 
                    type="tel" 
                    required
                    value={formData.phone}
                    onChange={e => setFormData({...formData, phone: e.target.value})}
                    placeholder="e.g. 0300-1234567"
                    className="w-full px-3.5 py-3 text-sm font-bold bg-gray-50 border-2 border-gray-300 rounded-xl outline-none focus:border-brand-orange focus:bg-white"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-black text-gray-800 mb-1">Email Address (Optional)</label>
                  <input 
                    type="email" 
                    value={formData.email}
                    onChange={e => setFormData({...formData, email: e.target.value})}
                    placeholder="yourname@gmail.com"
                    className="w-full px-3.5 py-3 text-sm font-bold bg-gray-50 border-2 border-gray-300 rounded-xl outline-none focus:border-brand-orange focus:bg-white"
                  />
                </div>
              </div>
            </div>

            {/* Step 2: Shipping Address */}
            <div className="pt-4 border-t-2 border-gray-100">
              <h3 className="text-xs font-black uppercase tracking-wider text-brand-orange mb-3 flex items-center space-x-2">
                <span className="w-5 h-5 bg-brand-orange text-white rounded-full text-[10px] inline-flex items-center justify-center font-bold">2</span>
                <span>Delivery Address</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-black text-gray-800 mb-1">Complete Delivery Address *</label>
                  <input 
                    type="text" 
                    required
                    value={formData.address}
                    onChange={e => setFormData({...formData, address: e.target.value})}
                    placeholder="House/Flat #, Street #, Sector/Block, Landmark"
                    className="w-full px-3.5 py-3 text-sm font-bold bg-gray-50 border-2 border-gray-300 rounded-xl outline-none focus:border-brand-orange focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-black text-gray-800 mb-1">City *</label>
                  <select 
                    value={formData.city}
                    onChange={e => setFormData({...formData, city: e.target.value})}
                    className="w-full px-3.5 py-3 text-sm font-bold bg-gray-50 border-2 border-gray-300 rounded-xl outline-none focus:border-brand-orange"
                  >
                    {["Lahore", "Karachi", "Islamabad", "Rawalpindi", "Faisalabad", "Multan", "Peshawar", "Quetta", "Sialkot", "Gujranwala", "Hyderabad", "Bahawalpur", "Other City"].map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-black text-gray-800 mb-1">Delivery Notes (Optional)</label>
                  <input 
                    type="text" 
                    value={formData.deliveryNotes}
                    onChange={e => setFormData({...formData, deliveryNotes: e.target.value})}
                    placeholder="e.g. Call before arrival"
                    className="w-full px-3.5 py-3 text-sm font-bold bg-gray-50 border-2 border-gray-300 rounded-xl outline-none focus:border-brand-orange"
                  />
                </div>
              </div>
            </div>

            {/* Step 3: Payment Options */}
            <div className="pt-4 border-t-2 border-gray-100">
              <h3 className="text-xs font-black uppercase tracking-wider text-brand-orange mb-3 flex items-center space-x-2">
                <span className="w-5 h-5 bg-brand-orange text-white rounded-full text-[10px] inline-flex items-center justify-center font-bold">3</span>
                <span>Payment Method</span>
              </h3>

              <div className="space-y-3">
                {/* Cash on Delivery (COD) ONLY */}
                <label className="flex items-start space-x-3 p-4 rounded-2xl border-2 border-brand-orange bg-orange-50/50 cursor-pointer">
                  <input 
                    type="radio" 
                    name="pm"
                    value="Cash on Delivery (COD)"
                    checked={true}
                    readOnly
                    className="mt-1 text-brand-orange focus:ring-brand-orange"
                  />
                  <div>
                    <span className="text-sm font-black text-gray-900 block">
                      Cash on Delivery (COD)
                    </span>
                    <span className="text-xs text-gray-600 font-bold">Pay cash to delivery rider upon doorstep parcel delivery across Pakistan.</span>
                  </div>
                </label>
              </div>
            </div>

            <button 
              type="submit"
              className="w-full bg-brand-orange hover:bg-brand-orange-hover text-white font-black py-4 px-6 rounded-2xl shadow-xl transition active:scale-98 text-base border-2 border-brand-orange uppercase tracking-wider"
            >
              PLACE ORDER (Rs. {total.toLocaleString()})
            </button>
          </form>
        </div>

        {/* Right Summary */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white rounded-3xl p-6 shadow-sm border-2 border-gray-200">
            <h3 className="text-base font-black text-gray-900 border-b border-gray-200 pb-3 mb-4 flex items-center justify-between">
              <span>Items Summary ({cart.length})</span>
              <span className="text-xs text-brand-orange font-extrabold">{formData.city} Delivery</span>
            </h3>

            <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
              {cart.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between text-xs py-1 font-bold">
                  <div className="flex items-center space-x-3">
                    <img src={item.images?.[0] || item.image} alt={item.name} className="w-10 h-10 object-cover rounded-lg border border-gray-300" />
                    <div>
                      <h4 className="font-extrabold text-gray-900 truncate max-w-[150px]">{item.name}</h4>
                      <p className="text-[10px] text-gray-500">Qty: {item.quantity}</p>
                    </div>
                  </div>
                  <span className="font-black text-gray-900">Rs. {(item.price * item.quantity).toLocaleString()}</span>
                </div>
              ))}
            </div>

            <div className="border-t-2 border-gray-100 pt-4 mt-4 space-y-2 text-xs font-bold text-gray-700">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>Rs. {subtotal.toLocaleString()}</span>
              </div>
              {discountAmount > 0 && (
                <div className="flex justify-between text-green-700">
                  <span>Coupon Savings</span>
                  <span>-Rs. {discountAmount.toLocaleString()}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Shipping Charges</span>
                <span>Rs. 0</span>
              </div>
              <div className="flex justify-between text-base font-black text-gray-900 pt-3 border-t-2 border-gray-200">
                <span>Total Payable</span>
                <span className="text-brand-orange">Rs. {total.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Simulated 3D Secure Card OTP Modal */}
      {showOtpModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-sm w-full shadow-2xl text-center space-y-4 animate-fade-in border-2 border-indigo-200">
            <div className="w-12 h-12 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center mx-auto font-black text-xl">
              🔒
            </div>
            <div>
              <h3 className="text-lg font-black text-gray-900">3D Secure Banking OTP</h3>
              <p className="text-xs text-gray-500 mt-1 font-bold">
                Enter 6-digit OTP code sent to your registered card mobile number.
              </p>
            </div>

            <div className="py-2">
              <input 
                type="text"
                maxLength={6}
                value={otpCode}
                onChange={e => setOtpCode(e.target.value)}
                placeholder="1 2 3 4 5 6"
                className="w-full text-center tracking-widest text-lg font-mono font-black py-3 bg-gray-50 border-2 border-indigo-300 rounded-xl outline-none focus:border-indigo-600"
              />
            </div>

            <div className="flex gap-2">
              <button 
                onClick={() => setShowOtpModal(false)}
                className="w-1/2 py-2.5 text-xs font-bold text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-xl transition"
              >
                Cancel
              </button>
              <button 
                onClick={processOrder}
                className="w-1/2 py-2.5 text-xs font-black text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow transition"
              >
                Verify & Pay
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
