import { Conversation } from './Conversation';

export const Conversations = ({ 
    conversations, 
    selectedConversation, 
    handleSaveConversations, 
    handleSaveSelectedConversation, 
    handleClearConversation
 }) => {

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
                        conversations={conversations}
                        handleSaveConversations={handleSaveConversations}
                        handleSaveSelectedConversation={handleSaveSelectedConversation}
                        handleClearConversation={handleClearConversation}
                    />
            ))}
        </div>
    );
};
