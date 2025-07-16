"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Plus, Edit, Trash2, Clock, DollarSign } from "lucide-react"
import { ServiceForm } from "./service-form"
import type { Service } from "@/types"

// Mock services data
const mockServices: Service[] = [
  {
    id: "1",
    name: "Signature Cut & Style",
    description: "Premium haircut with personalized styling consultation",
    category: "Styling",
    duration_minutes: 90,
    price: 450,
  },
  {
    id: "2",
    name: "Luxury Blowout",
    description: "Professional blow-dry with premium products",
    category: "Styling",
    duration_minutes: 45,
    price: 280,
  },
  {
    id: "3",
    name: "Full Color Transformation",
    description: "Complete color service with consultation and aftercare",
    category: "Colour",
    duration_minutes: 180,
    price: 850,
  },
]

export function ServiceManagement() {
  const [services, setServices] = useState<Service[]>(mockServices)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingService, setEditingService] = useState<Service | null>(null)

  const handleAddService = (serviceData: Omit<Service, "id">) => {
    const newService = {
      ...serviceData,
      id: Date.now().toString(),
    }
    setServices([...services, newService])
    setIsDialogOpen(false)
  }

  const handleEditService = (service: Service) => {
    setEditingService(service)
    setIsDialogOpen(true)
  }

  const handleDeleteService = (serviceId: string) => {
    setServices(services.filter((s) => s.id !== serviceId))
  }

  const getCategoryColor = (category: string) => {
    switch (category.toLowerCase()) {
      case "styling":
        return "bg-blue-100 text-blue-800"
      case "colour":
        return "bg-purple-100 text-purple-800"
      case "treatments":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Manage Services</CardTitle>
            <CardDescription>Add, edit, or remove your salon services</CardDescription>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => setEditingService(null)}>
                <Plus className="h-4 w-4 mr-2" />
                Add New Service
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>{editingService ? "Edit Service" : "Add New Service"}</DialogTitle>
                <DialogDescription>
                  {editingService ? "Update the service details below." : "Fill in the details for your new service."}
                </DialogDescription>
              </DialogHeader>
              <ServiceForm
                service={editingService}
                onSubmit={handleAddService}
                onCancel={() => setIsDialogOpen(false)}
              />
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Duration</TableHead>
              <TableHead>Price</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {services.map((service) => (
              <TableRow key={service.id}>
                <TableCell>
                  <div>
                    <div className="font-medium">{service.name}</div>
                    <div className="text-sm text-gray-500">{service.description}</div>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge className={getCategoryColor(service.category)}>{service.category}</Badge>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4 text-gray-500" />
                    <span>{service.duration_minutes} min</span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    <DollarSign className="h-4 w-4 text-gray-500" />
                    <span>R {service.price}</span>
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button size="sm" variant="outline" onClick={() => handleEditService(service)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => handleDeleteService(service.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
