
"use client";

export default function AppDownloadSection() {
  return (
    <section className="py-12 sm:py-16 lg:py-20 px-[5%] text-center">
      <h2 className="text-2xl sm:text-3xl font-bold mb-4">
        Learn Anytime, Anywhere
      </h2>

      <p className="text-gray-400 mb-8">
        Download the CivilEzy app and practice PSC Civil Engineering on the go
      </p>

      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <a
          href="https://play.google.com/store/apps/details?id=com.civilezy.civilezy"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Download CivilEzy on Google Play Store"
          className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-xl transition w-full sm:w-auto"
        >
          📱 Download on Play Store
        </a>

        <a
          href="https://apps.apple.com/us/app/civilezy/id6749293661"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Download CivilEzy on Apple App Store"
          className="bg-gray-800 hover:bg-gray-700 text-white px-6 py-3 rounded-xl transition w-full sm:w-auto"
        >
          🍎 Download on App Store
        </a>
      </div>
    </section>
  );
}