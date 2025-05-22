import AddBoxIcon from '@mui/icons-material/AddBox';
import EditIcon from '@mui/icons-material/Edit';
import QrCodeIcon from '@mui/icons-material/QrCode';
import SummarizeIcon from '@mui/icons-material/Summarize';

const menuSections = [
  {
    title: 'Asset',
    items: [
      { label: 'Add', icon: <AddBoxIcon />, path: 'asset/add' },
      { label: 'Update/Delete', icon: <EditIcon />, path: 'asset/manage' },
    ],
  },
  {
    title: 'QRCode',
    items: [
      { label: 'View QR Code', icon: <QrCodeIcon />, path: 'qrcode/view' },
    ],
  },
  {
    title: 'Summary',
    items: [
      // { label: 'Asset Summary', icon: <SummarizeIcon />, path: 'summary/assets' },
      { label: 'Department Purchased Summary', icon: <SummarizeIcon />, path: 'summary/department-purchased' },
      { label: 'Location Summary', icon: <SummarizeIcon />, path: 'summary/locations' },
    ],
  },
];

export default menuSections;