export const colors = {
  primary: {
    50: '#faf5ff',
    100: '#f3e8ff',
    200: '#e9d5ff',
    300: '#d8b4fe',
    400: '#c084fc',
    500: '#a855f7',
    600: '#9333ea',  // Main purple
    700: '#7e22ce',
    800: '#6b21a8',
    900: '#581c87',
  },

  // Status colors for question progress
  status: {
    nuevo: {
      bg: 'bg-gray-100',
      text: 'text-gray-700',
      border: 'border-gray-300',
      dot: 'bg-gray-400'
    },
    learning: {
      bg: 'bg-blue-100',
      text: 'text-blue-700',
      border: 'border-blue-300',
      dot: 'bg-blue-500'
    },
    review: {
      bg: 'bg-purple-100',
      text: 'text-purple-700',
      border: 'border-purple-300',
      dot: 'bg-purple-500'
    },
    relearning: {
      bg: 'bg-amber-100',
      text: 'text-amber-700',
      border: 'border-amber-300',
      dot: 'bg-amber-500'
    },
    mastered: {
      bg: 'bg-emerald-100',
      text: 'text-emerald-700',
      border: 'border-emerald-300',
      dot: 'bg-emerald-500'
    },
  },

  // Gradient backgrounds
  gradients: {
    purple: 'bg-gradient-to-br from-purple-500 to-purple-700',
    orange: 'bg-gradient-to-br from-orange-400 via-orange-300 to-yellow-400',
  }
};
