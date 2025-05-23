import exportFromJSON from 'export-from-json';

export function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
}

export function handleExport(data, fileName, exportType) {
    exportFromJSON({
        data,
        fileName,
        exportType
    });
}

export function addCommasToNumber(value) {
    return new Intl.NumberFormat("en-PH", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    }).format(value)
}