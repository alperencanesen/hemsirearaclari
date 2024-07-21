function showTool(toolId) {
    if (toolId === 'ilacDozu') {
        openModal(`
            <h2>İlaç Dozu Hesaplayıcı</h2>
            <label for="mevcutDoz">Mevcut Doz (mg):</label>
            <input type="number" id="mevcutDoz" name="mevcutDoz"><br><br>
            <label for="gerekenDoz">Gereken Doz (mg):</label>
            <input type="number" id="gerekenDoz" name="gerekenDoz"><br><br>
            <button onclick="hesaplaDoz()">Hesapla</button>
            <p id="sonuc"></p>
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
    const mevcutDoz = document.getElementById('mevcutDoz').value;
    const gerekenDoz = document.getElementById('gerekenDoz').value;
    if (mevcutDoz && gerekenDoz) {
        const sonuc = (gerekenDoz / mevcutDoz).toFixed(2);
        document.getElementById('sonuc').innerText = `Hesaplanan Doz: ${sonuc} ml`;
    } else {
        document.getElementById('sonuc').innerText = "Lütfen tüm değerleri giriniz.";
    }
}

// Modal dışında tıklama ile kapatma
window.onclick = function(event) {
    const modal = document.getElementById('modal');
    if (event.target === modal) {
        closeModal();
    }
}
