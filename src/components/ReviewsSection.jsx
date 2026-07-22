import React from 'react';
import { useStore } from '../context/StoreContext';
import { Star, Quote, CheckCircle2 } from 'lucide-react';

export const ReviewsSection = () => {
  const { reviews } = useStore();

  return (
    <section className="py-12 sm:py-16 bg-gray-50 border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-brand-orange text-xs font-bold uppercase tracking-wider">
            Verified Testimonials
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mt-1">
            What Our Customers Say About Taskeen Store
          </h2>
          <p className="text-sm text-gray-500 mt-2">
            Real feedback from thousands of satisfied shoppers across our fashion, beauty, and skincare lines.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {reviews.map((rev) => (
            <div 
              key={rev.id}
              className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs hover:shadow-md transition-shadow relative flex flex-col justify-between"
            >
              <div>
                {/* Rating Stars */}
                <div className="flex items-center space-x-1 text-amber-400 mb-3">
                  {[...Array(rev.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400" />
                  ))}
                </div>

                {/* Comment */}
                <p className="text-sm text-gray-700 italic leading-relaxed">
                  "{rev.comment}"
                </p>
              </div>

              {/* Customer Info */}
              <div className="mt-6 pt-4 border-t border-gray-100 flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-gray-900 flex items-center space-x-1">
                    <span>{rev.customerName}</span>
                    {rev.verified && <CheckCircle2 className="w-3.5 h-3.5 text-blue-500 fill-blue-50" />}
                  </h4>
                  <p className="text-[11px] text-gray-400 mt-0.5">{rev.productName}</p>
                </div>
                <span className="text-[10px] text-gray-400">{rev.date}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
