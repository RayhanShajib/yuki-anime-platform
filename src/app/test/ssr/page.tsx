import { pageApi } from "@/lib/api/pageApi";

export default async function TestSSRPage() {
  // Testing different pageApi functions
  try {
    console.log('Testing pageApi functions...');
    
    // Test 1: Home Page Data
    console.log('\n1. Testing Home Page Data:');
    const homeData = await pageApi.getHomePageData();
    console.log('Home Page Data:', homeData);

    // Test 2: Popular Page Data
    console.log('\n2. Testing Popular Page Data:');
    const popularData = await pageApi.getPopularPageData();
    console.log('Popular Page Data:', popularData);

    // Test 3: Anime Info Page Data
    console.log('\n3. Testing Anime Info Page Data:');
    // Using a sample anime ID - replace with a real one from your API
    const animeData = await pageApi.getAnimeInfoPageData('1');
    console.log('Anime Info Data:', JSON.stringify(animeData, null, 2));

    return (
      <div className="p-8">
        <h1 className="text-2xl font-bold mb-4">SSR API Test Page</h1>
        <p className="text-green-500 mb-4">✅ Tests running - Check server console for results</p>
        
        <div className="space-y-4">
          <div className="p-4 bg-gray-800 rounded">
            <h2 className="font-bold mb-2">Home Page Data Test:</h2>
            <pre className="whitespace-pre-wrap">
              {JSON.stringify(homeData, null, 2)}
            </pre>
          </div>

          <div className="p-4 bg-gray-800 rounded">
            <h2 className="font-bold mb-2">Popular Page Data Test:</h2>
            <pre className="whitespace-pre-wrap">
              {JSON.stringify(popularData, null, 2)}
            </pre>
          </div>

          <div className="p-4 bg-gray-800 rounded">
            <h2 className="font-bold mb-2">Anime Info Data Test:</h2>
            <pre className="whitespace-pre-wrap">
              {JSON.stringify(animeData, null, 2)}
            </pre>
          </div>
        </div>
      </div>
    );
  } catch (error) {
    console.error('Error in SSR tests:', error);
    return (
      <div className="p-8">
        <h1 className="text-2xl font-bold mb-4">SSR API Test Page</h1>
        <p className="text-red-500">❌ Error occurred - Check server console</p>
        <pre className="whitespace-pre-wrap bg-red-900/20 p-4 rounded mt-4">
          {error instanceof Error ? error.message : 'Unknown error'}
        </pre>
      </div>
    );
  }
}
