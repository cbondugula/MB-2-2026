import { describe, it, expect, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import MedicalProfessionalDashboard from '../pages/MedicalProfessionalDashboard'

// Mock the API calls
vi.mock('@/lib/queryClient', () => ({
  apiRequest: vi.fn(() => Promise.resolve({
    json: () => Promise.resolve({
      dashboardData: {
        activeProjects: 12,
        completedApplications: 45,
        complianceScore: 98,
        recentActivity: []
      }
    })
  }))
}))

const createTestQueryClient = () => new QueryClient({
  defaultOptions: {
    queries: { retry: false },
    mutations: { retry: false },
  },
})

const TestWrapper = ({ children }: { children: React.ReactNode }) => (
  <QueryClientProvider client={createTestQueryClient()}>
    {children}
  </QueryClientProvider>
)

describe('MedicalProfessionalDashboard', () => {
  it('renders dashboard header', async () => {
    render(
      <TestWrapper>
        <MedicalProfessionalDashboard />
      </TestWrapper>
    )

    await waitFor(() => {
      expect(screen.getByText(/Medical Professional Dashboard/i)).toBeInTheDocument()
    })
  })

  it('displays key metrics', async () => {
    render(
      <TestWrapper>
        <MedicalProfessionalDashboard />
      </TestWrapper>
    )

    await waitFor(() => {
      expect(screen.getByTestId('metric-active-projects')).toBeInTheDocument()
      expect(screen.getByTestId('metric-compliance-score')).toBeInTheDocument()
    })
  })

  it('shows HIPAA compliance status', async () => {
    render(
      <TestWrapper>
        <MedicalProfessionalDashboard />
      </TestWrapper>
    )

    await waitFor(() => {
      expect(screen.getByText(/HIPAA Compliance/i)).toBeInTheDocument()
    })
  })
})