import React, { useState, useEffect } from 'react';
import { Mail, Phone, MapPin, Calendar, Code, Globe, Users, Award, ChevronRight, Menu, X, ExternalLink, Github, Linkedin, Briefcase } from 'lucide-react';

function App() {
  const [activeSection, setActiveSection] = useState('home');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const skills = [
    { name: 'WordPress Development', level: 95 },
    { name: 'React.js', level: 70 },
    { name: 'JavaScript', level: 92 },
    { name: 'PHP', level: 88 },
    { name: 'REST API Integration', level: 90 },
    { name: 'WooCommerce', level: 85 },
    { name: 'Elementor Pro', level: 95 },
    { name: 'SEO Optimization', level: 88 },
    { name: 'Google Analytics', level: 80 },
    { name: 'Google Tag Manager', level: 70 },
    { name: 'Google Optimize / A/B Testing', level: 80 },
    { name: 'Google Cloud API Integration', level: 80 },
    { name: 'Dashboard Development', level: 88 },
    { name: 'Database Design (Supabase)', level: 85 },
    { name: 'Team Leadership', level: 82 }
  ];

  const projects = [
    {
      title: 'escindia.in',
      company: 'Electronics and Computer Software Export Promotion Council (ESC)',
      description: 'Official ESC India platform featuring comprehensive information about council initiatives, member directories, and export promotion programs. Complete redesign with modern UI/UX, advanced filtering, and SEO optimization.',
      tech: ['WordPress', 'Elementor', 'PHP', 'MySQL', 'JavaScript'],
      features: ['Member Directory System', 'Advanced Search & Filter', 'SEO-Optimized Structure', 'Responsive Design', 'Performance Optimization', 'Custom Forms Integration']
    },
    {
      title: 'indiasoft.org',
      company: 'Electronics and Computer Software Export Promotion Council (ESC)',
      description: 'India Software platform showcasing the Indian software industry, export statistics, and industry resources. Features dynamic content management and real-time data integration.',
      tech: ['WordPress', 'PHP', 'REST API',],
      features: ['Dynamic Dashboard', 'Industry Statistics Integration', 'Real-time Data Sync', 'Document Management', 'Multi-language Support', 'Analytics Dashboard']
    },
    {
      title: 'indiaelectronicsexpo.com',
      company: 'Electronics and Computer Software Export Promotion Council (ESC)',
      description: 'India Electronics Expo platform for international exhibitions featuring exhibitor listings, event details, and delegate management. Includes comprehensive event portal with real-time updates.',
      tech: ['WordPress', 'PHP', 'React.js', 'Supabase', 'Elementor'],
      features: [ 'Event Schedule & Calendar', 'Delegate Registration Portal',  'Booth Allocation System', 'PDF Export Functionality']
    },
    {
      title: 'ESC B2B Meeting Portal',
      company: 'Electronics and Computer Software Export Promotion Council (ESC)',
      description: 'Enterprise B2B meeting platform enabling delegates to discover, filter, and book meetings with exhibitors. Unified authentication using passport-based login system with real-time synchronization.',
      tech: ['WordPress', 'PHP', 'React.js', 'Supabase', 'Ninja Forms', 'Google Sheets API'],
      features: ['Passport-Based Authentication', 'Real-time Meeting Booking', 'Advanced Filtering & Tags', 'Delegate-Exhibitor Matchmaking', 'Event Dashboard', 'Bulk Data Ingestion']
    },
    {
      title: 'iDreamCareer.com',
      company: 'iDreamCareer',
      description: 'Full-stack WordPress development with Elementor, featuring 100+ landing pages, custom plugins, and advanced integrations for career guidance and exam preparation.',
      tech: ['WordPress', 'Elementor', 'JavaScript', 'PHP', 'REST API', 'WebEngage'],
      features: ['Custom Plugin Development', 'WebEngage Integration', 'Performance Optimization', 'Core Web Vitals Optimization', '100+ Landing Pages']
    },
    {
      title: 'FAQ.idreamcareer.com',
      company: 'iDreamCareer',
      description: 'Dynamic FAQ platform with WordPress REST API integration for centralized content management and automated content fetching from main database.',
      tech: ['WordPress', 'REST API', 'JavaScript', 'PHP'],
      features: ['Automated Content Fetching', 'Q&A Format Conversion', 'SEO-Optimized Structure', 'Centralized Management']
    },
    {
      title: 'Exams.idreamcareer.com',
      company: 'iDreamCareer',
      description: 'Comprehensive exams directory with 200+ pages and detailed application guides for competitive exams with hierarchical navigation structure.',
      tech: ['WordPress', 'Custom Post Types', 'SEO', 'Responsive Design', 'JavaScript'],
      features: ['Hierarchical URL Structure', '15 Component Sub-pages', 'Educational Content Management', 'Advanced Search & Filter']
    }
  ];

  const achievements = [
    'Achieved passing Core Web Vitals scores for INP and LCP',
    'Developed 100+ optimized landing pages',
    'Created custom WordPress plugins with advanced validation',
    'Implemented webhook integrations for lead management',
    'Built comprehensive exam directory with 200+ pages',
    'Led successful redevelopment of 4 high-traffic ESC platforms',
    'Managed cross-functional teams across development and marketing',
    'Designed unified B2B portal handling 1000+ delegates per event'
  ];

  const experiences = [
    {
      title: 'Manager Web Developer',
      company: 'Electronics and Computer Software Export Promotion Council (ESC), India',
      duration: '20 Jul, 2025, - Present',
      responsibilities: [
        'Led end-to-end redevelopment of multiple high-traffic ESC platforms (escindia.in, indiasoft.org, indiaelectronicsexpo.com, escawards.in)',
        'Managed cross-functional team of 2 developers and 1 marketing agency for seamless execution',
        'Built custom PHP-based dashboards and ESC Accelerator platform with advanced backend logic',
        'Architected B2B Meeting Portal with passport-based unified authentication system',
        'Implemented bulk data ingestion workflows using Supabase for real-time exhibitor and delegate access',
        'Integrated Elementor Ninja Forms with automated data pipelines to Google Sheets and databases',
        'Migrated legacy event data while preserving historical records and improving onboarding speed'
      ],
      highlights: ['4 Platforms Redeveloped', '1000+ Delegates per Event', 'Unified Authentication System']
    },
    {
      title: 'Senior WordPress Developer',
      company: 'iDreamCareer.com',
      duration: 'May 2021 - 17 Jul, 2025, (4+ Years)',
      responsibilities: [
        'Developed iDreamCareer.com using Elementor Page Builder with custom JavaScript and CSS',
        'Created and optimized 100+ landing pages and custom post-type directories',
        'Built custom WordPress plugins with specialized validation for Indian phone numbers',
        'Developed webhook integrations for streamlined data transmission and lead management'
      ],
      highlights: ['100+ Landing Pages', '200+ Exam Directory Pages', '95% Core Web Vitals Score']
    }
  ];

  const scrollToSection = (sectionId) => {
    setActiveSection(sectionId);
    setMobileMenuOpen(false);
    document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 text-white">
      {/* Navigation */}
      <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${isScrolled ? 'bg-gray-900/95 backdrop-blur-md shadow-lg' : 'bg-transparent'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              DC
            </div>
            
            {/* Desktop Menu */}
            <div className="hidden md:flex space-x-8">
              {['home', 'about', 'skills', 'projects', 'experience', 'contact'].map((item) => (
                <button
                  key={item}
                  onClick={() => scrollToSection(item)}
                  className={`capitalize transition-colors duration-200 hover:text-blue-400 ${activeSection === item ? 'text-blue-400' : 'text-gray-300'}`}
                >
                  {item}
                </button>
              ))}
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="md:hidden bg-gray-800/95 backdrop-blur-md rounded-lg mt-2 p-4">
              {['home', 'about', 'skills', 'projects', 'experience', 'contact'].map((item) => (
                <button
                  key={item}
                  onClick={() => scrollToSection(item)}
                  className="block w-full text-left py-2 capitalize hover:text-blue-400 transition-colors"
                >
                  {item}
                </button>
              ))}
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section id="home" className="min-h-screen flex items-center justify-center px-4 pt-20">
        <div className="text-center max-w-4xl mx-auto">
          <div className="mb-8">
            <div className="w-32 h-32 mx-auto mb-6 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-4xl font-bold">
              DC
            </div>
          </div>
          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            Web Developer
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 mb-8 leading-relaxed">
            Expert in WordPress, Elementor pro, and full-stack development. Building scalable, high-performance websites with modern technologies.
          </p>
          <div className="flex flex-wrap justify-center gap-4 mb-8">
            <div className="flex items-center gap-2 bg-gray-800/50 px-4 py-2 rounded-full">
              <Mail size={18} />
              <a href="mailto:dakshay.chauhan.28.srk@gmail.com">
              <span>dakshay.chauhan.28.srk@gmail.com</span></a>
            </div>
            <div className="flex items-center gap-2 bg-gray-800/50 px-4 py-2 rounded-full">
              <Phone size={18} />
              <a  href="tel:+9012337116">
              <span>+91 9012337116</span></a>
            </div>
            <div className="flex items-center gap-2 bg-gray-800/50 px-4 py-2 rounded-full">
              <MapPin size={18} />
              <span>Greater Noida, UP</span>
            </div>
          </div>
          <div className="flex justify-center gap-4">
            <button
              onClick={() => scrollToSection('projects')}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 px-8 py-3 rounded-full font-semibold transition-all duration-300 transform hover:scale-105"
            >
              View My Work
            </button>
            <button
              onClick={() => scrollToSection('contact')}
              className="border-2 border-blue-400 text-blue-400 hover:bg-blue-400 hover:text-white px-8 py-3 rounded-full font-semibold transition-all duration-300"
            >
              Get In Touch
            </button>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-12 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            About Me
          </h2>
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="text-2xl font-semibold mb-4 text-blue-400">Professional Overview</h3>
              <p className="text-gray-300 text-lg leading-relaxed mb-6">
                     Manager – Web Development with 5+ years of experience leading the design, development, and scaling of high-performance web platforms. Currently managing web and application initiatives at the Electronics and Computer Software Export Promotion Council (ESC), following extensive hands-on experience delivering growth-driven platforms at iDreamCareer. Strong expertise in custom WordPress development, PHP-based dashboards, B2B portals, RESTful APIs, and performance optimization, with proven ability to coordinate cross-functional teams and translate business requirements into secure, scalable digital solutions.
              </p>
              <p className="text-gray-300 text-lg leading-relaxed mb-6">
                I've successfully developed and optimized 100+ landing pages, created custom WordPress plugins, implemented advanced integrations that significantly improved user engagement, and led the redevelopment of multiple high-traffic platforms. Experienced in managing cross-functional teams and delivering enterprise-scale solutions.
              </p>
              <div className="flex flex-wrap gap-3">
                <span className="bg-blue-600/20 text-blue-400 px-3 py-1 rounded-full text-sm">4+ Years Experience</span>
                <span className="bg-purple-600/20 text-purple-400 px-3 py-1 rounded-full text-sm">100+ Projects</span>
                <span className="bg-green-600/20 text-green-400 px-3 py-1 rounded-full text-sm">Core Web Vitals Expert</span>
                <span className="bg-indigo-600/20 text-indigo-400 px-3 py-1 rounded-full text-sm">Team Leadership</span>
              </div>
            </div>
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8">
              <h3 className="text-2xl font-semibold mb-6 text-purple-400">Education & Certifications</h3>
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <Award className="text-blue-400 mt-1" size={20} />
                  <div>
                    <h4 className="font-semibold text-white">Bachelor of Computer Applications (BCA)</h4>
                    <p className="text-gray-400">Galgotias University, Greater Noida, UP</p>
                    <p className="text-sm text-gray-500">Graduated: 2020</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <Code className="text-purple-400 mt-1" size={20} />
                  <div>
                    <h4 className="font-semibold text-white">WordPress Expert Certification</h4>
                    <p className="text-gray-400">Advanced WordPress Development & Optimization</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <Briefcase className="text-green-400 mt-1" size={20} />
                  <div>
                    <h4 className="font-semibold text-white">Team Leadership & Project Management</h4>
                    <p className="text-gray-400">Cross-functional team coordination and enterprise solution delivery</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Skills Section */}
      <section id="skills" className="py-20 px-4 bg-gray-800/30">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-12 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            Technical Skills & Integrations
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            {skills.map((skill, index) => (
              <div key={index} className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6">
                <div className="flex justify-between items-center mb-3">
                  <span className="font-semibold text-white">{skill.name}</span>
                  <span className="text-blue-400 font-bold">{skill.level}%</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-1000 ease-out"
                    style={{ width: `${skill.level}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-12 grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <Globe className="mx-auto mb-4 text-blue-400" size={48} />
              <h3 className="text-xl font-semibold mb-2">Web Development</h3>
              <p className="text-gray-400">Full-stack development with modern frameworks and technologies</p>
            </div>
            <div className="text-center">
              <Code className="mx-auto mb-4 text-purple-400" size={48} />
              <h3 className="text-xl font-semibold mb-2">Custom Solutions</h3>
              <p className="text-gray-400">Tailored plugins and integrations for specific business needs</p>
            </div>
            <div className="text-center">
              <Award className="mx-auto mb-4 text-green-400" size={48} />
              <h3 className="text-xl font-semibold mb-2">Performance Optimization</h3>
              <p className="text-gray-400">Core Web Vitals optimization and speed improvements</p>
            </div>
          </div>
        </div>
      </section>

      {/* Projects Section */}
      <section id="projects" className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-12 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            Featured Projects
          </h2>
          
          {/* ESC Projects */}
          <div className="mb-16">
            <div className="mb-8">
              <h3 className="text-3xl font-bold text-blue-400 mb-2">Electronics and Computer Software Export Promotion Council (ESC)</h3>
              <div className="h-1 w-24 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"></div>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-8 mb-8">
              {projects.filter(p => p.company.includes('ESC')).map((project, index) => (
                <div key={index} className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 hover:transform hover:scale-105 transition-all duration-300 flex flex-col border border-blue-500/20">
                  <h3 className="text-xl font-bold mb-2 text-blue-400">{project.title}</h3>
                  <p className="text-sm text-blue-300 mb-3">{project.company}</p>
                  <p className="text-gray-300 mb-4 leading-relaxed flex-grow">{project.description}</p>
                  
                  <div className="mb-4">
                    <h4 className="text-sm font-semibold text-purple-400 mb-2">Technologies:</h4>
                    <div className="flex flex-wrap gap-2">
                      {project.tech.map((tech, techIndex) => (
                        <span key={techIndex} className="bg-gray-700 text-gray-300 px-2 py-1 rounded text-xs">
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-semibold text-green-400 mb-2">Key Features:</h4>
                    <ul className="text-sm text-gray-400 space-y-1">
                      {project.features.map((feature, featureIndex) => (
                        <li key={featureIndex} className="flex items-start gap-2">
                          <ChevronRight size={14} className="text-green-400 mt-0.5 flex-shrink-0" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* iDreamCareer Projects */}
          <div>
            <div className="mb-8">
              <h3 className="text-3xl font-bold text-purple-400 mb-2">iDreamCareer</h3>
              <div className="h-1 w-24 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"></div>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {projects.filter(p => p.company.includes('iDreamCareer')).map((project, index) => (
                <div key={index} className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 hover:transform hover:scale-105 transition-all duration-300 flex flex-col border border-purple-500/20">
                  <h3 className="text-xl font-bold mb-2 text-purple-400">{project.title}</h3>
                  <p className="text-sm text-purple-300 mb-3">{project.company}</p>
                  <p className="text-gray-300 mb-4 leading-relaxed flex-grow">{project.description}</p>
                  
                  <div className="mb-4">
                    <h4 className="text-sm font-semibold text-blue-400 mb-2">Technologies:</h4>
                    <div className="flex flex-wrap gap-2">
                      {project.tech.map((tech, techIndex) => (
                        <span key={techIndex} className="bg-gray-700 text-gray-300 px-2 py-1 rounded text-xs">
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-semibold text-green-400 mb-2">Key Features:</h4>
                    <ul className="text-sm text-gray-400 space-y-1">
                      {project.features.map((feature, featureIndex) => (
                        <li key={featureIndex} className="flex items-start gap-2">
                          <ChevronRight size={14} className="text-green-400 mt-0.5 flex-shrink-0" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Experience Section */}
      <section id="experience" className="py-20 px-4 bg-gray-800/30">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-12 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            Professional Experience
          </h2>
          
          <div className="space-y-8">
            {experiences.map((exp, index) => (
              <div key={index} className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
                  <div>
                    <h3 className="text-2xl font-bold text-white mb-2">{exp.title}</h3>
                    <p className="text-blue-400 text-lg font-semibold">{exp.company}</p>
                  </div>
                  <div className="flex items-center gap-2 text-gray-400 mt-4 md:mt-0">
                    <Calendar size={18} />
                    <span>{exp.duration}</span>
                  </div>
                </div>
                
                <div className="grid md:grid-cols-2 gap-8">
                  <div>
                    <h4 className="text-lg font-semibold text-purple-400 mb-4">Key Responsibilities</h4>
                    <ul className="space-y-3 text-gray-300">
                      {exp.responsibilities.map((responsibility, respIndex) => (
                        <li key={respIndex} className="flex items-start gap-3">
                          <ChevronRight size={16} className="text-blue-400 mt-1 flex-shrink-0" />
                          {responsibility}
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="text-lg font-semibold text-green-400 mb-4">Key Highlights</h4>
                    <div className="space-y-4">
                      {exp.highlights.map((highlight, highlightIndex) => (
                        <div key={highlightIndex} className="flex items-start gap-3">
                          <Award size={16} className="text-green-400 mt-1 flex-shrink-0" />
                          <span className="text-gray-300">{highlight}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12 grid md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-400 mb-2">100+</div>
              <p className="text-gray-400">Landing Pages</p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-400 mb-2">4</div>
              <p className="text-gray-400">Platforms Redeveloped</p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-400 mb-2">1000+</div>
              <p className="text-gray-400">Delegates per Event</p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-pink-400 mb-2">3+</div>
              <p className="text-gray-400">Years at iDream</p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-12 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            Let's Work Together
          </h2>
          
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 mb-8">
            <p className="text-xl text-gray-300 mb-8 leading-relaxed">
              Ready to bring your web development projects to life? I specialize in creating high-performance, 
              scalable WordPress solutions, modern React.js applications, and enterprise B2B platforms.
            </p>
            
            <div className="grid md:grid-cols-3 gap-6 mb-8">
              <div className="flex flex-col items-center p-4 bg-gray-700/50 rounded-xl">
                <Mail className="text-blue-400 mb-3" size={32} />
                <h3 className="font-semibold mb-2">Email</h3>
                <p className="text-gray-400 text-sm">dakshay.chauhan.28.srk@gmail.com</p>
              </div>
              <div className="flex flex-col items-center p-4 bg-gray-700/50 rounded-xl">
                <Phone className="text-purple-400 mb-3" size={32} />
                <h3 className="font-semibold mb-2">Phone</h3>
                <p className="text-gray-400 text-sm">+91 9012337116</p>
              </div>
              <div className="flex flex-col items-center p-4 bg-gray-700/50 rounded-xl">
                <MapPin className="text-green-400 mb-3" size={32} />
                <h3 className="font-semibold mb-2">Location</h3>
                <p className="text-gray-400 text-sm">Greater Noida, UP, India</p>
              </div>
            </div>
            
            <div className="flex justify-center gap-4">
            <a href="mailto:dakshay.chauhan.28.srk@gmail.com">
              <button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 px-8 py-3 rounded-full font-semibold transition-all duration-300 transform hover:scale-105 flex items-center gap-2">
                <Mail size={20} />
                Send Email
              </button></a>
             <a  href="tel:+9012337116">
              <button className="border-2 border-blue-400 text-blue-400 hover:bg-blue-400 hover:text-white px-8 py-3 rounded-full font-semibold transition-all duration-300 flex items-center gap-2">
                <Phone size={20} />
                Call Now
              </button></a>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900/80 backdrop-blur-sm py-8 px-4 border-t border-gray-800">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-center md:text-left mb-4 md:mb-0">
              <h3 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-2">
                Dakshay Chauhan
              </h3>
              <p className="text-gray-400">Senior WordPress Developer & Full-Stack Engineer</p>
              <p className="text-gray-500 text-sm">Building scalable web solutions with modern technologies</p>
            </div>
            
            <div className="flex flex-col items-center md:items-end">
              <div className="flex gap-4 mb-3">
                <a href="https://www.linkedin.com/public-profile/settings?trk=d_flagship3_profile_self_view_public_profile">
                <div className="w-10 h-10 bg-blue-800 rounded-full flex items-center justify-center hover:bg-blue-900 transition-colors cursor-pointer">
                  <Linkedin size={20}  />
                </div> </a>
              </div>
              <p className="text-gray-500 text-sm">© 2025 Dakshay Chauhan. All rights reserved.</p>
            </div>
          </div>
          
          <div className="mt-8 pt-6 border-t border-gray-800 text-center">
            <div className="flex flex-wrap justify-center gap-6 text-sm text-gray-400">
              <span>WordPress Expert</span>
              <span>•</span>
              <span>React.js Developer</span>
              <span>•</span>
              <span>Performance Optimization</span>
              <span>•</span>
              <span>Team Leadership</span>
              <span>•</span>
              <span>B2B Platform Development</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
