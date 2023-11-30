import {
    useEffect,
    useState,
} from 'react';

import { Sidebar } from '../Sidebar/Sidebar';
import { Prompts } from './Prompts';

import { v4 as uuidv4 } from 'uuid';


export const Promptbar = ({prompts, setPrompts}) => {

    const [filteredPrompts, setFilteredPrompts] = useState([]);
    const [searchTerm, setSearchTerm] = useState();

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

    useEffect(() => {
        if (searchTerm) {
            const searchedPrompts = prompts.filter((prompt) => {
                const searchable =
                    prompt.name.toLowerCase() +
                    ' ' +
                    prompt.description.toLowerCase() +
                    ' ' +
                    prompt.content.toLowerCase();

                return searchable.includes(searchTerm.toLowerCase());
            });
            setFilteredPrompts(searchedPrompts)
        } else {
            setFilteredPrompts(prompts)
        }
    }, [searchTerm, prompts]);

    return (
        <Sidebar
            sidePlacement={"right"}
            createItemTitle={"New prompt"}
            items={filteredPrompts}
            handleCreateItem={handleCreatePrompt}
            handleSearch={setSearchTerm}
            component={
                <Prompts
                    prompts={filteredPrompts}
                    handleUpdatePrompt={handleUpdatePrompt}
                    handleDeletePrompt={handleDeletePrompt}
                />
            }
            searchTerm={searchTerm}
        />
    )
}