import Typography from '@mui/material/Typography';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import Paper from '@mui/material/Paper';

const steps = [
  'Create a new asset entry.',
  'Update or delete assets in the Asset Management page.',
  'View asset QR codes in the QR Code panel.',
  'Generate reports: Scan Verification, Department Summary, Label Generation.',
  'Record maintenance reports for asset issues.',
  'Automatically compute depreciation value for items with a cost.',
];

export default function HowItWorksSteps() {
  return (
    <Paper elevation={3} sx={{ p: 4, mt: 4, maxWidth: 600 }}>
      <Typography variant="h5" gutterBottom>
        How the System Works
      </Typography>
      <Stepper orientation="vertical" nonLinear activeStep={-1}>
        {steps.map((label, index) => (
          <Step key={index}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>
    </Paper>
  );
}
