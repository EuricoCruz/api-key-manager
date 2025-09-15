'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '../../components/Sidebar';

export default function Protected() {
  const [isLoading, setIsLoading] = useState(true);
  const [keyInfo, setKeyInfo] = useState(null);
  const router = useRouter();

  useEffect(() => {
    // Check if we have key info in sessionStorage (from successful validation)
    const storedKeyInfo = sessionStorage.getItem('validatedKeyInfo');
    if (storedKeyInfo) {
      setKeyInfo(JSON.parse(storedKeyInfo));
      setIsLoading(false);
    } else {
      // If no valid key info, redirect to API playground
      router.push('/api-playground');
    }
  }, [router]);

  const handleLogout = () => {
    // Clear the stored key info and redirect to playground
    sessionStorage.removeItem('validatedKeyInfo');
    router.push('/api-playground');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="bg-white shadow-sm border-b border-gray-200">
          <div className="px-6 py-4">
            <div className="flex items-center justify-between">
              <div>
                <nav className="flex" aria-label="Breadcrumb">
                  <ol className="flex items-center space-x-2">
                    <li>
                      <span className="text-sm text-gray-500">Pages</span>
                    </li>
                    <li>
                      <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                      </svg>
                    </li>
                    <li>
                      <span className="text-sm text-gray-500">Protected</span>
                    </li>
                  </ol>
                </nav>
                <h1 className="mt-2 text-2xl font-bold text-gray-900">Protected Route</h1>
                <p className="mt-1 text-sm text-gray-600">
                  This is a protected route accessible only for valid API keys
                </p>
              </div>
              <button
                onClick={handleLogout}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                Logout
              </button>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 p-6">
          <div className="max-w-4xl mx-auto">
            {/* Success Message */}
            <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-8">
              <div className="flex">
                <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div className="ml-3">
                  <h3 className="text-lg font-medium text-green-800">Access Granted!</h3>
                  <p className="mt-1 text-sm text-green-700">
                    Your API key has been successfully validated. You now have access to this protected route.
                  </p>
                </div>
              </div>
            </div>

            {/* API Key Information */}
            {keyInfo && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-8">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900">API Key Information</h3>
                  <p className="mt-1 text-sm text-gray-600">
                    Details about your validated API key
                  </p>
                </div>
                <div className="p-6">
                  <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Key Name</dt>
                      <dd className="mt-1 text-sm text-gray-900">{keyInfo.name}</dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Environment</dt>
                      <dd className="mt-1">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          keyInfo.environment === 'production' 
                            ? 'bg-red-100 text-red-800' 
                            : keyInfo.environment === 'staging'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-green-100 text-green-800'
                        }`}>
                          {keyInfo.environment}
                        </span>
                      </dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Key ID</dt>
                      <dd className="mt-1 text-sm text-gray-900 font-mono">{keyInfo.id}</dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Status</dt>
                      <dd className="mt-1">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          <svg className="w-2 h-2 mr-1" fill="currentColor" viewBox="0 0 8 8">
                            <circle cx="4" cy="4" r="3" />
                          </svg>
                          Valid
                        </span>
                      </dd>
                    </div>
                  </dl>
                </div>
              </div>
            )}

            {/* Protected Content */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">Protected Content</h3>
                <p className="mt-1 text-sm text-gray-600">
                  This content is only accessible with a valid API key
                </p>
              </div>
              <div className="p-6">
                <div className="text-center py-12">
                  <svg className="mx-auto h-16 w-16 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  <h3 className="mt-4 text-lg font-medium text-gray-900">Welcome to the Protected Area!</h3>
                  <p className="mt-2 text-sm text-gray-600 max-w-md mx-auto">
                    This is a protected route accessible only for valid API keys. 
                    You have successfully authenticated and can now access this secure content.
                  </p>
                  <div className="mt-6">
                    <div className="inline-flex items-center px-4 py-2 bg-green-100 text-green-800 rounded-lg">
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Authentication Successful
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
