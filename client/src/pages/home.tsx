import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sun, Zap, Wrench, ChevronDown, Phone, Mail, MapPin, Menu, X,
  Award, Users, Building2, TrendingUp, ArrowRight, Shield, Clock,
  CheckCircle2, Leaf, Battery, Settings, Globe, Star
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import logoPath from "@assets/WhatsApp_Image_2026-03-10_at_9.58.53_PM_1773160168323.jpeg";

const navLinks = [
  { label: "Home", href: "#home" },
  { label: "About", href: "#about" },
  { label: "Services", href: "#services" },
  { label: "Projects", href: "#projects" },
  { label: "Leadership", href: "#leadership" },
  { label: "Contact", href: "#contact" },
];

const stats = [
  { value: "120+", label: "MW Installed", icon: Zap },
  { value: "50+", label: "Projects Completed", icon: Building2 },
  { value: "6+", label: "Years Experience", icon: Clock },
  { value: "100+", label: "Team Members", icon: Users },
];

const services = [
  {
    title: "EPC Developer",
    description: "End-to-end Engineering, Procurement, and Construction services for solar power plants. From design and integration to installation and commissioning, we deliver turnkey solutions.",
    icon: Sun,
    features: ["Design & Engineering", "Procurement", "Construction", "Commissioning"],
    image: "/images/ground-mount.png",
  },
  {
    title: "O&M Services",
    description: "Comprehensive Operation & Maintenance services covering both technical and non-technical aspects. We ensure your solar plant operates at peak efficiency.",
    icon: Wrench,
    features: ["AC/DC Maintenance", "Panel Cleaning", "SCADA Monitoring", "PR Calculation"],
    image: "/images/maintenance.png",
  },
  {
    title: "Installation & Commissioning",
    description: "Expert installation and commissioning for both ground mount and rooftop solar projects. Our experienced team handles everything from survey to site handover.",
    icon: Settings,
    features: ["Ground Mount", "Rooftop Systems", "Cable Laying", "Testing & Handover"],
    image: "/images/rooftop-solar.png",
  },
];

const projects = [
  { capacity: "50 MW", type: "Ground Mount", location: "Ramanathapuram", client: "Evarrenew Energy Pvt Ltd", duration: "120 Days" },
  { capacity: "20 MW", type: "Ground Mount", location: "Kilakarai, Ramanathapuram", client: "Annai Infra Developers", duration: "120 Days" },
  { capacity: "16.8 MW", type: "Ground Mount", location: "Tuticorin", client: "Raha Renewables Pvt Ltd", duration: "120 Days" },
  { capacity: "15 MW", type: "Ground Mount", location: "Andimadam, Ariyalur", client: "Fesren Energy Pvt Ltd", duration: "90 Days" },
  { capacity: "10 MW", type: "Ground Mount", location: "Kosavapatti, Dindigul", client: "HYPKRT Energy Pvt Ltd", duration: "120 Days" },
  { capacity: "8 MW", type: "Ground Mount", location: "Tirunelveli", client: "Pioneer Leather", duration: "120 Days" },
  { capacity: "7 MW", type: "Ground Mount", location: "Ramanathapuram", client: "Olympia, Chennai", duration: "90 Days" },
  { capacity: "5 MW", type: "Ground Mount", location: "Tuticorin", client: "Pioneer INC, Chennai", duration: "75 Days" },
  { capacity: "5 MW", type: "Ground Mount", location: "Ramanathapuram", client: "Trio Solar Pvt Ltd", duration: "75 Days" },
  { capacity: "3.6 MW", type: "Rooftop", location: "Visakhapatnam", client: "Costal Corporation Ltd", duration: "90 Days" },
  { capacity: "3.5 MW", type: "Ground Mount", location: "Nelvai, Chengalpattu", client: "SK Green Energy", duration: "70 Days" },
  { capacity: "3 MW", type: "Rooftop", location: "Chennai", client: "JK Tyres / First Green Consulting", duration: "70 Days" },
  { capacity: "3 MW", type: "Ground Mount", location: "Muscat", client: "International Project", duration: "70 Days" },
  { capacity: "1.7 MW", type: "Rooftop", location: "Tirupur", client: "Le Shark Global / Mahindra", duration: "120 Days" },
  { capacity: "1.2 MW", type: "Rooftop", location: "Karnataka", client: "Sigma Pharma / Tata Power Solar", duration: "60 Days" },
  { capacity: "1 MW", type: "Rooftop", location: "Chennai", client: "Samsung India Pvt Ltd", duration: "45 Days" },
];

