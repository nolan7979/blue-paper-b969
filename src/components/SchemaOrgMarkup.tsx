// components/SchemaOrgMarkup.tsx
import React from 'react';

const SchemaOrgMarkup: React.FC = () => {
  const schemaMarkup = {
    '@context': 'http://schema.org',
    '@type': '',
    name: 'UniScore',
    description: 'Website for sports news',
    brand: 'Ụnity Group',
    sku: 'SKU12345',
    offers: {
      '@type': 'Offer',
      price: 'USD',
      priceCurrency: 'USD',
      availability: 'http://schema.org/InStock',
    },
  };

  return (
    <script type='application/ld+json'>{JSON.stringify(schemaMarkup)}</script>
  );
};

export default SchemaOrgMarkup;
