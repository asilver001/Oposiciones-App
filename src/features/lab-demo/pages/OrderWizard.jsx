import React, { useState } from 'react';
import { ArrowLeft, ArrowRight, Check, Upload, Calendar, Truck, Building2, User, Phone, Mail, FileText, AlertCircle } from 'lucide-react';
import { ToothChart, ShadeSelector } from '../components';
import { services, implantSystems, deliveryMethods, getServiceById } from '../data/services';
import { useLabDemo } from '../context/LabDemoContext';

/**
 * Multi-step Order Wizard
 * Step 1: Practice Details
 * Step 2: Case Details (Service, Tooth Chart, Shade)
 * Step 3: Files & Delivery
 * Step 4: Review & Submit
 */

const STEPS = [
  { id: 1, title: 'Practice Details', icon: Building2 },
  { id: 2, title: 'Case Details', icon: FileText },
  { id: 3, title: 'Files & Delivery', icon: Truck },
  { id: 4, title: 'Review & Submit', icon: Check }
];

// Step indicator component
function StepIndicator({ currentStep }) {
  return (
    <div className="flex items-center justify-center mb-8">
      {STEPS.map((step, idx) => (
        <React.Fragment key={step.id}>
          <div className="flex flex-col items-center">
            <div
              className={`
                w-10 h-10 rounded-full flex items-center justify-center
                transition-all duration-300
                ${currentStep > step.id
                  ? 'bg-emerald-500 text-white'
                  : currentStep === step.id
                    ? 'bg-emerald-500 text-white'
                    : 'bg-slate-100 text-slate-400'
                }
              `}
            >
              {currentStep > step.id ? (
                <Check className="w-5 h-5" />
              ) : (
                <step.icon className="w-5 h-5" />
              )}
            </div>
            <span
              className={`
                mt-2 text-xs font-medium hidden sm:block
                ${currentStep >= step.id ? 'text-slate-700' : 'text-slate-400'}
              `}
            >
              {step.title}
            </span>
          </div>
          {idx < STEPS.length - 1 && (
            <div
              className={`
                w-12 sm:w-20 h-0.5 mx-2
                ${currentStep > step.id ? 'bg-emerald-500' : 'bg-slate-200'}
              `}
            />
          )}
        </React.Fragment>
      ))}
    </div>
  );
}

// Step 1: Practice Details
function Step1PracticeDetails({ data, onChange }) {
  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div>
        <h3 className="text-lg font-semibold text-slate-800 mb-1">Practice Details</h3>
        <p className="text-sm text-slate-500">Enter your practice information for this order</p>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            <User className="w-4 h-4 inline mr-1" />
            Dentist Name *
          </label>
          <input
            type="text"
            value={data.dentist}
            onChange={(e) => onChange({ dentist: e.target.value })}
            placeholder="Dr. John Smith"
            className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            <Building2 className="w-4 h-4 inline mr-1" />
            Practice Name *
          </label>
          <input
            type="text"
            value={data.practiceName}
            onChange={(e) => onChange({ practiceName: e.target.value })}
            placeholder="London Dental Clinic"
            className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition"
          />
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            <Phone className="w-4 h-4 inline mr-1" />
            Phone Number *
          </label>
          <input
            type="tel"
            value={data.phone}
            onChange={(e) => onChange({ phone: e.target.value })}
            placeholder="020 1234 5678"
            className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            <Mail className="w-4 h-4 inline mr-1" />
            Email Address *
          </label>
          <input
            type="email"
            value={data.email}
            onChange={(e) => onChange({ email: e.target.value })}
            placeholder="reception@clinic.co.uk"
            className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition"
          />
        </div>
      </div>

      <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-xl">
        <input
          type="checkbox"
          id="saveDetails"
          checked={data.saveDetails}
          onChange={(e) => onChange({ saveDetails: e.target.checked })}
          className="w-4 h-4 text-sky-500 border-slate-300 rounded focus:ring-emerald-500"
        />
        <label htmlFor="saveDetails" className="text-sm text-slate-600">
          Save as returning practice (for demo purposes)
        </label>
      </div>
    </div>
  );
}

