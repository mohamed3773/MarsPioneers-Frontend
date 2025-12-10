import { Link } from 'react-router-dom';
import { ArrowLeft, Cookie } from 'lucide-react';

export default function Cookies() {
    return (
        <div className="min-h-screen bg-gradient-to-b from-[#0D0D0D] to-black pt-32 pb-16 px-4">
            <div className="max-w-4xl mx-auto">
                {/* Back button */}
                <Link
                    to="/"
                    className="inline-flex items-center text-[#FF4500] hover:text-[#FF4500]/80 transition-colors mb-8"
                >
                    <ArrowLeft className="w-5 h-5 mr-2" />
                    Back to Home
                </Link>

                {/* Main content */}
                <div className="bg-gradient-to-br from-[#1F1F1F] to-[#0D0D0D] rounded-3xl p-8 md:p-12 border border-[#FF4500]/30 shadow-xl shadow-black/30">
                    <div className="flex items-center gap-4 mb-8">
                        <div className="w-12 h-12 bg-gradient-to-br from-[#FF4500] to-[#FF1E56] rounded-xl flex items-center justify-center">
                            <Cookie className="w-6 h-6 text-white" />
                        </div>
                        <h1 className="text-3xl md:text-4xl font-bold text-white">
                            Cookie Policy
                        </h1>
                    </div>

                    <div className="space-y-6 text-white/70 leading-relaxed">
                        <p className="text-sm text-white/50">
                            Last Updated: December 2025
                        </p>

                        <section>
                            <h2 className="text-xl font-bold text-white mb-3">1. What Are Cookies</h2>
                            <p>
                                Cookies are small text files that are placed on your device when you visit our website. They help us provide you with a better experience by remembering your preferences and understanding how you use our site.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold text-white mb-3">2. How We Use Cookies</h2>
                            <p>
                                We use cookies to understand how you interact with our website, to remember your preferences, to keep you signed in, and to improve our services. We may also use cookies for analytics and advertising purposes.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold text-white mb-3">3. Types of Cookies We Use</h2>
                            <p>
                                <strong>Essential Cookies:</strong> These cookies are necessary for the website to function properly and cannot be switched off in our systems.
                            </p>
                            <p className="mt-2">
                                <strong>Analytics Cookies:</strong> These cookies help us understand how visitors interact with our website by collecting and reporting information anonymously.
                            </p>
                            <p className="mt-2">
                                <strong>Preference Cookies:</strong> These cookies enable the website to remember information that changes the way the website behaves or looks, such as your preferred language.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold text-white mb-3">4. Third-Party Cookies</h2>
                            <p>
                                In addition to our own cookies, we may also use third-party cookies to report usage statistics of the website and to deliver advertisements on and through the website.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold text-white mb-3">5. Managing Cookies</h2>
                            <p>
                                Most web browsers allow you to control cookies through their settings preferences. However, limiting cookies may impact your experience of our website.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold text-white mb-3">6. Contact Us</h2>
                            <p>
                                If you have any questions about our use of cookies, please contact us at:{' '}
                                <a
                                    href="mailto:contact@marspioneers.tech"
                                    className="text-[#FF4500] hover:text-[#FF4500]/80 transition-colors"
                                >
                                    contact@marspioneers.tech
                                </a>
                            </p>
                        </section>
                    </div>
                </div>
            </div>
        </div>
    );
}
