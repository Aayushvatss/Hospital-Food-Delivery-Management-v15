'use client'

import { useState, useEffect } from 'react'
import { getPatients, getDietCharts, getMealDeliveries, getPantryPerformance } from '../../services/api'
import PatientManagement from '../../components/PatientManagement'
import DietChartManagement from '../../components/DietChartManagement'
import DeliveryTracking from '../../components/DeliveryTracking'
import PantryPerformance from '../../components/PantryPerformance'
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle } from 'lucide-react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function ManagerDashboard() {
  const [patients, setPatients] = useState([])
  const [dietCharts, setDietCharts] = useState([])
  const [deliveries, setDeliveries] = useState([])
  const [pantryPerformance, setPantryPerformance] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true)
        setError(null)
        const [patientsData, dietChartsData, deliveriesData, performanceData] = await Promise.all([
          getPatients(),
          getDietCharts(),
          getMealDeliveries(),
          getPantryPerformance()
        ])

        setPatients(patientsData)
        setDietCharts(dietChartsData)
        setDeliveries(deliveriesData)
        setPantryPerformance(performanceData)
      } catch (error) {
        console.error('Error fetching data:', error)
        setError('Failed to fetch dashboard data. Please try again later.')
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [])

  if (isLoading) {
    return <div>Loading dashboard data...</div>
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-3xl font-bold mb-8">Hospital Food Manager Dashboard</h1>
      
      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Tabs defaultValue="patients" className="space-y-4">
        <TabsList>
          <TabsTrigger value="patients">Patients</TabsTrigger>
          <TabsTrigger value="dietCharts">Diet Charts</TabsTrigger>
          <TabsTrigger value="deliveries">Deliveries</TabsTrigger>
          <TabsTrigger value="performance">Pantry Performance</TabsTrigger>
        </TabsList>

        <TabsContent value="patients">
          <PatientManagement patients={patients} setPatients={setPatients} />
        </TabsContent>

        <TabsContent value="dietCharts">
          <DietChartManagement dietCharts={dietCharts} setDietCharts={setDietCharts} patients={patients} />
        </TabsContent>

        <TabsContent value="deliveries">
          <DeliveryTracking deliveries={deliveries} setDeliveries={setDeliveries} />
        </TabsContent>

        <TabsContent value="performance">
          <PantryPerformance performance={pantryPerformance} />
        </TabsContent>
      </Tabs>
    </div>
  )
}

