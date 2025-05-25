import React from 'react';
// import {
//   Card,
//   CardContent,
//   CardActions,
//   Grid,
//   Skeleton,
//   Paper,
//   TableContainer,
//   Table,
//   TableHead,
//   TableRow,
//   TableCell,
//   TableBody
// } from '@mui/material';

import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Grid from '@mui/material/Grid';
import Skeleton from '@mui/material/Skeleton';
import Paper from '@mui/material/Paper';
import TableContainer from '@mui/material/TableContainer';
import Table from '@mui/material/Table';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import TableBody from '@mui/material/TableBody';

export function QRCodeSkeleton({ count = 5 }) {
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

export function RenderLoadingScreenTable({ rowCount = 5 }) {
  return (
    <Paper elevation={1}>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell><Skeleton variant="text" width="40%" /></TableCell>
              <TableCell><Skeleton variant="text" width="30%" /></TableCell>
              <TableCell><Skeleton variant="text" width="30%" /></TableCell>
              <TableCell><Skeleton variant="text" width="40%" /></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {[...Array(rowCount)].map((_, index) => (
              <TableRow key={index}>
                <TableCell><Skeleton variant="text" /></TableCell>
                <TableCell><Skeleton variant="text" /></TableCell>
                <TableCell><Skeleton variant="text" /></TableCell>
                <TableCell><Skeleton variant="text" /></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
}