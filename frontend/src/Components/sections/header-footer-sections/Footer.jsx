const Footer = () => {
  return (
    // Light: deep slate so it anchors the page. Dark: near-black for contrast.
    <footer className="z-20 w-full bg-slate-800 dark:bg-gray-950">
      <div className="mx-auto max-w-7xl px-6 py-12 md:flex md:items-center md:justify-between lg:px-8">
        {/* ── Right: Social links ── */}
        <div className="flex items-center gap-x-4 md:order-2">
          <p className="text-sm text-yellow-500 dark:text-yellow-400">
            Follow me on social media and GitHub:
          </p>

          <a
            href="https://www.instagram.com/niky.socialmedia"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-400 transition-colors duration-150 hover:text-gray-200"
          >
            <span className="sr-only">Instagram</span>
            <img
              src="/svg/instagram.svg"
              alt="Instagram"
              className="h-6 w-6 opacity-80 hover:opacity-100"
            />
          </a>

          <a
            href="https://github.com/NikyAviator"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-400 transition-colors duration-150 hover:text-gray-200"
          >
            <span className="sr-only">GitHub</span>
            <img
              src="/svg/github.svg"
              alt="GitHub"
              className="h-6 w-6 opacity-80 hover:opacity-100"
            />
          </a>
        </div>

        {/* ── Left: Copyright ── */}
        <p className="mt-8 text-left text-sm text-yellow-500 dark:text-yellow-400 md:order-1 md:mt-0">
          &copy; 2026 Made by: NikyAviator. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
