const Footer = () => {
  return (
    <footer className="z-20 w-full bg-gray-900">
      <div className="sm:justify-center-safe mx-auto max-w-7xl px-6 py-12 md:flex md:items-center md:justify-between lg:px-8">
        <div className="flex items-center gap-x-4 md:order-2">
          {/* Text to the left of icons */}
          <p className="text-sm text-yellow-600">
            Follow me on social media and github:
          </p>

          {/* Social Media Icons */}
          <a
            href="https://www.instagram.com/niky.socialmedia"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-400 hover:text-gray-300"
          >
            <span className="sr-only">Instagram</span>
            <img src="/svg/instagram.svg" alt="Instagram" className="h-6 w-6" />
          </a>

          <a
            href="https://github.com/NikyAviator"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-400 hover:text-gray-300"
          >
            <span className="sr-only">GitHub</span>
            <img src="/svg/github.svg" alt="GitHub" className="h-6 w-6" />
          </a>
        </div>

        {/* Copyright Text */}
        <p className="mt-8 text-left text-sm text-yellow-600 md:order-1 md:mt-0">
          &copy; 2026 Made by: NikyAviator. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
