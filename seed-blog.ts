import { generateMultipleBlogPosts } from './server/auto-blog-generator';

async function seedBlog() {
  console.log('Starting to seed blog with sample posts...');
  
  try {
    // Generate 5 blog posts
    await generateMultipleBlogPosts(5);
    console.log('Successfully generated 5 blog posts!');
  } catch (error) {
    console.error('Error seeding blog:', error);
  }
}

seedBlog().then(() => {
  console.log('Done!');
  process.exit(0);
}).catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});