import { NextRouter } from 'next/router';

export interface Link {
  href: string;
  text: string;
  isExternal: boolean;
}

export const getAllLinks = (): Link[] => {
  const links: Link[] = [];
  const elements = document.querySelectorAll('a');

  elements.forEach(element => {
    const href = element.getAttribute('href');
    if (href) {
      links.push({
        href,
        text: element.textContent || '',
        isExternal: href.startsWith('http') || href.startsWith('//')
      });
    }
  });

  return links;
};

export const validateLink = async (link: Link): Promise<boolean> => {
  if (link.isExternal) {
    return true; // 外部リンクは検証対象外
  }

  try {
    const response = await fetch(link.href, { method: 'HEAD' });
    return response.ok;
  } catch (error) {
    return false;
  }
};

export const validateAllLinks = async (links: Link[]): Promise<{ valid: Link[]; invalid: Link[] }> => {
  const valid: Link[] = [];
  const invalid: Link[] = [];

  for (const link of links) {
    const isValid = await validateLink(link);
    if (isValid) {
      valid.push(link);
    } else {
      invalid.push(link);
    }
  }

  return { valid, invalid };
}; 