import { useEffect, useState } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { ResortCard } from "@/components/ResortCard";
import { resortApi } from "@/lib/api";
import { Calendar, Users, Search, ArrowRight, Loader2, Star } from "lucide-react";

export default function Home() {
  const [resorts, setResorts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const categories = ["All", "Beach", "Mountain", "City", "Desert", "Forest"];

  useEffect(() => {
    fetchResorts(search, selectedCategory);
  }, [selectedCategory]);

  const fetchResorts = async (query?: string, category?: string) => {
    setLoading(true);
    try {
      const data = await resortApi.getAll(query, category);
      setResorts(data);
    } catch (error) {
      console.error("Failed to fetch resorts", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchResorts(search, selectedCategory);
  };

  return (
    <>
      {/* Hero Section */}
      <section className="relative h-[85vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-primary/40 z-10 mix-blend-multiply" />
          <img
            src="https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&q=80&w=1920"
            alt="Luxury Resort"
            className="w-full h-full object-cover object-center"
          />
        </div>

        <div className="relative z-20 container mx-auto px-4 text-center mt-16">
          <span className="inline-block py-1 px-3 rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-white text-sm font-medium tracking-widest uppercase mb-6">
            The Art of Hospitality
          </span>
          <h1 className="font-serif text-5xl md:text-7xl lg:text-8xl font-bold text-white mb-6 leading-tight drop-shadow-lg">
            Discover Your <br /><span className="text-accent italic">Perfect</span> Escape
          </h1>
          <p className="text-lg md:text-xl text-white/90 max-w-2xl mx-auto mb-12 drop-shadow-md font-light">
            Curated luxury experiences at the world's most breathtaking destinations. Book your next unforgettable stay with LuxeStays.
          </p>

          {/* Search Bar */}
          <form className="max-w-4xl mx-auto bg-white rounded-2xl p-3 shadow-2xl flex flex-col md:flex-row gap-3" onSubmit={handleSearch}>
            <div className="flex-1 flex items-center bg-muted/50 rounded-xl px-4 py-3 border border-border/50">
              <Search className="h-5 w-5 text-muted-foreground mr-3" />
              <input
                type="text"
                placeholder="Where do you want to go?"
                className="bg-transparent border-none outline-none w-full text-foreground placeholder:text-muted-foreground"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <div className="flex-1 flex items-center bg-muted/50 rounded-xl px-4 py-3 border border-border/50">
              <Calendar className="h-5 w-5 text-muted-foreground mr-3" />
              <input
                type="text"
                placeholder="Anytime"
                className="bg-transparent border-none outline-none w-full text-foreground placeholder:text-muted-foreground cursor-pointer"
                readOnly
              />
            </div>
            <div className="flex-1 flex items-center bg-muted/50 rounded-xl px-4 py-3 border border-border/50">
              <Users className="h-5 w-5 text-muted-foreground mr-3" />
              <select className="bg-transparent border-none outline-none w-full text-foreground appearance-none cursor-pointer">
                <option>2 Guests, 1 Room</option>
                <option>1 Guest, 1 Room</option>
                <option>4 Guests, 2 Rooms</option>
              </select>
            </div>
            <Button
              type="submit"
              className="h-auto py-4 px-8 bg-accent hover:bg-accent/90 text-primary-foreground font-semibold rounded-xl whitespace-nowrap"
              disabled={loading}
            >
              {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : "Search"}
            </Button>
          </form>

          {/* Category Quick Filter */}
          <div className="mt-8 flex items-center justify-center gap-2 overflow-x-auto pb-4 no-scrollbar">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-6 py-2 rounded-full text-sm font-medium transition-all backdrop-blur-md border ${selectedCategory === cat
                    ? "bg-accent text-white border-accent shadow-lg shadow-accent/20"
                    : "bg-white/10 text-white border-white/20 hover:bg-white/20"
                  }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Destinations */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
            <div className="max-w-2xl">
              <h2 className="font-serif text-4xl md:text-5xl font-bold text-primary mb-4">Featured Collections</h2>
              <p className="text-muted-foreground text-lg">Handpicked properties that define the pinnacle of luxury and comfort.</p>
            </div>
            <Button variant="outline" className="rounded-full hidden md:flex items-center group border-primary/20 hover:border-primary">
              View All Resorts <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>

          {loading ? (
            <div className="flex justify-center py-20">
              <Loader2 className="h-10 w-10 animate-spin text-primary" />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {resorts.length === 0 && (
                <div className="col-span-full text-center py-20 bg-muted/20 rounded-3xl border border-dashed border-border/60">
                  <p className="text-muted-foreground text-lg">No properties available at the moment. Check back soon!</p>
                </div>
              )}
              {resorts.map(resort => (
                <ResortCard key={resort.id} resort={resort} />
              ))}
            </div>
          )}

          <div className="mt-12 text-center md:hidden">
            <Button variant="outline" className="rounded-full w-full max-w-sm">
              View All Resorts
            </Button>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-24 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="font-serif text-4xl font-bold text-primary mb-4">The LuxeStays Standard</h2>
            <p className="text-muted-foreground">Every property in our collection is personally vetted to ensure it meets our rigorous standards of luxury, soul, and service.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              { title: "Curated Excellence", desc: "Only the top 1% of luxury properties make it into our exclusive portfolio." },
              { title: "Bespoke Concierge", desc: "Available 24/7 to handle everything from dining reservations to private transfers." },
              { title: "Price Match Promise", desc: "Find a lower rate elsewhere and we'll not only match it, but beat it." }
            ].map((item, i) => (
              <div key={i} className="text-center group">
                <div className="h-16 w-16 bg-primary/5 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:bg-accent group-hover:text-white transition-all duration-300">
                  <Star className="h-8 w-8 text-accent group-hover:text-white" />
                </div>
                <h3 className="font-serif text-xl font-bold text-primary mb-3">{item.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Experience Banner */}
      <section className="py-24 bg-primary text-primary-foreground overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div className="relative z-10">
              <span className="text-accent font-semibold tracking-widest uppercase text-sm mb-4 block">Tailored Journeys</span>
              <h2 className="font-serif text-4xl md:text-5xl font-bold mb-6 leading-tight">Elevate Your Travel Experience</h2>
              <p className="text-primary-foreground/80 text-lg mb-8 leading-relaxed">
                Beyond exquisite accommodations, we offer bespoke experiences tailored to your desires. From private yacht charters to exclusive culinary events, let us craft the perfect itinerary for your stay.
              </p>
              <div className="flex gap-4">
                <Button size="lg" className="bg-accent text-primary hover:bg-accent/90 rounded-full px-8 font-semibold">
                  Explore Experiences
                </Button>
                <Button variant="outline" size="lg" className="border-white/20 hover:bg-white/10 text-white rounded-full px-8">
                  View Magazine
                </Button>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 relative">
              <div className="absolute -top-24 -right-24 h-64 w-64 bg-accent/20 rounded-full blur-3xl" />
              <img src="https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?auto=format&fit=crop&q=80&w=800" alt="Experience 1" className="rounded-2xl h-80 w-full object-cover mt-8 shadow-2xl relative z-10" />
              <img src="https://images.unsplash.com/photo-1540518614846-7eded433c457?auto=format&fit=crop&q=80&w=800" alt="Experience 2" className="rounded-2xl h-80 w-full object-cover shadow-2xl relative z-10" />
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-24 border-t">
        <div className="container mx-auto px-4 text-center max-w-3xl">
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-primary mb-4">Join The Circle</h2>
          <p className="text-muted-foreground mb-8 text-lg">Subscribe to receive exclusive offers, early access to new properties, and travel inspiration from around the globe.</p>
          <div className="flex flex-col sm:flex-row gap-2">
            <input
              type="email"
              placeholder="Enter your email address"
              className="flex-1 h-14 px-6 rounded-full border border-border bg-muted/30 focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
            <Button size="lg" className="h-14 px-10 rounded-full bg-primary hover:bg-primary/90 text-white font-semibold">
              Subscribe
            </Button>
          </div>
          <p className="text-xs text-muted-foreground mt-4">By subscribing, you agree to our Privacy Policy and Terms of Service.</p>
        </div>
      </section>
    </>
  );
}
