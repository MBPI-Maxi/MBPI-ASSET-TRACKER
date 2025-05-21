import React from 'react';
import {
  Card,
  CardContent,
  CardActions,
  Grid,
  Skeleton
} from '@mui/material';

export default function QRCodeSkeleton({ count = 5 }) {
  // Render `count` skeleton cards, default 5
  const newArray = new Array(count);

  return (
    <>
      {
        Array.from(newArray).map((_, index) => (
          <Grid key={index} sx={{ width: "250px" }}>
            <Card sx={{ maxWidth: 400, p: 3, borderRadius: "20px" }}>
              <Skeleton variant="rectangular" height={200} sx={{ mb: 2, borderRadius: 1 }} />
              <CardContent>
                <Skeleton variant="text" width="60%" height={30} sx={{ mb: 1 }} />
                <Skeleton variant="text" width="80%" />
                <Skeleton variant="text" width="80%" />
                <Skeleton variant="text" width="80%" />
                <Skeleton variant="text" width="80%" />
              </CardContent>
              <CardActions>
                <Skeleton variant="rectangular" width={60} height={30} />
              </CardActions>
            </Card>
          </Grid>
        ))
      }
    </>
  );
}
