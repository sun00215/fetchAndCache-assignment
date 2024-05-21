// const fetchURL = 'https://picsum.photos/200/300'
const fetchURL ='https://picsum.photos/v2/list'
const cacheName = 'myCache-v1'
const cacheExpiry = 7 * 24 * 60 * 60 * 1000
document.getElementById('saveBtn').addEventListener('click', fetchAndCacheImage)
document.getElementById('retrieveBtn').addEventListener('click', getImage)

/*Write a function fetchAndCacheImage(url: string): Promise<void> that performs the following steps:Fetches an image from the given URL.
Stores data into a file and save it in cache.*/
async function fetchAndCacheImage() {
    try{
        const response = await fetch(fetchURL)
        if (!response.ok) throw new Error('Network response was not ok')
        const data = await response.json()
        // console.log(data)

        const cache = await caches.open(cacheName)
        for (const file of data) {
            const imageResponse = await fetch(file.download_url)
            if (!imageResponse.ok) throw new Error('Failed to fetch image')
            // console.log(imageResponse);

            //https://chatgpt.com/share/069896a9-d29b-4561-924f-3a4b397e0437
            const expiryData = new Date(Date.now() + cacheExpiry).toUTCString()
            const headers = new Headers(imageResponse.headers)
            headers.set('expires', expiryData)

            const cacheResponse = new Response(imageResponse.body, { headers })
            // console.log(cacheResponse);
            await cache.put(file.download_url, cacheResponse)

        }
        alert('Images are cached successfully')
    
    } catch (error) {
        console.error('Failed to fetch and cache',error)
    
}
}



// Write a function getImage(url: string): Promise<Blob> that:
// Checks if the image is already in the cache.
// If it is, retrieves it from the cache.
// If it is not, calls fetchAndCacheImage to fetch and cache the image, then returns the fetched image from the cache
async function getImage() {
    try {
        const df = new DocumentFragment()
        const cache = await caches.open(cacheName)
        const keys = await cache.keys()
        if (keys.length === 0) {
            await fetchAndCacheImage()
        }
        for (const request of keys) {
            const response = await cache.match(request)
            if(response) {
                const imageBlob = await response.blob()
                console.log(imageBlob);
                const imgWrapper = document.createElement('div')
                const imgURL = URL.createObjectURL(imageBlob)
                const img = document.createElement('img')
                img.src = imgURL
                img.style.width = '200px'
                img.style.height = '200px'
                imgWrapper.appendChild(img)
                df.appendChild(imgWrapper)
            }
        }
        document.getElementById('output').appendChild(df)

    } catch (error) {
        console.error('Failed to get image', error)
    
 }
}


//  Implement a mechanism to handle cache expiration (7 days). Update fetchAndCacheImage and getImage functions to include this mechanism.
//  I'm not sure about how to implement the cache expiration mechanism. I have added the cache expiration mechanism to the fetchAndCacheImage. The cache expiration time is set to 7 days. 

// Add robust error handling to both functions to manage potential network failures and caching errors.
// I have added error handling in both functions to manage potential network failures and caching errors.


// Demonstrate the usage of fetchAndCacheImage and getImage functions with an example
// I have demonstrated the usage of fetchAndCacheImage and getImage functions with an example.  The getImage function retrieves the images from the cache and displays them on the webpage.