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
import { useAuth } from '@/hooks/useAuth'
import { AuthLayout } from '@/layout/AuthLayout'
import { validateEmail, validatePassword } from '@/lib/validation'

export function LoginPage() {
  const { user, login } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [submitted, setSubmitted] = useState(false)

  if (user) {
    return <Navigate to="/dashboard" replace />
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    const next: Record<string, string> = {}
    const emailErr = validateEmail(email)
    const passErr = validatePassword(password)
    if (emailErr) next.email = emailErr
    if (passErr) next.password = passErr
    setErrors(next)
    setSubmitted(true)
    if (Object.keys(next).length > 0) return

    login(email, password)
  }

  return (
    <AuthLayout>
      <Card className="w-full border-none shadow-2xl md:p-4">
        <CardHeader className="space-y-1 pb-4 text-center sm:text-left">
          <CardTitle className="font-heading text-3xl font-bold tracking-tight text-gray-900">
            Welcome back
          </CardTitle>
          <CardDescription className="text-gray-500">
            Access your campus events, tasks, and activity in one place.
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit} noValidate>
          <CardContent className="space-y-4 pt-2">
            <div className="space-y-2">
              <Label htmlFor="login-email">Email</Label>
              <Input
                id="login-email"
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
              <Label htmlFor="login-password">Password</Label>
              <Input
                id="login-password"
                name="password"
                type="password"
                autoComplete="current-password"
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
            </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-4 pt-4">
            <Button
              type="submit"
              size="lg"
              className="h-11 w-full text-base"
            >
              Login
            </Button>
            <p className="text-center text-sm text-gray-600">
              Don&apos;t have an account?{' '}
              <Link
                to="/signup"
                className="font-medium text-primary underline-offset-4 hover:underline"
              >
                Create account
              </Link>
            </p>
          </CardFooter>
        </form>
      </Card>
    </AuthLayout>
  )
}
