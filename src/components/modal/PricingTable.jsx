import { useState } from "react";
import { X } from "lucide-react";
import { getCheckoutUrl } from "../../libs/stripe";
import toast from "react-hot-toast";

const PricingTable = ({ onClose }) => {
  const [selectedPlan, setSelectedPlan] = useState(null);

  const plans = [
    { name: "Monthly", priceId: "price_1Q0z3KG1zfOllqcLVPG2Pyi4", price: "$9.99" },
    { name: "Yearly", priceId: "price_yearly_id_here", price: "$99.99" },
  ];

  const handleUpgrade = async () => {
    if (!selectedPlan) {
      toast.error("Please select a plan", { position: "top-center" });
      return;
    }

    try {
      toast.loading("Processing upgrade", { position: "top-center" });
      const url = await getCheckoutUrl(selectedPlan.priceId);
      window.location.href = url;
    } catch (error) {
      toast.error("Error upgrading to premium", { position: "top-center" });
      console.error(error);
    }
  };

  return (
    <div className="fixed translate-x-0 bottom-0 left-0 w-full h-full bg-black bg-opacity-50 flex items-center justify-center z-[1000]">
      <div className="bg-[#221B15]/70 backdrop-blur-lg rounded-lg shadow-lg w-[80%] max-w-2xl overflow-hidden">
        <div className="bg-[#2e2e2e]/60 text-white px-4 py-2 flex justify-between items-center">
          <h2 className="text-xl font-bold">Select Premium Plan</h2>
          <button onClick={onClose}>
            <X size={20} />
          </button>
        </div>
        <div className="p-4">
          <div className="grid grid-cols-2 gap-4 mb-4">
            {plans.map((plan) => (
              <div
                key={plan.name}
                className={`p-4 rounded cursor-pointer transition duration-300 ${
                  selectedPlan === plan
                    ? "bg-[#ed974d] text-white"
                    : "bg-[#2e2e2e]/60 text-white hover:bg-[#ed974d]/80"
                }`}
                onClick={() => setSelectedPlan(plan)}
              >
                <h3 className="text-lg font-bold">{plan.name}</h3>
                <p className="text-2xl font-bold mt-2">{plan.price}</p>
              </div>
            ))}
          </div>
          <button
            className="w-full bg-[#ed974d] hover:bg-[#ed974d]/80 text-white px-4 py-2 rounded transition duration-300"
            onClick={handleUpgrade}
          >
            Upgrade to Premium
          </button>
        </div>
      </div>
    </div>
  );
};

export default PricingTable;
