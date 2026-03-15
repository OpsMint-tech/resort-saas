export const mockResorts = [
  {
    id: 1,
    name: "Azure Horizon Resort & Spa",
    description: "Experience unparalleled luxury at our beachfront property featuring pristine private beaches and world-class spa facilities.",
    location: "Maldives",
    pricePerNight: 850,
    status: "active",
    images: ["/src/assets/images/resort-1.jpg"],
    rating: 4.9,
    amenities: ["Private Beach", "Spa", "Infinity Pool", "Fine Dining"],
  },
  {
    id: 2,
    name: "Alpine Peak Lodge",
    description: "Nestled high in the mountains, offering ski-in/ski-out access and cozy evenings by grand fireplaces.",
    location: "Swiss Alps",
    pricePerNight: 1200,
    status: "active",
    images: ["/src/assets/images/resort-3.jpg"],
    rating: 4.8,
    amenities: ["Ski Access", "Heated Pool", "Gourmet Restaurant", "Concierge"],
  },
  {
    id: 3,
    name: "The Urban Oasis Hotel",
    description: "A sanctuary of calm in the heart of the bustling metropolis. Sleek, modern interiors with panoramic city views.",
    location: "Dubai",
    pricePerNight: 650,
    status: "active",
    images: ["/src/assets/images/resort-2.jpg"],
    rating: 4.7,
    amenities: ["Rooftop Bar", "Fitness Center", "Business Lounge", "Valet"],
  },
];

export const mockUser = {
  id: 1,
  name: "Jane Doe",
  email: "jane@example.com",
  role: "user", // "user" | "owner" | "admin"
};
