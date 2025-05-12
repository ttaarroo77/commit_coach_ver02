import type * as React from "react"

function GitHubIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M9 19c-4.3 1.4-4.3-2.5-6-3m12 5v-3.5c0-1 .3-1.9 1-2.5-3.2.7-6.6 1-10-.2-2 1-3 3.2-3 5.2m4.5 6H20v-2c-.8-1-1.4-2-1.5-3.2m-4-7.5c-1.4 0-3.1.8-4.5 2.5" />
      <path d="M12 2a10 10 0 0 0-8 8c0 3.2 2 5 5.5 5.5l.9-.3c.6-.2 1.1-.8 1.3-1.4l.3-.9c.3-.8 1.5-1.3 2.3-.8 1 0 1.7 2 1.5 3l-.5 2.5c-.3 1.5 1 3 2.5 1.5 1.2-1.2 1.5-3 1-4.5l-.8-1c-.5-.5-.5-1.5 0-2l1.5-1.5c1.5-1.5 1.5-3.5 0-5a3 3 0 0 0-5-1.5z" />
    </svg>
  )
}

export { GitHubIcon }
