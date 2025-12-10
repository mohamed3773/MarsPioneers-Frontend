import { Rocket, Twitter, MessageCircle, Send, Mail } from 'lucide-react';

export default function Footer() {
  const socialLinks = [
    { icon: Twitter, label: 'Twitter', href: 'https://x.com/MarsPioneersNFT' },
    { icon: MessageCircle, label: 'Discord', href: 'https://discord.gg/2buCuUVC' },
    { icon: Send, label: 'Telegram', href: 'https://t.me/+BXd-ysJ1D8E0ODQy' },
    { icon: Mail, label: 'Email', href: 'mailto:contact@marspioneers.tech' },
  ];

  const footerLinks = {
    Navigation: ['Home', 'NFT Collection', 'Lore', 'Community', 'OpenSea'],
    Resources: ['Whitepaper', 'OpenSea', 'FAQs', 'Terms of Service'],
    Connect: ['Twitter', 'Discord', 'Contact'],
  };

  // Get proper link URL for Connect section
  const getConnectLinkUrl = (link: string) => {
    switch (link) {
      case 'Twitter':
        return 'https://x.com/MarsPioneersNFT';
      case 'Discord':
        return 'https://discord.gg/2buCuUVC';
      case 'Contact':
        return 'mailto:contact@marspioneers.tech';
      default:
        return '#';
    }
  };

  // Get proper link URL for Navigation section
  const getNavigationLinkUrl = (link: string) => {
    switch (link) {
      case 'Home':
        return '/';
      case 'NFT Collection':
        return '/#nft-collection';
      case 'Lore':
        return '/#lore';
      case 'Community':
        return '/#community';
      case 'OpenSea':
        return 'https://opensea.io/0x0a9037401fd7fa6c0937c89a5d504ddb684c4be8';
      default:
        return '#';
    }
  };

  // Get proper link URL for Resources section
  const getResourcesLinkUrl = (link: string) => {
    switch (link) {
      case 'Whitepaper':
        return '/whitepaper';
      case 'OpenSea':
        return 'https://opensea.io/0x0a9037401fd7fa6c0937c89a5d504ddb684c4be8';
      case 'FAQs':
        return '/faqs';
      case 'Terms of Service':
        return '/terms';
      default:
        return '#';
    }
  };

  return (
    <footer className="relative bg-gradient-to-b from-[#0D0D0D] to-black border-t border-[#FF4500]/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          <div>
            {/* Logo section with reduced brightness and no glow */}
            <div className="flex items-center gap-2 mb-6">
              <Rocket className="w-7 h-7 text-[#FF4500]/80" />
              <div>
                <span className="text-xl font-bold text-white tracking-tight block flex items-baseline gap-1">
                  Mars<span className="text-[#FF4500]">Pioneers</span>
                  <span className="text-[#FF4500] text-xs font-semibold">2040</span>
                </span>
              </div>
            </div>

            {/* Description text */}
            <p className="text-white/60 text-sm leading-relaxed mb-6">
              Building the future of humanity, one NFT at a time. Join the first 100 digital colonists on Mars.
            </p>

            {/* Social media icons */}
            <div className="flex gap-4">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  className="w-10 h-10 bg-[#1F1F1F] border border-[#FF4500]/20 rounded-lg flex items-center justify-center text-white/60 hover:text-[#FF4500] hover:border-[#FF4500] transition-all duration-300"
                  aria-label={social.label}
                >
                  <social.icon size={18} />
                </a>
              ))}
            </div>
          </div>

          {/* Footer navigation links */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h3 className="text-white font-bold mb-4">{category}</h3>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link}>
                    <a
                      href={
                        category === 'Connect'
                          ? getConnectLinkUrl(link)
                          : category === 'Navigation'
                            ? getNavigationLinkUrl(link)
                            : category === 'Resources'
                              ? getResourcesLinkUrl(link)
                              : '#'
                      }
                      target={
                        (category === 'Connect' && link !== 'Contact') ||
                          link === 'OpenSea'
                          ? '_blank'
                          : undefined
                      }
                      rel={
                        (category === 'Connect' && link !== 'Contact') ||
                          link === 'OpenSea'
                          ? 'noopener noreferrer'
                          : undefined
                      }
                      className="text-white/60 hover:text-[#FF4500] transition-colors text-sm"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Footer bottom section */}
        <div className="pt-8 border-t border-[#FF4500]/10">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-white/40 text-sm">
              © 2024 MarsPioneers 2040. All rights reserved.
            </p>
            <div className="flex gap-6 text-sm">
              <a href="/privacy" className="text-white/40 hover:text-[#FF4500] transition-colors">
                Privacy Policy
              </a>
              <a href="/terms" className="text-white/40 hover:text-[#FF4500] transition-colors">
                Terms of Service
              </a>
              <a href="/cookies" className="text-white/40 hover:text-[#FF4500] transition-colors">
                Cookie Policy
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom glowing border line */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#FF4500] to-transparent"></div>
    </footer>
  );
}
