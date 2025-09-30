const campaigns = {
  'maphondo-monday': {
    platform: 'tiktok',
    content: '💜 Maphondo Monday Special! Book your Maphondo & Lines installation for just R600. Limited slots available! 📅 Book: instylehairboutique.co.za',
    schedule: 'weekly-monday-9am',
    hashtags: ['#MaphondoMonday', '#InStyleHair', '#HairGoals']
  },
  'treatment-tuesday': {
    platform: 'instagram',
    content: '✨ Treatment Tuesday! Give your hair the love it deserves with our Premium Hair Treatment Kit - only R250. Your hair will thank you! 💆‍♀️',
    schedule: 'weekly-tuesday-10am',
    hashtags: ['#TreatmentTuesday', '#HairCare', '#InStyleTreatment']
  },
  'weekend-special': {
    platform: 'whatsapp',
    content: '🎉 Weekend Special Alert! 20% off all styling products. Use code WEEKEND20 at checkout. Valid until Sunday midnight!',
    schedule: 'weekly-friday-6pm',
    target: 'cart-abandoners'
  }
};

function generateCampaignWebhooks() {
  const webhooks = [];
  
  Object.entries(campaigns).forEach(([name, campaign]) => {
    webhooks.push({
      name: `${name}-campaign`,
      url: 'https://instylehairboutique.co.za/api/webhooks/social-post',
      method: 'POST',
      schedule: campaign.schedule,
      payload: {
        tenantId: 'instylehairboutique',
        platform: campaign.platform,
        caption: campaign.content,
        hashtags: campaign.hashtags,
        target: campaign.target
      }
    });
  });

  console.log('🚀 Marketing Campaign Webhooks Generated:');
  webhooks.forEach(webhook => {
    console.log(`   - ${webhook.name}: ${webhook.schedule}`);
  });

  return webhooks;
}

if (require.main === module) {
  generateCampaignWebhooks();
}

module.exports = { campaigns, generateCampaignWebhooks };