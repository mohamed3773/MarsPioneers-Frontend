import { Link } from 'react-router-dom';
import { ArrowLeft, FileText } from 'lucide-react';

export default function Whitepaper() {
    return (
        <div className="min-h-screen bg-gradient-to-b from-[#0D0D0D] to-black pt-32 pb-16 px-4">
            <div className="max-w-2xl mx-auto">
                {/* Back button */}
                <Link
                    to="/"
                    className="inline-flex items-center text-[#FF4500] hover:text-[#FF4500]/80 transition-colors mb-8"
                >
                    <ArrowLeft className="w-5 h-5 mr-2" />
                    Back to Home
                </Link>

                {/* Main content */}
                <div className="bg-gradient-to-br from-[#1F1F1F] to-[#0D0D0D] rounded-3xl p-14 border border-[#FF4500]/30 shadow-xl shadow-black/30 text-center">
                    <div className="w-16 h-16 bg-gradient-to-br from-[#FF4500] to-[#FF1E56] rounded-2xl flex items-center justify-center mx-auto mb-6">
                        <FileText className="w-8 h-8 text-white" />
                    </div>

                    <h1 className="text-4xl font-bold text-white mb-4">
                        Whitepaper is coming soon.
                    </h1>
                </div>
            </div>
        </div>
    );
}
