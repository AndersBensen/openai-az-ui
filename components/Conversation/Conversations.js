import { Conversation } from './Conversation';

export const Conversations = ({ conversations, selectedConversation, handleSaveSelectedConversation, handleUpdateConversation }) => {

    return (
        <div className="flex w-full flex-col gap-1">
            {conversations
                .slice()
                .reverse()
                .map((conversation, index) => (
                    <Conversation 
                        key={index} 
                        conversation={conversation} 
                        selectedConversation={selectedConversation}
                        handleSaveSelectedConversation={handleSaveSelectedConversation}
                        // handleUpdateConversation={handleUpdateConversation}
                    />
            ))}
        </div>
    );
};
