// Tech enrichment with external APIs (optional)

async function enrichWappalyzer(url) {
  // Placeholder for Wappalyzer API integration
  // Would require WAPPALYZER_API_KEY environment variable
  const apiKey = process.env.WAPPALYZER_API_KEY;
  if (!apiKey) return [];
  
  try {
    const response = await fetch(`https://api.wappalyzer.com/v2/lookup/?urls=${encodeURIComponent(url)}`, {
      headers: { 'x-api-key': apiKey }
    });
    
    if (!response.ok) return [];
    
    const data = await response.json();
    const technologies = data[0]?.technologies || [];
    
    return technologies.map(tech => tech.name).slice(0, 10);
  } catch (error) {
    console.error('Wappalyzer enrichment failed:', error);
    return [];
  }
}

async function enrichBuiltWith(url) {
  // Placeholder for BuiltWith API integration
  // Would require BUILTWITH_API_KEY environment variable
  const apiKey = process.env.BUILTWITH_API_KEY;
  if (!apiKey) return [];
  
  try {
    const domain = new URL(url).hostname;
    const response = await fetch(`https://api.builtwith.com/v20/api.json?KEY=${apiKey}&LOOKUP=${domain}`);
    
    if (!response.ok) return [];
    
    const data = await response.json();
    const technologies = [];
    
    // Extract technology names from BuiltWith response structure
    if (data.Results && data.Results[0] && data.Results[0].Result && data.Results[0].Result.Paths) {
      const paths = data.Results[0].Result.Paths;
      Object.values(paths).forEach(path => {
        if (path.Technologies) {
          path.Technologies.forEach(tech => {
            if (tech.Name) technologies.push(tech.Name);
          });
        }
      });
    }
    
    return [...new Set(technologies)].slice(0, 10);
  } catch (error) {
    console.error('BuiltWith enrichment failed:', error);
    return [];
  }
}

module.exports = {
  enrichWappalyzer,
  enrichBuiltWith
};