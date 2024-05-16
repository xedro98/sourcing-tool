const { LinkedInProfileScraper } = require('linkedin-profile-scraper');

const scrapeLinkedInProfile = async (url, sessionCookieValue) => {
  const scraper = new LinkedInProfileScraper({
    sessionCookieValue,
    keepAlive: false,
    timeout: 40000, // Increase timeout to 40 seconds
  });

  await scraper.setup();

  try {
    const result = await scraper.run(url, {
      waitForNavigationTimeout: 30000, // Set a timeout for navigation
      waitForTimeout: 5000, // Wait for 5 seconds before scrolling the page
    });
    return result;
  } catch (error) {
    if (error.message.includes('Navigation timeout')) {
      console.warn(`Navigation timeout for profile: ${url}. Retrying...`);
      return scrapeLinkedInProfile(url, sessionCookieValue); // Retry scraping the profile
    } else if (error.message.includes('Execution context was destroyed')) {
      console.warn(`Execution context destroyed for profile: ${url}. Retrying...`);
      return scrapeLinkedInProfile(url, sessionCookieValue); // Retry scraping the profile
    } else {
      throw error;
    }
  } finally {
    await scraper.close(); // Close the browser instance after scraping each profile
  }
};

module.exports = scrapeLinkedInProfile;