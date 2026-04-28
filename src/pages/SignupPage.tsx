import { type FormEvent, useState } from 'react'
import { Link, Navigate } from 'react-router-dom'

import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useAuth } from '@/hooks/useAuth'
import { AuthLayout } from '@/layout/AuthLayout'
import {
  validateEmail,
  validatePassword,
  validateRequired,
} from '@/lib/validation'
import type { UserRole } from '@/types/auth'

export function SignupPage() {
  const { user, signup } = useAuth()
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState<UserRole | ''>('')
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [submitted, setSubmitted] = useState(false)

  if (user) {
    return <Navigate to="/dashboard" replace />
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    const next: Record<string, string> = {}
    const nameErr = validateRequired(fullName, 'Full name')
    const emailErr = validateEmail(email)
    const passErr = validatePassword(password)
    if (nameErr) next.fullName = nameErr
    if (emailErr) next.email = emailErr
    if (passErr) next.password = passErr
    if (!role) next.role = 'Please select a role.'
    setErrors(next)
    setSubmitted(true)
    if (Object.keys(next).length > 0) return

    signup({
      fullName,
      email,
      password,
      role: role as UserRole,
    })
  }

  return (
    <AuthLayout>
      <Card className="w-full border-none shadow-2xl md:p-4">
        <CardHeader className="space-y-1 pb-4 text-center sm:text-left">
          <CardTitle className="font-heading text-3xl font-bold tracking-tight text-gray-900">
            Create your account
          </CardTitle>
          <CardDescription className="text-gray-500">
            Join your campus event platform and start exploring or organizing
            events.
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit} noValidate>
          <CardContent className="space-y-4 pt-2">
            <div className="space-y-2">
              <Label htmlFor="fullName">Full name</Label>
              <Input
                id="fullName"
                name="fullName"
                autoComplete="name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                aria-invalid={!!errors.fullName}
                className="rounded-xl"
              />
              {submitted && errors.fullName && (
                <p className="text-sm text-destructive" role="alert">
                  {errors.fullName}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Enter your university email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                placeholder="Enter your university email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                aria-invalid={!!errors.email}
                className="rounded-xl"
              />
              {submitted && errors.email && (
                <p className="text-sm text-destructive" role="alert">
                  {errors.email}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                aria-invalid={!!errors.password}
                className="rounded-xl"
              />
              {submitted && errors.password && (
                <p className="text-sm text-destructive" role="alert">
                  {errors.password}
                </p>
              )}
              <p className="text-xs text-muted-foreground">
                At least 8 characters.
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="role">Role</Label>
              <Select
                value={role || undefined}
                onValueChange={(v) => setRole(v as UserRole)}
              >
                <SelectTrigger
                  id="role"
                  size="default"
                  className="h-10 w-full rounded-xl"
                  aria-invalid={!!errors.role}
                >
                  <SelectValue placeholder="Select Student or Organizer" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="student">Student</SelectItem>
                  <SelectItem value="organizer">Organizer</SelectItem>
                </SelectContent>
              </Select>
              {submitted && errors.role && (
                <p className="text-sm text-destructive" role="alert">
                  {errors.role}
                </p>
              )}
            </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-4 pt-4">
            <Button
              type="submit"
              size="lg"
              className="h-11 w-full text-base"
            >
              Create Account
            </Button>
            <p className="text-center text-sm text-gray-600">
              Already have an account?{' '}
              <Link
                to="/login"
                className="font-medium text-primary underline-offset-4 hover:underline"
              >
                Login
              </Link>
            </p>
          </CardFooter>
        </form>
      </Card>
    </AuthLayout>
  )
}
