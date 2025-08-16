// Quick debug script to check API response
import fs from 'fs';

async function checkAPI() {
  try {
    const response = await fetch('http://localhost:5000/api/blog/posts');
    const data = await response.json();
    
    // Find August 16 posts
    const aug16Posts = data.filter(post => post.filename.includes('2025-08-16'));
    
    console.log('August 16 posts from API:');
    aug16Posts.forEach(post => {
      console.log(`- ${post.filename}: date = "${post.date}"`);
    });
    
  } catch (error) {
    console.error('Error:', error);
  }
}

checkAPI();