import React from 'react';
import { TrendingDown, TrendingUp, Minus } from 'lucide-react';

export default function PriceVsLastRound({ currentPrice, lastRoundPrice, size = 'sm' }) {
  if (!lastRoundPrice || !currentPrice) return null;

  const difference = currentPrice - lastRoundPrice;
  const percentageChange = ((difference / lastRoundPrice) * 100).toFixed(1);
  const isDiscount = difference < 0;
  const isFlat = Math.abs(difference) < 0.01;

  const sizeClasses = {
    sm: { container: 'text-xs', icon: 'w-3 h-3' },
    md: { container: 'text-sm', icon: 'w-4 h-4' },
  };

  const classes = sizeClasses[size] || sizeClasses.sm;

  if (isFlat) {
    return (
      <div className={`flex items-center gap-1 text-zinc-500 ${classes.container}`}>
        <Minus className={classes.icon} />
        <span>At par</span>
      </div>
    );
  }

  return (
    <div className={`flex items-center gap-1 ${isDiscount ? 'text-emerald-400' : 'text-amber-400'} ${classes.container}`}>
      {isDiscount ? (
        <TrendingDown className={classes.icon} />
      ) : (
        <TrendingUp className={classes.icon} />
      )}
      <span className="font-medium">
        {Math.abs(parseFloat(percentageChange))}% {isDiscount ? 'discount' : 'premium'}
      </span>
    </div>
  );
}