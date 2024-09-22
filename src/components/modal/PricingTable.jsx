import { useState } from "react";
import { X, Check } from "lucide-react";
import { getCheckoutUrl } from "../../libs/stripe";
import toast from "react-hot-toast";

const PricingTable = ({ onClose }) => {
  const [selectedPlan, setSelectedPlan] = useState({
    name: "Yearly",
    priceId: "price_yearly_id_here",
    price: "$29.99",
    savings: "Save 37%",
  });

  const plans = [
    {
      name: "Monthly",
      priceId: "price_1Q0z3KG1zfOllqcLVPG2Pyi4",
      price: "$3.99",
    },
    {
      name: "Yearly",
      priceId: "price_yearly_id_here",
      price: "$29.99",
      savings: "Save 37%",
    },
  ];

  const features = [
    "Access to premium content",
    "Ad-free experience",
    "Exclusive member discounts",
    "Priority customer support",
  ];

  const handleUpgrade = async () => {
    if (!selectedPlan) {
      toast.error("Please select a plan", { position: "top-center" });
      return;
    }

    try {
      localStorage.removeItem("t0aqk323a");
      toast.loading("Processing upgrade", { position: "top-center" });
      const url = await getCheckoutUrl(selectedPlan.priceId);
      localStorage.removeItem("t0aqk323a");
      window.location.href = url;
    } catch (error) {
      toast.error("Error upgrading to premium", { position: "top-center" });
      console.error(error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[1000]">
      <div className="bg-[#221B15] rounded-2xl shadow-xl w-full max-w-3xl overflow-hidden text-[#E0D6CC]">
        <div className="px-6 py-4 flex justify-between items-center border-b border-[#3D342C]">
          <div className="flex flex-col">
            <h2 className="text-2xl font-bold text-[#F0E6DC]">
              Choose Your Plan
            </h2>
            <p className="text-sm text-[#A69B8F]">
              Upgrade to access premium features
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-[#A69B8F] hover:text-[#F0E6DC]"
          >
            <X size={24} />
          </button>
        </div>
        <div className="p-6">
          <div className="mb-8">
            <h3 className="text-xl font-semibold mb-4 text-[#F0E6DC]">
              What&apos;s included:
            </h3>
            <ul className="grid grid-cols-2 gap-4">
              {features.map((feature, index) => (
                <li key={index} className="flex items-center text-[#E0D6CC]">
                  <Check size={20} className="text-[#A0D995] mr-2" />
                  {feature}
                </li>
              ))}
            </ul>
          </div>
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            {plans.map((plan) => (
              <div
                key={plan.name}
                className={`border-2 rounded-xl p-6 cursor-pointer transition duration-300 ${
                  selectedPlan?.name === plan.name
                    ? "border-[#F0E6DC] bg-[#2D261F]"
                    : "border-[#3D342C] hover:border-[#A69B8F]"
                }`}
                onClick={() => setSelectedPlan(plan)}
              >
                <h3 className="text-xl font-semibold mb-2 text-[#F0E6DC]">
                  {plan.name}
                </h3>
                <p className="text-3xl font-bold mb-1 text-[#F0E6DC]">
                  {plan.price}
                </p>
                {plan.savings ? (
                  <p className="text-sm text-[#A0D995] font-medium mb-4">
                    {plan.savings}
                  </p>
                ) : (
                  <p className="text-sm text-[#ff5656] font-medium mb-4">
                    No savings
                  </p>
                )}

                <button
                  className={`w-full py-2 rounded-full transition duration-300 ${
                    selectedPlan?.name === plan.name
                      ? "bg-[#F0E6DC] text-[#221B15]"
                      : "bg-[#3D342C] text-[#E0D6CC] hover:bg-[#4D443C]"
                  }`}
                >
                  {selectedPlan?.name === plan.name ? "Selected" : "Select"}
                </button>
              </div>
            ))}
          </div>
          <div className="flex flex-col -mt-6 py-2">
            <span className="text-[#A69B8F]">
              Unlock all features and directly support a passionate indie solo
              developer
            </span>
          </div>
          <button
            className="w-full bg-[#F0E6DC] hover:bg-[#E0D6CC] text-[#221B15] font-semibold py-3 rounded-full transition duration-300"
            onClick={handleUpgrade}
          >
            Upgrade Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default PricingTable;
