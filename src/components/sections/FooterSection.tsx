import Link from "next/link";

export function FooterSection() {
  return (
    <footer className="bg-black bg-footer border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-7 py-8 footer-section">
        <div className="flex flex-col">
          {/* <!-- Main Footer Content --> */}
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center space-y-6 lg:space-y-0 gap-5 mb-5">
            {/* <!-- Left Side: A-Z List --> */}
            <div className="flex-1">
              <div className="mb-4">
                <h3 className="text-white text-lg font-semibold mb-2">
                  A-Z List
                  <span className="text-gray-300 text-sm font-normal ml-2">
                    Searching anime order by alphabet name A to Z.
                  </span>
                </h3>
              </div>

              {/* <!-- Alphabet Navigation --> */}
              <div className="flex flex-wrap gap-2 footer-content-center">
                <button className="bg-gray-800 hover:bg-gray-700 text-white px-3 py-2 rounded text-sm transition-colors">
                  All
                </button>
                <button className="bg-gray-800 hover:bg-gray-700 text-white px-3 py-2 rounded text-sm transition-colors">
                  0-9
                </button>
                <button className="bg-gray-800 hover:bg-gray-700 text-white px-3 py-2 rounded text-sm transition-colors">
                  A
                </button>
                <button className="bg-gray-800 hover:bg-gray-700 text-white px-3 py-2 rounded text-sm transition-colors">
                  B
                </button>
                <button className="bg-gray-800 hover:bg-gray-700 text-white px-3 py-2 rounded text-sm transition-colors">
                  C
                </button>
                <button className="bg-gray-800 hover:bg-gray-700 text-white px-3 py-2 rounded text-sm transition-colors">
                  D
                </button>
                <button className="bg-gray-800 hover:bg-gray-700 text-white px-3 py-2 rounded text-sm transition-colors">
                  E
                </button>
                <button className="bg-gray-800 hover:bg-gray-700 text-white px-3 py-2 rounded text-sm transition-colors">
                  F
                </button>
                <button className="bg-gray-800 hover:bg-gray-700 text-white px-3 py-2 rounded text-sm transition-colors">
                  G
                </button>
                <button className="bg-gray-800 hover:bg-gray-700 text-white px-3 py-2 rounded text-sm transition-colors">
                  H
                </button>
                <button className="bg-gray-800 hover:bg-gray-700 text-white px-3 py-2 rounded text-sm transition-colors">
                  I
                </button>
                <button className="bg-gray-800 hover:bg-gray-700 text-white px-3 py-2 rounded text-sm transition-colors">
                  J
                </button>
                <button className="bg-gray-800 hover:bg-gray-700 text-white px-3 py-2 rounded text-sm transition-colors">
                  K
                </button>
                <button className="bg-gray-800 hover:bg-gray-700 text-white px-3 py-2 rounded text-sm transition-colors">
                  L
                </button>
                <button className="bg-gray-800 hover:bg-gray-700 text-white px-3 py-2 rounded text-sm transition-colors">
                  M
                </button>
                <button className="bg-gray-800 hover:bg-gray-700 text-white px-3 py-2 rounded text-sm transition-colors">
                  N
                </button>
                <button className="bg-gray-800 hover:bg-gray-700 text-white px-3 py-2 rounded text-sm transition-colors">
                  O
                </button>
                <button className="bg-gray-800 hover:bg-gray-700 text-white px-3 py-2 rounded text-sm transition-colors">
                  P
                </button>
                <button className="bg-gray-800 hover:bg-gray-700 text-white px-3 py-2 rounded text-sm transition-colors">
                  Q
                </button>
                <button className="bg-gray-800 hover:bg-gray-700 text-white px-3 py-2 rounded text-sm transition-colors">
                  R
                </button>
                <button className="bg-gray-800 hover:bg-gray-700 text-white px-3 py-2 rounded text-sm transition-colors">
                  S
                </button>
                <button className="bg-gray-800 hover:bg-gray-700 text-white px-3 py-2 rounded text-sm transition-colors">
                  T
                </button>
                <button className="bg-gray-800 hover:bg-gray-700 text-white px-3 py-2 rounded text-sm transition-colors">
                  U
                </button>
                <button className="bg-gray-800 hover:bg-gray-700 text-white px-3 py-2 rounded text-sm transition-colors">
                  V
                </button>
                <button className="bg-gray-800 hover:bg-gray-700 text-white px-3 py-2 rounded text-sm transition-colors">
                  W
                </button>
                <button className="bg-gray-800 hover:bg-gray-700 text-white px-3 py-2 rounded text-sm transition-colors">
                  X
                </button>
                <button className="bg-gray-800 hover:bg-gray-700 text-white px-3 py-2 rounded text-sm transition-colors">
                  Y
                </button>
                <button className="bg-gray-800 hover:bg-gray-700 text-white px-3 py-2 rounded text-sm transition-colors">
                  Z
                </button>
              </div>
            </div>

            {/* <!-- Right Side: Links --> */}
            <div className="flex items-center space-x-6 footer-content-center">
              <a
                href="#"
                className="text-gray-300 hover:text-white text-sm transition-colors">
                REQUEST
              </a>
              <Link
                href="/contact"
                className="text-gray-300 hover:text-white text-sm transition-colors">
                CONTACT US
              </Link>
            </div>
          </div>

          {/* <!-- Bottom Section --> */}
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center pt-6 border-t border-gray-800 space-y-4 lg:space-y-0">
            {/* <!-- Left: Copyright and Legal --> */}
            <div className="flex-1">
              <p className="text-gray-300 text-sm mb-2">
                Copyright ©Yuki. All Rights Reserved
              </p>
              <p className="text-gray-500 text-xs mb-3">
                This site does not store any files on its server. All contents
                are provided by non-affiliated third parties.
              </p>
              <div className="flex items-center space-x-4 footer-content-center">
                <span className="text-gray-500 text-xs">Socials:</span>
                <div className="flex items-center space-x-3"></div>
              </div>
            </div>

            {/* <!-- Right: Logo --> */}
            <div className="flex items-center footer-content-center">
              <div className="flex items-center space-x-2">
                <i className="text-primary-light text-xl" data-fa-i2svg="">
                  <svg
                    className="svg-inline--fa fa-play"
                    aria-hidden="true"
                    focusable="false"
                    data-prefix="fas"
                    data-icon="play"
                    role="img"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 384 512"
                    data-fa-i2svg="">
                    <path
                      fill="currentColor"
                      d="M73 39c-14.8-9.1-33.4-9.4-48.5-.9S0 62.6 0 80V432c0 17.4 9.4 33.4 24.5 41.9s33.7 8.1 48.5-.9L361 297c14.3-8.7 23-24.2 23-41s-8.7-32.2-23-41L73 39z"></path>
                  </svg>
                </i>
                <span className="text-xl font-bold flex items-center gap-2">
                  <span className="text-white">雪</span>{" "}
                  <span className="text-blue-600">Yuki</span>
                </span>
              </div>
            </div>
          </div>

          {/* <!-- 0.8" margin from right edge --> */}
          <div className="w-20"></div>
        </div>
      </div>
    </footer>
  );
}
