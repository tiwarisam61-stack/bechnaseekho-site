const streetAddress = "B103, 2nd floor, Sector 2";
const addressLocality = "Noida";
const postalCode = "201301";

export const OFFICE_ADDRESS = `${streetAddress}, ${addressLocality} ${postalCode}`;

export const OFFICE_POSTAL_ADDRESS = {
  "@type": "PostalAddress",
  streetAddress,
  addressLocality,
  addressRegion: "Uttar Pradesh",
  postalCode,
  addressCountry: "IN",
};
