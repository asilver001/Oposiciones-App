// Storage utility for web (localStorage)
const storage = {
  get: async (key) => {
    try {
      const value = localStorage.getItem(key);
      return { value };
    } catch (e) {
      return { value: null };
    }
  },
  set: async (key, value) => {
    try {
      localStorage.setItem(key, value);
      return true;
    } catch (e) {
      return false;
    }
  },
  remove: async (key) => {
    try {
      localStorage.removeItem(key);
      return true;
    } catch (e) {
      return false;
    }
  }
};

export default storage;
