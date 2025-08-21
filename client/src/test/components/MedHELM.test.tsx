import { describe, it, expect, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import MedHELMDashboard from '../pages/MedHELMDashboard'

// Mock the MedHELM API calls
vi.mock('@/lib/queryClient', () => ({
  apiRequest: vi.fn(() => Promise.resolve({
    json: () => Promise.resolve({
      evaluationData: {
        totalEvaluations: 121,
        modelRecommendations: {
          'gpt-4o': 85,
          'claude-3-5-sonnet': 78
        },
        medicalTaskCategories: 5
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

describe('MedHELMDashboard', () => {
  it('renders MedHELM evaluation framework', async () => {
    render(
      <TestWrapper>
        <MedHELMDashboard />
      </TestWrapper>
    )

    await waitFor(() => {
      expect(screen.getByText(/Stanford MedHELM/i)).toBeInTheDocument()
    })
  })

  it('displays model recommendations', async () => {
    render(
      <TestWrapper>
        <MedHELMDashboard />
      </TestWrapper>
    )

    await waitFor(() => {
      expect(screen.getByTestId('model-recommendations')).toBeInTheDocument()
    })
  })

  it('shows 121 medical task evaluations', async () => {
    render(
      <TestWrapper>
        <MedHELMDashboard />
      </TestWrapper>
    )

    await waitFor(() => {
      expect(screen.getByText(/121/)).toBeInTheDocument()
    })
  })
})