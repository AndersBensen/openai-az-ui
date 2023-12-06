import { useState } from 'react';

import { IconCheck, IconTrash, IconX } from '@tabler/icons-react';

export const ClearConversations = ({conversations, clearConversations}) => {
  const [isConfirming, setIsConfirming] = useState(false);

  // TODO; when we clear all conversations or clear just the last one we actually have to add a new default one as well, otehrwise it bugs out
  // TODO; search in conversations pls
  const handleClearConversations = () => {
    clearConversations()
    setIsConfirming(false);
  };

  return (
    <div className="flex flex-col items-center space-y-1 border-t border-white/20 pt-1 text-sm">
      {conversations.length > 0 ? ( 
        isConfirming ? (
        <div className="flex w-full cursor-pointer items-center rounded-lg py-3 px-3 hover:bg-gray-500/10">
          <IconTrash size={18} />

          <div className="ml-3 flex-1 text-left text-[12.5px] leading-3 text-white">
            {'Are you sure?'}
          </div>

          <div className="flex w-[40px]">
            <IconCheck
              className="ml-auto mr-1 min-w-[20px] text-neutral-400 hover:text-neutral-100"
              size={18}
              onClick={(e) => {
                e.stopPropagation();
                handleClearConversations();
              }}
            />

            <IconX
              className="ml-auto min-w-[20px] text-neutral-400 hover:text-neutral-100"
              size={18}
              onClick={(e) => {
                e.stopPropagation();
                setIsConfirming(false);
              }}
            />
          </div>
        </div>
      ) : (
          <button
            className="flex w-full cursor-pointer select-none items-center gap-3 rounded-md py-3 px-3 text-[14px] leading-3 text-white transition-colors duration-200 hover:bg-gray-500/10"
            onClick={() => setIsConfirming(true)}
          >
            <div><IconTrash size={18} /></div>
            <span>Clear conversations</span>
          </button>
      )
    ) : null }
  </div>
  )
};