const milestones = [
  { year: "2018", capacity: "2 MW I&C", turnover: "22 L", label: "Journey Begins" },
  { year: "2019", capacity: "10 MW I&C", turnover: "110 L", label: "" },
  { year: "2020", capacity: "12 MW I&C", turnover: "132 L", label: "" },
  { year: "2021", capacity: "13 MW I&C", turnover: "145 L", label: "" },
  { year: "2023", capacity: "15 MW I&C", turnover: "165 L", label: "" },
  { year: "2024", capacity: "16 I&C, 11.5 EPC", turnover: "365 L", label: "" },
];

function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollTo = (href: string) => {
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: "smooth" });
    setMobileOpen(false);
  };

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white/95 backdrop-blur-md shadow-lg border-b border-green-100"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <button className="flex items-center gap-3 cursor-pointer" onClick={() => scrollTo("#home")} data-testid="link-home-logo" aria-label="Go to homepage">
            <img src={logoPath} alt="Dynamic Green Energy Logo" className="h-14 w-14 rounded-lg object-contain" />
            <div className="hidden sm:block">
              <h1 className={`text-lg font-bold leading-tight ${scrolled ? "text-gray-900" : "text-white"}`}>
                Dynamic Green
              </h1>
              <p className={`text-xs font-medium ${scrolled ? "text-green-600" : "text-green-300"}`}>
                Energy
              </p>
            </div>
          </button>

          <div className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <button
                key={link.href}
                onClick={() => scrollTo(link.href)}
                data-testid={`link-nav-${link.label.toLowerCase()}`}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  scrolled
                    ? "text-gray-700 hover:text-green-700 hover:bg-green-50"
                    : "text-white/90 hover:text-white hover:bg-white/10"
                }`}
              >
                {link.label}
              </button>
            ))}
            <Button
              onClick={() => scrollTo("#contact")}
              data-testid="button-get-quote"
              className="ml-3 bg-green-600 hover:bg-green-700 text-white rounded-full px-6"
            >
              Get Quote
            </Button>
          </div>

          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            data-testid="button-mobile-menu"
            className={`lg:hidden p-2 rounded-lg ${scrolled ? "text-gray-700" : "text-white"}`}
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-white border-t border-green-100 shadow-xl"
          >
            <div className="px-4 py-4 space-y-1">
              {navLinks.map((link) => (
                <button
                  key={link.href}
                  onClick={() => scrollTo(link.href)}
                  data-testid={`link-mobile-${link.label.toLowerCase()}`}
                  className="block w-full text-left px-4 py-3 text-gray-700 hover:text-green-700 hover:bg-green-50 rounded-lg font-medium transition-colors"
                >
                  {link.label}
                </button>
              ))}
              <Button
                onClick={() => scrollTo("#contact")}
                data-testid="button-mobile-get-quote"
                className="w-full mt-3 bg-green-600 hover:bg-green-700 text-white rounded-full"
              >
                Get Quote
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}

function HeroSection() {
  return (
    <section id="home" className="relative min-h-screen flex items-center overflow-hidden">
      <div className="absolute inset-0">
        <img
          src="/images/hero-solar.png"
          alt="Solar power plant"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-gray-900/90 via-gray-900/70 to-gray-900/40" />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900/60 via-transparent to-transparent" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32">
        <div className="max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 bg-green-500/20 backdrop-blur-sm border border-green-400/30 rounded-full px-5 py-2 mb-8">
              <Leaf className="w-4 h-4 text-green-400" />
              <span className="text-green-300 text-sm font-medium" data-testid="text-tagline">Reliable Solar Project Developers</span>
            </div>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="text-4xl sm:text-5xl lg:text-7xl font-bold text-white leading-tight mb-6"
            data-testid="text-hero-title"
          >
            Powering India's{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-300">
              Green Future
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="text-lg sm:text-xl text-gray-300 mb-10 max-w-2xl leading-relaxed"
            data-testid="text-hero-description"
          >
            Tamil Nadu's trusted solar EPC developer with 120+ MW of installations
            across Madurai, Tuticorin, Ramanathapuram, Tirunelveli, Chennai and beyond.
            Delivering world-class solar solutions since 2018.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="flex flex-wrap gap-4"
          >
            <Button
              size="lg"
              onClick={() => document.querySelector("#services")?.scrollIntoView({ behavior: "smooth" })}
              data-testid="button-explore-services"
              className="bg-green-600 hover:bg-green-700 text-white rounded-full px-8 py-6 text-base font-semibold shadow-xl shadow-green-600/25"
            >
              Our Services
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => document.querySelector("#projects")?.scrollIntoView({ behavior: "smooth" })}
              data-testid="button-view-projects"
              className="border-white/30 text-white hover:bg-white/10 rounded-full px-8 py-6 text-base font-semibold backdrop-blur-sm"
            >
              View Projects
            </Button>
          </motion.div>
        </div>
      </div>

      <motion.div
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10"
      >
        <ChevronDown className="w-8 h-8 text-white/60" />
      </motion.div>
    </section>
  );
}

function StatsSection() {
  return (
    <section className="relative -mt-16 z-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
            >
              <Card className="bg-white border-0 shadow-xl shadow-gray-200/50 hover:shadow-2xl transition-all duration-300 overflow-hidden group">
                <CardContent className="p-6 text-center">
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-green-100 rounded-xl mb-4 group-hover:bg-green-600 transition-colors duration-300">
                    <stat.icon className="w-6 h-6 text-green-600 group-hover:text-white transition-colors duration-300" />
                  </div>
                  <div className="text-3xl sm:text-4xl font-bold text-gray-900 mb-1" data-testid={`text-stat-${stat.label.toLowerCase().replace(/\s/g, '-')}`}>
                    {stat.value}
                  </div>
                  <div className="text-sm text-gray-500 font-medium">{stat.label}</div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function AboutSection() {
  return (
    <section id="about" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <div className="inline-flex items-center gap-2 bg-green-100 rounded-full px-4 py-1.5 mb-6">
              <Globe className="w-4 h-4 text-green-600" />
              <span className="text-green-700 text-sm font-semibold">Who We Are</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-6 leading-tight" data-testid="text-about-title">
              Building a{" "}
              <span className="text-green-600">Sustainable</span>{" "}
              Future Since 2018
            </h2>
            <p className="text-gray-600 text-lg mb-6 leading-relaxed" data-testid="text-about-description">
              Dynamic Green Energy Private Limited, established in June 2018, offers
              combined PV packages — from customized to turnkey solutions. We plan from
              design and integration stage to the installation and commissioning of
              solar power systems.
            </p>
            <p className="text-gray-600 text-lg mb-8 leading-relaxed">
              With a team of highly experienced experts, we cater to commercial,
              industrial, agricultural, and residential sectors with our diverse range
              of products to deliver optimal solar power solutions.
            </p>

            <div className="grid grid-cols-2 gap-4">
              {[
                { icon: Shield, text: "Quality Assured" },
                { icon: Clock, text: "On-Time Delivery" },
                { icon: Award, text: "Industry Expertise" },
                { icon: Leaf, text: "Eco-Friendly" },
              ].map((item) => (
                <div key={item.text} className="flex items-center gap-3 p-3 rounded-xl bg-gray-50" data-testid={`text-feature-${item.text.toLowerCase().replace(/\s/g, '-')}`}>
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <item.icon className="w-5 h-5 text-green-600" />
                  </div>
                  <span className="text-gray-700 font-medium text-sm">{item.text}</span>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="relative"
          >
            <div className="relative rounded-3xl overflow-hidden shadow-2xl">
              <img
                src="/images/about-bg.png"
                alt="Solar energy concept"
                className="w-full h-[500px] object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-green-900/60 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-8">
                <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-6 shadow-xl">
                  <div className="flex items-center gap-4 mb-3">
                    <div className="w-12 h-12 bg-green-600 rounded-xl flex items-center justify-center">
                      <TrendingUp className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-gray-900" data-testid="text-mission-title">Our Mission</div>
                      <div className="text-green-600 font-semibold text-sm">GO GREEN</div>
                    </div>
                  </div>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    Providing eco-friendly solutions to our customers and the environment.
                    We are privileged to be among organizations providing eco-solutions for
                    the betterment of our future.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function ServicesSection() {
  return (
    <section id="services" className="py-24 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 bg-green-100 rounded-full px-4 py-1.5 mb-6">
            <Battery className="w-4 h-4 text-green-600" />
            <span className="text-green-700 text-sm font-semibold">What We Do</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4" data-testid="text-services-title">
            Our Core <span className="text-green-600">Services</span>
          </h2>
          <p className="text-gray-500 text-lg max-w-2xl mx-auto">
            Comprehensive solar energy solutions from concept to commissioning and beyond
          </p>
        </motion.div>

        <div className="space-y-20">
          {services.map((service, i) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className={`grid lg:grid-cols-2 gap-12 items-center ${i % 2 === 1 ? "lg:grid-flow-dense" : ""}`}
            >
              <div className={i % 2 === 1 ? "lg:col-start-2" : ""}>
                <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-2xl mb-6">
                  <service.icon className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4" data-testid={`text-service-${service.title.toLowerCase().replace(/\s+/g, '-')}`}>
                  {service.title}
                </h3>
                <p className="text-gray-600 text-lg mb-8 leading-relaxed">
                  {service.description}
                </p>
                <div className="grid grid-cols-2 gap-3">
                  {service.features.map((feature) => (
                    <div key={feature} className="flex items-center gap-2.5">
                      <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0" />
                      <span className="text-gray-700 font-medium text-sm">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className={i % 2 === 1 ? "lg:col-start-1" : ""}>
                <div className="relative rounded-3xl overflow-hidden shadow-2xl group">
                  <img
                    src={service.image}
                    alt={service.title}
                    className="w-full h-80 object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-green-900/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function TurnkeySection() {
  const steps = [
    { title: "Land Acquisition", days: "45 Days", icon: MapPin, description: "Site identification, land survey, and acquisition" },
    { title: "Design", days: "15 Days", icon: Settings, description: "Engineering design, layout planning, and system sizing" },
    { title: "Procurement", days: "30 Days", icon: Building2, description: "Equipment sourcing, vendor management, and logistics" },
    { title: "Construction & Commissioning", days: "60 Days", icon: Zap, description: "Installation, testing, grid connection, and handover" },
  ];

  return (
    <section className="py-24 bg-green-900 relative overflow-hidden">
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-96 h-96 bg-green-400 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-emerald-400 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4" data-testid="text-turnkey-title">
            Turnkey Solutions
          </h2>
          <p className="text-green-200 text-lg max-w-2xl mx-auto">
            Entire plant setup completed in 3 to 4 months including land acquisition,
            or in 75 days post land acquisition
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step, i) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
            >
              <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6 h-full hover:bg-white/15 transition-all duration-300 group">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-green-500 rounded-xl flex items-center justify-center text-white font-bold text-lg">
                    {i + 1}
                  </div>
                  <step.icon className="w-6 h-6 text-green-300" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">{step.title}</h3>
                <p className="text-green-200 text-sm mb-4">{step.description}</p>
                <div className="inline-flex items-center gap-1.5 bg-green-500/20 rounded-full px-3 py-1">
                  <Clock className="w-3.5 h-3.5 text-green-300" />
                  <span className="text-green-300 text-xs font-semibold">{step.days}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function ProjectsSection() {
  const [showAll, setShowAll] = useState(false);
  const displayedProjects = showAll ? projects : projects.slice(0, 8);

  return (
    <section id="projects" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 bg-green-100 rounded-full px-4 py-1.5 mb-6">
            <Star className="w-4 h-4 text-green-600" />
            <span className="text-green-700 text-sm font-semibold">Our Portfolio</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4" data-testid="text-projects-title">
            Successfully Completed <span className="text-green-600">Projects</span>
          </h2>
          <p className="text-gray-500 text-lg max-w-2xl mx-auto">
            Over 120+ MW of solar installations across India and internationally
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {displayedProjects.map((project, i) => (
            <motion.div
              key={`${project.capacity}-${project.location}`}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: (i % 4) * 0.05 }}
            >
              <Card
                className="border border-gray-100 hover:border-green-200 hover:shadow-xl transition-all duration-300 h-full group overflow-hidden"
                data-testid={`card-project-${i}`}
              >
                <CardContent className="p-5">
                  <div className="flex items-start justify-between mb-3">
                    <div className="text-2xl font-bold text-green-600 group-hover:text-green-700 transition-colors">
                      {project.capacity}
                    </div>
                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                      project.type === "Rooftop"
                        ? "bg-blue-100 text-blue-700"
                        : "bg-green-100 text-green-700"
                    }`}>
                      {project.type}
                    </span>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <MapPin className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
                      <span className="truncate">{project.location}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Building2 className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
                      <span className="truncate">{project.client}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Clock className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
                      <span>{project.duration}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {projects.length > 8 && (
          <div className="text-center mt-10">
            <Button
              variant="outline"
              size="lg"
              onClick={() => setShowAll(!showAll)}
              data-testid="button-toggle-projects"
              className="rounded-full px-8 border-green-200 text-green-700 hover:bg-green-50"
            >
              {showAll ? "Show Less" : `View All ${projects.length} Projects`}
              <ArrowRight className={`ml-2 w-4 h-4 transition-transform ${showAll ? "rotate-90" : ""}`} />
            </Button>
          </div>
        )}
      </div>
    </section>
  );
}

