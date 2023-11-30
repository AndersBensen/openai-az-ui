export const saveSelectedConversation = (selectedConversation) => {
    console.log("SAVING TIS CONV", {selectedConversation})
    localStorage.setItem('selectedConversation', JSON.stringify(selectedConversation));
};
  
export const saveConversations = (conversations) => {
    localStorage.setItem('conversations', JSON.stringify(conversations));
};
