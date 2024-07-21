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

// Modal dışında tıklama ile kapatma
window.onclick = function(event) {
    const modal = document.getElementById('modal');
    if (event.target === modal) {
        closeModal();
    }
}
