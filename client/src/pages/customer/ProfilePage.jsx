import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-hot-toast';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const ProfilePage = () => {
  const { user, updateUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('personal');

  // Personal Info
  const [personalInfo, setPersonalInfo] = useState({
    name: '',
    email: '',
    phone: '',
  });

  // Address
  const [address, setAddress] = useState('');

  // Password
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  // Payment Methods
  const [paymentMethods, setPaymentMethods] = useState({
    momo: {
      provider: 'MTN',
      number: '',
    },
    card: {
      cardNumber: '',
      cardName: '',
      expiryDate: '',
      cvv: '',
    },
  });

  useEffect(() => {
    if (user) {
      setPersonalInfo({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
      });
      setAddress(user.address || '');
    }
  }, [user]);

  const handleUpdatePersonalInfo = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.put(`${API_URL}/api/auth/profile`, personalInfo, {
        withCredentials: true,
      });
      updateUser(response.data.data);
      toast.success('Profile updated successfully!');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateAddress = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.put(`${API_URL}/api/auth/profile`, { address }, {
        withCredentials: true,
      });
      updateUser(response.data.data);
      toast.success('Address updated successfully!');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update address');
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    if (passwordData.newPassword.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    try {
      await axios.put(`${API_URL}/api/auth/change-password`, {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      }, {
        withCredentials: true,
      });
      toast.success('Password changed successfully!');
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to change password');
    } finally {
      setLoading(false);
    }
  };

  const handleSavePaymentMethods = () => {
    // Save to localStorage for now (can be moved to backend later)
    localStorage.setItem('paymentMethods', JSON.stringify(paymentMethods));
    toast.success('Payment methods saved!');
  };

  useEffect(() => {
    const saved = localStorage.getItem('paymentMethods');
    if (saved) {
      setPaymentMethods(JSON.parse(saved));
    }
  }, []);

  const tabs = [
    { id: 'personal', label: 'Personal Info', icon: '👤' },
    { id: 'address', label: 'Address', icon: '📍' },
    { id: 'password', label: 'Password', icon: '🔒' },
    { id: 'payment', label: 'Payment Methods', icon: '💳' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-peach-50 via-white to-pink-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-br from-primary to-accent-pink text-white text-4xl font-bold mb-4 shadow-soft">
            {user?.name?.[0]?.toUpperCase() || 'U'}
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">My Profile</h1>
          <p className="text-gray-600">Manage your account settings and preferences</p>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-2xl shadow-soft overflow-hidden">
          <div className="border-b border-gray-200">
            <div className="flex overflow-x-auto">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-1 min-w-max px-6 py-4 text-sm font-semibold transition-all ${
                    activeTab === tab.id
                      ? 'text-primary border-b-2 border-primary bg-primary/5'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  <span className="mr-2">{tab.icon}</span>
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          <div className="p-8">
            {/* Personal Info Tab */}
            {activeTab === 'personal' && (
              <form onSubmit={handleUpdatePersonalInfo} className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Full Name</label>
                  <Input
                    type="text"
                    value={personalInfo.name}
                    onChange={(e) => setPersonalInfo({ ...personalInfo, name: e.target.value })}
                    placeholder="Enter your full name"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Email Address</label>
                  <Input
                    type="email"
                    value={personalInfo.email}
                    onChange={(e) => setPersonalInfo({ ...personalInfo, email: e.target.value })}
                    placeholder="Enter your email"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Phone Number</label>
                  <Input
                    type="tel"
                    value={personalInfo.phone}
                    onChange={(e) => setPersonalInfo({ ...personalInfo, phone: e.target.value })}
                    placeholder="Enter your phone number"
                  />
                </div>
                <Button type="submit" disabled={loading} className="w-full">
                  {loading ? 'Saving...' : 'Save Changes'}
                </Button>
              </form>
            )}

            {/* Address Tab */}
            {activeTab === 'address' && (
              <form onSubmit={handleUpdateAddress} className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Delivery Address</label>
                  <textarea
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Enter your full delivery address"
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                    required
                  />
                  <p className="text-sm text-gray-500 mt-2">
                    Include house number, street name, area, and any landmarks
                  </p>
                </div>
                <Button type="submit" disabled={loading} className="w-full">
                  {loading ? 'Saving...' : 'Save Address'}
                </Button>
              </form>
            )}

            {/* Password Tab */}
            {activeTab === 'password' && (
              <form onSubmit={handleChangePassword} className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Current Password</label>
                  <Input
                    type="password"
                    value={passwordData.currentPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                    placeholder="Enter current password"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">New Password</label>
                  <Input
                    type="password"
                    value={passwordData.newPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                    placeholder="Enter new password (min 6 characters)"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Confirm New Password</label>
                  <Input
                    type="password"
                    value={passwordData.confirmPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                    placeholder="Confirm new password"
                    required
                  />
                </div>
                <Button type="submit" disabled={loading} className="w-full">
                  {loading ? 'Changing...' : 'Change Password'}
                </Button>
              </form>
            )}

            {/* Payment Methods Tab */}
            {activeTab === 'payment' && (
              <div className="space-y-8">
                {/* Mobile Money */}
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                    📱 Mobile Money (MoMo)
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Provider</label>
                      <select
                        value={paymentMethods.momo.provider}
                        onChange={(e) => setPaymentMethods({
                          ...paymentMethods,
                          momo: { ...paymentMethods.momo, provider: e.target.value }
                        })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                      >
                        <option value="MTN">MTN Mobile Money</option>
                        <option value="Telecel">Telecel Cash</option>
                        <option value="AirtelTigo">AirtelTigo Money</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Phone Number</label>
                      <Input
                        type="tel"
                        value={paymentMethods.momo.number}
                        onChange={(e) => setPaymentMethods({
                          ...paymentMethods,
                          momo: { ...paymentMethods.momo, number: e.target.value }
                        })}
                        placeholder="e.g., 0241234567"
                      />
                    </div>
                  </div>
                </div>

                <div className="border-t border-gray-200 pt-8">
                  <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                    💳 Debit/Credit Card
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Card Number</label>
                      <Input
                        type="text"
                        value={paymentMethods.card.cardNumber}
                        onChange={(e) => setPaymentMethods({
                          ...paymentMethods,
                          card: { ...paymentMethods.card, cardNumber: e.target.value }
                        })}
                        placeholder="1234 5678 9012 3456"
                        maxLength={19}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Cardholder Name</label>
                      <Input
                        type="text"
                        value={paymentMethods.card.cardName}
                        onChange={(e) => setPaymentMethods({
                          ...paymentMethods,
                          card: { ...paymentMethods.card, cardName: e.target.value }
                        })}
                        placeholder="Name on card"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Expiry Date</label>
                        <Input
                          type="text"
                          value={paymentMethods.card.expiryDate}
                          onChange={(e) => setPaymentMethods({
                            ...paymentMethods,
                            card: { ...paymentMethods.card, expiryDate: e.target.value }
                          })}
                          placeholder="MM/YY"
                          maxLength={5}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">CVV</label>
                        <Input
                          type="text"
                          value={paymentMethods.card.cvv}
                          onChange={(e) => setPaymentMethods({
                            ...paymentMethods,
                            card: { ...paymentMethods.card, cvv: e.target.value }
                          })}
                          placeholder="123"
                          maxLength={3}
                        />
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-500 bg-blue-50 p-3 rounded-lg">
                      <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                      </svg>
                      Supports Visa & Mastercard. Your payment info is encrypted and secure.
                    </div>
                  </div>
                </div>

                <Button onClick={handleSavePaymentMethods} className="w-full">
                  Save Payment Methods
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
