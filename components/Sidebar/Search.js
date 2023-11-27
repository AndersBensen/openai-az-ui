import { IconX } from '@tabler/icons-react';

export const Search = ({ placeholder, searchTerm, onSearch }) => {

    const handleSearchChange = (e) => {
        onSearch(e.target.value);
    };

    const clearSearch = () => {
        onSearch('');
    };

    return (
        <div className="relative flex items-center">
            <input
                className="w-full flex-1 rounded-md border border-neutral-600 bg-[#202123] px-4 py-3 pr-10 text-[14px] leading-3 text-white"
                type="text"
                placeholder={placeholder}
                value={searchTerm}
                onChange={handleSearchChange}
            />

            {searchTerm && (
                <IconX
                className="absolute right-4 cursor-pointer text-neutral-300 hover:text-neutral-400"
                size={18}
                onClick={clearSearch}
                />
            )}
        </div>
    );
};

export default Search;
