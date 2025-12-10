import { Link } from 'react-router-dom';
import { ArrowLeft, Shield } from 'lucide-react';

export default function Privacy() {
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
                            <Shield className="w-6 h-6 text-white" />
                        </div>
                        <h1 className="text-3xl md:text-4xl font-bold text-white">
                            Privacy Policy
                        </h1>
                    </div>

                    <div className="space-y-6 text-white/70 leading-relaxed">
                        <p className="text-sm text-white/50">
                            Last Updated: December 2025
                        </p>

                        <section>
                            <h2 className="text-xl font-bold text-white mb-3">1. Information We Collect</h2>
                            <p>
                                We collect information you provide directly to us, such as when you create an account, connect your wallet, or communicate with us. This may include your wallet address, email address, and other contact information.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold text-white mb-3">2. How We Use Your Information</h2>
                            <p>
                                We use the information we collect to provide, maintain, and improve our services, to process your transactions, to send you technical notices and support messages, and to communicate with you about products, services, and events.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold text-white mb-3">3. Information Sharing</h2>
                            <p>
                                We do not share your personal information with third parties except as described in this policy. We may share information with service providers who perform services on our behalf, or when required by law.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold text-white mb-3">4. Data Security</h2>
                            <p>
                                We take reasonable measures to help protect your personal information from loss, theft, misuse, unauthorized access, disclosure, alteration, and destruction.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold text-white mb-3">5. Your Rights</h2>
                            <p>
                                You have the right to access, update, or delete your personal information at any time. You may also have the right to object to or restrict certain types of processing of your personal information.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold text-white mb-3">6. Contact Us</h2>
                            <p>
                                If you have any questions about this Privacy Policy, please contact us at:{' '}
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
