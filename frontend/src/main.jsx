import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'
import { CssBaseline } from '@mui/material'
import { QueryClientProvider, QueryClient } from '@tanstack/react-query'
import { FormProvider } from '@context/FormProvider.jsx'
import router from './router.jsx'

const queryClient = new QueryClient();

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <CssBaseline />
    <QueryClientProvider client={queryClient} >
      <FormProvider>
        
          <RouterProvider router={router} />
        
      </FormProvider>
    </QueryClientProvider>
  </StrictMode>
)

