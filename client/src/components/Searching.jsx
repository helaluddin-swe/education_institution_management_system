import { Search } from "lucide-react";
import { useEffect, useState } from "react";

const Searching = ({ setDisplayData, data }) => {
    const [input, setInput] = useState("");
    useEffect(() => {
        const filteredDataFn = setTimeout(() => {
            const filter = data.filter((f) => {
                const searchTerm = input.toLowerCase();
                const matchesTitle = f.title.toLowerCase().includes(searchTerm);
                const matchesCategory = f.category.toLowerCase().includes(searchTerm);

                // Check tags (returns true if at least one tag matches)
                const matchesTags = f.tags.some((t) =>
                    t.toLowerCase().includes(searchTerm)
                );

                return matchesTitle || matchesCategory || matchesTags;
            });
            setDisplayData(filter);
        }, 300);
        return () => clearTimeout(filteredDataFn);
    }, [input, data, setDisplayData]);

    return (

        <header className="flex flex-col md:flex-row items-center justify-center py-4 px-4 gap-6 ">
            
          

            {/* Search Bar Wrapper */}
            <div className="relative w-full max-w-md">
             <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
                <input
                    type="text"

                    value={input}
                    onChange={(e) => setInput(e.target.value)}

                    placeholder="বিষয় লিখে সার্চ করুন..."
                    className="w-full pl-14 pr-6 py-5 bg-white border border-slate-200 rounded-2xl shadow-xl shadow-slate-200/40 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                />
               
                

                {/* Clear Button (X) */}
                {input && (
                    <button
                        onClick={() => setInput("")}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                        ✕
                    </button>
                )}
            </div>
        </header>


    )


}

export default Searching;