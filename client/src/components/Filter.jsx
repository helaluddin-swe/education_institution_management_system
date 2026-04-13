import React from 'react';
import { useAppContext } from '../context/AppContext';
import { BCS_Question_List } from '../assets/assest';
import { useParams } from 'react-router-dom';
import QuestionFilter from './QuestionFilter';

const Filter = () => {
    const { setSearchTerm, setSelectedCategory, selectedCategory, searchTerm } = useAppContext();

    // Defined the categories to keep the JSX clean
    const categories = [
        { id: 'Recent Affairs', name: 'Recent Affairs' },
        { id: 'International Affairs', name: 'আন্তর্জাতিক বিষয়াবলি' },
        { id: 'Bangladesh Affairs', name: 'বাংলাদেশ বিষয়াবলি' },
        { id: 'Bangla', name: 'বাংলা ভাষা ও সাহিত্য' },
        { id: 'English', name: 'ইংরেজি ভাষা ও সাহিত্য' },
        { id: 'General Science', name: 'সাধারণ বিজ্ঞান' },
        { id: 'Geography', name: 'ভূগোল, পরিবেশ ও দুর্যোগ ব্যবস্থাপনা' },
        { id: 'Math', name: 'গাণিতিক যুক্তি' },
        { id: 'ICT', name: 'কম্পিউটার ও তথ্যপ্রযুক্তি' },
        { id: 'Mental Ability', name: 'মানসিক দক্ষতা' },
        { id: 'Ethics', name: 'নৈতিকতা, মূল্যবোধ ও সুশাসন' },
    ];

    const handleCategoryClick = (category) => {
        setSelectedCategory(category);
        setSearchTerm(""); // Reset search when switching categories
    };
    const { id } = useParams();
const selectedYearData = BCS_Question_List.find((item) => item._id === id);
const totalQCount = selectedYearData ? selectedYearData.BCS.length : 0;

    return (
        <div className='md:w-1/4 w-full bg-white p-1 h-fit rounded-xl shadow-sm border  md:sticky top-3'>
            {/* Search Box */}
           <QuestionFilter/>

            <div className='space-y-1 text-sm text-gray-600'>
                {/* All Questions Button */}
                <div
                    onClick={() => handleCategoryClick("All")}
                    className={`cursor-pointer p-2 rounded transition-colors ${selectedCategory === "All" && searchTerm === "" ? 'bg-blue-600 text-white' : 'hover:bg-blue-50'}`}
                >
                    সব প্রশ্ন <span className="text-[11px] bg-black/10 px-2 rounded-full">{totalQCount}</span>
                </div>
                </div>

                {/* Dynamic Category List */}
                {categories.map((cat) => (
                    <div
                        key={cat.id}
                        onClick={() => handleCategoryClick(cat.id)}
                        className={`cursor-pointer px-3 py-1 rounded transition-colors ${selectedCategory === cat.id ? 'bg-blue-600 text-white' : 'hover:bg-blue-50'}`}
                    >
                        {cat.name}
                    </div>
                ))}
            </div>
        
    );
};

export default Filter;