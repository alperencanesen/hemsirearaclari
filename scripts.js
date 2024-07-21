const apiKey = 'sk-svcacct-IwnHxgn9YIdMAmlOwBGZT3BlbkFJPoUYn2Os7y9lYC98ES7H'; // Your OpenAI API key
const assistantId = 'asst_wAT1GzpOybGgSlIfSwuoeJ1w';
const vectorStorageId = 'vs_618wHakiycjwb0gT9hcoWywS';

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
    } else if (toolId === 'hemsirelikTanisi') {
        openModal(`
            <h2>Hemşirelik Tanısı Yardım Programı</h2>
            <label for="hastaBilgi">Hasta Hikayesi ve Bilgileri:</label>
            <textarea id="hastaBilgi" name="hastaBilgi" rows="10" cols="50"></textarea><br><br>
            <button onclick="gonderOpenAI()">Gönder</button>
            <p id="hemsirelikSonuc"></p>
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
                temperature: 0.01
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

// Modal dışında tıklama ile kapatma
window.onclick = function(event) {
    const modal = document.getElementById('modal');
    if (event.target === modal) {
        closeModal();
    }
}

// Hemşirelik Tanılarını Getir Butonu
function showNursingDiagnoses() {
    openModal(`
        <h2>Hemşirelik Tanıları</h2>
        <button onclick="getNursingDiagnoses()">Tanıları Getir</button>
        <p id="nursingDiagnoses"></p>
    `);
}
