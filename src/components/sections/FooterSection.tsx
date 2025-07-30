export function FooterSection() {
  return (
    <footer className="bg-black bg-footer border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-7 py-8">
        <div className="flex flex-col">
          {/* <!-- Main Footer Content --> */}
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center space-y-6 lg:space-y-0 gap-5">
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
              <div className="flex flex-wrap gap-2 mb-6">
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
            <div className="flex items-center space-x-6">
              <a
                href="#"
                className="text-gray-300 hover:text-white text-sm transition-colors">
                REQUEST
              </a>
              <a
                href="contact.html"
                className="text-gray-300 hover:text-white text-sm transition-colors">
                CONTACT US
              </a>
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
              <div className="flex items-center space-x-4">
                <span className="text-gray-500 text-xs">Socials:</span>
                <div className="flex items-center space-x-3">
                  <a
                    href="#"
                    className="text-gray-500 hover:text-white transition-colors">
                    <i className="text-sm" data-fa-i2svg="">
                      <svg
                        className="svg-inline--fa fa-twitter"
                        aria-hidden="true"
                        focusable="false"
                        data-prefix="fab"
                        data-icon="twitter"
                        role="img"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 512 512"
                        data-fa-i2svg="">
                        <path
                          fill="currentColor"
                          d="M459.37 151.716c.325 4.548.325 9.097.325 13.645 0 138.72-105.583 298.558-298.558 298.558-59.452 0-114.68-17.219-161.137-47.106 8.447.974 16.568 1.299 25.34 1.299 49.055 0 94.213-16.568 130.274-44.832-46.132-.975-84.792-31.188-98.112-72.772 6.498.974 12.995 1.624 19.818 1.624 9.421 0 18.843-1.3 27.614-3.573-48.081-9.747-84.143-51.98-84.143-102.985v-1.299c13.969 7.797 30.214 12.67 47.431 13.319-28.264-18.843-46.781-51.005-46.781-87.391 0-19.492 5.197-37.36 14.294-52.954 51.655 63.675 129.3 105.258 216.365 109.807-1.624-7.797-2.599-15.918-2.599-24.04 0-57.828 46.782-104.934 104.934-104.934 30.213 0 57.502 12.67 76.67 33.137 23.715-4.548 46.456-13.32 66.599-25.34-7.798 24.366-24.366 44.833-46.132 57.827 21.117-2.273 41.584-8.122 60.426-16.243-14.292 20.791-32.161 39.308-52.628 54.253z"></path>
                      </svg>
                    </i>
                  </a>
                  <a
                    href="#"
                    className="text-gray-500 hover:text-white transition-colors">
                    <i className="text-sm" data-fa-i2svg="">
                      <svg
                        className="svg-inline--fa fa-discord"
                        aria-hidden="true"
                        focusable="false"
                        data-prefix="fab"
                        data-icon="discord"
                        role="img"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 640 512"
                        data-fa-i2svg="">
                        <path
                          fill="currentColor"
                          d="M524.531,69.836a1.5,1.5,0,0,0-.764-.7A485.065,485.065,0,0,0,404.081,32.03a1.816,1.816,0,0,0-1.923.91,337.461,337.461,0,0,0-14.9,30.6,447.848,447.848,0,0,0-134.426,0,309.541,309.541,0,0,0-15.135-30.6,1.89,1.89,0,0,0-1.924-.91A483.689,483.689,0,0,0,116.085,69.137a1.712,1.712,0,0,0-.788.676C39.068,183.651,18.186,294.69,28.43,404.354a2.016,2.016,0,0,0,.765,1.375A487.666,487.666,0,0,0,176.02,479.918a1.9,1.9,0,0,0,2.063-.676A348.2,348.2,0,0,0,208.12,430.4a1.86,1.86,0,0,0-1.019-2.588,321.173,321.173,0,0,1-45.868-21.853,1.885,1.885,0,0,1-.185-3.126c3.082-2.309,6.166-4.711,9.109-7.137a1.819,1.819,0,0,1,1.9-.256c96.229,43.917,200.41,43.917,295.5,0a1.812,1.812,0,0,1,1.924.233c2.944,2.426,6.027,4.851,9.132,7.16a1.884,1.884,0,0,1-.162,3.126,301.407,301.407,0,0,1-45.89,21.83,1.875,1.875,0,0,0-1,2.611,391.055,391.055,0,0,0,30.014,48.815,1.864,1.864,0,0,0,2.063.7A486.048,486.048,0,0,0,610.7,405.729a1.882,1.882,0,0,0,.765-1.352C623.729,277.594,590.933,167.465,524.531,69.836ZM222.491,337.58c-28.972,0-52.844-26.587-52.844-59.239S193.056,219.1,222.491,219.1c29.665,0,53.306,26.82,52.843,59.239C275.334,310.993,251.924,337.58,222.491,337.58Zm195.38,0c-28.971,0-52.843-26.587-52.843-59.239S388.437,219.1,417.871,219.1c29.667,0,53.307,26.82,52.844,59.239C470.715,310.993,447.538,337.58,417.871,337.58Z"></path>
                      </svg>
                    </i>
                  </a>
                  <a
                    href="#"
                    className="text-gray-500 hover:text-white transition-colors">
                    <i className="text-sm" data-fa-i2svg="">
                      <svg
                        className="svg-inline--fa fa-reddit"
                        aria-hidden="true"
                        focusable="false"
                        data-prefix="fab"
                        data-icon="reddit"
                        role="img"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 512 512"
                        data-fa-i2svg="">
                        <path
                          fill="currentColor"
                          d="M201.5 305.5c-13.8 0-24.9-11.1-24.9-24.6 0-13.8 11.1-24.9 24.9-24.9 13.6 0 24.6 11.1 24.6 24.9 0 13.6-11.1 24.6-24.6 24.6zM504 256c0 137-111 248-248 248S8 393 8 256 119 8 256 8s248 111 248 248zm-132.3-41.2c-9.4 0-17.7 3.9-23.8 10-22.4-15.5-52.6-25.5-86.1-26.6l17.4-78.3 55.4 12.5c0 13.6 11.1 24.6 24.6 24.6 13.8 0 24.9-11.3 24.9-24.9s-11.1-24.9-24.9-24.9c-9.7 0-18 5.8-22.1 13.8l-61.2-13.6c-3-.8-6.1 1.4-6.9 4.4l-19.1 86.4c-33.2 1.4-63.1 11.3-85.5 26.8-6.1-6.4-14.7-10.2-24.1-10.2-34.9 0-46.3 46.9-14.4 62.8-1.1 5-1.7 10.2-1.7 15.5 0 52.6 59.2 95.2 132 95.2 73.1 0 132.3-42.6 132.3-95.2 0-5.3-.6-10.8-1.9-15.8 31.3-16 19.8-62.5-14.9-62.5zM302.8 331c-18.2 18.2-76.1 17.9-93.6 0-2.2-2.2-6.1-2.2-8.3 0-2.5 2.5-2.5 6.4 0 8.6 22.8 22.8 87.3 22.8 110.2 0 2.5-2.2 2.5-6.1 0-8.6-2.2-2.2-6.1-2.2-8.3 0zm7.7-75c-13.6 0-24.6 11.1-24.6 24.9 0 13.6 11.1 24.6 24.6 24.6 13.8 0 24.9-11.1 24.9-24.6 0-13.8-11-24.9-24.9-24.9z"></path>
                      </svg>
                    </i>
                  </a>
                </div>
              </div>
            </div>

            {/* <!-- Right: Logo --> */}
            <div className="flex items-center">
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
