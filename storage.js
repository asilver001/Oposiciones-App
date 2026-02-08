// Storage utility for web (localStorage)
const storage = {
  get: async (key) => {
    try {
      const value = localStorage.getItem(key);
      return { value };
    } catch {
      return { value: null };
    }
  },
  set: async (key, value) => {
    try {
      localStorage.setItem(key, value);
      return true;
    } catch {
      return false;
    }
  },
  remove: async (key) => {
    try {
      localStorage.removeItem(key);
      return true;
    } catch {
      return false;
    }
  }
};

export default storage;
