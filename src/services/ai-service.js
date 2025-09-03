import { fetchWithAuth } from "./base-service";

export async function generateRealEstateFlyerContent(description) {
  try {
    const response = await fetchWithAuth("/v1/ai/generate-flyer-content", {
      method: "POST",
      body: {
        description,
        type: "real_estate_flyer",
      },
    });

    return response;
  } catch (e) {
    // Fallback to local AI generation if API fails
    return generateLocalFlyerContent(description);
  }
}

// Local AI generation fallback using a template-based approach
function generateLocalFlyerContent(description) {
  // Parse the description to extract key information
  const info = parseRealEstateDescription(description);

  // Generate structured flyer content
  const flyerContent = {
    title: generateTitle(info),
    subtitle: generateSubtitle(info),
    features: generateFeatures(info),
    details: generateDetails(info),
    callToAction: "Call today to schedule a viewing!",
  };

  return {
    success: true,
    data: flyerContent,
  };
}

function parseRealEstateDescription(description) {
  const info = {
    bedrooms: 0,
    bathrooms: 0,
    sqft: 0,
    location: "",
    features: [],
  };

  // Extract bedrooms
  const bedroomMatch = description.match(/(\d+)\s*bedroom/i);
  if (bedroomMatch) info.bedrooms = parseInt(bedroomMatch[1]);

  // Extract bathrooms
  const bathroomMatch = description.match(/(\d+)\s*bathroom/i);
  if (bathroomMatch) info.bathrooms = parseInt(bathroomMatch[1]);

  // Extract square footage
  const sqftMatch = description.match(/(\d+)\s*sq\s*ft/i);
  if (sqftMatch) info.sqft = parseInt(sqftMatch[1]);

  // Extract location (zip code or city)
  const locationMatch = description.match(
    /(?:at|in)\s+([^,\d]+?)(?:\s+\d{5}|\s*$)/i
  );
  if (locationMatch) info.location = locationMatch[1].trim();

  // Extract features
  const featureKeywords = [
    "swimming pool",
    "garage",
    "garden",
    "balcony",
    "fireplace",
    "hardwood floors",
  ];
  featureKeywords.forEach((keyword) => {
    if (description.toLowerCase().includes(keyword)) {
      info.features.push(keyword);
    }
  });

  return info;
}

function generateTitle(info) {
  if (info.bedrooms > 0 && info.sqft > 0) {
    return `${info.bedrooms} Bedroom, ${info.sqft} sq ft Home`;
  } else if (info.bedrooms > 0) {
    return `${info.bedrooms} Bedroom Home`;
  } else {
    return "Beautiful Home for Sale";
  }
}

function generateSubtitle(info) {
  if (info.location) {
    return `Located in ${info.location}`;
  }
  return "Prime Location";
}

function generateFeatures(info) {
  const features = [];

  if (info.bedrooms > 0) features.push(`${info.bedrooms} Bedrooms`);
  if (info.bathrooms > 0) features.push(`${info.bathrooms} Bathrooms`);
  if (info.sqft > 0) features.push(`${info.sqft} sq ft`);

  // Add extracted features
  info.features.forEach((feature) => {
    features.push(feature.charAt(0).toUpperCase() + feature.slice(1));
  });

  return features;
}

function generateDetails(info) {
  const details = [];

  if (info.bedrooms > 0) details.push(`• ${info.bedrooms} spacious bedrooms`);
  if (info.bathrooms > 0) details.push(`• ${info.bathrooms} modern bathrooms`);
  if (info.sqft > 0) details.push(`• ${info.sqft} square feet of living space`);

  info.features.forEach((feature) => {
    details.push(`• ${feature.charAt(0).toUpperCase() + feature.slice(1)}`);
  });

  return details;
}
