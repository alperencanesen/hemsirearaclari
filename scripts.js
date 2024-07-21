const apiKey = 'sk-svcacct-IwnHxgn9YIdMAmlOwBGZT3BlbkFJPoUYn2Os7y9lYC98ES7H'; // Doğru OpenAI API anahtarını buraya ekleyin

function showTool(toolId) {
    if (toolId === 'ilacDozu') {
        openModal(`
            <h2>İlaç Dozu Hesaplayıcı</h2>
            <label for="mevcutDoz">Mevcut Doz (mg):</label>
            <input type="number" id="mevcutDoz" name="mevcutDoz"><br><br>
            <label for="toplamMl">Toplam ml:</label>
            <input type="number" id="toplamMl" name="toplamMl"><br><br>
            <label for="gerekenDoz">Gereken Doz (mg):</label>
            <input type="number" id="gerekenDoz" name="gerekenDoz"><br><br>
            <button onclick="hesaplaDoz()">Hesapla</button>
            <p id="sonuc"></p>
        `);
    } else if (toolId === 'tahminiDogum') {
        openModal(`
            <h2>Tahmini Doğum Tarihi Hesaplayıcı</h2>
            <label for="sonAdet">Son Adet Tarihi:</label>
            <input type="date" id="sonAdet" name="sonAdet"><br><br>
            <button onclick="hesaplaDogum()">Hesapla</button>
            <p id="dogumSonuc"></p>
        `);
    } else if (toolId === 'ivDripRate') {
        openModal(`
            <h2>Serum Damla Hızı Hesaplayıcı</h2>
            <label for="totalVolume">Toplam Hacim (ml):</label>
            <input type="number" id="totalVolume" name="totalVolume"><br><br>
            <label for="infusionTime">İnfüzyon Süresi (dk):</label>
            <input type="number" id="infusionTime" name="infusionTime"><br><br>
            <button onclick="hesaplaIvDripRate()">Hesapla</button>
            <p id="ivDripResult"></p>
        `);
    } else if (toolId === 'bmiCalculator') {
        openModal(`
            <h2>Vücut Kitle İndeksi Hesaplayıcı</h2>
            <label for="weight">Kilo (kg):</label>
            <input type="number" id="weight" name="weight"><br><br>
            <label for="height">Boy (cm):</label>
            <input type="number" id="height" name="height"><br><br>
            <button onclick="hesaplaBMI()">Hesapla</button>
            <p id="bmiResult"></p>
        `);
    } else if (toolId === 'hemsirelikTanisi') {
        openModal(`
            <h2>Hemşirelik Tanısı Yardım Programı</h2>
            <label for="hastaBilgi">Hasta Hikayesi ve Bilgileri:</label>
            <textarea id="hastaBilgi" name="hastaBilgi" rows="10" style="width: 100%;" placeholder="Lütfen hastanın kimlik bilgilerini yazmayınız, sadece gerekli olduğunu düşündüğünüz hasta/hastalık ilişkili bilgilere yer veriniz."></textarea><br><br>
            <button onclick="gonderOpenAI()">Gönder</button>
            <p id="hemsirelikSonuc"></p>
        `);
    } else if (toolId === 'fluidBalance') {
        openModal(`
            <h2>Sıvı Dengesi Tablosu</h2>
            <label for="inputFluid">Aldığı Sıvı (ml):</label>
            <input type="number" id="inputFluid" name="inputFluid"><br><br>
            <label for="outputFluid">Çıkan Sıvı (ml):</label>
            <input type="number" id="outputFluid" name="outputFluid"><br><br>
            <button onclick="hesaplaFluidBalance()">Hesapla</button>
            <p id="fluidBalanceResult"></p>
        `);
    } else {
        alert(`${toolId} aracı açılıyor.`);
    }
}

function openModal(content) {
    document.getElementById('modal-body').innerHTML = content;
    document.getElementById('modal').style.display = "block";
}

function closeModal() {
    document.getElementById('modal').style.display = "none";
}

function hesaplaDoz() {
    const mevcutDoz = parseFloat(document.getElementById('mevcutDoz').value);
    const toplamMl = parseFloat(document.getElementById('toplamMl').value);
    const gerekenDoz = parseFloat(document.getElementById('gerekenDoz').value);
    if (!isNaN(mevcutDoz) && !isNaN(toplamMl) && !isNaN(gerekenDoz) && mevcutDoz > 0 && toplamMl > 0) {
        const mevcutDozMl = mevcutDoz / toplamMl;
        const sonuc = (gerekenDoz / mevcutDozMl).toFixed(2);
        document.getElementById('sonuc').innerText = `Hesaplanan Doz: ${sonuc} ml`;
    } else {
        document.getElementById('sonuc').innerText = "Lütfen geçerli değerler giriniz.";
    }
}

