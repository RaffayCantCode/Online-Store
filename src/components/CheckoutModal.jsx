import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { 
  CheckCircle, 
  Lock, 
  ArrowLeft, 
  Phone, 
  Copy,
  ShoppingBag,
  Truck
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
    paymentMethod: 'Cash on Delivery (COD)'
  });

  const [completedOrder, setCompletedOrder] = useState(null);

  // Calculations in PKR
  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  let discountAmount = 0;
  if (appliedCoupon) {
    discountAmount = appliedCoupon.type === 'percentage' ? (subtotal * appliedCoupon.value) / 100 : appliedCoupon.value;
  }
  const shippingFee = subtotal >= 3000 || subtotal === 0 ? 0 : 250;
  const total = Math.max(0, subtotal - discountAmount + shippingFee);

  const handleSubmitOrder = (e) => {
    e.preventDefault();
    if (!formData.customerName || !formData.phone || !formData.address) {
      showToast("Please fill in your Name, Phone Number, and Address", "error");
      return;
    }

    const order = placeOrder({
      customerName: formData.customerName,
      email: formData.email || 'customer@taskeen.pk',
      phone: formData.phone,
      address: `${formData.address}, ${formData.city}`,
      deliveryNotes: formData.deliveryNotes,
      paymentMethod: formData.paymentMethod,
      totalAmount: total
    });

    setCompletedOrder(order);
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
      <div className="max-w-3xl mx-auto px-4 py-12">
        <div className="bg-white rounded-3xl p-8 sm:p-12 shadow-2xl border-2 border-green-200 text-center animate-fade-in">
          <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-12 h-12" />
          </div>
          <h2 className="text-3xl font-black text-gray-900">Shukriya! Order Successful!</h2>
          <p className="text-sm font-bold text-gray-600 mt-2">
            Your order has been received. Our team will contact you shortly to confirm delivery.
          </p>

          <div className="mt-6 bg-gray-50 rounded-2xl p-6 border-2 border-gray-200 text-left max-w-lg mx-auto space-y-3 text-xs font-bold">
            <div className="flex items-center justify-between border-b border-gray-200 pb-3">
              <span className="text-gray-500">Order Reference Number:</span>
              <div className="flex items-center space-x-2 font-mono font-black text-gray-900 text-sm">
                <span>{completedOrder.id}</span>
                <button onClick={handleCopyOrderId} className="text-brand-orange hover:underline">
                  <Copy className="w-4 h-4" />
                </button>
              </div>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Customer Name:</span>
              <span className="text-gray-900">{completedOrder.customerName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Phone Number:</span>
              <span className="text-gray-900">{completedOrder.phone}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Payment Option:</span>
              <span className="text-gray-900">{completedOrder.paymentMethod}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Shipping Address:</span>
              <span className="text-gray-900 text-right">{completedOrder.address}</span>
            </div>
            <div className="flex justify-between text-base font-black text-brand-orange border-t-2 border-gray-200 pt-3">
              <span>Total Payable Amount:</span>
              <span>Rs. {completedOrder.totalAmount.toLocaleString()}</span>
            </div>
          </div>

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button 
              onClick={() => setCurrentView('shop')}
              className="bg-brand-orange hover:bg-brand-orange-hover text-white font-black text-xs px-8 py-4 rounded-2xl shadow transition"
            >
              Back to Catalog
            </button>
            <button 
              onClick={() => window.print()}
              className="bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold text-xs px-6 py-4 rounded-2xl transition border border-gray-300"
            >
              Print Order Slip
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
        <p className="text-xs text-gray-500 mt-2 font-bold">Please add products to your cart before proceeding to checkout.</p>
        <button 
          onClick={() => setCurrentView('shop')}
          className="mt-6 bg-brand-orange text-white text-xs font-black px-6 py-3.5 rounded-xl shadow"
        >
          Return to Shop
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
        {/* Left 7 Columns */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 shadow-sm border-2 border-gray-200">
          <div className="flex items-center space-x-2 border-b-2 border-gray-100 pb-4 mb-6">
            <Lock className="w-6 h-6 text-brand-orange" />
            <h2 className="text-xl font-black text-gray-900">Order Delivery Form (Easy COD)</h2>
          </div>

          <form onSubmit={handleSubmitOrder} className="space-y-6">
            {/* Step 1 */}
            <div>
              <h3 className="text-xs font-black uppercase tracking-wider text-brand-orange mb-3">
                1. Customer Info
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-black text-gray-800 mb-1">Your Full Name *</label>
                  <input 
                    type="text" 
                    required
                    value={formData.customerName}
                    onChange={e => setFormData({...formData, customerName: e.target.value})}
                    placeholder="e.g. Usman Malik"
                    className="w-full px-3.5 py-3 text-sm font-bold bg-gray-50 border-2 border-gray-300 rounded-xl outline-none focus:border-brand-orange focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-black text-gray-800 mb-1">Mobile Phone Number (For COD Confirmation) *</label>
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

            {/* Step 2 */}
            <div className="pt-4 border-t-2 border-gray-100">
              <h3 className="text-xs font-black uppercase tracking-wider text-brand-orange mb-3">
                2. Shipping Address in Pakistan
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-black text-gray-800 mb-1">Complete Home/Shop Street Address *</label>
                  <input 
                    type="text" 
                    required
                    value={formData.address}
                    onChange={e => setFormData({...formData, address: e.target.value})}
                    placeholder="House/Plot #, Street, Area Name"
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
                    {["Lahore", "Karachi", "Islamabad", "Rawalpindi", "Faisalabad", "Multan", "Peshawar", "Quetta", "Sialkot", "Gujranwala", "Other City"].map(city => (
                      <option key={city} value={city}>{city}</option>
                    ))}
                  </select>
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-black text-gray-800 mb-1">Delivery Notes (Optional)</label>
                  <textarea 
                    rows={2}
                    value={formData.deliveryNotes}
                    onChange={e => setFormData({...formData, deliveryNotes: e.target.value})}
                    placeholder="Call before arriving..."
                    className="w-full px-3.5 py-2.5 text-sm font-bold bg-gray-50 border-2 border-gray-300 rounded-xl outline-none focus:border-brand-orange"
                  />
                </div>
              </div>
            </div>

            {/* Step 3 */}
            <div className="pt-4 border-t-2 border-gray-100">
              <h3 className="text-xs font-black uppercase tracking-wider text-brand-orange mb-3">
                3. Select Payment Mode
              </h3>
              <div className="space-y-3">
                {[
                  { id: 'Cash on Delivery (COD)', name: 'Cash on Delivery (COD)', desc: 'Pay cash to rider when order arrives at your doorstep' },
                  { id: 'Bkash / Nagad / JazzCash', name: 'JazzCash / EasyPaisa / Bank Transfer', desc: 'Pre-payment option available upon order confirmation' }
                ].map((pm) => (
                  <label 
                    key={pm.id}
                    className={`flex items-start space-x-3 p-4 rounded-2xl border-2 cursor-pointer transition ${
                      formData.paymentMethod === pm.id 
                        ? "border-brand-orange bg-orange-50" 
                        : "border-gray-300 bg-gray-50"
                    }`}
                  >
                    <input 
                      type="radio" 
                      name="paymentMethod"
                      value={pm.id}
                      checked={formData.paymentMethod === pm.id}
                      onChange={e => setFormData({...formData, paymentMethod: e.target.value})}
                      className="mt-1 text-brand-orange focus:ring-brand-orange"
                    />
                    <div>
                      <span className="text-sm font-black text-gray-900 block">{pm.name}</span>
                      <span className="text-xs text-gray-600 font-bold">{pm.desc}</span>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            <button 
              type="submit"
              className="w-full bg-brand-orange hover:bg-brand-orange-hover text-white font-black py-4 px-6 rounded-2xl shadow-xl transition active:scale-98 text-base border-2 border-brand-orange uppercase"
            >
              CONFIRM & PLACE ORDER (Rs. {total.toLocaleString()})
            </button>
          </form>
        </div>

        {/* Right Summary */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white rounded-3xl p-6 shadow-sm border-2 border-gray-200">
            <h3 className="text-base font-black text-gray-900 border-b border-gray-200 pb-3 mb-4">
              Items Summary ({cart.length})
            </h3>

            <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
              {cart.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between text-xs py-1 font-bold">
                  <div className="flex items-center space-x-3">
                    <img src={item.images?.[0]} alt={item.name} className="w-10 h-10 object-cover rounded-lg border border-gray-300" />
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
                  <span>Coupon Discount</span>
                  <span>-Rs. {discountAmount.toLocaleString()}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Delivery Charges</span>
                <span>{shippingFee === 0 ? <strong className="text-green-700">FREE</strong> : `Rs. ${shippingFee}`}</span>
              </div>
              <div className="flex justify-between text-base font-black text-gray-900 pt-3 border-t-2 border-gray-200">
                <span>Total Payable</span>
                <span className="text-brand-orange">Rs. {total.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
