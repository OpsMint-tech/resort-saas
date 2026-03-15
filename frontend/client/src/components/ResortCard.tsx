import { Card, CardContent, CardFooter } from "./ui/card";
import { Button } from "./ui/button";
import { Link } from "wouter";
import { MapPin, Star } from "lucide-react";

interface Resort {
  id: string | number;
  name: string;
  location: string;
  pricePerNight: number;
  images: string[];
  rating: number;
  category?: string;
}

export function ResortCard({ resort }: { resort: Resort }) {
  return (
    <Card className="overflow-hidden border-none shadow-lg hover:shadow-xl transition-all duration-300 group rounded-xl">
      <div className="relative aspect-[4/3] overflow-hidden bg-muted">
        {resort.images && resort.images.length > 0 ? (
          <img
            src={resort.images[0]}
            alt={resort.name}
            className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-700 ease-in-out"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <img
              src="https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&q=80&w=800"
              alt="Luxury Stay"
              className="object-cover w-full h-full opacity-50"
            />
          </div>
        )}
        <div className="absolute top-4 left-4 z-10">
          <span className="bg-primary/80 backdrop-blur-md text-white text-[10px] uppercase tracking-widest font-bold px-3 py-1.5 rounded-lg border border-white/20 shadow-lg">
            {resort.category || 'Luxury'}
          </span>
        </div>
        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-sm z-10">
          <Star className="h-4 w-4 fill-accent text-accent" />
          <span className="text-sm font-semibold text-primary">{resort.rating || 4.5}</span>
        </div>
      </div>
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-2">
          <h3 className="font-serif text-xl font-bold text-primary line-clamp-1">{resort.name}</h3>
        </div>
        <div className="flex items-center text-muted-foreground mb-4">
          <MapPin className="h-4 w-4 mr-1.5 opacity-70" />
          <span className="text-sm">{resort.location}</span>
        </div>
        <div className="flex items-end gap-1">
          <span className="text-2xl font-bold text-primary">₹{resort.pricePerNight}</span>
          <span className="text-sm text-muted-foreground mb-1">/ night</span>
        </div>
      </CardContent>
      <CardFooter className="px-6 pb-6 pt-0">
        <Button asChild className="w-full bg-primary hover:bg-primary/90 text-white rounded-lg">
          <Link href={`/resorts/${resort.id}`}>View Details</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
