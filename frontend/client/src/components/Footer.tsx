import { Link } from "wouter";
import { Hotel, Mail, Phone, MapPin, Instagram, Twitter, Facebook } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-primary text-primary-foreground pt-16 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Hotel className="h-8 w-8 text-accent" />
              <span className="font-serif text-2xl font-bold">LuxeStays</span>
            </div>
            <p className="text-primary-foreground/70 text-sm leading-relaxed">
              Curating exceptional stays and unforgettable experiences at the world's most luxurious destinations.
            </p>
          </div>
          
          <div>
            <h4 className="font-serif text-lg font-semibold mb-4">Discover</h4>
            <ul className="space-y-2 text-sm text-primary-foreground/70">
              <li><Link href="/destinations"><a className="hover:text-accent transition-colors">Destinations</a></Link></li>
              <li><Link href="/offers"><a className="hover:text-accent transition-colors">Special Offers</a></Link></li>
              <li><Link href="/corporate"><a className="hover:text-accent transition-colors">Corporate Retreats</a></Link></li>
              <li><Link href="/weddings"><a className="hover:text-accent transition-colors">Weddings</a></Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-serif text-lg font-semibold mb-4">Support</h4>
            <ul className="space-y-2 text-sm text-primary-foreground/70">
              <li><Link href="/faq"><a className="hover:text-accent transition-colors">FAQ</a></Link></li>
              <li><Link href="/contact"><a className="hover:text-accent transition-colors">Contact Us</a></Link></li>
              <li><Link href="/terms"><a className="hover:text-accent transition-colors">Terms of Service</a></Link></li>
              <li><Link href="/privacy"><a className="hover:text-accent transition-colors">Privacy Policy</a></Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-serif text-lg font-semibold mb-4">Connect</h4>
            <ul className="space-y-4 text-sm text-primary-foreground/70">
              <li className="flex items-center gap-3">
                <MapPin className="h-4 w-4 text-accent" />
                <span>123 Luxury Avenue, NY 10001</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="h-4 w-4 text-accent" />
                <span>+1 (800) LUXE-STAY</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="h-4 w-4 text-accent" />
                <span>concierge@luxestays.com</span>
              </li>
            </ul>
            <div className="flex gap-4 mt-6">
              <a href="#" className="p-2 bg-primary-foreground/10 rounded-full hover:bg-accent hover:text-primary transition-colors">
                <Instagram className="h-4 w-4" />
              </a>
              <a href="#" className="p-2 bg-primary-foreground/10 rounded-full hover:bg-accent hover:text-primary transition-colors">
                <Twitter className="h-4 w-4" />
              </a>
              <a href="#" className="p-2 bg-primary-foreground/10 rounded-full hover:bg-accent hover:text-primary transition-colors">
                <Facebook className="h-4 w-4" />
              </a>
            </div>
          </div>
        </div>
        
        <div className="pt-8 border-t border-primary-foreground/20 text-center text-sm text-primary-foreground/50 flex flex-col md:flex-row justify-between items-center gap-4">
          <p>&copy; {new Date().getFullYear()} LuxeStays. All rights reserved.</p>
          <div className="flex items-center gap-2">
             <Link href="/owner/register"><a className="hover:text-white transition-colors">Partner With Us</a></Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
