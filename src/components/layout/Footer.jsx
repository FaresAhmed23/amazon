import React from "react";

function Footer() {
  return (
    <div className=" bg-white">
      {/* Back to Top */}
      <a
        href="#head"
        className="bg-[#37475a] text-white text-center py-4 sm:py-5 cursor-pointer hover:bg-[#485769] transition-colors relative z-10 w-full"
      >
        <div className="inline-block py-2 px-4">
          <span className="text-sm sm:text-base lg:text-lg">Back to Top</span>
        </div>
      </a>

      <footer className="bg-[#232f3e] text-white relative z-10">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 py-8 sm:py-10 lg:py-12">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-10 lg:gap-12">
            {/* Get to Know Us */}
            <div>
              <h4 className="font-semibold text-base sm:text-lg lg:text-xl mb-4 sm:mb-6">
                Get to Know Us
              </h4>
              <ul className="space-y-3 text-sm sm:text-base">
                {[
                  "About Us",
                  "Careers",
                  "Press Releases",
                  "Amazon Science",
                ].map((item) => (
                  <li key={item}>
                    <a
                      href="#"
                      className="hover:underline hover:text-gray-300 transition-colors"
                    >
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Connect with Us */}
            <div>
              <h4 className="font-semibold text-base sm:text-lg lg:text-xl mb-4 sm:mb-6">
                Connect with Us
              </h4>
              <ul className="space-y-3 text-sm sm:text-base">
                {["Facebook", "Twitter", "Instagram"].map((item) => (
                  <li key={item}>
                    <a
                      href="#"
                      className="hover:underline hover:text-gray-300 transition-colors"
                    >
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Make Money with Us */}
            <div>
              <h4 className="font-semibold text-base sm:text-lg lg:text-xl mb-4 sm:mb-6">
                Make Money with Us
              </h4>
              <ul className="space-y-3 text-sm sm:text-base">
                {[
                  "Sell on Amazon",
                  "Sell under Amazon Accelerator",
                  "Protect and Build Your Brand",
                  "Amazon Global Selling",
                  "Supply to Amazon",
                  "Become an Affiliate",
                  "Fulfilment by Amazon",
                  "Advertise Your Products",
                  "Amazon Pay on Merchants",
                ].map((item) => (
                  <li key={item}>
                    <a
                      href="#"
                      className="hover:underline hover:text-gray-300 transition-colors"
                    >
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Let Us Help You */}
            <div>
              <h4 className="font-semibold text-base sm:text-lg lg:text-xl mb-4 sm:mb-6">
                Let Us Help You
              </h4>
              <ul className="space-y-3 text-sm sm:text-base">
                {[
                  "Your Account",
                  "Returns Centre",
                  "Recalls and Product Safety Alerts",
                  "100% Purchase Protection",
                  "Amazon App Download",
                  "Help",
                ].map((item) => (
                  <li key={item}>
                    <a
                      href="#"
                      className="hover:underline hover:text-gray-300 transition-colors"
                    >
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-600 mt-8 sm:mt-10 lg:mt-12 pt-8 sm:pt-10 lg:pt-12">
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-8 lg:gap-12 mb-6 sm:mb-8">
              <div className="flex items-center gap-2">
                <img
                  src="/images/Amazon.png"
                  alt="Amazon"
                  className="h-8 sm:h-10 w-auto"
                />
              </div>
              <div className="flex items-center gap-2 text-sm sm:text-base hover:text-gray-300 transition-colors cursor-pointer">
                <span>🇺🇸 English</span>
              </div>
              <div className="flex items-center gap-2 text-sm sm:text-base hover:text-gray-300 transition-colors cursor-pointer">
                <span>🇮🇳 India</span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 text-xs sm:text-sm text-gray-300 mb-8">
              {[
                { title: "AbeBooks", desc: "Books, art & collectibles" },
                {
                  title: "Amazon Web Services",
                  desc: "Scalable Cloud Computing Services",
                },
                { title: "Audible", desc: "Download Audio Books" },
                { title: "IMDb", desc: "Movies, TV & Celebrities" },
                { title: "Shopbop", desc: "Designer Fashion Brands" },
                {
                  title: "Amazon Business",
                  desc: "Everything For Your Business",
                },
                {
                  title: "Prime Now",
                  desc: "2-Hour Delivery on Everyday Items",
                },
                {
                  title: "Amazon Prime Music",
                  desc: "100 million songs, ad-free Over 15 million podcast episodes",
                },
              ].map((item, index) => (
                <div
                  key={index}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  <h5 className="font-semibold mb-2">{item.title}</h5>
                  <p className="leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>

            <div className="text-center text-xs sm:text-sm text-gray-400 space-y-2">
              <p>
                Conditions of Use & Sale &nbsp;&nbsp; Privacy Notice
                &nbsp;&nbsp; Interest-Based Ads
              </p>
              <p>© 1996-2024, Amazon.com, Inc. or its affiliates</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Footer;
