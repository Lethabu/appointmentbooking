
import React from 'react';
import { AgentType } from '../types';
import { Agents, IconChevronDown } from '../constants';

interface AgentSelectorProps {
  selectedAgent: AgentType;
  onSelectAgent: (agent: AgentType) => void;
}

const AgentSelector: React.FC<AgentSelectorProps> = ({ selectedAgent, onSelectAgent }) => {
  return (
    <div className="relative inline-block text-left mb-4">
      <div>
        <span className="rounded-md shadow-sm">
          <select
            value={selectedAgent}
            onChange={(e) => onSelectAgent(e.target.value as AgentType)}
            className="block w-full pl-3 pr-10 py-2 text-base leading-6 border-neutral-300 focus:outline-none focus:ring-primary focus:border-primary-dark sm:text-sm sm:leading-5 rounded-md appearance-none bg-white"
          >
            {Agents.map((agent) => (
              <option key={agent.type} value={agent.type}>
                {agent.name}
              </option>
            ))}
          </select>
        </span>
      </div>
       <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-neutral-700">
        <IconChevronDown className="h-5 w-5" />
      </div>
    </div>
  );
};

export default AgentSelector;
