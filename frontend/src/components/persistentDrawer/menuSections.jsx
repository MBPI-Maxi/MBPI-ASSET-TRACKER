import AddBoxIcon from '@mui/icons-material/AddBox';
import EditIcon from '@mui/icons-material/Edit';
import QrCodeIcon from '@mui/icons-material/QrCode';
import QrCodeScannerIcon from '@mui/icons-material/QrCodeScanner';
import SummarizeIcon from '@mui/icons-material/Summarize';
import TrendingDown  from '@mui/icons-material/TrendingDown';
import BuildIcon from '@mui/icons-material/Build';
import SearchIcon from '@mui/icons-material/Search';

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
      { label: 'Scan QR Code', icon: <QrCodeScannerIcon />, path: 'qrcode/scan' }
    ],
  },
  {
    title: 'Summary',
    items: [
      // { label: 'Asset Summary', icon: <SummarizeIcon />, path: 'summary/assets' },
      { label: 'Department Purchased Summary', icon: <SummarizeIcon />, path: 'summary/department-purchased' },
      { label: 'Asset Verification Scan Summary', icon: <SummarizeIcon />, path: 'summary/asset-scan-verification' },
      { label: 'Label Generation Summary', icon: <SummarizeIcon />, path: 'summary/label-generation' },
    ],
  },
  {
    title: 'Depreciation',
    items: [
      { label: 'Compute Depreciation', icon: <TrendingDown/>, path: 'summary/depreciation/report'  }
    ]
  },
  {
    title: 'Maintenance',
    items: [
      { label: 'Add item', icon: <BuildIcon />, path: 'summary/maintenance/add' },
      { label: 'View Report', icon: <SearchIcon />, path: 'summary/maintenance/list'  }
    ]
  }
];

export default menuSections;