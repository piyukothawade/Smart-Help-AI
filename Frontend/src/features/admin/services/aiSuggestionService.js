
const getMockSuggestions = async () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        "We are checking your issue.",
        "Please try again after logout.",
        "Our team will resolve this shortly.",
      ]);
    }, 500);
  });
};

export const getSuggestions = () => getMockSuggestions();