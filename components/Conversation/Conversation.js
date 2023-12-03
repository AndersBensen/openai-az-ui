import {
    IconMessage,
    IconCheck,
    IconTrash,
    IconX,
    IconPencil
} from '@tabler/icons-react';

import {
    useEffect,
    useState,
} from 'react';

import SidebarActionButton from '@/components/Button/SidebarActionButton';

export const Conversation = ({ conversation, selectedConversation, conversations, handleSaveConversations, handleSaveSelectedConversation }) => {

    const [isDeleting, setIsDeleting] = useState(false);
    const [isRenaming, setIsRenaming] = useState(false);
    const [renameValue, setRenameValue] = useState('');

    const handleEnterDown = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            selectedConversation && handleRenameConversation(selectedConversation, conversations);
        }
    };

    const handleDeleteConversation = (conversation, conversations) => {
        const updatedConversations = conversations.filter(
            (c) => c.id !== conversation.id,
        );
        
        handleSaveConversations(updatedConversations)
        handleSaveSelectedConversation(updatedConversations[updatedConversations.length - 1])
    }

    const handleRenameConversation = (conversation, conversations) => {
        if (renameValue.trim().length > 0) {
            const updatedConversation = conversation
            updatedConversation.name = renameValue
            const updatedConversations = conversations.map(
                (conversation) => {
                    if (conversation.id === selectedConversation.id) {
                        return updatedConversation;
                    }
                    return conversation;
                },
            );

            handleSaveConversations(updatedConversations)
            handleSaveSelectedConversation(updatedConversation)
            setRenameValue('');
            setIsRenaming(false);
        }
      };
    
    const handleConfirm = (e) => {
        e.stopPropagation();
        if (isDeleting) {
            handleDeleteConversation(conversation, conversations);
        } else if (isRenaming) {
            handleRenameConversation(conversation, conversations);
        }
        setIsDeleting(false);
        setIsRenaming(false);
    };

    const handleCancel = (e) => {
        e.stopPropagation();
        setIsDeleting(false);
        setIsRenaming(false);
    };

    const handleOpenRenameModal = (e) => {
        e.stopPropagation();
        setIsRenaming(true);
        selectedConversation && setRenameValue(selectedConversation.name);
    };

    const handleOpenDeleteModal = (e) => {
        e.stopPropagation();
        setIsDeleting(true);
    };
  
    useEffect(() => {
        if (isRenaming) {
            setIsDeleting(false);
        } else if (isDeleting) {
            setIsRenaming(false);
        }
    }, [isRenaming, isDeleting]);
    
    return (
        <div className="relative flex items-center">
            {isRenaming && selectedConversation?.id === conversation.id ? (
                <div className="flex w-full items-center gap-3 rounded-lg bg-[#343541]/90 p-3">
                    <IconMessage size={18} />
                    <input
                        className="mr-12 flex-1 overflow-hidden overflow-ellipsis border-neutral-400 bg-transparent text-left text-[12.5px] leading-3 text-white outline-none focus:border-neutral-100"
                        type="text"
                        value={renameValue}
                        onChange={(e) => setRenameValue(e.target.value)}
                        onKeyDown={handleEnterDown}
                        autoFocus
                    />
                </div>
            ) : (
                <button
                    className={`flex w-full cursor-pointer items-center gap-3 rounded-lg p-3 text-sm transition-colors duration-200 hover:bg-[#343541]/90 ${
                        selectedConversation?.id === conversation.id
                        ? 'bg-[#343541]/90'
                        : ''
                    }`}
                    onClick={() => handleSaveSelectedConversation(conversation)}
                    draggable="true"
                    onDragStart={(e) => handleDragStart(e, conversation)}
                >
                <IconMessage size={18} />
                <div>
                    <h3
                        className={`relative flex-1 overflow-hidden text-ellipsis whitespace-nowrap break-all text-gray-500 text-left text-[10px] leading-3 pb-1`}
                    >
                        Date Started: {conversation.dateCreated}
                    </h3>
                    <div
                        className={`relative max-h-4 flex-1 overflow-hidden text-ellipsis whitespace-nowrap break-all text-left text-[12.5px] leading-3 ${
                        selectedConversation?.id === conversation.id ? 'pr-12' : 'pr-1'
                        }`}
                    >
                        {conversation.name}
                    </div>
                </div>
                </button>
            )}
    
            {(isDeleting || isRenaming) &&
                selectedConversation?.id === conversation.id && (
                <div className="absolute right-1 z-10 flex text-gray-300">
                    <SidebarActionButton handleClick={handleConfirm}>
                        <IconCheck size={18} />
                    </SidebarActionButton>
                    <SidebarActionButton handleClick={handleCancel}>
                        <IconX size={18} />
                    </SidebarActionButton>
                </div>
            )}
    
            {selectedConversation?.id === conversation.id &&
                !isDeleting &&
                !isRenaming && (
                <div className="absolute right-1 z-10 flex text-gray-300">
                    <SidebarActionButton handleClick={handleOpenRenameModal}>
                        <IconPencil size={18} />
                    </SidebarActionButton>
                    <SidebarActionButton handleClick={handleOpenDeleteModal}>
                        <IconTrash size={18} />
                    </SidebarActionButton>
                </div>
            )}
        </div>
    );

}