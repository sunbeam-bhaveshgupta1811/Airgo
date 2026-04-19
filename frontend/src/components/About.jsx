import React, { useState, useEffect } from "react";
import { Container, Row, Col, Card, Accordion, Button, Badge, ProgressBar } from "react-bootstrap";
import { FaPlane, FaUsers, FaHeadset, FaGlobe, FaAward, FaShieldAlt, FaClock, FaHeart, FaRocket, FaHandshake, FaStar, FaMapMarkerAlt } from "react-icons/fa";
import { motion, useInView } from "framer-motion";
import "../css/About.css";

function About() {
  const [counters, setCounters] = useState({
    destinations: 0,
    travelers: 0,
    support: 24
  });

  const airlines = [
    { 
      name: "Chhatrapati Shivaji Airport", 
      rating: 4.8, 
      description: "Mumbai's premier international hub connecting Asia", 
      img: "https://www.itln.in/h-upload/2022/04/18/24764-chhatrapati-shivaji-maharaj-intl-airport-cargo-handled-up-30-in-fy22.jpg",
      passengers: "45M+ annually",
      routes: "95+ destinations"
    },
    { 
      name: "Air India", 
      rating: 4.5, 
      description: "India's flag carrier with global connectivity", 
      img: "https://www.tata.com/content/dam/tata/images/verticals/desktop/airindia_newlivery_card_hz_desktop_390x362.jpg",
      passengers: "20M+ annually",
      routes: "102 destinations"
    },
    { 
      name: "IndiGo", 
      rating: 4.7, 
      description: "India's largest airline focused on punctuality", 
      img: "https://static1.simpleflyingimages.com/wordpress/wp-content/uploads/2024/04/indigo-a350-900-april-2024.png",
      passengers: "70M+ annually",
      routes: "87 destinations"
    },
    { 
      name: "Vistara", 
      rating: 4.6, 
      description: "Premium full-service carrier with world-class hospitality", 
      img: "https://tse2.mm.bing.net/th/id/OIP.m6V4MhNjm18_ox5pzRhuMwHaEK?pid=Api&P=0&h=180",
      passengers: "15M+ annually",
      routes: "52 destinations"
    }
  ];

  const achievements = [
    { icon: FaAward, title: "Best Travel Platform 2024", description: "Recognized by Travel Excellence Awards" },
    { icon: FaShieldAlt, title: "100% Secure Bookings", description: "SSL encrypted transactions" },
    { icon: FaClock, title: "24/7 Customer Support", description: "Round-the-clock assistance" },
    { icon: FaHeart, title: "98% Customer Satisfaction", description: "Based on 50,000+ reviews" }
  ];

  const milestones = [
    { year: "2018", event: "Company Founded", description: "Started with a vision to simplify travel" },
    { year: "2019", event: "First Million Users", description: "Reached 1M+ registered travelers" },
    { year: "2021", event: "Global Expansion", description: "Expanded to 25+ countries" },
    { year: "2023", event: "AI Integration", description: "Launched smart booking assistant" },
    { year: "2024", event: "50+ Destinations", description: "Now serving 50+ global destinations" }
  ];

  const values = [
    {
      icon: FaRocket,
      title: "Innovation",
      description: "Constantly evolving to provide cutting-edge travel solutions"
    },
    {
      icon: FaHandshake,
      title: "Trust",
      description: "Building lasting relationships through transparency and reliability"
    },
    {
      icon: FaGlobe,
      title: "Global Reach",
      description: "Connecting travelers to destinations worldwide"
    },
    {
      icon: FaUsers,
      title: "Customer First",
      description: "Every decision is made with our travelers in mind"
    }
  ];

  // Counter animation
  useEffect(() => {
    const timer = setTimeout(() => {
      setCounters({
        destinations: 50,
        travelers: 10000000,
        support: 24
      });
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  const CounterCard = ({ value, label, suffix = "" }) => {
    const [count, setCount] = useState(0);
    
    useEffect(() => {
      const duration = 2000;
      const steps = 60;
      const increment = value / steps;
      let current = 0;
      
      const timer = setInterval(() => {
        current += increment;
        if (current >= value) {
          setCount(value);
          clearInterval(timer);
        } else {
          setCount(Math.floor(current));
        }
      }, duration / steps);

      return () => clearInterval(timer);
    }, [value]);

    const formatNumber = (num) => {
      if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
      if (num >= 1000) return (num / 1000).toFixed(0) + 'K';
      return num.toString();
    };

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="text-center"
      >
        <h2 className="display-4 fw-bold text-primary counter-number">
          {formatNumber(count)}{suffix}
        </h2>
        <p className="text-uppercase text-muted fw-bold counter-label">{label}</p>
      </motion.div>
    );
  };

  return (
    <div className="about-page">
      {/* Enhanced Hero Section */}
      <section className="hero-section">
        <div className="hero-background"></div>
        <div className="hero-overlay"></div>
        <Container className="hero-content">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="text-center"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.5, type: "spring" }}
              className="hero-icon mb-4"
            >
              <FaPlane size={80} className="text-white" />
            </motion.div>
            <h1 className="display-2 fw-bold text-white mb-4">Redefining Travel</h1>
            <p className="lead text-white mb-5 mx-auto hero-subtitle">
              Experience seamless connectivity with our trusted global partners. 
              Your journey begins with a single click.
            </p>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button variant="primary" size="lg" className="cta-button px-5 py-3 shadow-lg">
                <FaRocket className="me-2" />
                Start Your Journey
              </Button>
            </motion.div>
          </motion.div>
        </Container>
        
        {/* Floating Elements */}
        <div className="floating-elements">
          <motion.div 
            className="floating-plane"
            animate={{ 
              x: [0, 100, 0],
              y: [0, -20, 0]
            }}
            transition={{ 
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            ✈️
          </motion.div>
        </div>
      </section>

      {/* Enhanced Stats Section */}
      <section className="stats-section py-5">
        <Container>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <Row className="text-center g-4">
              <Col md={4}>
                <CounterCard value={50} label="Destinations" suffix="+" />
              </Col>
              <Col md={4}>
                <CounterCard value={10000000} label="Happy Travelers" />
              </Col>
              <Col md={4}>
                <CounterCard value={24} label="Support Hours" suffix="/7" />
              </Col>
            </Row>
          </motion.div>
        </Container>
      </section>

      {/* Mission & Vision Section */}
      <section className="mission-section py-5 bg-light">
        <Container>
          <Row className="align-items-center g-5">
            <Col lg={6}>
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
              >
                <h2 className="display-5 fw-bold text-primary mb-4">Our Mission</h2>
                <p className="lead mb-4">
                  To democratize travel by making it accessible, affordable, and enjoyable for everyone. 
                  We believe that exploring the world should be a right, not a privilege.
                </p>
                <div className="mission-features">
                  <div className="feature-item mb-3">
                    <FaGlobe className="text-primary me-3" />
                    <span>Global connectivity at your fingertips</span>
                  </div>
                  <div className="feature-item mb-3">
                    <FaShieldAlt className="text-primary me-3" />
                    <span>Secure and transparent booking process</span>
                  </div>
                  <div className="feature-item">
                    <FaHeart className="text-primary me-3" />
                    <span>Personalized travel experiences</span>
                  </div>
                </div>
              </motion.div>
            </Col>
            <Col lg={6}>
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="mission-visual"
              >
                <div className="vision-card p-4 bg-white rounded-4 shadow-lg">
                  <h3 className="fw-bold text-primary mb-3">Our Vision</h3>
                  <p className="mb-0">
                    To become the world's most trusted travel platform, 
                    connecting cultures and creating memories that last a lifetime.
                  </p>
                </div>
              </motion.div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Values Section */}
      <section className="values-section py-5">
        <Container>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-5"
          >
            <h2 className="display-5 fw-bold text-primary mb-3">Our Core Values</h2>
            <p className="lead text-muted">The principles that guide everything we do</p>
          </motion.div>
          
          <Row className="g-4">
            {values.map((value, index) => (
              <Col md={6} lg={3} key={index}>
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  whileHover={{ y: -10 }}
                >
                  <Card className="h-100 border-0 shadow-sm value-card text-center">
                    <Card.Body className="p-4">
                      <div className="value-icon mb-3">
                        <value.icon size={40} className="text-primary" />
                      </div>
                      <h5 className="fw-bold mb-3">{value.title}</h5>
                      <p className="text-muted small">{value.description}</p>
                    </Card.Body>
                  </Card>
                </motion.div>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      {/* Enhanced Partners Grid */}
      <section className="partners-section py-5 bg-light">
        <Container>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-5"
          >
            <h2 className="display-5 fw-bold text-primary mb-3">Our Trusted Partners</h2>
            <p className="lead text-muted">World-class airlines and airports we work with</p>
          </motion.div>
          
          <Row className="g-4">
            {airlines.map((airline, index) => (
              <Col md={6} lg={3} key={index}>
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  whileHover={{ y: -10, scale: 1.02 }}
                >
                  <Card className="h-100 border-0 shadow-sm partner-card">
                    <div className="img-wrapper">
                      <Card.Img variant="top" src={airline.img} alt={airline.name} />
                      <div className="img-overlay">
                        <Button variant="primary" size="sm" className="view-details-btn">
                          View Details
                        </Button>
                      </div>
                    </div>
                    <Card.Body className="p-4">
                      <div className="d-flex justify-content-between align-items-start mb-2">
                        <h5 className="fw-bold mb-0">{airline.name}</h5>
                        <Badge bg="warning" text="dark" className="rating-badge">
                          <FaStar className="me-1" />{airline.rating}
                        </Badge>
                      </div>
                      <p className="text-muted small mb-3">{airline.description}</p>
                      <div className="partner-stats">
                        <div className="stat-row mb-2">
                          <FaUsers className="text-primary me-2" />
                          <small className="text-muted">{airline.passengers}</small>
                        </div>
                        <div className="stat-row">
                          <FaMapMarkerAlt className="text-primary me-2" />
                          <small className="text-muted">{airline.routes}</small>
                        </div>
                      </div>
                    </Card.Body>
                  </Card>
                </motion.div>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      {/* Timeline Section */}
      <section className="timeline-section py-5">
        <Container>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-5"
          >
            <h2 className="display-5 fw-bold text-primary mb-3">Our Journey</h2>
            <p className="lead text-muted">Milestones that shaped our story</p>
          </motion.div>
          
          <div className="timeline">
            {milestones.map((milestone, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                className={`timeline-item ${index % 2 === 0 ? 'left' : 'right'}`}
              >
                <div className="timeline-content">
                  <div className="timeline-year">{milestone.year}</div>
                  <h4 className="fw-bold text-primary">{milestone.event}</h4>
                  <p className="text-muted">{milestone.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </Container>
      </section>

      {/* Achievements Section */}
      <section className="achievements-section py-5 bg-light">
        <Container>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-5"
          >
            <h2 className="display-5 fw-bold text-primary mb-3">Our Achievements</h2>
            <p className="lead text-muted">Recognition that drives us forward</p>
          </motion.div>
          
          <Row className="g-4">
            {achievements.map((achievement, index) => (
              <Col md={6} lg={3} key={index}>
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  whileHover={{ scale: 1.05 }}
                >
                  <Card className="h-100 border-0 shadow-sm achievement-card text-center">
                    <Card.Body className="p-4">
                      <div className="achievement-icon mb-3">
                        <achievement.icon size={50} className="text-primary" />
                      </div>
                      <h5 className="fw-bold mb-3">{achievement.title}</h5>
                      <p className="text-muted small">{achievement.description}</p>
                    </Card.Body>
                  </Card>
                </motion.div>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      {/* Enhanced Contact CTA */}
      <section className="cta-section py-5">
        <Container>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <div className="cta-card bg-primary text-white rounded-5 p-5 text-center shadow-lg position-relative overflow-hidden">
              <div className="cta-background"></div>
              <div className="cta-content position-relative">
                <motion.div
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 3, repeat: Infinity }}
                  className="cta-icon mb-4"
                >
                  <FaPlane size={60} className="text-white" />
                </motion.div>
                <h2 className="display-5 fw-bold mb-3">Ready to Take Off?</h2>
                <p className="lead mb-4">
                  Our travel experts are available 24/7 to help you plan your perfect itinerary. 
                  Let's make your travel dreams come true.
                </p>
                <div className="d-flex gap-3 justify-content-center flex-wrap">
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button variant="outline-light" size="lg" className="px-4">
                      <FaHeadset className="me-2" />
                      Contact Concierge
                    </Button>
                  </motion.div>
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button variant="light" size="lg" className="px-4">
                      <FaRocket className="me-2" />
                      Book Now
                    </Button>
                  </motion.div>
                </div>
              </div>
            </div>
          </motion.div>
        </Container>
      </section>
    </div>
  );
}

export default About;