function TimelineSection() {
  return (
    <section className="py-24 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 bg-green-100 rounded-full px-4 py-1.5 mb-6">
            <TrendingUp className="w-4 h-4 text-green-600" />
            <span className="text-green-700 text-sm font-semibold">Our Growth</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4" data-testid="text-growth-title">
            Growth <span className="text-green-600">Journey</span>
          </h2>
        </motion.div>

        <div className="relative">
          <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-1 bg-gradient-to-r from-green-200 via-green-400 to-green-600 rounded-full transform -translate-y-1/2" />

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 lg:gap-2">
            {milestones.map((m, i) => (
              <motion.div
                key={m.year}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="relative"
              >
                <div className="hidden lg:block absolute top-1/2 left-1/2 w-4 h-4 bg-green-500 rounded-full border-4 border-white shadow-md transform -translate-x-1/2 -translate-y-1/2 z-10" />
                <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm hover:shadow-lg transition-all duration-300 text-center lg:mt-16">
                  <div className="text-2xl font-bold text-green-600 mb-1">{m.year}</div>
                  <div className="text-xs font-semibold text-gray-900 mb-2">{m.capacity}</div>
                  <div className="text-xs text-gray-500">Turnover: {m.turnover}</div>
                  {m.label && (
                    <div className="mt-2 text-xs font-semibold text-green-600 bg-green-50 rounded-full px-2 py-0.5 inline-block">
                      {m.label}
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function LeadershipSection() {
  const leaders = [
    {
      name: "Mr. Arun Pandian",
      role: "Managing Director",
      description: "A young techno-commercial professional with deep understanding of business at both national and international fronts. A passionate listener and deep strategist, his analytical skills are sharp and exemplary. He spares enough time deeply understanding the key features of projects alongside keeping an eye on innovation.",
    },
    {
      name: "Mr. Vignesh Mylsamy",
      role: "GM - Projects",
      description: "A co-founding team member with high-end technical command in the field of solar, providing him the edge to lead project execution teams. His focus on time & quality delivery is his expertise. His commercial skills are unmatched when it comes to cost evaluation and bidding.",
    },
  ];

  return (
    <section id="leadership" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 bg-green-100 rounded-full px-4 py-1.5 mb-6">
            <Users className="w-4 h-4 text-green-600" />
            <span className="text-green-700 text-sm font-semibold">Our Team</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4" data-testid="text-leadership-title">
            Company <span className="text-green-600">Leadership</span>
          </h2>
          <p className="text-gray-500 text-lg max-w-2xl mx-auto">
            Led by experienced professionals committed to delivering excellence
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {leaders.map((leader, i) => (
            <motion.div
              key={leader.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.15 }}
            >
              <Card className="border-0 shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden h-full" data-testid={`card-leader-${i}`}>
                <CardContent className="p-0">
                  <div className="bg-gradient-to-br from-green-600 to-emerald-700 p-8">
                    <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mb-4">
                      <Users className="w-10 h-10 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-1">{leader.name}</h3>
                    <p className="text-green-200 font-semibold">{leader.role}</p>
                  </div>
                  <div className="p-8">
                    <p className="text-gray-600 leading-relaxed">{leader.description}</p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function ContactSection() {
  return (
    <section id="contact" className="py-24 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 bg-green-100 rounded-full px-4 py-1.5 mb-6">
            <Phone className="w-4 h-4 text-green-600" />
            <span className="text-green-700 text-sm font-semibold">Get In Touch</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4" data-testid="text-contact-title">
            Contact <span className="text-green-600">Us</span>
          </h2>
          <p className="text-gray-500 text-lg max-w-2xl mx-auto">
            Ready to harness the power of the sun? Let's discuss your solar project today.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 h-full group" data-testid="card-contact-address">
              <CardContent className="p-8 text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-2xl mb-6 group-hover:bg-green-600 transition-colors duration-300">
                  <MapPin className="w-8 h-8 text-green-600 group-hover:text-white transition-colors duration-300" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-3">Office Address</h3>
                <p className="text-gray-600 leading-relaxed text-sm">
                  M/s. Dynamic Green Energy<br />
                  Flat No: 189, Thamirabarani Street,<br />
                  Park Town, Madurai - 625017,<br />
                  Tamil Nadu, India
                </p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 h-full group" data-testid="card-contact-phone">
              <CardContent className="p-8 text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-2xl mb-6 group-hover:bg-green-600 transition-colors duration-300">
                  <Phone className="w-8 h-8 text-green-600 group-hover:text-white transition-colors duration-300" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-3">Call Us</h3>
                <a
                  href="tel:+918072824034"
                  data-testid="link-phone"
                  className="text-green-600 font-semibold hover:text-green-700 transition-colors text-lg"
                >
                  +91 80728 24034
                </a>
                <p className="text-gray-500 text-sm mt-2">Mon - Sat, 9 AM - 6 PM</p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
          >
            <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 h-full group" data-testid="card-contact-email">
              <CardContent className="p-8 text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-2xl mb-6 group-hover:bg-green-600 transition-colors duration-300">
                  <Mail className="w-8 h-8 text-green-600 group-hover:text-white transition-colors duration-300" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-3">Email Us</h3>
                <a
                  href="mailto:dynamicmdu2018@gmail.com"
                  data-testid="link-email"
                  className="text-green-600 font-semibold hover:text-green-700 transition-colors text-sm break-all"
                >
                  dynamicmdu2018@gmail.com
                </a>
                <p className="text-gray-500 text-sm mt-2">GSTIN: 33ATLPV5789M1ZK</p>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function ServiceAreasSection() {
  const districts = [
    "Madurai", "Tuticorin", "Ramanathapuram", "Tirunelveli", "Dindigul",
    "Ariyalur", "Chengalpattu", "Chennai", "Coimbatore", "Trichy",
    "Salem", "Erode", "Vellore", "Thanjavur", "Cuddalore",
    "Virudhunagar", "Tenkasi", "Nagercoil", "Sivagangai", "Pudukkottai",
  ];

  return (
    <section className="py-16 bg-green-900" aria-label="Service areas in Tamil Nadu">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10"
        >
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3" data-testid="text-areas-title">
            Serving All Across <span className="text-green-300">Tamil Nadu</span>
          </h2>
          <p className="text-green-200 text-base max-w-2xl mx-auto">
            From Madurai to Chennai, we deliver solar solutions across every district of Tamil Nadu
          </p>
        </motion.div>

        <div className="flex flex-wrap justify-center gap-3">
          {districts.map((district, i) => (
            <motion.div
              key={district}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: i * 0.03 }}
              data-testid={`badge-district-${district.toLowerCase()}`}
            >
              <span className="inline-flex items-center gap-1.5 bg-white/10 hover:bg-white/20 transition-colors border border-white/20 rounded-full px-4 py-2 text-sm text-white font-medium cursor-default">
                <MapPin className="w-3.5 h-3.5 text-green-300 flex-shrink-0" />
                {district}
              </span>
            </motion.div>
          ))}
        </div>

        <div className="mt-10 grid sm:grid-cols-3 gap-4 text-center">
          {[
            { label: "Districts Covered", value: "20+" },
            { label: "MW Installed in Tamil Nadu", value: "100+" },
            { label: "Tamil Nadu Projects", value: "40+" },
          ].map((item) => (
            <div key={item.label} className="bg-white/10 border border-white/15 rounded-2xl p-5" data-testid={`text-tn-stat-${item.label.toLowerCase().replace(/\s/g, '-')}`}>
              <div className="text-3xl font-bold text-green-300 mb-1">{item.value}</div>
              <div className="text-white/80 text-sm">{item.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="bg-gray-900 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-3 gap-12 mb-12">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <img src={logoPath} alt="Dynamic Green Energy" className="h-14 w-14 rounded-lg" />
              <div>
                <h3 className="text-white font-bold text-lg">Dynamic Green Energy</h3>
                <p className="text-green-400 text-xs font-semibold">Reliable Solar Project Developers</p>
              </div>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">
              Providing eco-friendly solar energy solutions since 2018. EPC development,
              O&M services, and installation & commissioning across India.
            </p>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">Quick Links</h4>
            <div className="space-y-2.5">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={(e) => {
                    e.preventDefault();
                    document.querySelector(link.href)?.scrollIntoView({ behavior: "smooth" });
                  }}
                  data-testid={`link-footer-${link.label.toLowerCase()}`}
                  className="block text-gray-400 hover:text-green-400 text-sm transition-colors"
                >
                  {link.label}
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">Contact Info</h4>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-green-400 mt-1 flex-shrink-0" />
                <span className="text-gray-400 text-sm">
                  Flat No: 189, Thamirabarani Street,
                  Park Town, Madurai - 625017, Tamil Nadu
                </span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-green-400 flex-shrink-0" />
                <a href="tel:+918072824034" className="text-gray-400 hover:text-green-400 text-sm transition-colors">
                  +91 80728 24034
                </a>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-green-400 flex-shrink-0" />
                <a href="mailto:dynamicmdu2018@gmail.com" className="text-gray-400 hover:text-green-400 text-sm transition-colors">
                  dynamicmdu2018@gmail.com
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-gray-500 text-sm" data-testid="text-copyright">
            &copy; {new Date().getFullYear()} Dynamic Green Energy. All rights reserved.
          </p>
          <p className="text-gray-500 text-sm">GSTIN: 33ATLPV5789M1ZK</p>
        </div>
      </div>
    </footer>
  );
}

export default function Home() {
  return (
    <div className="min-h-screen bg-white overflow-x-hidden">
      <Navbar />
      <HeroSection />
      <StatsSection />
      <AboutSection />
      <ServicesSection />
      <TurnkeySection />
      <ProjectsSection />
      <TimelineSection />
      <LeadershipSection />
      <ContactSection />
      <ServiceAreasSection />
      <Footer />
    </div>
  );
}
