const express = require('express');
const { google } = require('googleapis');
const axios = require('axios');
const router = express.Router();

const MAX_RETRIES = 3;
const RETRY_DELAY = 1000; // 1 second

router.post('/', async (req, res, next) => {
  try {
    const { query } = req.body;
    const apiKey = 'AIzaSyBfsj0mB4jWehD8bwXtEmJDZnZ9aLNhiCw';
    const searchEngineId = 'f5ba5e497554c4c5a';
    const customsearch = google.customsearch('v1');

    // Perform Google Custom Search
    const searchResponse = await customsearch.cse.list({
      auth: apiKey,
      cx: searchEngineId,
      q: `${query} site:linkedin.com/pub OR site:linkedin.com/in`,
    });

    const searchResults = searchResponse.data.items;

    // Format the search results as JSON
    const formattedResults = searchResults.map((result) => ({
      title: result.title,
      link: result.link,
      snippet: result.snippet,
    }));

    // Get LinkedIn profile details for each result
    const profileDataPromises = formattedResults.map(async (result) => {
      const linkedinUsername = extractLinkedInUsername(result.link);
      const profileData = await getLinkedInProfileDataWithRetry(linkedinUsername);
      return profileData;
    });

    const finalResults = await Promise.all(profileDataPromises);
    const filteredResults = finalResults.filter((result) => result !== null);

    res.status(200).json(filteredResults);
  } catch (error) {
    console.error('Search error:', error);
    next(error);
  }
});

function extractLinkedInUsername(profileUrl) {
  // Extract the LinkedIn username or ID from the profile URL
  const regex = /linkedin\.com\/(in|pub)\/([^/]+)/;
  const match = profileUrl.match(regex);
  if (match && match[2]) {
    return match[2];
  }
  return null;
}

async function getLinkedInProfileDataWithRetry(username, retryCount = 0) {
  console.log('Fetching profile data for username:', username);
  if (!username) {
    return null;
  }
  try {
    const response = await axios.get(`https://scrapper.talanture.com/profile-data/${username}`);
    console.log('Profile data received:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching LinkedIn profile data:', error);
    if (retryCount < MAX_RETRIES) {
      console.log(`Retrying in ${RETRY_DELAY}ms...`);
      await new Promise((resolve) => setTimeout(resolve, RETRY_DELAY));
      return getLinkedInProfileDataWithRetry(username, retryCount + 1);
    }
    return null;
  }
}

module.exports = router;