export default function ReceptionBookings() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">Booking Requests</h1>
      <p className="text-gray-500">Verify payments and update reservation status.</p>
      
      <div className="grid gap-4">
        {/* We will map over PENDING bookings here */}
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex justify-between items-center">
            <div>
                <p className="font-bold text-gray-900">Booking #12345</p>
                <p className="text-sm text-gray-500">Guest: John Doe | Room: 101</p>
            </div>
            <div className="flex gap-2">
                <button className="bg-blue-50 text-blue-600 px-4 py-2 rounded-xl font-bold text-sm">View Payment</button>
                <button className="bg-green-600 text-white px-4 py-2 rounded-xl font-bold text-sm">Approve</button>
            </div>
        </div>
      </div>
    </div>
  );
}