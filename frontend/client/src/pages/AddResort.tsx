import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import {
  UploadCloud, ArrowLeft, PlusCircle, Loader2,
  Wifi, Coffee, Car, AirVent, Waves, ShieldCheck, Dumbbell, Flower2
} from "lucide-react";
import { Link, useLocation } from "wouter";
import { resortApi } from "@/lib/api";
import { toast } from "sonner";

export default function AddResort() {
  const [name, setName] = useState("");
  const [location, setLocationText] = useState("");
  const [description, setDescription] = useState("");
  const [pricePerNight, setPricePerNight] = useState("");
  const [category, setCategory] = useState("Beach");
  const [amenities, setAmenities] = useState<string[]>([]);
  const [newCustomAmenity, setNewCustomAmenity] = useState("");
  const [images, setImages] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [, setLocation] = useLocation();

  const availableAmenities = [
    { label: "Free WiFi", icon: <Wifi className="h-4 w-4" /> },
    { label: "Breakfast", icon: <Coffee className="h-4 w-4" /> },
    { label: "Free Parking", icon: <Car className="h-4 w-4" /> },
    { label: "Air Conditioning", icon: <AirVent className="h-4 w-4" /> },
    { label: "Pool Access", icon: <Waves className="h-4 w-4" /> },
    { label: "Security", icon: <ShieldCheck className="h-4 w-4" /> },
    { label: "Gym", icon: <Dumbbell className="h-4 w-4" /> },
    { label: "Spa", icon: <Flower2 className="h-4 w-4" /> }
  ];

  const handleAmenityToggle = (amenity: string) => {
    setAmenities(prev =>
      prev.includes(amenity) ? prev.filter(a => a !== amenity) : [...prev, amenity]
    );
  };

  const handleAddCustomAmenity = () => {
    if (!newCustomAmenity.trim()) return;
    if (amenities.includes(newCustomAmenity.trim())) {
      setNewCustomAmenity("");
      return;
    }
    setAmenities(prev => [...prev, newCustomAmenity.trim()]);
    setNewCustomAmenity("");
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    setIsUploading(true);
    const fileArray = Array.from(files);
    let loadedCount = 0;
    const newImages: string[] = [];

    fileArray.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        newImages.push(reader.result as string);
        loadedCount++;
        if (loadedCount === fileArray.length) {
          setImages(prev => [...prev, ...newImages].slice(0, 5));
          setIsUploading(false);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (images.length === 0) {
      toast.error("Please upload at least one image");
      return;
    }

    setLoading(true);
    try {
      await resortApi.create({
        name,
        location,
        description,
        category,
        pricePerNight: parseFloat(pricePerNight),
        images,
        amenities
      });
      toast.success("Resort submitted for review!");
      setLocation("/owner/dashboard");
    } catch (error: any) {
      toast.error(error.message || "Failed to add resort");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-8">
        <Button variant="ghost" className="mb-4 -ml-4 text-muted-foreground" asChild>
          <Link href="/owner/dashboard">
            <a><ArrowLeft className="h-4 w-4 mr-2" /> Back to Dashboard</a>
          </Link>
        </Button>
        <h1 className="font-serif text-3xl font-bold text-primary mb-1">Add New Resort</h1>
        <p className="text-muted-foreground">List your property on LuxeStays. It will be reviewed by an administrator before going live.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <Card className="border-border/50 shadow-sm">
          <CardContent className="p-6 space-y-6">
            <div className="space-y-4">
              <h3 className="font-serif text-xl font-semibold">Basic Information</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="name">Property Name</Label>
                  <Input
                    id="name"
                    placeholder="E.g. Azure Horizon Resort"
                    className="h-11"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    placeholder="E.g. Maldives"
                    className="h-11"
                    value={location}
                    onChange={(e) => setLocationText(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Describe what makes your property unique..."
                  className="min-h-[120px] resize-none"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <select
                    id="category"
                    className="flex h-11 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                  >
                    <option value="Beach">Beach Resort</option>
                    <option value="Mountain">Mountain Retreat</option>
                    <option value="City">City Luxury</option>
                    <option value="Desert">Desert Oasis</option>
                    <option value="Forest">Forest Hideaway</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="price">Price Per Night (INR)</Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">₹</span>
                    <Input
                      id="price"
                      type="number"
                      placeholder="0.00"
                      className="h-11 pl-8"
                      value={pricePerNight}
                      onChange={(e) => setPricePerNight(e.target.value)}
                      required
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-border/50">
              <h3 className="font-serif text-xl font-semibold mb-4">Experience & Amenities</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                {availableAmenities.map(amenity => (
                  <div
                    key={amenity.label}
                    onClick={() => handleAmenityToggle(amenity.label)}
                    className={`flex items-center gap-2 p-3 rounded-lg border cursor-pointer transition-colors ${amenities.includes(amenity.label)
                      ? 'border-primary bg-primary/5 text-primary'
                      : 'border-border/50 hover:bg-muted/50 text-muted-foreground'
                      }`}
                  >
                    {amenity.icon}
                    <span className="text-sm font-medium">{amenity.label}</span>
                  </div>
                ))}
                {/* Display custom amenities that are already selected and NOT in predefined list */}
                {amenities.filter(a => !availableAmenities.some(aa => aa.label === a)).map(custom => (
                  <div
                    key={custom}
                    onClick={() => handleAmenityToggle(custom)}
                    className="flex items-center gap-2 p-3 rounded-lg border border-primary bg-primary/5 text-primary cursor-pointer transition-colors"
                  >
                    <PlusCircle className="h-4 w-4" />
                    <span className="text-sm font-medium">{custom}</span>
                  </div>
                ))}
              </div>

              <div className="flex gap-2 max-w-md">
                <Input
                  placeholder="Add custom amenity (e.g. Private Butler)"
                  value={newCustomAmenity}
                  onChange={(e) => setNewCustomAmenity(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddCustomAmenity())}
                />
                <Button type="button" variant="outline" onClick={handleAddCustomAmenity}>Add</Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/50 shadow-sm">
          <CardContent className="p-6 space-y-6">
            <div className="space-y-4">
              <h3 className="font-serif text-xl font-semibold">Property Images</h3>
              <p className="text-sm text-muted-foreground mb-4">Upload high-quality images of your resort to attract more guests. (Min. 1, Max. 5)</p>

              <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-4">
                {images.map((img, index) => (
                  <div key={index} className="aspect-square relative rounded-lg overflow-hidden bg-muted group">
                    <img src={img} className="w-full h-full object-cover" alt={`Upload ${index}`} />
                    <button
                      type="button"
                      onClick={() => setImages(prev => prev.filter((_, i) => i !== index))}
                      className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <PlusCircle className="h-3 w-3 rotate-45" />
                    </button>
                  </div>
                ))}
                {images.length < 5 && (
                  <label className="aspect-square flex flex-col items-center justify-center border-2 border-dashed border-border/60 rounded-lg bg-muted/10 hover:bg-muted/30 transition-colors cursor-pointer text-center">
                    <UploadCloud className="h-6 w-6 text-primary mb-1" />
                    <span className="text-[10px] font-medium text-primary">Upload</span>
                    <input
                      type="file"
                      className="hidden"
                      accept="image/*"
                      multiple
                      onChange={handleImageUpload}
                      disabled={isUploading}
                    />
                  </label>
                )}
              </div>
              {isUploading && (
                <div className="flex items-center gap-2 text-sm text-primary">
                  <Loader2 className="h-4 w-4 animate-spin" /> Processing images...
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end gap-4 pb-12">
          <Button variant="outline" className="h-12 px-8" type="button" asChild>
            <Link href="/owner/dashboard">Cancel</Link>
          </Button>
          <Button className="h-12 px-8 bg-primary hover:bg-primary/90 text-lg min-w-[160px]" type="submit" disabled={loading || isUploading}>
            {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Submit for Review"}
          </Button>
        </div>
      </form>
    </main>
  );
}
