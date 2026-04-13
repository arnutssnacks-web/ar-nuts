import { SiInstagram } from 'react-icons/si';
import { Heart } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const appIdentifier = encodeURIComponent(
    typeof window !== 'undefined' ? window.location.hostname : 'ar-nuts'
  );

  return (
    <footer className="border-t border-border/40 bg-muted/30">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          <div>
            <h3 className="mb-4 text-lg font-bold text-gold">AR NUTS</h3>
            <p className="text-sm text-muted-foreground">
              Premium quality nuts, dry fruits, and seeds for a healthy lifestyle.
            </p>
          </div>

          <div>
            <h4 className="mb-4 font-semibold">Contact Us</h4>
            <div className="space-y-2 text-sm text-muted-foreground">
              <p>
                <a href="tel:+919345285169" className="hover:text-gold transition-colors">
                  Phone: +91 93452 85169
                </a>
              </p>
              <p>
                <a href="mailto:arnutssnacks@gmail.com" className="hover:text-gold transition-colors">
                  Email: arnutssnacks@gmail.com
                </a>
              </p>
              <div className="flex items-center gap-2 pt-2">
                <a
                  href="https://instagram.com/arnuts"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gold hover:text-gold/80 transition-colors"
                >
                  <SiInstagram className="h-6 w-6" />
                </a>
              </div>
            </div>
          </div>

          <div>
            <h4 className="mb-4 font-semibold">Policies</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <a href="#" className="hover:text-gold transition-colors">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-gold transition-colors">
                  Terms of Service
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-gold transition-colors">
                  Return Policy
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 border-t border-border/40 pt-8 text-center text-sm text-muted-foreground">
          <p className="flex items-center justify-center gap-1">
            © {currentYear} AR NUTS. Built with <Heart className="h-4 w-4 text-red-500 fill-red-500" /> using{' '}
            <a
              href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${appIdentifier}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gold hover:text-gold/80 transition-colors"
            >
              caffeine.ai
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
