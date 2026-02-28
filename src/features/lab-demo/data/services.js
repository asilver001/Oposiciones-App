/**
 * Picto Dent - Service Catalogue
 * Complete list of dental lab services with pricing and turnaround times
 */

export const services = [
  // Crowns
  {
    id: 'zirconia-full',
    name: 'Zirconia Crown (Full Anatomy / Monolithic)',
    category: 'crown',
    material: 'Zirconia',
    description: 'CAD/CAM milled full-contour zirconia crown. Excellent strength and aesthetics.',
    estimated_days: 5,
    price_range_low: 85,
    price_range_high: 120,
    requires_shade: true,
    requires_stump_shade: true
  },
  {
    id: 'zirconia-layered',
    name: 'Zirconia Crown (Layered / Cut-back)',
    category: 'crown',
    material: 'Zirconia',
    description: 'Zirconia coping with porcelain layering for superior aesthetics in anterior regions.',
    estimated_days: 7,
    price_range_low: 120,
    price_range_high: 160,
    requires_shade: true,
    requires_stump_shade: true
  },
  {
    id: 'emax-crown',
    name: 'E-max Crown',
    category: 'crown',
    material: 'Lithium Disilicate',
    description: 'IPS e.max lithium disilicate crown. Premium aesthetics with excellent translucency.',
    estimated_days: 5,
    price_range_low: 95,
    price_range_high: 130,
    requires_shade: true,
    requires_stump_shade: true
  },
  {
    id: 'emax-veneer',
    name: 'E-max Veneers',
    category: 'veneer',
    material: 'Lithium Disilicate',
    description: 'Ultra-thin e.max veneers for smile makeovers. Minimally invasive preparation.',
    estimated_days: 7,
    price_range_low: 110,
    price_range_high: 150,
    requires_shade: true,
    requires_stump_shade: false
  },
  {
    id: 'pfm-crown',
    name: 'PFM Crown (Porcelain Fused to Metal)',
    category: 'crown',
    material: 'Metal + Porcelain',
    description: 'Traditional porcelain-fused-to-metal crown. Cost-effective with proven durability.',
    estimated_days: 5,
    price_range_low: 65,
    price_range_high: 95,
    requires_shade: true,
    requires_stump_shade: false
  },
  // Bridges
  {
    id: 'zirconia-bridge',
    name: 'Zirconia Bridge',
    category: 'bridge',
    material: 'Zirconia',
    description: 'Full-contour zirconia bridge. Ideal for posterior regions requiring high strength.',
    estimated_days: 7,
    price_range_low: 85,
    price_range_high: 120,
    per_unit: true,
    requires_shade: true,
    requires_stump_shade: true
  },
  {
    id: 'emax-bridge',
    name: 'E-max Bridge',
    category: 'bridge',
    material: 'Lithium Disilicate',
    description: 'E-max bridge for anterior aesthetics. Limited to 3-unit bridges.',
    estimated_days: 7,
    price_range_low: 95,
    price_range_high: 130,
    per_unit: true,
    requires_shade: true,
    requires_stump_shade: true
  },
  {
    id: 'pfm-bridge',
    name: 'PFM Bridge',
    category: 'bridge',
    material: 'Metal + Porcelain',
    description: 'Porcelain-fused-to-metal bridge. Versatile solution for any span length.',
    estimated_days: 7,
    price_range_low: 65,
    price_range_high: 95,
    per_unit: true,
    requires_shade: true,
    requires_stump_shade: false
  },
  // Inlays/Onlays
  {
    id: 'inlay-zirconia',
    name: 'Inlay / Onlay (Zirconia)',
    category: 'inlay',
    material: 'Zirconia',
    description: 'CAD/CAM milled zirconia inlay or onlay. Excellent for posterior restorations.',
    estimated_days: 5,
    price_range_low: 75,
    price_range_high: 100,
    requires_shade: true,
    requires_stump_shade: false
  },
  {
    id: 'inlay-emax',
    name: 'Inlay / Onlay (E-max)',
    category: 'inlay',
    material: 'Lithium Disilicate',
    description: 'E-max inlay or onlay with superior aesthetics for visible restorations.',
    estimated_days: 5,
    price_range_low: 85,
    price_range_high: 110,
    requires_shade: true,
    requires_stump_shade: false
  },
  // Implant Work
  {
    id: 'implant-crown',
    name: 'Implant Crown',
    category: 'implant',
    material: 'Zirconia / E-max',
    description: 'Screw-retained or cement-retained implant crown. Specify implant system.',
    estimated_days: 7,
    price_range_low: 120,
    price_range_high: 180,
    requires_shade: true,
    requires_stump_shade: false,
    requires_implant_system: true
  },
  {
    id: 'implant-bridge',
    name: 'Implant Bridge',
    category: 'implant',
    material: 'Zirconia / Titanium',
    description: 'Multi-unit implant-supported bridge. Custom abutments included.',
    estimated_days: 10,
    price_range_low: 150,
    price_range_high: 220,
    per_unit: true,
    requires_shade: true,
    requires_stump_shade: false,
    requires_implant_system: true
  },
  // Custom
  {
    id: 'custom',
    name: 'Custom / Other',
    category: 'custom',
    material: 'Various',
    description: 'Special cases, complex restorations, or services not listed above.',
    estimated_days: null,
    price_range_low: null,
    price_range_high: null,
    requires_shade: true,
    requires_stump_shade: false
  }
];

export const implantSystems = [
  { id: 'straumann', name: 'Straumann' },
  { id: 'nobel', name: 'Nobel Biocare' },
  { id: 'astra', name: 'Astra Tech' },
  { id: 'biohorizons', name: 'BioHorizons' },
  { id: 'megagen', name: 'Megagen' },
  { id: 'neodent', name: 'Neodent' },
  { id: 'other', name: 'Other (specify in notes)' }
];

export const deliveryMethods = [
  { id: 'collection', name: 'Collection from Lab', description: 'Pick up from our Wimbledon location' },
  { id: 'courier', name: 'Courier Delivery', description: 'Next-day delivery to your practice' },
  { id: 'royal-mail', name: 'Royal Mail Special Delivery', description: 'Tracked delivery by 1pm' }
];

export const getServiceById = (id) => services.find(s => s.id === id);

export const getServicesByCategory = (category) => services.filter(s => s.category === category);

export default services;
