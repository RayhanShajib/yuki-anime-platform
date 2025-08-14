"use client";

import Link from "next/link";
import { useState } from "react";
import { RequestModal } from "../modals/RequestModal";

export function FooterSection() {
  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);
  return (
    <footer className="bg-black bg-footer border-t border-gray-800">
      <div
        className="max-w-7xl mx-auto px-7 py-8 footer-section"
        suppressHydrationWarning={true}>
        <div className="flex flex-col" suppressHydrationWarning={true}>
          {/* <!-- Main Footer Content --> */}
          <div
            className="flex flex-col lg:flex-row justify-between items-start lg:items-center space-y-6 lg:space-y-0 gap-5 mb-5"
            suppressHydrationWarning={true}>
            {/* <!-- Left Side: A-Z List --> */}
            <div className="flex-1" suppressHydrationWarning={true}>
              <div className="mb-4" suppressHydrationWarning={true}>
                <h3 className="text-white text-lg font-semibold mb-2">
                  A-Z List
                  <span className="text-gray-300 text-sm font-normal ml-2">
                    Searching anime order by alphabet name A to Z.
                  </span>
                </h3>
              </div>

              {/* <!-- Alphabet Navigation --> */}
              <div
                className="flex flex-wrap gap-2 footer-content-center"
                suppressHydrationWarning={true}>
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
            <div
              className="flex items-center space-x-6 footer-content-center"
              suppressHydrationWarning={true}>
              <button
                onClick={() => setIsRequestModalOpen(true)}
                className="text-gray-300 hover:text-white text-sm transition-colors">
                REQUEST
              </button>
              <Link
                href="/contact"
                className="text-gray-300 hover:text-white text-sm transition-colors">
                CONTACT US
              </Link>
            </div>
          </div>

          {/* <!-- Bottom Section --> */}
          <div
            className="flex flex-col lg:flex-row justify-between items-start lg:items-center pt-6 border-t border-gray-800 space-y-4 lg:space-y-0"
            suppressHydrationWarning={true}>
            {/* <!-- Left: Copyright and Legal --> */}
            <div className="flex-1" suppressHydrationWarning={true}>
              <p className="text-gray-300 text-sm mb-2">
                Copyright ©Yuki. All Rights Reserved
              </p>
              <p className="text-gray-500 text-xs mb-3">
                This site does not store any files on its server. All contents
                are provided by non-affiliated third parties.
              </p>
              <div
                className="flex items-center space-x-4 footer-content-center"
                suppressHydrationWarning={true}>
                <span className="text-gray-500 text-xs">Socials:</span>
                <div
                  className="flex items-center space-x-3"
                  suppressHydrationWarning={true}></div>
              </div>
            </div>

            {/* <!-- Right: Logo --> */}
            <div
              className="flex items-center footer-content-center"
              suppressHydrationWarning={true}>
              <div
                className="flex items-center space-x-2"
                suppressHydrationWarning={true}>
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
          <div className="w-20" suppressHydrationWarning={true}></div>
        </div>
      </div>

      {/* Request Modal */}
      <RequestModal
        open={isRequestModalOpen}
        onOpenChange={setIsRequestModalOpen}
      />
    </footer>
  );
}
