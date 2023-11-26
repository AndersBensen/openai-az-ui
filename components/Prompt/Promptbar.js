import { Sidebar } from '../Sidebar/Sidebar';
import { Prompts } from './Prompts';

import { v4 as uuidv4 } from 'uuid';


export const Promptbar = ({prompts, setPrompts}) => {

    const handleUpdatePrompts = (updatedPrompts) => {
        
        localStorage.setItem('prompts', JSON.stringify(updatedPrompts));
        setPrompts(updatedPrompts)
    }

    const handleUpdatePrompt = (prompt) => {
        const updatedPrompts = prompts.map((p) => {
            if (p.id === prompt.id) {
                return prompt;
            }
        
            return p;
        });
        
        handleUpdatePrompts(updatedPrompts)
    }

    const handleDeletePrompt = (prompt) => {
        const updatedPrompts = prompts.filter((p) => p.id !== prompt.id);

        handleUpdatePrompts(updatedPrompts)
    };

    const handleCreatePrompt = () => { 
        const newPrompt = {
            id: uuidv4(),
            name: `Prompt ${prompts.length + 1}`,
            description: '',
            content: ''
        }

        const updatedPrompts = [...prompts, newPrompt]
        
        handleUpdatePrompts(updatedPrompts)
    }
    
    const handleSearch = () => { 

    }

    return (
        <Sidebar
            sidePlacement={"right"}
            createItemTitle={"New prompt"}
            items={prompts}
            handleCreateItem={handleCreatePrompt}
            handleSearch={handleSearch}
            component={
                <Prompts
                    prompts={prompts}
                    handleUpdatePrompt={handleUpdatePrompt}
                    handleDeletePrompt={handleDeletePrompt}
                />
            }
        />
    )
}