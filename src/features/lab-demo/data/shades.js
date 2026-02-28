/**
 * VITA Classical Shade Guide
 * Color values are approximations for visual display
 */

export const vitaShades = {
  A: {
    name: 'Reddish-Brown',
    shades: [
      { id: 'A1', name: 'A1', color: '#F5E6D3', description: 'Lightest reddish-brown' },
      { id: 'A2', name: 'A2', color: '#F0DBC4', description: 'Light reddish-brown' },
      { id: 'A3', name: 'A3', color: '#E8CEB0', description: 'Medium reddish-brown' },
      { id: 'A3.5', name: 'A3.5', color: '#E0C19D', description: 'Medium-dark reddish-brown' },
      { id: 'A4', name: 'A4', color: '#D4AD82', description: 'Dark reddish-brown' }
    ]
  },
  B: {
    name: 'Reddish-Yellow',
    shades: [
      { id: 'B1', name: 'B1', color: '#F7ECD8', description: 'Lightest reddish-yellow' },
      { id: 'B2', name: 'B2', color: '#F2E2C7', description: 'Light reddish-yellow' },
      { id: 'B3', name: 'B3', color: '#EBD4AF', description: 'Medium reddish-yellow' },
      { id: 'B4', name: 'B4', color: '#DFC08F', description: 'Dark reddish-yellow' }
    ]
  },
  C: {
    name: 'Grey',
    shades: [
      { id: 'C1', name: 'C1', color: '#EDE5D8', description: 'Lightest grey' },
      { id: 'C2', name: 'C2', color: '#E3D9C8', description: 'Light grey' },
      { id: 'C3', name: 'C3', color: '#D6C9B3', description: 'Medium grey' },
      { id: 'C4', name: 'C4', color: '#C5B596', description: 'Dark grey' }
    ]
  },
  D: {
    name: 'Reddish-Grey',
    shades: [
      { id: 'D2', name: 'D2', color: '#F0E4D3', description: 'Light reddish-grey' },
      { id: 'D3', name: 'D3', color: '#E2D3BC', description: 'Medium reddish-grey' },
      { id: 'D4', name: 'D4', color: '#D0BDA0', description: 'Dark reddish-grey' }
    ]
  }
};

export const stumpShades = [
  { id: 'light', name: 'Light', color: '#F5E6D3' },
  { id: 'medium', name: 'Medium', color: '#E8CEB0' },
  { id: 'dark', name: 'Dark', color: '#C9A97A' },
  { id: 'grey', name: 'Grey', color: '#B5B5A8' }
];

export const getAllShades = () => {
  const all = [];
  Object.values(vitaShades).forEach(family => {
    family.shades.forEach(shade => all.push(shade));
  });
  return all;
};

export const getShadeById = (id) => {
  return getAllShades().find(s => s.id === id);
};

export default vitaShades;
