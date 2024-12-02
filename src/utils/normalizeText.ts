export const normalizeText = (text: string) => {
  return text
    .normalize("NFD") // Decompose characters into base characters and accents
    .replace(/[\u0300-\u036f]/g, "") // Remove accents
    .toLowerCase(); // Convert to lowercase
};
