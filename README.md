# React Vega Assistant

![License](https://img.shields.io/badge/License-MIT-blue.svg) ![React](https://img.shields.io/badge/React-18.x-61DAFB.svg) ![Vite](https://img.shields.io/badge/Vite-5.x-646CFF.svg) ![Tailwind](https://img.shields.io/badge/Tailwind-3.x-38B2AC.svg)

**Doğal dil işleme (NLP)** ve **Vega-Lite** gücünü birleştirerek, sadece ne görmek istediğinizi yazarak saniyeler içinde etkileşimli grafikler oluşturun.


## 🌟 Özellikler

Bu proje, veri görselleştirmeyi herkes için erişilebilir kılar:

*   **🗣️ Doğal Dil Komutları:** Karmaşık menülerle uğraşmak yerine *"Tarih ve Satış Miktarı için çizgi grafiği"* yazmanız yeterli.
*   **📊 Akıllı Analiz:** Yüklediğiniz veriyi otomatik analiz eder ve en uygun görselleştirme türünü önerir.
*   **🎨 Vega-Lite Altyapısı:** Arka planda güçlü Vega-Lite kütüphanesini kullanarak endüstri standardında grafikler üretir.
*   **📥 Kolay Dışa Aktarma:** Oluşturduğunuz grafikleri tek tıkla **PNG** formatında indirin.
*   **💻 Geliştirici Dostu:** Grafiğin JSON (spec) yapısını kopyalayarak kendi projelerinizde veya Vega editöründe kullanın.
*   **🌙 Modern Arayüz:** Tailwind CSS ile tasarlanmış, karanlık mod (dark mode) uyumlu şık arayüz.

## 🛠️ Teknolojiler

*   **[React](https://react.dev/):** Kullanıcı arayüzü için.
*   **[Vite](https://vitejs.dev/):** Hızlı geliştirme ve build süreçleri için.
*   **[Vega-Lite](https://vega.github.io/vega-lite/):** Görselleştirme grameri.
*   **[Tailwind CSS](https://tailwindcss.com/):** Stil ve tasarım için.
*   **[Lucide React](https://lucide.dev/):** Güzel ikonlar için.

## 🚀 Kurulum

Projeyi yerel makinenizde çalıştırmak için adımları izleyin:

1.  **Projeyi Klonlayın:**
    ```bash
    git clone https://github.com/kullaniciadi/react-vega-assistant.git
    cd react-vega-assistant
    ```

2.  **Bağımlılıkları Yükleyin:**
    ```bash
    npm install
    ```

3.  **Uygulamayı Başlatın:**
    ```bash
    npm run dev
    ```
    Tarayıcınızda `http://localhost:5173` adresine gidin.

## 💡 Kullanım

Arayüzdeki metin kutusuna aşağıdaki gibi komutlar yazarak grafikleri deneyimleyin:

*   *"X ekseninde Kategori, Y ekseninde Değer olsun"*
*   *"Fiyat ve Stok durumu için scatter plot çiz"*
*   *"Aylara göre satış dağılımını göster (line chart)"*
*   *"Bölgelere göre karlılık (bar chart)"*