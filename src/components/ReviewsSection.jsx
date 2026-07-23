import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { Star, CheckCircle2, MessageSquare, Plus } from 'lucide-react';

export const ReviewsSection = () => {
  const { reviews, showToast } = useStore();
  const [isSubmitOpen, setIsSubmitOpen] = useState(false);
  const [newReview, setNewReview] = useState({
    customerName: '',
    rating: 5,
    comment: ''
  });

  const handleAddReview = (e) => {
    e.preventDefault();
    if (!newReview.customerName || !newReview.comment) {
      showToast("Please enter your name and review comment", "error");
      return;
    }
    showToast("Thank you! Your feedback has been submitted.");
    setIsSubmitOpen(false);
    setNewReview({ customerName: '', rating: 5, comment: '' });
  };

  return (
    <section className="py-12 sm:py-16 bg-gray-50 border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 pb-4 border-b border-gray-200">
          <div>
            <span className="text-brand-orange text-xs font-bold uppercase tracking-wider">
              Verified Shopper Experience
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mt-1">
              Customer Reviews & Feedback
            </h2>
            <p className="text-xs text-gray-500 mt-1 font-medium">
              Genuine customer experiences and order ratings.
            </p>
          </div>

          <button 
            onClick={() => setIsSubmitOpen(!isSubmitOpen)}
            className="mt-3 sm:mt-0 inline-flex items-center space-x-1.5 bg-brand-orange hover:bg-brand-orange-hover text-white text-xs font-black px-4 py-2.5 rounded-xl shadow transition"
          >
            <Plus className="w-4 h-4" />
            <span>Write a Review</span>
          </button>
        </div>

        {isSubmitOpen && (
          <form onSubmit={handleAddReview} className="bg-white p-6 rounded-3xl border-2 border-brand-orange shadow-md max-w-xl mx-auto mb-8 space-y-3 text-xs font-bold animate-fade-in">
            <h3 className="text-sm font-black text-gray-900">Share Your Shopping Experience</h3>
            <div>
              <label className="block text-gray-700 mb-1">Your Full Name</label>
              <input 
                type="text" 
                required
                value={newReview.customerName}
                onChange={e => setNewReview({...newReview, customerName: e.target.value})}
                placeholder="e.g. Aamir Raza"
                className="w-full p-2.5 bg-gray-50 border border-gray-300 rounded-xl outline-none"
              />
            </div>
            <div>
              <label className="block text-gray-700 mb-1">Star Rating (1 - 5)</label>
              <select 
                value={newReview.rating}
                onChange={e => setNewReview({...newReview, rating: Number(e.target.value)})}
                className="w-full p-2.5 bg-gray-50 border border-gray-300 rounded-xl outline-none"
              >
                <option value={5}>⭐⭐⭐⭐⭐ (5 - Excellent)</option>
                <option value={4}>⭐⭐⭐⭐ (4 - Very Good)</option>
                <option value={3}>⭐⭐⭐ (3 - Average)</option>
              </select>
            </div>
            <div>
              <label className="block text-gray-700 mb-1">Your Honest Review Comment</label>
              <textarea 
                rows={3}
                required
                value={newReview.comment}
                onChange={e => setNewReview({...newReview, comment: e.target.value})}
                placeholder="Write your feedback..."
                className="w-full p-2.5 bg-gray-50 border border-gray-300 rounded-xl outline-none"
              />
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button type="button" onClick={() => setIsSubmitOpen(false)} className="px-4 py-2 bg-gray-100 rounded-xl">Cancel</button>
              <button type="submit" className="px-5 py-2 bg-brand-orange text-white rounded-xl shadow font-black">Submit Review</button>
            </div>
          </form>
        )}

        {reviews.length === 0 ? (
          <div className="bg-white rounded-3xl p-10 text-center border-2 border-gray-200 max-w-xl mx-auto space-y-3">
            <MessageSquare className="w-12 h-12 text-gray-300 mx-auto" />
            <h3 className="text-base font-black text-gray-900">No Customer Reviews Yet</h3>
            <p className="text-xs text-gray-500 font-bold">Be the first customer to leave feedback after receiving your order!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {reviews.map((rev) => (
              <div 
                key={rev.id}
                className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs hover:shadow-md transition-shadow relative flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center space-x-1 text-amber-400 mb-3">
                    {[...Array(rev.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400" />
                    ))}
                  </div>
                  <p className="text-sm text-gray-700 italic leading-relaxed">
                    "{rev.comment}"
                  </p>
                </div>
                <div className="mt-6 pt-4 border-t border-gray-100 flex items-center justify-between">
                  <div>
                    <h4 className="text-xs font-bold text-gray-900 flex items-center space-x-1">
                      <span>{rev.customerName || rev.author}</span>
                      {rev.verified && <CheckCircle2 className="w-3.5 h-3.5 text-blue-500 fill-blue-50" />}
                    </h4>
                    <p className="text-[11px] text-gray-400 mt-0.5">{rev.productName || 'Verified Purchase'}</p>
                  </div>
                  <span className="text-[10px] text-gray-400">{rev.date}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};
