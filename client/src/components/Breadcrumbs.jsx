import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';

const Breadcrumbs = ({ category, customTitle, align = "left" }) => {
  const { pathname } = useLocation();
  const pathnames = pathname.split('/').filter((x) => x);

  const currentCategory = category || pathnames[0];
  const detailsSlug = pathnames[1];
  const isDetailPage = !!customTitle || pathnames.length > 1;

  const handleScroll = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  // পজিশন বা অ্যালাইনমেন্ট হ্যান্ডেল করার জন্য ম্যাপিং
  const alignmentClasses = {
    left: 'justify-start',
    center: 'justify-center',
    right: 'justify-end'
  };

  return (
    <nav 
      className={`flex items-center text-xs md:text-sm text-gray-500 py-2 font-medium ${alignmentClasses[align] || 'justify-start'}`} 
      aria-label="Breadcrumb"
    >
      <ol className="flex items-center space-x-1">
        {/* ১. হোম (HOME) */}
        <li className="flex items-center">
          <Link 
            to="/" 
            onClick={handleScroll}
            className="hover:text-indigo-600 flex items-center transition-colors"
          >
            <Home className="w-3.5 h-3.5 mr-1" />
            <span className="hidden sm:inline">HOME</span>
          </Link>
        </li>

        {/* ২. ক্যাটাগরি (CATEGORY) */}
        {currentCategory && (
          <li className="flex items-center">
            <ChevronRight className="w-4 h-4 text-gray-400" />
            {isDetailPage ? (
              <Link 
                to={`/${currentCategory}`} 
                onClick={handleScroll}
                className="hover:text-indigo-600 capitalize transition-colors px-1"
              >
                {currentCategory.replace(/-/g, ' ')}
              </Link>
            ) : (
              <span className="text-gray-900 font-bold capitalize px-1">
                {currentCategory.replace(/-/g, ' ')}
              </span>
            )}
          </li>
        )}

        {/* ৩. ডিটেইলস (DETAILS) */}
        {isDetailPage && (
          <li className="flex items-center">
            <ChevronRight className="w-4 h-4 text-gray-400" />
            <span className="text-indigo-600 font-bold capitalize truncate max-w-30 md:max-w-30 px-1">
              {customTitle || (detailsSlug && detailsSlug.replace(/-/g, ' '))}
            </span>
          </li>
        )}
      </ol>
    </nav>
  );
};

export default Breadcrumbs;