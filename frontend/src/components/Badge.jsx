import React from 'react';

const Badge = ({ variant = 'default', children, size = 'md' }) => {
  const variants = {
    default: 'bg-neutral-100 text-neutral-700',
    primary: 'bg-primary/10 text-primary',
    secondary: 'bg-secondary/10 text-secondary',
    success: 'bg-success/10 text-success',
    warning: 'bg-warning/10 text-warning',
    error: 'bg-error/10 text-error',
    info: 'bg-info/10 text-info',
    // Payment methods
    tunai: 'bg-payment-tunai/10 text-payment-tunai',
    bca: 'bg-payment-bca/10 text-payment-bca',
    qris: 'bg-payment-qris/10 text-payment-qris',
    bri: 'bg-payment-bri/10 text-payment-bri',
  };

  const sizes = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-1.5 text-sm',
    lg: 'px-4 py-2 text-base',
  };

  return (
    <span className={`inline-flex items-center font-medium rounded-full ${variants[variant]} ${sizes[size]}`}>
      {children}
    </span>
  );
};

export default Badge;
