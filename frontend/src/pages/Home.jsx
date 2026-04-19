import React from "react";
import { Outlet } from "react-router-dom";
import { Container, Row, Col, Card, Button, Badge } from "react-bootstrap";
import {
  FaPlane,
  FaHotel,
  FaCar,
  FaUmbrella,
  FaStar,
  FaArrowRight,
  FaGlobe,
  FaShieldAlt,
  FaClock,
} from "react-icons/fa";
import { motion } from "framer-motion";
import HomeNavbar from "../components/HomeNavbar";
import FlightSearch from "./customer/FlightSearch";
import "../css/Home.css";

function Home() {
  const features = [
    {
      icon: FaPlane,
      title: "Flight Booking",
      description: "Compare and book flights from 500+ airlines worldwide",
      color: "#667eea",
    },
    {
      icon: FaHotel,
      title: "Hotel Reservations",
      description: "Find perfect accommodations from budget to luxury",
      color: "#f093fb",
    },
    {
      icon: FaCar,
      title: "Car Rentals",
      description: "Rent cars from trusted providers at your destination",
      color: "#4facfe",
    },
    {
      icon: FaUmbrella,
      title: "Travel Insurance",
      description: "Protect your trip with comprehensive coverage",
      color: "#43e97b",
    },
  ];

  const popularDestinations = [
    {
      city: "Dubai",
      country: "UAE",
      price: "₹25,999",
      image:
        "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=400",
      rating: 4.8,
      deals: "20% OFF",
    },
    {
      city: "Paris",
      country: "France",
      price: "₹45,999",
      image:
        "https://images.unsplash.com/photo-1502602898536-47ad22581b52?w=400",
      rating: 4.9,
      deals: "Early Bird",
    },
    {
      city: "Tokyo",
      country: "Japan",
      price: "₹55,999",
      image:
        "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=400",
      rating: 4.7,
      deals: "Limited Time",
    },
    {
      city: "New York",
      country: "USA",
      price: "₹65,999",
      image:
        "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=400",
      rating: 4.6,
      deals: "Best Seller",
    },
  ];

  const testimonials = [
    {
      name: "Priya Sharma",
      location: "Mumbai",
      rating: 5,
      comment:
        "Amazing service! Booked my honeymoon trip to Maldives seamlessly. The customer support was exceptional.",
      avatar:
        "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100",
    },
    {
      name: "Rajesh Kumar",
      location: "Delhi",
      rating: 5,
      comment:
        "Best prices I found anywhere! Saved ₹15,000 on my family vacation to Europe. Highly recommended!",
      avatar:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100",
    },
    {
      name: "Anita Patel",
      location: "Bangalore",
      rating: 5,
      comment:
        "User-friendly platform with great deals. The mobile app makes booking on-the-go so convenient.",
      avatar:
        "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100",
    },
  ];

  const stats = [
    { number: "10M+", label: "Happy Travelers" },
    { number: "500+", label: "Airlines" },
    { number: "1M+", label: "Hotels" },
    { number: "24/7", label: "Support" },
  ];

  return (
    <div className="airline-home-background">
      <div className="content-overlay">
        <HomeNavbar />
        <div className="main-content">
          {/* Hero Section */}
          <section id="home" className="hero-section-fixed">
              <div className="hero-background-gradient"></div>
              <Container fluid className="hero-container">
                <Row className="h-100 align-items-center">
                  <Col lg={12} className="hero-content-wrapper">
                    <div className="hero-content-grid">
                      {/* Left Content */}
                      <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8 }}
                        className="hero-text-section"
                      >
                        <h1 className="hero-main-title">
                          Best Prices Guaranteed
                        </h1>
                        <p className="hero-subtitle">
                          Compare millions of flights and hotels to get the best
                          deals. Save up to 40% on your next adventure.
                        </p>

                        <div className="hero-feature-badges">
                          <div className="feature-badge">
                            <FaShieldAlt className="me-2" />
                            Secure Booking
                          </div>
                          <div className="feature-badge">
                            <FaClock className="me-2" />
                            Instant Confirmation
                          </div>
                          <div className="feature-badge">
                            <FaGlobe className="me-2" />
                            Global Coverage
                          </div>
                        </div>
                      </motion.div>

                      {/* Right Content - Flight Search */}
                      <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8, delay: 0.3 }}
                        className="hero-search-section"
                      >
                        <FlightSearch />
                      </motion.div>
                    </div>
                  </Col>
                </Row>
              </Container>

              {/* Floating Chat Button */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 1, type: "spring" }}
                className="floating-chat-button"
              >
                <Button className="chat-btn">
                  <i className="bi bi-chat-dots"></i>
                </Button>
              </motion.div>
          </section>

          {/* Scrollable Content Below */}
          <div className="scrollable-content">
            {/* Stats Section */}
            <section id="stats" className="stats-section-overlay">
                <Container>
                  <Row className="g-4">
                    {stats.map((stat, index) => (
                      <Col md={3} key={index}>
                        <motion.div
                          initial={{ opacity: 0, y: 30 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          viewport={{ once: true }}
                          transition={{ delay: index * 0.1 }}
                          className="stat-card-overlay text-center"
                        >
                          <h3 className="stat-number-overlay">{stat.number}</h3>
                          <p className="stat-label-overlay">{stat.label}</p>
                        </motion.div>
                      </Col>
                    ))}
                  </Row>
                </Container>
            </section>

            {/* Features Section */}
            <section id="features" className="features-section py-5 bg-white">
                <Container>
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-5"
                  >
                    <h2 className="section-title">
                      Everything You Need for Your Journey
                    </h2>
                    <p className="section-subtitle">
                      One platform, endless possibilities
                    </p>
                  </motion.div>

                  <Row className="g-4">
                    {features.map((feature, index) => (
                      <Col md={6} lg={3} key={index}>
                        <motion.div
                          initial={{ opacity: 0, y: 30 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          viewport={{ once: true }}
                          transition={{ delay: index * 0.1 }}
                          whileHover={{ y: -10 }}
                        >
                          <Card className="feature-card h-100 border-0 shadow-sm">
                            <Card.Body className="text-center p-4">
                              <div
                                className="feature-icon mb-3"
                                style={{
                                  backgroundColor: `${feature.color}20`,
                                }}
                              >
                                <feature.icon
                                  size={40}
                                  style={{ color: feature.color }}
                                />
                              </div>
                              <h5 className="fw-bold mb-3">{feature.title}</h5>
                              <p className="text-muted">
                                {feature.description}
                              </p>
                            </Card.Body>
                          </Card>
                        </motion.div>
                      </Col>
                    ))}
                  </Row>
                </Container>
            </section>

            {/* Popular Destinations */}
            <section id="destinations" className="destinations-section py-5 bg-light">
                <Container>
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-5"
                  >
                    <h2 className="section-title">Popular Destinations</h2>
                    <p className="section-subtitle">
                      Discover amazing places around the world
                    </p>
                  </motion.div>

                  <Row className="g-4">
                    {popularDestinations.map((destination, index) => (
                      <Col md={6} lg={3} key={index}>
                        <motion.div
                          initial={{ opacity: 0, y: 30 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          viewport={{ once: true }}
                          transition={{ delay: index * 0.1 }}
                          whileHover={{ y: -10 }}
                        >
                          <Card className="destination-card border-0 shadow-sm overflow-hidden">
                            <div className="destination-image-container">
                              <Card.Img
                                variant="top"
                                src={destination.image}
                                alt={destination.city}
                                className="destination-image"
                              />
                              <div className="destination-overlay">
                                <Badge bg="danger" className="deal-badge">
                                  {destination.deals}
                                </Badge>
                              </div>
                            </div>
                            <Card.Body className="p-3">
                              <div className="d-flex justify-content-between align-items-start mb-2">
                                <div>
                                  <h6 className="fw-bold mb-0">
                                    {destination.city}
                                  </h6>
                                  <small className="text-muted">
                                    {destination.country}
                                  </small>
                                </div>
                                <div className="text-end">
                                  <div className="rating mb-1">
                                    <FaStar className="text-warning me-1" />
                                    <small>{destination.rating}</small>
                                  </div>
                                </div>
                              </div>
                              <div className="d-flex justify-content-between align-items-center">
                                <div className="price">
                                  <span className="fw-bold text-primary">
                                    {destination.price}
                                  </span>
                                  <small className="text-muted d-block">
                                    per person
                                  </small>
                                </div>
                                <Button variant="outline-primary" size="sm">
                                  Book Now
                                </Button>
                              </div>
                            </Card.Body>
                          </Card>
                        </motion.div>
                      </Col>
                    ))}
                  </Row>
                </Container>
            </section>

            {/* Testimonials Section */}
            <section id="testimonials" className="testimonials-section py-5 bg-white">
                <Container>
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-5"
                  >
                    <h2 className="section-title">What Our Travelers Say</h2>
                    <p className="section-subtitle">
                      Real experiences from real people
                    </p>
                  </motion.div>

                  <Row className="g-4">
                    {testimonials.map((testimonial, index) => (
                      <Col md={4} key={index}>
                        <motion.div
                          initial={{ opacity: 0, y: 30 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          viewport={{ once: true }}
                          transition={{ delay: index * 0.1 }}
                        >
                          <Card className="testimonial-card border-0 shadow-sm h-100">
                            <Card.Body className="p-4">
                              <div className="d-flex align-items-center mb-3">
                                <img
                                  src={testimonial.avatar}
                                  alt={testimonial.name}
                                  className="testimonial-avatar me-3"
                                />
                                <div>
                                  <h6 className="fw-bold mb-0">
                                    {testimonial.name}
                                  </h6>
                                  <small className="text-muted">
                                    {testimonial.location}
                                  </small>
                                </div>
                              </div>
                              <div className="rating mb-3">
                                {[...Array(testimonial.rating)].map((_, i) => (
                                  <FaStar
                                    key={i}
                                    className="text-warning me-1"
                                  />
                                ))}
                              </div>
                              <p className="testimonial-text">
                                "{testimonial.comment}"
                              </p>
                            </Card.Body>
                          </Card>
                        </motion.div>
                      </Col>
                    ))}
                  </Row>
                </Container>
            </section>

            {/* Testimonials Section */}
            <section id="testimonials" className="testimonials-section py-5 bg-white">
              <Container>
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="text-center mb-5"
                >
                  <h2 className="section-title">What Our Travelers Say</h2>
                  <p className="section-subtitle">
                    Real experiences from real people
                  </p>
                </motion.div>

                <Row className="g-4">
                  {testimonials.map((testimonial, index) => (
                    <Col md={4} key={index}>
                      <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <Card className="testimonial-card border-0 shadow-sm h-100">
                          <Card.Body className="p-4">
                            <div className="d-flex align-items-center mb-3">
                              <img
                                src={testimonial.avatar}
                                alt={testimonial.name}
                                className="testimonial-avatar me-3"
                              />
                              <div>
                                <h6 className="fw-bold mb-0">
                                  {testimonial.name}
                                </h6>
                                <small className="text-muted">
                                  {testimonial.location}
                                </small>
                              </div>
                            </div>
                            <div className="rating mb-3">
                              {[...Array(testimonial.rating)].map((_, i) => (
                                <FaStar
                                  key={i}
                                  className="text-warning me-1"
                                />
                              ))}
                            </div>
                            <p className="testimonial-text">
                              "{testimonial.comment}"
                            </p>
                          </Card.Body>
                        </Card>
                      </motion.div>
                    </Col>
                  ))}
                </Row>
              </Container>
            </section>
          </div>
        </div>

        {/* Outlet for nested routes (About, Contact Us, Profile, etc.) */}
        <main className="main-content-outlet">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default Home;