// Step 2: Case Details
function Step2CaseDetails({ data, onChange }) {
  const selectedService = getServiceById(data.serviceId);
  const isBridgeOrMultiple = selectedService?.category === 'bridge' || selectedService?.category === 'implant';
  const requiresImplantSystem = selectedService?.requires_implant_system;

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div>
        <h3 className="text-lg font-semibold text-slate-800 mb-1">Case Details</h3>
        <p className="text-sm text-slate-500">Select the service type and specify teeth</p>
      </div>

      {/* Service Type */}
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">
          Service Type *
        </label>
        <select
          value={data.serviceId}
          onChange={(e) => onChange({ serviceId: e.target.value, teeth: [] })}
          className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition bg-white"
        >
          <option value="">Select a service...</option>
          <optgroup label="Crowns">
            {services.filter(s => s.category === 'crown').map(s => (
              <option key={s.id} value={s.id}>{s.name}</option>
            ))}
          </optgroup>
          <optgroup label="Veneers">
            {services.filter(s => s.category === 'veneer').map(s => (
              <option key={s.id} value={s.id}>{s.name}</option>
            ))}
          </optgroup>
          <optgroup label="Bridges">
            {services.filter(s => s.category === 'bridge').map(s => (
              <option key={s.id} value={s.id}>{s.name}</option>
            ))}
          </optgroup>
          <optgroup label="Inlays / Onlays">
            {services.filter(s => s.category === 'inlay').map(s => (
              <option key={s.id} value={s.id}>{s.name}</option>
            ))}
          </optgroup>
          <optgroup label="Implant Work">
            {services.filter(s => s.category === 'implant').map(s => (
              <option key={s.id} value={s.id}>{s.name}</option>
            ))}
          </optgroup>
          <optgroup label="Other">
            {services.filter(s => s.category === 'custom').map(s => (
              <option key={s.id} value={s.id}>{s.name}</option>
            ))}
          </optgroup>
        </select>

        {selectedService && (
          <p className="mt-2 text-sm text-slate-500">{selectedService.description}</p>
        )}
      </div>

      {/* Tooth Chart */}
      {data.serviceId && (
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Select Teeth * {isBridgeOrMultiple && <span className="text-slate-400">(click to toggle abutment/pontic)</span>}
          </label>
          <div className="bg-white border border-slate-200 rounded-xl p-4">
            <ToothChart
              selectedTeeth={data.teeth}
              onTeethChange={(teeth) => onChange({ teeth, units: teeth.length })}
              mode={isBridgeOrMultiple ? 'bridge' : 'multiple'}
              showLegend={isBridgeOrMultiple}
            />
          </div>
        </div>
      )}

      {/* Implant System */}
      {requiresImplantSystem && (
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Implant System *
          </label>
          <select
            value={data.implantSystem}
            onChange={(e) => onChange({ implantSystem: e.target.value })}
            className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition bg-white"
          >
            <option value="">Select implant system...</option>
            {implantSystems.map(sys => (
              <option key={sys.id} value={sys.id}>{sys.name}</option>
            ))}
          </select>
        </div>
      )}

      {/* Shade Selection */}
      {selectedService?.requires_shade && data.teeth.length > 0 && (
        <ShadeSelector
          value={data.shade}
          onChange={(shade) => onChange({ shade })}
          label="VITA Shade *"
        />
      )}

      {/* Stump Shade */}
      {selectedService?.requires_stump_shade && data.teeth.length > 0 && (
        <ShadeSelector
          value={data.stumpShade}
          onChange={(stumpShade) => onChange({ stumpShade })}
          type="stump"
          label="Stump Shade"
        />
      )}

      {/* Special Instructions */}
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">
          Special Instructions / Notes
        </label>
        <textarea
          value={data.notes}
          onChange={(e) => onChange({ notes: e.target.value })}
          placeholder="Any special requirements, matching instructions, or clinical notes..."
          rows={3}
          className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition resize-none"
        />
      </div>
    </div>
  );
}

