import React from 'react';
import { ChevronDownIcon as IconChevronDown } from '@heroicons/react/20/solid';
import { AgentType } from '../lib/types';

// For reusability, the component should not depend on a global `Agents` constant.
// Instead, it should accept an array of agent objects.
interface Agent {
  type: AgentType;
  name: string;
}

interface AgentSelectorProps {
  id: string;
  label: string;
  agents: Agent[];
  selectedAgent: AgentType;
  onSelectAgent: (agent: AgentType) => void;
  className?: string;
}

// Using a direct function definition is often preferred over React.FC for better type inference.
const AgentSelector = ({
  id,
  label,
  agents,
  selectedAgent,
  onSelectAgent,
  className = '',
}: AgentSelectorProps) => {
  return (
    <div className={`mb-4 ${className}`}>
      <label htmlFor={id} className="block text-sm font-medium text-neutral-700 mb-1">
        {label}
      </label>
      <div className="relative inline-block text-left w-full">
        <div className="rounded-md shadow-sm">
          <select
            id={id}
            name={id} // Good practice for form elements
            value={selectedAgent}
            onChange={(e) => onSelectAgent(e.target.value as AgentType)}
            className="block w-full pl-3 pr-10 py-2 text-base border-neutral-300 focus:outline-none focus:ring-primary focus:border-primary-dark sm:text-sm rounded-md appearance-none bg-white"
          >
            {agents.map((agent) => (
              <option key={agent.type} value={agent.type}>
                {agent.name}
              </option>
            ))}
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-neutral-700">
            <IconChevronDown className="h-5 w-5" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AgentSelector;
