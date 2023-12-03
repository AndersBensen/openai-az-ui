export const saveSelectedConversation = (selectedConversation) => {
    localStorage.setItem('selectedConversation', JSON.stringify(selectedConversation));
};
  
export const saveConversations = (conversations) => {
    localStorage.setItem('conversations', JSON.stringify(conversations));
};
