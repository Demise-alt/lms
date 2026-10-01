"use client"

import * as React from "react"
import { PageContainer } from "@/components/layout/PageContainer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Award, Plus, Search, Download, Edit, Trash2, Eye, Calendar } from "lucide-react"
import { useCertificates } from "@/hooks/useCertificates"
import { useEmployees } from "@/hooks/useEmployees"
import { useTrainings } from "@/hooks/useTrainings"
import { useToast } from "@/hooks/use-toast"

interface Certificate {
  id: string
  certificate_number: string
  employee_id: string
  training_program_id: string
  issue_date: string
  expiry_date: string | null
  issuer_name: string
  file_path: string | null
  created_at: string
  updated_at: string
}

export function CertificatesPage() {
  const [searchTerm, setSearchTerm] = React.useState("")
  const { data: certificates, isLoading, isError } = useCertificates()
  const { data: employees } = useEmployees({ page: 1, size: 1000 })
  const { data: programs } = useTrainings()
  const { toast } = useToast()

  if (isLoading) {
    return (
      <PageContainer title="Certificates" description="Manage issued certificates and credentials">
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
        </div>
      </PageContainer>
    )
  }

  if (isError) {
    return (
      <PageContainer title="Certificates" description="Manage issued certificates and credentials">
        <div className="text-center py-12">
          <p className="text-destructive">Failed to load certificates. Please try again later.</p>
        </div>
      </PageContainer>
    )
  }

  const filteredCertificates = certificates?.filter(
    (cert) =>
      cert.certificate_number?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (employees?.find(e => e.id === cert.employee_id)?.first_name ?? "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (employees?.find(e => e.id === cert.employee_id)?.last_name ?? "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (programs?.find(p => p.id === cert.training_program_id)?.title ?? "").toLowerCase().includes(searchTerm.toLowerCase())
  ) ?? []

  const getStatusBadge = (cert: Certificate) => {
    if (cert.is_deleted) return <Badge variant="secondary">Revoked</Badge>
    if (cert.expiry_date && new Date(cert.expiry_date) < new Date()) {
      return <Badge variant="destructive">Expired</Badge>
    }
    return <Badge variant="success">Valid</Badge>
  }

  const getEmployeeName = (employeeId: string) => {
    const emp = employees?.find(e => e.id === employeeId)
    return emp ? `${emp.first_name} ${emp.last_name}` : `Employee ${employeeId.substring(0, 8)}...`
  }

  const getProgramTitle = (programId: string) => {
    const prog = programs?.find(p => p.id === programId)
    return prog?.title || `Program ${programId.substring(0, 8)}...`
  }

  return (
    <PageContainer title="Certificates" description="Manage issued certificates and credentials">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div className="relative max-w-sm flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search certificates..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button
          onClick={() => {
            toast({
              title: "Issue Certificate",
              description: "Certificate issuance feature coming soon",
              variant: "default"
            })
          }}
        >
          <Plus className="mr-2 h-4 w-4" />
          Issue Certificate
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Issued Certificates</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Certificate</TableHead>
                  <TableHead>Employee</TableHead>
                  <TableHead>Training Program</TableHead>
                  <TableHead>Issue Date</TableHead>
                  <TableHead>Expiry Date</TableHead>
                  <TableHead>Credential ID</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCertificates.map((cert) => (
                  <TableRow key={cert.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                          <Award className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium">{cert.certificate_number}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{getEmployeeName(cert.employee_id)}</TableCell>
                    <TableCell>{getProgramTitle(cert.training_program_id)}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span>{cert.issue_date ? new Date(cert.issue_date).toLocaleDateString() : "N/A"}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span>{cert.expiry_date ? new Date(cert.expiry_date).toLocaleDateString() : "No expiry"}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <code className="text-sm bg-muted px-2 py-1 rounded">{cert.certificate_number}</code>
                    </TableCell>
                    <TableCell>{getStatusBadge(cert)}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Download className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                          onClick={() => {
                            if (window.confirm(`Revoke certificate ${cert.certificate_number}?`)) {
                              // Revoke logic would go here
                              toast({
                                title: "Certificate Revoked",
                                description: "Certificate has been revoked",
                                variant: "success"
                              })
                            }
                          }}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                {filteredCertificates.length === 0 && (
                  <TableRow>
                    <TableCell colSpan="8" className="text-center py-4">
                      No certificates found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </PageContainer>
  )
}