// Step 3: Files & Delivery
function Step3Delivery({ data, onChange }) {
  const [dragActive, setDragActive] = useState(false);
  const selectedService = getServiceById(data.serviceId);
  const estimatedDays = selectedService?.estimated_days || 7;

  // Calculate due date based on estimated days
  const calculateDueDate = () => {
    const date = new Date();
    let daysAdded = 0;
    while (daysAdded < estimatedDays) {
      date.setDate(date.getDate() + 1);
      const dayOfWeek = date.getDay();
      if (dayOfWeek !== 0 && dayOfWeek !== 6) {
        daysAdded++;
      }
    }
    return date.toISOString().split('T')[0];
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragActive(false);
    // Simulate file upload
    const fileNames = Array.from(e.dataTransfer.files).map(f => f.name);
    onChange({ files: [...data.files, ...fileNames] });
  };

  const handleFileInput = (e) => {
    const fileNames = Array.from(e.target.files).map(f => f.name);
    onChange({ files: [...data.files, ...fileNames] });
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div>
        <h3 className="text-lg font-semibold text-slate-800 mb-1">Digital Files & Delivery</h3>
        <p className="text-sm text-slate-500">Upload scan files and choose delivery options</p>
      </div>

      {/* File Upload */}
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">
          <Upload className="w-4 h-4 inline mr-1" />
          Upload Scan Files (STL)
        </label>
        <div
          className={`
            relative border-2 border-dashed rounded-xl p-8 text-center transition-colors
            ${dragActive ? 'border-emerald-500 bg-sky-50' : 'border-slate-200 hover:border-slate-300'}
          `}
          onDragEnter={handleDrag}
          onDragOver={handleDrag}
          onDragLeave={handleDrag}
          onDrop={handleDrop}
        >
          <Upload className="w-10 h-10 text-slate-300 mx-auto mb-3" />
          <p className="text-slate-600 mb-1">Drag and drop your STL files here</p>
          <p className="text-sm text-slate-400 mb-4">or</p>
          <label className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg cursor-pointer hover:bg-slate-50 transition">
            <span className="text-sm font-medium text-slate-700">Browse Files</span>
            <input
              type="file"
              multiple
              accept=".stl,.ply,.obj"
              onChange={handleFileInput}
              className="hidden"
            />
          </label>
        </div>

        {/* Uploaded files */}
        {data.files.length > 0 && (
          <div className="mt-3 space-y-2">
            {data.files.map((file, idx) => (
              <div key={idx} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-sky-100 rounded flex items-center justify-center">
                    <FileText className="w-4 h-4 text-emerald-600" />
                  </div>
                  <span className="text-sm text-slate-700">{file}</span>
                </div>
                <button
                  onClick={() => onChange({ files: data.files.filter((_, i) => i !== idx) })}
                  className="text-slate-400 hover:text-red-500 transition"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Photo Upload */}
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">
          Upload Photos (optional)
        </label>
        <div className="border-2 border-dashed border-slate-200 rounded-xl p-6 text-center">
          <p className="text-sm text-slate-500">Shade photos, intraoral photos</p>
          <label className="inline-flex items-center gap-2 px-4 py-2 mt-3 bg-white border border-slate-200 rounded-lg cursor-pointer hover:bg-slate-50 transition">
            <span className="text-sm font-medium text-slate-700">Add Photos</span>
            <input type="file" multiple accept="image/*" className="hidden" />
          </label>
        </div>
      </div>

      {/* Due Date */}
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">
          <Calendar className="w-4 h-4 inline mr-1" />
          Preferred Delivery Date
        </label>
        <input
          type="date"
          value={data.dueDate || calculateDueDate()}
          onChange={(e) => onChange({ dueDate: e.target.value })}
          min={new Date().toISOString().split('T')[0]}
          className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition"
        />
        {selectedService && (
          <p className="mt-2 text-sm text-slate-500">
            Estimated turnaround: {estimatedDays} working days
          </p>
        )}
      </div>

      {/* Delivery Method */}
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">
          <Truck className="w-4 h-4 inline mr-1" />
          Delivery Method *
        </label>
        <div className="space-y-2">
          {deliveryMethods.map(method => (
            <label
              key={method.id}
              className={`
                flex items-center gap-4 p-4 border-2 rounded-xl cursor-pointer transition-all
                ${data.deliveryMethod === method.id
                  ? 'border-emerald-500 bg-sky-50'
                  : 'border-slate-200 hover:border-slate-300'
                }
              `}
            >
              <input
                type="radio"
                name="deliveryMethod"
                value={method.id}
                checked={data.deliveryMethod === method.id}
                onChange={(e) => onChange({ deliveryMethod: e.target.value })}
                className="w-4 h-4 text-sky-500 border-slate-300 focus:ring-emerald-500"
              />
              <div>
                <p className="font-medium text-slate-800">{method.name}</p>
                <p className="text-sm text-slate-500">{method.description}</p>
              </div>
            </label>
          ))}
        </div>
      </div>

      {/* Delivery Address */}
      {data.deliveryMethod === 'courier' && (
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Delivery Address *
          </label>
          <textarea
            value={data.deliveryAddress}
            onChange={(e) => onChange({ deliveryAddress: e.target.value })}
            placeholder="Enter full delivery address..."
            rows={3}
            className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition resize-none"
          />
        </div>
      )}
    </div>
  );
}

// Step 4: Review & Submit
function Step4Review({ data, onSubmit, isSubmitting }) {
  const selectedService = getServiceById(data.serviceId);
  const deliveryMethod = deliveryMethods.find(m => m.id === data.deliveryMethod);

  // Calculate estimated price
  const calculatePrice = () => {
    if (!selectedService || !selectedService.price_range_low) {
      return { low: null, high: null };
    }
    const units = data.units || 1;
    return {
      low: selectedService.price_range_low * units,
      high: selectedService.price_range_high * units
    };
  };

  const price = calculatePrice();

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div>
        <h3 className="text-lg font-semibold text-slate-800 mb-1">Review Your Order</h3>
        <p className="text-sm text-slate-500">Please check all details before submitting</p>
      </div>

      {/* Practice Details Card */}
      <div className="bg-slate-50 rounded-xl p-5">
        <h4 className="font-semibold text-slate-700 mb-3 flex items-center gap-2">
          <Building2 className="w-4 h-4" />
          Practice Details
        </h4>
        <div className="grid sm:grid-cols-2 gap-3 text-sm">
          <div>
            <span className="text-slate-500">Dentist:</span>
            <span className="ml-2 text-slate-800">{data.dentist}</span>
          </div>
          <div>
            <span className="text-slate-500">Practice:</span>
            <span className="ml-2 text-slate-800">{data.practiceName}</span>
          </div>
          <div>
            <span className="text-slate-500">Phone:</span>
            <span className="ml-2 text-slate-800">{data.phone}</span>
          </div>
          <div>
            <span className="text-slate-500">Email:</span>
            <span className="ml-2 text-slate-800">{data.email}</span>
          </div>
        </div>
      </div>

      {/* Case Details Card */}
      <div className="bg-slate-50 rounded-xl p-5">
        <h4 className="font-semibold text-slate-700 mb-3 flex items-center gap-2">
          <FileText className="w-4 h-4" />
          Case Details
        </h4>
        <div className="space-y-3 text-sm">
          <div>
            <span className="text-slate-500">Service:</span>
            <span className="ml-2 text-slate-800 font-medium">{selectedService?.name}</span>
          </div>
          <div>
            <span className="text-slate-500">Teeth:</span>
            <span className="ml-2">
              {data.teeth.map(t => (
                <span
                  key={t.number}
                  className={`
                    inline-flex items-center px-2 py-0.5 rounded text-xs font-medium mr-1
                    ${t.type === 'pontic'
                      ? 'bg-blue-100 text-blue-700'
                      : 'bg-emerald-100 text-emerald-700'
                    }
                  `}
                >
                  {t.number}
                </span>
              ))}
            </span>
          </div>
          <div>
            <span className="text-slate-500">Units:</span>
            <span className="ml-2 text-slate-800">{data.units}</span>
          </div>
          {data.shade && (
            <div>
              <span className="text-slate-500">Shade:</span>
              <span className="ml-2 text-slate-800 font-medium">{data.shade}</span>
            </div>
          )}
          {data.stumpShade && (
            <div>
              <span className="text-slate-500">Stump Shade:</span>
              <span className="ml-2 text-slate-800">{data.stumpShade}</span>
            </div>
          )}
          {data.implantSystem && (
            <div>
              <span className="text-slate-500">Implant System:</span>
              <span className="ml-2 text-slate-800">
                {implantSystems.find(s => s.id === data.implantSystem)?.name}
              </span>
            </div>
          )}
          {data.notes && (
            <div>
              <span className="text-slate-500">Notes:</span>
              <p className="mt-1 text-slate-700 bg-white p-2 rounded border border-slate-200">
                {data.notes}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Delivery Card */}
      <div className="bg-slate-50 rounded-xl p-5">
        <h4 className="font-semibold text-slate-700 mb-3 flex items-center gap-2">
          <Truck className="w-4 h-4" />
          Delivery
        </h4>
        <div className="space-y-3 text-sm">
          <div>
            <span className="text-slate-500">Method:</span>
            <span className="ml-2 text-slate-800">{deliveryMethod?.name}</span>
          </div>
          <div>
            <span className="text-slate-500">Due Date:</span>
            <span className="ml-2 text-slate-800">
              {new Date(data.dueDate).toLocaleDateString('en-GB', {
                weekday: 'long',
                day: 'numeric',
                month: 'long',
                year: 'numeric'
              })}
            </span>
          </div>
          {data.deliveryAddress && (
            <div>
              <span className="text-slate-500">Address:</span>
              <span className="ml-2 text-slate-800">{data.deliveryAddress}</span>
            </div>
          )}
          <div>
            <span className="text-slate-500">Files:</span>
            <span className="ml-2 text-slate-800">
              {data.files.length > 0 ? data.files.join(', ') : 'No files uploaded'}
            </span>
          </div>
        </div>
      </div>

      {/* Price Estimate */}
      {price.low && (
        <div className="bg-gradient-to-r from-sky-50 to-blue-50 rounded-xl p-5 border border-sky-100">
          <div className="flex items-start justify-between">
            <div>
              <h4 className="font-semibold text-slate-700 mb-1">Estimated Price</h4>
              <p className="text-xs text-slate-500">Final price confirmed after review</p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-slate-800">
                £{price.low} - £{price.high}
              </p>
              <p className="text-xs text-slate-500">excl. VAT</p>
            </div>
          </div>
        </div>
      )}

      {/* Terms */}
      <div className="flex items-start gap-3 p-4 bg-amber-50 border border-amber-100 rounded-xl">
        <AlertCircle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
        <div className="text-sm text-amber-800">
          <p className="font-medium mb-1">Before submitting:</p>
          <ul className="list-disc list-inside space-y-1 text-amber-700">
            <li>Check scan files are complete and accurate</li>
            <li>Verify shade selection matches your shade tab</li>
            <li>Our team will review and confirm within 2 hours</li>
          </ul>
        </div>
      </div>

      {/* Submit Button */}
      <button
        onClick={onSubmit}
        disabled={isSubmitting}
        className={`
          w-full py-4 rounded-xl font-semibold text-white transition-all duration-200
          flex items-center justify-center gap-2
          ${isSubmitting
            ? 'bg-slate-400 cursor-not-allowed'
            : 'bg-gradient-to-r from-emerald-500 to-green-600 hover:shadow-lg hover:shadow-blue-500/25 hover:-translate-y-0.5'
          }
        `}
      >
        {isSubmitting ? (
          <>
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
            Processing...
          </>
        ) : (
          <>
            <Check className="w-5 h-5" />
            Submit Order
          </>
        )}
      </button>
    </div>
  );
}

// Success Screen
function OrderSuccess({ order, onClose }) {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center animate-in fade-in zoom-in duration-500">
      <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mb-6 animate-bounce">
        <Check className="w-10 h-10 text-emerald-600" />
      </div>

      <h2 className="text-2xl font-bold text-slate-800 mb-2">Order Submitted!</h2>
      <p className="text-slate-600 mb-6">Your order has been received and is being reviewed.</p>

      <div className="bg-slate-50 rounded-xl p-6 mb-8 w-full max-w-sm">
        <p className="text-sm text-slate-500 mb-1">Order Reference</p>
        <p className="text-2xl font-bold text-slate-800 font-mono">{order.ref}</p>
        <p className="text-sm text-slate-500 mt-4 mb-1">Estimated Completion</p>
        <p className="text-lg font-semibold text-slate-700">
          {new Date(order.dueDate).toLocaleDateString('en-GB', {
            weekday: 'long',
            day: 'numeric',
            month: 'long'
          })}
        </p>
      </div>

      <div className="text-sm text-slate-500 mb-8">
        <p>Our team will review your order and send confirmation to</p>
        <p className="font-medium text-slate-700">{order.email}</p>
      </div>

      <div className="flex gap-3">
        <button
          onClick={() => onClose('landing')}
          className="px-6 py-2.5 bg-slate-100 text-slate-700 rounded-xl hover:bg-slate-200 transition"
        >
          Back to Home
        </button>
        <button
          onClick={() => onClose('order')}
          className="px-6 py-2.5 bg-emerald-500 text-white rounded-xl hover:bg-emerald-600 transition"
        >
          Place Another Order
        </button>
      </div>
    </div>
  );
}

// Main OrderWizard Component
export default function OrderWizard({ onNavigate }) {
  const { addOrder } = useLabDemo();
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedOrder, setSubmittedOrder] = useState(null);

  const [formData, setFormData] = useState({
    // Step 1
    dentist: '',
    practiceName: '',
    phone: '',
    email: '',
    saveDetails: false,
    // Step 2
    serviceId: '',
    teeth: [],
    units: 0,
    shade: '',
    stumpShade: '',
    implantSystem: '',
    notes: '',
    // Step 3
    files: [],
    photos: [],
    dueDate: '',
    deliveryMethod: 'collection',
    deliveryAddress: ''
  });

  const updateFormData = (updates) => {
    setFormData(prev => ({ ...prev, ...updates }));
  };

  const canProceed = () => {
    switch (step) {
      case 1:
        return formData.dentist && formData.practiceName && formData.phone && formData.email;
      case 2:
        return formData.serviceId && formData.teeth.length > 0;
      case 3:
        return formData.deliveryMethod && (formData.deliveryMethod !== 'courier' || formData.deliveryAddress);
      default:
        return true;
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));

    const selectedService = getServiceById(formData.serviceId);
    const newOrder = addOrder({
      ...formData,
      serviceName: selectedService?.name,
      practiceId: `p-${Date.now()}`
    });

    setSubmittedOrder(newOrder);
    setIsSubmitting(false);
  };

  // Show success screen after submission
  if (submittedOrder) {
    return (
      <div className="min-h-screen bg-white">
        <div className="max-w-2xl mx-auto px-4 py-8">
          <OrderSuccess order={submittedOrder} onClose={onNavigate} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Header */}
      <header className="bg-white border-b border-slate-100 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <button
            onClick={() => onNavigate('landing')}
            className="flex items-center gap-2 text-slate-600 hover:text-slate-900 transition"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="hidden sm:inline">Back to Home</span>
          </button>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-green-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">P</span>
            </div>
            <span className="font-semibold text-slate-800 hidden sm:inline">Picto Dent</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-2xl mx-auto px-4 py-8">
        <StepIndicator currentStep={step} />

        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 sm:p-8">
          {step === 1 && (
            <Step1PracticeDetails data={formData} onChange={updateFormData} />
          )}
          {step === 2 && (
            <Step2CaseDetails data={formData} onChange={updateFormData} />
          )}
          {step === 3 && (
            <Step3Delivery data={formData} onChange={updateFormData} />
          )}
          {step === 4 && (
            <Step4Review
              data={formData}
              onSubmit={handleSubmit}
              isSubmitting={isSubmitting}
            />
          )}

          {/* Navigation Buttons */}
          {step < 4 && (
            <div className="flex justify-between mt-8 pt-6 border-t border-slate-100">
              <button
                onClick={() => setStep(s => s - 1)}
                disabled={step === 1}
                className={`
                  flex items-center gap-2 px-4 py-2 rounded-xl transition
                  ${step === 1
                    ? 'text-slate-300 cursor-not-allowed'
                    : 'text-slate-600 hover:bg-slate-100'
                  }
                `}
              >
                <ArrowLeft className="w-4 h-4" />
                Previous
              </button>
              <button
                onClick={() => setStep(s => s + 1)}
                disabled={!canProceed()}
                className={`
                  flex items-center gap-2 px-6 py-2 rounded-xl font-medium transition
                  ${canProceed()
                    ? 'bg-emerald-500 text-white hover:bg-emerald-600'
                    : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                  }
                `}
              >
                Continue
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
