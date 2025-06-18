// src/pages/LoginPage.jsx
import { useAuth0 } from "@auth0/auth0-react"
import { useEffect } from "react"
import { useNavigate } from "react-router-dom"

const LoginPage = () => {
  const { loginWithRedirect, isAuthenticated, isLoading } = useAuth0()
  const navigate = useNavigate()

  // Redirect to dashboard if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/dashboard")
    }
  }, [isAuthenticated, navigate])

  const handleLogin = () => {
    loginWithRedirect()
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Branding */}
      <div className="flex-1 bg-[#192841] flex flex-col justify-between p-8 relative overflow-hidden">
        {/* Logo Section */}
        <div className="flex items-start z-10 relative">
          <div className="text-white">
            <div className="flex items-center gap-3 mb-2">
              <img
                src="/assets/image 8.png"
                alt="Clicks Digital Logo"
                className="w-48 h-auto"
                onError={(e) => {
                  e.currentTarget.style.display = "none"
                  e.currentTarget.nextElementSibling.style.display = "block"
                }}
              />
              {/* Fallback logo */}
              <div className="hidden">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
                    <span className="text-[#192841] font-bold text-lg">CD</span>
                  </div>
                  <div>
                    <h1 className="text-xl font-bold">Clicks Digitals</h1>
                    <p className="text-sm text-gray-300">SOLUTIONS FOR YOUR DIGITAL SUCCESS</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Welcome Text and Pattern Section */}
        <div className="flex flex-col z-10 relative">
          <div className="mb-8">
            <h2 className="text-white text-2xl font-medium leading-relaxed">
              Welcome To Clicks HR
              <br />
              System
            </h2>
          </div>

          <div className="w-full">
            <img
              src="/assets/image 7.png"
              alt="Brand Pattern"
              className="w-full h-20 object-cover object-left"
              onError={(e) => {
                e.currentTarget.style.display = "none"
                e.currentTarget.nextElementSibling.style.display = "block"
              }}
            />
            {/* Fallback geometric pattern */}
            <div className="hidden w-full h-20 bg-white">
              <svg
                width="100%"
                height="80"
                viewBox="0 0 400 80"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="w-full h-full"
              >
                <defs>
                  <pattern id="geometric-pattern" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
                    <path d="M20 0L40 20L20 40L0 20L20 0Z" fill="#192841" />
                    <path d="M10 10L30 10L30 30L10 30L10 10Z" fill="white" />
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#geometric-pattern)" />
              </svg>
            </div>
          </div>
        </div>

        <div className="absolute inset-0 bg-[#192841] bg-opacity-90 z-0"></div>
      </div>

      {/* Right Side - Auth0 Login */}
      <div className="flex-1 bg-gray-100 flex items-center justify-center p-8">
        <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-semibold text-gray-800">Welcome Back</h2>
            <p className="text-gray-600 mt-2">Sign in to access your HR dashboard</p>
          </div>

          {/* Auth0 Login Button */}
          <div className="space-y-6">
            <button
              onClick={handleLogin}
              className="w-full bg-[#192841] text-white py-3 px-4 rounded-lg font-medium hover:bg-[#2a3a5c] transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[#192841] focus:ring-offset-2 shadow-lg hover:shadow-xl"
            >
              Sign In with Auth0
            </button>
            
            <div className="text-center text-sm text-gray-500">
              Secure authentication powered by Auth0
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LoginPage