export const getAllLinks = (): HTMLAnchorElement[] => {
  return Array.from(document.getElementsByTagName('a'));
}; 