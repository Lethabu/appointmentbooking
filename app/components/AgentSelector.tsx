import React from 'react';
import { AgentType } from '../../lib/types';
import { Agents } from '../../lib/constants';
import { ChevronDownIcon } from './Icons/ChevronDownIcon';

interface AgentSelectorProps {
  selectedAgent: AgentType;
  onSelectAgent: (agent: AgentType) => void;
}

const AgentSelector: React.FC<AgentSelectorProps> = ({
  selectedAgent,
  onSelectAgent,
}) => {
  return (
    <div className="relative">
      <select
        value={selectedAgent}
        onChange={(e) => onSelectAgent(e.target.value as AgentType)}
        className="appearance-none w-full bg-transparent text-xl font-bold focus:outline-none pr-8 cursor-pointer"
      >
        {Agents.map((agent) => (
          <option key={agent.type} value={agent.type}>
            {agent.name}
          </option>
        ))}
      </select>
      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
        <ChevronDownIcon className="h-5 w-5" />
      </div>
    </div>
  );
};

export default AgentSelector;
