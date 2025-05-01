import { useEffect, useState } from 'react';
import { validateAllLinks, Link } from '@/lib/utils/linkValidation';

export const LinkValidator = () => {
  const [invalidLinks, setInvalidLinks] = useState<Link[]>([]);

  useEffect(() => {
    const checkLinks = async () => {
      const links = document.querySelectorAll('a');
      const linkData: Link[] = Array.from(links).map(link => ({
        href: link.getAttribute('href') || '',
        text: link.textContent || '',
        isExternal: link.getAttribute('href')?.startsWith('http') || false
      }));

      const { invalid } = await validateAllLinks(linkData);
      setInvalidLinks(invalid);
    };

    checkLinks();
  }, []);

  if (invalidLinks.length === 0) {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 bg-red-100 p-4 rounded-lg shadow-lg">
      <h3 className="text-red-800 font-bold mb-2">無効なリンクが見つかりました</h3>
      <ul className="list-disc list-inside">
        {invalidLinks.map((link, index) => (
          <li key={index} className="text-red-600">
            {link.text} - {link.href}
          </li>
        ))}
      </ul>
    </div>
  );
}; 