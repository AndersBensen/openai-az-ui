import { Sidebar } from '../Sidebar/Sidebar';

export const Conversationbar = ({ conversations }) => {


    const handleCreateConversation = () => { 

        console.log("CREATE CONVERSATION")

    }
    
    const handleSearch = () => { 

    }

    return (
        <Sidebar
            sidePlacement={"right"}
            createItemTitle={"New chat"}
            items={conversations}
            handleCreateItem={handleCreateConversation}
            handleSearch={handleSearch}
        />
    )
}