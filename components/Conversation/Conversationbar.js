import {
    useEffect,
    useState,
} from 'react';

import { Sidebar } from '../Sidebar/Sidebar';
import { Conversations } from './Conversations';
import { DEFAULT_SYSTEM_PROMPT, DEFAULT_TEMPERATURE } from '../../utils/constants'
import { getCurrentDate } from '../../utils/date'

import { v4 as uuidv4 } from 'uuid';
import { ClearConversations } from './ClearConversations';

// todo, add; search, delete & rename conv, delete all convs
export const Conversationbar = ({ 
    conversations, 
    selectedConversation, 
    handleSaveSelectedConversation, 
    handleSaveConversations,
    setSelectedConversation,
    setConversations
}) => {

    const [filteredConversations, setFilteredConversations] = useState([]);

    const handleCreateConversation = () => { 
        const newConversation = {
            id: uuidv4(),
            // name: 'New Conversation',
            name: `New Conversation ${conversations.length + 1}`,
            dateCreated: getCurrentDate(),
            messages: [],
            prompt: DEFAULT_SYSTEM_PROMPT,
            temperature: DEFAULT_TEMPERATURE
        };

        var updatedConversations = [...conversations, newConversation]
        
        handleSaveSelectedConversation(newConversation)
        handleSaveConversations(updatedConversations)
    }

    const handleUpdateConversation = () => {

    }
    
    const handleSearch = () => { 

    }

    return (
        <div>
            <Sidebar
                sidePlacement={"right"}
                createItemTitle={"New chat"}
                items={conversations}
                handleCreateItem={handleCreateConversation}
                handleSearch={handleSearch}
                component={
                    <Conversations
                        conversations={conversations}
                        selectedConversation={selectedConversation}
                        handleSaveConversations={handleSaveConversations}
                        handleSaveSelectedConversation={handleSaveSelectedConversation}
                        handleUpdateConversation={handleUpdateConversation}
                    />
                }
                footerComponent={
                    <ClearConversations 
                        conversations={conversations}
                        setSelectedConversation={setSelectedConversation}
                        setConversations={setConversations}
                    />
                }
            />
        </div>
    )
}