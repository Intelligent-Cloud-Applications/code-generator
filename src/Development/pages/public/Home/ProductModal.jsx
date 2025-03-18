import InstitutionContext from "../../../Context/InstitutionContext";
import { API } from "aws-amplify";
import { useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Modal, Button } from "flowbite-react";

const ProductModal = ({
  isOpen,
  onClose,
  isEditing,
  initialData,
  setProducts,
}) => {
  const institution = useContext(InstitutionContext).institutionData;
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    heading: initialData?.heading || "",
    frequencyValue: initialData?.interval || 1,
    frequencyUnit: "month",
    amount: initialData?.amount ? initialData.amount / 100 : "",
    currency: initialData?.currency || "INR",
    country: initialData?.country || "IN",
    provides: initialData?.provides || [],
    duration: initialData?.duration || 30,
    productId: initialData?.productId || "",
  });

  useEffect(() => {
    if (initialData) {
      const { frequencyValue, frequencyUnit } =
        getFrequencyFromSubscriptionType(
          initialData.subscriptionType,
          initialData.interval
        );

      setFormData({
        heading: initialData.heading || "",
        frequencyValue: frequencyValue || 1,
        frequencyUnit: frequencyUnit || "month",
        amount: initialData?.amount ? initialData.amount / 100 : "",
        currency: initialData.currency || "INR",
        country: initialData.country || "IN",
        provides: Array.isArray(initialData?.provides)
          ? initialData.provides
          : [""],
        duration: initialData.duration || 30,
        productId: initialData?.productId || "",
      });
    }
  }, [initialData]);

  // Helper function for input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === "provides") {
      setFormData({ ...formData, [name]: value.split("\n") });
    } else if (name === "frequencyValue") {
      setFormData({ ...formData, [name]: parseInt(value) || 1 });
    } else if (name === "amount") {
      setFormData({ ...formData, [name]: parseFloat(value) || 0 });
    } else if (name === "duration") {
      setFormData({ ...formData, [name]: parseInt(value) });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  // Helper function to derive frequencyValue and frequencyUnit from subscriptionType and interval
  const getFrequencyFromSubscriptionType = (subscriptionType, interval) => {
    switch (subscriptionType) {
      case "weekly":
        return { frequencyValue: interval, frequencyUnit: "week" };
      case "monthly":
        return { frequencyValue: interval, frequencyUnit: "month" };
      case "quarterly":
        return { frequencyValue: 3, frequencyUnit: "month" };
      case "yearly":
        return { frequencyValue: interval / 12, frequencyUnit: "year" };
      default:
        return { frequencyValue: 1, frequencyUnit: "month" };
    }
  };

  // Duration options in minutes
  const durationOptions = [
    { value: 30, label: "30 minutes" },
    { value: 45, label: "45 minutes" },
    { value: 60, label: "1 hour" },
    { value: 90, label: "1.5 hours" },
    { value: 120, label: "2 hours" },
  ];

  const getSubscriptionDetails = (value, unit) => {
    let duration = value;
    let interval = value;
    let subscriptionType;
    let durationText;
    let period;

    switch (unit) {
      case "week":
        duration = Math.round(value / 4);
        subscriptionType = "weekly";
        period = "weekly";
        durationText = `${value} Week${value > 1 ? "s" : ""}`;
        break;
      case "month":
        duration = value;
        period = "monthly";
        if (value === 3) {
          subscriptionType = "quarterly";
          interval = 3;
          durationText = "3 Months";
        } else if (value === 12) {
          subscriptionType = "yearly";
          interval = 12;
          durationText = "1 Year";
        } else {
          subscriptionType = "monthly";
          durationText = `${value} Month${value > 1 ? "s" : ""}`;
        }
        break;
      case "year":
        duration = value * 12;
        subscriptionType = "yearly";
        interval = value * 12;
        period = "monthly";
        durationText = `${value} Year${value > 1 ? "s" : ""}`;
        break;
      default:
        duration = value;
        subscriptionType = "monthly";
        period = "monthly";
        durationText = `${value} Month${value > 1 ? "s" : ""}`;
    }

    return { duration, subscriptionType, durationText, interval, period };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const { duration, subscriptionType, durationText, interval, period } =
      getSubscriptionDetails(formData.frequencyValue, formData.frequencyUnit);

    const payload = {
      heading: formData.heading,
      amount: Math.round(formData.amount * 100),
      currency: formData.currency,
      country: formData.country,
      duration: formData.duration, // Include duration in minutes
      durationText: durationText,
      subscriptionType: subscriptionType,
      interval: interval,
      period: period,
      india: formData.country === "IN",
      provides: formData.provides,
      productId: formData.productId || "", // Will be empty for new products
    };

    console.log("Submitting payload:", payload);

    try {
      let response;

      if (isEditing) {
        // Update existing product
        console.log("Updating product:", initialData.productId);
        response = await API.put(
          "main",
          `/admin/update-subscription/${institution.InstitutionId}/${initialData.productId}`,
          { body: payload }
        );
      } else {
        // Create new product
        console.log("Creating new product");
        response = await API.post(
          "main",
          `/admin/create-subscription/${institution.InstitutionId}`,
          { body: payload }
        );
      }

      console.log("API response:", response);

      // Success case
      toast.success(isEditing ? "Product Updated" : "Product Created");

      // Update the products state locally
      setProducts((prevProducts) => {
        if (isEditing) {
          // Update existing product
          return prevProducts.map((product) =>
            product.productId === initialData.productId
              ? { ...product, ...payload, productId: initialData.productId }
              : product
          );
        } else {
          // Get the product ID from response
          const newProductId =
            response?.productId ||
            response?.body?.productId ||
            `temp-${Date.now()}`; // Fallback ID if response structure is unexpected

          // Add new product with the returned ID
          const newProduct = {
            ...payload,
            productId: newProductId,
          };
          return [...prevProducts, newProduct];
        }
      });

      onClose(); // Close the modal
    } catch (error) {
      // Enhanced error logging
      console.error("Error in API call:", error);

      // Safe error message extraction
      let errorMessage =
        "An error occurred while updating/creating the subscription.";

      if (error?.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (typeof error === "string") {
        errorMessage = error;
      } else if (error?.message) {
        errorMessage = error.message;
      }

      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const periodOptions = [
    { value: "week", label: "Weeks" },
    { value: "month", label: "Months" },
    { value: "year", label: "Years" },
  ];

  return (
    <Modal show={isOpen} onClose={onClose} size="xl">
      <Modal.Header>
        {isEditing ? "Edit Subscription Plan" : "Add New Subscription Plan"}
      </Modal.Header>
      <Modal.Body>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label
              htmlFor="heading"
              className="block text-sm font-medium text-gray-700"
            >
              Plan Name
            </label>
            <input
              id="heading"
              name="heading"
              value={formData.heading}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-gray-500"
              placeholder="Enter plan name"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Billing Frequency
            </label>
            <div className="flex gap-4">
              <div className="flex-1">
                <input
                  type="number"
                  name="frequencyValue"
                  min="1"
                  value={formData.frequencyValue}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-gray-500"
                  placeholder="Enter number"
                  required
                />
              </div>
              <div className="flex-1">
                <select
                  name="frequencyUnit"
                  value={formData.frequencyUnit}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-gray-500"
                >
                  {periodOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="text-sm text-gray-500 mt-1">
              {
                getSubscriptionDetails(
                  formData.frequencyValue,
                  formData.frequencyUnit
                ).durationText
              }{" "}
              plan
            </div>
          </div>

          <div className="space-y-2">
            <label
              htmlFor="amount"
              className="block text-sm font-medium text-gray-700"
            >
              Amount (₹)
            </label>
            <input
              id="amount"
              name="amount"
              type="number"
              min="0"
              step="0.01"
              value={formData.amount}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-gray-500"
              placeholder="Enter amount"
              required
            />
          </div>

          <div className="space-y-2">
            <label
              htmlFor="duration"
              className="block text-sm font-medium text-gray-700"
            >
              Duration
            </label>
            <select
              id="duration"
              name="duration"
              value={formData.duration.toString()}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-gray-500"
            >
              {durationOptions.map((option) => (
                <option key={option.value} value={option.value.toString()}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {/* To add multiple Provides if the admin wants */}
          <div className="space-y-2">
            <label
              htmlFor="provides"
              className="block text-sm font-medium text-gray-700"
            >
              Provides
            </label>
            <textarea
              id="provides"
              name="provides"
              value={
                Array.isArray(formData?.provides)
                  ? formData.provides.join("\n")
                  : ""
              }
              onChange={handleInputChange}
              className="w-full min-h-14 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-gray-500"
              placeholder="Enter each provide on a new line"
              required
            ></textarea>
            <p className="text-sm text-gray-500">
              Enter each provide on a new line
            </p>
          </div>

          <div className="flex justify-end space-x-4 pt-4">
            <Button
              onClick={onClose}
              color="light"
              type="button"
              disabled={isSubmitting}
              className="rounded"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="rounded bg-blue-600 hover:bg-blue-700 text-white"
            >
              {isSubmitting
                ? "Saving..."
                : isEditing
                ? "Save Changes"
                : "Add Plan"}
            </Button>
          </div>
        </form>
      </Modal.Body>
    </Modal>
  );
};

export default ProductModal;
