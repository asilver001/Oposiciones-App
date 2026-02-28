/**
 * Picto Dent - Demo Dental Practices
 * Realistic London-area dental practices
 */

export const practices = [
  {
    id: 'p1',
    name: 'Wandsworth Dental Care',
    dentist: 'Dr. Sarah Mitchell',
    phone: '020 8874 2345',
    email: 'reception@wandsworthdental.co.uk',
    address: '45 Wandsworth High Street, London SW18 2PT',
    totalOrders: 47
  },
  {
    id: 'p2',
    name: 'Balham Smile Clinic',
    dentist: 'Dr. James Chen',
    phone: '020 8675 8901',
    email: 'bookings@balhamsmile.co.uk',
    address: '12 Balham High Road, London SW12 9AB',
    totalOrders: 38
  },
  {
    id: 'p3',
    name: 'Tooting Broadway Dentists',
    dentist: 'Dr. Priya Patel',
    phone: '020 8767 4521',
    email: 'info@tootingdentists.co.uk',
    address: '89 Tooting High Street, London SW17 0SU',
    totalOrders: 52
  },
  {
    id: 'p4',
    name: 'Wimbledon Village Dental',
    dentist: 'Dr. Michael Thompson',
    phone: '020 8946 7832',
    email: 'appointments@wimbledondental.co.uk',
    address: '23 High Street, Wimbledon Village, London SW19 5BY',
    totalOrders: 65
  },
  {
    id: 'p5',
    name: 'Putney Bridge Dental Practice',
    dentist: 'Dr. Emma Wilson',
    phone: '020 8785 6543',
    email: 'info@putneybridgedental.co.uk',
    address: '156 Putney High Street, London SW15 1RS',
    totalOrders: 41
  },
  {
    id: 'p6',
    name: 'Clapham Common Dentistry',
    dentist: 'Dr. Oliver Brown',
    phone: '020 7622 9876',
    email: 'hello@claphamdentistry.co.uk',
    address: '78 Clapham Common South Side, London SW4 7AA',
    totalOrders: 33
  },
  {
    id: 'p7',
    name: 'Fulham Dental Studio',
    dentist: 'Dr. Sophie Anderson',
    phone: '020 7731 2468',
    email: 'studio@fulhamdental.co.uk',
    address: '201 Fulham Road, London SW10 9PN',
    totalOrders: 29
  },
  {
    id: 'p8',
    name: 'Richmond Park Dental',
    dentist: 'Dr. David Lee',
    phone: '020 8940 1357',
    email: 'contact@richmondparkdental.co.uk',
    address: '34 George Street, Richmond, TW9 1JY',
    totalOrders: 44
  }
];

export const getPracticeById = (id) => practices.find(p => p.id === id);

export const getPracticeByName = (name) => practices.find(p =>
  p.name.toLowerCase().includes(name.toLowerCase())
);

export default practices;
