import {
    IconBulbFilled,
    IconCheck,
    IconTrash,
    IconX,
} from '@tabler/icons-react';
import {
    useEffect,
    useState,
} from 'react';

import { PromptModal } from './PromptModal';

import SidebarActionButton from '@/components/Button/SidebarActionButton';

export const Prompt = ({ prompt, handleUpdatePrompt, handleDeletePrompt }) => {

    const [showModal, setShowModal] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [isRenaming, setIsRenaming] = useState(false);
    const [renameValue, setRenameValue] = useState('');

    const handleDelete = (e) => { 
        e.stopPropagation();

        if (isDeleting) {
          handleDeletePrompt(prompt);
        }
    
        setIsDeleting(false);
    }

    const handleCancelDelete = (e) => { 
        e.stopPropagation();
        setIsDeleting(false);
    }
    
    const handleOpenDeleteModal = (e) => { 
        e.stopPropagation();
        setIsDeleting(true);
    }


    useEffect(() => {
        if (isRenaming) {
            setIsDeleting(false);
        } else if (isDeleting) {
            setIsRenaming(false);
        }
    }, [isRenaming, isDeleting]);

    return (
        <div className="relative flex items-center">
            <button
                className="flex w-full cursor-pointer items-center gap-3 rounded-lg p-3 text-sm transition-colors duration-200 hover:bg-[#343541]/90"
                onClick={(e) => {
                    e.stopPropagation();
                    setShowModal(true);
                }}
                onMouseLeave={() => {
                    setIsDeleting(false);
                    setIsRenaming(false);
                    setRenameValue('');
                }}
            >
                <IconBulbFilled size={18} />
    
                <div className="relative max-h-5 flex-1 overflow-hidden text-ellipsis whitespace-nowrap break-all pr-4 text-left text-[12.5px] leading-3">
                    {prompt.name}
                </div>
            </button>
        
            {(isDeleting || isRenaming) && (
                <div className="absolute right-1 z-10 flex text-gray-300">
                    <SidebarActionButton handleClick={handleDelete}>
                        <IconCheck size={18} />
                    </SidebarActionButton>
            
                    <SidebarActionButton handleClick={handleCancelDelete}>
                        <IconX size={18} />
                    </SidebarActionButton>
                </div>
            )}
    
            {!isDeleting && !isRenaming && (
                <div className="absolute right-1 z-10 flex text-gray-300">
                    <SidebarActionButton handleClick={handleOpenDeleteModal}>
                        <IconTrash size={18} />
                    </SidebarActionButton>
                </div>
            )}
    
            {showModal && (
                <PromptModal
                    prompt={prompt}
                    onClose={() => setShowModal(false)}
                    onUpdatePrompt={handleUpdatePrompt}
                />
            )}
        </div>
    );
};