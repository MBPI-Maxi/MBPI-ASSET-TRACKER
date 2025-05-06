function GenerateQr() {
    // left-side yung mga fields tapos yung right side yung generation ng QR code
    return (
        <div className="generate-qr-ctn">
            <div>
                <p>tawag api dito to generate list ng item na nadagdag</p>
                <AssetGeneration />
            </div>
            <div>
                <button>Generate QR</button>
                <QrBox />
            </div>
        </div>
    )
}

function AssetGeneration() {
    return (
        <div>
            <select name="" id="" className="select-item">
                <option value="">Select Item</option>
            </select>
        </div>
    )
}

function QrBox() {
    return (
        <div className="qr-box">
            QR BOX here
        </div>
    )
}

export default GenerateQr;