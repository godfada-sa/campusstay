export const UCC_AREAS = [
  "Amamoma",
  "Kwaprow",
  "Apewosika",
  "Abura",
  "Ola",
  "Ayensu",
  "Akotokyir",
  "Nkanfoa",
] as const;

export const ROOM_FEATURES = [
  "Wi-Fi",
  "Study desk",
  "Ensuite bathroom",
  "Shared kitchen",
  "Water storage",
  "Standby power",
  "24-hour security",
  "Laundry area",
  "Parking",
  "Reading room",
  "Fenced compound",
  "Waste collection",
] as const;

export const SORT_OPTIONS = [
  { value: "featured", label: "Recommended" },
  { value: "price-asc", label: "Lowest rent first" },
  { value: "price-desc", label: "Highest rent first" },
  { value: "distance", label: "Closest to campus" },
  { value: "newest", label: "Recently added" },
] as const;

export const GENDER_OPTIONS = [
  { value: "", label: "Any" },
  { value: "female", label: "Female only" },
  { value: "male", label: "Male only" },
  { value: "mixed", label: "Mixed" },
] as const;
