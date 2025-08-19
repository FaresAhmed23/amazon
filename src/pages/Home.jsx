function Home() {
  return (
    <div className=" bg-white">
      <div id="hero" className="relative z-30 lg:pb-20">
        <div className="h-52 sm:h-64 md:h-80 lg:h-96 xl:h-[28rem] w-full object-cover block items-center justify-center">
          <img
            src="/images/f2fbe9b84327c8c1db6cabbeef327465bbb07fca.jpg"
            alt="Kitchen utensils"
            className="h-full w-full object-cover"
          />
          <div className="max-w-7xl mx-auto px-4 mb-8 mt-0 lg:mt-60"></div>
        </div>

        {/* Promotional Cards Overlay */}
        <div className="static lg:absolute lg:bottom-0 lg:left-0 lg:right-0 lg:transform lg:translate-y-1/2 z-20 lg:absolute lg:bottom-0 lg:left-0 lg:right-0 lg:transform lg:translate-y-1/2">
          <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Card 1 */}
              <div className="bg-white p-4 sm:p-5 lg:p-6 shadow-lg rounded-sm hover:shadow-xl transition-shadow">
                <h3 className="font-semibold text-base sm:text-lg lg:text-xl mb-4">
                  Revamp your home in style
                </h3>
                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div className="text-center">
                    <img
                      src="/images/b0752c3dee0615f35319656454a301384fc0d4da.png"
                      alt="Cushion covers"
                      className="w-full h-20 object-cover mb-1"
                    />
                    <span className="text-xs">
                      Cushion covers, bedsheets & more
                    </span>
                  </div>
                  <div className="text-center">
                    <img
                      src="/images/a38a454dc2a0e0b2e195e0e42acd739af81f67d6.png"
                      alt="Figurines"
                      className="w-full h-20 object-cover mb-1"
                    />
                    <span className="text-xs">Figurines, vases & more</span>
                  </div>
                  <div className="text-center">
                    <img
                      src="/images/6c4e3fbe2fe9060c5ea8d58ce660fbd768da2905.png"
                      alt="Home storage"
                      className="w-full h-20 object-cover mb-1"
                    />
                    <span className="text-xs">Home storage</span>
                  </div>
                  <div className="text-center">
                    <img
                      src="/images/4e0477aa4f5dd4a25a45c18cd98b6c1952c42986.png"
                      alt="Lighting"
                      className="w-full h-20 object-cover mb-1"
                    />
                    <span className="text-xs">Lighting solutions</span>
                  </div>
                </div>
                <a href="#" className="text-blue-600 text-sm">
                  Explore all
                </a>
              </div>

              {/* Card 2 */}
              <div className="bg-white p-4 shadow-md">
                <h3 className="font-semibold text-lg mb-3">
                  Appliances for your home | Up to 55% off
                </h3>
                <div className="grid grid-cols-2 gap-2 mb-3">
                  <div className="text-center">
                    <img
                      src="/images/45f8c8a340b2d725a6e40a4c69a5fd99e0132909.png"
                      alt="Air conditioners"
                      className="w-full h-20 object-cover mb-1"
                    />
                    <span className="text-xs">Air conditioners</span>
                  </div>
                  <div className="text-center">
                    <img
                      src="/images/9f961058d436744c716042ee9b8a08a28466452e.png"
                      alt="Refrigerators"
                      className="w-full h-20 object-cover mb-1"
                    />
                    <span className="text-xs">Refrigerators</span>
                  </div>
                  <div className="text-center">
                    <img
                      src="/images/47f86ab1566c980d681040836993fd5651e02d7b.png"
                      alt="Microwaves"
                      className="w-full h-20 object-cover mb-1"
                    />
                    <span className="text-xs">Microwaves</span>
                  </div>
                  <div className="text-center">
                    <img
                      src="/images/a33be4a8a339812deae723533bc81271dfa1cedb.png"
                      alt="Washing machines"
                      className="w-full h-20 object-cover mb-1"
                    />
                    <span className="text-xs">Washing machines</span>
                  </div>
                </div>
                <a href="#" className="text-blue-600 text-sm">
                  See more
                </a>
              </div>

              {/* Card 3 */}
              <div className="bg-white p-4 shadow-md">
                <h3 className="font-semibold text-lg mb-3">
                  Starting ₹149 | Headphones
                </h3>
                <div className="mb-3">
                  <img
                    src="/images/14ea876d180c5f743a16c3d2d073fb57765f1faf.png"
                    alt="Headphones brands"
                    className="w-full h-32 object-cover mb-2"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2 mb-3">
                  <div className="text-center">
                    <img
                      src="/images/cdaaf97a2638b10fbd39fd591bc89b3a4316706e.png"
                      alt="boAt"
                      className="w-full h-16 object-cover mb-1"
                    />
                    <span className="text-xs">Starting ₹249| boAt</span>
                  </div>
                  <div className="text-center">
                    <img
                      src="/images/a4ac2797a6c3a1c5b43e0d9d9dfa33206bf74409.png"
                      alt="boult"
                      className="w-full h-16 object-cover mb-1"
                    />
                    <span className="text-xs">Starting ₹149| boult</span>
                  </div>
                </div>
                <a href="#" className="text-blue-600 text-sm">
                  See all offers
                </a>
              </div>

              {/* Card 4 */}
              <div className="bg-white p-4 shadow-md">
                <h3 className="font-semibold text-lg mb-3">
                  Starting ₹99 | Amazon Brands & more
                </h3>
                <div className="grid grid-cols-2 gap-2 mb-3">
                  <div className="text-center">
                    <img
                      src="/images/48784c2e18aaaacf9ba03299e4cc09a3ce17a422.png"
                      alt="Storage"
                      className="w-full h-20 object-cover mb-1"
                    />
                    <span className="text-xs">
                      Starting ₹199| Home storage & organization
                    </span>
                  </div>
                  <div className="text-center">
                    <img
                      src="/images/38a872b0340350c3d500d09a3c0f405d19cb69a9.png"
                      alt="Tools"
                      className="w-full h-20 object-cover mb-1"
                    />
                    <span className="text-xs">
                      Up to 60% off | Garage & tools
                    </span>
                  </div>
                  <div className="text-center">
                    <img
                      src="/images/32faf0d962772939829c2a2a13f725d471c98300.png"
                      alt="Hammers"
                      className="w-full h-20 object-cover mb-1"
                    />
                    <span className="text-xs">Starting ₹99| Toys & games</span>
                  </div>
                  <div className="text-center">
                    <img
                      src="/images/eb5794cbc3a5a783f8fa5c16a02401415c252727.png"
                      alt="Kitchen"
                      className="w-full h-20 object-cover mb-1"
                    />
                    <span className="text-xs">
                      Up to 60% off | Kitchen accessories & more
                    </span>
                  </div>
                </div>
                <a href="#" className="text-blue-600 text-sm">
                  Shop now
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 mb-8 mt-60"></div>
      {/* Best Sellers Section */}
      <div id="best" className="max-w-7xl mx-auto px-4 mb-8">
        <div className="bg-white p-4 shadow-md">
          <h2 className="text-xl font-semibold mb-4">
            Best Sellers in Clothing & Accessories
          </h2>
          <div className="flex gap-4 overflow-x-auto pb-4">
            {[
              {
                src: "/images/a14a343b673ec9ef9810027a601f9a7585813a270 (1).png",
                alt: "Socks",
              },
              {
                src: "/images/a14a343b673ec9ef9810027a601f9a7585813a270 (2).png",
                alt: "Red Saree",
              },
              {
                src: "/images/a50000325f1e49368554364ff4e353d991badbd32.png",
                alt: "Purple Kurta",
              },
              {
                src: "/images/a964f199c5473a4a743c8d09ef843ed3399899400.png",
                alt: "Cargo Pants",
              },
              {
                src: "/images/a3151d0f80d1dd705ac59abf5a0bd945ea6dad817.png",
                alt: "Polo Shirt",
              },
              {
                src: "/images/ca2d5a6ef7de47f1752a4ad49d7ccd0f6219d854.png",
                alt: "Blue Shirt",
              },
              {
                src: "/images/c85ecde80ac563af86b2f20ced5767c9c19c02f6.png",
                alt: "Black Jacket",
              },
              {
                src: "/images/a9cd1badbfebaa6c2739b88b644018e45471f872b.png",
                alt: "Brown Dress",
              },
            ].map((item, index) => (
              <div key={index} className="flex-shrink-0 w-40">
                <img
                  src={item.src || "/placeholder.svg"}
                  alt={item.alt}
                  className="w-full h-48 object-cover mb-2"
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Product Sections */}
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 mb-8 sm:mb-10 lg:mb-12 relative z-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5 lg:gap-6">
          {/* Best Sellers in Toys & Games */}
          <div className="bg-white p-4 sm:p-5 lg:p-6 shadow-lg rounded-sm hover:shadow-xl transition-shadow">
            <h3 className="font-semibold text-base sm:text-lg lg:text-xl mb-4">
              Best Sellers in Toys & Games
            </h3>
            <div className="mb-4">
              <img
                src="/images/daa2260acde5b0b7822beb6d782053b8d616fc89 (1).png"
                alt="Toys"
                className="w-full h-28 sm:h-32 lg:h-36 object-cover mb-3 cursor-pointer rounded hover:scale-105 transition-transform"
              />
              <p className="text-sm sm:text-base leading-relaxed mb-2">
                Mario Rechargeable Toys Talking Cactus Baby Toys For Kids
                Dancing Cactus Toy
              </p>
              <p className="text-base sm:text-lg lg:text-xl font-semibold text-red-600">
                ₹319.00
              </p>
            </div>
            <div className="grid grid-cols-3 gap-2 sm:gap-3 mb-6 sm:mb-8">
              <img
                src="/images/949bfd4d6c820fa0ebe174eeb8f4f6d7b8f52f99.png"
                alt="Educational toy"
                className="w-full h-14 sm:h-16 lg:h-20 object-cover rounded cursor-pointer hover:scale-105 transition-transform"
              />
              <img
                src="/images/4506aa7d52952f03215e1c969d390a7f22e0bb8d.png"
                alt="Building blocks"
                className="w-full h-14 sm:h-16 lg:h-20 object-cover rounded cursor-pointer hover:scale-105 transition-transform"
              />
              <img
                src="/images/16da6886b499bab560b701d1bdc44745e33e788a.png"
                alt="Puzzle game"
                className="w-full h-14 sm:h-16 lg:h-20 object-cover rounded cursor-pointer hover:scale-105 transition-transform"
              />
            </div>
            <a
              href="#"
              className="text-blue-600 text-sm hover:underline hover:text-blue-800 transition-colors"
            >
              Explore more
            </a>
          </div>

          {/* Customers' Most-Loved Products */}
          <div className="bg-white p-4 sm:p-5 lg:p-6 shadow-lg rounded-sm hover:shadow-xl transition-shadow">
            <h3 className="font-semibold text-base sm:text-lg lg:text-xl mb-4">
              Customers' Most-Loved Products
            </h3>
            <div className="space-y-4 mb-6 sm:mb-8">
              <img
                src="/images/37c992f2de6a1fcaebe8d5e8c55a171a90e92440.png"
                alt="Coffee mugs"
                className="w-auto h-18 sm:h-20 lg:h-24 object-cover mx-auto cursor-pointer rounded hover:scale-105 transition-transform"
              />
              <img
                src="/images/812d5f26ad5fce1f7087450eb50d861248afb3a7.png"
                alt="Spice rack"
                className="w-auto h-18 sm:h-20 lg:h-24 object-cover mx-auto cursor-pointer rounded hover:scale-105 transition-transform"
              />
              <img
                src="/images/5ed01aba1ac84ae96a1a6dcccbc05273375ea573.png"
                className="w-auto h-18 sm:h-20 lg:h-24 object-cover mx-auto cursor-pointer rounded hover:scale-105 transition-transform"
              />
            </div>
            <a
              href="#"
              className="text-blue-600 text-sm hover:underline hover:text-blue-800 transition-colors"
            >
              Explore more
            </a>
          </div>

          {/* Best Sellers in Beauty */}
          <div className="bg-white p-4 sm:p-5 lg:p-6 shadow-lg rounded-sm hover:shadow-xl transition-shadow">
            <h3 className="font-semibold text-base sm:text-lg lg:text-xl mb-4">
              Best Sellers in Beauty
            </h3>
            <div className="space-y-4 mb-6 sm:mb-8">
              <img
                src="/images/f4c6b121752880f1808e2e090bd123af18927af0.png"
                alt="Sunscreen"
                className="w-auto h-18 sm:h-20 lg:h-24 object-cover mx-auto cursor-pointer rounded hover:scale-105 transition-transform"
              />
              <img
                src="/images/e551c02ad2d1cf2cb4f59f4da8a30f314a16c679.png"
                alt="Face cream"
                className="w-auto h-18 sm:h-20 lg:h-24 object-cover mx-auto cursor-pointer rounded hover:scale-105 transition-transform"
              />
              <img
                src="/images/0d4ba90183bec521b9178c5c12bdd120270dc8bb.png"
                alt="Lipstick"
                className="w-auto h-18 sm:h-20 lg:h-24 object-cover mx-auto cursor-pointer rounded hover:scale-105 transition-transform"
              />
            </div>
            <a
              href="#"
              className="text-blue-600 text-sm hover:underline hover:text-blue-800 transition-colors"
            >
              See more
            </a>
          </div>

          {/* Latest styles */}
          <div className="bg-white p-4 sm:p-5 lg:p-6 shadow-lg rounded-sm hover:shadow-xl transition-shadow">
            <h3 className="font-semibold text-base sm:text-lg lg:text-xl mb-4">
              Latest styles | Dresses, kurta & more | 50% - 80% off
            </h3>
            <div className="grid grid-cols-2 gap-3 mb-6 sm:mb-8">
              <div className="text-center group cursor-pointer">
                <img
                  src="/images/c50ed6f9f0b62bb0bddfa6ad92fc220ece6b75c3.png"
                  alt="Kurta sets"
                  className="w-full h-16 sm:h-20 lg:h-24 object-cover mb-2 cursor-pointer rounded group-hover:scale-105 transition-transform"
                />
                <span className="text-xs">Kurta sets</span>
              </div>
              <div className="text-center group cursor-pointer">
                <img
                  src="/images/72376302a1605ad58034f548d02f06701affd84f.png"
                  alt="Tops"
                  className="w-full h-16 sm:h-20 lg:h-24 object-cover mb-2 cursor-pointer rounded group-hover:scale-105 transition-transform"
                />
                <span className="text-xs">Tops</span>
              </div>
              <div className="text-center group cursor-pointer">
                <img
                  src="/images/eb4e45001cd4816370a00719bfce41ee6a0a575f.png"
                  alt="Dresses"
                  className="w-full h-16 sm:h-20 lg:h-24 object-cover mb-2 cursor-pointer rounded group-hover:scale-105 transition-transform"
                />
                <span className="text-xs">Dresses</span>
              </div>
              <div className="text-center group cursor-pointer">
                <img
                  src="/images/40e95a388b49574c6d6f5acb8f7d4fd9c33f84b6.png"
                  alt="Sarees"
                  className="w-full h-16 sm:h-20 lg:h-24 object-cover mb-2 cursor-pointer rounded group-hover:scale-105 transition-transform"
                />
                <span className="text-xs">Sarees</span>
              </div>
            </div>
            <a href="#" className="text-blue-600 text-sm">
              See more
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
