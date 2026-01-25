// Storage wrapper compatible con la API usada en el componente
// Usa localStorage como backend

const storage = {
  async get(key) {
    try {
      const value = localStorage.getItem(key);
      return { value };
    } catch (error) {
      console.error('Error reading from storage:', error);
      return { value: null };
    }
  },

  async set(key, value) {
    try {
      localStorage.setItem(key, value);
      return true;
    } catch (error) {
      console.error('Error writing to storage:', error);
      return false;
    }
  },

  async remove(key) {
    try {
      localStorage.removeItem(key);
      return true;
    } catch (error) {
      console.error('Error removing from storage:', error);
      return false;
    }
  }
};

// Hacer disponible globalmente
window.storage = storage;

export default storage;
