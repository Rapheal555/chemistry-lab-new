import { useState } from "react";

interface WelcomeScreenProps {
  onStart: () => void;
}

export default function WelcomeScreen({ onStart }: WelcomeScreenProps) {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      title: "🧪 Welcome to Virtual Chemistry Lab!",
      content: (
        <div className="space-y-4">
          <p className="text-lg text-gray-700">
            An interactive simulation for learning{" "}
            <strong>separation techniques</strong> used in chemistry.
          </p>
          <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
            <h4 className="font-bold text-blue-900 mb-2">What you'll learn:</h4>
            <ul className="space-y-2 text-blue-800">
              <li>✓ How to separate mixtures using different techniques</li>
              <li>✓ When to use each separation method</li>
              <li>✓ How equipment variables affect the process</li>
              <li>✓ Real-world applications of separation techniques</li>
            </ul>
          </div>
          <p className="text-gray-600 text-sm italic">
            This virtual lab lets you experiment safely without the mess, cost,
            or safety risks of a physical lab!
          </p>
        </div>
      ),
    },
    {
      title: "🎯 How It Works",
      content: (
        <div className="space-y-4">
          <div className="grid grid-cols-1 gap-4">
            <div className="bg-purple-50 border-l-4 border-purple-500 p-4 rounded">
              <h4 className="font-bold text-purple-900 mb-2">
                1️⃣ Choose a Technique
              </h4>
              <p className="text-purple-800 text-sm">
                Select from 7 different separation methods like filtration,
                distillation, and more.
              </p>
            </div>

            <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded">
              <h4 className="font-bold text-green-900 mb-2">
                2️⃣ Adjust Parameters
              </h4>
              <p className="text-green-800 text-sm">
                Control variables like temperature, pressure, flow rates, and
                equipment settings.
              </p>
            </div>

            <div className="bg-orange-50 border-l-4 border-orange-500 p-4 rounded">
              <h4 className="font-bold text-orange-900 mb-2">
                3️⃣ Observe & Learn
              </h4>
              <p className="text-orange-800 text-sm">
                Watch the 3D simulation and see how your changes affect the
                separation process in real-time.
              </p>
            </div>

            <div className="bg-pink-50 border-l-4 border-pink-500 p-4 rounded">
              <h4 className="font-bold text-pink-900 mb-2">
                4️⃣ Record Results
              </h4>
              <p className="text-pink-800 text-sm">
                Take notes on your observations just like in a real lab
                notebook.
              </p>
            </div>
          </div>
        </div>
      ),
    },
    {
      title: "⚠️ Lab Safety",
      content: (
        <div className="space-y-4">
          <div className="bg-yellow-100 border-2 border-yellow-500 p-4 rounded-lg">
            <p className="font-bold text-yellow-900 text-lg mb-2">
              Even though this is virtual, always think about safety!
            </p>
            <p className="text-yellow-800">
              Understanding safety procedures now will prepare you for real lab
              work.
            </p>
          </div>

          <div className="space-y-3">
            <div className="flex items-start gap-3 bg-white p-3 rounded border border-gray-200">
              <span className="text-2xl">🥽</span>
              <div>
                <p className="font-semibold text-gray-800">
                  Wear Safety Goggles
                </p>
                <p className="text-sm text-gray-600">
                  Always protect your eyes in the lab
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 bg-white p-3 rounded border border-gray-200">
              <span className="text-2xl">🧤</span>
              <div>
                <p className="font-semibold text-gray-800">
                  Use Protective Equipment
                </p>
                <p className="text-sm text-gray-600">
                  Gloves and lab coat prevent chemical contact
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 bg-white p-3 rounded border border-gray-200">
              <span className="text-2xl">📋</span>
              <div>
                <p className="font-semibold text-gray-800">
                  Read Instructions First
                </p>
                <p className="text-sm text-gray-600">
                  Know what you're doing before you start
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 bg-white p-3 rounded border border-gray-200">
              <span className="text-2xl">👨‍🏫</span>
              <div>
                <p className="font-semibold text-gray-800">Ask When Unsure</p>
                <p className="text-sm text-gray-600">
                  Never guess - always ask your teacher
                </p>
              </div>
            </div>
          </div>
        </div>
      ),
    },
    {
      title: "🚀 Ready to Start?",
      content: (
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-6 rounded-lg">
            <h4 className="text-2xl font-bold mb-3">You're all set!</h4>
            <p className="text-lg">
              Your virtual chemistry lab is ready. Start exploring separation
              techniques and discover the science behind them!
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-green-50 p-4 rounded-lg border border-green-200">
              <p className="font-bold text-green-900 mb-1">
                ✓ Start with Filtration
              </p>
              <p className="text-sm text-green-700">
                It's the easiest technique to understand
              </p>
            </div>

            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <p className="font-bold text-blue-900 mb-1">
                ✓ Read the Lab Guide
              </p>
              <p className="text-sm text-blue-700">
                Click the Lab Guide button for help
              </p>
            </div>

            <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
              <p className="font-bold text-purple-900 mb-1">
                ✓ Experiment Freely
              </p>
              <p className="text-sm text-purple-700">
                Try different settings and observe
              </p>
            </div>

            <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
              <p className="font-bold text-orange-900 mb-1">✓ Take Notes</p>
              <p className="text-sm text-orange-700">
                Record what you see and learn
              </p>
            </div>
          </div>

          <div className="text-center">
            <button
              onClick={onStart}
              className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-bold py-4 px-8 rounded-lg text-xl shadow-lg transition-all transform hover:scale-105"
            >
              🧪 Enter the Lab →
            </button>
          </div>
        </div>
      ),
    },
  ];

  const nextSlide = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(currentSlide + 1);
    }
  };

  const prevSlide = () => {
    if (currentSlide > 0) {
      setCurrentSlide(currentSlide - 1);
    }
  };

  const currentSlideData = slides[currentSlide];

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-blue-600 via-purple-600 to-pink-500 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6">
          <h2 className="text-3xl font-bold mb-2">{currentSlideData.title}</h2>
          <div className="flex gap-2 mt-4">
            {slides.map((_, index) => (
              <div
                key={index}
                className={`h-2 flex-1 rounded-full transition-all ${
                  index === currentSlide ? "bg-white" : "bg-white/30"
                }`}
              />
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="p-8 overflow-y-auto max-h-[calc(90vh-220px)]">
          {currentSlideData.content}
        </div>

        {/* Footer Navigation */}
        <div className="bg-gray-50 border-t border-gray-200 px-6 py-4 flex justify-between items-center">
          <button
            onClick={prevSlide}
            disabled={currentSlide === 0}
            className={`px-6 py-2 rounded-lg font-semibold transition-colors ${
              currentSlide === 0
                ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                : "bg-gray-300 hover:bg-gray-400 text-gray-800"
            }`}
          >
            ← Previous
          </button>

          <div className="text-sm text-gray-600">
            {currentSlide + 1} of {slides.length}
          </div>

          {currentSlide < slides.length - 1 ? (
            <button
              onClick={nextSlide}
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors"
            >
              Next →
            </button>
          ) : (
            <button
              onClick={onStart}
              className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold transition-colors"
            >
              Start Lab! 🚀
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
