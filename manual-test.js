import https from 'https';
import http from 'http';

function testEndpoint(url) {
  return new Promise((resolve, reject) => {
    const client = url.startsWith('https') ? https : http;
    client.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        resolve({
          status: res.statusCode,
          headers: res.headers,
          body: data.substring(0, 500)
        });
      });
    }).on('error', reject);
  });
}

async function runTests() {
  console.log('=== MANUAL TEST RESULTS ===');
  
  // Test T5: Database verification
  try {
    const blogAPI = await testEndpoint('http://localhost:5000/api/blog');
    const hasPosts = blogAPI.body.includes('GPT-4o');
    console.log('T5 Database Test:', hasPosts ? 'PASS' : 'FAIL');
    console.log('   Posts found:', hasPosts);
  } catch (e) {
    console.log('T5 Database Test: FAIL -', e.message);
  }
  
  // Test T6: API endpoint
  try {
    const fileAPI = await testEndpoint('http://localhost:5000/api/blog/file/how-gpt-4o-is-revolutionizing-business-automation-in-2025');
    const hasContent = fileAPI.body.includes('title') && fileAPI.body.includes('content');
    console.log('T6 API Test:', hasContent ? 'PASS' : 'FAIL');
    console.log('   API Response:', fileAPI.status === 200 ? 'OK' : 'ERROR');
  } catch (e) {
    console.log('T6 API Test: FAIL -', e.message);
  }
  
  // Test T8: Blog route
  try {
    const blogPage = await testEndpoint('http://localhost:5000/blog');
    const hasHTML = blogPage.body.includes('<!DOCTYPE html>');
    console.log('T8 Blog Route:', hasHTML ? 'PASS' : 'FAIL');
    console.log('   HTML Structure:', hasHTML);
  } catch (e) {
    console.log('T8 Blog Route: FAIL -', e.message);
  }
  
  // Test T9: Individual post route
  try {
    const postPage = await testEndpoint('http://localhost:5000/blog/how-gpt-4o-is-revolutionizing-business-automation-in-2025');
    const hasHTML = postPage.body.includes('<!DOCTYPE html>');
    console.log('T9 Post Route:', hasHTML ? 'PASS' : 'FAIL');
    console.log('   HTML Structure:', hasHTML);
  } catch (e) {
    console.log('T9 Post Route: FAIL -', e.message);
  }
}

runTests();