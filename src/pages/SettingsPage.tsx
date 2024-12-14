import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from '@/components/ui/card';
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000';

interface BuyerCardData {
  brand: string;
  lastFour: string;
  expirationYear: number;
  expirationMonth: number;
}

interface BuyerData {
  id: string;
  created_at: string;
  updated_at: string;
  external_id: string;
  first_name: string;
  last_name: string;
  email: string;
  user_data: Record<string, unknown>;
  payment_method_embed_url: string;
  card?: BuyerCardData;
}

export default function SettingsPage() {
  const { userData, logout, accessToken } = useAuth();
  const navigate = useNavigate();

  const [buyerData, setBuyerData] = useState<BuyerData | null>(null);
  const [loadingBuyerData, setLoadingBuyerData] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [isLoadingPaymentFlow, setIsLoadingPaymentFlow] = useState(false);

  const iframeRef = useRef<HTMLIFrameElement>(null);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  async function fetchBuyer() {
    if (!userData || !userData.uid || !userData.isBuyer) return;

    setLoadingBuyerData(true);
    try {
      const response = await axios.get(`${API_BASE_URL}/transactions/get-buyer?uid=${encodeURIComponent(userData.uid)}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        }
      });
      setBuyerData(response.data);
    } catch (error: any) {
      console.error('Error fetching buyer data:', error.response ? error.response.data : error.message);
    } finally {
      setLoadingBuyerData(false);
    }
  }

  useEffect(() => {
    fetchBuyer();
  }, [userData, accessToken]);

  async function handleAddPayment() {
    // If not a buyer, we need to create a buyer first
    if (!userData?.isBuyer) {
      try {
        setIsLoadingPaymentFlow(true);
        await axios.post(`${API_BASE_URL}/transactions/create-buyer`,
          { uid: userData?.uid },
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
              'Content-Type': 'application/json'
            }
          }
        );
        // After creating buyer successfully, update user and fetch buyer data
        // Typically the backend updates userData.isBuyer in DB, so you may need to refresh user info.
        // Assuming userData will be updated eventually, or you can force refetch user data if needed.
        // For now, we just refetch buyer data:
        await fetchBuyer();
      } catch (err: any) {
        console.error('Error creating buyer:', err.response ? err.response.data : err.message);
        setIsLoadingPaymentFlow(false);
        return;
      } finally {
        setIsLoadingPaymentFlow(false);
      }
    }

    // Now user is a buyer (either was before or just created)
    setShowPaymentModal(true);
  }

  async function handleEditPayment() {
    setShowPaymentModal(true);
  }

  // Determine if we're adding or updating payment method based on card presence
  const isEditingPayment = !!buyerData?.card;
  const headlineText = isEditingPayment ? "Update Your Payment Method" : "Add Your Payment Method";
  const submitButtonText = isEditingPayment ? "Update" : "Add Payment";

  // Customize the payment form based on add or update
  const options = {
    font: "Poppins",
    backgroundColor: "#FFFFFF",
    textColor: "#272D36",
    secondaryTextColor: "#657C9D",
    errorColor: "#D7625E",
    buttonColor: "#080808",
    buttonLabelColor: "#FFFFFF",
    buttonBorderRadius: "6px",
    fieldBackgroundColor: "#F9F9F9",
    fieldBottomBorderColor: "#DEE3EB",
    fieldBorderRadius: "0px",
    fieldTextColor: "#080808",
    loaderColor: "#DEE3EB",
    headlineText,
    submitButtonText
  };

  const stringified = JSON.stringify(options);
  const encoded = btoa(stringified); // encode options to base64
  const paymentURL = buyerData?.payment_method_embed_url 
    ? `${buyerData.payment_method_embed_url}?options=${encoded}`
    : null;

  // Close modal handler
  const closePaymentModal = () => {
    setShowPaymentModal(false);
  };

  return (
    <div className="w-screen min-h-screen bg-gray-50 p-6">
      <div className="max-w-5xl mx-auto mt-10">
        <h1 className="text-3xl font-bold mb-6 text-gray-900">Settings</h1>
        
        <Card className="shadow-sm border border-gray-200 rounded-lg bg-white mb-8">
          <CardHeader className="border-b border-gray-200 p-4">
            <CardTitle className="text-xl font-semibold text-gray-900">Account Information</CardTitle>
            <CardDescription className="text-gray-500 text-sm mt-1">
              Manage your personal information and account details
            </CardDescription>
          </CardHeader>
          <CardContent className="p-4 space-y-4">
            {userData ? (
              <>
                <div className="flex flex-col space-y-1">
                  <span className="text-gray-500 text-sm">User ID</span>
                  <div className="bg-gray-100 rounded-md p-2 text-gray-800 text-sm">
                    {userData._id}
                  </div>
                </div>
                <div className="flex flex-col space-y-1">
                  <span className="text-gray-500 text-sm">Email</span>
                  <div className="bg-gray-100 rounded-md p-2 text-gray-800 text-sm">
                    {userData.email}
                  </div>
                </div>
                <div className="flex flex-col space-y-1">
                  <span className="text-gray-500 text-sm">Auth Method</span>
                  <div className="bg-gray-100 rounded-md p-2 text-gray-800 text-sm capitalize">
                    {userData.authMethod}
                  </div>
                </div>
                <div className="flex flex-col space-y-1">
                  <span className="text-gray-500 text-sm">Created At</span>
                  <div className="bg-gray-100 rounded-md p-2 text-gray-800 text-sm">
                    {new Date(userData.createdAt).toLocaleString()}
                  </div>
                </div>
              </>
            ) : (
              <p className="text-gray-500 text-sm">
                No user data found. Please log in again.
              </p>
            )}
          </CardContent>
          <CardFooter className="border-t border-gray-200 p-4 flex justify-end space-x-2">
            {userData && !userData.isBuyer && (
              <Button 
                variant="default" 
                className="bg-blue-600 hover:bg-blue-700 text-white"
                onClick={handleAddPayment}
                disabled={isLoadingPaymentFlow}
              >
                {isLoadingPaymentFlow ? "Processing..." : "Add Payment Method"}
              </Button>
            )}
            <Button 
              variant="destructive" 
              onClick={handleLogout}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              Logout
            </Button>
          </CardFooter>
        </Card>

        {userData && userData.isBuyer && (
          <Card className="shadow-sm border border-gray-200 rounded-lg bg-white">
            <CardHeader className="border-b border-gray-200 p-4">
              <CardTitle className="text-xl font-semibold text-gray-900">Payment Information</CardTitle>
              <CardDescription className="text-gray-500 text-sm mt-1">
                Review your current card on file
              </CardDescription>
            </CardHeader>
            <CardContent className="p-4 space-y-4">
              {loadingBuyerData ? (
                <p className="text-gray-500 text-sm">Loading buyer data...</p>
              ) : buyerData && buyerData.card ? (
                <>
                  <div className="flex flex-col space-y-1">
                    <span className="text-gray-500 text-sm">Card Brand</span>
                    <div className="bg-gray-100 rounded-md p-2 text-gray-800 text-sm">
                      {buyerData.card.brand}
                    </div>
                  </div>
                  <div className="flex flex-col space-y-1">
                    <span className="text-gray-500 text-sm">Last Four</span>
                    <div className="bg-gray-100 rounded-md p-2 text-gray-800 text-sm">
                      {buyerData.card.lastFour}
                    </div>
                  </div>
                  <div className="flex flex-col space-y-1">
                    <span className="text-gray-500 text-sm">Expiration</span>
                    <div className="bg-gray-100 rounded-md p-2 text-gray-800 text-sm">
                      {buyerData.card.expirationMonth}/{buyerData.card.expirationYear}
                    </div>
                  </div>
                </>
              ) : (
                <p className="text-gray-500 text-sm">No card on file.</p>
              )}
            </CardContent>
            <CardFooter className="border-t border-gray-200 p-4 flex justify-end">
              {buyerData && buyerData.card ? (
                <Button 
                  variant="default" 
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                  onClick={handleEditPayment}
                >
                  Edit Payment Method
                </Button>
              ) : (
                <Button
                  variant="default"
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                  onClick={handleAddPayment}
                  disabled={isLoadingPaymentFlow}
                >
                  {isLoadingPaymentFlow ? "Processing..." : "Add Payment Method"}
                </Button>
              )}
            </CardFooter>
          </Card>
        )}
      </div>

      {showPaymentModal && paymentURL && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 p-4">
          <div className="relative bg-white rounded-lg shadow-lg max-w-lg w-full p-6">
            {/* Close button */}
            <button 
              className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center bg-black text-white rounded-full focus:outline-none" 
              onClick={closePaymentModal}
              aria-label="Close update payment form"
            >
              X
            </button>
            <h2 className="text-2xl font-bold mb-4 text-gray-900">
              {isEditingPayment ? "Update Payment Method" : "Add Payment Method"}
            </h2>
            <iframe
              ref={iframeRef}
              src={paymentURL}
              className="w-full border rounded h-[600px]"
              onLoad={() => console.log('[Frontend] Payment iframe loaded')}
            />
          </div>
        </div>
      )}
    </div>
  );
}
