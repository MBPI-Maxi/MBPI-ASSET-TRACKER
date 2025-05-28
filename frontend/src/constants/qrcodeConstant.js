export const qrcodeRegionId = "html5qr-code-full-region";

export function qrCodeCreateConfig(props) {
    let config = {};

    if (props.fps) {
        config.fps = props.fps;
    }

    if (props.supportedScanTypes) {
        config.supportedScanTypes = props.supportedScanTypes
    }

    if (props.qrbox) {
        config.qrbox = props.qrbox;
    }

    if (props.aspectRatio) {
        config.aspectRatio = props.aspectRatio;
    }

    if (props.disableFlip !== undefined) {
        config.disableFlip = props.disableFlip;
    }
    return config;
}