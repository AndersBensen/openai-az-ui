
import { Prompt } from './Prompt';

export const Prompts = ({ prompts, handleUpdatePrompt, handleDeletePrompt }) => {
    return (
      <div className="flex w-full flex-col gap-1">
        {prompts
          .slice()
          .reverse()
          .map((prompt, index) => (
            <Prompt 
                key={index} 
                prompt={prompt} 
                handleUpdatePrompt={handleUpdatePrompt}
                handleDeletePrompt={handleDeletePrompt}
            />
          ))}
      </div>
    );
  };