import React, { useState } from "react";
import {
  Form,
  Button,
  Container,
  Alert,
  Card,
  Row,
  Col,
} from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { FaPlane, FaArrowLeft, FaCheck } from "react-icons/fa";
import { toast } from "react-toastify";
import { addAirline } from "../../services/AdminServices/airlineManagementServies";

const AddAirline = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [airlineName, setAirlineName] = useState("");
  const [airlineNoOfFlights, setAirlineNoOfFlights] = useState(0);

  const submit = async(e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const data = await addAirline(airlineName, airlineNoOfFlights);
      if (!data) {
        toast.error("Failed to add airline. Please try again.");
        return;
      }
      toast.success("Airline added successfully!");
      navigate("/admin/airlinemanagement");
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
              {showSuccess && (
                <Alert
                  variant="success"
                  dismissible
                  onClose={() => setShowSuccess(false)}
                  className="animate__animated animate__fadeIn"
                >
                  <FaCheck className="me-2" />
                  Airline added successfully!
                </Alert>
              )}

              <Form onSubmit={submit}>
                <Form.Group className="mb-4">
                  <Form.Label className="fw-bold">Airline Name</Form.Label>
                  <Form.Control
                    type="text"
                    name="airlineName"
                    placeholder="Airline Name"
                    value={airlineName}
                    onChange={(e) => setAirlineName(e.target.value)}
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-4">
                  <Form.Label className="fw-bold">Number of Flights</Form.Label>
                  <Form.Control
                    type="number"
                    name="noOfFlights"
                    placeholder="e.g. 25"
                    value={airlineNoOfFlights}
                    onChange={(e) => setAirlineNoOfFlights(e.target.value)}
                    min={1}
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
