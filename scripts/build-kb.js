const fs = require('fs');
const path = require('path');

function buildInStyleKnowledgeBase() {
  const services = [
    {
      name: "Middle & Side Installation",
      duration: "60 minutes",
      price: "R450",
      description: "Professional installation of middle and side part weaves for a natural, elegant look."
    },
    {
      name: "Maphondo & Lines Installation", 
      duration: "90 minutes",
      price: "R600",
      description: "Intricate Maphondo and lines installation creating stunning geometric patterns."
    },
    {
      name: "Hair Treatment",
      duration: "30 minutes", 
      price: "R250",
      description: "Rejuvenating hair treatment to restore health, shine and vitality to your hair."
    }
  ];

  const kb = [
    {
      question: "What services do you offer?",
      answer: "We offer Middle & Side Installation (R450, 60min), Maphondo & Lines Installation (R600, 90min), and Hair Treatment (R250, 30min)."
    },
    {
      question: "How much does a hair treatment cost?",
      answer: "Our hair treatment costs R250 and takes 30 minutes. It's designed to restore health and shine to your hair."
    },
    {
      question: "What is Maphondo installation?",
      answer: "Maphondo & Lines Installation is our signature service creating intricate geometric patterns. It takes 90 minutes and costs R600."
    },
    {
      question: "How long does installation take?",
      answer: "Middle & Side Installation takes 60 minutes, while Maphondo & Lines takes 90 minutes."
    },
    {
      question: "Where are you located?",
      answer: "We're InStyle Hair Boutique, a premium hair salon specializing in professional installations and treatments."
    },
    {
      question: "How do I book an appointment?",
      answer: "You can book online at instylehairboutique.co.za or contact us directly. We'll help you choose the perfect service."
    }
  ];

  // Create kb directory
  const kbDir = path.join(__dirname, '..', 'kb');
  if (!fs.existsSync(kbDir)) {
    fs.mkdirSync(kbDir, { recursive: true });
  }

  // Save knowledge base
  fs.writeFileSync(
    path.join(kbDir, 'instyle_services.json'),
    JSON.stringify({ services, kb }, null, 2)
  );

  console.log('✅ InStyle knowledge base created');
  return { services, kb };
}

if (require.main === module) {
  buildInStyleKnowledgeBase();
}

module.exports = { buildInStyleKnowledgeBase };