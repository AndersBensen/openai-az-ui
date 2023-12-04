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
    handleSaveConversations
}) => {

    const [filteredConversations, setFilteredConversations] = useState([]);
    const [searchTerm, setSearchTerm] = useState();

    const handleCreateConversation = () => { 
        const newConversation = {
            id: uuidv4(),
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
    
    const handleClearConversation = () => {
        localStorage.removeItem('conversations')
        localStorage.removeItem('selectedConversation')

        const newConversation = {
            id: uuidv4(),
            name: `New Conversation 1`,
            dateCreated: getCurrentDate(),
            messages: [],
            prompt: DEFAULT_SYSTEM_PROMPT,
            temperature: DEFAULT_TEMPERATURE
        };

        var updatedConversations = [newConversation]

        handleSaveSelectedConversation(newConversation)
        handleSaveConversations(updatedConversations)
    }
    
    useEffect(() => {
        if (searchTerm) {
            const searchedConversations = conversations.filter((conversation) => {
                const searchable =
                    conversation.name.toLowerCase() +
                    ' ' +
                    conversation.messages.map((message) => message.content).join(' ');

                return searchable.includes(searchTerm.toLowerCase());
            });
            setFilteredConversations(searchedConversations)
        } else {
            setFilteredConversations(conversations)
        }
    }, [searchTerm, conversations]);

    return (
        <div>
            <Sidebar
                sidePlacement={"right"}
                createItemTitle={"New chat"}
                items={filteredConversations}
                handleCreateItem={handleCreateConversation}
                handleSearch={setSearchTerm}
                component={
                    <Conversations
                        conversations={filteredConversations}
                        selectedConversation={selectedConversation}
                        handleSaveConversations={handleSaveConversations}
                        handleSaveSelectedConversation={handleSaveSelectedConversation}
                        handleClearConversation={handleClearConversation}
                    />
                }
                searchTerm={searchTerm}
                footerComponent={
                    <ClearConversations 
                        conversations={conversations}
                        clearConversations={handleClearConversation}
                    />
                }
            />
        </div>
    )
}