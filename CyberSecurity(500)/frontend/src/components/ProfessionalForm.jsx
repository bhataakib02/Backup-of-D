import React, { useState, useEffect } from 'react';
import { validateInput, VALIDATION_RULES, rateLimiter } from '../utils/validation';
import { useNotifications } from './NotificationSystem';

// Professional Input Field Component
export const ProfessionalInput = ({
  label,
  name,
  type = 'text',
  placeholder,
  value,
  onChange,
  onBlur,
  validationRules = {},
  disabled = false,
  required = false,
  helpText,
  icon,
  autoComplete = 'off',
  className = '',
  ...props
}) => {
  const [errors, setErrors] = useState([]);
  const [touched, setTouched] = useState(false);
  const [isValidating, setIsValidating] = useState(false);

  const handleChange = (e) => {
    const newValue = e.target.value;
    onChange(e);
    
    if (touched) {
      validateField(newValue);
    }
  };

  const handleBlur = (e) => {
    setTouched(true);
    validateField(e.target.value);
    if (onBlur) onBlur(e);
  };

  const validateField = async (fieldValue) => {
    setIsValidating(true);
    
    const validation = validateInput(fieldValue, {
      required,
      ...validationRules
    });
    
    setErrors(validation.errors);
    setIsValidating(false);
    
    return validation;
  };

  const hasErrors = errors.length > 0;
  const showErrors = touched && hasErrors;

  const inputClasses = `
    block w-full px-3 py-2 border rounded-md shadow-sm placeholder-gray-400 
    focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors duration-200
    ${icon ? 'pl-10' : ''}
    ${showErrors 
      ? 'border-red-300 focus:border-red-500 focus:ring-red-500' 
      : 'border-gray-300 dark:border-gray-600 focus:border-blue-500 focus:ring-blue-500'
    }
    ${disabled 
      ? 'bg-gray-50 dark:bg-gray-700 text-gray-500 cursor-not-allowed' 
      : 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white'
    }
    ${className}
  `.trim();

  return (
    <div className="space-y-1">
      {label && (
        <label htmlFor={name} className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      
      <div className="relative">
        {icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <div className="h-5 w-5 text-gray-400">
              {icon}
            </div>
          </div>
        )}
        
        <input
          id={name}
          name={name}
          type={type}
          value={value}
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder={placeholder}
          disabled={disabled}
          autoComplete={autoComplete}
          className={inputClasses}
          aria-invalid={showErrors}
          aria-describedby={showErrors ? `${name}-error` : undefined}
          {...props}
        />
        
        {isValidating && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
            <svg className="animate-spin h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </div>
        )}
      </div>
      
      {showErrors && (
        <div id={`${name}-error`} className="space-y-1">
          {errors.map((error, index) => (
            <p key={index} className="text-sm text-red-600 dark:text-red-400 flex items-center">
              <svg className="w-4 h-4 mr-1 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              {error}
            </p>
          ))}
        </div>
      )}
      
      {helpText && !showErrors && (
        <p className="text-sm text-gray-500 dark:text-gray-400">
          {helpText}
        </p>
      )}
    </div>
  );
};

