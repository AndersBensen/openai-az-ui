import { IconPlus, IconMistOff } from '@tabler/icons-react';

import { Search } from './Search';

export const Sidebar = ({
    sidePlacement,
    createItemTitle,
    items, 
    handleCreateItem,
    handleSearch,
    component,
    searchTerm,
    footerComponent
}) => {

    return (
            <div
                className={`fixed top-0 ${sidePlacement}-0 z-40 flex h-full w-[260px] flex-none flex-col space-y-2 bg-[#202123] p-2 text-[14px] transition-all sm:relative sm:top-0`}
            >
                <div className="flex items-center">
                    <>
                        <button
                            className="text-sidebar flex w-[244px] flex-shrink-0 cursor-pointer select-none items-center gap-3 rounded-md border border-white/20 p-3 text-white transition-colors duration-200 hover:bg-gray-500/10"
                            onClick={() => {
                                handleCreateItem();
                                handleSearch('');
                            }}
                        >
                            <IconPlus size={16} />
                            {createItemTitle}
                        </button>
                    </>
                </div>

                <Search
                    placeholder={'Search...'}
                    searchTerm={searchTerm}
                    onSearch={handleSearch}
                />

                <div className="flex-grow overflow-auto">
                    {items?.length > 0 ? (
                        <div className="pt-2">
                            {component}
                        </div>
                    ) : (
                    <div className="flex-grow overflow-auto">
                        <div className="mt-8 select-none text-center text-white opacity-50">
                            <IconMistOff className="mx-auto mb-3" />
                            <span className="text-[14px] leading-normal">
                                No data.
                            </span>
                        </div>
                    </div>
                    )}
                </div>
                {footerComponent}
            </div>
    )
}