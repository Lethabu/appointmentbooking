#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

function buildKnowledgeBase() {
  const services = [
    {
      name: 'Wash & Cut',
      duration: 60,
      price: 350,
      description: 'Professional wash, cut and blow-dry',
    },
    {
      name: 'Balayage',
      duration: 120,
      price: 650,
      description: 'Hand-painted highlights for natural look',
    },
    {
      name: 'Hair Treatment',
      duration: 90,
      price: 450,
      description: 'Deep conditioning and repair treatment',
    },
    {
      name: 'Color & Cut',
      duration: 150,
      price: 550,
      description: 'Full color service with cut and style',
    },
  ];

  const kb = services.map((s) => ({
    question: `What is ${s.name}?`,
    answer: `${s.name} is a ${s.duration} min treatment priced at R${s.price}. ${s.description}`,
  }));

  // Ensure kb directory exists
  if (!fs.existsSync('./kb')) {
    fs.mkdirSync('./kb');
  }

  fs.writeFileSync('./kb/instyle_services.json', JSON.stringify(kb, null, 2));
  console.log('✅ Knowledge base built successfully');
}

if (require.main === module) {
  buildKnowledgeBase();
}

module.exports = { buildKnowledgeBase };