// Professional Select Component
export const ProfessionalSelect = ({
  label,
  name,
  value,
  onChange,
  options = [],
  placeholder = 'Select an option',
  required = false,
  disabled = false,
  className = '',
  ...props
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredOptions = options.filter(option =>
    option.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const selectedOption = options.find(option => option.value === value);

  const handleSelect = (option) => {
    onChange({ target: { name, value: option.value } });
    setIsOpen(false);
    setSearchTerm('');
  };

  return (
    <div className="space-y-1">
      {label && (
        <label htmlFor={name} className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      
      <div className="relative">
        <button
          type="button"
          disabled={disabled}
          onClick={() => setIsOpen(!isOpen)}
          className={`
            relative w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 
            rounded-md shadow-sm pl-3 pr-10 py-2 text-left cursor-default 
            focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 
            transition-colors duration-200
            ${disabled ? 'bg-gray-50 dark:bg-gray-700 text-gray-500 cursor-not-allowed' : ''}
            ${className}
          `.trim()}
        >
          <span className="block truncate text-gray-900 dark:text-white">
            {selectedOption ? selectedOption.label : placeholder}
          </span>
          <span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
            <svg className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 3a1 1 0 01.707.293l3 3a1 1 0 01-1.414 1.414L10 5.414 7.707 7.707a1 1 0 01-1.414-1.414l3-3A1 1 0 0110 3z" clipRule="evenodd" />
            </svg>
          </span>
        </button>

        {isOpen && (
          <div className="absolute z-10 mt-1 w-full bg-white dark:bg-gray-800 shadow-lg max-h-60 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none">
            {options.length > 10 && (
              <div className="px-3 py-2 border-b border-gray-200 dark:border-gray-700">
                <input
                  type="text"
                  placeholder="Search options..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-2 py-1 border border-gray-300 dark:border-gray-600 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
            )}
            
            {filteredOptions.length === 0 ? (
              <div className="px-3 py-2 text-gray-500 dark:text-gray-400 text-sm">
                No options found
              </div>
            ) : (
              filteredOptions.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => handleSelect(option)}
                  className={`
                    w-full text-left px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 
                    focus:outline-none focus:bg-gray-100 dark:focus:bg-gray-700 transition-colors duration-200
                    ${value === option.value ? 'bg-blue-100 dark:bg-blue-900 text-blue-900 dark:text-blue-100' : 'text-gray-900 dark:text-white'}
                  `.trim()}
                >
                  {option.label}
                </button>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};

// Professional Button Component
export const ProfessionalButton = ({
  children,
  type = 'button',
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  icon,
  iconPosition = 'left',
  onClick,
  className = '',
  ...props
}) => {
  const getVariantClasses = () => {
    switch (variant) {
      case 'primary':
        return 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500 text-white border-transparent';
      case 'secondary':
        return 'bg-gray-600 hover:bg-gray-700 focus:ring-gray-500 text-white border-transparent';
      case 'success':
        return 'bg-green-600 hover:bg-green-700 focus:ring-green-500 text-white border-transparent';
      case 'danger':
        return 'bg-red-600 hover:bg-red-700 focus:ring-red-500 text-white border-transparent';
      case 'warning':
        return 'bg-yellow-600 hover:bg-yellow-700 focus:ring-yellow-500 text-white border-transparent';
      case 'outline':
        return 'bg-transparent hover:bg-gray-50 dark:hover:bg-gray-800 focus:ring-blue-500 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600';
      default:
        return 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500 text-white border-transparent';
    }
  };

  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return 'px-3 py-1.5 text-sm';
      case 'md':
        return 'px-4 py-2 text-sm';
      case 'lg':
        return 'px-6 py-3 text-base';
      case 'xl':
        return 'px-8 py-4 text-lg';
      default:
        return 'px-4 py-2 text-sm';
    }
  };

  const baseClasses = `
    inline-flex items-center justify-center border font-medium rounded-md 
    focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all duration-200
    disabled:opacity-50 disabled:cursor-not-allowed
  `.trim();

  const variantClasses = getVariantClasses();
  const sizeClasses = getSizeClasses();

  const buttonClasses = `${baseClasses} ${variantClasses} ${sizeClasses} ${className}`;

  const handleClick = (e) => {
    if (!loading && !disabled && onClick) {
      onClick(e);
    }
  };

  return (
    <button
      type={type}
      disabled={disabled || loading}
      onClick={handleClick}
      className={buttonClasses}
      {...props}
    >
      {loading ? (
        <>
          <svg className="animate-spin -ml-1 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Processing...
        </>
      ) : (
        <>
          {icon && iconPosition === 'left' && (
            <span className="mr-2">{icon}</span>
          )}
          {children}
          {icon && iconPosition === 'right' && (
            <span className="ml-2">{icon}</span>
          )}
        </>
      )}
    </button>
  );
};

// Professional Analysis Form Component
export const ProfessionalAnalysisForm = ({
  title,
  description,
  inputConfig,
  onSubmit,
  loading = false,
  className = ''
}) => {
  const [formData, setFormData] = useState({});
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { showError, showWarning } = useNotifications();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear errors when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: [] }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    let isValid = true;

    Object.entries(inputConfig).forEach(([fieldName, config]) => {
      const value = formData[fieldName] || '';
      const validation = validateInput(value, config.validation || {});
      
      if (!validation.isValid) {
        newErrors[fieldName] = validation.errors;
        isValid = false;
      }
    });

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Rate limiting check
    const rateLimitKey = `analysis_${Date.now()}`;
    if (!rateLimiter.isAllowed(rateLimitKey, 5, 60000)) {
      const remainingTime = Math.ceil(rateLimiter.getRemainingTime(rateLimitKey, 60000) / 1000);
      showWarning(`Rate limit exceeded. Please wait ${remainingTime} seconds before submitting again.`);
      return;
    }

    if (!validateForm()) {
      showError('Please correct the errors in the form before submitting.');
      return;
    }

    setIsSubmitting(true);
    
    try {
      await onSubmit(formData);
    } catch (error) {
      showError('An error occurred while processing your request. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={`bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 ${className}`}>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          {title}
        </h2>
        {description && (
          <p className="text-gray-600 dark:text-gray-400">
            {description}
          </p>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {Object.entries(inputConfig).map(([fieldName, config]) => {
          const commonProps = {
            name: fieldName,
            value: formData[fieldName] || '',
            onChange: handleInputChange,
            disabled: loading || isSubmitting,
            ...config
          };

          if (config.type === 'select') {
            return (
              <ProfessionalSelect
                key={fieldName}
                {...commonProps}
              />
            );
          }

          return (
            <ProfessionalInput
              key={fieldName}
              {...commonProps}
            />
          );
        })}

        <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200 dark:border-gray-700">
          <ProfessionalButton
            type="button"
            variant="outline"
            disabled={loading || isSubmitting}
            onClick={() => setFormData({})}
          >
            Clear
          </ProfessionalButton>
          
          <ProfessionalButton
            type="submit"
            loading={loading || isSubmitting}
            disabled={loading || isSubmitting}
          >
            Execute Analysis
          </ProfessionalButton>
        </div>
      </form>
    </div>
  );
};

export default {
  ProfessionalInput,
  ProfessionalSelect,
  ProfessionalButton,
  ProfessionalAnalysisForm
};
