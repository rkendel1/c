// src/utils/user.js

export const getUserType = (user) => {
    if (!user) return null;
    return user.user_type || null;
  };