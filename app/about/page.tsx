import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { CheckCircle, Users, Zap, Globe } from "lucide-react";

export const metadata = { title: "About Us - Advanta AI" };

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main className="pt-24">
        <section className="py-20 bg-gradient-to-br from-blue-50 to-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              We&apos;re Building the Future of <span className="text-blue-600">Business AI</span>
            </h1>
            <p className="text-xl text-gray-600 leading-relaxed">
              Advanta AI was founded with a simple mission: make enterprise-grade AI accessible to every business,
              regardless of size or technical expertise. No code. No delay. Just results.
            </p>
          </div>
        </section>

        <section className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-2 gap-16 items-center">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Mission</h2>
                <p className="text-gray-600 leading-relaxed mb-6">
                  We combine the power of ChatGPT, APIs, and intelligent automation to help businesses
                  eliminate repetitive tasks, scale faster, and deliver better customer experiences.
                </p>
                <ul className="space-y-3">
                  {["500+ businesses transformed", "2.5M+ tasks automated monthly", "85% average cost reduction", "24/7 AI support for all clients"].map((item) => (
                    <li key={item} className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                      <span className="text-gray-700">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="grid grid-cols-2 gap-6">
                {[{ icon: Users, label: "Team", value: "50+ AI experts" }, { icon: Globe, label: "Reach", value: "30+ countries" }, { icon: Zap, label: "Speed", value: "Deploy in days" }, { icon: CheckCircle, label: "Success", value: "98% satisfaction" }].map((s) => (
                  <div key={s.label} className="bg-blue-50 rounded-2xl p-6 text-center">
                    <s.icon className="w-8 h-8 text-blue-600 mx-auto mb-3" />
                    <div className="font-bold text-gray-900">{s.value}</div>
                    <div className="text-sm text-gray-500">{s.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
