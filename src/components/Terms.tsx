import { Link } from 'react-router-dom';
import { ArrowLeft, FileText } from 'lucide-react';

export default function Terms() {
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
                            <FileText className="w-6 h-6 text-white" />
                        </div>
                        <h1 className="text-3xl md:text-4xl font-bold text-white">
                            Terms of Service
                        </h1>
                    </div>

                    <div className="space-y-6 text-white/70 leading-relaxed">
                        <p className="text-sm text-white/50">
                            Last Updated: December 2025
                        </p>

                        <section>
                            <h2 className="text-xl font-bold text-white mb-3">1. Acceptance of Terms</h2>
                            <p>
                                By accessing and using the MarsPioneers 2040 platform, you accept and agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our services.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold text-white mb-3">2. NFT Ownership</h2>
                            <p>
                                When you purchase a MarsPioneers NFT, you own the underlying NFT completely. Ownership of the NFT is mediated entirely by the blockchain network. We have no ability to seize, freeze, or otherwise modify the ownership of any NFT.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold text-white mb-3">3. Intellectual Property</h2>
                            <p>
                                MarsPioneers 2040 grants NFT holders a limited, non-exclusive license to use, copy, and display the artwork associated with their owned NFTs for personal, non-commercial purposes. Commercial use requires prior written approval.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold text-white mb-3">4. User Responsibilities</h2>
                            <p>
                                You are responsible for maintaining the security of your wallet and private keys. We are not responsible for any losses resulting from unauthorized access to your wallet or account.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold text-white mb-3">5. Prohibited Activities</h2>
                            <p>
                                You may not use our platform for any illegal activities, including but not limited to money laundering, fraud, or any activity that violates applicable laws and regulations.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold text-white mb-3">6. No Investment Advice</h2>
                            <p>
                                NFTs are digital collectibles. Nothing on this platform constitutes investment, financial, or legal advice. You should conduct your own research before making any purchase decisions.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold text-white mb-3">7. Limitation of Liability</h2>
                            <p>
                                MarsPioneers 2040 is provided "as is" without warranties of any kind. We are not liable for any damages arising from your use of the platform or ownership of NFTs.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold text-white mb-3">8. Changes to Terms</h2>
                            <p>
                                We reserve the right to modify these terms at any time. Continued use of the platform after changes constitutes acceptance of the modified terms.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold text-white mb-3">9. Contact Information</h2>
                            <p>
                                For questions about these Terms of Service, please contact us at:{' '}
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
