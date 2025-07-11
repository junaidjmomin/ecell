"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import {
  Menu,
  X,
  ArrowRight,
  Users,
  Target,
  Lightbulb,
  Upload,
  CheckCircle,
  AlertCircle,
  Loader2,
  Mail,
  Phone,
  MapPin,
  Linkedin,
  Instagram,
  Twitter,
  Youtube,
  Facebook,
  Calendar,
  BookOpen,
  FileText,
} from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import Image from "next/image"
import { AnimatedNumber } from "@/components/animated-number" // Import the new component

export default function ECellFRCRCE() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
  })
  const [file, setFile] = useState<File | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<{
    type: "success" | "error" | null
    message: string
  }>({ type: null, message: "" })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) {
      const fileType = selectedFile.type
      const fileName = selectedFile.name.toLowerCase()

      if (
        fileType === "application/pdf" ||
        fileType === "application/zip" ||
        fileName.endsWith(".pdf") ||
        fileName.endsWith(".zip")
      ) {
        setFile(selectedFile)
        setSubmitStatus({ type: null, message: "" })
      } else {
        setSubmitStatus({
          type: "error",
          message: "Please upload only PDF or ZIP files.",
        })
        e.target.value = ""
      }
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!file) {
      setSubmitStatus({
        type: "error",
        message: "Please select a file to upload.",
      })
      return
    }

    setIsSubmitting(true)
    setSubmitStatus({ type: null, message: "" })

    try {
      const formDataForUpload = new FormData()
      formDataForUpload.append("file", file)

      const uploadResponse = await fetch("/api/upload", {
        method: "POST",
        body: formDataForUpload,
      })

      if (!uploadResponse.ok) {
        throw new Error(`Upload failed: ${uploadResponse.status}`)
      }

      const uploadResult = await uploadResponse.json()

      const registerResponse = await fetch("/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.fullName,
          email: formData.email,
          phone: formData.phone,
          fileUrl: uploadResult.url,
        }),
      })

      if (!registerResponse.ok) {
        throw new Error(`Registration failed: ${registerResponse.status}`)
      }

      const registerResult = await registerResponse.json()

      if (registerResult.success) {
        setSubmitStatus({
          type: "success",
          message: `Registration successful! Your ID: ${registerResult.registrationId}`,
        })

        setFormData({ fullName: "", email: "", phone: "" })
        setFile(null)
        const fileInput = document.getElementById("file-upload") as HTMLInputElement
        if (fileInput) fileInput.value = ""
      } else {
        throw new Error(registerResult.error || "Registration failed")
      }
    } catch (error) {
      setSubmitStatus({
        type: "error",
        message: `Failed to submit: ${error instanceof Error ? error.message : "Unknown error"}`,
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const scrollToSection = (sectionId: string) => {
    document.getElementById(sectionId)?.scrollIntoView({ behavior: "smooth" })
    setIsMenuOpen(false)
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-gray-900/95 backdrop-blur-sm z-50 border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Image
                  src="/images/ecell-logo.png"
                  alt="E-Cell FRCRCE Logo"
                  width={80} // Made smaller as requested
                  height={32} // Adjusted height
                  className="h-auto"
                />
              </div>
            </div>

            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-8">
                <button
                  onClick={() => scrollToSection("home")}
                  className="text-gray-300 hover:text-white px-3 py-2 text-sm font-medium transition-colors"
                >
                  Home
                </button>
                <button
                  onClick={() => scrollToSection("about")}
                  className="text-gray-300 hover:text-white px-3 py-2 text-sm font-medium transition-colors"
                >
                  About
                </button>
                <button
                  onClick={() => scrollToSection("events")}
                  className="text-gray-300 hover:text-white px-3 py-2 text-sm font-medium transition-colors"
                >
                  Events
                </button>
                <button
                  onClick={() => scrollToSection("team")}
                  className="text-gray-300 hover:text-white px-3 py-2 text-sm font-medium transition-colors"
                >
                  Team
                </button>
                <button
                  onClick={() => scrollToSection("contact")}
                  className="text-gray-300 hover:text-white px-3 py-2 text-sm font-medium transition-colors"
                >
                  Contact Us
                </button>
              </div>
            </div>

            <div className="md:hidden">
              <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-gray-300 hover:text-white p-2">
                {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>

        {isMenuOpen && (
          <div className="md:hidden bg-gray-900 border-t border-gray-800">
            <div className="px-2 pt-2 pb-3 space-y-1">
              <button
                onClick={() => scrollToSection("home")}
                className="block text-gray-300 hover:text-white px-3 py-2 text-base font-medium w-full text-left"
              >
                Home
              </button>
              <button
                onClick={() => scrollToSection("about")}
                className="block text-gray-300 hover:text-white px-3 py-2 text-base font-medium w-full text-left"
              >
                About
              </button>
              <button
                onClick={() => scrollToSection("events")}
                className="block text-gray-300 hover:text-white px-3 py-2 text-base font-medium w-full text-left"
              >
                Events
              </button>
              <button
                onClick={() => scrollToSection("team")}
                className="block text-gray-300 hover:text-white px-3 py-2 text-base font-medium w-full text-left"
              >
                Team
              </button>
              <button
                onClick={() => scrollToSection("contact")}
                className="block text-gray-300 hover:text-white px-3 py-2 text-base font-medium w-full text-left"
              >
                Contact Us
              </button>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: "url('/images/ecell-hero-bg.jpeg')",
          }}
        />
        <div className="absolute inset-0 bg-gray-900/70" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-5xl md:text-7xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500 mb-4">
              THE ENTREPRENEURSHIP CELL
            </h1>
            <p className="text-xl md:text-2xl text-gray-200 mb-8 leading-relaxed">
              Fr. Conceicao Rodrigues College Of Engineering
            </p>
          </div>
        </div>

        {/* Social Media Icons */}
        <div className="fixed right-6 top-1/2 transform -translate-y-1/2 z-20 hidden lg:flex flex-col space-y-4">
          <a href="#" className="text-gray-400 hover:text-yellow-500 transition-colors">
            <Linkedin className="h-6 w-6" />
          </a>
          <a href="#" className="text-gray-400 hover:text-yellow-500 transition-colors">
            <Instagram className="h-6 w-6" />
          </a>
          <a href="#" className="text-gray-400 hover:text-yellow-500 transition-colors">
            <Twitter className="h-6 w-6" />
          </a>
          <a href="#" className="text-gray-400 hover:text-yellow-500 transition-colors">
            <Youtube className="h-6 w-6" />
          </a>
          <a href="#" className="text-gray-400 hover:text-yellow-500 transition-colors">
            <Facebook className="h-6 w-6" />
          </a>
        </div>
      </section>

      {/* Welcome to E-Cell Section (Integrated into About) */}
      <section id="about" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">Welcome to The Entrepreneurship Cell</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              The Entrepreneurship Cell, FR.CRCE is a place for all those who avoid taking beaten paths and believe in
              leaving trails in all walks of life. The Cell at FR.CRCE, Bandra aims at manifesting the latent
              Entrepreneurial spirit of young students. Not only do we at E-Cell show you the doors of opportunity but
              we also help you to walk through it by providing resources such as seed, funding mentoring, networking
              with other entrepreneurs frequent interactive sessions and Competitions.
            </p>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mt-4">
              It is a firm belief at the Entrepreneurship Cell that original thoughts and radical ideas take shape in
              young minds. Students are the greatest natural resource and the Cell intends to nurture them and provide
              them with opportunities for excellence. It intends to pierce the corporate veil, to let the budding
              entrepreneurs get a feel of how the corporate world works. In all it is the cherished dream of the
              Entrepreneurship Cell to create corprocrats out of the present day technocrats.
            </p>
            <Button
              onClick={() => scrollToSection("about-details")}
              className="mt-8 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-black font-semibold px-8 py-4 text-lg rounded-full transition-all duration-300 transform hover:scale-105"
            >
              View More Details <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>

          {/* Mission, Vision, Values */}
          <div id="about-details" className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mt-16">
            <Card className="text-center border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardContent className="pt-8">
                <div className="w-16 h-16 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Target className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">MISSION</h3>
                <p className="text-gray-600">
                  To germinate the idea of entrepreneurship and develop the students to face the entrepreneurial
                  challenges of tomorrow.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardContent className="pt-8">
                <div className="w-16 h-16 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Lightbulb className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">VISION</h3>
                <p className="text-gray-600">
                  To develop a strong relation between our students, our experienced alumni and experienced members of
                  the business fields; allowing our students to have a dynamic mindset before starting their
                  entrepreneurial voyage.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardContent className="pt-8">
                <div className="w-16 h-16 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">VALUES</h3>
                <p className="text-gray-600 font-semibold">Integrity</p>
                <p className="text-gray-600">
                  Improve your personality by polishing your social and professional skills.
                </p>
                <p className="text-gray-600 font-semibold mt-2">Empathetic</p>
                <p className="text-gray-600">
                  Get to know every other person, from seniors to freshers! Business firms and their executives and lot
                  more.
                </p>
                <p className="text-gray-600 font-semibold mt-2">Fortitude</p>
                <p className="text-gray-600">Allowing one to endure pain or adversity with courage.</p>
                <p className="text-gray-600 font-semibold mt-2">Humility</p>
                <p className="text-gray-600">The friendly ecosystem makes working easier and engrossing.</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="py-20 bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-12">Our Impact</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="flex flex-col items-center">
              <span className="text-5xl font-bold text-yellow-400">
                <AnimatedNumber value={200} /> +
              </span>
              <p className="text-lg text-gray-300">Sessions</p>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-5xl font-bold text-yellow-400">
                <AnimatedNumber value={200} /> +
              </span>
              <p className="text-lg text-gray-300">Startups</p>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-5xl font-bold text-yellow-400">
                <AnimatedNumber value={100} /> +
              </span>
              <p className="text-lg text-gray-300">Professionals</p>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-5xl font-bold text-yellow-400">
                <AnimatedNumber value={10000} /> +
              </span>
              <p className="text-lg text-gray-300">Students</p>
            </div>
            <div className="flex flex-col items-center md:col-span-4 mt-8">
              <span className="text-5xl font-bold text-yellow-400">
                <AnimatedNumber value={100} /> +
              </span>
              <p className="text-lg text-gray-300">Colleges</p>
            </div>
          </div>
        </div>
      </section>

      {/* Events Section */}
      <section id="events" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">UPCOMING EVENT</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Discover our flagship programs designed to nurture entrepreneurial talent and drive innovation.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
              <CardHeader>
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center mb-4">
                  <Calendar className="h-6 w-6 text-white" />
                </div>
                <CardTitle className="text-xl text-gray-900">THE IDEA COMPETITION</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  Create a proposal of your idea and send it to us. Idea Proposals will be evaluated by industry
                  professionals. Selected Ideas will get exciting prizes and will move on to next round, Design
                  Competition.
                </p>
                <div className="flex flex-col space-y-2">
                  <a href="#" className="text-blue-600 hover:underline flex items-center gap-2 text-sm">
                    <FileText className="h-4 w-4" /> Instructions
                  </a>
                  <a href="#" className="text-blue-600 hover:underline flex items-center gap-2 text-sm">
                    <BookOpen className="h-4 w-4" /> Proposal Format : [Click Here]
                  </a>
                  <a href="#" className="text-blue-600 hover:underline flex items-center gap-2 text-sm">
                    <BookOpen className="h-4 w-4" /> Rules Book : [Click Here]
                  </a>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
              <CardHeader>
                <div className="w-12 h-12 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-lg flex items-center justify-center mb-4">
                  <span className="text-white font-bold text-xl">🦄</span>
                </div>
                <CardTitle className="text-xl text-gray-900">Formula Unicorn</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  Our flagship tech competition challenging students to build innovative solutions.
                </p>
                <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                  Registration Open
                </Badge>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
              <CardHeader>
                <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-teal-600 rounded-lg flex items-center justify-center mb-4">
                  <Calendar className="h-6 w-6 text-white" />
                </div>
                <CardTitle className="text-xl text-gray-900">E-Cell Monthly</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  Monthly interactive sessions and workshops with industry leaders and successful entrepreneurs.
                </p>
                <Badge variant="secondary" className="bg-green-100 text-green-800">
                  Next Session Soon
                </Badge>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Quote Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <blockquote className="text-3xl md:text-4xl font-bold text-gray-800 leading-tight mb-6">
            “Be passionate and bold. Always keep learning. You stop doing useful things if you don’t learn.”
          </blockquote>
          <p className="text-xl font-semibold text-gray-600">- Satya Nadella</p>
        </div>
      </section>

      {/* Formula Unicorn Registration Section */}
      <section id="formula-unicorn" className="py-20 bg-gradient-to-br from-purple-50 via-white to-blue-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full mb-6">
              <span className="text-3xl font-bold text-white">🦄</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-4">
              Formula Unicorn
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Join our flagship innovation challenge and transform your ideas into reality. Register now to be part of
              the next generation of tech entrepreneurs.
            </p>
          </div>

          <Card className="shadow-2xl border-0 bg-white/90 backdrop-blur-sm">
            <CardHeader className="text-center pb-6">
              <CardTitle className="text-2xl font-semibold text-gray-800">Register for Formula Unicorn</CardTitle>
              <CardDescription className="text-gray-600">
                Fill out the form below to secure your spot in Formula Unicorn 2024
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="fullName" className="text-sm font-medium text-gray-700">
                    Full Name *
                  </Label>
                  <Input
                    id="fullName"
                    name="fullName"
                    type="text"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    required
                    className="h-12 border-gray-200 focus:border-purple-500 focus:ring-purple-500"
                    placeholder="Enter your full name"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                    Email ID *
                  </Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="h-12 border-gray-200 focus:border-purple-500 focus:ring-purple-500"
                    placeholder="Enter your email address"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-sm font-medium text-gray-700">
                    Phone Number *
                  </Label>
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleInputChange}
                    required
                    className="h-12 border-gray-200 focus:border-purple-500 focus:ring-purple-500"
                    placeholder="Enter your phone number"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="file-upload" className="text-sm font-medium text-gray-700">
                    Upload Document *
                  </Label>
                  <div className="relative">
                    <Input
                      id="file-upload"
                      type="file"
                      accept=".pdf,.zip,application/pdf,application/zip"
                      onChange={handleFileChange}
                      required
                      className="h-12 border-gray-200 focus:border-purple-500 focus:ring-purple-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100"
                    />
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                      <Upload className="h-5 w-5 text-gray-400" />
                    </div>
                  </div>
                  <p className="text-xs text-gray-500">
                    Upload your resume, portfolio, or project files (PDF or ZIP only, max 10MB)
                  </p>
                  {file && (
                    <p className="text-sm text-green-600 flex items-center gap-2">
                      <CheckCircle className="h-4 w-4" />
                      Selected: {file.name}
                    </p>
                  )}
                </div>

                {submitStatus.type && (
                  <Alert
                    className={
                      submitStatus.type === "success" ? "border-green-200 bg-green-50" : "border-red-200 bg-red-50"
                    }
                  >
                    {submitStatus.type === "success" ? (
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    ) : (
                      <AlertCircle className="h-4 w-4 text-red-600" />
                    )}
                    <AlertDescription className={submitStatus.type === "success" ? "text-green-800" : "text-red-800"}>
                      {submitStatus.message}
                    </AlertDescription>
                  </Alert>
                )}

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full h-12 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-200"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    "Register Now"
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">Get In Touch</h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Ready to start your entrepreneurial journey? Connect with us and be part of the innovation ecosystem.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="bg-gray-800 border-gray-700 text-white">
              <CardContent className="pt-8 text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Mail className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Email Us</h3>
                <p className="text-gray-300">ecell@frcrce.ac.in</p>
              </CardContent>
            </Card>

            <Card className="bg-gray-800 border-gray-700 text-white">
              <CardContent className="pt-8 text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Phone className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Call Us</h3>
                <p className="text-gray-300">+91 98765 43210</p>
              </CardContent>
            </Card>

            <Card className="bg-gray-800 border-gray-700 text-white md:col-span-2 lg:col-span-1">
              <CardContent className="pt-8 text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <MapPin className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Visit Us</h3>
                <p className="text-gray-300">Fr. CRCE, Bandra West, Mumbai</p>
              </CardContent>
            </Card>
          </div>

          <div className="mt-16 text-center">
            <div className="flex justify-center space-x-6 mb-8">
              <a href="#" className="text-gray-400 hover:text-yellow-500 transition-colors">
                <Linkedin className="h-8 w-8" />
              </a>
              <a href="#" className="text-gray-400 hover:text-yellow-500 transition-colors">
                <Instagram className="h-8 w-8" />
              </a>
              <a href="#" className="text-gray-400 hover:text-yellow-500 transition-colors">
                <Twitter className="h-8 w-8" />
              </a>
              <a href="#" className="text-gray-400 hover:text-yellow-500 transition-colors">
                <Youtube className="h-8 w-8" />
              </a>
              <a href="#" className="text-gray-400 hover:text-yellow-500 transition-colors">
                <Facebook className="h-8 w-8" />
              </a>
            </div>
            <p className="text-gray-400">Copyright © E-CELL,FR.CRCE BANDRA</p>
          </div>
        </div>
      </section>
    </div>
  )
}