function hesaplaDogum() {
    const sonAdet = new Date(document.getElementById('sonAdet').value);
    if (isNaN(sonAdet.getTime())) {
        document.getElementById('dogumSonuc').innerText = "Lütfen geçerli bir tarih giriniz.";
        return;
    }
    const dogumTarihi = new Date(sonAdet);
    dogumTarihi.setMonth(dogumTarihi.getMonth() + 9);
    dogumTarihi.setDate(dogumTarihi.getDate() + 7);

    const dogumGun = dogumTarihi.getDate().toString().padStart(2, '0');
    const dogumAy = (dogumTarihi.getMonth() + 1).toString().padStart(2, '0');
    const dogumYil = dogumTarihi.getFullYear();

    document.getElementById('dogumSonuc').innerText = `Tahmini Doğum Tarihi: ${dogumGun}/${dogumAy}/${dogumYil}`;
}

function hesaplaIvDripRate() {
    const totalVolume = parseFloat(document.getElementById('totalVolume').value);
    const infusionTime = parseFloat(document.getElementById('infusionTime').value);
    if (!isNaN(totalVolume) && !isNaN(infusionTime) && totalVolume > 0 && infusionTime > 0) {
        const dripRate = (totalVolume / infusionTime).toFixed(2);
        document.getElementById('ivDripResult').innerText = `Hesaplanan Damla Hızı: ${dripRate} ml/dk`;
    } else {
        document.getElementById('ivDripResult').innerText = "Lütfen geçerli değerler giriniz.";
    }
}

function hesaplaBMI() {
    const weight = parseFloat(document.getElementById('weight').value);
    const height = parseFloat(document.getElementById('height').value) / 100;
    if (!isNaN(weight) && !isNaN(height) && weight > 0 && height > 0) {
        const bmi = (weight / (height * height)).toFixed(2);
        document.getElementById('bmiResult').innerText = `Hesaplanan Vücut Kitle İndeksi: ${bmi}`;
    } else {
        document.getElementById('bmiResult').innerText = "Lütfen geçerli değerler giriniz.";
    }
}

async function gonderOpenAI() {
    const hastaBilgi = document.getElementById('hastaBilgi').value;
    if (!hastaBilgi.trim()) {
        document.getElementById('hemsirelikSonuc').innerText = "Lütfen geçerli hasta bilgilerini giriniz.";
        return;
    }

    document.getElementById('hemsirelikSonuc').innerHTML = `
        <p>Tanılar yükleniyor...</p>
        <div class="loader"></div>
    `;

    const instruction = `
        Verilen hasta bilgilerine göre en az 3 hemşirelik tanısı belirleyin ve her bir tanı için tanımlayıcı özellikler (tanının belirlenmesinde rol oynayan semptomlar ve bulgular), etiyolojisi (tanının altında yatan nedenler veya katkıda bulunan faktörler, .....'ya bağlı ...... tanısı gibi), hemşirelik tanısı (hastanın mevcut sağlık durumu veya sağlık probleminin tanımı), amaç (hemşirelik bakımı ile ulaşılması hedeflenen sonuç), beklenen hasta sonuçları (hemşirelik bakımının ardından hastadan beklenen spesifik sonuçlar), hemşirelik girişimleri (belirlenen tanı için yapılacak spesifik hemşirelik eylemleri ve uygulamalar) ve değerlendirme (hemşirelik girişimlerinin etkinliğini değerlendirmek için kullanılacak kriterler ve yöntemler) başlıklarını detaylandırarak hasta bakım planınızı oluşturun.
    `;

    const messages = [
        { role: 'system', content: 'You are an assistant that provides nursing diagnoses based on patient information.' },
        { role: 'user', content: `Hasta Hikayesi: ${hastaBilgi}\n${instruction}` }
    ];

    try {
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`
            },
            body: JSON.stringify({
                model: "gpt-4o",
                messages: messages,
                max_tokens: 4096,
                temperature: 0.1
            })
        });

        const data = await response.json();
        if (response.ok) {
            const resultHTML = data.choices[0].message.content.trim().replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/\n/g, '<br>');
            document.getElementById('hemsirelikSonuc').innerHTML = resultHTML;
        } else {
            console.error('API Response Error:', data);
            document.getElementById('hemsirelikSonuc').innerText = "Bir hata oluştu: " + data.error.message;
        }
    } catch (error) {
        console.error('Fetch Error:', error);
        document.getElementById('hemsirelikSonuc').innerText = "Bir hata oluştu: " + error.message;
    }
}

function hesaplaFluidBalance() {
    const inputFluid = parseFloat(document.getElementById('inputFluid').value);
    const outputFluid = parseFloat(document.getElementById('outputFluid').value);
    if (!isNaN(inputFluid) && !isNaN(outputFluid)) {
        const fluidBalance = inputFluid - outputFluid;
        document.getElementById('fluidBalanceResult').innerText = `Sıvı Dengesi: ${fluidBalance} ml`;
    } else {
        document.getElementById('fluidBalanceResult').innerText = "Lütfen geçerli değerler giriniz.";
    }
}



// Modal dışında tıklama ile kapatma
window.onclick = function(event) {
    const modal = document.getElementById('modal');
    if (event.target === modal) {
        closeModal();
    }
}

/* Yükleme Simgesi CSS */
const style = document.createElement('style');
style.innerHTML = `
.loader {
    border: 16px solid #f3f3f3;
    border-radius: 50%;
    border-top: 16px solid #3498db;
    width: 120px;
    height: 120px;
    animation: spin 2s linear infinite;
}

@keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
}
`;
document.head.appendChild(style);
