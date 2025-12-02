
const WOO_URL_1 = "https://pagos.saprix.com.co";
const WOO_URL_2 = "https://saprix.com.co";
const CK = "ck_88721898d82f29e0f8664d7e3316aa460340f587";
const CS = "cs_37ebd5161dd1ed62e199570e702fb7d123454569";

const auth = Buffer.from(`${CK}:${CS}`).toString('base64');


async function testUrl(baseUrl, endpoint, params = {}) {
    const url = new URL(`${baseUrl}/wp-json/wc/v3/${endpoint}`);
    url.searchParams.append("consumer_key", CK);
    url.searchParams.append("consumer_secret", CS);
    Object.keys(params).forEach(key => url.searchParams.append(key, params[key]));

    console.log(`Testing: ${url.toString()}`);

    try {
        const response = await fetch(url.toString(), {
            headers: {
                'Authorization': `Basic ${auth}`,
                'User-Agent': 'Saprix-Debug-Script/1.0'
            }
        });

        if (!response.ok) {
            console.log(`FAILED: ${response.status} ${response.statusText}`);
            const text = await response.text();
            console.log(`Body: ${text.substring(0, 100)}...`);
            return;
        }

        const data = await response.json();
        console.log(`SUCCESS: Found ${Array.isArray(data) ? data.length : 'object'} items.`);
    } catch (error) {
        console.log(`ERROR: ${error.message}`);
    }
}

async function runTests() {
    console.log("--- Test 1: Products on pagos.saprix.com.co ---");
    await testUrl(WOO_URL_1, "products", { per_page: 1 });

    console.log("\n--- Test 2: Order 9744 on pagos.saprix.com.co ---");
    await testUrl(WOO_URL_1, "orders/9744", {});

    console.log("\n--- Test 3: Products on saprix.com.co ---");
    await testUrl(WOO_URL_2, "products", { per_page: 1 });
}

runTests();
