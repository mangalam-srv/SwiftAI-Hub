import React from "react";
import { useUser } from "@clerk/clerk-react";

const Plan = () => {
  const { user, isLoaded } = useUser();

  if (!isLoaded) return null;

  // Default plan logic
  const currentPlan =
    user?.publicMetadata?.plan || "free"; // default free

  const handleSubscribe = () => {
    if (!user) {
      alert("Please login first");
      return;
    }

    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY,
      amount: 1600 * 100,
      currency: "INR",
      name: "Quick.ai",
      description: "Premium Plan Subscription",
      handler: function (response) {
        console.log(response);
        alert("Payment Successful 🎉");
      },
      prefill: {
        name: user?.fullName || "",
        email: user?.primaryEmailAddress?.emailAddress || "",
      },
      theme: { color: "#0f172a" },
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  return (
    <div className="max-w-5xl mx-auto my-24 px-6">
      <div className="text-center">
        <h2 className="text-slate-700 text-[42px] font-semibold">
          Choose Your Plan
        </h2>
        <p className="text-gray-500 max-w-lg mx-auto">
          Start for free and scale up as you grow.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8 mt-14">

        {/* FREE PLAN */}
        <div className="bg-white p-8 rounded-2xl shadow-md border">
          <h3 className="text-xl font-semibold">Free</h3>
          <p className="text-3xl font-bold mt-2">₹0</p>

          <ul className="mt-6 space-y-2 text-gray-600">
            <li>✔ Title Generation</li>
            <li>✔ Article Generation</li>
          </ul>

          {/* Button Logic */}
          {!user ? (
            <button className="mt-8 w-full bg-black text-white py-2 rounded-lg">
              Subscribe
            </button>
          ) : currentPlan === "free" ? (
            <button
              disabled
              className="mt-8 w-full bg-gray-300 text-gray-600 py-2 rounded-lg"
            >
              Active
            </button>
          ) : (
            <button className="mt-8 w-full bg-black text-white py-2 rounded-lg">
              Subscribe
            </button>
          )}
        </div>

        {/* PREMIUM PLAN */}
        <div className="bg-white p-8 rounded-2xl shadow-md border">
          <h3 className="text-xl font-semibold">Premium</h3>
          <p className="text-3xl font-bold mt-2">₹1600 / month</p>

          <ul className="mt-6 space-y-2 text-gray-600">
            <li>✔ Title Generation</li>
            <li>✔ Article Generation</li>
            <li>✔ Generate Images</li>
            <li>✔ Remove Background</li>
            <li>✔ Remove Object</li>
            <li>✔ Resume Review</li>
          </ul>

          {!user ? (
            <button className="mt-8 w-full bg-black text-white py-2 rounded-lg">
              Subscribe
            </button>
          ) : currentPlan === "premium" ? (
            <button
              disabled
              className="mt-8 w-full bg-gray-300 text-gray-600 py-2 rounded-lg"
            >
              Active
            </button>
          ) : (
            <button
              onClick={handleSubscribe}
              className="mt-8 w-full bg-black text-white py-2 rounded-lg hover:bg-gray-800"
            >
              Subscribe
            </button>
          )}
        </div>

      </div>
    </div>
  );
};

export default Plan;