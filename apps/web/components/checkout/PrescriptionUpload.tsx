'use client';

import React, { useState, useRef } from 'react';

interface PrescriptionData {
  doctorName: string;
  doctorLicense: string;
  clinicName: string;
  clinicContact: string;
  prescribedDate: string;
  validUntil: string;
  diagnosis: string;
  notes: string;
  file?: File;
}

interface PrescriptionUploadProps {
  onSubmit: (data: PrescriptionData) => void;
  onSkip?: () => void;
  hasRxItems: boolean;
}

export default function PrescriptionUpload({ onSubmit, onSkip, hasRxItems }: PrescriptionUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [formData, setFormData] = useState<PrescriptionData>({
    doctorName: '',
    doctorLicense: '',
    clinicName: '',
    clinicContact: '',
    prescribedDate: '',
    validUntil: '',
    diagnosis: '',
    notes: '',
  });
  const [file, setFile] = useState<File | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.doctorName) newErrors.doctorName = 'Doctor name is required';
    if (!formData.doctorLicense) newErrors.doctorLicense = 'License number is required';
    if (!formData.prescribedDate) newErrors.prescribedDate = 'Prescribed date is required';
    if (!formData.validUntil) newErrors.validUntil = 'Valid until date is required';
    
    return newErrors;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    onSubmit({ ...formData, file: file || undefined });
  };

  const handleChange = (field: keyof PrescriptionData, value: string) => {
    setFormData({ ...formData, [field]: value });
    setErrors({ ...errors, [field]: '' });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      // Validate file type
      const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf'];
      if (!allowedTypes.includes(selectedFile.type)) {
        setErrors({ ...errors, file: 'Please upload a JPEG, PNG, or PDF file' });
        return;
      }
      
      // Validate file size (max 5MB)
      if (selectedFile.size > 5 * 1024 * 1024) {
        setErrors({ ...errors, file: 'File size must be less than 5MB' });
        return;
      }
      
      setFile(selectedFile);
      setErrors({ ...errors, file: '' });
    }
  };

  if (!hasRxItems && onSkip) {
    return (
      <div className="text-center py-12">
        <svg className="mx-auto h-24 w-24 text-green-400 mb-4" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
          <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
        </svg>
        <h3 className="text-lg font-medium text-gray-900 mb-2">No Prescription Required</h3>
        <p className="text-gray-600 mb-6">Your order contains only over-the-counter items.</p>
        <button
          onClick={onSkip}
          className="bg-blue-600 text-white px-6 py-3 rounded-md font-medium hover:bg-blue-700"
        >
          Continue to Payment
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Prescription Information</h3>
        <p className="text-sm text-gray-600 mb-6">
          Your order contains prescription items. Please provide prescription details to proceed.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div>
          <label htmlFor="doctorName" className="block text-sm font-medium text-gray-700">
            Doctor Name *
          </label>
          <input
            type="text"
            id="doctorName"
            value={formData.doctorName}
            onChange={(e) => handleChange('doctorName', e.target.value)}
            className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm ${
              errors.doctorName ? 'border-red-300' : ''
            }`}
          />
          {errors.doctorName && (
            <p className="mt-1 text-sm text-red-600">{errors.doctorName}</p>
          )}
        </div>

        <div>
          <label htmlFor="doctorLicense" className="block text-sm font-medium text-gray-700">
            License Number *
          </label>
          <input
            type="text"
            id="doctorLicense"
            value={formData.doctorLicense}
            onChange={(e) => handleChange('doctorLicense', e.target.value)}
            className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm ${
              errors.doctorLicense ? 'border-red-300' : ''
            }`}
          />
          {errors.doctorLicense && (
            <p className="mt-1 text-sm text-red-600">{errors.doctorLicense}</p>
          )}
        </div>

        <div>
          <label htmlFor="clinicName" className="block text-sm font-medium text-gray-700">
            Clinic/Hospital Name
          </label>
          <input
            type="text"
            id="clinicName"
            value={formData.clinicName}
            onChange={(e) => handleChange('clinicName', e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          />
        </div>

        <div>
          <label htmlFor="clinicContact" className="block text-sm font-medium text-gray-700">
            Clinic Contact
          </label>
          <input
            type="text"
            id="clinicContact"
            value={formData.clinicContact}
            onChange={(e) => handleChange('clinicContact', e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          />
        </div>

        <div>
          <label htmlFor="prescribedDate" className="block text-sm font-medium text-gray-700">
            Prescribed Date *
          </label>
          <input
            type="date"
            id="prescribedDate"
            value={formData.prescribedDate}
            onChange={(e) => handleChange('prescribedDate', e.target.value)}
            max={new Date().toISOString().split('T')[0]}
            className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm ${
              errors.prescribedDate ? 'border-red-300' : ''
            }`}
          />
          {errors.prescribedDate && (
            <p className="mt-1 text-sm text-red-600">{errors.prescribedDate}</p>
          )}
        </div>

        <div>
          <label htmlFor="validUntil" className="block text-sm font-medium text-gray-700">
            Valid Until *
          </label>
          <input
            type="date"
            id="validUntil"
            value={formData.validUntil}
            onChange={(e) => handleChange('validUntil', e.target.value)}
            min={new Date().toISOString().split('T')[0]}
            className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm ${
              errors.validUntil ? 'border-red-300' : ''
            }`}
          />
          {errors.validUntil && (
            <p className="mt-1 text-sm text-red-600">{errors.validUntil}</p>
          )}
        </div>

        <div className="sm:col-span-2">
          <label htmlFor="diagnosis" className="block text-sm font-medium text-gray-700">
            Diagnosis/Condition
          </label>
          <input
            type="text"
            id="diagnosis"
            value={formData.diagnosis}
            onChange={(e) => handleChange('diagnosis', e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          />
        </div>

        <div className="sm:col-span-2">
          <label htmlFor="notes" className="block text-sm font-medium text-gray-700">
            Additional Notes
          </label>
          <textarea
            id="notes"
            rows={3}
            value={formData.notes}
            onChange={(e) => handleChange('notes', e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Prescription Document (Optional)
        </label>
        <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
          <div className="space-y-1 text-center">
            {file ? (
              <div className="text-sm text-gray-600">
                <svg className="mx-auto h-12 w-12 text-green-400 mb-2" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                  <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                <p className="font-medium">{file.name}</p>
                <p className="text-xs">{(file.size / 1024).toFixed(1)} KB</p>
                <button
                  type="button"
                  onClick={() => setFile(null)}
                  className="text-red-600 hover:text-red-700 text-sm mt-2"
                >
                  Remove
                </button>
              </div>
            ) : (
              <>
                <svg
                  className="mx-auto h-12 w-12 text-gray-400"
                  stroke="currentColor"
                  fill="none"
                  viewBox="0 0 48 48"
                  aria-hidden="true"
                >
                  <path
                    d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <div className="flex text-sm text-gray-600">
                  <label
                    htmlFor="file-upload"
                    className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500"
                  >
                    <span>Upload a file</span>
                    <input
                      id="file-upload"
                      name="file-upload"
                      type="file"
                      ref={fileInputRef}
                      className="sr-only"
                      accept="image/jpeg,image/png,image/jpg,application/pdf"
                      onChange={handleFileChange}
                    />
                  </label>
                  <p className="pl-1">or drag and drop</p>
                </div>
                <p className="text-xs text-gray-500">PNG, JPG, PDF up to 5MB</p>
              </>
            )}
          </div>
        </div>
        {errors.file && (
          <p className="mt-1 text-sm text-red-600">{errors.file}</p>
        )}
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          className="bg-blue-600 text-white px-6 py-3 rounded-md font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Continue to Payment
        </button>
      </div>
    </form>
  );
} 