const SingleFlightModal = ({ data }) => {
  return (
    <div className="bg-gradient-to-r from-gray-800 via-gray-900 to-black text-white p-8 rounded-xl shadow-xl transform hover:scale-105 transition-transform duration-300">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold">Flight Details</h2>
        <span className="bg-blue-600 px-4 py-2 rounded-full text-sm font-medium shadow-md">
          {flight?.tags?.join(", ")}
        </span>
      </div>
      <div className="text-base space-y-4">
        <p>
          <span className="font-semibold text-gray-300">Departure:</span>{" "}
          {flight?.legs[0]?.origin?.city}
        </p>
        <p>
          <span className="font-semibold text-gray-300">Arrival:</span>{" "}
          {flight?.legs[0]?.destination?.city}
        </p>
        <p>
          <span className="font-semibold text-gray-300">Duration:</span>{" "}
          {flight?.legs[0]?.durationInMinutes} minutes
        </p>
        <p>
          <span className="font-semibold text-gray-300">Price:</span>{" "}
          <span className="text-green-400">{flight?.price?.formatted}</span>
        </p>
        <p>
          <span className="font-semibold text-gray-300">Change Policy:</span>{" "}
          {flight?.farePolicy?.isChangeAllowed ? "Allowed" : "Not Allowed"}
        </p>
        <p>
          <span className="font-semibold text-gray-300">Cancellation:</span>{" "}
          {flight?.farePolicy?.isCancellationAllowed
            ? "Allowed"
            : "Not Allowed"}
        </p>
      </div>
      <button className="mt-6 w-full bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 text-white px-6 py-3 rounded-lg text-lg font-medium shadow-lg">
        Book Now
      </button>
    </div>
  );
};
