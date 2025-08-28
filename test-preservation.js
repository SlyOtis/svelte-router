import puppeteer from 'puppeteer';

async function testRouterPreservation() {
    console.log('🧪 Testing Router Component Preservation...\n');
    
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    
    const logs = [];
    let adminInstanceId = null;
    let shopInstanceId = null;
    
    page.on('console', msg => {
        const text = msg.text();
        logs.push(text);
        
        if (text.includes('[Admin Layout') && text.includes('MOUNTED')) {
            const match = text.match(/\[Admin Layout ([a-z0-9]+)\]/);
            if (match) {
                if (adminInstanceId === null) {
                    adminInstanceId = match[1];
                    console.log(`✓ Admin Layout mounted with ID: ${adminInstanceId}`);
                } else if (adminInstanceId === match[1]) {
                    console.log(`✗ ISSUE: Admin Layout RE-MOUNTED with same ID: ${adminInstanceId}`);
                } else {
                    console.log(`✗ ISSUE: Admin Layout RE-MOUNTED with new ID: ${match[1]} (was ${adminInstanceId})`);
                    adminInstanceId = match[1];
                }
            }
        }
        
        if (text.includes('[Admin Layout') && text.includes('DESTROYED')) {
            console.log(`✗ Admin Layout DESTROYED`);
            adminInstanceId = null;
        }
        
        if (text.includes('[Shop Layout') && text.includes('MOUNTED')) {
            const match = text.match(/\[Shop Layout ([a-z0-9]+)\]/);
            if (match) {
                shopInstanceId = match[1];
                console.log(`✓ Shop Layout mounted with ID: ${shopInstanceId}`);
            }
        }
    });
    
    try {
        console.log('1️⃣ Navigate to /admin');
        await page.goto('http://localhost:5173/admin');
        await page.waitForTimeout(500);
        
        console.log('\n2️⃣ Navigate to /admin/settings (child route)');
        await page.goto('http://localhost:5173/admin/settings');
        await page.waitForTimeout(500);
        
        console.log('\n3️⃣ Navigate to /admin/profile (another child route)');
        await page.goto('http://localhost:5173/admin/profile');
        await page.waitForTimeout(500);
        
        console.log('\n4️⃣ Navigate to /shop (different parent)');
        await page.goto('http://localhost:5173/shop');
        await page.waitForTimeout(500);
        
        console.log('\n5️⃣ Navigate back to /admin');
        await page.goto('http://localhost:5173/admin');
        await page.waitForTimeout(500);
        
        console.log('\n📊 Test Results:');
        console.log('================');
        
        const adminMounts = logs.filter(log => log.includes('[Admin Layout') && log.includes('MOUNTED')).length;
        const adminDestroys = logs.filter(log => log.includes('[Admin Layout') && log.includes('DESTROYED')).length;
        
        if (adminMounts === 2 && adminDestroys === 1) {
            console.log('✅ PASS: Admin Layout preserved during child navigation!');
            console.log(`   - Mounted ${adminMounts} times (expected: 2 - initial and after returning from /shop)`);
            console.log(`   - Destroyed ${adminDestroys} time (expected: 1 - when navigating to /shop)`);
        } else {
            console.log('❌ FAIL: Admin Layout not properly preserved');
            console.log(`   - Mounted ${adminMounts} times`);
            console.log(`   - Destroyed ${adminDestroys} times`);
        }
        
    } catch (error) {
        console.error('Test failed:', error);
    } finally {
        await browser.close();
    }
}

testRouterPreservation().catch(console.error);