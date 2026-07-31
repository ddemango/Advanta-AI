import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function Founder() {
  return (
    <section className="py-20 bg-gradient-to-br from-gray-900 to-blue-900">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Avatar + name */}
          <div className="text-center md:text-left">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white text-3xl font-bold mx-auto md:mx-0 mb-6">
              DD
            </div>
            <p className="text-blue-300 text-sm font-semibold uppercase tracking-wide mb-2">
              Founded by
            </p>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">
              Davide Demango
            </h2>
            <p className="text-blue-200 text-lg mb-6">Founder &amp; CEO, Advanta AI</p>
            <Link
              href="/about"
              className="inline-flex items-center gap-2 bg-white text-blue-700 px-6 py-3 rounded-xl font-semibold hover:bg-blue-50 transition-colors"
            >
              About Davide <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Quote */}
          <div>
            <blockquote className="text-xl text-blue-100 leading-relaxed italic mb-8">
              &ldquo;AI shouldn&apos;t be reserved for companies with million-dollar R&amp;D budgets.
              Every business — no matter how small — deserves access to the tools that let
              them compete, grow, and serve their customers better. That&apos;s why I built
              Advanta AI.&rdquo;
            </blockquote>
            <div className="grid grid-cols-2 gap-4">
              {[
                { value: "500+", label: "Businesses Helped" },
                { value: "2.5M+", label: "Tasks Automated" },
                { value: "30+", label: "Countries Served" },
                { value: "98%", label: "Client Satisfaction" },
              ].map((s) => (
                <div key={s.label} className="bg-white/10 rounded-xl p-4 text-center">
                  <div className="text-2xl font-bold text-white">{s.value}</div>
                  <div className="text-blue-300 text-sm mt-1">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
