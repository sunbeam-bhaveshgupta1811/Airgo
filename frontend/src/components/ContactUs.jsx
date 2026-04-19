import React, { useState } from 'react';
import { Container, Row, Col, Form, Button, Card, Alert, Badge, ProgressBar } from 'react-bootstrap';
import { FaPhone, FaEnvelope, FaMapMarkerAlt, FaClock, FaHeadset, FaPaperPlane, FaCheckCircle, FaUpload, FaComments, FaPlane, FaExclamationTriangle } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import '../css/ContactUs.css';

const ContactUs = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    urgency: 'low',
    bookingRef: '',
    message: '',
    files: []
  });

  const [submitted, setSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [showChat, setShowChat] = useState(false);

  const airlines = [
    { 
      name: "Air India", 
      url: "https://www.airindia.in/contact-us.html", 
      logo: "https://www.tata.com/content/dam/tata/images/verticals/desktop/airindia_newlivery_card_hz_desktop_390x362.jpg" 
    },
    { 
      name: "IndiGo", 
      url: "https://www.goindigo.in/contact-us.html", 
      logo: "https://static1.simpleflyingimages.com/wordpress/wp-content/uploads/2024/04/indigo-a350-900-april-2024.png" 
    },
    { 
      name: "Vistara", 
      url: "https://www.airvistara.com/in/en/contact-us", 
      logo: "https://tse2.mm.bing.net/th/id/OIP.m6V4MhNjm18_ox5pzRhuMwHaEK?pid=Api&P=0&h=180" 
    },
    { 
      name: "Emirates", 
      url: "https://www.emirates.com/in/english/help/contact-us/",
      logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d0/Emirates_logo.svg/2560px-Emirates_logo.svg.png" 
    },
    { 
      name: "Qatar Airways", 
      url: "https://www.qatarairways.com/en-in/contact-us.html",
      logo: "https://upload.wikimedia.org/wikipedia/en/thumb/9/9b/Qatar_Airways_Logo.svg/1200px-Qatar_Airways_Logo.svg.png" 
    },
    { 
      name: "SpiceJet", 
      url: "https://www.spicejet.com/contact-us.aspx",
      logo: "https://tse4.mm.bing.net/th/id/OIP.ykg5F5tAAZPNQ_gZgQCI8wHaE8?pid=Api&P=0&h=180"
    }
  ];

  const subjectOptions = [
    { value: "", label: "Select Subject", icon: "" },
    { value: "new-booking", label: "New Flight Booking", icon: "✈️" },
    { value: "modify-booking", label: "Modify Existing Booking", icon: "📝" },
    { value: "cancellation", label: "Flight Cancellation", icon: "❌" },
    { value: "refund", label: "Refund Request", icon: "💰" },
    { value: "baggage", label: "Baggage Issues", icon: "🧳" },
    { value: "special-assistance", label: "Special Assistance", icon: "♿" },
    { value: "seat-selection", label: "Seat Selection", icon: "💺" },
    { value: "meal-preference", label: "Meal Preferences", icon: "🍽️" },
    { value: "travel-insurance", label: "Travel Insurance", icon: "🛡️" },
    { value: "visa-passport", label: "Visa/Passport Help", icon: "📋" },
    { value: "group-booking", label: "Group Booking (10+ passengers)", icon: "👥" },
    { value: "complaint", label: "File a Complaint", icon: "⚠️" },
    { value: "other", label: "Other", icon: "💬" }
  ];

  const urgencyOptions = [
    { value: "low", label: "Low - General inquiry", color: "success", icon: "🟢" },
    { value: "medium", label: "Medium - Need response within 24hrs", color: "warning", icon: "🟡" },
    { value: "high", label: "High - Flight within 48hrs", color: "danger", icon: "🟠" },
    { value: "urgent", label: "Urgent - Flight within 6hrs", color: "danger", icon: "🔴" }
  ];

  const validateField = (name, value) => {
    switch (name) {
      case 'email':
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) ? '' : 'Please enter a valid email address';
      case 'phone':
        return value === '' || /^[\+]?[1-9][\d]{0,15}$/.test(value) ? '' : 'Please enter a valid phone number';
      case 'name':
        return value.length >= 2 ? '' : 'Name must be at least 2 characters';
      case 'bookingRef':
        return value === '' || /^[A-Z0-9]{6,8}$/i.test(value) ? '' : 'Booking reference should be 6-8 characters';
      case 'subject':
        return value !== '' ? '' : 'Please select a subject';
      case 'message':
        return value.length >= 10 ? '' : 'Message must be at least 10 characters';
      default:
        return '';
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Real-time validation
    const error = validateField(name, value);
    setErrors(prev => ({
      ...prev,
      [name]: error
    }));
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched(prev => ({
      ...prev,
      [name]: true
    }));
  };

  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);
    const validFiles = files.filter(file => file.size <= 5 * 1024 * 1024); // 5MB limit
    
    setFormData(prev => ({
      ...prev,
      files: validFiles
    }));

    if (files.length !== validFiles.length) {
      alert('Some files were too large (max 5MB each) and were not uploaded.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate all fields
    const newErrors = {};
    Object.keys(formData).forEach(key => {
      if (key !== 'files' && key !== 'phone' && key !== 'bookingRef') {
        const error = validateField(key, formData[key]);
        if (error) newErrors[key] = error;
      }
    });

    setErrors(newErrors);
    setTouched(Object.keys(formData).reduce((acc, key) => ({ ...acc, [key]: true }), {}));

    if (Object.keys(newErrors).length > 0) {
      return;
    }

    setIsLoading(true);
    
    // Simulate form submission
    setTimeout(() => {
      setIsLoading(false);
      setSubmitted(true);
    }, 2000);
  };

  const getFieldClass = (fieldName) => {
    if (!touched[fieldName]) return 'modern-input';
    if (errors[fieldName]) return 'modern-input is-invalid';
    if (formData[fieldName] && !errors[fieldName]) return 'modern-input is-valid';
    return 'modern-input';
  };

  const getUrgencyBadge = (urgency) => {
    const option = urgencyOptions.find(opt => opt.value === urgency);
    return option ? { color: option.color, icon: option.icon } : { color: 'secondary', icon: '⚪' };
  };

  return (
    <div className="contact-page">
      {/* Enhanced Hero Section */}
      <section className="contact-hero">
        <div className="hero-background"></div>
        <div className="hero-overlay"></div>
        <Container>
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="hero-content text-center py-5"
          >
            <div className="hero-icon mb-4">
              <motion.div
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
              >
                <FaPlane size={60} className="text-white" />
              </motion.div>
            </div>
            <h1 className="display-4 fw-bold text-white mb-3">
              Contact Our Travel Experts
            </h1>
            <p className="lead text-white-75 mb-4 mx-auto" style={{ maxWidth: '600px' }}>
              We're available 24/7 to assist with your travel needs. Get personalized support for all your flight bookings and travel queries.
            </p>
            <div className="hero-stats d-flex justify-content-center gap-4 flex-wrap">
              <motion.div 
                className="stat-item"
                whileHover={{ scale: 1.05 }}
              >
                <div className="stat-number">24/7</div>
                <div className="stat-label">Support</div>
              </motion.div>
              <motion.div 
                className="stat-item"
                whileHover={{ scale: 1.05 }}
              >
                <div className="stat-number">98%</div>
                <div className="stat-label">Satisfaction</div>
              </motion.div>
              <motion.div 
                className="stat-item"
                whileHover={{ scale: 1.05 }}
              >
                <div className="stat-number">&lt;2hrs</div>
                <div className="stat-label">Response Time</div>
              </motion.div>
            </div>
          </motion.div>
        </Container>
      </section>

      {/* Main Content */}
      <Container className="py-5" style={{ marginTop: '-50px', position: 'relative', zIndex: 10 }}>
        <AnimatePresence mode="wait">
          {submitted ? (
            <motion.div 
              key="success"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.5 }}
              className="text-center py-5"
            >
              <Card className="success-card border-0 shadow-lg mx-auto" style={{ maxWidth: '600px' }}>
                <Card.Body className="p-5">
                  <div className="success-animation mb-4">
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.2, type: "spring" }}
                      className="success-icon"
                    >
                      <FaCheckCircle size={64} className="text-success" />
                    </motion.div>
                  </div>
                  <h2 className="fw-bold text-primary mb-3">Message Sent Successfully!</h2>
                  <p className="text-muted mb-4">
                    Thank you for contacting us. Our travel experts will get back to you within{' '}
                    <Badge bg={getUrgencyBadge(formData.urgency).color}>
                      {formData.urgency === 'urgent' ? '30 minutes' : 
                       formData.urgency === 'high' ? '2 hours' : 
                       formData.urgency === 'medium' ? '24 hours' : '48 hours'}
                    </Badge>
                  </p>
                  
                  {/* Next Steps Timeline */}
                  <div className="next-steps mt-4 text-start">
                    <h5 className="fw-bold mb-3 text-center">What happens next?</h5>
                    <div className="timeline">
                      <div className="timeline-item">
                        <span className="timeline-number">1</span>
                        <span>Confirmation email sent to {formData.email}</span>
                      </div>
                      <div className="timeline-item">
                        <span className="timeline-number">2</span>
                        <span>Our team reviews your {formData.subject.replace('-', ' ')} request</span>
                      </div>
                      <div className="timeline-item">
                        <span className="timeline-number">3</span>
                        <span>Personalized response with solutions</span>
                      </div>
                      {formData.bookingRef && (
                        <div className="timeline-item">
                          <span className="timeline-number">4</span>
                          <span>Booking {formData.bookingRef} will be reviewed</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="d-flex gap-3 justify-content-center mt-4">
                    <Button 
                      variant="primary"
                      onClick={() => {
                        setSubmitted(false);
                        setFormData({
                          name: '',
                          email: '',
                          phone: '',
                          subject: '',
                          urgency: 'low',
                          bookingRef: '',
                          message: '',
                          files: []
                        });
                        setTouched({});
                        setErrors({});
                      }}
                      className="px-4 rounded-pill"
                    >
                      Send Another Message
                    </Button>
                    <Button 
                      variant="outline-primary"
                      href="/"
                      className="px-4 rounded-pill"
                    >
                      Back to Home
                    </Button>
                  </div>
                </Card.Body>
              </Card>
            </motion.div>
          ) : (
            <motion.div
              key="form"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <Row className="g-5">
                {/* Enhanced Contact Form */}
                <Col lg={7}>
                  <motion.div
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    <Card className="contact-form-card border-0 shadow-lg h-100">
                      <Card.Body className="p-4 p-md-5">
                        <div className="form-header mb-4">
                          <h2 className="fw-bold text-primary mb-2">Get in Touch</h2>
                          <p className="text-muted">Fill out the form below and we'll get back to you shortly</p>
                          
                          {/* Progress Indicator */}
                          <div className="form-progress mb-3">
                            <small className="text-muted">Form completion</small>
                            <ProgressBar 
                              now={Object.values(formData).filter(val => val && val.length > 0).length / 6 * 100} 
                              className="mt-1"
                              style={{ height: '4px' }}
                            />
                          </div>
                        </div>
                        
                        <Form onSubmit={handleSubmit}>
                          <Row className="g-4">
                            <Col md={6}>
                              <Form.Group className="form-floating">
                                <Form.Control 
                                  type="text" 
                                  name="name"
                                  value={formData.name}
                                  onChange={handleChange}
                                  onBlur={handleBlur}
                                  placeholder="Full Name"
                                  className={getFieldClass('name')}
                                  required 
                                />
                                <Form.Label>Full Name *</Form.Label>
                                {touched.name && errors.name && (
                                  <div className="invalid-feedback">{errors.name}</div>
                                )}
                              </Form.Group>
                            </Col>
                            <Col md={6}>
                              <Form.Group className="form-floating">
                                <Form.Control 
                                  type="email" 
                                  name="email"
                                  value={formData.email}
                                  onChange={handleChange}
                                  onBlur={handleBlur}
                                  placeholder="Email Address"
                                  className={getFieldClass('email')}
                                  required 
                                />
                                <Form.Label>Email Address *</Form.Label>
                                {touched.email && errors.email && (
                                  <div className="invalid-feedback">{errors.email}</div>
                                )}
                              </Form.Group>
                            </Col>
                            <Col md={6}>
                              <Form.Group className="form-floating">
                                <Form.Control 
                                  type="tel" 
                                  name="phone"
                                  value={formData.phone}
                                  onChange={handleChange}
                                  onBlur={handleBlur}
                                  placeholder="Phone Number"
                                  className={getFieldClass('phone')}
                                />
                                <Form.Label>Phone Number</Form.Label>
                                {touched.phone && errors.phone && (
                                  <div className="invalid-feedback">{errors.phone}</div>
                                )}
                              </Form.Group>
                            </Col>
                            <Col md={6}>
                              <Form.Group className="form-floating">
                                <Form.Control 
                                  type="text" 
                                  name="bookingRef"
                                  value={formData.bookingRef}
                                  onChange={handleChange}
                                  onBlur={handleBlur}
                                  placeholder="Booking Reference"
                                  className={getFieldClass('bookingRef')}
                                  pattern="[A-Z0-9]{6,8}"
                                />
                                <Form.Label>Booking Reference (Optional)</Form.Label>
                                <Form.Text className="text-muted">
                                  Format: ABC123 or 12345678
                                </Form.Text>
                                {touched.bookingRef && errors.bookingRef && (
                                  <div className="invalid-feedback">{errors.bookingRef}</div>
                                )}
                              </Form.Group>
                            </Col>
                            <Col md={6}>
                              <Form.Group className="form-floating">
                                <Form.Select 
                                  name="subject"
                                  value={formData.subject}
                                  onChange={handleChange}
                                  onBlur={handleBlur}
                                  className={getFieldClass('subject')}
                                  required
                                >
                                  {subjectOptions.map(option => (
                                    <option key={option.value} value={option.value}>
                                      {option.icon} {option.label}
                                    </option>
                                  ))}
                                </Form.Select>
                                <Form.Label>Subject *</Form.Label>
                                {touched.subject && errors.subject && (
                                  <div className="invalid-feedback">{errors.subject}</div>
                                )}
                              </Form.Group>
                            </Col>
                            <Col md={6}>
                              <Form.Group className="form-floating">
                                <Form.Select 
                                  name="urgency"
                                  value={formData.urgency}
                                  onChange={handleChange}
                                  className="modern-input"
                                >
                                  {urgencyOptions.map(option => (
                                    <option key={option.value} value={option.value}>
                                      {option.icon} {option.label}
                                    </option>
                                  ))}
                                </Form.Select>
                                <Form.Label>Priority Level</Form.Label>
                              </Form.Group>
                            </Col>
                            <Col xs={12}>
                              <Form.Group className="form-floating">
                                <Form.Control 
                                  as="textarea" 
                                  rows={5} 
                                  name="message"
                                  value={formData.message}
                                  onChange={handleChange}
                                  onBlur={handleBlur}
                                  placeholder="Your Message"
                                  className={getFieldClass('message')}
                                  style={{ height: '120px' }}
                                  required 
                                />
                                <Form.Label>Your Message *</Form.Label>
                                {touched.message && errors.message && (
                                  <div className="invalid-feedback">{errors.message}</div>
                                )}
                              </Form.Group>
                            </Col>
                            <Col xs={12}>
                              <Form.Group className="mb-3">
                                <Form.Label className="fw-bold d-flex align-items-center">
                                  <FaUpload className="me-2" />
                                  Attach Documents (Optional)
                                </Form.Label>
                                <Form.Control 
                                  type="file" 
                                  multiple
                                  accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                                  className="modern-input"
                                  onChange={handleFileUpload}
                                />
                                <Form.Text className="text-muted">
                                  Upload tickets, receipts, or relevant documents (Max 5MB each)
                                </Form.Text>
                                {formData.files.length > 0 && (
                                  <div className="mt-2">
                                    {formData.files.map((file, index) => (
                                      <Badge key={index} bg="secondary" className="me-2 mb-1">
                                        {file.name}
                                      </Badge>
                                    ))}
                                  </div>
                                )}
                              </Form.Group>
                            </Col>
                            <Col xs={12}>
                              <motion.div
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                              >
                                <Button 
                                  variant="primary" 
                                  type="submit" 
                                  size="lg" 
                                  className="w-100 submit-btn rounded-pill py-3"
                                  disabled={isLoading || Object.keys(errors).some(key => errors[key])}
                                >
                                  {isLoading ? (
                                    <>
                                      <span className="spinner-border spinner-border-sm me-2" />
                                      Sending Message...
                                    </>
                                  ) : (
                                    <>
                                      <FaPaperPlane className="me-2" />
                                      Send Message
                                    </>
                                  )}
                                </Button>
                              </motion.div>
                            </Col>
                          </Row>
                        </Form>
                      </Card.Body>
                    </Card>
                  </motion.div>
                </Col>

                {/* Enhanced Contact Information */}
                <Col lg={5}>
                  <motion.div
                    initial={{ opacity: 0, x: 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 }}
                    className="h-100"
                  >
                    <Card className="contact-info-card border-0 shadow-lg h-100">
                      <Card.Body className="p-4 p-md-5">
                        <h2 className="fw-bold text-primary mb-4">Contact Information</h2>
                        
                        <div className="contact-methods mb-5">
                          <motion.div 
                            className="contact-item mb-4"
                            whileHover={{ x: 5 }}
                          >
                            <div className="contact-icon-wrapper">
                              <div className="contact-icon bg-primary">
                                <FaHeadset className="text-white" />
                              </div>
                            </div>
                            <div className="contact-details">
                              <h5 className="fw-bold mb-2">24/7 Customer Support</h5>
                              <p className="text-muted mb-2">For immediate assistance with bookings</p>
                              <a href="tel:+18002001234" className="contact-link fw-bold">+1 800 200 1234</a>
                            </div>
                          </motion.div>
                          
                          <motion.div 
                            className="contact-item mb-4"
                            whileHover={{ x: 5 }}
                          >
                            <div className="contact-icon-wrapper">
                              <div className="contact-icon bg-success">
                                <FaEnvelope className="text-white" />
                              </div>
                            </div>
                            <div className="contact-details">
                              <h5 className="fw-bold mb-2">Email Support</h5>
                              <p className="text-muted mb-2">For general inquiries and feedback</p>
                              <a href="mailto:support@sunbeamtravel.com" className="contact-link fw-bold">support@sunbeamtravel.com</a>
                            </div>
                          </motion.div>
                          
                          <motion.div 
                            className="contact-item mb-4"
                            whileHover={{ x: 5 }}
                          >
                            <div className="contact-icon-wrapper">
                              <div className="contact-icon bg-danger">
                                <FaMapMarkerAlt className="text-white" />
                              </div>
                            </div>
                            <div className="contact-details">
                              <h5 className="fw-bold mb-2">Corporate Office</h5>
                              <p className="text-muted mb-0">Sunbeam Travel Plaza<br />123 Airport Road<br />Mumbai, Maharashtra 400099</p>
                            </div>
                          </motion.div>
                          
                          <motion.div 
                            className="contact-item"
                            whileHover={{ x: 5 }}
                          >
                            <div className="contact-icon-wrapper">
                              <div className="contact-icon bg-warning">
                                <FaClock className="text-white" />
                              </div>
                            </div>
                            <div className="contact-details">
                              <h5 className="fw-bold mb-2">Business Hours</h5>
                              <p className="text-muted mb-1">Monday - Friday: 9:00 AM - 7:00 PM</p>
                              <p className="text-muted mb-0">Saturday: 10:00 AM - 4:00 PM</p>
                            </div>
                          </motion.div>
                        </div>

                        {/* Emergency Contact */}
                        <Alert variant="warning" className="emergency-alert">
                          <FaExclamationTriangle className="me-2" />
                          <strong>Emergency Travel Support:</strong><br />
                          For urgent flight changes or cancellations within 6 hours, call our emergency hotline: <strong>+1 800 URGENT1</strong>
                        </Alert>

                        <div className="social-section">
                          <h5 className="fw-bold mb-3">Connect With Us</h5>
                          <div className="social-icons-grid">
                            <motion.a 
                              href="#" 
                              whileHover={{ scale: 1.1, rotate: 5 }}
                              className="social-icon facebook"
                            >
                              <i className="bi bi-facebook"></i>
                            </motion.a>
                            <motion.a 
                              href="#" 
                              whileHover={{ scale: 1.1, rotate: -5 }}
                              className="social-icon twitter"
                            >
                              <i className="bi bi-twitter"></i>
                            </motion.a>
                            <motion.a 
                              href="#" 
                              whileHover={{ scale: 1.1, rotate: 5 }}
                              className="social-icon instagram"
                            >
                              <i className="bi bi-instagram"></i>
                            </motion.a>
                            <motion.a 
                              href="#" 
                              whileHover={{ scale: 1.1, rotate: -5 }}
                              className="social-icon linkedin"
                            >
                              <i className="bi bi-linkedin"></i>
                            </motion.a>
                          </div>
                        </div>
                      </Card.Body>
                    </Card>
                  </motion.div>
                </Col>
              </Row>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Enhanced Airline Partners Section */}
        <motion.section 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="airline-partners mt-5 pt-5"
        >
          <div className="text-center mb-5">
            <h2 className="fw-bold text-primary mb-3">Our Airline Partners</h2>
            <p className="text-muted lead mx-auto" style={{ maxWidth: '600px' }}>
              Contact these airlines directly for flight-specific queries and specialized support
            </p>
          </div>
          
          <Row className="g-4 justify-content-center">
            {airlines.map((airline, index) => (
              <Col key={index} xs={6} sm={4} md={3} lg={2}>
                <motion.div 
                  whileHover={{ y: -8, scale: 1.02 }}
                  transition={{ type: "spring", stiffness: 300 }}
                  className="airline-card-wrapper"
                >
                  <a 
                    href={airline.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-decoration-none"
                  >
                    <Card className="airline-card border-0 shadow-sm h-100">
                      <div className="airline-logo-container p-3">
                        <Card.Img 
                          variant="top" 
                          src={airline.logo} 
                          alt={airline.name}
                          className="airline-logo"
                        />
                      </div>
                      <Card.Body className="text-center py-2">
                        <Card.Title className="h6 mb-0 text-dark">{airline.name}</Card.Title>
                      </Card.Body>
                    </Card>
                  </a>
                </motion.div>
              </Col>
            ))}
          </Row>
        </motion.section>

        {/* Enhanced FAQ CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-5 pt-4"
        >
          <Card className="faq-cta-card border-0 shadow-lg">
            <Card.Body className="p-4 p-md-5">
              <Row className="align-items-center">
                <Col md={8}>
                  <div className="d-flex align-items-center">
                    <div className="faq-icon me-4">
                      <i className="bi bi-question-circle-fill text-primary" style={{ fontSize: '3rem' }}></i>
                    </div>
                    <div>
                      <h3 className="fw-bold text-primary mb-2">Need Help Immediately?</h3>
                      <p className="text-muted mb-0 lead">Check our comprehensive FAQ section for instant answers to common travel questions</p>
                    </div>
                  </div>
                </Col>
                <Col md={4} className="text-end">
                  <Button variant="outline-primary" size="lg" className="rounded-pill px-4">
                    View FAQ
                  </Button>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </motion.div>
      </Container>

      {/* Floating Chat Button */}
      <AnimatePresence>
        {!submitted && (
          <motion.div 
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            className="floating-chat-btn"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            style={{
              position: 'fixed',
              bottom: '30px',
              right: '30px',
              zIndex: 1000
            }}
          >
            <Button 
              variant="primary" 
              size="lg" 
              className="rounded-circle p-3 shadow-lg chat-btn"
              style={{ width: '60px', height: '60px' }}
              onClick={() => setShowChat(!showChat)}
            >
              <FaComments />
            </Button>
            {showChat && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="chat-tooltip"
              >
                Live Chat Available!
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ContactUs;