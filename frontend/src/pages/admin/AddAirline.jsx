import React, { useState } from "react";
import {
  Form,
  Button,
  Container,
  Card,
  Row,
  Col,
} from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { FaPlane, FaArrowLeft } from "react-icons/fa";
import { toast } from "react-toastify";
import { addAirline } from "../../services/admin/airlineManagementServies";

const AddAirline = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    code: "",
    country: "",
    contactEmail: "",
    contactPhone: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    if (formData.name.trim().length < 2) {
      toast.warn("Airline name must be at least 2 characters");
      return false;
    }
    if (!/^[A-Z0-9]{2,3}$/.test(formData.code)) {
      toast.warn("IATA code must be 2-3 uppercase letters/digits (e.g. 6E, AI)");
      return false;
    }
    if (!formData.country.trim()) {
      toast.warn("Please enter the country");
      return false;
    }
    if (formData.contactEmail && !/^\S+@\S+\.\S+$/.test(formData.contactEmail)) {
      toast.warn("Please enter a valid contact email");
      return false;
    }
    return true;
  };

  const submit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      await addAirline({
        name: formData.name.trim(),
        code: formData.code.toUpperCase().trim(),
        country: formData.country.trim(),
        contactEmail: formData.contactEmail.trim(),
        contactPhone: formData.contactPhone.trim(),
      });
      toast.success("Airline added successfully!");
      navigate("/admin/airlinemanagement");
    } catch (error) {
      const msg = error.response?.data?.message || "Failed to add airline";
      toast.error(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBack = () => {
    navigate("/admin/airlinemanagement");
  };

  return (
    <Container className="py-5">
      <Row className="justify-content-center">
        <Col md={8} lg={6}>
          <Card className="shadow-sm">
            <Card.Header className="bg-primary text-white">
              <div className="d-flex justify-content-between align-items-center">
                <Button
                  variant="link"
                  className="text-white p-0"
                  onClick={handleBack}
                >
                  <FaArrowLeft className="me-2" />
                  Back to Airlines
                </Button>
                <h4 className="mb-0">
                  <FaPlane className="me-2" />
                  Add New Airline
                </h4>
              </div>
            </Card.Header>

            <Card.Body>
              <Form onSubmit={submit}>
                <Form.Group className="mb-3">
                  <Form.Label className="fw-bold">Airline Name *</Form.Label>
                  <Form.Control
                    type="text"
                    name="name"
                    placeholder="e.g. Air India"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>

                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label className="fw-bold">IATA Code *</Form.Label>
                      <Form.Control
                        type="text"
                        name="code"
                        placeholder="e.g. AI, 6E"
                        value={formData.code}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            code: e.target.value.toUpperCase(),
                          }))
                        }
                        maxLength={3}
                        required
                      />
                      <Form.Text className="text-muted">
                        2-3 uppercase letters/digits
                      </Form.Text>
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label className="fw-bold">Country *</Form.Label>
                      <Form.Control
                        type="text"
                        name="country"
                        placeholder="e.g. India"
                        value={formData.country}
                        onChange={handleChange}
                        required
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <Form.Group className="mb-3">
                  <Form.Label className="fw-bold">Contact Email</Form.Label>
                  <Form.Control
                    type="email"
                    name="contactEmail"
                    placeholder="e.g. contact@airindia.com"
                    value={formData.contactEmail}
                    onChange={handleChange}
                  />
                </Form.Group>

                <Form.Group className="mb-4">
                  <Form.Label className="fw-bold">Contact Phone</Form.Label>
                  <Form.Control
                    type="tel"
                    name="contactPhone"
                    placeholder="e.g. +911234567890"
                    value={formData.contactPhone}
                    onChange={handleChange}
                  />
                </Form.Group>

                <div className="d-grid gap-3">
                  <Button
                    variant="primary"
                    type="submit"
                    disabled={isSubmitting}
                    className="py-2 fw-bold"
                  >
                    {isSubmitting ? "Adding Airline..." : "Add Airline"}
                  </Button>

                  <Button
                    variant="outline-secondary"
                    onClick={handleBack}
                    className="py-2"
                  >
                    Cancel
                  </Button>
                </div>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default AddAirline;
