import QRCode from 'qrcode';
import {useState} from "react";

const QR = ({ url, size }) => {
  const [QRSrc, setQRSrc] = useState('');

  console.log(url);
  QRCode.toDataURL(url).then((data) => {
    console.log(data);
    setQRSrc(data);
  });

  return (
    <a href={QRSrc} download='qrcode.png'>
      <img src={QRSrc} alt="QR Code" width={size} height={size} />
    </a>
  )
}

export default QR;