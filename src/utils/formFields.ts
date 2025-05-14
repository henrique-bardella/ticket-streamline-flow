
import { CategoryFormFields, TicketCategory } from '../types';

// Define the form fields for each category
export const categoryFormFields: Record<TicketCategory, CategoryFormFields> = {
  'PADE': {
    solicitationNumber: {
      type: 'text',
      label: 'Solicitation Number',
      required: true,
      placeholder: 'Enter solicitation number'
    },
    agency: {
      type: 'text',
      label: 'Agency',
      required: true,
      placeholder: 'Enter agency'
    },
    accountNumber: {
      type: 'text',
      label: 'Account Number',
      required: true,
      placeholder: 'Enter account number'
    },
    clientName: {
      type: 'text',
      label: 'Client Name',
      required: true,
      placeholder: 'Enter client name'
    },
    clientDocument: {
      type: 'text',
      label: 'Client Document',
      required: true,
      placeholder: 'Enter client document'
    },
    businessUnit: {
      type: 'select',
      label: 'Business Unit',
      required: true,
      options: [
        { value: 'retail', label: 'Retail' },
        { value: 'corporate', label: 'Corporate' },
        { value: 'investment', label: 'Investment' }
      ]
    }
  },
  'META': {
    solicitationNumber: {
      type: 'text',
      label: 'Solicitation Number',
      required: true,
      placeholder: 'Enter solicitation number'
    },
    agency: {
      type: 'text',
      label: 'Agency',
      required: true,
      placeholder: 'Enter agency'
    },
    accountNumber: {
      type: 'text',
      label: 'Account Number',
      required: true,
      placeholder: 'Enter account number'
    },
    targetValue: {
      type: 'text',
      label: 'Target Value',
      required: true,
      placeholder: 'Enter target value'
    },
    period: {
      type: 'text',
      label: 'Period',
      required: true,
      placeholder: 'Enter period (MM/YYYY)'
    },
    justification: {
      type: 'textarea',
      label: 'Justification',
      required: true,
      placeholder: 'Enter justification for META adjustment'
    }
  },
  'ENCARTEIRAMENTO_POR_EXCECAO': {
    solicitationNumber: {
      type: 'text',
      label: 'Solicitation Number',
      required: true,
      placeholder: 'Enter solicitation number'
    },
    agency: {
      type: 'text',
      label: 'Agency',
      required: true,
      placeholder: 'Enter agency'
    },
    accountNumber: {
      type: 'text',
      label: 'Account Number',
      required: true,
      placeholder: 'Enter account number'
    },
    currentManager: {
      type: 'text',
      label: 'Current Manager',
      required: true,
      placeholder: 'Enter current manager name'
    },
    requestedManager: {
      type: 'text',
      label: 'Requested Manager',
      required: true,
      placeholder: 'Enter requested manager name'
    },
    reason: {
      type: 'select',
      label: 'Reason',
      required: true,
      options: [
        { value: 'relationship', label: 'Relationship Management' },
        { value: 'expertise', label: 'Sector Expertise' },
        { value: 'performance', label: 'Performance Issues' },
        { value: 'other', label: 'Other' }
      ]
    },
    additionalInfo: {
      type: 'textarea',
      label: 'Additional Information',
      required: false,
      placeholder: 'Enter any additional information'
    }
  }
};
