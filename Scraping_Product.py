import asyncio
import pandas as pd
from playwright.async_api import async_playwright

async def scrape_tokopedia(max_page=10):
    all_data = []

    async with async_playwright() as p:
        browser = await p.chromium.launch(
            headless=False,
            args=["--start-maximized"]
        )

        context = await browser.new_context(
            user_agent="Mozilla/5.0",
            viewport={"width": 1280, "height": 800}
        )

        page = await context.new_page()

        for page_num in range(1, max_page + 1):
            print(f"🔄 Scraping halaman {page_num}")

            url = f"https://www.tokopedia.com/p/makanan-minuman/bahan-kue?page={page_num}" # Ubah url sesuai kategori yang diinginkan
            await page.goto(url, wait_until="domcontentloaded")
            await page.wait_for_timeout(4000)

            for _ in range(5):
                await page.mouse.wheel(0, 5000)
                await page.wait_for_timeout(1500)

            products = await page.query_selector_all("div[data-testid='divProductWrapper']")
            print(f"   → {len(products)} produk")

            for item in products:
                try:
                    spans = await item.query_selector_all("span")

                    texts = []
                    for s in spans:
                        t = await s.inner_text()
                        texts.append(t.strip())

                    # Mengambil nama produk 
                    name = None
                    for t in texts:
                        if len(t) > 10 and "Rp" not in t:
                            name = t
                            break

                    # Mengambil harga
                    price = None
                    for t in texts:
                        if "Rp" in t:
                            price = t
                            break

                    if not name or not price:
                        continue

                    all_data.append({
                        "name": name,
                        "price_raw": price
                    })

                except:
                    continue

        await browser.close()

    df = pd.DataFrame(all_data)

    if df.empty:
        print("Data kosong")
        return df

    # Cleaning harga
    df["price"] = (
        df["price_raw"]
        .str.replace("Rp", "", regex=False)
        .str.replace(".", "", regex=False)
        .astype(int)
    )

    df.drop(columns=["price_raw"], inplace=True)

    return df


if __name__ == "__main__":
    df = asyncio.run(scrape_tokopedia(max_page=10))

    if not df.empty:
        # Menambahkan kolom 'Kategori'
        df['Kategori'] = 'Bahan Kue'  # Ganti dengan kategori yang sesuai
        
        # Simpan ke CSV
        df.to_csv("tokopedia_produk_bahan-kue.csv", index=False)
        
        print("Data berhasil disimpan dengan kolom Kategori!")
        print(df.head()) # Menampilkan beberapa baris pertama
    else:
        print("Tidak ada data ke-scrape")

if 'df' in locals() and not df.empty:
    print(df.info())
