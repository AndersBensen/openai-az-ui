import { encryptedStorage } from '../utils/storage'

export const saveSelectedConversation = (selectedConversation) => {
    encryptedStorage.setItem('selectedConversation', selectedConversation);
};
  
export const saveConversations = (conversations) => {
    encryptedStorage.setItem('conversations', conversations);
};
